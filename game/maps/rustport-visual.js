/* Rustport visual vertical slice v2: production assets resolve through AssetRegistry. */
const RUSTPORT_VISUAL_VERSION='0.25.0-rustport-assets-v2';
const RUSTPORT_GROUND=new Image();
let RUSTPORT_GROUND_ERROR=null;
ASSET_REGISTRY_READY.then(()=>AssetRegistry.bindImage('ground_dirt_oily_01',RUSTPORT_GROUND)).catch(error=>{
 RUSTPORT_GROUND_ERROR=error;
 console.error(error);
});

const rustportPreviousDrawTown=drawTown;

function rustportPoint(x,y){return townToScreen(x,y)}
function rustportPolygon(points,fill,stroke=null,width=1){
 ctx.beginPath();
 points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
 ctx.closePath();ctx.fillStyle=fill;ctx.fill();
 if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}
}
function rustportVisible(x,y,w=0,h=0){return x+w>-80&&y+h>-80&&x<W+80&&y<H+80}
function rustportNight(){return state.time>=18||state.time<6}

function rustportGround(){
 if(RUSTPORT_GROUND_ERROR)throw RUSTPORT_GROUND_ERROR;
 const p=rustportPoint(0,0);
 ctx.save();ctx.imageSmoothingEnabled=false;
 ctx.fillStyle='#282b29';ctx.fillRect(0,0,W,H);
 if(RUSTPORT_GROUND.complete&&RUSTPORT_GROUND.naturalWidth){
  ctx.translate(p.x,p.y);
  ctx.globalAlpha=.72;
  ctx.fillStyle=ctx.createPattern(RUSTPORT_GROUND,'repeat');
  ctx.fillRect(0,0,1400,900);
  ctx.translate(-p.x,-p.y);
 }
 ctx.globalAlpha=1;ctx.fillStyle='rgba(24,28,27,.44)';ctx.fillRect(0,0,W,H);

 const sea0=rustportPoint(0,0),sea1=rustportPoint(1400,145);
 const water=ctx.createLinearGradient(0,sea0.y,0,sea1.y);
 water.addColorStop(0,'#0e2830');water.addColorStop(.6,'#173c43');water.addColorStop(1,'#285158');
 ctx.fillStyle=water;ctx.fillRect(sea0.x,sea0.y,1400,145);
 const t=performance.now()/1000;
 for(let y=24;y<140;y+=17){
  const a=rustportPoint(0,y);ctx.strokeStyle=`rgba(141,193,194,${.08+(y%3)*.025})`;ctx.lineWidth=2;
  ctx.beginPath();
  for(let x=0;x<=1400;x+=28){const q=rustportPoint(x,y+Math.sin(x*.018+t*1.3+y)*3);x?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y)}
  ctx.stroke();
 }
 const wall=rustportPoint(0,132);
 ctx.fillStyle='#171d1c';ctx.fillRect(wall.x,wall.y,1400,26);
 ctx.fillStyle='#58605a';ctx.fillRect(wall.x,wall.y,1400,7);
 ctx.fillStyle='#242a28';for(let x=20;x<1400;x+=54){const q=rustportPoint(x,137);ctx.fillRect(q.x,q.y,28,5)}
 ctx.restore();
}

function rustportRoad(points,width=82){
 const p=points.map(q=>rustportPoint(q[0],q[1]));
 ctx.lineCap='butt';ctx.lineJoin='round';
 ctx.strokeStyle='rgba(10,13,13,.72)';ctx.lineWidth=width+18;ctx.beginPath();p.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.stroke();
 ctx.strokeStyle='#303937';ctx.lineWidth=width;ctx.stroke();
 ctx.strokeStyle='rgba(139,151,137,.18)';ctx.lineWidth=2;ctx.setLineDash([14,18]);ctx.stroke();ctx.setLineDash([]);
}
function rustportRoads(){
 rustportRoad([[700,880],[700,455],[130,455]],74);
 rustportRoad([[700,455],[1285,455]],74);
 rustportRoad([[300,455],[300,735]],58);
 rustportRoad([[1040,455],[1040,250]],58);
 for(const x of [78,430,772,1114]){
  const a=rustportPoint(x,416),b=rustportPoint(x+180,416);
  ctx.strokeStyle='rgba(12,16,16,.75)';ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
  ctx.strokeStyle='rgba(117,133,126,.34)';ctx.lineWidth=2;ctx.stroke();
 }
}

