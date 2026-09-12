function overlapsCircleRect(x,y,r,rect){
 const closestX=Math.max(rect.x,Math.min(x,rect.x+rect.w));
 const closestY=Math.max(rect.y,Math.min(y,rect.y+rect.h));
 return Math.hypot(x-closestX,y-closestY)<r;
}

export function createMovementController({minX=80,maxX=1200,minY=220,maxY=640,radius=18,speed=180,acceleration=720,deceleration=960,obstacles=[]}={}){
 const velocity={x:0,y:0};
 function blocked(x,y){return obstacles.some(rect=>overlapsCircleRect(x,y,radius,rect))}
 function move(position,axes,dt){
  const magnitude=Math.hypot(axes.x,axes.y);
  const targetX=magnitude?axes.x/magnitude*speed:0;
  const targetY=magnitude?axes.y/magnitude*speed:0;
  const rate=magnitude?acceleration:deceleration;
  const step=rate*dt;
  velocity.x+=Math.max(-step,Math.min(step,targetX-velocity.x));
  velocity.y+=Math.max(-step,Math.min(step,targetY-velocity.y));
  const dx=velocity.x*dt;
  const dy=velocity.y*dt;
  let x=Math.max(minX,Math.min(maxX,position.x+dx));
  let y=Math.max(minY,Math.min(maxY,position.y+dy));
  if(blocked(x,y)){x=position.x;velocity.x=0}
  if(blocked(x,y)){y=position.y;velocity.y=0}
  return {x,y};
 }
 return {move,blocked,velocity};
}
