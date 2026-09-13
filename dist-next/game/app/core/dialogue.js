export function createDialogueManager(state,definition){
 return {
  resolve(id){
   const entry=definition.entries[id];
   if(!entry)throw new Error(`Dialogue entry not found: ${id}`);
   return entry;
  },
  applyEffects(effects=[]){
   for(const effect of effects){
    const match=/^set:([a-zA-Z0-9_.]+)=(true|false|-?\d+|[A-Z_]+)$/.exec(effect);
    if(!match)throw new Error(`Unsupported dialogue effect: ${effect}`);
    const path=match[1].split('.');let target=state;
    if(path[0]==='worldState'&&!Object.hasOwn(state.worldState,path[1]))throw new Error(`Unregistered world-state key: ${path.slice(1).join('.')}`);
    for(const key of path.slice(0,-1))target=target[key]??={};
    target[path.at(-1)]=match[2]==='true'?true:match[2]==='false'?false:/^-?\d+$/.test(match[2])?Number(match[2]):match[2];
   }
  }
 };
}
