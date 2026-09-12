export function createInteractionResolver(targets){
 return {
  nearest(position){
   return targets
    .map(target=>({...target,distance:Math.hypot(position.x-target.x,position.y-target.y)}))
    .filter(target=>target.distance<=target.radius)
    .sort((a,b)=>a.distance-b.distance)[0]||null;
  }
 };
}
