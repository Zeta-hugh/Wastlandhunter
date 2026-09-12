const ID_FIELDS=['character_id','boss_id','vehicle_id','weapon_id','map_id','quest_id','npc_id','item_id'];

function freezeDefinition(value){
 if(!value||typeof value!=='object'||Object.isFrozen(value))return value;
 Object.freeze(value);
 for(const child of Object.values(value)){
  if(child&&typeof child==='object')freezeDefinition(child);
 }
 return value;
}

export async function loadDefinition(path,id){
 const response=await fetch(path,{cache:'no-store'});
 if(!response.ok)throw new Error(`Definition load failed: ${path} (${response.status})`);
 const definition=await response.json();
 const field=ID_FIELDS.find(key=>definition[key]!==undefined);
 if(!field)throw new Error(`Definition has no stable id: ${path}`);
 if(id&&definition[field]!==id)throw new Error(`Definition id mismatch: expected ${id}, got ${definition[field]}`);
 return freezeDefinition(definition);
}

export function createDefinitionRegistry(fetcher=loadDefinition){
 const cache=new Map();
 return {
  async get(path,id){
   const key=`${path}#${id||''}`;
    if(!cache.has(key))cache.set(key,Promise.resolve(fetcher(path,id)).then(freezeDefinition));
   return cache.get(key);
  },
  clear(){cache.clear()}
 };
}
