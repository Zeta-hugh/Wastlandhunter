import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { once } from 'node:events';
import { build, serve, root } from '../scripts/build.mjs';

const require=createRequire(import.meta.url);
const { chromium }=require('playwright');
const server=serve(await build(),0);
await once(server,'listening');
const out=resolve(root,'artifacts/rustport-v1');
await mkdir(out,{recursive:true});
let browser;
try{
 browser=await chromium.launch({headless:true,channel:'chrome'});
 const page=await browser.newPage({viewport:{width:960,height:540}});
 const errors=[];page.on('pageerror',e=>errors.push(e.stack||e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 await page.goto(`http://127.0.0.1:${server.address().port}/?debug=milestone_rust`);
 const qaCount=await page.evaluate(async()=>{
  const manifest=await (await fetch('data/asset_manifest.json',{cache:'no-store'})).json();
  return manifest.assets.filter(record=>record.status==='QA_PASS').length;
 });
 if(qaCount===0){
  assert.deepEqual(errors,[]);
  console.log('BLOCKED: Rustport visual capture awaits the intentional empty R1 release.');
 }else{
 await page.waitForFunction(()=>typeof RUSTPORT_VISUAL_VERSION!=='undefined'&&AssetRegistry.loaded&&AssetRegistry.bindingsLoaded&&RUSTPORT_GROUND.complete&&RUSTPORT_GROUND.naturalWidth===32);
 const bindingCheck=await page.evaluate(()=>({
  ground:AssetRegistry.resolve('rustport.ground').map(record=>record.asset_id),
  characters:AssetRegistry.resolve('characters.gameplay',{allowIncomplete:true}).map(record=>record.asset_id),
  chassis:AssetRegistry.resolve('rust_runner.chassis',{allowIncomplete:true}).map(record=>record.asset_id),
  tracks:AssetRegistry.resolve('rust_runner.tracks').map(record=>record.asset_id),
  turret:AssetRegistry.resolve('rust_runner.turret',{allowIncomplete:true}).map(record=>record.asset_id),
  bounty:AssetRegistry.resolve('rustport.bounty',{allowIncomplete:true}).map(record=>record.asset_id)
 }));
 assert.deepEqual(bindingCheck.ground,['ground_dirt_oily_01','concrete_clean','concrete_cracked','concrete_oily']);
 assert.equal(bindingCheck.characters.length,400);
 assert.ok(bindingCheck.characters.includes('protagonist_walk_s_00'));
 assert.ok(bindingCheck.characters.includes('liuyan_attack_e_05'));
 assert.ok(bindingCheck.characters.includes('taoyao_idle_n_00'));
 assert.ok(bindingCheck.characters.includes('lincheng_idle_s_00'));
 assert.equal(bindingCheck.chassis.length,8);
 assert.deepEqual(bindingCheck.tracks,['rust_runner_track_left','rust_runner_track_right']);
 assert.equal(bindingCheck.turret.length,16);
 assert.deepEqual(bindingCheck.bounty,['iron_hound_idle','iron_hound_attack','iron_hound_hurt','iron_hound_enraged','iron_hound_death']);
 const registryErrors=await page.evaluate(()=>{
  const messages=[];
  for(const id of ['missing_asset_for_qa','cannon_75mm'])try{AssetRegistry.get(id)}catch(error){messages.push(error.message)}
  return messages;
 });
 assert.match(registryErrors[0],/Unknown production asset_id/);
 const cannonStatus=await page.evaluate(()=>AssetRegistry.get('cannon_75mm',{allowIncomplete:true}).status);
 if(cannonStatus==='NEEDS_ART')assert.match(registryErrors[1],/NEEDS_ART, expected QA_PASS/);
 else assert.equal(cannonStatus,'QA_PASS');
 await page.waitForTimeout(700);
 await page.evaluate(()=>{if(dialogue)closeDialogue();toast.t=0;mode='play';$('shell').classList.remove('dialogue-mode');state.time=13;state.player.x=620;state.player.y=470;updateHud()});
 await page.waitForTimeout(150);
 await page.screenshot({path:resolve(out,'rustport-day.png')});
 const day=await page.evaluate(()=>Array.from(document.querySelector('#game').getContext('2d').getImageData(0,0,960,540).data).filter((_,i)=>i%4!==3).reduce((s,v)=>s+v,0));
 await page.evaluate(()=>{state.time=19.5;state.player.x=620;state.player.y=470});
 await page.waitForTimeout(150);
 await page.screenshot({path:resolve(out,'rustport-dusk.png')});
 const dusk=await page.evaluate(()=>Array.from(document.querySelector('#game').getContext('2d').getImageData(0,0,960,540).data).filter((_,i)=>i%4!==3).reduce((s,v)=>s+v,0));
 assert.notEqual(day,dusk,'Day and dusk rendering should differ');
 assert.deepEqual(errors,[]);
 console.log('PASS: Rustport production ground tile resolved through AssetRegistry, day/dusk rendered, no runtime or asset errors.');
 }
}finally{
 await browser?.close();
 await new Promise(resolve=>server.close(resolve));
}
