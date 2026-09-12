import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { once } from 'node:events';
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
 const qaCount=await page.evaluate(async()=>{
  const manifest=await (await fetch('data/asset_manifest.json',{cache:'no-store'})).json();
  return manifest.assets.filter(record=>record.status==='QA_PASS').length;
 });
 if(qaCount===0){
  assert.match(await page.textContent('[data-next-status]'),/生产素材尚未通过 QA/);
  assert.deepEqual(errors,[]);
  console.log('BLOCKED: next runtime correctly reports the intentional empty R1 release.');
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