const RUSTPORT_BUILDING_STYLE={
 guild:{wall:'#4a433a',side:'#272b29',roof:'#202624',trim:'#c09348',light:'#f4c773'},
 clinic:{wall:'#4d6768',side:'#293839',roof:'#243132',trim:'#8fc6bd',light:'#c9efe2'},
 garage:{wall:'#3d4745',side:'#222928',roof:'#1d2423',trim:'#d19a48',light:'#f6bd60'},
 tavern:{wall:'#593b32',side:'#30221f',roof:'#261d1b',trim:'#c55742',light:'#ffb45f'},
 shop:{wall:'#5a5c43',side:'#303226',roof:'#292b22',trim:'#d1aa57',light:'#f2c56d'},
 inn:{wall:'#604634',side:'#30251e',roof:'#28221e',trim:'#d1874b',light:'#ffc070'},
 house:{wall:'#4d4a41',side:'#292a27',roof:'#232725',trim:'#8b7656',light:'#e8b86c'},
 warehouse:{wall:'#424b49',side:'#242b2a',roof:'#202625',trim:'#9b8052',light:'#e6b65d'}
};

function rustportWindow(x,y,w,h,light){
 ctx.fillStyle='#111817';ctx.fillRect(x-3,y-3,w+6,h+6);
 const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,rustportNight()?light:'#71837f');g.addColorStop(1,rustportNight()?'#8f5d31':'#354542');
 ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.fillStyle='rgba(255,255,255,.17)';ctx.fillRect(x+3,y+3,w-6,2);
 ctx.strokeStyle='rgba(12,17,16,.75)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+w/2,y);ctx.lineTo(x+w/2,y+h);ctx.stroke();
}

