import { LOGICAL_HEIGHT, LOGICAL_WIDTH } from './constants.js';
import { createProjection } from './projection.js';

export function createRenderer(canvas,assets,camera,scene={objects:[]},vehicleDefinition={},options={}){
 const ctx=canvas.getContext('2d');
 const projection=createProjection(camera.position);
 const sceneObject=id=>scene.objects.find(object=>object.id===id)||{position:[0,0],z_height:0};
 const drawAtPivot=(assetId,x,y)=>{
  const image=assets.get(assetId);
  const [pivotX,pivotY]=assets.record(assetId).pivot;
  ctx.drawImage(image,x-pivotX,y-pivotY);
 };
 function resize(){
  const dpr=Math.min(globalThis.devicePixelRatio||1,2);
  canvas.width=Math.round(LOGICAL_WIDTH*dpr);canvas.height=Math.round(LOGICAL_HEIGHT*dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.imageSmoothingEnabled=false;
 }
 resize();addEventListener('resize',resize,{passive:true});addEventListener('orientationchange',resize,{passive:true});
 return {
  draw(state,now=performance.now()){
   const {x,y}=camera.position;
   projection.setCamera(x,y);
   ctx.fillStyle='#111817';ctx.fillRect(0,0,LOGICAL_WIDTH,LOGICAL_HEIGHT);
   const ground=assets.get('ground_dirt_oily_01');
   const pattern=ctx.createPattern(ground,'repeat');
   ctx.fillStyle=pattern;ctx.fillRect(0,0,LOGICAL_WIDTH,LOGICAL_HEIGHT);
   ctx.fillStyle='#1d3537';ctx.fillRect(0,0,LOGICAL_WIDTH,96);
   const roadTile=(tx,ty)=>{
    const variation=Math.abs(tx*17+ty*31)%12;
    return variation===0?'concrete_cracked':variation===6?'concrete_oily':'concrete_clean';
   };
   for(let ty=-8;ty<=8;ty++)for(let tx=-12;tx<=12;tx++){
    const tile=assets.get(roadTile(tx,ty));
    const center=projection.worldToScreen(x+tx*32,y+ty*32);
    ctx.drawImage(tile,Math.round(center.x-16),Math.round(center.y-10),32,20);
   }
   const sprite=(assetId,ex,ey,width,height)=>{
    const point=projection.worldToScreen(ex,ey);
    ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(point.x,point.y-3,width*.36,7,0,0,Math.PI*2);ctx.fill();
    ctx.drawImage(assets.get(assetId),point.x-width/2,point.y-height,width,height);
   };
   const vehicle=(ex,ey)=>{
    const point=projection.worldToScreen(ex,ey),sx=point.x,sy=point.y;
    const vehiclePivot=vehicleDefinition.pivot||assets.record('rust_runner_chassis_s').pivot;
    const mainGunMount=vehicleDefinition.mounts?.main_gun||[64,60];
    const mountX=sx-vehiclePivot[0]+mainGunMount[0];
    const mountY=sy-vehiclePivot[1]+mainGunMount[1];
    ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(sx,sy-3,42,10,0,0,Math.PI*2);ctx.fill();
    drawAtPivot('rust_runner_track_left',sx,sy);
    drawAtPivot('rust_runner_track_right',sx,sy);
    drawAtPivot('rust_runner_chassis_s',sx,sy);
    drawAtPivot('rust_runner_turret_00',mountX,mountY);
    drawAtPivot('cannon_75mm',mountX,mountY);
   };
   const entity=(ex,ey,w,h,fill,label)=>{
    const point=projection.worldToScreen(ex,ey),sx=point.x,sy=point.y;
    ctx.fillStyle=fill;ctx.fillRect(sx-w/2,sy-h/2,w,h);
    ctx.fillStyle='#e9e4cf';ctx.font='14px system-ui';ctx.textAlign='center';ctx.fillText(label,sx,sy-h/2-10);
   };
   const playerFacing=state.player.facing||'s';
   const playerAsset=`protagonist_idle_${playerFacing}_00`;
   if(!options.hideIncompleteActors){
    const liuyanFacing=playerFacing;
    sprite(`liuyan_idle_${liuyanFacing}_00`,420,470,48,72);
    const liuyanPoint=projection.worldToScreen(420,470);
    ctx.fillStyle='#e9e4cf';ctx.font='14px system-ui';ctx.textAlign='center';ctx.fillText('柳焰',liuyanPoint.x,liuyanPoint.y-82);
   }
   const [garageX,garageY]=sceneObject('rustport_garage').position;
   entity(garageX,garageY,220,110,'#5a625c','战车车库');
   const awningObject=sceneObject('harbor_awning');
   const [awningX,awningY]=awningObject.position;
   const awningPoint=projection.worldToScreen(awningX,awningY,awningObject.z_height||0);
   drawAtPivot(awningObject.asset_id||'awning_canvas_beige',awningPoint.x,awningPoint.y);
   if(state.rustport.starterTankReady)vehicle(garageX,garageY);
   const barrelObject=sceneObject('repair_barrel');
   const [barrelX,barrelY]=barrelObject.position;
   const barrelPoint=projection.worldToScreen(barrelX,barrelY);
   drawAtPivot(barrelObject.asset_id||'barrel_rust',barrelPoint.x,barrelPoint.y);
   const houndVisible=!options.hideIncompleteActors&&state.rustport.starterTankReady&&(!state.rustport.ironHoundDefeated||state.rustport.actionUntil>now);
   if(houndVisible){
    const actionActive=state.rustport.actionUntil>now;
    const houndAsset=state.rustport.ironHoundDefeated?'iron_hound_death':actionActive?'iron_hound_hurt':state.rustport.combatHits>=2?'iron_hound_enraged':'iron_hound_idle';
    const [houndX,houndY]=sceneObject('iron_hound_bounty').position;
    sprite(houndAsset,houndX,houndY,160,128);
    const houndPoint=projection.worldToScreen(houndX,houndY);
    ctx.fillStyle='#e9e4cf';ctx.font='14px system-ui';ctx.textAlign='center';ctx.fillText('铁牙猎犬',houndPoint.x,houndPoint.y-140);
   }
   const garageSign=projection.worldToScreen(278,330,20);
   ctx.fillStyle='#c49b58';ctx.fillRect(garageSign.x-82,garageSign.y-30,164,60);
   if(!options.hideIncompleteActors)sprite(playerAsset,640,360,48,72);
   ctx.fillStyle='#0d1110';ctx.font='bold 22px system-ui';ctx.fillText('RUSTPORT // NEXT RUNTIME',28,42);
   ctx.font='16px system-ui';ctx.fillStyle='#d8ddc8';ctx.fillText('锈港 · 独立猎人起点 · A 互动 / 战斗',28,72);
   ctx.textAlign='left';ctx.font='18px system-ui';ctx.fillStyle='#e9e4cf';
   ctx.fillText(`废料 ${state.inventory.scrap}   资金 ${state.inventory.gold}G`,28,112);
   if(state.rustport.combatHits>0&&!state.rustport.ironHoundDefeated)ctx.fillText(`铁牙猎犬战斗 ${state.rustport.combatHits}/3`,28,140);
  }
 };
}
