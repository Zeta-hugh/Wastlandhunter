export function createCamera({x=640,y=360,followRate=8,lookAhead=48,bounds={}}={}){
 const position={x,y};
 function update(target,axes,dt){
  const desiredX=target.x+(axes.x||0)*lookAhead;
  const desiredY=target.y+(axes.y||0)*lookAhead;
  const factor=1-Math.exp(-followRate*dt);
  position.x+=((bounds.minX===undefined?desiredX:Math.max(bounds.minX,Math.min(bounds.maxX,desiredX)))-position.x)*factor;
  position.y+=((bounds.minY===undefined?desiredY:Math.max(bounds.minY,Math.min(bounds.maxY,desiredY)))-position.y)*factor;
  return position;
 }
 return {position,update};
}