function rustportBuilding(b){
 const p=rustportPoint(b.x,b.y),w=b.w,h=b.h,s=RUSTPORT_BUILDING_STYLE[b.id]||RUSTPORT_BUILDING_STYLE.house;
 if(!rustportVisible(p.x,p.y,w,h))return;
 const depth=18,frontY=p.y+27;
 ctx.save();
 ctx.fillStyle='rgba(3,6,6,.5)';ctx.fillRect(p.x+20,p.y+24,w,h);
 rustportPolygon([[p.x+w,p.y+17],[p.x+w+depth,p.y+31],[p.x+w+depth,p.y+h+3],[p.x+w,p.y+h]],s.side,'#151a19',2);
 ctx.fillStyle=s.wall;ctx.fillRect(p.x,frontY,w,h-27);
 rustportPolygon([[p.x-8,p.y+17],[p.x+8,p.y-7],[p.x+w-2,p.y-7],[p.x+w+10,p.y+17]],s.roof,'#151a19',3);
 ctx.fillStyle='rgba(255,255,255,.07)';ctx.fillRect(p.x+8,p.y+2,w-10,3);
 for(let x=18;x<w-12;x+=42){ctx.fillStyle='rgba(8,12,11,.24)';ctx.fillRect(p.x+x,frontY,4,h-32);ctx.fillStyle='rgba(181,101,56,.18)';ctx.fillRect(p.x+x+5,frontY+11,2,18+(x%37))}
 const doorX=p.x+w/2-18,doorY=p.y+h-46;
 ctx.fillStyle='#111615';ctx.fillRect(doorX-5,doorY-5,46,51);
 ctx.fillStyle='#29312f';ctx.fillRect(doorX,doorY,36,46);ctx.fillStyle=s.trim;ctx.fillRect(doorX+26,doorY+23,4,4);

 if(b.id==='garage'){
  const bayX=p.x+31,bayY=p.y+64,bayW=w-62,bayH=h-72;
  ctx.fillStyle='#151b1a';ctx.fillRect(bayX,bayY,bayW,bayH);
  ctx.strokeStyle='#66716c';ctx.lineWidth=3;
  for(let y=bayY+10;y<bayY+bayH;y+=15){ctx.beginPath();ctx.moveTo(bayX+7,y);ctx.lineTo(bayX+bayW-7,y);ctx.stroke()}
  ctx.fillStyle=s.trim;for(let x=bayX;x<bayX+bayW;x+=28)ctx.fillRect(x,bayY-10,15,5);
 }else if(b.id==='clinic'){
  rustportWindow(p.x+24,p.y+64,42,27,s.light);rustportWindow(p.x+w-66,p.y+64,42,27,s.light);
  ctx.fillStyle='#d8e4dd';ctx.fillRect(p.x+w/2-7,p.y+41,14,38);ctx.fillRect(p.x+w/2-19,p.y+53,38,14);
 }else if(b.id==='tavern'||b.id==='inn'){
  rustportWindow(p.x+26,p.y+70,44,28,s.light);rustportWindow(p.x+w-70,p.y+70,44,28,s.light);
  ctx.fillStyle='#2a1a18';ctx.fillRect(p.x+15,p.y+52,w-30,13);ctx.fillStyle=s.trim;for(let x=20;x<w-20;x+=24)ctx.fillRect(p.x+x,p.y+52,12,13);
 }else{
  rustportWindow(p.x+25,p.y+67,38,24,s.light);rustportWindow(p.x+w-63,p.y+67,38,24,s.light);
 }

 const label=b.id==='guild'?'猎人公会':b.id==='garage'?'战车车库':b.id==='clinic'?'灯塔诊所':b.id==='tavern'?'海锚酒馆':b.id==='shop'?'补给铺':b.name;
 const sw=Math.min(w-32,Math.max(82,label.length*15+28));
 ctx.fillStyle='#101513';ctx.fillRect(p.x+w/2-sw/2,p.y+30,sw,24);ctx.strokeStyle=s.trim;ctx.strokeRect(p.x+w/2-sw/2+.5,p.y+30.5,sw-1,23);
 ctx.fillStyle='#ead7a2';ctx.font='bold 12px "Noto Sans SC",sans-serif';ctx.textAlign='center';ctx.fillText(label,p.x+w/2,p.y+47);
 ctx.fillStyle='#1a1f1d';ctx.fillRect(p.x-7,p.y+h-3,w+14,8);
 ctx.restore();
}

function rustportCrate(x,y,s=1){
 const p=rustportPoint(x,y),w=28*s,h=24*s;ctx.save();ctx.translate(p.x,p.y);
 ctx.fillStyle='rgba(0,0,0,.34)';ctx.fillRect(-w/2+5,-h/2+6,w,h);
 ctx.fillStyle='#71533a';ctx.fillRect(-w/2,-h/2,w,h);ctx.strokeStyle='#bd8b54';ctx.lineWidth=2;ctx.strokeRect(-w/2+1,-h/2+1,w-2,h-2);
 ctx.beginPath();ctx.moveTo(-w/2+3,-h/2+3);ctx.lineTo(w/2-3,h/2-3);ctx.moveTo(w/2-3,-h/2+3);ctx.lineTo(-w/2+3,h/2-3);ctx.stroke();ctx.restore();
}
function rustportBarrel(x,y){
 const p=rustportPoint(x,y);ctx.save();ctx.translate(p.x,p.y);ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(4,10,14,5,0,0,TAU);ctx.fill();
 ctx.fillStyle='#674437';ctx.fillRect(-11,-13,22,27);ctx.fillStyle='#966348';ctx.beginPath();ctx.ellipse(0,-13,11,4,0,0,TAU);ctx.fill();ctx.strokeStyle='#252a27';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-11,-6);ctx.lineTo(11,-6);ctx.moveTo(-11,7);ctx.lineTo(11,7);ctx.stroke();ctx.restore();
}
function rustportProps(){
 [[420,385,1],[455,385,.8],[840,415,1],[1190,505,.9],[1225,505,.75],[100,690,1],[130,690,.8]].forEach(q=>rustportCrate(...q));
 [[390,398],[820,418],[1160,520],[151,702]].forEach(q=>rustportBarrel(...q));
 const cables=[[[92,158],[420,148],[710,178]],[[720,168],[1010,140],[1290,165]]];
 for(const c of cables){const p=c.map(q=>rustportPoint(...q));ctx.strokeStyle='#101514';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(p[0].x,p[0].y);ctx.bezierCurveTo(p[1].x,p[1].y+35,p[1].x,p[1].y+35,p[2].x,p[2].y);ctx.stroke()}
}

