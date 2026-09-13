import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { build, serve } from '../scripts/build.mjs';

const require=createRequire(import.meta.url);
const { chromium }=require('playwright');
const server=serve(await build(),0);
await once(server,'listening');
let browser;
try{
 browser=await chromium.launch({headless:true,channel:'chrome'});
 const context=await browser.newContext({viewport:{width:960,height:540},storageState:{cookies:[],origins:[]},});
 const page=await context.newPage();
 const errors=[];
 page.on('pageerror',error=>errors.push(error.stack||error.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/next.html?test=1`);
 await page.waitForSelector('[data-next-status]');
 const productionReady=await page.evaluate(async()=>{
  const manifest=await (await fetch('data/asset_manifest.json',{cache:'no-store'})).json();
  const required=[
   'ground_dirt_oily_01','concrete_clean','concrete_cracked','concrete_oily',
   'awning_canvas_beige','barrel_rust','rust_runner_chassis_s',
   'rust_runner_track_left','rust_runner_track_right','rust_runner_turret_00','cannon_75mm',
   'protagonist_idle_s_00','liuyan_idle_s_00','iron_hound_idle',
   'iron_hound_hurt','iron_hound_enraged','iron_hound_death'
  ];
  const byId=new Map(manifest.assets.map(record=>[record.asset_id,record]));
  return required.every(assetId=>byId.get(assetId)?.status==='QA_PASS');
 });
 if(!productionReady){
  assert.match(await page.textContent('[data-next-status]'),/生产素材尚未通过 QA/);
  assert.deepEqual(errors,[]);
  const p0Context=await browser.newContext({viewport:{width:960,height:540},storageState:{cookies:[],origins:[]}});
  const p0Page=await p0Context.newPage();
  const p0Errors=[];
  const consoleErrors=[];
  const failedRequests=[];
  p0Page.on('pageerror',error=>p0Errors.push(error.stack||error.message));
  p0Page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text())});
  p0Page.on('requestfailed',request=>failedRequests.push(`${request.url()} ${request.failure()?.errorText||''}`));
  await p0Page.goto(`http://127.0.0.1:${server.address().port}/next.html?test=1&p0-assets=1`);
  try{
   await p0Page.waitForFunction(()=>globalThis.__NEXT_TEST__&&document.querySelector('[data-next-status]')?.textContent.includes('P0 素材运行时检查'),null,{timeout:20000});
  }catch(error){
   const status=await p0Page.textContent('[data-next-status]');
   throw new Error(`P0 runtime preview did not boot; status=${status}; pageErrors=${p0Errors.join(' | ')}; consoleErrors=${consoleErrors.join(' | ')}; failedRequests=${failedRequests.join(' | ')}`,{cause:error});
  }
  await p0Page.waitForTimeout(1500);
  await p0Page.screenshot({path:fileURLToPath(new URL('../qa/runtime_previews/rustport_p0_runtime_integration.png',import.meta.url))});
  assert.deepEqual(p0Errors,[]);
  await p0Context.close();
  console.log('BLOCKED: the complete next runtime still needs out-of-batch art; P0 assets rendered through production pivots and mounts.');
 }else{
 await page.keyboard.down('ArrowRight');
 await page.waitForTimeout(120);
 await page.keyboard.up('ArrowRight');
 await page.keyboard.down('ArrowLeft');
 await page.waitForTimeout(1100);
 await page.keyboard.up('ArrowLeft');
 await page.dispatchEvent('[data-next-action="confirm"]','pointerdown',{pointerId:1,pointerType:'touch'});
 await page.dispatchEvent('[data-next-action="confirm"]','pointerup',{pointerId:1,pointerType:'touch'});
 await page.waitForTimeout(30);
 assert.match(await page.textContent('[data-next-status]'),/柳焰/);
 await page.evaluate(()=>{__NEXT_TEST__.state.rustport.liuyanMet=true;__NEXT_TEST__.state.player.x=900;__NEXT_TEST__.state.player.y=470;__NEXT_TEST__.interact()});
 await page.waitForTimeout(30);
 assert.match(await page.textContent('[data-next-status]'),/战车修复完成/);
 await page.evaluate(()=>{__NEXT_TEST__.state.player.x=640;__NEXT_TEST__.state.player.y=260});
 for(let hit=0;hit<3;hit++){
  await page.evaluate(()=>__NEXT_TEST__.interact());
  await page.waitForTimeout(30);
 }
 assert.match(await page.textContent('[data-next-status]'),/已击败/);
 assert.deepEqual(errors,[]);
 console.log('PASS: next runtime loads, accepts touch/keyboard input, and renders shared Rustport state.');
 }
}finally{
 await browser?.close();
 await new Promise(resolve=>server.close(resolve));
}
