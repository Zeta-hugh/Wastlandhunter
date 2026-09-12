import assert from 'node:assert/strict';
import test from 'node:test';
import { createInitialState, normalizeState } from '../game/app/core/state.js';
import { createEntityManager } from '../game/app/core/world.js';

test('P0 state exposes independent progression and world interfaces',()=>{
 const state=normalizeState({inventory:{scrap:4},worldState:{iron_hound_dead:true,rustport_next_region_unlocked:true}});
 assert.equal(state.saveVersion,23);
 assert.equal(state.inventory.scrap,4);
 assert.equal(Object.hasOwn(state.worldState,'iron_hound_dead'),false);
 assert.equal(Object.hasOwn(state.worldState,'rustport_next_region_unlocked'),false);
 assert.equal(state.equipment.vehicle.mainGun,'cannon_75mm');
 assert.deepEqual(state.map.position,{x:640,y:470});
});

test('world entities retain collision, interaction and depth data',()=>{
 const manager=createEntityManager();
 manager.add({id:'rustport-gate',kind:'building',x:40,y:20,z:12,collision:{x:0,y:4,w:24,h:12},interaction:{x:-8,y:-8,w:40,h:32}});
 manager.add({id:'rustport-barrel',kind:'prop',x:40,y:30});
 assert.deepEqual(manager.visible().map(entity=>entity.id),['rustport-gate','rustport-barrel']);
 assert.throws(()=>manager.add({id:'rustport-barrel'}),/Duplicate world entity/);
});

test('initial state does not force faction membership',()=>{
 const state=createInitialState();
 assert.equal(state.worldState.faction,null);
});
