import assert from 'node:assert/strict';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { build, serve } from '../scripts/build.mjs';

const { chromium }=createRequire(import.meta.url)('playwright');
const server=serve(await build(),0);
await once(server,'listening');
let browser;
try{
 browser=await chromium.launch({headless:true,channel:'chrome'});
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.route('**/renderer-depth-test',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><title>Depth regression</title>'}));
 await page.goto(`http://127.0.0.1:${server.address().port}/renderer-depth-test`);
 // An isolated browser harness uses the production renderer and existing QA_PASS
 // vehicle/prop PNGs. No missing character art is substituted or promoted.
 await page.setContent('<base href="/"><style>body{margin:0;background:#142222;color:#eee;font:18px sans-serif}h1{font-size:20px;margin:16px}section{display:inline-block;width:50%}p{margin:8px 16px}canvas{width:640px;height:360px}</style><h1>Production renderer — depth regression / existing P0 assets only</h1><section><p>Vehicle behind barrel</p><canvas id="behind"></canvas></section><section><p>Vehicle in front of barrel</p><canvas id="front"></canvas></section>');
 const result=await page.evaluate(async()=>{
  const {createRenderer}=await import('/game/app/core/renderer.js');
  const {loadProductionAssets}=await import('/game/app/core/assets.js');
  const {loadSceneDefinition}=await import('/game/app/core/scene.js');
  const {createInitialState}=await import('/game/app/core/state.js');
  const assets=await loadProductionAssets('/data/asset_manifest.json');
  const source=await loadSceneDefinition('/data/rustport_scene.json','/data/asset_bindings.json');
  const definition=await (await fetch('/data/vehicles/rust_runner.json')).json();
  const outcomes=[];
  for(const [id,y] of [['behind',360],['front',430]]){
   const canvas=document.getElementById(id),ctx=canvas.getContext('2d');
   const order=[];
   const drawImage=ctx.drawImage.bind(ctx);
   ctx.drawImage=(image,...args)=>{order.push(image.src);drawImage(image,...args)};
   const scene=structuredClone(source);
   scene.objects.find(object=>object.id==='rustport_garage').position=[640,y];
   scene.objects.find(object=>object.id==='repair_barrel').position=[640,390];
   const state=createInitialState();
   state.rustport.starterTankReady=true;
   state.rustport.ironHoundDefeated=true;
   createRenderer(canvas,assets,{position:{x:640,y:360}},scene,definition,{hideIncompleteActors:true}).draw(state,0);
   const barrel=order.findIndex(path=>path.endsWith('/barrel_rust.png'));
   const chassis=order.findIndex(path=>path.endsWith('/rust_runner_chassis_s.png'));
   outcomes.push({id,barrel,chassis});
  }
  return outcomes;
 });
 for(const row of result){
  assert.ok(row.barrel>=0&&row.chassis>=0);
  assert.equal(row.chassis<row.barrel,row.id==='behind');
 }
 assert.deepEqual(errors,[]);
 await page.screenshot({path:fileURLToPath(new URL('../qa/runtime_previews/production_depth_order.png',import.meta.url))});
 const paving=await page.evaluate(async()=>{
  const {createRenderer}=await import('/game/app/core/renderer.js');
  const {loadProductionAssets}=await import('/game/app/core/assets.js');
  const {loadSceneDefinition}=await import('/game/app/core/scene.js');
  const {createInitialState}=await import('/game/app/core/state.js');
  const assets=await loadProductionAssets('/data/asset_manifest.json');
  const scene=await loadSceneDefinition('/data/rustport_scene.json','/data/asset_bindings.json');
  const vehicle=await (await fetch('/data/vehicles/rust_runner.json')).json();
  document.body.innerHTML='<p>Rustport paving study — existing P0 assets; incomplete actors hidden</p><canvas></canvas>';
  const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d');
  const draws=[],original=ctx.drawImage.bind(ctx);
  ctx.drawImage=(image,...args)=>{if(image.src.endsWith('/concrete_clean.png'))draws.push(args);original(image,...args)};
  const camera={position:{x:640,y:470}},state=createInitialState();
  state.rustport.starterTankReady=true;
  const renderer=createRenderer(canvas,assets,camera,scene,vehicle,{hideIncompleteActors:true});
  renderer.draw(state,0);const first=draws[0];draws.length=0;
  camera.position.x+=32;renderer.draw(state,0);const shifted=draws[0];
  camera.position.x-=32;renderer.draw(state,0);
  return {first,shifted};
 });
 assert.equal(paving.shifted[0],paving.first[0]-32,'paving stays anchored in world space');
 assert.equal(paving.shifted[1],paving.first[1]);
 assert.deepEqual(errors,[]);
 await page.screenshot({path:fileURLToPath(new URL('../qa/runtime_previews/rustport_paving_study.png',import.meta.url))});
 console.log('PASS: production renderer changes vehicle/barrel occlusion; real P0 asset screenshot saved.');
}finally{
 await browser?.close();
 await new Promise(resolve=>server.close(resolve));
}
