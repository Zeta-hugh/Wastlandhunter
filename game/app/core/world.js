function footprint(value,fallback){
 return {
  x:Number.isFinite(value?.x)?value.x:fallback.x,
  y:Number.isFinite(value?.y)?value.y:fallback.y,
  w:Number.isFinite(value?.w)?value.w:fallback.w,
  h:Number.isFinite(value?.h)?value.h:fallback.h
 };
}

export function createWorldEntity(definition){
 return {
  id:definition.id,
  kind:definition.kind||'prop',
  position:{x:definition.x||0,y:definition.y||0,z:definition.z||0},
  collision:footprint(definition.collision,{x:0,y:0,w:0,h:0}),
  interaction:footprint(definition.interaction,{x:0,y:0,w:0,h:0}),
  renderDepth:Number.isFinite(definition.renderDepth)?definition.renderDepth:definition.y||0,
  visible:definition.visible!==false
 };
}

export function createEntityManager(){
 const entities=new Map();
 return {
  add(definition){
   if(!definition?.id)throw new Error('World entity requires a stable id');
   if(entities.has(definition.id))throw new Error(`Duplicate world entity: ${definition.id}`);
   const entity=createWorldEntity(definition);entities.set(entity.id,entity);return entity;
  },
  get(id){return entities.get(id)},
  remove(id){return entities.delete(id)},
  visible(){return [...entities.values()].filter(entity=>entity.visible).sort((a,b)=>a.renderDepth-b.renderDepth)},
  clear(){entities.clear()}
 };
}