function rustportLamps(){
 const night=rustportNight(),t=performance.now()/1000;
 for(const [x,y] of [[110,435],[470,435],[860,435],[1280,435],[620,760],[780,760]]){
  const p=rustportPoint(x,y);ctx.strokeStyle='#232a28';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(p.x,p.y+24);ctx.lineTo(p.x,p.y-34);ctx.stroke();
  ctx.fillStyle='#151a18';ctx.fillRect(p.x-8,p.y-39,16,10);ctx.fillStyle=night?'#ffd17a':'#8d8c73';ctx.fillRect(p.x-4,p.y-36,8,5);
  if(night){const g=ctx.createRadialGradient(p.x,p.y-30,2,p.x,p.y-12,58);g.addColorStop(0,`rgba(255,191,91,${.28+Math.sin(t+x)*.025})`);g.addColorStop(1,'rgba(255,177,70,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y-12,58,0,TAU);ctx.fill()}
 }
}

function rustportAtmosphere(){
 const t=performance.now()/1000,chimney=rustportPoint(1185,140);
 for(let i=0;i<5;i++){const age=(t*.16+i*.2)%1,x=chimney.x+Math.sin(t+i)*8+age*24,y=chimney.y-age*90;ctx.fillStyle=`rgba(102,111,106,${(1-age)*.13})`;ctx.beginPath();ctx.arc(x,y,10+age*18,0,TAU);ctx.fill()}
 const crane=rustportPoint(205,115);ctx.strokeStyle='#202725';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(crane.x,crane.y+28);ctx.lineTo(crane.x,crane.y-85);ctx.lineTo(crane.x+155,crane.y-85);ctx.stroke();ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(crane.x+128,crane.y-85);ctx.lineTo(crane.x+128,crane.y-25);ctx.stroke();
}

function rustportForeground(){
 const a=rustportPoint(45,825),b=rustportPoint(420,825);
 if(a.y<H+40&&a.y>-40){ctx.strokeStyle='rgba(12,17,16,.92)';ctx.lineWidth=15;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.strokeStyle='#53605a';ctx.lineWidth=3;ctx.stroke()}
 const c=rustportPoint(1050,795),d=rustportPoint(1370,795);
 if(c.y<H+40&&c.y>-40){ctx.strokeStyle='rgba(13,18,17,.9)';ctx.lineWidth=18;ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.stroke();ctx.strokeStyle='#6d5b42';ctx.lineWidth=3;ctx.setLineDash([9,11]);ctx.stroke();ctx.setLineDash([])}
}

function rustportDrawTown(){
 rustportGround();rustportRoads();rustportAtmosphere();
 townBuildings(0).forEach(rustportBuilding);
 rustportProps();rustportLamps();
 const npcs=getAmbientNpcs(0);npcs.forEach(n=>drawCharacter(n.model,n.x,n.y,n.dir,n.walk,1,n.name));
 drawTank();if(!state.player.inTank)drawPartyFollowers();drawPlayer();
 const gate=rustportPoint(700,850);ctx.fillStyle='#111716';ctx.fillRect(gate.x-82,gate.y-8,164,16);ctx.strokeStyle='#9b7946';ctx.strokeRect(gate.x-82.5,gate.y-8.5,165,17);ctx.fillStyle='#e5c57d';ctx.font='10px monospace';ctx.textAlign='center';ctx.fillText('荒原出口 / WASTE GATE',gate.x,gate.y-14);
 rustportForeground();drawAmbientLighting();rustportLamps();drawPrompt();
}

drawTown=function(){
 if((currentTown?.index??state.townIndex)!==0)return rustportPreviousDrawTown();
 return rustportDrawTown();
};
