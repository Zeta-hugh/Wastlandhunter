const SCREEN_CENTER_X=640;
const SCREEN_CENTER_Y=360;
const GROUND_SCALE_Y=.58;

export function createProjection(camera){
 return {
  setCamera(x,y){camera.x=x;camera.y=y;},
  worldToScreen(x,y,z=0){
   return {
    x:SCREEN_CENTER_X+(x-camera.x),
    y:SCREEN_CENTER_Y+(y-camera.y)*GROUND_SCALE_Y-z
   };
  },
  groundDiamond(x,y,width=32,depth=32){
   const center=this.worldToScreen(x,y);
   const halfWidth=width/2;
   const halfDepth=depth*GROUND_SCALE_Y/2;
   return [
    [center.x-halfWidth,center.y],
    [center.x,center.y-halfDepth],
    [center.x+halfWidth,center.y],
    [center.x,center.y+halfDepth]
   ];
  }
 };
}
