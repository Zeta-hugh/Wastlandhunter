function findPart(id){for(const type of PART_TYPES){const p=PARTS[type].find(x=>x.id===id);if(p)return{...p,type}}return null}
function chapterPart(type,i){return PARTS[type][Math.min(i,PARTS[type].length-1)]}

