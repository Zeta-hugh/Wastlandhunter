import { LOGICAL_HEIGHT, LOGICAL_WIDTH } from './constants.js';
import { createProjection } from './projection.js';

export function createRenderer(canvas,assets,camera,scene={objects:[]}){
 const ctx=canvas.getContext('2d');
 const projection=createProjection(camera.position);
 const scenePosition=id=>scene.objects.find(object=>object.id===id)?.position||[0,0];
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
   const roadTiles=['concrete_clean','concrete_cracked','concrete_oily'];
   for(let ty=-8;ty<=8;ty++)for(let tx=-12;tx<=12;tx++){
    const tile=assets.get(roadTiles[Math.abs(tx+ty)%roadTiles.length]);
    const points=projection.groundDiamond(x+tx*32,y+ty*32);
    ctx.save();ctx.beginPath();ctx.moveTo(...points[0]);for(const point of points.slice(1))ctx.lineTo(...point);ctx.closePath();ctx.clip();
    const center=projection.worldToScreen(x+tx*32,y+ty*32);
    ctx.drawImage(tile,center.x-16,center.y-10,32,20);ctx.restore();
   }
   const sprite=(assetId,ex,ey,width,height)=>{
    const point=projection.worldToScreen(ex,ey);
    ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(point.x,point.y-3,width*.36,7,0,0,Math.PI*2);ctx.fill();
    ctx.drawImage(assets.get(assetId),point.x-width/2,point.y-height,width,height);
   };
   const vehicle=(ex,ey)=>{
    const point=projection.worldToScreen(ex,ey),sx=point.x,sy=point.y;
    ctx.save();
    ctx.translate(sx,sy-96);
    ctx.drawImage(assets.get('rust_runner_track_left'),-64,-64,128,128);
    ctx.drawImage(assets.get('rust_runner_track_right'),-64,-64,128,128);
    ctx.drawImage(assets.get('rust_runner_chassis_s'),-64,-64,128,128);
    ctx.drawImage(assets.get('rust_runner_turret_00'),-64,-64,128,128);
    ctx.drawImage(assets.get('cannon_75mm'),-64,-64,128,128);
    ctx.restore();
   };
   const entity=(ex,ey,w,h,fill,label)=>{
    const point=projection.worldToScreen(ex,ey),sx=point.x,sy=point.y;
    ctx.fillStyle=fill;ctx.fillRect(sx-w/2,sy-h/2,w,h);
    ctx.fillStyle='#e9e4cf';ctx.font='14px system-ui';ctx.textAlign='center';ctx.fillText(label,sx,sy-h/2-10);
   };
   const playerFacing=state.player.facing||'s';
   const playerAsset=`protagonist_idle_${playerFacing}_00`;
   const liuyanFacing=playerFacing;
   sprite(`liuyan_idle_${liuyanFacing}_00`,420,470,48,72);
   const liuyanPoint=projection.worldToScreen(420,470);
   ctx.fillStyle='#e9e4cf';ctx.font='14px system-ui';ctx.textAlign='center';ctx.fillText('柳焰',liuyanPoint.x,liuyanPoint.y-82);
   const awning=assets.get('awning_canvas_beige');
   const [awningX,awningY]=scenePosition('harbor_awning');
   const awningPoint=projection.worldToScreen(awningX,awningY,24);
   ctx.drawImage(awning,awningPoint.x-48,awningPoint.y-40,96,64);
   const [garageX,garageY]=scenePosition('rustport_garage');
   entity(garageX,garageY,220,110,'#5a625c','战车车库');
   if(state.rustport.starterTankReady)vehicle(garageX,garageY);
   const barrel=assets.get('barrel_rust');
   const [barrelX,barrelY]=scenePosition('repair_barrel');
   const barrelPoint=projection.worldToScreen(barrelX,barrelY);
   ctx.drawImage(barrel,barrelPoint.x-20,barrelPoint.y-40,40,40);
   const houndVisible=state.rustport.starterTankReady&&(!state.rustport.ironHoundDefeated||state.rustport.actionUntil>now);
   if(houndVisible){
    const actionActive=state.rustport.actionUntil>now;
    const houndAsset=state.rustport.ironHoundDefeated?'iron_hound_death':actionActive?'iron_hound_hurt':state.rustport.combatHits>=2?'iron_hound_enraged':'iron_hound_idle';
    const [houndX,houndY]=scenePosition('iron_hound_bounty');
    sprite(houndAsset,houndX,houndY,160,128);
    const houndPoint=projection.worldToScreen(houndX,houndY);
    ctx.fillStyle='#e9e4cf';ctx.font='14px system-ui';ctx.textAlign='center';ctx.fillText('铁牙猎犬',houndPoint.x,houndPoint.y-140);
    if(!state.rustport.ironHoundDefeated){
     const cannon=assets.get('cannon_75mm');
     ctx.drawImage(cannon,houndPoint.x-64,houndPoint.y-64,128,128);
    }
   }
   const garageSign=projection.worldToScreen(278,330,20);
   ctx.fillStyle='#c49b58';ctx.fillRect(garageSign.x-82,garageSign.y-30,164,60);
   sprite(playerAsset,640,360,48,72);
   ctx.fillStyle='#0d1110';ctx.font='bold 22px system-ui';ctx.fillText('RUSTPORT // NEXT RUNTIME',28,42);
   ctx.font='16px system-ui';ctx.fillStyle='#d8ddc8';ctx.fillText('锈港 · 独立猎人起点 · A 互动 / 战斗',28,72);
   ctx.textAlign='left';ctx.font='18px system-ui';ctx.fillStyle='#e9e4cf';
   ctx.fillText(`废料 ${state.inventory.scrap}   资金 ${state.inventory.gold}G`,28,112);
   if(state.rustport.combatHits>0&&!state.rustport.ironHoundDefeated)ctx.fillText(`铁牙猎犬战斗 ${state.rustport.combatHits}/3`,28,140);
  }
 };
}
