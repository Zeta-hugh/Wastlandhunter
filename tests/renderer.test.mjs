import assert from 'node:assert/strict';
import test from 'node:test';
import { createRenderer } from '../game/app/core/renderer.js';
import { createInitialState } from '../game/app/core/state.js';
import { createProjection } from '../game/app/core/projection.js';
import { readFileSync } from 'node:fs';

test('player sprite follows world position independently of camera movement',t=>{
 const originalListener=Object.getOwnPropertyDescriptor(globalThis,'addEventListener');
 globalThis.addEventListener=()=>{};
 t.after(()=>{
  if(originalListener)Object.defineProperty(globalThis,'addEventListener',originalListener);
  else delete globalThis.addEventListener;
 });
 const draws=[];
 const ctx={
  setTransform(){},fillRect(){},createPattern(){return {}},beginPath(){},ellipse(){},fill(){},fillText(){},
  drawImage(image,...coordinates){draws.push({image,coordinates})}
 };
 const canvas={getContext(){return ctx}};
 const playerRecord={pivot:[24,68],runtime_size:[48,72]};
 const assets={get(id){return id},record(id){return id.startsWith('protagonist_')?playerRecord:{pivot:[24,68],runtime_size:[48,72]}}};
 const camera={position:{x:640,y:360}};
 const renderer=createRenderer(canvas,assets,camera);
 const state=createInitialState();
 for(const [x,y,cameraX,cameraY] of [[640,470,640,360],[720,520,640,360],[720,520,690,480]]){
  state.player.x=x;state.player.y=y;
  camera.position.x=cameraX;camera.position.y=cameraY;
  draws.length=0;
  renderer.draw(state,0);
  const player=draws.find(draw=>draw.image==='protagonist_idle_s_00');
  const foot=createProjection(camera.position).worldToScreen(x,y);
  assert.deepEqual(player.coordinates,[foot.x-playerRecord.pivot[0],foot.y-playerRecord.pivot[1]]);
 }
 // Metadata controls the anchor; the renderer must not assume bottom-center.
 playerRecord.pivot=[20,64];
 for(const facing of ['n','ne','e','se','s','sw','w','nw']){
  state.player.facing=facing;
  draws.length=0;
  renderer.draw(state,0);
  const player=draws.find(draw=>draw.image===`protagonist_idle_${facing}_00`);
  const foot=createProjection(camera.position).worldToScreen(state.player.x,state.player.y);
  assert.deepEqual(player.coordinates,[foot.x-20,foot.y-64]);
 }
});

test('world depth changes occlusion while elevation leaves ground shadows unchanged',t=>{
 const original=Object.getOwnPropertyDescriptor(globalThis,'addEventListener');
 globalThis.addEventListener=()=>{};
 t.after(()=>{if(original)Object.defineProperty(globalThis,'addEventListener',original);else delete globalThis.addEventListener});
 const draws=[],shadows=[];
 const ctx={setTransform(){},fillRect(){},createPattern(){return {}},beginPath(){},fill(){},fillText(){},
  ellipse(...args){shadows.push(args)},drawImage(image,...coordinates){draws.push({image,coordinates})}};
 const scene=JSON.parse(readFileSync(new URL('../data/rustport_scene.json',import.meta.url)));
 const before=JSON.stringify(scene);
 const assets={get(id){return id},record(){return {pivot:[24,68],runtime_size:[48,72]}}};
 const camera={position:{x:640,y:360}};
 const renderer=createRenderer({getContext(){return ctx}},assets,camera,scene);
 const state=createInitialState();
 const index=id=>draws.findIndex(draw=>draw.image===id);
 for(const [y,behind] of [[450,true],[550,false]]){
  state.player.y=y;draws.length=0;renderer.draw(state,0);
  assert.equal(index('protagonist_idle_s_00')<index('barrel_rust'),behind);
 }
 assert.equal(JSON.stringify(scene),before,'drawing must not mutate spatial/collision metadata');
 state.rustport.starterTankReady=true;
 const hound=scene.objects.find(object=>object.id==='iron_hound_bounty');
 state.player.y=300;
 draws.length=0;shadows.length=0;renderer.draw(state,0);
 const originalHound=draws[index('iron_hound_idle')];
 assert.ok(index('iron_hound_idle')<index('protagonist_idle_s_00'));
 const houndGround=createProjection(camera.position).worldToScreen(...hound.position);
 assert.ok(shadows.some(shadow=>shadow[0]===houndGround.x&&shadow[1]===houndGround.y-3));
 hound.z_height=100;
 draws.length=0;shadows.length=0;renderer.draw(state,0);
 assert.ok(index('iron_hound_idle')>index('protagonist_idle_s_00'));
 assert.equal(draws[index('iron_hound_idle')].coordinates[1],originalHound.coordinates[1]-100);
 assert.ok(shadows.some(shadow=>shadow[0]===houndGround.x&&shadow[1]===houndGround.y-3));
 const components=['rust_runner_track_left','rust_runner_track_right','rust_runner_chassis_s','rust_runner_turret_00','cannon_75mm'];
 assert.deepEqual(draws.slice(index(components[0]),index(components[0])+components.length).map(draw=>draw.image),components);
 const firstOrder=draws.map(draw=>draw.image);
 draws.length=0;renderer.draw(state,0);
 assert.deepEqual(draws.map(draw=>draw.image),firstOrder,'equal-depth ordering remains stable');
});
