export function createQuestManager(state,definitions){
 const quests=state.quests;
 function get(id){return quests[id]||{status:definitions[id].status||'LOCKED',objectiveIndex:0,progress:0};}
 function current(id){const quest=definitions[id];const progress=get(id);return quest.objectives[progress.objectiveIndex];}
 function start(id){const progress=get(id);if(progress.status==='AVAILABLE')progress.status='ACTIVE';quests[id]=progress;return progress;}
 function advance(id,objectiveId){
  const definition=definitions[id];const progress=start(id);const objective=current(id);
  if(!objective||objective.id!==objectiveId)return false;
  progress.objectiveIndex++;
  progress.progress=0;
  progress.status=progress.objectiveIndex>=definition.objectives.length?'COMPLETED':'ACTIVE';
  quests[id]=progress;
  return true;
 }
 return {get,current,start,advance};
}
