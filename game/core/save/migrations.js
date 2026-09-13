const LEGACY_SAVE_VERSION=23;
export const CURRENT_SAVE_VERSION=24;
export const SAVE_SCHEMA_VERSION='1.0';

function clone(value){
 return value===undefined?undefined:JSON.parse(JSON.stringify(value));
}

function assertEnvelope(value){
 if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('SaveData must be an object');
 if(!Number.isInteger(value.saveVersion))throw new Error('SaveData.saveVersion must be an integer');
 if(!value.state||typeof value.state!=='object'||Array.isArray(value.state))throw new Error('SaveData.state must be an object');
}

function migrate23To24(legacy){
 const state=clone(legacy.state);
 const worldState={faction:null,...(state.worldState&&typeof state.worldState==='object'?state.worldState:{})};
 delete worldState.iron_hound_dead;
 delete worldState.rustport_next_region_unlocked;
 delete worldState.rustport_bounty_claimed;
 return {
  schema_version:SAVE_SCHEMA_VERSION,
  saveVersion:CURRENT_SAVE_VERSION,
  migratedFrom:LEGACY_SAVE_VERSION,
  state:{...state,worldState}
 };
}

export function migrateSave(value){
 assertEnvelope(value);
 if(value.saveVersion>CURRENT_SAVE_VERSION)throw new Error(`Unsupported future saveVersion: ${value.saveVersion}`);
 if(value.saveVersion===CURRENT_SAVE_VERSION){
  if(value.schema_version!==SAVE_SCHEMA_VERSION)throw new Error(`Unsupported save schema: ${value.schema_version||'missing'}`);
  return clone(value);
 }
 if(value.saveVersion===LEGACY_SAVE_VERSION)return migrate23To24(value);
 throw new Error(`No migration registered for saveVersion ${value.saveVersion}`);
}
