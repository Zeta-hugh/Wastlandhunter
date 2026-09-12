import { SAVE_KEY, SCENE_RUSTPORT } from './constants.js';

export function createInitialState(){
 return {
  saveVersion:1,
  version:1,
  scene:SCENE_RUSTPORT,
  player:{x:640,y:470,hp:100,maxHp:100,facing:'s'},
  rustport:{arrivalSeen:false,liuyanMet:false,starterTankReady:false,ironHoundDefeated:false,combatHits:0,lastAction:'none',actionUntil:0},
  inventory:{gold:700,scrap:12},
  equipment:{character:{weapon:null,head:null,body:null,accessory:null},vehicle:{mainGun:'cannon_75mm',subGun:null,se:null,engine:null,cUnit:null,armor:null,accessory:null}},
  vehicles:[],
  quests:{},
  worldState:{faction:null},
  relationships:{liuyan:0,taoyao:0,lincheng:0},
  hunterRank:0,
  townReputation:{rustport:0},
  map:{id:SCENE_RUSTPORT,position:{x:640,y:470}},
  playTime:0,
  updatedAt:0
 };
}

export function normalizeState(value){
 const base=createInitialState();
 if(!value||typeof value!=='object')return base;
 return {
  ...base,...value,
  player:{...base.player,...value.player},
  rustport:{...base.rustport,...value.rustport},
  inventory:{...base.inventory,...value.inventory},
  equipment:{...base.equipment,...value.equipment,character:{...base.equipment.character,...value.equipment?.character},vehicle:{...base.equipment.vehicle,...value.equipment?.vehicle}},
  vehicles:Array.isArray(value.vehicles)?value.vehicles:base.vehicles,
  quests:{...base.quests,...value.quests},
  worldState:{...base.worldState,...value.worldState},
  relationships:{...base.relationships,...value.relationships},
  townReputation:{...base.townReputation,...value.townReputation},
  map:{...base.map,...value.map,position:{...base.map.position,...value.map?.position}},
  saveVersion:1,
  version:1
 };
}

export function createStorage(storage=globalThis.localStorage){
 return {
  load(){
   try{
    const raw=storage?.getItem(SAVE_KEY);
    return raw?normalizeState(JSON.parse(raw)):createInitialState();
   }catch(error){
    console.error('Next runtime save load failed',error);
    return createInitialState();
   }
  },
  save(state){
   const next=normalizeState({...state,updatedAt:Date.now()});
   try{storage?.setItem(SAVE_KEY,JSON.stringify(next));return next}
   catch(error){console.error('Next runtime save failed',error);throw error}
  }
 };
}
