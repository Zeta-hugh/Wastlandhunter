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
 await page.waitForFunction(()=>typeof RUSTPORT_VISUAL_VERSION!=='undefined'&&AssetRegistry.loaded&&RUSTPORT_GROUND.complete&&RUSTPORT_GROUND.naturalWidth===32);
 const registryErrors=await page.evaluate(()=>{
  const messages=[];
  for(const id of ['missing_asset_for_qa','cannon_75mm'])try{AssetRegistry.get(id)}catch(error){messages.push(error.message)}
  return messages;
 });
 assert.match(registryErrors[0],/Unknown production asset_id/);
 assert.match(registryErrors[1],/NEEDS_ART, expected QA_PASS/);
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
}finally{
 await browser?.close();
 await new Promise(resolve=>server.close(resolve));
}
