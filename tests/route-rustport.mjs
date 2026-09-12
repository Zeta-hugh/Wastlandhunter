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
 const page=await browser.newPage({viewport:{width:960,height:540}});
 const errors=[];
 page.on('pageerror',error=>errors.push(error.stack||error.message));
 page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`)});
 await page.goto(`http://127.0.0.1:${server.address().port}/?route=rustport`);
 await page.waitForFunction(()=>typeof state!=='undefined'&&typeof enterTown==='function'&&typeof startBattle==='function');
 await page.evaluate(()=>{
  closeDialogue();
  mode='play';
  state.scene='world';
  state.townProgress[0].arrived=false;
  state.v12=Object.assign(state.v12||{},{originComplete:true,starterRepaired:true,tankUnlocked:true});
  state.party.liuyan=true;
  enterTown(0);
  closeDialogue();
  mode='play';
 });
 assert.deepEqual(await page.evaluate(()=>[state.scene,state.townIndex,state.townProgress[0].arrived]),['town',0,true]);
 await page.evaluate(()=>{enterInterior('garage');closeDialogue();mode='play'});
 assert.equal(await page.evaluate(()=>state.scene),'interior');
 await page.evaluate(()=>{leaveInterior();mode='play'});
 assert.equal(await page.evaluate(()=>state.scene),'town');
 await page.evaluate(()=>{
  state.player.inTank=true;
  state.tank.hp=tankMax();
  startBattle({name:'铁牙猎犬',hp:1,atk:1,boss:true,reward:100,town:0});
  Math.random=()=>0.5;
  battle.sel=0;
  battleConfirm();
 });
 assert.equal(await page.evaluate(()=>battle.win),true);
 await page.evaluate(()=>{endBattle();state.townProgress[0].boss=true;saveSilently()});
 assert.deepEqual(await page.evaluate(()=>[state.scene,state.townProgress[0].boss,state.party.liuyan]),['town',true,true]);
 assert.deepEqual(errors,[]);
 console.log('PASS: Rustport route state covers arrival, garage return, Iron Hound victory and persisted bounty state.');
}finally{
 await browser?.close();
 await new Promise(resolve=>server.close(resolve));
}
