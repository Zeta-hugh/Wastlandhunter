import assert from 'node:assert/strict';
import test from 'node:test';
import { createInitialState } from '../game/app/core/state.js';
import { createQuestManager } from '../game/app/core/quest.js';
import { createDialogueManager } from '../game/app/core/dialogue.js';
import { createBountyManager } from '../game/app/core/bounty.js';
import { createDefinitionRegistry, loadDefinition } from '../game/app/core/definitions.js';

const quest={
 status:'AVAILABLE',
 objectives:[
  {id:'meet',type:'talk',target:'liuyan'},
  {id:'kill',type:'kill',target:'iron_hound'},
  {id:'claim',type:'talk',target:'liuyan'}
 ],
 rewards:{gold:350,scrap:8,hunterRank:1}
};
const dialogue={entries:{intro:{speaker:'柳焰',text:'去车库。',effects:['set:rustport.liuyanMet=true']}}};

test('Rustport data route advances objectives and claims bounty once',()=>{
 const state=createInitialState();
 const quests=createQuestManager(state,{rustport_first_bounty:quest});
 const dialogueManager=createDialogueManager(state,dialogue);
 let claimed=false;
 const bounty=createBountyManager(state,{reward:quest.rewards},{isClaimed:()=>claimed});
 quests.start('rustport_first_bounty');
 dialogueManager.applyEffects(dialogueManager.resolve('intro').effects);
 assert.equal(state.rustport.liuyanMet,true);
 assert.equal(quests.advance('rustport_first_bounty','meet'),true);
 assert.equal(quests.advance('rustport_first_bounty','kill'),true);
 state.rustport.ironHoundDefeated=true;
 assert.equal(bounty.claim(),true);
 claimed=true;
 assert.equal(bounty.claim(),false);
 assert.deepEqual([state.inventory.gold,state.inventory.scrap,state.hunterRank],[1050,20,1]);
});

test('dialogue adapter rejects unregistered world-state writes',()=>{
 const state=createInitialState();
 const dialogueManager=createDialogueManager(state,{entries:{bad:{effects:['set:worldState.iron_hound_dead=true']}}});
 assert.throws(()=>dialogueManager.applyEffects(dialogueManager.resolve('bad').effects),/Unregistered world-state key/);
});

test('definition loading freezes nested content while state remains mutable',async()=>{
 const originalFetch=globalThis.fetch;
 globalThis.fetch=async()=>new Response(JSON.stringify({
  quest_id:'quest.rustport.first_bounty',
  objectives:[{id:'meet',target:'npc.liuyan'}]
 }));
 try{
  const definition=await loadDefinition('data/quests/rustport.json','quest.rustport.first_bounty');
  assert.equal(Object.isFrozen(definition),true);
  assert.equal(Object.isFrozen(definition.objectives),true);
  assert.equal(Object.isFrozen(definition.objectives[0]),true);
  assert.throws(()=>{definition.objectives[0].target='npc.other'},TypeError);
 }finally{
  globalThis.fetch=originalFetch;
 }
});

test('definition loading recognizes Rustport dialogue and bounty ids',async()=>{
 const originalFetch=globalThis.fetch;
 const definitions={
  'data/dialogue/rustport.json':{dialogue_id:'rustport_intro',entries:{}},
  'data/bounties/iron_hound.json':{bounty_id:'iron_hound',reward:{gold:350}}
 };
 globalThis.fetch=async path=>new Response(JSON.stringify(definitions[path]));
 try{
  const dialogueDefinition=await loadDefinition('data/dialogue/rustport.json','rustport_intro');
  const bountyDefinition=await loadDefinition('data/bounties/iron_hound.json','iron_hound');
  assert.equal(dialogueDefinition.dialogue_id,'rustport_intro');
  assert.equal(bountyDefinition.bounty_id,'iron_hound');
 }finally{
  globalThis.fetch=originalFetch;
 }
});

test('definition registry keeps custom loader results read-only',async()=>{
 const registry=createDefinitionRegistry(async()=>({bounty_id:'bounty.iron_hound',reward:{gold:350}}));
 const definition=await registry.get('data/bounties/iron_hound.json','bounty.iron_hound');
 assert.equal(Object.isFrozen(definition),true);
 assert.equal(Object.isFrozen(definition.reward),true);
 assert.throws(()=>{definition.reward.gold=0},TypeError);
});

test('definition freezing handles null, arrays, and empty objects',async()=>{
 const values=[null,[],{}];
 for(const value of values){
  const registry=createDefinitionRegistry(async()=>value);
  const definition=await registry.get('test-definition.json','test.id');
  assert.equal(definition,value);
  if(value&&typeof value==='object')assert.equal(Object.isFrozen(value),true);
 }
});

test('definition registry caches the same frozen object',async()=>{
 let loads=0;
 const registry=createDefinitionRegistry(async()=>{
  loads++;
  return {quest_id:'quest.rustport.first_bounty',objectives:[]};
 });
 const first=await registry.get('quest.json','quest.rustport.first_bounty');
 const second=await registry.get('quest.json','quest.rustport.first_bounty');
 assert.equal(first,second);
 assert.equal(loads,1);
 assert.equal(Object.isFrozen(first),true);
});

test('definition freezing does not freeze runtime state',()=>{
 const state=createInitialState();
 assert.equal(Object.isFrozen(state),false);
 assert.equal(Object.isFrozen(state.rustport),false);
 state.rustport.arrivalSeen=true;
 assert.equal(state.rustport.arrivalSeen,true);
});

test('definition loading and registry loader errors propagate',async()=>{
 const originalFetch=globalThis.fetch;
 globalThis.fetch=async()=>new Response('not found',{status:404});
 try{
  await assert.rejects(
   loadDefinition('missing-definition.json','quest.rustport.missing'),
   /Definition load failed: missing-definition\.json \(404\)/
  );
 }finally{
  globalThis.fetch=originalFetch;
 }

 const expected=new Error('loader failed');
 const registry=createDefinitionRegistry(async()=>{throw expected});
 await assert.rejects(registry.get('broken.json','quest.broken'),error=>error===expected);
});
