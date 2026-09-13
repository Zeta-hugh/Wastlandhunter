import assert from 'node:assert/strict';
import test from 'node:test';
import { CURRENT_SAVE_VERSION, migrateSave } from '../game/core/save/migrations.js';

test('canonical save migration removes deprecated world-state keys',()=>{
 const migrated=migrateSave({
  saveVersion:23,
  state:{worldState:{faction:null,iron_hound_dead:true},marker:'preserved'}
 });
 assert.equal(migrated.saveVersion,CURRENT_SAVE_VERSION);
 assert.equal(migrated.migratedFrom,23);
 assert.equal(migrated.state.marker,'preserved');
 assert.deepEqual(migrated.state.worldState,{faction:null});
});

test('save migration rejects future and unknown versions',()=>{
 assert.throws(
  ()=>migrateSave({saveVersion:CURRENT_SAVE_VERSION+1,state:{}}),
  /Unsupported future saveVersion/
 );
 assert.throws(
  ()=>migrateSave({saveVersion:22,state:{}}),
  /No migration registered/
 );
});
