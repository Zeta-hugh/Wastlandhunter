function sayToast(text,d=1.8){toast.text=text;toast.t=d}
function setHint(t){$('hint').textContent=t}
function updateHud(){
 $('zone').textContent=state.scene==='world'?'荒原 · 2128':state.scene==='town'?(currentTown?.name||'城镇'):`${currentTown?.name||''} · ${interiorName()}`;
 $('modeTag').textContent=state.player.inTank?'驾驶战车':'步行';
 $('hp').textContent=state.player.inTank?`${Math.ceil(state.tank.hp)}/${tankMax()}`:'人物';
 $('gold').textContent=state.gold; $('scrap').textContent=state.scrap;
 const p=state.townProgress[state.townIndex],t=TOWNS[state.townIndex];
 $('quest').textContent=p.claimed?'前往下一镇':p.boss?'回镇交付战果':(p.chief&&p.mechanic&&p.board?`追猎 ${t.boss}`:`调查 ${t.name}`);
 $('btnA').querySelector('small').textContent=contextALabel();
}
function contextALabel(){if(mode==='dialogue')return'继续';if(mode==='menu'||mode==='battle')return'确认';const i=nearestInteractable();if(i)return i.type==='door'?'进入':i.type==='exitInterior'?'离开':'互动';if(state.player.inTank)return'下车';if(dist(state.player.x,state.player.y,state.tank.x,state.tank.y)<66)return'上车';return'确认'}
function interiorName(){const id=state.currentInterior;return{id:'',guild:'猎人公会',garage:'战车车库',tavern:'酒馆',shop:'补给店',clinic:'诊所'}[id]||'室内'}

function worldToScreen(x,y){const f=state.player.inTank?state.tank:state.player,cx=clamp(f.x,W/2,3900-W/2),cy=clamp(f.y,H/2,2100-H/2);return{x:x-cx+W/2,y:y-cy+H/2}}
function townToScreen(x,y){const f=state.player.inTank?state.tank:state.player,cx=clamp(f.x,W/2,1400-W/2),cy=clamp(f.y,H/2,900-H/2);return{x:x-cx+W/2,y:y-cy+H/2}}
function roomToScreen(x,y){return{x,y}}
function screenPos(x,y){return state.scene==='world'?worldToScreen(x,y):state.scene==='town'?townToScreen(x,y):roomToScreen(x,y)}

function drawCharacter(modelKey,x,y,dir,walk=0,scale=1,label=''){
 const m=CHAR_MODELS[modelKey]||CHAR_MODELS.npcA,p=screenPos(x,y);ctx.save();ctx.translate(Math.round(p.x),Math.round(p.y));ctx.scale(scale,scale);
 const bob=Math.sin(walk*10)*1.4,step=Math.sin(walk*10)*3;ctx.translate(0,bob);
 const facing=Math.cos(dir)>=0?1:-1;ctx.scale(facing,1);
 ctx.fillStyle='rgba(0,0,0,.28)';ctx.fillRect(-8,12,16,4);
 ctx.fillStyle=m.bottom;ctx.fillRect(-7,3,5,11+step*.12);ctx.fillRect(2,3,5,11-step*.12);
 ctx.fillStyle=m.top;ctx.fillRect(-8,-10,16,15);ctx.fillStyle=m.accent;ctx.fillRect(-9,-8,4,10);ctx.fillRect(5,-8,4,10);
 ctx.fillStyle=m.skin;ctx.fillRect(-6,-19,12,10);ctx.fillStyle=m.hair;ctx.fillRect(-7,-21,14,5);ctx.fillRect(-8,-18,3,7);
 ctx.fillStyle='#171717';ctx.fillRect(3,-16,2,2);ctx.restore();
 if(label){ctx.fillStyle='#fff2c6';ctx.font='10px sans-serif';ctx.textAlign='center';ctx.fillText(label,p.x,p.y-30)}
}
function drawPlayer(){drawCharacter(state.player.model,state.player.x,state.player.y,state.player.dir,state.player.walk,1.15);if(!state.player.inTank)drawFollowers()}
function drawFollowers(){const p=state.player,followers=[];if(state.party.liuyan)followers.push('liuyan');if(state.party.taoyao)followers.push('taoyao');if(state.party.lincheng)followers.push('lincheng');followers.forEach((m,i)=>{const a=p.dir+Math.PI+(i-1)*.5,rr=28+10*i;drawCharacter(m,p.x+Math.cos(a)*rr,p.y+Math.sin(a)*rr,p.dir,p.walk+i*.33,.9)})}
function drawTankModel(x,y,dir,idx,scale=1,screen=true){const v=VEHICLES[idx],p=screen?screenPos(x,y):{x,y};ctx.save();ctx.translate(Math.round(p.x),Math.round(p.y));ctx.rotate(dir);ctx.scale(scale,scale);
 ctx.fillStyle='rgba(0,0,0,.32)';ctx.fillRect(-27,-11,54,26);
 const track=v.track==='light'?5:v.track==='snow'?9:7;ctx.fillStyle='#171a18';ctx.fillRect(-27,-17,54,track);ctx.fillRect(-27,17-track,54,track);for(let k=-22;k<=20;k+=9){ctx.fillStyle='#343934';ctx.fillRect(k,-16,5,3);ctx.fillRect(k,13,5,3)}
 ctx.fillStyle=v.body;ctx.fillRect(-22,-12,44,24);ctx.fillStyle='#252925';ctx.fillRect(-14,-10,28,5);
 const armor=equipped('armor');if(armor.id!=='a0'||state.tank.upgrades.armor>0){ctx.fillStyle='#9c9986';ctx.fillRect(-24,-10,5,20);ctx.fillRect(19,-10,5,20)}
 ctx.fillStyle='#9e9b82';if(v.turret==='box')ctx.fillRect(-7,-9,17,18);else if(v.turret==='wedge'){ctx.beginPath();ctx.moveTo(-10,-9);ctx.lineTo(12,-6);ctx.lineTo(12,6);ctx.lineTo(-10,9);ctx.closePath();ctx.fill()}else if(v.turret==='drill'){ctx.fillRect(-9,-7,17,14);ctx.fillStyle='#b9ad8a';ctx.beginPath();ctx.moveTo(8,-5);ctx.lineTo(28,0);ctx.lineTo(8,5);ctx.fill()}else if(v.turret==='aa'){ctx.fillRect(-7,-7,14,14);ctx.fillRect(3,-7,22,3);ctx.fillRect(3,4,22,3)}else ctx.fillRect(-8,-8,16,16);
 const main=equipped('main'),barrel=24+main.rarity*4+state.tank.upgrades.main*2;ctx.fillStyle='#bbb69c';ctx.fillRect(5,-2,barrel,4);
 if(equipped('sub').id!=='s0'||state.tank.upgrades.sub>0){ctx.fillStyle='#777a70';ctx.fillRect(4,-8,18,2);ctx.fillRect(4,6,18,2)}
 if(equipped('se').id!=='e0'||state.tank.upgrades.se>0){ctx.fillStyle='#4b5148';ctx.fillRect(-12,-16,17,5);ctx.fillRect(-12,11,17,5)}
 if(equipped('cunit').id!=='c0'){ctx.strokeStyle='#d8c978';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-5,-10);ctx.lineTo(-9,-22);ctx.stroke();ctx.fillStyle='#e4d577';ctx.fillRect(-11,-24,4,4)}
 if(equipped('engine').id!=='eng0'||state.tank.upgrades.engine>0){ctx.fillStyle='#555';ctx.fillRect(-24,-5,5,4);ctx.fillRect(-24,3,5,4)}
 ctx.restore();
}
function drawTank(){drawTankModel(state.tank.x,state.tank.y,state.tank.dir,state.vehicleIndex,1,true);if(!state.player.inTank&&dist(state.player.x,state.player.y,state.tank.x,state.tank.y)<70){const p=screenPos(state.tank.x,state.tank.y);ctx.fillStyle='#f5d982';ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.fillText('A 上车',p.x,p.y-34)}}

function roadPath(){ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#5d5a50';ctx.lineWidth=38;ctx.beginPath();TOWNS.forEach((t,i)=>{const a=worldToScreen(t.x,t.y);i?ctx.lineTo(a.x,a.y):ctx.moveTo(a.x,a.y)});ctx.stroke();ctx.strokeStyle='#8c8778';ctx.lineWidth=3;ctx.setLineDash([12,12]);ctx.stroke();ctx.setLineDash([])}
function drawWorld(){ctx.fillStyle='#897148';ctx.fillRect(0,0,W,H);for(let gx=0;gx<4200;gx+=96)for(let gy=0;gy<2200;gy+=96){const s=worldToScreen(gx,gy);if(s.x<-100||s.y<-100||s.x>W+100||s.y>H+100)continue;const v=((gx/96)*17+(gy/96)*11)%13;if(v<2){ctx.fillStyle='#5e614b';ctx.fillRect(s.x+15,s.y+28,22,9);ctx.fillStyle='#343b2e';ctx.fillRect(s.x+25,s.y+18,4,12)}else if(v===4){ctx.fillStyle='#725e42';ctx.fillRect(s.x+40,s.y+48,30,4)}}roadPath();
 TOWNS.forEach((t,i)=>{if(i>=state.unlocked)return;const p=worldToScreen(t.x,t.y);ctx.fillStyle=t.color;ctx.fillRect(p.x-32,p.y-25,64,50);ctx.fillStyle='#292823';ctx.fillRect(p.x-20,p.y-38,40,16);ctx.fillStyle='#f1d286';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillText(t.name,p.x,p.y-47)});
 TOWNS.forEach((t,i)=>{const q=state.townProgress[i];if(i>=state.unlocked||q.boss||q.claimed||!(q.chief&&q.mechanic&&q.board))return;const b=bossPosition(i),sp=worldToScreen(b.x,b.y);ctx.fillStyle='#9b332c';ctx.beginPath();ctx.arc(sp.x,sp.y,19,0,TAU);ctx.fill();ctx.fillStyle='#fff';ctx.font='bold 19px sans-serif';ctx.fillText('☠',sp.x,sp.y+7);ctx.font='10px sans-serif';ctx.fillText(t.boss,sp.x,sp.y-27)});
 drawTank();if(!state.player.inTank)drawPlayer();
}
function bossPosition(i){const t=TOWNS[i],ang=i*1.7+.4,r=185+((i*53)%90);return{x:clamp(t.x+Math.cos(ang)*r,80,4120),y:clamp(t.y+Math.sin(ang)*r,80,2120)}}

function townBuildings(i){const shift=(i%3)*25,mirror=i%2===1;let list=[
 {id:'guild',name:'猎人公会',x:170+shift,y:135,w:270,h:175,color:'#69584b'},
 {id:'garage',name:'战车车库',x:780-shift,y:120,w:360,h:210,color:'#545657'},
 {id:'tavern',name:'酒馆',x:220,y:515,w:280,h:175,color:'#503b34'},
 {id:'shop',name:'补给店',x:850,y:520,w:250,h:165,color:'#5e654a'},
 {id:'clinic',name:'诊所',x:560,y:320,w:240,h:145,color:'#68777a'}];
 if(mirror)list=list.map(b=>({...b,x:1400-b.x-b.w}));return list;
}
function buildingDoor(b){return{x:b.x+b.w/2,y:b.y+b.h+16,type:'door',building:b.id,name:b.name}}
function ambientNpcData(i){const names=['搬运工','拾荒客','送水员','老猎人','孩子的父亲','巡逻员'];return names.map((n,k)=>({id:`a${k}`,name:n,model:['npcA','npcB','npcC'][k%3],route:ambientRoute(i,k),speed:23+(k%3)*5,phase:k*1.1}))}
function ambientRoute(i,k){const points=[[110,420],[620,730],[1250,420],[690,110],[420,420],[1030,730],[1120,260],[280,760]];const a=points[(k+i)%points.length],b=points[(k+i+2)%points.length];return[{x:a[0],y:a[1]},{x:b[0],y:b[1]}]}
let npcRuntime={};
function getAmbientNpcs(i){if(!npcRuntime[i])npcRuntime[i]=ambientNpcData(i).map(n=>({...n,x:n.route[0].x,y:n.route[0].y,target:1,dir:0,walk:0}));return npcRuntime[i]}
function updateNpcs(dt){if(state.scene!=='town')return;for(const n of getAmbientNpcs(state.townIndex)){const t=n.route[n.target],dx=t.x-n.x,dy=t.y-n.y,d=Math.hypot(dx,dy);if(d<5){n.target=(n.target+1)%n.route.length;continue}n.dir=Math.atan2(dy,dx);n.x+=dx/d*n.speed*dt;n.y+=dy/d*n.speed*dt;n.walk+=dt}}
function drawTownThemeDecor(i){
 const pts=(arr)=>arr.map(([x,y])=>townToScreen(x,y));
 ctx.save();ctx.lineWidth=3;
 if(i===0){
   for(const q of pts([[80,90],[1260,100]])){const x=q.x,y=q.y;ctx.strokeStyle='#aa8764';ctx.beginPath();ctx.moveTo(x,y+90);ctx.lineTo(x+35,y);ctx.lineTo(x+78,y+90);ctx.stroke();ctx.fillStyle='#503f34';ctx.fillRect(x+25,y+10,10,80)}
 }else if(i===1){
   for(const q of pts([[120,100],[1180,120],[690,720]])){const x=q.x,y=q.y;ctx.strokeStyle='#d8d0b5';ctx.beginPath();ctx.moveTo(x,y+70);ctx.lineTo(x,y);ctx.moveTo(x,y);ctx.lineTo(x+38,y-22);ctx.moveTo(x,y);ctx.lineTo(x-38,y-22);ctx.stroke()}
 }else if(i===2){
   const p=townToScreen(690,120);ctx.strokeStyle='#79d4df';ctx.beginPath();ctx.arc(p.x,p.y,45,0,TAU);ctx.stroke();ctx.fillStyle='#4d3a69';ctx.fillRect(p.x-35,p.y-8,70,16)
 }else if(i===3){
   const p=townToScreen(1200,730);ctx.fillStyle='#242628';ctx.fillRect(p.x-70,p.y-45,140,90);ctx.strokeStyle='#a17d48';for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(p.x-60+k*35,p.y-45);ctx.lineTo(p.x-40+k*35,p.y-90);ctx.stroke()}
 }else if(i===4){
   const p=townToScreen(690,110);ctx.strokeStyle='#c97862';ctx.lineWidth=8;ctx.beginPath();ctx.ellipse(p.x,p.y,120,58,0,0,TAU);ctx.stroke();ctx.fillStyle='#5b2b27';ctx.fillRect(p.x-90,p.y-12,180,24)
 }else if(i===5){
   for(const q of pts([[100,120],[1180,110],[690,760]])){const x=q.x,y=q.y;ctx.strokeStyle='#c4c8bf';ctx.beginPath();ctx.moveTo(x,y+50);ctx.lineTo(x,y-30);ctx.moveTo(x,y-30);ctx.lineTo(x+40,y-55);ctx.moveTo(x,y-30);ctx.lineTo(x-40,y-55);ctx.stroke()}
 }else if(i===6){
   const p=townToScreen(700,105);ctx.strokeStyle='#dce8e9';ctx.beginPath();ctx.arc(p.x,p.y,55,Math.PI,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+45,p.y-42);ctx.stroke()
 }else if(i===7){
   for(const q of pts([[120,120],[1180,110]])){const x=q.x,y=q.y;ctx.fillStyle='#3f3730';ctx.fillRect(x-22,y,44,105);ctx.fillStyle='#d66f32';ctx.beginPath();ctx.arc(x,y-5,18,0,TAU);ctx.fill()}
 }else if(i===8){
   for(const q of pts([[90,140],[1200,150]])){const x=q.x,y=q.y;ctx.strokeStyle='#7f8790';ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+120,y-75);ctx.stroke();ctx.strokeStyle='#8ed6e6';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+30,y-20);ctx.lineTo(x+95,y-60);ctx.stroke()}
 }else if(i===9){
   const p=townToScreen(700,95);ctx.fillStyle='#2a2f32';ctx.fillRect(p.x-120,p.y-25,240,70);ctx.fillStyle='#b43d33';for(let k=0;k<5;k++)ctx.fillRect(p.x-95+k*45,p.y-8,22,8)
 }
 ctx.restore();
}
function drawTown(){const i=currentTown.index,t=currentTown;ctx.fillStyle=i===6?'#82969a':i===7?'#5a4936':i===8?'#4b5359':'#73654b';ctx.fillRect(0,0,W,H);
 for(let x=0;x<1400;x+=140){let s=townToScreen(x,0);ctx.fillStyle='#555348';ctx.fillRect(s.x,0,34,H)}for(let y=0;y<900;y+=150){let s=townToScreen(0,y);ctx.fillStyle='#5d5a4f';ctx.fillRect(0,s.y,W,30)}
 drawTownThemeDecor(i);
 townBuildings(i).forEach(b=>drawBuilding(b));
 getAmbientNpcs(i).forEach(n=>drawCharacter(n.model,n.x,n.y,n.dir,n.walk,.92,n.name));
 drawTank();if(!state.player.inTank)drawPlayer();ctx.fillStyle='#f5d982';ctx.font='bold 14px sans-serif';ctx.textAlign='left';ctx.fillText(`${i+1}. ${t.name} · ${t.theme}`,20,92);ctx.fillStyle='#ddd1aa';ctx.font='11px sans-serif';ctx.fillText(t.flavor,20,111);
}
function drawBuilding(b){const p=townToScreen(b.x,b.y),d=townToScreen(b.x+b.w/2,b.y+b.h);ctx.fillStyle=b.color;ctx.fillRect(p.x,p.y,b.w,b.h);ctx.fillStyle='#2c2d29';ctx.fillRect(p.x+14,p.y+17,b.w-28,16);ctx.fillStyle='#b4a582';ctx.fillRect(p.x+24,p.y+64,34,34);ctx.fillRect(p.x+b.w-58,p.y+64,34,34);ctx.fillStyle='#241f1b';ctx.fillRect(d.x-20,d.y-44,40,44);ctx.fillStyle='#efd08a';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillText(b.name,p.x+b.w/2,p.y+50)}

function roomTemplate(type){const common={w:960,h:540};const data={
 guild:{floor:'#5c5142',wall:'#302b28',fixtures:[['desk',480,150],['board',760,110],['bench',250,330],['locker',130,120]]},
 garage:{floor:'#4f5250',wall:'#272a28',fixtures:[['lift',500,245],['tool',760,120],['parts',190,150],['terminal',760,350]]},
 tavern:{floor:'#4b3730',wall:'#2a211e',fixtures:[['bar',650,130],['table',260,230],['table',420,330],['jukebox',130,110]]},
 shop:{floor:'#585b43',wall:'#2d3025',fixtures:[['counter',610,140],['shelf',200,110],['shelf',200,230],['crate',760,340]]},
 clinic:{floor:'#657679',wall:'#30383a',fixtures:[['bed',230,170],['bed',230,310],['desk',650,150],['cabinet',790,280]]}
 };return{...common,...data[type]};}
function interiorNpcs(type,i){const t=TOWNS[i];if(type==='guild')return[{name:t.core[0],role:'chief',model:i===0||i===8?'liuyan':i===1?'taoyao':i===2?'lincheng':'npcB',x:520,y:190,dir:Math.PI/2,walk:0}];if(type==='garage')return[{name:t.core[1],role:'mechanic',model:i===1||i===9?'taoyao':'npcC',x:655,y:270,dir:Math.PI,walk:0}];if(type==='tavern')return[{name:t.core[2],role:'board',model:'npcA',x:660,y:175,dir:Math.PI,walk:0},{name:'酒客',role:'ambient',model:'npcB',x:300,y:255,dir:0,walk:0}];if(type==='shop')return[{name:'补给商',role:'shopkeeper',model:'npcC',x:650,y:190,dir:Math.PI,walk:0}];if(type==='clinic')return[{name:i===2?'林澄':'巡回护士',role:'nurse',model:i===2?'lincheng':'npcB',x:660,y:190,dir:Math.PI,walk:0}];return[]}
function drawInterior(){const type=state.currentInterior,tpl=roomTemplate(type);ctx.fillStyle=tpl.wall;ctx.fillRect(0,0,W,H);ctx.fillStyle=tpl.floor;ctx.fillRect(45,45,W-90,H-90);ctx.fillStyle='#252525';ctx.fillRect(W/2-42,H-53,84,18);ctx.fillStyle='#e4c77a';ctx.font='bold 16px sans-serif';ctx.textAlign='left';ctx.fillText(`${currentTown.name} · ${interiorName()}`,24,31);tpl.fixtures.forEach(f=>drawFixture(...f));interiorNpcs(type,state.townIndex).forEach(n=>drawCharacter(n.model,n.x,n.y,n.dir,n.walk,1,n.name));drawPlayer();}
function drawFixture(type,x,y){ctx.save();if(type==='desk'||type==='counter'||type==='bar'){ctx.fillStyle='#5b4230';ctx.fillRect(x-90,y-20,180,40);ctx.fillStyle='#7c5c3e';ctx.fillRect(x-84,y-28,168,12)}else if(type==='board'){ctx.fillStyle='#342a22';ctx.fillRect(x-55,y-45,110,90);ctx.fillStyle='#ddd0a4';for(let k=0;k<5;k++)ctx.fillRect(x-40+(k%2)*40,y-30+Math.floor(k/2)*25,28,18)}else if(type==='bench'){ctx.fillStyle='#4a4337';ctx.fillRect(x-70,y-9,140,18);ctx.fillRect(x-58,y+8,8,20);ctx.fillRect(x+50,y+8,8,20)}else if(type==='locker'||type==='cabinet'){ctx.fillStyle='#535b59';ctx.fillRect(x-38,y-65,76,130);ctx.strokeStyle='#858f8b';ctx.strokeRect(x-32,y-58,28,116);ctx.strokeRect(x+4,y-58,28,116)}else if(type==='lift'){ctx.fillStyle='#353936';ctx.fillRect(x-125,y-70,250,140);ctx.strokeStyle='#e0b55d';ctx.lineWidth=4;ctx.strokeRect(x-110,y-55,220,110);drawTankModel(x,y,0,state.vehicleIndex,.9,false)}else if(type==='tool'){ctx.fillStyle='#5b4b3b';ctx.fillRect(x-60,y-55,120,110);ctx.fillStyle='#b08952';for(let k=0;k<6;k++)ctx.fillRect(x-45+(k%3)*30,y-35+Math.floor(k/3)*42,12,28)}else if(type==='parts'){ctx.fillStyle='#4e5550';for(let k=0;k<3;k++)ctx.fillRect(x-65+k*45,y-45,35,90)}else if(type==='terminal'||type==='jukebox'){ctx.fillStyle='#454d47';ctx.fillRect(x-35,y-48,70,96);ctx.fillStyle='#75c2b5';ctx.fillRect(x-24,y-34,48,30)}else if(type==='table'){ctx.fillStyle='#574231';ctx.beginPath();ctx.arc(x,y,46,0,TAU);ctx.fill();ctx.fillStyle='#2e2923';ctx.fillRect(x-5,y,10,45)}else if(type==='shelf'){ctx.fillStyle='#5c503b';ctx.fillRect(x-70,y-45,140,90);ctx.fillStyle='#8b7a58';for(let k=0;k<4;k++)ctx.fillRect(x-58+k*29,y-30,18,24)}else if(type==='crate'){ctx.fillStyle='#69553c';ctx.fillRect(x-42,y-42,84,84);ctx.strokeStyle='#a1855c';ctx.strokeRect(x-34,y-34,68,68)}else if(type==='bed'){ctx.fillStyle='#d5ddd8';ctx.fillRect(x-80,y-30,160,60);ctx.fillStyle='#8aa3a6';ctx.fillRect(x-72,y-24,50,48)}ctx.restore()}

function nearestInteractable(){const px=state.player.inTank?state.tank.x:state.player.x,py=state.player.inTank?state.tank.y:state.player.y;if(state.scene==='world'){for(let i=0;i<state.unlocked;i++){const t=TOWNS[i];if(dist(px,py,t.x,t.y)<70)return{type:'town',town:i,name:t.name}}const i=state.townIndex,p=state.townProgress[i];if(!p.boss&&!p.claimed&&p.chief&&p.mechanic&&p.board){const b=bossPosition(i);if(dist(px,py,b.x,b.y)<78)return{type:'boss',town:i,name:TOWNS[i].boss}}}
 else if(state.scene==='town'){for(const b of townBuildings(state.townIndex)){const d=buildingDoor(b);if(dist(px,py,d.x,d.y)<54)return d}for(const n of getAmbientNpcs(state.townIndex))if(dist(px,py,n.x,n.y)<48)return{type:'ambient',name:n.name,npc:n};if(dist(px,py,700,850)<60)return{type:'exit',name:'荒原出口'}}
 else{if(dist(px,py,W/2,H-60)<62)return{type:'exitInterior',name:'离开房间'};for(const n of interiorNpcs(state.currentInterior,state.townIndex))if(dist(px,py,n.x,n.y)<60)return{type:'npc',...n};const fixtures=roomTemplate(state.currentInterior).fixtures;for(const f of fixtures){if(dist(px,py,f[1],f[2])<62)return{type:'fixture',fixture:f[0],name:fixtureName(f[0])}}}
 return null}
function fixtureName(f){return{desk:'桌子',board:'悬赏板',bench:'长椅',locker:'储物柜',lift:'战车升降台',tool:'工具墙',parts:'零件架',terminal:'改装终端',bar:'吧台',table:'桌子',jukebox:'点唱机',counter:'柜台',shelf:'货架',crate:'货箱',bed:'病床',cabinet:'药柜'}[f]||f}
function collides(nx,ny){if(state.scene==='world'){if(nx<35||ny<35||nx>4165||ny>2165)return true;return v9Biome(nx,ny)==='water'&&!v9nearRoad(nx,ny,42)}if(state.scene==='town'){if(nx<35||ny<35||nx>1365||ny>865)return true;return townBuildings(state.townIndex).some(b=>nx>b.x-18&&nx<b.x+b.w+18&&ny>b.y-18&&ny<b.y+b.h+18)}if(nx<62||ny<62||nx>898||ny>478)return true;return false}
function updateMovement(dt){if(mode!=='play')return;state.time=(state.time+dt*.018)%24;updateNpcs(dt);let dx=(keys.right?1:0)-(keys.left?1:0),dy=(keys.down?1:0)-(keys.up?1:0);if(!dx&&!dy)return;const len=Math.hypot(dx,dy);dx/=len;dy/=len;const obj=state.player.inTank?state.tank:state.player;const speed=state.player.inTank?vehicle().spd:112;obj.dir=Math.atan2(dy,dx);const nx=obj.x+dx*speed*dt,ny=obj.y+dy*speed*dt;if(!collides(nx,obj.y))obj.x=nx;if(!collides(obj.x,ny))obj.y=ny;if(!state.player.inTank)state.player.walk+=dt;else{state.player.x=obj.x;state.player.y=obj.y;encounterMeter+=speed*dt;if(state.scene==='world'&&encounterMeter>850){encounterMeter=0;if(Math.random()<.62)startRandomBattle()}}}

function pressA(){if(mode==='dialogue'){advanceDialogue();return}if(mode==='menu'){menuConfirm();return}if(mode==='battle'){battleConfirm();return}const i=nearestInteractable();if(i){interact(i);return}if(state.player.inTank){state.player.inTank=false;state.player.x=state.tank.x+44;state.player.y=state.tank.y;sayToast('下车');return}if(dist(state.player.x,state.player.y,state.tank.x,state.tank.y)<70&&state.scene!=='interior'){state.player.inTank=true;state.player.x=state.tank.x;state.player.y=state.tank.y;sayToast('进入 '+tankName());return}sayToast('附近没有可互动目标')}
function pressB(){if(mode==='dialogue'){closeDialogue();return}if(mode==='menu'){if(menu.sub){menu.sub=null;menu.sel=0}else closeMenu();return}if(mode==='battle'){battleBack();return}openMenu()}
function interact(i){if(i.type==='town')return enterTown(i.town);if(i.type==='boss'){if(!state.player.inTank)return sayToast('赏金首战需要驾驶战车');return startBossBattle(i.town)}if(i.type==='exit')return leaveTown();if(i.type==='door')return enterInterior(i.building);if(i.type==='exitInterior')return leaveInterior();if(i.type==='npc')return talkNpc(i);if(i.type==='ambient')return talkAmbient(i.npc);if(i.type==='fixture')return interactFixture(i.fixture)}
function enterTown(i){currentTown={...TOWNS[i],index:i};state.scene='town';state.townIndex=i;state.player.inTank=false;state.tank.x=700;state.tank.y=800;state.player.x=650;state.player.y=800;state.currentInterior=null;sayToast(`进入 ${currentTown.name}`);const p=state.townProgress[i];if(!p.arrived){p.arrived=true;saveSilently();state.canon.seen['town'+i]=true;if(i===6)state.canon.oldTimerMet=true;if(i>=8)state.canon.zeroKnown=true;setTimeout(()=>openDialogue(CANON_ARRIVAL[i]||ARRIVAL_SCENES[i]||[['旁白',currentTown.flavor]]),120)}}
function leaveTown(){state.scene='world';const t=TOWNS[state.townIndex];state.tank.x=t.x+90;state.tank.y=t.y+70;state.player.x=t.x+45;state.player.y=t.y+70;state.player.inTank=false;currentTown=null;sayToast('返回荒原')}
function enterInterior(type){if(state.player.inTank)return sayToast('战车不能开进建筑');state.returnPoint={x:state.player.x,y:state.player.y};state.scene='interior';state.currentInterior=type;state.player.x=W/2;state.player.y=H-90;state.player.dir=-Math.PI/2;sayToast(`进入 ${interiorName()}`);const key=`${state.townIndex}:${type}`;if(!state.roomSeen[key]){state.roomSeen[key]=true;const banter=ROOM_BANTER[type]?.filter(l=>portraitForSpeaker(l[0])&&(l[0]==='柳焰'?state.party.liuyan:l[0]==='桃夭'?state.party.taoyao:state.party.lincheng));if(banter?.length)setTimeout(()=>openDialogue(banter),140);saveSilently()}}
function leaveInterior(){state.scene='town';if(state.returnPoint){state.player.x=state.returnPoint.x;state.player.y=state.returnPoint.y+40}state.currentInterior=null;state.returnPoint=null;sayToast('回到街道')}


function talkAmbient(n){
 const idx=Math.max(0,ambientNpcData(state.townIndex).findIndex(x=>x.name===n.name));
 const canon=CANON_AMBIENT[state.townIndex]||[];
 if(canon.length && ((idx+Math.floor(state.time))%3!==0)){const l=canon[idx%canon.length];state.canon.seen['lore'+state.townIndex]=true;openDialogue([l,[n.name,CANON_TOWN_CONTEXT[state.townIndex].presence]]);saveSilently();return}
 const base=AMBIENT_LINES[idx%AMBIENT_LINES.length];
 const hour=Math.floor(state.time);
 const timeLine=hour<7?'天还没亮，荒原上的机器反而更安静。':hour>=19?'天黑以后别在城门外磨蹭。':'今天的路况比昨天好一点。';
 openDialogue([[n.name,base?.[1]||timeLine],[n.name,timeLine]]);
}
function sideJobTalk(){
 const i=state.townIndex,j=state.sideJobs[i],def=SIDE_JOBS[i];
 if(j.claimed)return openDialogue([['酒馆老板',`“${def.title}”已经结清。需要活儿的时候再来。`]]);
 if(!j.accepted){j.accepted=true;openDialogue([['酒馆老板',`有个本地委托：${def.title}。`],['酒馆老板',def.text],['系统',`目标：击破 ${def.goal} 个本地区域普通敌人。奖励 ${def.reward}G / 废料 ${def.scrap}。`]]);saveSilently();return}
 if(!j.done)return openDialogue([['酒馆老板',`进度 ${j.kills}/${def.goal}。别为了这点钱把车打废。`]]);
 j.claimed=true;state.gold+=def.reward;state.scrap+=def.scrap;state.inventory.repairKits++;state.townProgress[i].side=true;
 openDialogue([['酒馆老板',`活干得干净。${def.reward}G，外加 ${def.scrap} 份可用废料。`],['系统','额外获得：修理包 ×1。']]);saveSilently();
}
function lootFixture(f){
 const key=`${state.townIndex}:${state.currentInterior}:${f}`;
 if(state.looted[key])return false;
 state.looted[key]=true;const gain=2+Math.floor(state.townIndex/2);state.scrap+=gain;const foundKit=(f==='cabinet'||f==='locker')&&Math.random()<.6;if(foundKit)state.inventory.repairKits++;
 openDialogue([['系统',`你仔细翻找了一遍，找到可用废料 ×${gain}${foundKit?'，修理包 ×1。':'。'}`]]);saveSilently();return true;
}
function companionBanter(){
 const lines=[];const i=state.townIndex;
 if(state.party.liuyan)lines.push(['柳焰',i<4?'别把每个镇都当成临时落脚点。人会记住谁让路重新通了。':i<8?'我们走得越远，旧世界留下的东西越像在主动找我们。':'到了这里，我反而不想催你。准备好再走。']);
 if(state.party.taoyao)lines.push(['桃夭',`我刚数过，车上至少有 ${state.scrap} 份能用的废料。别全浪费在外观上。`]);
 if(state.party.lincheng)lines.push(['林澄',i<6?'每次回到有灯的地方，就检查一次伤口和睡眠。活着不是靠硬撑。':'越靠近零号堡垒，居民提到“失眠”的次数越多。']);
 if(!lines.length)lines.push(['点唱机','老磁带转了一圈，只剩鼓点和噪音。']);
 openDialogue(lines);
}

function talkNpc(o){const i=state.townIndex,p=state.townProgress[i],t=TOWNS[i];let lines=[];if(o.role==='chief'){if(i===0&&!state.party.liuyan){state.party.liuyan=true;lines=[['柳焰','醒了就别发呆。我叫柳焰，27 岁，猎人。先学会活下来，再谈赏金。'],['柳焰',t.desc],['柳焰','我跟你走一段。把这座城的三条情报拼起来，我们再出发。']]}else if(i===1&&!state.party.taoyao){state.party.taoyao=true;lines=[['桃夭','别叫我小孩。我二十二了，而且这辆破车的发动机还是我救回来的。'],['桃夭','我可以替你看发动机和载重。前提是你别把炮塞到超载。']]}else if(i===2&&!state.party.lincheng){state.party.lincheng=true;lines=[['林澄','我是林澄，25 岁。这里的人不是被打伤，是被声波拖进了昏睡。'],['林澄','我会跟队照看你们。战斗结束后，我能帮忙恢复一部分装甲和伤势。']]}else lines=[[o.name,STORY[i].chief[0]],[o.name,STORY[i].chief[1]||t.desc],[o.name,`目标：${t.boss}。去车库和酒馆继续查。`]];p.chief=true}
 else if(o.role==='mechanic'){if(p.boss&&!p.claimed){p.mechanic=true;p.claimed=true;claimTown(i);lines=[[o.name,`核心认证成功。“${t.tank}”现在归你。`],['旁白',STORY[i].after],['桃夭',state.party.taoyao?'我已经把限速器拆掉了。':'这车的限速器也被人提前拆掉了。']]}
 else{p.mechanic=true;lines=[[o.name,STORY[i].mechanic[0]],[o.name,STORY[i].mechanic[1]||`${t.boss} 身上有关键部件。`],[o.name,`击破 ${t.boss} 后把核心带回来。`]]}}
 else if(o.role==='board'){p.board=true;lines=[[o.name,STORY[i].board[0]],['系统',`目标 ${t.boss} 的位置已写入荒原导航。`]]}
 else if(o.role==='shopkeeper'){openShopMenu();return}else if(o.role==='nurse'){const heal=Math.round(tankMax()*.22);state.tank.hp=Math.min(tankMax(),state.tank.hp+heal);lines=[[o.name,`我做了快速检修，战车装甲恢复 ${heal}。`]]}else lines=[[o.name,'荒原上的人都在等路重新通起来。']];if(p.chief&&p.mechanic&&p.board&&!p.boss&&!state.killed[i])sayToast(`${t.boss} 的位置已标记`);openDialogue(lines);saveSilently()}
function claimTown(i){if(!state.owned.includes(i+1))state.owned.push(i+1);state.vehicleIndex=i+1;const rewardPart=BOSS_DROPS[i];if(rewardPart&&!state.inventory.parts.includes(rewardPart))state.inventory.parts.push(rewardPart);state.tank.hp=tankMax();state.gold+=BOSS_STATS[i].bounty;if(i<9)state.unlocked=Math.max(state.unlocked,i+2);sayToast(`获得 ${vehicle().name} / 零件 ${findPart(rewardPart)?.name||''}`);saveSilently()}
function interactFixture(f){
 if(f==='board'){const i=state.townIndex,t=TOWNS[i],p=state.townProgress[i];p.board=true;openDialogue([['悬赏板',`赏金首：${t.boss}`],['悬赏板',`悬赏金额：${BOSS_STATS[i].bounty}G。${t.desc}`]]);saveSilently();return}
 if(f==='bar')return sideJobTalk();
 if(f==='jukebox')return companionBanter();
 if(f==='locker'||f==='cabinet'||f==='crate'){if(lootFixture(f))return}
 if(f==='lift'||f==='terminal'||f==='parts'){openGarageMenu();return}
 if(f==='counter'||f==='shelf'){openShopMenu();return}
 if(f==='bed'){const heal=Math.round(tankMax()*.18);state.tank.hp=Math.min(tankMax(),state.tank.hp+heal);sayToast(`护理/检修恢复 ${heal} 装甲`);return}
 openDialogue([['系统',`你检查了${fixtureName(f)}，没有发现新的东西。`]])
}

function openDialogue(lines){dialogue={lines:lines.map(normalizeDialogueLine),idx:0,char:0,t:0};mode='dialogue';$('shell').classList.add('dialogue-mode');setHint('A 继续 · B 关闭')}
function advanceDialogue(){if(!dialogue)return;const cur=dialogue.lines[dialogue.idx];if(dialogue.char<cur.text.length){dialogue.char=cur.text.length;return}dialogue.idx++;dialogue.char=0;dialogue.t=0;if(dialogue.idx>=dialogue.lines.length)closeDialogue()}
function closeDialogue(){dialogue=null;mode='play';$('shell').classList.remove('dialogue-mode');setHint('方向键移动 · A 互动 · B 菜单')}
function drawPortraitPanel(key){const meta=PORTRAIT_META[key],img=PORTRAITS[key];if(!meta||!img||!img.complete||!img.naturalWidth)return false;const x=16,y=74,w=284,h=379;ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.imageSmoothingEnabled=true;ctx.drawImage(img,x,y,w,h);const g=ctx.createLinearGradient(x+w*.58,y,x+w,y);g.addColorStop(0,'rgba(8,10,8,0)');g.addColorStop(1,'rgba(8,10,8,.92)');ctx.fillStyle=g;ctx.fillRect(x,y,w,h);const gb=ctx.createLinearGradient(0,y+h-110,0,y+h);gb.addColorStop(0,'rgba(8,10,8,0)');gb.addColorStop(1,'rgba(8,10,8,.94)');ctx.fillStyle=gb;ctx.fillRect(x,y+h-110,w,110);ctx.restore();ctx.imageSmoothingEnabled=false;ctx.strokeStyle=meta.accent;ctx.lineWidth=2;ctx.strokeRect(x+.5,y+.5,w-1,h-1);return true}
function drawDialogue(dt){if(!dialogue)return;dialogue.t+=dt;const line=dialogue.lines[dialogue.idx];if(dialogue.t>.016&&dialogue.char<line.text.length){dialogue.char++;dialogue.t=0}const hasPortrait=drawPortraitPanel(line.portrait);const x=hasPortrait?280:82,y=310,w=hasPortrait?500:710,h=172;ctx.fillStyle='#090c0af3';ctx.fillRect(x,y,w,h);ctx.strokeStyle=hasPortrait?(PORTRAIT_META[line.portrait]?.accent||'#d3b96f'):'#d3b96f';ctx.lineWidth=2;ctx.strokeRect(x,y,w,h);ctx.fillStyle='#1d241edc';ctx.fillRect(x+18,y-18,180,30);ctx.strokeStyle='#6f785f';ctx.strokeRect(x+18,y-18,180,30);ctx.fillStyle='#f1cb73';ctx.font='bold 18px sans-serif';ctx.textAlign='left';ctx.fillText(line.speaker,x+31,y+4);ctx.fillStyle='#f2f0e7';ctx.font='15px sans-serif';wrapText(line.text.slice(0,dialogue.char),x+28,y+43,w-55,24);ctx.fillStyle='#a7ad9e';ctx.font='11px sans-serif';ctx.textAlign='right';ctx.fillText(dialogue.idx===dialogue.lines.length-1?'A 结束':'A 继续',x+w-24,y+h-18)}
function wrapText(text,x,y,maxWidth,lineHeight){let line='';for(const ch of text){const test=line+ch;if(ctx.measureText(test).width>maxWidth){ctx.fillText(line,x,y);line=ch;y+=lineHeight}else line=test}ctx.fillText(line,x,y)}

const baseMenu=['继续游戏','任务日志','战车状态','同伴档案','零件仓库','装备改造','世界档案','保存游戏'];
function openMenu(){menu={items:baseMenu,sel:0,sub:null};mode='menu';setHint('方向键选择 · A 确认 · B 返回')}
function closeMenu(){menu=null;mode='play';setHint('方向键移动 · A 互动 · B 菜单')}
function menuMove(d){if(mode==='menu'){const arr=menu.sub?.items||menu.items;menu.sel=(menu.sel+d+arr.length)%arr.length}else if(mode==='battle')battle.sel=(battle.sel+d+battle.actions.length)%battle.actions.length}
function menuConfirm(){if(menu.shop){shopConfirm();return}if(menu.sub){if(menu.sub.onSelect)menu.sub.onSelect(menu.sel);return}if(menu.garage){if(menu.sel===0)openPartsMenu();else if(menu.sel===1)openUpgradeSub();else if(menu.sel===2)openVehicleSwitch();else if(menu.sel===3){const cost=Math.max(80,Math.round((tankMax()-state.tank.hp)*.45));if(state.gold<cost)return sayToast(`补满装甲需要 ${cost}G`);state.gold-=cost;state.tank.hp=tankMax();sayToast('装甲已补满');saveSilently()}else closeMenu();return}switch(menu.sel){case 0:closeMenu();break;case 1:menu.sub={title:'任务日志',items:[questText()],onSelect:()=>{}};menu.sel=0;break;case 2:menu.sub={title:'战车状态',items:[tankStatusText(),`载重 ${loadUsed().toFixed(1)} / ${loadMax().toFixed(1)} t`],onSelect:()=>{}};menu.sel=0;break;case 3:openCompanionMenu();break;case 4:openPartsMenu();break;case 5:openUpgradeSub();break;case 6:openWorldCodex();break;case 7:save();closeMenu();break}}
function questText(){const i=state.townIndex,t=TOWNS[i],p=state.townProgress[i],j=state.sideJobs[i],side=j.accepted&&!j.claimed?`｜本地委托 ${j.kills}/${SIDE_JOBS[i].goal}`:'';if(p.claimed)return`${t.name} 主线已完成${side}。${CANON_TOWN_CONTEXT[i].tag}｜前往下一座城镇。`;if(p.boss)return`返回 ${t.name} 的车库交付核心${side}。`;if(p.chief&&p.mechanic&&p.board)return`驾驶战车追猎：${t.boss}${side}`;return`进入公会、车库和酒馆，收集 ${t.boss} 的三条情报${side}。`}
function tankStatusText(){return`${tankName()}  装甲 ${Math.ceil(state.tank.hp)}/${tankMax()}  防御 ${tankDef()}  主炮 ${equipped('main').name}  副炮 ${equipped('sub').name}  SE ${equipped('se').name}`}
function openCompanionMenu(){const items=[];if(state.party.liuyan)items.push('柳焰｜赏金首伤害 +8%');else items.push('柳焰｜尚未加入');if(state.party.taoyao)items.push('桃夭｜战车载重 +2.0t');else items.push('桃夭｜尚未加入');if(state.party.lincheng)items.push('林澄｜胜利后恢复 18% 装甲');else items.push('林澄｜尚未加入');menu.sub={title:'同伴档案',items,onSelect:()=>{}};menu.sel=0}
function openWorldCodex(){
 const unlocked=CANON_CODEX.map((e,i)=>{
  if(i===6&&!state.canon.zeroKnown)return '???｜零号协议（继续探索以解锁）';
  if(i===5&&!state.canon.oldTimerMet)return '???｜旧历人（继续探索以解锁）';
  return e[0];
 });
 menu.sub={title:'世界档案｜公元2128',items:unlocked,onSelect:(idx)=>{
  if(idx===6&&!state.canon.zeroKnown)return sayToast('档案尚未获得');
  if(idx===5&&!state.canon.oldTimerMet)return sayToast('档案尚未获得');
  const e=CANON_CODEX[idx];if(!e)return;menu=null;mode='play';openDialogue([['档案',e[1]],['猎人公会','你不需要加入任何一方。委托只记录事情、人和结果。']]);
 }};menu.sel=0
}

function openPartsMenu(){const owned=state.inventory.parts.map(findPart).filter(Boolean);menu.sub={title:'零件仓库',items:owned.map(p=>`${PART_LABEL[p.type]}｜${p.name}${state.tank.equipped[p.type]===p.id?'  [已装备]':''}`),onSelect:(idx)=>{const p=owned[idx];if(!p)return;const old=equipped(p.type);const currentLoad=loadUsed()-(old.weight||0)+(p.weight||0);if(currentLoad>loadMax()&&p.type!=='engine'){sayToast(`超载：${currentLoad.toFixed(1)} / ${loadMax().toFixed(1)}t`);return}state.tank.equipped[p.type]=p.id;if(state.tank.hp>tankMax())state.tank.hp=tankMax();sayToast(`装备 ${p.name}`);saveSilently();openPartsMenu()}};menu.sel=0}
function openUpgradeSub(){const labels=['主炮','副炮','SE','装甲','发动机'],keys=['main','sub','se','armor','engine'];const items=keys.map((k,idx)=>{const lv=state.tank.upgrades[k],cost=600+420*(lv+state.townIndex),scrapNeed=2+state.townIndex+lv*2;return`${labels[idx]} +${lv}${lv<5?` → +${lv+1}｜${cost}G / ${scrapNeed}废料`:'｜MAX'}`});menu.sub={title:'装备改造',items,onSelect:(idx)=>{const k=keys[idx],lv=state.tank.upgrades[k],cost=600+420*(lv+state.townIndex),scrapNeed=2+state.townIndex+lv*2;if(lv>=5)return sayToast('已达到 +5');if(state.gold<cost)return sayToast(`资金不足，需要 ${cost}G`);if(state.scrap<scrapNeed)return sayToast(`废料不足，需要 ${scrapNeed}`);state.gold-=cost;state.scrap-=scrapNeed;state.tank.upgrades[k]++;if(k==='armor')state.tank.hp=tankMax();sayToast(`${labels[idx]} +${state.tank.upgrades[k]} 完成`);saveSilently();openUpgradeSub()}};menu.sel=0}
function openVehicleSwitch(){const owned=state.owned.slice();menu.sub={title:'切换战车',items:owned.map(i=>`${VEHICLES[i].name}${i===state.vehicleIndex?'  [当前]':''}`),onSelect:(idx)=>{const vi=owned[idx];if(vi===undefined)return;state.vehicleIndex=vi;state.tank.hp=Math.min(state.tank.hp,tankMax());sayToast(`切换到 ${vehicle().name}`);saveSilently();openVehicleSwitch()}};menu.sel=0}
function openGarageMenu(){openMenu();menu.items=['零件仓库','装备改造','切换战车','补满装甲','返回'];menu.garage=true;menu.sel=0}
function openShopMenu(){const i=state.townIndex,cost=500+i*380;menu={items:['修理包｜180G',`标准副炮｜${cost}G`,`标准 SE｜${cost}G`,'返回'],sel:0,sub:null,shop:true};mode='menu'}
function shopConfirm(){const i=state.townIndex;if(menu.sel===0){if(state.gold<180)return sayToast('资金不足');state.gold-=180;state.inventory.repairKits++;sayToast('获得修理包');saveSilently()}else if(menu.sel===1||menu.sel===2){const type=menu.sel===1?'sub':'se',p=chapterPart(type,i),cost=500+i*380;if(state.inventory.parts.includes(p.id))return sayToast('已经拥有');if(state.gold<cost)return sayToast(`需要 ${cost}G`);state.gold-=cost;state.inventory.parts.push(p.id);sayToast(`购买 ${p.name}`);saveSilently()}else closeMenu()}
function drawMenu(){if(!menu)return;ctx.fillStyle='#070907ef';ctx.fillRect(0,0,W,H);const x=185,y=34,w=590,h=470;ctx.fillStyle='#151a16';ctx.fillRect(x,y,w,h);ctx.strokeStyle='#b99b58';ctx.strokeRect(x,y,w,h);ctx.fillStyle='#e6c66e';ctx.font='bold 22px sans-serif';ctx.textAlign='left';ctx.fillText(menu.sub?.title||'猎人终端',x+28,y+42);const items=menu.sub?.items||menu.items;items.slice(0,9).forEach((it,i)=>{const yy=y+88+i*47;ctx.fillStyle=i===menu.sel?'#62502f':'#242b24';ctx.fillRect(x+25,yy-28,w-50,38);ctx.fillStyle=i===menu.sel?'#fff1bd':'#e4e6dd';ctx.font='14px sans-serif';ctx.fillText(it,x+42,yy-3)});if(menu.sub?.title==='零件仓库'){const owned=state.inventory.parts.map(findPart).filter(Boolean),p=owned[menu.sel];if(p){const cur=equipped(p.type);ctx.fillStyle='#aeb5a8';ctx.font='12px sans-serif';let text=p.type==='main'||p.type==='sub'||p.type==='se'?`火力 ${cur.power||0}→${p.power||0}  重量 ${(cur.weight||0).toFixed(1)}→${(p.weight||0).toFixed(1)}t  命中 ${cur.acc||0}→${p.acc||0}%`:(p.type==='engine'?`载重加成 +${cur.capacity||0}→+${p.capacity||0}t  自重 ${(cur.weight||0).toFixed(1)}→${(p.weight||0).toFixed(1)}t`:(p.type==='cunit'?`命中 +${cur.acc||0}→+${p.acc||0}%  暴击 +${cur.crit||0}→+${p.crit||0}%`:`装甲 +${cur.hp||0}→+${p.hp||0}  防御 +${cur.def||0}→+${p.def||0}`));ctx.fillText(`当前：${cur.name} ｜ ${text}`,x+30,y+h-48)}}ctx.fillStyle='#929b8e';ctx.font='11px sans-serif';ctx.fillText('▲▼ 选择   A 确认   B 返回',x+28,y+h-20)}

function startRandomBattle(){if(!state.player.inTank)return;const i=Math.min(state.townIndex,9),names=['锈壳无人车','盐地掠夺者','废土广播机','矿井守卫','竞技逃亡车','风场无人机','冻原猎杀犬','炼城喷火车','磁轨警戒机','零号守卫'];startBattle({name:names[i],hp:180+i*155,atk:18+i*11,boss:false,reward:90+i*65})}
function startBossBattle(i){const s=BOSS_STATS[i];const pre=i===9?[['柳焰','我们不是来替任何人拿走零号协议。利维坦-零正在把附近聚居区标成清除目标——这就够了。'],['系统','公会委托：终止利维坦-零的清除协议。']]:i>=8?[['档案员','三大势力都想要里面的数据。但公会的委托只有一行：把还活着的人带回来。']]:[['柳焰',`目标确认：${TOWNS[i].boss}。`]];openDialogue([...pre,['桃夭',state.party.taoyao?'火控上线。别把我刚修好的车撞烂。':'火控系统锁定。'],['系统','赏金首战开始。']]);const wait=()=>{if(mode==='play')startBattle({name:TOWNS[i].boss,hp:s.hp,atk:s.atk,boss:true,reward:s.bounty,town:i});else setTimeout(wait,60)};setTimeout(wait,60)}
function startBattle(e){battle={enemy:{...e,max:e.hp},actions:['主炮','副炮','SE','修理包','撤退'],sel:0,log:`遭遇 ${e.name}！`,win:false};mode='battle';setHint('方向键选择 · A 确认 · B 返回')}
function battleConfirm(){if(!battle)return;if(battle.win){endBattle();return}const a=battle.sel;if(a<3){const slot=['main','sub','se'][a],p=equipped(slot),c=equipped('cunit'),hit=clamp((p.acc||90)+(c.acc||0),60,99);if(Math.random()*100>hit){battle.log=`${p.name} 射击偏离。`;enemyTurn();return}let dmg=tankAtk(slot);const crit=Math.random()*100<(p.crit||0)+(c.crit||0);if(crit)dmg=Math.round(dmg*1.7);if(battle.enemy.boss){dmg=Math.round(dmg*(1+(c.boss||0)/100));if(state.party.liuyan)dmg=Math.round(dmg*1.08)}dmg=Math.round(dmg*rnd(.9,1.12));battle.enemy.hp-=dmg;battle.log=`${p.name}${crit?' 暴击':''}，造成 ${dmg} 伤害。`;if(battle.enemy.hp<=0)return winBattle();enemyTurn()}else if(a===3){if(state.inventory.repairKits<=0){battle.log='没有修理包。';return}state.inventory.repairKits--;const heal=Math.round(tankMax()*.32);state.tank.hp=Math.min(tankMax(),state.tank.hp+heal);battle.log=`紧急修理恢复 ${heal} 装甲。`;enemyTurn()}else{if(battle.enemy.boss)battle.log='赏金首战无法撤退。';else if(Math.random()<.75){battle=null;mode='play';sayToast('成功撤退')}else{battle.log='撤退失败。';enemyTurn()}}}
function battleBack(){if(battle&&!battle.enemy.boss)battle.sel=battle.actions.length-1}
function enemyTurn(){if(!battle)return;let dmg=Math.max(1,Math.round(battle.enemy.atk*rnd(.84,1.2)-tankDef()));state.tank.hp-=dmg;battle.log+=`  ${battle.enemy.name} 反击 -${dmg}`;if(state.tank.hp<=0){state.tank.hp=Math.round(tankMax()*.45);state.player.inTank=false;battle=null;mode='play';const t=TOWNS[state.townIndex];state.scene='world';state.tank.x=t.x+70;state.tank.y=t.y+70;state.player.x=t.x+25;state.player.y=t.y+70;state.gold=Math.max(0,state.gold-300);sayToast('战车大破，被拖回附近道路')}}
function winBattle(){const e=battle.enemy;state.gold+=e.reward;const i=state.townIndex;const salvage=e.boss?3+Math.floor(i/2):1+Math.floor(i/3);state.scrap+=salvage;if(e.boss){const bi=e.town;state.killed[bi]=true;state.townProgress[bi].boss=true;const drop=BOSS_DROPS[bi];if(drop&&!state.inventory.parts.includes(drop))state.inventory.parts.push(drop);battle.log=`${e.name} 被击破！掉落：${findPart(drop)?.name||'核心'} / 废料 +${salvage}。返回 ${TOWNS[bi].name} 交付。`;if(state.party.lincheng)state.tank.hp=Math.min(tankMax(),state.tank.hp+Math.round(tankMax()*.18))}else{const j=state.sideJobs[i];if(j?.accepted&&!j.done){j.kills++;if(j.kills>=SIDE_JOBS[i].goal){j.done=true;battle.log=`敌人被击破！获得 ${e.reward}G / 废料 +${salvage}。本地委托已完成，回酒馆领奖。`}else battle.log=`敌人被击破！获得 ${e.reward}G / 废料 +${salvage}。委托进度 ${j.kills}/${SIDE_JOBS[i].goal}。`}else battle.log=`敌人被击破！获得 ${e.reward}G / 废料 +${salvage}。`}battle.win=true;saveSilently()}
function endBattle(){battle=null;mode='play';setHint('方向键移动 · A 互动 · B 菜单')}
function drawBossSprite(x,y,name){ctx.save();ctx.translate(x,y);ctx.fillStyle='#7e2f2a';ctx.fillRect(-65,-26,130,52);ctx.fillStyle='#161916';ctx.fillRect(-55,26,40,14);ctx.fillRect(15,26,40,14);ctx.fillStyle='#a69375';ctx.fillRect(-13,-48,26,26);ctx.fillRect(9,-39,76,8);ctx.fillStyle='#d75944';ctx.fillRect(-46,-18,15,8);ctx.restore()}
function drawBattle(){if(!battle)return;ctx.fillStyle='#443a2d';ctx.fillRect(0,0,W,H);ctx.fillStyle='#73603d';ctx.fillRect(0,330,W,210);drawTankModel(170,285,0,state.vehicleIndex,1.9,false);drawBossSprite(735,255,battle.enemy.name);ctx.fillStyle='#0c0f0cdd';ctx.fillRect(35,28,890,78);ctx.fillStyle='#f1d075';ctx.font='bold 20px sans-serif';ctx.textAlign='left';ctx.fillText(battle.enemy.name,55,58);ctx.fillStyle='#44231f';ctx.fillRect(55,72,420,14);ctx.fillStyle='#c85045';ctx.fillRect(55,72,420*clamp(battle.enemy.hp/battle.enemy.max,0,1),14);ctx.fillStyle='#fff';ctx.font='12px sans-serif';ctx.fillText(`${Math.max(0,Math.round(battle.enemy.hp))}/${battle.enemy.max}`,490,84);ctx.fillStyle='#101410ef';ctx.fillRect(25,355,910,160);ctx.strokeStyle='#6f795f';ctx.strokeRect(25,355,910,160);battle.actions.forEach((a,i)=>{const col=i%3,row=Math.floor(i/3),x=52+col*286,y=392+row*52;ctx.fillStyle=i===battle.sel?'#765b2e':'#283028';ctx.fillRect(x,y,260,38);ctx.fillStyle='#fff';ctx.font='15px sans-serif';ctx.fillText(a,x+16,y+25)});ctx.fillStyle='#d7d8ce';ctx.font='13px sans-serif';wrapText(battle.log,52,340,820,18);if(battle.win){ctx.fillStyle='#f6dd8d';ctx.font='bold 16px sans-serif';ctx.fillText('A：结束战斗',745,340)}}

function drawPrompt(){if(mode!=='play')return;const i=nearestInteractable();if(!i)return;const f=state.player.inTank?state.tank:state.player,p=screenPos(f.x,f.y);ctx.fillStyle='#111b';ctx.fillRect(p.x-76,p.y-60,152,24);ctx.fillStyle='#f4d477';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillText(`A ${i.name||'互动'}`,p.x,p.y-43)}
function render(dt){ctx.clearRect(0,0,W,H);if(mode==='battle')drawBattle();else{if(state.scene==='world')drawWorld();else if(state.scene==='town')drawTown();else drawInterior();drawPrompt();if(mode==='dialogue')drawDialogue(dt);if(mode==='menu')drawMenu()}if(toast.t>0){toast.t-=dt;ctx.fillStyle='#0b0e0be8';ctx.fillRect(W/2-235,105,470,38);ctx.strokeStyle='#776a48';ctx.strokeRect(W/2-235,105,470,38);ctx.fillStyle='#fff0bd';ctx.font='13px sans-serif';ctx.textAlign='center';ctx.fillText(toast.text,W/2,130)}updateHud()}
function loop(t){const dt=Math.min(.033,(t-last)/1000);last=t;updateMovement(dt);render(dt);requestAnimationFrame(loop)}
function setDir(dir,on){keys[dir]=on}
document.querySelectorAll('[data-dir]').forEach(btn=>{const d=btn.dataset.dir;const down=e=>{e.preventDefault();if(mode==='menu'||mode==='battle'){if(['up','left'].includes(d))menuMove(-1);else menuMove(1);return}setDir(d,true);btn.classList.add('active')},up=e=>{e.preventDefault();setDir(d,false);btn.classList.remove('active')};btn.addEventListener('pointerdown',down);btn.addEventListener('pointerup',up);btn.addEventListener('pointercancel',up);btn.addEventListener('pointerleave',up)});
$('btnA').addEventListener('pointerdown',e=>{e.preventDefault();$('btnA').classList.add('active');pressA()});$('btnA').addEventListener('pointerup',()=>$('btnA').classList.remove('active'));
$('btnB').addEventListener('pointerdown',e=>{e.preventDefault();$('btnB').classList.add('active');pressB()});$('btnB').addEventListener('pointerup',()=>$('btnB').classList.remove('active'));
$('btnMenu').onclick=openMenu;
window.addEventListener('keydown',e=>{if(['ArrowUp','w','W'].includes(e.key)){if(mode==='menu'||mode==='battle')menuMove(-1);else keys.up=true;e.preventDefault()}else if(['ArrowDown','s','S'].includes(e.key)){if(mode==='menu'||mode==='battle')menuMove(1);else keys.down=true;e.preventDefault()}else if(['ArrowLeft','a','A'].includes(e.key)){if(mode==='menu'||mode==='battle')menuMove(-1);else keys.left=true;e.preventDefault()}else if(['ArrowRight','d','D'].includes(e.key)){if(mode==='menu'||mode==='battle')menuMove(1);else keys.right=true;e.preventDefault()}else if(['Enter',' ','j','J'].includes(e.key)){pressA();e.preventDefault()}else if(['Escape','k','K'].includes(e.key)){pressB();e.preventDefault()}});
window.addEventListener('keyup',e=>{if(['ArrowUp','w','W'].includes(e.key))keys.up=false;else if(['ArrowDown','s','S'].includes(e.key))keys.down=false;else if(['ArrowLeft','a','A'].includes(e.key))keys.left=false;else if(['ArrowRight','d','D'].includes(e.key))keys.right=false});
if(!localStorage.getItem('wastelandHunterV8')&&!localStorage.getItem('wastelandHunterV7'))openDialogue([['旁白','公元 2128 年，灰烬历 64 年。旧世界死了很久，新世界却还没决定自己要长成什么样。'],['旁白','你不是士兵、修士、公司雇员，也不是新人类。至少现在还不是。你只是一个想活下去的人。'],['提示','左侧方向键连续移动；A 互动/确认；B 返回/猎人终端。建筑有真正的门，进入后要自己找 NPC。']]);
requestAnimationFrame(loop);

/* === v0.8 presentation overhaul: authored towns, richer interiors, cinematic dialogue === */
const V8_TOWN_PALETTES=[
 {ground:'#50483b',road:'#3f4240',edge:'#1f2424',accent:'#b85b3f',light:'#f0c67a',metal:'#555a58',wall:'#756451'},
 {ground:'#8a805f',road:'#59564c',edge:'#3a3a31',accent:'#d2ba74',light:'#f3d98f',metal:'#66665f',wall:'#a29067'},
 {ground:'#47404f',road:'#32343b',edge:'#1f2229',accent:'#936dd0',light:'#76d7e8',metal:'#4c5360',wall:'#655a73'},
 {ground:'#4a4640',road:'#353739',edge:'#242628',accent:'#a37a46',light:'#d2aa68',metal:'#555759',wall:'#63594f'},
 {ground:'#543d39',road:'#3d3433',edge:'#241d1c',accent:'#c86255',light:'#f2b56e',metal:'#57504e',wall:'#714841'},
 {ground:'#4d5854',road:'#363f3d',edge:'#202624',accent:'#94a69d',light:'#c9d7cf',metal:'#56625f',wall:'#66736d'},
 {ground:'#788a8f',road:'#566267',edge:'#313a3d',accent:'#bfdbe0',light:'#e9f3ef',metal:'#6d7b80',wall:'#8da2a6'},
 {ground:'#514335',road:'#393431',edge:'#25211e',accent:'#d47738',light:'#f0b06a',metal:'#5d544a',wall:'#6a533d'},
 {ground:'#454b52',road:'#30353a',edge:'#1c2024',accent:'#78a9cb',light:'#a8e2f2',metal:'#555f69',wall:'#596574'},
 {ground:'#3b4144',road:'#2b2f32',edge:'#171a1c',accent:'#b64b40',light:'#d7c09a',metal:'#4b5358',wall:'#4e565c'}
];
const V8_LAYOUTS=[
 [
  {id:'guild',name:'猎人公会',x:110,y:205,w:330,h:205,style:'warehouse'},
  {id:'garage',name:'战车车库',x:835,y:175,w:425,h:245,style:'hangar'},
  {id:'tavern',name:'酒馆',x:165,y:565,w:315,h:185,style:'bar'},
  {id:'shop',name:'补给店',x:960,y:565,w:255,h:175,style:'shop'},
  {id:'clinic',name:'诊所',x:575,y:365,w:255,h:160,style:'clinic'}
 ],
 [
  {id:'guild',name:'风塔事务所',x:920,y:170,w:300,h:190,style:'warehouse'},
  {id:'garage',name:'赤角车间',x:145,y:190,w:405,h:220,style:'hangar'},
  {id:'tavern',name:'盐灯酒馆',x:865,y:565,w:320,h:180,style:'bar'},
  {id:'shop',name:'水站补给',x:180,y:575,w:250,h:165,style:'shop'},
  {id:'clinic',name:'风塔医务间',x:575,y:390,w:250,h:155,style:'clinic'}
 ],
 [
  {id:'guild',name:'霓虹猎人站',x:120,y:160,w:305,h:195,style:'warehouse'},
  {id:'garage',name:'回声车库',x:855,y:175,w:390,h:230,style:'hangar'},
  {id:'tavern',name:'深井酒吧',x:195,y:565,w:300,h:180,style:'bar'},
  {id:'shop',name:'井口商店',x:965,y:555,w:235,h:175,style:'shop'},
  {id:'clinic',name:'林澄诊所',x:575,y:375,w:255,h:165,style:'clinic'}
 ],
 [
  {id:'guild',name:'矿工公会',x:175,y:155,w:300,h:195,style:'warehouse'},
  {id:'garage',name:'重机修理场',x:835,y:185,w:410,h:235,style:'hangar'},
  {id:'tavern',name:'黑砂食堂',x:180,y:565,w:320,h:180,style:'bar'},
  {id:'shop',name:'矿区物资站',x:935,y:575,w:275,h:165,style:'shop'},
  {id:'clinic',name:'井下救护所',x:570,y:380,w:270,h:165,style:'clinic'}
 ],
 [
  {id:'guild',name:'竞技事务所',x:850,y:175,w:335,h:195,style:'warehouse'},
  {id:'garage',name:'红罐车房',x:145,y:190,w:410,h:230,style:'hangar'},
  {id:'tavern',name:'冠军酒吧',x:860,y:565,w:315,h:185,style:'bar'},
  {id:'shop',name:'赛场商会',x:180,y:575,w:260,h:165,style:'shop'},
  {id:'clinic',name:'赛后医务室',x:580,y:390,w:245,h:155,style:'clinic'}
 ],
 [
  {id:'guild',name:'守塔所',x:145,y:180,w:305,h:195,style:'warehouse'},
  {id:'garage',name:'风机车库',x:850,y:170,w:390,h:230,style:'hangar'},
  {id:'tavern',name:'塔影酒馆',x:190,y:565,w:305,h:175,style:'bar'},
  {id:'shop',name:'电工铺',x:955,y:570,w:245,h:165,style:'shop'},
  {id:'clinic',name:'守塔医务间',x:580,y:380,w:250,h:155,style:'clinic'}
 ],
 [
  {id:'guild',name:'中继站指挥所',x:890,y:170,w:325,h:200,style:'warehouse'},
  {id:'garage',name:'雪虎车库',x:150,y:180,w:400,h:230,style:'hangar'},
  {id:'tavern',name:'暖炉酒馆',x:855,y:560,w:325,h:180,style:'bar'},
  {id:'shop',name:'冻原补给',x:180,y:575,w:270,h:160,style:'shop'},
  {id:'clinic',name:'保温医务站',x:580,y:390,w:255,h:155,style:'clinic'}
 ],
 [
  {id:'guild',name:'炼城调度所',x:150,y:175,w:315,h:195,style:'warehouse'},
  {id:'garage',name:'耐热车库',x:825,y:170,w:425,h:245,style:'hangar'},
  {id:'tavern',name:'阀门酒吧',x:185,y:560,w:320,h:180,style:'bar'},
  {id:'shop',name:'炼油商店',x:945,y:570,w:260,h:165,style:'shop'},
  {id:'clinic',name:'消防医务室',x:575,y:385,w:255,h:155,style:'clinic'}
 ],
 [
  {id:'guild',name:'天穹档案所',x:855,y:165,w:335,h:200,style:'warehouse'},
  {id:'garage',name:'轨炮车间',x:145,y:180,w:415,h:235,style:'hangar'},
  {id:'tavern',name:'断桥酒馆',x:850,y:560,w:330,h:180,style:'bar'},
  {id:'shop',name:'废都商栈',x:180,y:570,w:270,h:165,style:'shop'},
  {id:'clinic',name:'档案医务间',x:575,y:390,w:255,h:155,style:'clinic'}
 ],
 [
  {id:'guild',name:'零号前哨',x:155,y:180,w:330,h:205,style:'warehouse'},
  {id:'garage',name:'军工车库',x:820,y:165,w:435,h:250,style:'hangar'},
  {id:'tavern',name:'避难休息间',x:190,y:565,w:315,h:175,style:'bar'},
  {id:'shop',name:'军需库',x:955,y:570,w:255,h:165,style:'shop'},
  {id:'clinic',name:'战地医务室',x:575,y:390,w:255,h:155,style:'clinic'}
 ]
];
function townBuildings(i){return V8_LAYOUTS[i].map(b=>({...b,color:V8_TOWN_PALETTES[i].wall}))}
function v8RoundRect(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.stroke()}}
function v8Noise(seed,count,area,colors,alpha=.18){for(let k=0;k<count;k++){const x=area.x+((Math.sin(seed*17.13+k*91.7)*43758.5)%1+1)%1*area.w;const y=area.y+((Math.sin(seed*7.9+k*53.2)*19283.1)%1+1)%1*area.h;ctx.globalAlpha=alpha*(.45+((k*37)%100)/100);ctx.fillStyle=colors[k%colors.length];ctx.fillRect(x,y,1+(k%3),1+(k%2))}ctx.globalAlpha=1}
function v8TownGround(i){const p=V8_TOWN_PALETTES[i];ctx.fillStyle=p.ground;ctx.fillRect(0,0,W,H);const f=state.player.inTank?state.tank:state.player;const camx=clamp(f.x,W/2,1400-W/2),camy=clamp(f.y,H/2,900-H/2);
 // layered worn roads
 ctx.lineCap='round';ctx.lineJoin='round';
 const path=(pts,width,col)=>{ctx.strokeStyle=col;ctx.lineWidth=width;ctx.beginPath();pts.forEach((q,k)=>{const s=townToScreen(q[0],q[1]);k?ctx.lineTo(s.x,s.y):ctx.moveTo(s.x,s.y)});ctx.stroke()};
 path([[70,785],[340,720],[670,760],[1030,705],[1330,785]],120,p.edge);path([[70,780],[340,715],[670,755],[1030,700],[1330,780]],90,p.road);
 path([[690,840],[690,655],[710,500],[690,330],[720,115]],95,p.edge);path([[690,840],[690,655],[710,500],[690,330],[720,115]],68,p.road);
 // lane wear and drainage
 ctx.strokeStyle='rgba(220,205,160,.18)';ctx.lineWidth=3;ctx.setLineDash([18,18]);path([[95,780],[340,720],[670,760],[1030,705],[1310,780]],3,'rgba(220,205,160,.22)');ctx.setLineDash([]);
 // town border debris
 for(let x=60;x<1360;x+=80){const a=townToScreen(x,70),b=townToScreen(x,835);ctx.fillStyle='rgba(20,20,18,.34)';ctx.fillRect(a.x-16,a.y-5,32,10);ctx.fillRect(b.x-16,b.y-5,32,10)}
 // pools / stains
 for(let k=0;k<20;k++){const wx=110+((k*263)%1180),wy=130+((k*149)%650),s=townToScreen(wx,wy);ctx.fillStyle=k%3===0?'rgba(74,95,92,.23)':'rgba(35,26,22,.18)';ctx.beginPath();ctx.ellipse(s.x,s.y,16+(k%4)*7,5+(k%3)*3,k*.6,0,TAU);ctx.fill()}
 if(i===0){ // rustport shoreline / dock
   const water=townToScreen(0,0);ctx.fillStyle='#263c41';ctx.fillRect(0,0,W,Math.max(0,townToScreen(0,125).y));for(let k=0;k<18;k++){ctx.strokeStyle=`rgba(148,177,169,${.08+(k%3)*.03})`;ctx.lineWidth=2;const yy=townToScreen(0,18+k*5).y;ctx.beginPath();ctx.moveTo(0,yy);ctx.lineTo(W,yy+Math.sin(k)*3);ctx.stroke()}
   const pierY=townToScreen(0,132).y;ctx.fillStyle='#393632';ctx.fillRect(0,pierY-12,W,24);ctx.fillStyle='#6a513e';for(let x=10;x<W;x+=42)ctx.fillRect(x,pierY-8,28,16);
 }
 v8Noise(i+1,140,{x:0,y:0,w:W,h:H},['#000','#fff','#8c7655'],.04);
}
function v8DrawPropWorld(type,x,y,scale=1){const p=townToScreen(x,y);ctx.save();ctx.translate(p.x,p.y);ctx.scale(scale,scale);if(type==='crate'){ctx.fillStyle='#6a5038';ctx.fillRect(-18,-16,36,32);ctx.strokeStyle='#aa8356';ctx.strokeRect(-15,-13,30,26);ctx.beginPath();ctx.moveTo(-15,-13);ctx.lineTo(15,13);ctx.moveTo(15,-13);ctx.lineTo(-15,13);ctx.stroke()}else if(type==='barrel'){ctx.fillStyle='#4b5554';ctx.fillRect(-10,-18,20,36);ctx.strokeStyle='#8b938e';ctx.strokeRect(-10,-14,20,5);ctx.strokeRect(-10,9,20,5)}else if(type==='lamp'){ctx.strokeStyle='#242723';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,18);ctx.lineTo(0,-28);ctx.stroke();ctx.fillStyle='#e0a959';ctx.beginPath();ctx.arc(0,-32,7,0,TAU);ctx.fill();ctx.globalAlpha=.15;ctx.fillStyle='#ffd78b';ctx.beginPath();ctx.arc(0,-32,22,0,TAU);ctx.fill();ctx.globalAlpha=1}else if(type==='wreck'){ctx.fillStyle='#3e4645';ctx.fillRect(-32,-12,64,24);ctx.fillStyle='#252928';ctx.fillRect(-22,-19,28,14);ctx.fillStyle='#171a19';ctx.beginPath();ctx.arc(-20,14,9,0,TAU);ctx.arc(21,14,9,0,TAU);ctx.fill()}else if(type==='pipe'){ctx.strokeStyle='#5a5b55';ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(-40,0);ctx.lineTo(40,0);ctx.stroke();ctx.fillStyle='#7a4b37';ctx.fillRect(-18,-7,12,14);ctx.fillRect(12,-7,12,14)}ctx.restore()}
function v8DrawTownProps(i){const sets=[
 [['crate',520,230,1],['barrel',495,270,1],['wreck',1160,470,1.1],['lamp',560,690,1],['lamp',815,690,1],['pipe',510,515,1],['crate',1170,755,1],['barrel',1205,760,1],['crate',90,520,.9]],
 [['barrel',500,510,1],['lamp',690,670,1],['crate',1040,450,1],['pipe',460,730,1],['crate',1200,760,1]],
 [['lamp',690,650,1],['crate',490,470,1],['barrel',525,475,1],['pipe',1060,460,1],['crate',1160,760,1]],
 [['crate',530,500,1],['barrel',560,510,1],['wreck',1130,470,1],['lamp',680,680,1],['pipe',480,730,1]],
 [['lamp',690,680,1],['crate',510,480,1],['barrel',540,490,1],['wreck',1100,450,1],['crate',1190,755,1]],
 [['lamp',690,670,1],['wreck',1080,455,1],['pipe',480,730,1],['crate',1180,750,1]],
 [['lamp',690,680,1],['crate',500,470,1],['barrel',530,475,1],['pipe',1050,455,1]],
 [['lamp',690,670,1],['barrel',520,490,1],['pipe',1060,465,1],['crate',1180,750,1]],
 [['lamp',690,680,1],['wreck',1090,455,1],['crate',520,480,1],['pipe',470,735,1]],
 [['lamp',690,680,1],['crate',510,480,1],['barrel',540,480,1],['pipe',1070,460,1],['wreck',1160,760,1]]
 ];for(const p of sets[i]||[])v8DrawPropWorld(...p)}
function v8BuildingPalette(b,i){const p=V8_TOWN_PALETTES[i];const m={guild:['#5e5145','#2e2d2a'],garage:['#4b5050','#262a2a'],tavern:['#593b33','#271d1a'],shop:['#626447','#303126'],clinic:['#66787b','#30393b'],inn:['#6a4f3b','#271d1a'],house:['#675646','#3b3933'],warehouse:['#535b59','#262a2a']}[b.id];return{wall:m[0],roof:m[1],accent:p.accent,light:p.light}}
function drawBuilding(b){const i=currentTown?.index??state.townIndex,pc=v8BuildingPalette(b,i),p=townToScreen(b.x,b.y),door=townToScreen(b.x+b.w/2,b.y+b.h);ctx.save();
 // depth shadow
 ctx.fillStyle='rgba(0,0,0,.34)';ctx.fillRect(p.x+13,p.y+18,b.w,b.h);
 // body and roof
 ctx.fillStyle=pc.wall;ctx.fillRect(p.x,p.y,b.w,b.h);ctx.fillStyle=pc.roof;ctx.fillRect(p.x-10,p.y-14,b.w+20,30);ctx.fillStyle='rgba(255,255,255,.05)';ctx.fillRect(p.x+10,p.y+8,b.w-20,4);
 // vertical braces / rust streaks
 ctx.fillStyle='rgba(24,20,18,.35)';for(let x=18;x<b.w-10;x+=58)ctx.fillRect(p.x+x,p.y+18,5,b.h-25);
 ctx.fillStyle='rgba(122,62,42,.35)';for(let x=35;x<b.w-20;x+=87)ctx.fillRect(p.x+x,p.y+38,3,38+(x%45));
 // building-specific facade
 if(b.id==='garage'){
   ctx.fillStyle='#242827';ctx.fillRect(p.x+34,p.y+66,b.w-68,b.h-68);ctx.strokeStyle='#8e8f83';ctx.lineWidth=4;for(let k=0;k<5;k++){const xx=p.x+48+k*(b.w-96)/4;ctx.beginPath();ctx.moveTo(xx,p.y+72);ctx.lineTo(xx,p.y+b.h-12);ctx.stroke()}ctx.fillStyle=pc.accent;ctx.fillRect(p.x+30,p.y+40,118,18);ctx.fillStyle='#eee1bd';ctx.font='bold 12px sans-serif';ctx.textAlign='left';ctx.fillText('TANK SERVICE',p.x+38,p.y+53);
 }else if(b.id==='guild'){
   ctx.fillStyle='#25231f';ctx.fillRect(p.x+24,p.y+55,b.w-48,46);ctx.fillStyle=pc.accent;ctx.fillRect(p.x+24,p.y+55,8,46);ctx.fillStyle='#d6c39a';ctx.font='bold 13px sans-serif';ctx.textAlign='left';ctx.fillText('HUNTER GUILD',p.x+46,p.y+83);for(let k=0;k<3;k++){ctx.fillStyle='#b59e75';ctx.fillRect(p.x+44+k*54,p.y+118,34,46)}
 }else if(b.id==='tavern'){
   ctx.fillStyle='#211918';ctx.fillRect(p.x+18,p.y+56,b.w-36,38);ctx.fillStyle='#bc653f';ctx.fillRect(p.x+22,p.y+59,b.w-44,7);ctx.fillStyle='#e7a760';ctx.globalAlpha=.65;for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(p.x+60+k*75,p.y+76,7,0,TAU);ctx.fill()}ctx.globalAlpha=1;ctx.fillStyle='#f0cc86';ctx.font='bold 13px sans-serif';ctx.textAlign='left';ctx.fillText('RUST LANTERN',p.x+38,p.y+120);
 }else if(b.id==='clinic'){
   ctx.fillStyle='#e7e7df';ctx.fillRect(p.x+18,p.y+50,b.w-36,54);ctx.fillStyle='#b44c43';ctx.fillRect(p.x+b.w/2-8,p.y+60,16,34);ctx.fillRect(p.x+b.w/2-20,p.y+71,40,12);ctx.fillStyle='#9ec4c5';ctx.fillRect(p.x+26,p.y+118,b.w-52,15);
 }else if(b.id==='shop'){
   ctx.fillStyle='#292b22';ctx.fillRect(p.x+22,p.y+52,b.w-44,36);ctx.fillStyle='#b79b62';for(let k=0;k<4;k++)ctx.fillRect(p.x+35+k*48,p.y+102,28,35);ctx.fillStyle=pc.accent;ctx.fillRect(p.x+20,p.y+40,95,12);
 }
 // windows
 const wy=p.y+b.h-92;ctx.fillStyle='#263034';for(let k=0;k<2;k++){const wx=p.x+28+k*(b.w-84);ctx.fillRect(wx,wy,42,42);ctx.fillStyle='rgba(241,199,118,.45)';ctx.fillRect(wx+6,wy+6,30,30);ctx.fillStyle='#263034'}
 // door with lit threshold
 ctx.fillStyle='#171918';ctx.fillRect(door.x-23,door.y-54,46,54);ctx.fillStyle='rgba(239,195,108,.24)';ctx.fillRect(door.x-19,door.y-8,38,8);ctx.fillStyle='#c5ae7f';ctx.fillRect(door.x+13,door.y-29,3,3);
 // name plate, small and contextual rather than huge sign
 ctx.fillStyle='rgba(12,13,12,.74)';v8RoundRect(p.x+14,p.y+b.h+6,Math.min(b.w-28,118),24,5,'rgba(12,13,12,.74)');ctx.fillStyle='#e9d3a0';ctx.font='11px sans-serif';ctx.textAlign='left';ctx.fillText(b.name,p.x+24,p.y+b.h+22);
 ctx.restore()}
function drawTown(){const i=currentTown.index,t=currentTown;v8TownGround(i);drawTownThemeDecor(i);v8DrawTownProps(i);townBuildings(i).forEach(b=>drawBuilding(b));v8DrawLandmarks(i);
 // foreground cables / rails for depth
 const cableY=townToScreen(0,455).y;ctx.strokeStyle='rgba(35,31,28,.6)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-20,cableY);ctx.bezierCurveTo(240,cableY+35,720,cableY-20,990,cableY+16);ctx.stroke();
 getAmbientNpcs(i).forEach(n=>drawCharacter(n.model,n.x,n.y,n.dir,n.walk,.95,n.name));drawTank();if(!state.player.inTank)drawPlayer();
 // authored location tag
 v8RoundRect(18,76,266,50,9,'rgba(8,11,10,.78)','rgba(208,176,111,.35)');ctx.fillStyle='#f3d693';ctx.font='bold 16px sans-serif';ctx.textAlign='left';ctx.fillText(`${String(i+1).padStart(2,'0')}  ${t.name}`,33,98);ctx.fillStyle='#b9c0b5';ctx.font='11px sans-serif';ctx.fillText(t.theme,33,116);
 // day/night tint
 const h=state.time;if(h<6||h>19){ctx.fillStyle='rgba(20,31,48,.22)';ctx.fillRect(0,0,W,H)}
}
function ambientRoute(i,k){const routes=[[[120,470],[520,690],[850,690],[1250,475]],[[180,730],[620,600],[1030,740]],[[470,240],[690,315],[930,255]],[[95,545],[350,445],[640,530],[1010,450],[1260,550]],[[520,790],[680,660],[850,790]],[[230,330],[510,280],[840,325],[1120,275]]];const r=routes[(k+i)%routes.length];return r.map(q=>({x:q[0],y:q[1]}))}
function drawAmbientLighting(){const t=performance.now()/1000;for(let k=0;k<8;k++){const x=((k*137+Math.sin(t*.25+k)*23)%W+W)%W,y=105+(k*53)%330;ctx.globalAlpha=.06+((k%3)*.025);ctx.fillStyle='#f1d28b';ctx.beginPath();ctx.arc(x,y,18+(k%4)*6,0,TAU);ctx.fill()}ctx.globalAlpha=1}
function roomTemplate(type){const data={
 guild:{floor:'#51483d',wall:'#262421',fixtures:[['desk',550,155],['board',790,125],['bench',270,345],['locker',140,135]]},
 garage:{floor:'#474b49',wall:'#202322',fixtures:[['lift',495,250],['tool',790,120],['parts',175,145],['terminal',785,355]]},
 tavern:{floor:'#46322c',wall:'#231b19',fixtures:[['bar',680,130],['table',270,240],['table',420,350],['jukebox',125,115]]},
 shop:{floor:'#53563f',wall:'#25271f',fixtures:[['counter',650,145],['shelf',195,115],['shelf',195,245],['crate',790,350]]},
 clinic:{floor:'#607174',wall:'#293234',fixtures:[['bed',245,175],['bed',245,320],['desk',670,150],['cabinet',805,285]]}
 };return{w:960,h:540,...data[type]}}
function v8InteriorBase(type,i){const p=V8_TOWN_PALETTES[i],tpl=roomTemplate(type);ctx.fillStyle=tpl.wall;ctx.fillRect(0,0,W,H);ctx.fillStyle=tpl.floor;ctx.fillRect(34,56,W-68,H-94);
 // top wall panels / windows
 ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(34,56,W-68,52);for(let x=60;x<900;x+=120){ctx.fillStyle='rgba(255,255,255,.035)';ctx.fillRect(x,64,88,30)}
 // floor plates
 ctx.strokeStyle='rgba(220,215,190,.08)';ctx.lineWidth=1;for(let x=55;x<920;x+=70){ctx.beginPath();ctx.moveTo(x,112);ctx.lineTo(x,H-42);ctx.stroke()}for(let y=118;y<H-42;y+=55){ctx.beginPath();ctx.moveTo(42,y);ctx.lineTo(W-42,y);ctx.stroke()}
 // exit threshold
 ctx.fillStyle='#161918';ctx.fillRect(W/2-48,H-52,96,20);ctx.fillStyle=p.light;ctx.globalAlpha=.18;ctx.fillRect(W/2-42,H-52,84,8);ctx.globalAlpha=1;
 // title plaque
 v8RoundRect(20,14,310,32,7,'rgba(7,10,9,.78)','rgba(214,180,105,.24)');ctx.fillStyle='#e5ce94';ctx.font='bold 14px sans-serif';ctx.textAlign='left';ctx.fillText(`${currentTown.name}  /  ${interiorName()}`,34,35);
}
function v8FixtureGlow(x,y,c='#e2ad62'){const g=ctx.createRadialGradient(x,y,0,x,y,58);g.addColorStop(0,c+'55');g.addColorStop(1,c+'00');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,58,0,TAU);ctx.fill()}
function drawFixture(type,x,y){ctx.save();if(type==='desk'||type==='counter'||type==='bar'){ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(x-95,y-10,190,40);ctx.fillStyle=type==='bar'?'#6b3f31':'#5a4638';ctx.fillRect(x-95,y-24,190,42);ctx.fillStyle='#8f7254';ctx.fillRect(x-88,y-30,176,10);ctx.fillStyle='rgba(255,224,164,.2)';ctx.fillRect(x-75,y-28,80,4);if(type==='bar'){for(let k=0;k<8;k++){ctx.fillStyle=['#8f553c','#646d5a','#9c7c45'][k%3];ctx.fillRect(x-70+k*18,y-58-(k%2)*5,8,26+(k%2)*5)}}}
 else if(type==='board'){ctx.fillStyle='#29251f';ctx.fillRect(x-65,y-52,130,104);ctx.strokeStyle='#7d6d51';ctx.lineWidth=4;ctx.strokeRect(x-65,y-52,130,104);for(let k=0;k<7;k++){ctx.fillStyle=['#cdbb8e','#8f9b8b','#b1785d'][k%3];ctx.save();ctx.translate(x-43+(k%3)*38,y-32+Math.floor(k/3)*35);ctx.rotate((k%3-1)*.08);ctx.fillRect(-15,-11,30,22);ctx.restore()}}
 else if(type==='bench'){ctx.fillStyle='#4a4034';ctx.fillRect(x-72,y-10,144,18);ctx.fillStyle='#2c2924';ctx.fillRect(x-60,y+7,8,23);ctx.fillRect(x+52,y+7,8,23)}
 else if(type==='locker'||type==='cabinet'){ctx.fillStyle='#4c5555';ctx.fillRect(x-42,y-70,84,140);ctx.fillStyle='#29302f';ctx.fillRect(x-37,y-65,34,130);ctx.fillRect(x+3,y-65,34,130);ctx.fillStyle='#89938d';ctx.fillRect(x-8,y-4,3,3);ctx.fillRect(x+8,y-4,3,3)}
 else if(type==='lift'){ctx.fillStyle='#242826';ctx.fillRect(x-142,y-76,284,152);ctx.strokeStyle='#dbb15e';ctx.lineWidth=5;ctx.strokeRect(x-126,y-60,252,120);ctx.strokeStyle='#666b65';ctx.lineWidth=2;for(let k=-100;k<=100;k+=25){ctx.beginPath();ctx.moveTo(x+k,y-58);ctx.lineTo(x+k,y+58);ctx.stroke()}drawTankModel(x,y,0,state.vehicleIndex,1.05,false);v8FixtureGlow(x,y,'#d9a94d')}
 else if(type==='tool'){ctx.fillStyle='#493b31';ctx.fillRect(x-66,y-60,132,120);ctx.fillStyle='#181b1a';ctx.fillRect(x-56,y-50,112,100);for(let k=0;k<9;k++){ctx.strokeStyle=['#a88d64','#818b83','#b85a45'][k%3];ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x-45+(k%3)*42,y-38+Math.floor(k/3)*35);ctx.lineTo(x-35+(k%3)*42,y-18+Math.floor(k/3)*35);ctx.stroke()}}
 else if(type==='parts'){ctx.fillStyle='#343a38';ctx.fillRect(x-78,y-58,156,116);for(let k=0;k<3;k++){ctx.fillStyle='#555f5a';ctx.fillRect(x-66+k*46,y-45,34,86);ctx.fillStyle='#a8774c';ctx.fillRect(x-58+k*46,y-33,18,18);ctx.fillStyle='#90988e';ctx.fillRect(x-58+k*46,y-4,24,9)}}
 else if(type==='terminal'||type==='jukebox'){ctx.fillStyle=type==='jukebox'?'#553329':'#343b39';ctx.fillRect(x-38,y-52,76,104);ctx.fillStyle=type==='jukebox'?'#d4864f':'#68b7ad';ctx.fillRect(x-27,y-38,54,34);ctx.fillStyle='#1e2422';ctx.fillRect(x-24,y+6,48,28);v8FixtureGlow(x,y,type==='jukebox'?'#d77848':'#59b8ad')}
 else if(type==='table'){ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(x,y+8,54,20,0,0,TAU);ctx.fill();ctx.fillStyle='#624a37';ctx.beginPath();ctx.ellipse(x,y,50,35,0,0,TAU);ctx.fill();ctx.fillStyle='#a46d4a';ctx.fillRect(x-7,y-3,14,6)}
 else if(type==='shelf'){ctx.fillStyle='#4a4733';ctx.fillRect(x-76,y-50,152,100);ctx.strokeStyle='#7c7854';ctx.lineWidth=5;ctx.strokeRect(x-76,y-50,152,100);for(let row=0;row<2;row++)for(let k=0;k<5;k++){ctx.fillStyle=['#8a6b47','#6b7c6a','#9b5d47'][k%3];ctx.fillRect(x-60+k*25,y-34+row*43,14,23)}}
 else if(type==='crate'){ctx.fillStyle='#6d5138';ctx.fillRect(x-46,y-46,92,92);ctx.strokeStyle='#ac875b';ctx.lineWidth=3;ctx.strokeRect(x-38,y-38,76,76);ctx.beginPath();ctx.moveTo(x-38,y-38);ctx.lineTo(x+38,y+38);ctx.moveTo(x+38,y-38);ctx.lineTo(x-38,y+38);ctx.stroke()}
 else if(type==='bed'){ctx.fillStyle='#d7dfdc';ctx.fillRect(x-82,y-34,164,68);ctx.fillStyle='#8eabb0';ctx.fillRect(x-74,y-28,52,56);ctx.fillStyle='#4b6266';ctx.fillRect(x-78,y+30,156,5)}ctx.restore()}
function v8RoomDecor(type){const t=performance.now()/1000;if(type==='guild'){ctx.fillStyle='#3c332a';ctx.fillRect(410,78,130,18);for(let k=0;k<4;k++){ctx.fillStyle='#9b805b';ctx.fillRect(425+k*28,55,14,22)}ctx.strokeStyle='#8b7356';ctx.beginPath();ctx.moveTo(380,88);ctx.lineTo(580,88);ctx.stroke()}else if(type==='garage'){for(let k=0;k<4;k++){const x=265+k*150;ctx.strokeStyle='#1d201f';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,58);ctx.lineTo(x,98);ctx.stroke();ctx.fillStyle='#e0b66a';ctx.beginPath();ctx.arc(x,104,7,0,TAU);ctx.fill();ctx.globalAlpha=.12;ctx.beginPath();ctx.arc(x,104,38,0,TAU);ctx.fill();ctx.globalAlpha=1}for(let k=0;k<6;k++){const sx=690+Math.sin(t*2+k)*12,sy=240+k*9;ctx.fillStyle=`rgba(255,174,74,${.35-k*.04})`;ctx.fillRect(sx,sy,2,2)}}else if(type==='tavern'){ctx.fillStyle='#2c201b';ctx.fillRect(40,72,190,28);ctx.fillStyle='#c46d42';ctx.globalAlpha=.5;ctx.fillRect(55,79,160,5);ctx.globalAlpha=1;for(let k=0;k<5;k++){const x=95+k*155;v8FixtureGlow(x,120,'#d57a49')}}else if(type==='clinic'){ctx.fillStyle='#d9e5e2';ctx.globalAlpha=.12;for(let k=0;k<5;k++)ctx.fillRect(55+k*180,75,120,18);ctx.globalAlpha=1;ctx.strokeStyle='#7aa6a6';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(520,80);ctx.lineTo(520,420);ctx.stroke()}else if(type==='shop'){ctx.fillStyle='#303226';for(let k=0;k<3;k++)ctx.fillRect(420+k*145,78,100,24)}}
function drawInterior(){const type=state.currentInterior,i=state.townIndex,tpl=roomTemplate(type);v8InteriorBase(type,i);v8RoomDecor(type);tpl.fixtures.forEach(f=>drawFixture(...f));interiorNpcs(type,i).forEach(n=>drawCharacter(n.model,n.x,n.y,n.dir,n.walk,1.05,n.name));drawPlayer();
 // foreground vignette / depth
 const g=ctx.createLinearGradient(0,H-120,0,H);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.28)');ctx.fillStyle=g;ctx.fillRect(0,H-120,W,120);drawAmbientLighting();}
function v8SpeakerColor(name){if(name==='柳焰')return'#d46049';if(name==='林澄')return'#72bdb7';if(name==='桃夭')return'#d87b3f';if(name==='系统'||name==='旁白'||name==='提示')return'#c9b989';return'#caa86b'}
function v8SpeakerSide(line){if(line.side)return line.side;if(line.portrait==='lincheng')return'right';if(line.portrait==='liuyan')return'left';if(line.portrait==='taoyao')return dialogue&&dialogue.idx%2?'right':'left';return 'left'}
function v8DrawMainPortrait(key,side){const img=PORTRAITS[key];if(!img||!img.complete||!img.naturalWidth)return false;const right=side==='right',boxW=420,boxH=505,x=right?W-boxW:-25,y=10;ctx.save();ctx.imageSmoothingEnabled=true;ctx.globalAlpha=.98;ctx.filter='saturate(.92) contrast(1.04)';
 // crop rather than boxed fit: cinematic bust/full body
 const sw=img.naturalWidth,sh=img.naturalHeight,srcW=sw*.78,srcH=sh*.95,sx=right?sw-srcW:0,sy=sh*.02;ctx.drawImage(img,sx,sy,srcW,srcH,x,y,boxW,boxH);ctx.filter='none';
 // merge portrait into scene, no visible frame
 const grad=ctx.createLinearGradient(right?x:x+boxW,right?0:0,right?x+boxW:x,0);if(right){grad.addColorStop(0,'rgba(9,12,11,0)');grad.addColorStop(.72,'rgba(9,12,11,.12)');grad.addColorStop(1,'rgba(9,12,11,.96)')}else{grad.addColorStop(0,'rgba(9,12,11,.96)');grad.addColorStop(.28,'rgba(9,12,11,.12)');grad.addColorStop(1,'rgba(9,12,11,0)')}ctx.fillStyle=grad;ctx.fillRect(x,y,boxW,boxH);
 const bottom=ctx.createLinearGradient(0,y+boxH-135,0,y+boxH);bottom.addColorStop(0,'rgba(9,12,11,0)');bottom.addColorStop(1,'rgba(9,12,11,.94)');ctx.fillStyle=bottom;ctx.fillRect(x,y+boxH-135,boxW,135);ctx.restore();ctx.imageSmoothingEnabled=false;return true}
function v8DrawNpcBust(line,side){const model=(line.speaker||'').includes('技师')?'npcC':(line.speaker||'').includes('护士')||line.speaker==='诊所医生'?'npcB':'npcA',m=CHAR_MODELS[model],right=side==='right',x=right?820:140,y=265;ctx.save();ctx.translate(x,y);ctx.scale(right?-1:1,1);ctx.fillStyle='rgba(8,10,9,.55)';ctx.beginPath();ctx.arc(0,0,76,0,TAU);ctx.fill();ctx.strokeStyle=v8SpeakerColor(line.speaker);ctx.lineWidth=3;ctx.stroke();ctx.fillStyle=m.top;ctx.fillRect(-38,-10,76,70);ctx.fillStyle=m.accent;ctx.fillRect(-40,-4,15,54);ctx.fillRect(25,-4,15,54);ctx.fillStyle=m.skin;ctx.beginPath();ctx.arc(0,-42,34,0,TAU);ctx.fill();ctx.fillStyle=m.hair;ctx.beginPath();ctx.arc(0,-50,36,Math.PI,TAU);ctx.fill();ctx.fillRect(-34,-51,10,34);ctx.fillStyle='#1c1c1a';ctx.fillRect(-12,-43,5,4);ctx.fillRect(9,-43,5,4);ctx.restore()}
function drawPortraitPanel(){return false}
function drawDialogue(dt){if(!dialogue)return;dialogue.t+=dt;const line=dialogue.lines[dialogue.idx];if(dialogue.t>.018&&dialogue.char<line.text.length){dialogue.char++;dialogue.t=0}
 // cinematic mode: preserve location, dim only enough for readability
 ctx.fillStyle='rgba(4,7,7,.34)';ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(5,7,7,.88)';ctx.fillRect(0,0,W,24);ctx.fillRect(0,H-28,W,28);
 const side=v8SpeakerSide(line),hasMain=line.portrait&&v8DrawMainPortrait(line.portrait,side);if(!hasMain&&line.speaker!=='系统'&&line.speaker!=='旁白'&&line.speaker!=='提示')v8DrawNpcBust(line,side);
 const accent=v8SpeakerColor(line.speaker),panelY=337,panelH=175,portraitGap=hasMain?295:135;const x=side==='left'?portraitGap:46,w=side==='left'?W-x-42:W-portraitGap-72;
 // lower-third glass panel, not detached speech bubble
 const bg=ctx.createLinearGradient(0,panelY,0,panelY+panelH);bg.addColorStop(0,'rgba(10,13,12,.82)');bg.addColorStop(1,'rgba(5,7,7,.96)');v8RoundRect(x,panelY,w,panelH,14,bg);ctx.fillStyle=accent;ctx.fillRect(x,panelY,5,panelH);
 // name integrated into panel hierarchy
 ctx.fillStyle='#f4e7c6';ctx.font='700 20px sans-serif';ctx.textAlign='left';ctx.fillText(line.speaker,x+26,panelY+33);ctx.fillStyle=accent;ctx.fillRect(x+26,panelY+43,64,2);
 ctx.fillStyle='#f1f0e9';ctx.font='16px sans-serif';wrapText(line.text.slice(0,dialogue.char),x+26,panelY+72,w-52,27);
 ctx.fillStyle='#aeb7ad';ctx.font='11px sans-serif';ctx.textAlign='right';ctx.fillText(dialogue.idx===dialogue.lines.length-1?'A 结束  ·  B 跳过':'A 继续  ·  B 关闭',x+w-20,panelY+panelH-18);
 // tiny location tag anchors portrait to scene context
 ctx.textAlign='left';ctx.fillStyle='rgba(245,228,190,.66)';ctx.font='10px sans-serif';ctx.fillText(state.scene==='interior'?`${currentTown?.name||''} / ${interiorName()}`:(currentTown?.name||'荒原'),x+26,panelY+panelH-18);
}
function drawMenu(){if(!menu)return;ctx.fillStyle='rgba(5,8,7,.88)';ctx.fillRect(0,0,W,H);const x=92,y=48,w=776,h=438;v8RoundRect(x,y,w,h,18,'rgba(20,25,22,.97)','rgba(208,177,104,.38)');
 // left navigation rail
 ctx.fillStyle='#111612';ctx.fillRect(x+18,y+18,236,h-36);ctx.fillStyle='#e3c981';ctx.font='700 21px sans-serif';ctx.textAlign='left';ctx.fillText(menu.sub?.title||'猎人终端',x+42,y+56);ctx.fillStyle='#7f8b7f';ctx.font='11px sans-serif';ctx.fillText(`${tankName()} · ${state.gold}G · 废料 ${state.scrap}`,x+42,y+78);
 const items=menu.sub?.items||menu.items;items.slice(0,8).forEach((it,i)=>{const yy=y+118+i*42;ctx.fillStyle=i===menu.sel?'#5d4a2e':'rgba(255,255,255,.025)';v8RoundRect(x+32,yy-25,208,34,7,ctx.fillStyle);ctx.fillStyle=i===menu.sel?'#fff0c1':'#c8cec6';ctx.font='13px sans-serif';ctx.fillText(it,x+46,yy-4)});
 // right information plane
 const rx=x+278,ry=y+34,rw=w-312;ctx.fillStyle='rgba(255,255,255,.025)';v8RoundRect(rx,ry,rw,h-68,12,'rgba(255,255,255,.025)','rgba(255,255,255,.06)');ctx.fillStyle='#dfd9c9';ctx.font='bold 15px sans-serif';ctx.fillText(menu.sub?.title||'状态总览',rx+24,ry+34);ctx.fillStyle='#9ba79d';ctx.font='12px sans-serif';
 if(menu.sub?.title==='零件仓库'){const owned=state.inventory.parts.map(findPart).filter(Boolean),p=owned[menu.sel];if(p){const cur=equipped(p.type);ctx.fillText(`${PART_LABEL[p.type]} / ${p.name}`,rx+24,ry+68);ctx.fillStyle='#e7c676';ctx.font='bold 22px sans-serif';ctx.fillText(p.type==='main'||p.type==='sub'||p.type==='se'?`火力 ${p.power}`:p.type==='engine'?`载重 +${p.capacity}t`:p.type==='armor'?`装甲 +${p.hp}`:`命中 +${p.acc||0}%`,rx+24,ry+104);ctx.fillStyle='#aab2aa';ctx.font='12px sans-serif';const lines=p.type==='main'||p.type==='sub'||p.type==='se'?[`当前：${cur.name}`,`重量 ${(cur.weight||0).toFixed(1)} → ${(p.weight||0).toFixed(1)} t`,`命中 ${cur.acc||0}% → ${p.acc||0}%`,`暴击 ${cur.crit||0}% → ${p.crit||0}%`]:p.type==='engine'?[`当前：${cur.name}`,`载重 +${cur.capacity||0} → +${p.capacity||0} t`,`自重 ${(cur.weight||0).toFixed(1)} → ${(p.weight||0).toFixed(1)} t`]:p.type==='armor'?[`当前：${cur.name}`,`装甲 +${cur.hp||0} → +${p.hp||0}`,`防御 +${cur.def||0} → +${p.def||0}`]:[`当前：${cur.name}`,`命中 +${cur.acc||0}% → +${p.acc||0}%`,`暴击 +${cur.crit||0}% → +${p.crit||0}%`];lines.forEach((l,k)=>ctx.fillText(l,rx+24,ry+142+k*26))}}
 else{ctx.fillText(tankStatusText(),rx+24,ry+72);ctx.fillText(`载重 ${loadUsed().toFixed(1)} / ${loadMax().toFixed(1)}t`,rx+24,ry+104);ctx.fillText(`当前任务：${questText()}`,rx+24,ry+142)}ctx.fillStyle='#879087';ctx.font='11px sans-serif';ctx.fillText('▲▼ 选择   A 确认   B 返回',rx+24,ry+h-94)}
function drawBossSprite(x,y,name){ctx.save();ctx.translate(x,y);const t=performance.now()/1000;ctx.fillStyle='rgba(0,0,0,.32)';ctx.beginPath();ctx.ellipse(0,38,92,19,0,0,TAU);ctx.fill();ctx.fillStyle='#2a2d2c';ctx.fillRect(-72,-20,144,58);ctx.fillStyle='#8a3b31';ctx.fillRect(-62,-30,124,48);ctx.fillStyle='#b98f64';ctx.fillRect(-17,-54,38,34);ctx.fillRect(8,-45,92,10);ctx.fillStyle='#181b1a';for(let k=-55;k<=45;k+=25){ctx.fillRect(k,29,18,14)}ctx.fillStyle='#d75445';ctx.beginPath();ctx.arc(-38,-14,8+Math.sin(t*4)*1.5,0,TAU);ctx.fill();ctx.strokeStyle='rgba(255,113,74,.35)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(-38,-14,16+Math.sin(t*4)*2,0,TAU);ctx.stroke();ctx.restore()}
function drawBattle(){if(!battle)return;const i=state.townIndex,p=V8_TOWN_PALETTES[i];
 // environment-backed battle scene
 const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#806b58');sky.addColorStop(.55,p.ground);sky.addColorStop(1,p.edge);ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);for(let k=0;k<9;k++){ctx.fillStyle='rgba(20,22,21,.35)';ctx.fillRect(540+k*55,175+(k%3)*16,35,145)}ctx.fillStyle='rgba(255,210,150,.08)';ctx.beginPath();ctx.arc(760,90,120,0,TAU);ctx.fill();
 drawTankModel(165,290,0,state.vehicleIndex,2.05,false);drawBossSprite(735,270,battle.enemy.name);
 // boss HUD
 v8RoundRect(34,28,892,82,12,'rgba(8,11,10,.82)','rgba(255,255,255,.08)');ctx.fillStyle='#f1d08a';ctx.font='700 20px sans-serif';ctx.textAlign='left';ctx.fillText(battle.enemy.name,55,57);ctx.fillStyle='#4b2622';v8RoundRect(55,72,480,13,6,'#4b2622');ctx.fillStyle='#c65348';v8RoundRect(55,72,480*clamp(battle.enemy.hp/battle.enemy.max,0,1),13,6,'#c65348');ctx.fillStyle='#d9ddd7';ctx.font='11px sans-serif';ctx.fillText(`${Math.max(0,Math.round(battle.enemy.hp))} / ${battle.enemy.max}`,548,84);
 // command deck
 v8RoundRect(25,350,910,165,14,'rgba(7,10,9,.91)','rgba(255,255,255,.08)');ctx.fillStyle='#d1d6ce';ctx.font='12px sans-serif';wrapText(battle.log,48,375,840,19);battle.actions.forEach((a,k)=>{const col=k%5,x=48+col*173,y=414;const active=k===battle.sel;v8RoundRect(x,y,154,66,10,active?'#694f2f':'#202721',active?'#d0ad63':'rgba(255,255,255,.08)');ctx.fillStyle=active?'#fff0bd':'#d8ddd4';ctx.font='bold 14px sans-serif';ctx.fillText(a,x+15,y+24);ctx.fillStyle=active?'#d8bc79':'#77827a';ctx.font='10px sans-serif';const sub=k<3?`${['主炮','副炮','特殊'][k]}火力 ${tankAtk(['main','sub','se'][k])}`:k===3?`修理包 ${state.inventory.repairKits}`:'成功率 75%';ctx.fillText(sub,x+15,y+47)});if(battle.win){ctx.fillStyle='#f2d27d';ctx.font='bold 14px sans-serif';ctx.fillText('A 结束战斗',790,336)}}

const V8_LANDMARKS={
 0:[
  {id:'seawall',name:'海堤纪念墙',x:455,y:155,lines:[['旁白','盐雾把旧名字磨得只剩浅浅的刻痕。墙上仍有人每天擦去锈迹。'],['柳焰','这些人不是在纪念一座城，是在提醒自己：路断了，也得有人重新接上。']]},
  {id:'convoy',name:'烧毁的运输车',x:1145,y:475,lines:[['旁白','货仓被从侧后方精准击穿，驾驶室却几乎完整。攻击者像是在先瘫痪车辆，再等待人员下车。'],['柳焰','和传闻一样。不是疯掉的机器，是在执行一套很旧、很完整的猎杀程序。']]},
  {id:'siren',name:'海堤警报柱',x:735,y:292,lines:[['旁白','警报柱里只剩一枚还能工作的真空管。红灯每隔七秒闪一次。'],['柳焰','铁牙猎犬出现的时候，它会连续亮三次。这里的人靠这个争取四十秒关门。']]}
 ]
};
function v8DrawLandmarks(i){const list=V8_LANDMARKS[i]||[];for(const lm of list){const p=townToScreen(lm.x,lm.y);ctx.save();if(lm.id==='convoy'){ctx.fillStyle='#313937';ctx.fillRect(p.x-38,p.y-15,76,30);ctx.fillStyle='#1c211f';ctx.fillRect(p.x-26,p.y-27,32,15);ctx.fillStyle='#6e392e';ctx.fillRect(p.x+8,p.y-8,22,6);ctx.fillStyle='#151817';ctx.beginPath();ctx.arc(p.x-24,p.y+18,10,0,TAU);ctx.arc(p.x+25,p.y+18,10,0,TAU);ctx.fill()}else if(lm.id==='siren'){ctx.strokeStyle='#393d3b';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(p.x,p.y+24);ctx.lineTo(p.x,p.y-28);ctx.stroke();ctx.fillStyle='#8f3b32';ctx.beginPath();ctx.arc(p.x,p.y-34,9,0,TAU);ctx.fill();ctx.globalAlpha=.18+.1*Math.sin(performance.now()/300);ctx.fillStyle='#ef6a55';ctx.beginPath();ctx.arc(p.x,p.y-34,22,0,TAU);ctx.fill();ctx.globalAlpha=1}else{ctx.fillStyle='#524a3e';ctx.fillRect(p.x-48,p.y-26,96,52);ctx.strokeStyle='#8e7b5d';ctx.strokeRect(p.x-42,p.y-20,84,40);for(let k=0;k<5;k++){ctx.fillStyle='#a89472';ctx.fillRect(p.x-32+(k%3)*28,p.y-10+Math.floor(k/3)*18,20,3)}}const f=state.player.inTank?state.tank:state.player;if(dist(f.x,f.y,lm.x,lm.y)<115){v8RoundRect(p.x-50,p.y-60,100,22,6,'rgba(8,11,10,.76)');ctx.fillStyle='#ecd18d';ctx.font='10px sans-serif';ctx.textAlign='center';ctx.fillText(lm.name,p.x,p.y-45)}ctx.restore()}}
function nearestInteractable(){const px=state.player.inTank?state.tank.x:state.player.x,py=state.player.inTank?state.tank.y:state.player.y;if(state.scene==='world'){for(let i=0;i<state.unlocked;i++){const t=TOWNS[i];if(dist(px,py,t.x,t.y)<70)return{type:'town',town:i,name:t.name}}const i=state.townIndex,p=state.townProgress[i];if(!p.boss&&!p.claimed&&p.chief&&p.mechanic&&p.board){const b=bossPosition(i);if(dist(px,py,b.x,b.y)<78)return{type:'boss',town:i,name:TOWNS[i].boss}}}
 else if(state.scene==='town'){for(const b of townBuildings(state.townIndex)){const d=buildingDoor(b);if(dist(px,py,d.x,d.y)<54)return d}for(const n of getAmbientNpcs(state.townIndex))if(dist(px,py,n.x,n.y)<48)return{type:'ambient',name:n.name,npc:n};for(const lm of V8_LANDMARKS[state.townIndex]||[])if(dist(px,py,lm.x,lm.y)<56)return{type:'landmark',name:lm.name,landmark:lm};if(dist(px,py,700,850)<60)return{type:'exit',name:'荒原出口'}}
 else{if(dist(px,py,W/2,H-60)<62)return{type:'exitInterior',name:'离开房间'};for(const n of interiorNpcs(state.currentInterior,state.townIndex))if(dist(px,py,n.x,n.y)<60)return{type:'npc',...n};const fixtures=roomTemplate(state.currentInterior).fixtures;for(const f of fixtures){if(dist(px,py,f[1],f[2])<62)return{type:'fixture',fixture:f[0],name:fixtureName(f[0])}}}return null}
function interact(i){if(i.type==='town')return enterTown(i.town);if(i.type==='boss'){if(!state.player.inTank)return sayToast('赏金首战需要驾驶战车');return startBossBattle(i.town)}if(i.type==='exit')return leaveTown();if(i.type==='door')return enterInterior(i.building);if(i.type==='exitInterior')return leaveInterior();if(i.type==='npc')return talkNpc(i);if(i.type==='ambient')return talkAmbient(i.npc);if(i.type==='fixture')return interactFixture(i.fixture);if(i.type==='landmark')return openDialogue(i.landmark.lines)}
// authored first-town dialogue beats; other towns keep systemic content while their bespoke passes are built.
const V8_ARRIVAL_RUST=[
 dialogueLine('旁白','锈港没有城门。半截货轮横在海堤上，焊接的钢板和集装箱就是它的墙。'),
 dialogueLine('柳焰','听见那声短警报了吗？一次是运输队进港，三次才是铁牙猎犬。别把它们搞混。','liuyan'),
 dialogueLine('柳焰','先别急着接悬赏。去公会确认失踪名单，再去车库看弹孔。最后，酒馆的人会告诉你海堤什么时候最危险。','liuyan')
];
if(typeof ARRIVAL_SCENES!=='undefined')ARRIVAL_SCENES[0]=V8_ARRIVAL_RUST;
function talkNpc(o){const i=state.townIndex,p=state.townProgress[i],t=TOWNS[i];if(i!==0)return v8TalkNpcFallback(o);
 let lines=[];
 if(o.role==='chief'){
  if(!state.party.liuyan){state.party.liuyan=true;lines=[dialogueLine('柳焰','你就是昨晚从荒原拖回来的那个？还能自己走，运气不错。','liuyan'),dialogueLine('柳焰','我叫柳焰。这里的人喜欢叫我猎人，我更喜欢“还能把人带回来的人”。','liuyan'),dialogueLine('柳焰','运输队不是失踪，是被某种无人战车系统性猎杀。我们先把证据拼完整，再去碰它。','liuyan')]}else lines=[dialogueLine('柳焰','公会把最近六次遇袭时间排在一起了：都在潮位开始下降后的四十分钟。','liuyan'),dialogueLine('柳焰','这不是野兽的习惯，是程序的窗口。去车库看看弹孔，应该能确认武器型号。','liuyan')];p.chief=true
 }else if(o.role==='mechanic'){
  if(p.boss&&!p.claimed){p.mechanic=true;p.claimed=true;claimTown(i);lines=[dialogueLine(o.name,'核心认证通过。它和旧军方的沙狐底盘是一套系统。'),dialogueLine('旁白','升降台缓缓抬起，一辆低矮的沙色战车从帆布下面露出来。'),dialogueLine('柳焰','沙狐 Mk.I。小、快、能钻窄路。比你那台巡逻车像样多了。','liuyan')]
  }else{p.mechanic=true;lines=[dialogueLine(o.name,'你看这里。不是炮弹把装甲炸开，是先在履带控制器上打了一发，再补驾驶舱。'),dialogueLine(o.name,'弹芯是 75mm 自动装填炮留下的。锈港附近只有一台旧军猎杀车能做到。'),dialogueLine('柳焰','所以铁牙猎犬不是“看见谁打谁”。它知道先让车辆停下来。','liuyan')]}
 }else if(o.role==='board'){
  p.board=true;lines=[dialogueLine(o.name,'昨晚那辆车又来了。它没进城，只沿海堤灯塔外侧走了一圈。'),dialogueLine(o.name,'黄昏退潮后，它会从北堤出来，沿旧运输线巡猎。你们要去，就趁它还没转向居民区。'),dialogueLine('系统',`追猎坐标已写入战车导航：${t.boss}。`)]
 }else if(o.role==='shopkeeper'){openShopMenu();return}else if(o.role==='nurse'){const heal=Math.round(tankMax()*.22);state.tank.hp=Math.min(tankMax(),state.tank.hp+heal);lines=[dialogueLine(o.name,`先别逞强。装甲我让人补了 ${heal}，你自己也坐五分钟。`)]}else lines=[dialogueLine(o.name,'今天警报只响过一次。希望晚上也一样。')];if(p.chief&&p.mechanic&&p.board&&!p.boss&&!state.killed[i])sayToast(`${t.boss} 的巡猎窗口已确认`);openDialogue(lines);saveSilently()}
function v8TalkNpcFallback(o){const i=state.townIndex,p=state.townProgress[i],t=TOWNS[i];let lines=[];if(o.role==='chief'){if(i===1&&!state.party.taoyao){state.party.taoyao=true;lines=[['桃夭','别叫我小孩。我二十二了，而且这辆破车的发动机还是我救回来的。'],['桃夭','我可以替你看发动机和载重。前提是你别把炮塞到超载。']]}else if(i===2&&!state.party.lincheng){state.party.lincheng=true;lines=[['林澄','我是林澄，25 岁。这里的人不是被打伤，是被声波拖进了昏睡。'],['林澄','我会跟队照看你们。战斗结束后，我能帮忙恢复一部分装甲和伤势。']]}else lines=[[o.name,STORY[i].chief[0]],[o.name,STORY[i].chief[1]||t.desc],[o.name,`目标：${t.boss}。去车库和酒馆继续查。`]];p.chief=true}
 else if(o.role==='mechanic'){if(p.boss&&!p.claimed){p.mechanic=true;p.claimed=true;claimTown(i);lines=[[o.name,`核心认证成功。“${t.tank}”现在归你。`],['旁白',STORY[i].after],['桃夭',state.party.taoyao?'我已经把限速器拆掉了。':'这车的限速器也被人提前拆掉了。']]}else{p.mechanic=true;lines=[[o.name,STORY[i].mechanic[0]],[o.name,STORY[i].mechanic[1]||`${t.boss} 身上有关键部件。`],[o.name,`击破 ${t.boss} 后把核心带回来。`]]}}
 else if(o.role==='board'){p.board=true;lines=[[o.name,STORY[i].board[0]],['系统',`目标 ${t.boss} 的位置已写入荒原导航。`]]}
 else if(o.role==='shopkeeper'){openShopMenu();return}else if(o.role==='nurse'){const heal=Math.round(tankMax()*.22);state.tank.hp=Math.min(tankMax(),state.tank.hp+heal);lines=[[o.name,`我做了快速检修，战车装甲恢复 ${heal}。`]]}else lines=[[o.name,'荒原上的人都在等路重新通起来。']];if(p.chief&&p.mechanic&&p.board&&!p.boss&&!state.killed[i])sayToast(`${t.boss} 的位置已标记`);openDialogue(lines);saveSilently()}

/* === v0.9 classic foundation pass: world-map density, authored town topology, FC-style dialogue === */
const V9_TILE=32;
const V9_WORLD_W=4200,V9_WORLD_H=2200;
const V9_ROADS=[
 [[520,430],[760,390],[1010,350],[1230,330]],
 [[1230,330],[1490,340],[1720,410],[2000,470]],
 [[2000,470],[2260,505],[2520,555],[2790,620]],
 [[2790,620],[3020,710],[3270,820],[3460,920]],
 [[3460,920],[3520,1130],[3330,1320],[3050,1480]],
 [[3050,1480],[2780,1580],[2480,1680],[2220,1710]],
 [[2220,1710],[1930,1760],[1640,1700],[1380,1640]],
 [[1380,1640],[1110,1530],[820,1405],[610,1270]],
 [[610,1270],[900,1190],[1260,1120],[1580,1080],[1900,1060]],
 [[1900,1060],[1940,850],[1970,650],[2000,470]],
 [[1230,330],[1230,640],[1450,850],[1900,1060]],
 [[2790,620],[2570,820],[2300,950],[1900,1060]]
];
const V9_RIVERS=[
 [[2360,100],[2320,260],[2240,430],[2180,620],[2120,790],[2050,930],[1940,1040],[1780,1160],[1580,1250],[1370,1320],[1150,1390],[940,1510],[780,1710],[720,2090]],
 [[3600,180],[3470,320],[3350,500],[3240,650],[3140,820],[3090,1010],[2980,1180],[2810,1320],[2620,1450],[2430,1560],[2290,1710]]
];
const V9_MOUNTAIN_RANGES=[
 {pts:[[2520,260],[2680,300],[2830,380],[2950,500],[3000,610]],count:26},
 {pts:[[2450,820],[2550,900],[2680,1010],[2830,1120],[2920,1260]],count:22},
 {pts:[[700,850],[820,900],[960,930],[1100,900]],count:18},
 {pts:[[1500,1850],[1700,1880],[1900,1910],[2100,1900]],count:20}
];
const V9_WORLD_LANDMARKS=[
 {x:900,y:680,type:'ruin',name:'旧收费站'},{x:1600,y:520,type:'oasis',name:'断井绿洲'},{x:2370,y:800,type:'tower',name:'中继塔残骸'},
 {x:3270,y:1130,type:'crater',name:'巨型弹坑'},{x:2700,y:1570,type:'wind',name:'风机群'},{x:1700,y:1570,type:'refinery',name:'旧输油站'},
 {x:980,y:1210,type:'ruin',name:'坍塌高架'},{x:1910,y:920,type:'bunker',name:'封锁区'},{x:3550,y:580,type:'lake',name:'盐湖'},{x:430,y:860,type:'wreck',name:'车队坟场'}
];
function v9hash(x,y){let n=(x*374761393+y*668265263)>>>0;n=(n^(n>>>13))*1274126177>>>0;return (n^(n>>>16))>>>0}
function v9nearRoad(x,y,r=54){for(const seg of V9_ROADS){for(let i=0;i<seg.length-1;i++){const [x1,y1]=seg[i],[x2,y2]=seg[i+1],dx=x2-x1,dy=y2-y1,l2=dx*dx+dy*dy;let t=((x-x1)*dx+(y-y1)*dy)/(l2||1);t=clamp(t,0,1);const px=x1+t*dx,py=y1+t*dy;if(Math.hypot(x-px,y-py)<r)return true}}return false}
function v9Biome(x,y){
 if(y<115+55*Math.sin(x/310)+24*Math.sin(x/97))return'water';
 if(x>3990&&y<920+80*Math.sin(y/170))return'water';
 if(((x-3610)**2)/150000+((y-560)**2)/52000<1)return'water';
 if(y>1580&&x>1700&&x<2700)return'tundra';
 if(x>2900&&y>650)return'badland';
 if(x>2350&&x<3150&&y<820)return'rock';
 if(x<1320&&y<780)return x<820?'coast':'desert';
 if(x>1080&&x<1800&&y>1370)return'oil';
 if(x<1150&&y>920&&y<1580)return'forest';
 if(x>1200&&x<2450&&y<900)return'grass';
 if(x>1100&&x<1900&&y>700&&y<1400)return'steppe';
 return'plain';
}
function v9DrawTile(type,sx,sy,wx,wy){const h=v9hash(wx>>5,wy>>5),ts=V9_TILE;const n=(h&7)-3;
 const C={water:'#315b78',coast:'#7d8d62',desert:'#c4aa6a',grass:'#6c9a59',plain:'#87905a',forest:'#476d45',rock:'#77705f',badland:'#9b6847',tundra:'#a7b7ad',oil:'#67644b',steppe:'#969159'};ctx.fillStyle=C[type]||C.plain;ctx.fillRect(sx,sy,ts,ts);
 ctx.globalAlpha=.18;ctx.fillStyle=(h&1)?'#fff':'#000';ctx.fillRect(sx+(h%19),sy+((h>>>4)%19),3+(h%4),2);ctx.globalAlpha=1;
 if(type==='water'){ctx.strokeStyle='rgba(190,220,229,.28)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx+5,sy+10+(h%9));ctx.lineTo(sx+18,sy+10+(h%9));ctx.stroke()}
 else if(type==='forest'&&h%3){ctx.fillStyle='#284d37';ctx.fillRect(sx+13,sy+17,4,9);ctx.beginPath();ctx.moveTo(sx+15,sy+4);ctx.lineTo(sx+6,sy+20);ctx.lineTo(sx+24,sy+20);ctx.closePath();ctx.fill()}
 else if(type==='desert'&&h%4===0){ctx.strokeStyle='#9b824f';ctx.beginPath();ctx.arc(sx+15,sy+18,9,Math.PI,TAU);ctx.stroke()}
 else if(type==='tundra'){ctx.fillStyle='rgba(231,239,231,.34)';ctx.fillRect(sx+4,sy+4,8+(h%12),4)}
 else if(type==='oil'&&h%5===0){ctx.fillStyle='rgba(35,34,26,.45)';ctx.beginPath();ctx.ellipse(sx+18,sy+18,10,5,.2,0,TAU);ctx.fill()}
 else if(type==='badland'&&h%4===1){ctx.fillStyle='#704838';ctx.fillRect(sx+6,sy+22,20,3)}
}
function v9WorldPath(points,color,width){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();points.forEach((p,i)=>{const s=worldToScreen(p[0],p[1]);i?ctx.lineTo(s.x,s.y):ctx.moveTo(s.x,s.y)});ctx.stroke()}
function v9DrawMountain(x,y,s=1){const p=worldToScreen(x,y);if(p.x<-30||p.y<-30||p.x>W+30||p.y>H+30)return;ctx.fillStyle='#5e594e';ctx.beginPath();ctx.moveTo(p.x-12*s,p.y+10*s);ctx.lineTo(p.x,p.y-13*s);ctx.lineTo(p.x+13*s,p.y+10*s);ctx.closePath();ctx.fill();ctx.fillStyle='#8a8270';ctx.beginPath();ctx.moveTo(p.x-2*s,p.y-8*s);ctx.lineTo(p.x,p.y-13*s);ctx.lineTo(p.x+5*s,p.y-4*s);ctx.lineTo(p.x+1*s,p.y-1*s);ctx.closePath();ctx.fill()}
function v9DrawMountains(){for(const r of V9_MOUNTAIN_RANGES){for(let i=0;i<r.count;i++){const a=r.pts[i%(r.pts.length)],b=r.pts[(i+1)%r.pts.length],t=(i%7)/7;const x=a[0]*(1-t)+b[0]*t+((v9hash(i,r.count)%80)-40),y=a[1]*(1-t)+b[1]*t+((v9hash(r.count,i)%70)-35);v9DrawMountain(x,y,.8+(i%3)*.14)}}}
function v9DrawRoads(){for(const r of V9_ROADS){v9WorldPath(r,'#5a4938',26);v9WorldPath(r,'#aa8d5e',18);v9WorldPath(r,'rgba(210,188,137,.35)',3)}}
function v9DrawRivers(){for(const r of V9_RIVERS){v9WorldPath(r,'#1d4059',24);v9WorldPath(r,'#4c819c',16);v9WorldPath(r,'rgba(190,220,229,.22)',3)}}
function v9DrawWorldLandmark(lm){const p=worldToScreen(lm.x,lm.y);if(p.x<-60||p.y<-60||p.x>W+60||p.y>H+60)return;ctx.save();ctx.translate(p.x,p.y);ctx.fillStyle='rgba(22,22,19,.35)';ctx.beginPath();ctx.ellipse(0,15,20,7,0,0,TAU);ctx.fill();ctx.strokeStyle='#332f28';ctx.fillStyle='#665c4b';if(lm.type==='ruin'){ctx.fillRect(-14,-10,28,22);ctx.clearRect(-5,-4,8,10);ctx.fillStyle='#3d3b35';ctx.fillRect(6,-22,5,20)}else if(lm.type==='oasis'){ctx.fillStyle='#2f6f73';ctx.beginPath();ctx.ellipse(0,5,22,10,0,0,TAU);ctx.fill();ctx.fillStyle='#3f7046';ctx.fillRect(-3,-22,6,22);ctx.beginPath();ctx.arc(0,-22,11,0,TAU);ctx.fill()}else if(lm.type==='tower'){ctx.strokeStyle='#4c4d48';ctx.lineWidth=3;ctx.strokeRect(-8,-30,16,40);ctx.beginPath();ctx.moveTo(-8,-10);ctx.lineTo(8,-20);ctx.moveTo(8,-10);ctx.lineTo(-8,-20);ctx.stroke()}else if(lm.type==='crater'){ctx.strokeStyle='#4e3a31';ctx.lineWidth=6;ctx.beginPath();ctx.ellipse(0,4,25,13,0,0,TAU);ctx.stroke()}else if(lm.type==='wind'){for(let k=-1;k<=1;k++){ctx.strokeStyle='#5d625d';ctx.beginPath();ctx.moveTo(k*13,15);ctx.lineTo(k*13,-22);ctx.stroke();ctx.beginPath();ctx.moveTo(k*13,-22);ctx.lineTo(k*13+15,-14);ctx.moveTo(k*13,-22);ctx.lineTo(k*13-12,-10);ctx.stroke()}}else if(lm.type==='refinery'){ctx.fillStyle='#5e5144';ctx.fillRect(-16,-18,9,32);ctx.fillRect(4,-28,10,42);ctx.strokeStyle='#7c5b3f';ctx.beginPath();ctx.moveTo(9,-28);ctx.lineTo(18,-38);ctx.stroke()}else if(lm.type==='bunker'){ctx.fillStyle='#50534e';ctx.fillRect(-22,-4,44,18);ctx.fillStyle='#262a28';ctx.fillRect(-9,-18,18,14)}else if(lm.type==='wreck'){ctx.fillStyle='#4d514c';ctx.fillRect(-22,-4,44,15);ctx.fillStyle='#1f2220';ctx.beginPath();ctx.arc(-14,12,7,0,TAU);ctx.arc(14,12,7,0,TAU);ctx.fill()}ctx.restore();const f=state.player.inTank?state.tank:state.player;if(dist(f.x,f.y,lm.x,lm.y)<155){ctx.fillStyle='rgba(8,9,8,.78)';ctx.fillRect(p.x-42,p.y-45,84,18);ctx.fillStyle='#e6d59b';ctx.font='10px monospace';ctx.textAlign='center';ctx.fillText(lm.name,p.x,p.y-32)}}
function v9DrawTownMarker(t,i){const p=worldToScreen(t.x,t.y);ctx.save();ctx.translate(p.x,p.y);const c=['#8b7451','#b0a269','#675c73','#605a50','#8e4f43','#65736d','#9aaeb0','#806044','#606977','#4a5054'][i];ctx.fillStyle='#292a25';ctx.fillRect(-25,-13,50,29);ctx.fillStyle=c;ctx.fillRect(-20,-10,17,18);ctx.fillRect(3,-12,19,20);ctx.fillStyle='#3c342c';ctx.fillRect(-22,-17,21,7);ctx.fillRect(1,-20,23,9);ctx.fillStyle='#d7c990';ctx.fillRect(-15,0,5,7);ctx.fillRect(10,-1,5,8);ctx.strokeStyle='rgba(239,219,161,.5)';ctx.strokeRect(-27,-22,54,40);ctx.restore();ctx.fillStyle='rgba(8,9,8,.84)';ctx.fillRect(p.x-42,p.y-47,84,18);ctx.fillStyle='#f0dfab';ctx.font='bold 11px monospace';ctx.textAlign='center';ctx.fillText(t.name,p.x,p.y-34)}
function drawWorld(){
 const f=state.player.inTank?state.tank:state.player,cx=clamp(f.x,W/2,3900-W/2),cy=clamp(f.y,H/2,2100-H/2),x0=Math.floor((cx-W/2)/V9_TILE)*V9_TILE-32,y0=Math.floor((cy-H/2)/V9_TILE)*V9_TILE-32,x1=cx+W/2+64,y1=cy+H/2+64;
 ctx.fillStyle='#315b78';ctx.fillRect(0,0,W,H);for(let x=x0;x<x1;x+=V9_TILE)for(let y=y0;y<y1;y+=V9_TILE){if(x<0||y<0||x>V9_WORLD_W||y>V9_WORLD_H)continue;const s=worldToScreen(x,y);v10DrawTile(v9Biome(x+16,y+16),Math.round(s.x),Math.round(s.y),x,y)}
 v9DrawRivers();v9DrawMountains();v9DrawRoads();V9_WORLD_LANDMARKS.forEach(v9DrawWorldLandmark);
 for(let i=0;i<state.unlocked;i++)v9DrawTownMarker(TOWNS[i],i);
 TOWNS.forEach((t,i)=>{const q=state.townProgress[i];if(i>=state.unlocked||q.boss||q.claimed||!(q.chief&&q.mechanic&&q.board))return;const b=bossPosition(i),sp=worldToScreen(b.x,b.y);ctx.fillStyle='#2a1715';ctx.fillRect(sp.x-18,sp.y-18,36,36);ctx.strokeStyle='#d65b48';ctx.lineWidth=2;ctx.strokeRect(sp.x-18,sp.y-18,36,36);ctx.fillStyle='#f0c498';ctx.font='bold 20px monospace';ctx.textAlign='center';ctx.fillText('!',sp.x,sp.y+7);ctx.fillStyle='rgba(8,9,8,.86)';ctx.fillRect(sp.x-52,sp.y-43,104,18);ctx.fillStyle='#f1c38d';ctx.font='10px monospace';ctx.fillText(t.boss,sp.x,sp.y-30)});
 drawTank();if(!state.player.inTank)drawPlayer();const g=ctx.createLinearGradient(0,H-90,0,H);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.22)');ctx.fillStyle=g;ctx.fillRect(0,H-90,W,90)
}

const V9_LAYOUTS=[
 [
  {id:'guild',name:'猎人公会',x:105,y:185,w:270,h:180,style:'warehouse'},
  {id:'clinic',name:'诊所',x:430,y:160,w:215,h:145,style:'clinic'},
  {id:'garage',name:'战车车库',x:860,y:155,w:385,h:230,style:'hangar'},
  {id:'tavern',name:'酒馆',x:160,y:545,w:250,h:170,style:'bar'},
  {id:'shop',name:'补给店',x:930,y:555,w:220,h:155,style:'shop'}
 ],
 [
  {id:'garage',name:'赤角车间',x:110,y:160,w:355,h:215,style:'hangar'},{id:'shop',name:'水站补给',x:505,y:170,w:220,h:150,style:'shop'},
  {id:'guild',name:'风塔事务所',x:900,y:165,w:285,h:180,style:'warehouse'},{id:'clinic',name:'风塔医务间',x:945,y:515,w:225,h:150,style:'clinic'},{id:'tavern',name:'盐灯酒馆',x:490,y:570,w:255,h:160,style:'bar'}
 ],
 [
  {id:'guild',name:'霓虹猎人站',x:160,y:150,w:280,h:180,style:'warehouse'},{id:'tavern',name:'深井酒吧',x:135,y:500,w:250,h:165,style:'bar'},
  {id:'clinic',name:'林澄诊所',x:535,y:210,w:230,h:155,style:'clinic'},{id:'shop',name:'井口商店',x:870,y:190,w:215,h:145,style:'shop'},{id:'garage',name:'回声车库',x:825,y:520,w:365,h:210,style:'hangar'}
 ],
 [
  {id:'guild',name:'矿工公会',x:120,y:180,w:280,h:180,style:'warehouse'},{id:'clinic',name:'井下救护所',x:160,y:520,w:230,h:150,style:'clinic'},
  {id:'garage',name:'重机修理场',x:760,y:150,w:420,h:235,style:'hangar'},{id:'shop',name:'矿区物资站',x:815,y:540,w:240,h:155,style:'shop'},{id:'tavern',name:'黑砂食堂',x:470,y:570,w:245,h:155,style:'bar'}
 ],
 [
  {id:'garage',name:'红罐车房',x:125,y:155,w:385,h:225,style:'hangar'},{id:'clinic',name:'赛后医务室',x:170,y:535,w:215,h:145,style:'clinic'},
  {id:'guild',name:'竞技事务所',x:805,y:165,w:300,h:185,style:'warehouse'},{id:'tavern',name:'冠军酒吧',x:815,y:535,w:255,h:165,style:'bar'},{id:'shop',name:'赛场商会',x:535,y:590,w:220,h:145,style:'shop'}
 ],
 [
  {id:'guild',name:'守塔所',x:130,y:170,w:270,h:175,style:'warehouse'},{id:'shop',name:'电工铺',x:140,y:520,w:220,h:145,style:'shop'},
  {id:'garage',name:'风机车库',x:790,y:145,w:390,h:225,style:'hangar'},{id:'clinic',name:'守塔医务间',x:865,y:520,w:220,h:145,style:'clinic'},{id:'tavern',name:'塔影酒馆',x:455,y:585,w:260,h:155,style:'bar'}
 ],
 [
  {id:'garage',name:'雪虎车库',x:110,y:155,w:390,h:225,style:'hangar'},{id:'guild',name:'中继站指挥所',x:850,y:150,w:305,h:190,style:'warehouse'},
  {id:'shop',name:'冻原补给',x:145,y:545,w:225,h:145,style:'shop'},{id:'clinic',name:'保温医务站',x:880,y:535,w:225,h:150,style:'clinic'},{id:'tavern',name:'暖炉酒馆',x:505,y:560,w:255,h:165,style:'bar'}
 ],
 [
  {id:'guild',name:'炼城调度所',x:135,y:170,w:285,h:180,style:'warehouse'},{id:'tavern',name:'阀门酒吧',x:145,y:530,w:250,h:165,style:'bar'},
  {id:'garage',name:'耐热车库',x:760,y:150,w:420,h:235,style:'hangar'},{id:'shop',name:'炼油商店',x:850,y:535,w:225,h:150,style:'shop'},{id:'clinic',name:'消防医务室',x:500,y:575,w:230,h:150,style:'clinic'}
 ],
 [
  {id:'garage',name:'轨炮车间',x:110,y:150,w:410,h:235,style:'hangar'},{id:'clinic',name:'档案医务间',x:150,y:540,w:220,h:145,style:'clinic'},
  {id:'guild',name:'天穹档案所',x:815,y:160,w:320,h:195,style:'warehouse'},{id:'shop',name:'废都商栈',x:880,y:535,w:220,h:150,style:'shop'},{id:'tavern',name:'断桥酒馆',x:500,y:575,w:260,h:155,style:'bar'}
 ],
 [
  {id:'guild',name:'零号前哨',x:160,y:160,w:300,h:190,style:'warehouse'},{id:'shop',name:'军需库',x:165,y:535,w:230,h:145,style:'shop'},
  {id:'garage',name:'军工车库',x:735,y:140,w:445,h:245,style:'hangar'},{id:'clinic',name:'战地医务室',x:885,y:530,w:230,h:150,style:'clinic'},{id:'tavern',name:'避难休息间',x:490,y:585,w:260,h:150,style:'bar'}
 ]
];
const V9_DECOR_BUILDINGS=Array.from({length:10},(_,i)=>[
 {x:420+(i%2)*45,y:365,w:130,h:95,type:'house'},{x:610-(i%3)*25,y:125,w:120,h:90,type:'house'},
 {x:1120-(i%2)*85,y:390,w:120,h:95,type:'shed'},{x:440+(i%3)*45,y:720,w:125,h:85,type:'house'},
 {x:740+(i%2)*35,y:700,w:120,h:80,type:'shed'}
]);
function townBuildings(i){return V9_LAYOUTS[i].map(b=>({...b,color:V8_TOWN_PALETTES[i].wall}))}
function v9TownRoads(i){const p=V8_TOWN_PALETTES[i],roads=[[[700,860],[700,455]],[[700,455],[270,455]],[[700,455],[1120,455]]];if(i%3===1)roads.push([[430,455],[430,250]],[[940,455],[940,620]]);else if(i%3===2)roads.push([[530,455],[530,210]],[[890,455],[890,665]]);else roads.push([[300,455],[300,650]],[[1040,455],[1040,250]]);for(const r of roads){const pts=r.map(q=>townToScreen(q[0],q[1]));ctx.strokeStyle='#4f493d';ctx.lineWidth=68;ctx.lineCap='square';ctx.beginPath();pts.forEach((q,k)=>k?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.stroke();ctx.strokeStyle='rgba(193,166,112,.16)';ctx.lineWidth=2;ctx.setLineDash([10,14]);ctx.stroke();ctx.setLineDash([])}}
function v9DrawDecorBuilding(b,i){const p=townToScreen(b.x,b.y);ctx.fillStyle='#3a332b';ctx.fillRect(p.x,p.y,b.w,b.h);ctx.fillStyle=b.type==='shed'?'#585348':'#6d5c48';ctx.fillRect(p.x+5,p.y+18,b.w-10,b.h-20);ctx.fillStyle='#292824';ctx.fillRect(p.x-5,p.y+4,b.w+10,18);ctx.fillStyle='#a18c68';ctx.fillRect(p.x+16,p.y+43,19,17);ctx.fillRect(p.x+b.w-35,p.y+43,19,17);ctx.fillStyle='#24201b';ctx.fillRect(p.x+b.w/2-12,p.y+b.h-29,24,29)}
function v9TownFeature(i){const P=(x,y)=>townToScreen(x,y);ctx.save();if(i===0){let p=P(700,105);ctx.fillStyle='#30494d';ctx.fillRect(0,0,W,p.y);ctx.fillStyle='#5a4a3a';ctx.fillRect(0,p.y-18,W,18);for(let x=0;x<W;x+=52){ctx.fillStyle='#6e573f';ctx.fillRect(x,p.y-16,35,13)}}else if(i===1){let p=P(720,120);ctx.strokeStyle='#83765d';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(p.x,p.y+55);ctx.lineTo(p.x,p.y-38);ctx.stroke();for(let a=0;a<4;a++){const ang=a*Math.PI/2;ctx.beginPath();ctx.moveTo(p.x,p.y-38);ctx.lineTo(p.x+Math.cos(ang)*48,p.y-38+Math.sin(ang)*48);ctx.stroke()}}else if(i===2){let p=P(700,245);ctx.fillStyle='#3f4660';ctx.fillRect(p.x-52,p.y-18,104,36);ctx.strokeStyle='#7dc7d7';ctx.strokeRect(p.x-52,p.y-18,104,36);ctx.beginPath();ctx.arc(p.x,p.y,38,0,TAU);ctx.stroke()}else if(i===3){let p=P(680,120);ctx.fillStyle='#282b2a';ctx.fillRect(p.x-85,p.y-20,170,55);ctx.fillStyle='#171918';ctx.fillRect(p.x-38,p.y-5,76,40);ctx.strokeStyle='#7f6c50';ctx.beginPath();ctx.moveTo(p.x-70,p.y+35);ctx.lineTo(p.x-35,p.y+75);ctx.lineTo(p.x+35,p.y+75);ctx.lineTo(p.x+70,p.y+35);ctx.stroke()}else if(i===4){let p=P(700,190);ctx.strokeStyle='#a95b4d';ctx.lineWidth=10;ctx.beginPath();ctx.ellipse(p.x,p.y,125,62,0,0,TAU);ctx.stroke();ctx.strokeStyle='#5e4437';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(p.x,p.y,98,45,0,0,TAU);ctx.stroke()}else if(i===5){for(const [x,y] of [[600,180],[750,150],[870,220]]){let p=P(x,y);ctx.strokeStyle='#686d67';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(p.x,p.y+45);ctx.lineTo(p.x,p.y-40);ctx.stroke();for(let a=0;a<3;a++){const an=a*TAU/3+.3;ctx.beginPath();ctx.moveTo(p.x,p.y-40);ctx.lineTo(p.x+Math.cos(an)*42,p.y-40+Math.sin(an)*42);ctx.stroke()}}}else if(i===6){let p=P(700,160);ctx.strokeStyle='#c9d7d2';ctx.lineWidth=5;ctx.beginPath();ctx.arc(p.x,p.y,50,Math.PI,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+39,p.y-38);ctx.stroke()}else if(i===7){for(let x=570;x<=820;x+=85){let p=P(x,135);ctx.fillStyle='#47423a';ctx.fillRect(p.x-13,p.y-30,26,75);ctx.fillStyle='#7a4b36';ctx.fillRect(p.x-7,p.y-44,14,15)}}else if(i===8){let p=P(700,175);ctx.fillStyle='#42484c';ctx.fillRect(p.x-180,p.y-20,360,25);ctx.fillStyle='#25292b';for(let k=-150;k<=150;k+=60)ctx.fillRect(p.x+k,p.y+5,16,60)}else{let p=P(700,185);ctx.fillStyle='#383d40';ctx.fillRect(p.x-180,p.y-42,360,80);ctx.fillStyle='#1d2021';ctx.fillRect(p.x-48,p.y-5,96,43);ctx.fillStyle='#a43c32';ctx.fillRect(p.x-8,p.y-18,16,12)}ctx.restore()}
function drawBuilding(b){const i=currentTown?.index??state.townIndex,p=townToScreen(b.x,b.y),door=townToScreen(b.x+b.w/2,b.y+b.h),pc=v8BuildingPalette(b,i);ctx.save();ctx.fillStyle='#292721';ctx.fillRect(p.x-6,p.y-8,b.w+12,b.h+8);ctx.fillStyle=pc.wall;ctx.fillRect(p.x,p.y+22,b.w,b.h-22);ctx.fillStyle=pc.roof;ctx.fillRect(p.x-8,p.y,b.w+16,28);ctx.fillStyle='rgba(255,255,255,.06)';for(let k=12;k<b.w-8;k+=34)ctx.fillRect(p.x+k,p.y+5,18,4);ctx.fillStyle='#ac9a76';ctx.fillRect(p.x+20,p.y+60,26,22);ctx.fillRect(p.x+b.w-46,p.y+60,26,22);ctx.fillStyle='#211d18';ctx.fillRect(door.x-16,door.y-35,32,35);ctx.fillStyle=pc.sign;ctx.fillRect(p.x+b.w/2-46,p.y+34,92,18);ctx.fillStyle='#171714';ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillText(b.name,p.x+b.w/2,p.y+47);ctx.restore()}
function drawTown(){const i=currentTown.index,pal=V8_TOWN_PALETTES[i];ctx.fillStyle=pal.ground;ctx.fillRect(0,0,W,H);for(let x=0;x<1400;x+=32)for(let y=0;y<900;y+=32){const s=townToScreen(x,y),h=v9hash(x>>5,y>>5);if(s.x<-34||s.y<-34||s.x>W+34||s.y>H+34)continue;ctx.globalAlpha=.08;ctx.fillStyle=(h&1)?'#fff':'#000';ctx.fillRect(s.x+(h%12),s.y+((h>>>4)%12),2,2);ctx.globalAlpha=1}v9TownFeature(i);v9TownRoads(i);for(const b of V9_DECOR_BUILDINGS[i])v9DrawDecorBuilding(b,i);townBuildings(i).forEach(drawBuilding);v8DrawLandmarks(i);getAmbientNpcs(i).forEach(n=>drawCharacter(n.model,n.x,n.y,n.dir,n.walk,1,n.name));drawTank();if(!state.player.inTank)drawPartyFollowers();drawPlayer();const gate=townToScreen(700,850);ctx.fillStyle='#312f29';ctx.fillRect(gate.x-70,gate.y-6,140,12);ctx.fillStyle='#8e7a57';ctx.font='10px monospace';ctx.textAlign='center';ctx.fillText('荒原出口',gate.x,gate.y-12);drawPrompt();drawAmbientLighting()}
function collides(nx,ny){if(state.scene==='world')return nx<35||ny<35||nx>4165||ny>2165;if(state.scene==='town'){if(nx<35||ny<35||nx>1365||ny>865)return true;const solids=[...townBuildings(state.townIndex),...V9_DECOR_BUILDINGS[state.townIndex]];return solids.some(b=>nx>b.x-18&&nx<b.x+b.w+18&&ny>b.y-18&&ny<b.y+b.h+18)}if(nx<62||ny<62||nx>898||ny>478)return true;return false}

function v9PixelFrame(x,y,w,h){ctx.fillStyle='#050505';ctx.fillRect(x,y,w,h);ctx.strokeStyle='#e9e6d8';ctx.lineWidth=3;ctx.strokeRect(x+1.5,y+1.5,w-3,h-3);ctx.strokeStyle='#77766e';ctx.lineWidth=1;ctx.strokeRect(x+6.5,y+6.5,w-13,h-13)}
function drawDialogue(dt){if(!dialogue)return;dialogue.t+=dt;const line=dialogue.lines[dialogue.idx];if(dialogue.t>.016&&dialogue.char<line.text.length){dialogue.char++;dialogue.t=0}const x=36,y=330,w=888,h=180;v9PixelFrame(x,y,w,h);ctx.fillStyle='#f2f0e5';ctx.font='bold 17px monospace';ctx.textAlign='left';const speaker=line.speaker&&line.speaker!=='旁白'&&line.speaker!=='系统'?`【${line.speaker}】`:'';if(speaker)ctx.fillText(speaker,x+24,y+32);ctx.font='18px monospace';const ty=y+(speaker?62:38);wrapText(line.text.slice(0,dialogue.char),x+24,ty,w-48,28);const done=dialogue.char>=line.text.length;ctx.fillStyle=done&&Math.floor(performance.now()/350)%2===0?'#e9e6d8':'#7a796f';ctx.beginPath();ctx.moveTo(x+w-34,y+h-28);ctx.lineTo(x+w-18,y+h-28);ctx.lineTo(x+w-26,y+h-18);ctx.closePath();ctx.fill();ctx.fillStyle='#9a998f';ctx.font='11px monospace';ctx.textAlign='right';ctx.fillText(dialogue.idx===dialogue.lines.length-1?'A 结束':'A 继续',x+w-48,y+h-18)}

function updateHud(){
 $('zone').textContent=state.scene==='world'?'荒原地图':state.scene==='town'?(currentTown?.name||'城镇'):`${currentTown?.name||''} · ${interiorName()}`;
 $('modeTag').textContent=state.player.inTank?'驾驶战车':'步行';$('hp').textContent=state.player.inTank?`${Math.ceil(state.tank.hp)}/${tankMax()}`:'人物';$('gold').textContent=state.gold;$('scrap').textContent=state.scrap;const q=$('quest');if(q)q.textContent=questText().slice(0,24)
}

/* === v0.10 exploration foundation: terrain rules, bridges, POIs, field zones, regional enemies, world map === */
const V10_VERSION='0.10.0';
const V10_BRIDGES=[
 {x:2218,y:499,name:'东河公路桥'},{x:3167,y:775,name:'红峡桥'},{x:2298,y:1701,name:'冻原铁桥'},{x:993,y:1480,name:'旧高架桥'},{x:1921,y:1054,name:'零号联络桥'}
];

const V10_DENSE_GROVES=[
 {x:470,y:1030,rx:145,ry:95},{x:690,y:1010,rx:125,ry:105},{x:840,y:1090,rx:135,ry:90},
 {x:430,y:1360,rx:155,ry:100},{x:720,y:1460,rx:135,ry:95},{x:1000,y:1320,rx:120,ry:100}
];
const V10_ENEMIES=[
 [
  {name:'锈壳摩托匪',hp:150,atk:18,reward:95},{name:'废弃侦察车',hp:185,atk:21,reward:120},{name:'海堤猎犬机',hp:220,atk:24,reward:145}
 ],
 [
  {name:'盐地掠夺者',hp:260,atk:29,reward:175},{name:'结盐装甲虫',hp:310,atk:32,reward:205},{name:'水管破坏机',hp:350,atk:35,reward:235}
 ],
 [
  {name:'失控广播车',hp:390,atk:40,reward:270},{name:'共振无人机',hp:430,atk:44,reward:310},{name:'霓虹巡逻机',hp:470,atk:46,reward:335}
 ],
 [
  {name:'黑砂轨道守卫',hp:520,atk:51,reward:380},{name:'矿坑装载机',hp:590,atk:56,reward:425},{name:'钻岩无人车',hp:650,atk:60,reward:470}
 ],
 [
  {name:'竞技逃亡车',hp:710,atk:66,reward:520},{name:'改装拦路车',hp:780,atk:70,reward:575},{name:'赌徒火力车',hp:840,atk:74,reward:620}
 ],
 [
  {name:'风场无人机',hp:900,atk:79,reward:675},{name:'叶片警戒机',hp:970,atk:84,reward:725},{name:'旧防空拖车',hp:1040,atk:89,reward:780}
 ],
 [
  {name:'冻原猎杀犬',hp:1120,atk:95,reward:850},{name:'雪地侦察车',hp:1210,atk:101,reward:915},{name:'低温装甲机',hp:1320,atk:108,reward:990}
 ],
 [
  {name:'炼城喷火车',hp:1430,atk:115,reward:1080},{name:'焦化管线守卫',hp:1540,atk:122,reward:1160},{name:'油海装甲拖车',hp:1660,atk:129,reward:1240}
 ],
 [
  {name:'磁轨警戒机',hp:1800,atk:138,reward:1350},{name:'高架巡猎车',hp:1940,atk:146,reward:1460},{name:'废都火控塔车',hp:2090,atk:154,reward:1580}
 ],
 [
  {name:'零号守卫',hp:2280,atk:164,reward:1710},{name:'堡垒拦截车',hp:2450,atk:174,reward:1850},{name:'协议执行机',hp:2660,atk:184,reward:2010}
 ]
];
const V10_POIS=[
 {id:'toll',x:900,y:680,name:'旧收费站',type:'field',field:'tollstation',visible:true,chapter:0,icon:'▣',desc:'旧公路收费站。收费亭下方还有一层军用检查区。'},
 {id:'convoy_grave',x:430,y:860,name:'车队坟场',type:'cache',visible:true,chapter:0,icon:'◇',reward:{scrap:8,kit:1},desc:'三支运输队的残骸堆在一起，车门都朝同一方向敞开。'},
 {id:'seawall_yard',x:660,y:620,name:'海堤维修场',type:'field',field:'seawall',visible:false,chapter:0,icon:'▣',desc:'被沙埋住一半的海堤维修院，能听见地下泵机偶尔转动。'},
 {id:'dry_well',x:1600,y:520,name:'断井绿洲',type:'camp',visible:true,chapter:1,icon:'♨',reward:{scrap:4},desc:'几棵耐盐树围着一口干井，拾荒者把这里当作路标。'},
 {id:'salt_pump',x:1510,y:690,name:'旧军用泵站',type:'field',field:'saltpump',visible:false,chapter:1,icon:'▣',desc:'地下泵站仍在运行，铁门背后有沉重的机械震动。'},
 {id:'salt_cache',x:1780,y:320,name:'盐碱观测塔',type:'cache',visible:false,chapter:1,icon:'◇',reward:{scrap:10},desc:'塔顶留着旧气象队的密封物资箱。'},
 {id:'relay',x:2370,y:800,name:'中继塔残骸',type:'field',field:'relay',visible:true,chapter:2,icon:'▣',desc:'倒塌的通讯塔下面还有一片完整设备区。'},
 {id:'neon_camp',x:2180,y:720,name:'静默营地',type:'lore',visible:false,chapter:2,icon:'?',desc:'帐篷整齐，饭盒还在桌上，人却一个都没有。'},
 {id:'rail_cut',x:2500,y:880,name:'断轨切口',type:'cache',visible:false,chapter:3,icon:'◇',reward:{scrap:12},desc:'旧矿轨被从中间咬断，碎钢埋在黑砂里。'},
 {id:'mine_yard',x:2860,y:760,name:'地表矿机坪',type:'field',field:'mineyard',visible:true,chapter:3,icon:'▣',desc:'矿机坪连着三条废弃支轨，装载机仍会自行启动。'},
 {id:'arena_test',x:3310,y:760,name:'废弃试车道',type:'lore',visible:false,chapter:4,icon:'?',desc:'轮胎和履带印围成一圈，赛道中央有大量干扰器碎片。'},
 {id:'big_crater',x:3270,y:1130,name:'巨型弹坑',type:'cache',visible:true,chapter:4,icon:'◇',reward:{scrap:15},desc:'弹坑中心的土壤已经玻璃化，底部露出战前装甲残片。'},
 {id:'windfarm',x:2700,y:1570,name:'倒塌风机群',type:'field',field:'windfarm',visible:true,chapter:5,icon:'▣',desc:'巨型叶片横在地面，维修通道在叶根处仍可进入。'},
 {id:'pilot_grave',x:2920,y:1390,name:'旧飞行员墓标',type:'lore',visible:false,chapter:5,icon:'?',desc:'一片用螺旋桨叶做成的墓标，名字已经被风砂磨平。'},
 {id:'ice_bridge_cache',x:2298,y:1701,name:'冻原铁桥岗亭',type:'cache',visible:true,chapter:6,icon:'◇',reward:{scrap:17,kit:1},desc:'岗亭里还有冻硬的维修材料和一只密封修理包。'},
 {id:'heat_sink',x:2460,y:1860,name:'地热裂缝',type:'camp',visible:false,chapter:6,icon:'♨',reward:{scrap:5},desc:'热气从裂缝里冒出，路过的人会在这里短暂停车取暖。'},
 {id:'pipeline',x:1700,y:1570,name:'旧输油站',type:'field',field:'pipeline',visible:true,chapter:7,icon:'▣',desc:'输油泵站被封死多年，但管线压力表仍在跳动。'},
 {id:'firewatch',x:1460,y:1440,name:'消防观察台',type:'lore',visible:false,chapter:7,icon:'?',desc:'墙上记录着二十年来每一次油海大火的风向。'},
 {id:'viaduct',x:980,y:1210,name:'坍塌高架',type:'field',field:'viaduct',visible:true,chapter:8,icon:'▣',desc:'高架桥面断成数段，桥下停着被遗弃的猎人车辆。'},
 {id:'hunter_beacon',x:760,y:1120,name:'失踪猎人信标',type:'lore',visible:false,chapter:8,icon:'?',desc:'一个旧式信标反复发送相同的短报码。'},
 {id:'zero_lock',x:1910,y:920,name:'封锁区',type:'field',field:'zeroyard',visible:true,chapter:9,icon:'▣',desc:'堡垒外围的旧检查场，自动闸门仍在扫描车辆。'},
 {id:'protocol_cache',x:1740,y:1010,name:'协议转发井',type:'cache',visible:false,chapter:9,icon:'◇',reward:{scrap:22,kit:1},desc:'一座不起眼的数据井，地下传来低频嗡鸣。'},
 {id:'salt_lake',x:3550,y:580,name:'盐湖',type:'lore',visible:true,chapter:4,icon:'≈',desc:'湖面结着厚盐壳，远处看像雪，踩上去却会碎裂。'},
 {id:'roadside_shrine',x:1120,y:980,name:'路边猎人碑',type:'lore',visible:false,chapter:2,icon:'?',desc:'一块用装甲板切成的墓碑，刻着“路是走出来的”。'},
 {id:'scrap_market',x:1330,y:1040,name:'流动废料摊',type:'camp',visible:false,chapter:2,icon:'♨',reward:{scrap:6},desc:'几辆货车临时围成小市场，商贩只停留一天。'},
 {id:'north_bunker',x:2640,y:460,name:'北岭观察堡',type:'cache',visible:false,chapter:3,icon:'◇',reward:{scrap:13},desc:'山口旁的混凝土观察堡已经坍掉半边。'},
 {id:'red_mesa',x:3480,y:1260,name:'红岩信号柱',type:'lore',visible:false,chapter:5,icon:'?',desc:'红色岩台上竖着一根仍会闪烁的旧导航柱。'},
 {id:'frozen_convoy',x:2050,y:1900,name:'冻结车队',type:'cache',visible:false,chapter:6,icon:'◇',reward:{scrap:18},desc:'三辆货车被冰封在一起，车厢锁早已冻裂。'},
 {id:'oil_cemetery',x:1190,y:1760,name:'油罐坟场',type:'lore',visible:false,chapter:7,icon:'?',desc:'废弃油罐被整齐切开，像一排生锈的巨大棺材。'},
 {id:'sky_substation',x:520,y:1450,name:'高架变电站',type:'cache',visible:false,chapter:8,icon:'◇',reward:{scrap:20},desc:'断电多年的变电站里仍存着完整的绝缘材料。'}
];
const V10_FIELDS={
 tollstation:{name:'旧收费站检查区',w:1320,h:760,palette:['#4a453b','#2e302e','#6f6554'],allowTank:true,spawn:{x:110,y:380},exit:{x:70,y:380},solids:[
  {x:260,y:110,w:70,h:390},{x:520,y:0,w:48,h:250},{x:520,y:340,w:48,h:420},{x:790,y:120,w:58,h:500},{x:1040,y:0,w:55,h:300},{x:1040,y:420,w:55,h:340},
  {x:330,y:105,w:190,h:45},{x:568,y:285,w:222,h:42},{x:848,y:570,w:192,h:48}
 ],props:[
  {id:'terminal',type:'terminal',x:430,y:205,name:'检查终端',lines:[['旧终端','屏幕只剩一行可读记录：自动猎杀系统曾被批准接管收费站道路识别。'],['柳焰','所以它们不是突然出现在荒原，是先接管了道路，再把道路当成猎场。']]},
  {id:'crateA',type:'crate',x:665,y:180,name:'军需箱',loot:{scrap:7,kit:1}},
  {id:'wreck',type:'lore',x:930,y:360,name:'被击穿的装甲车',lines:[['旁白','装甲车侧面有三枚密集弹孔，驾驶席反而完整。'],['柳焰','和锈港的运输队一样。先打控制系统，再等人自己出来。']]}
 ],enemies:[
  {id:'toll1',x:390,y:610,name:'收费站警戒车',hp:210,atk:23,reward:150},{id:'toll2',x:940,y:210,name:'旧式路障机',hp:250,atk:27,reward:185}
 ]},
 seawall:{name:'海堤维修院',w:1380,h:760,palette:['#3b4b4d','#2d3433','#75604c'],allowTank:true,spawn:{x:105,y:390},exit:{x:65,y:390},solids:[
  {x:290,y:70,w:90,h:500},{x:650,y:0,w:55,h:270},{x:650,y:390,w:55,h:370},{x:990,y:125,w:65,h:520},
  {x:380,y:120,w:270,h:42},{x:705,y:520,w:285,h:45},{x:1055,y:250,w:180,h:45}
 ],props:[
  {id:'pump',type:'terminal',x:520,y:225,name:'旧泵机控制台',lines:[['旁白','控制台显示海堤排水泵曾在无人值守状态下运行了十九年。'],['桃夭','只要换掉三组轴承，这东西还能再转十年。战前机器就是这么讨厌。']]},
  {id:'locker',type:'crate',x:825,y:440,name:'维修储物柜',loot:{scrap:9}},
  {id:'chart',type:'lore',x:1180,y:355,name:'潮位记录板',lines:[['旁白','记录板上的红线总在同一个潮位高度中断。'],['柳焰','铁牙猎犬的巡猎窗口就是从这里来的。它在等路面露出来。']]}
 ],enemies:[
  {id:'sea1',x:440,y:610,name:'海堤履带机',hp:240,atk:26,reward:175},{id:'sea2',x:830,y:180,name:'排水口警戒车',hp:280,atk:30,reward:205}
 ]},
 saltpump:{name:'地下泵站地表区',w:1400,h:800,palette:['#766c4f','#3e4039','#9c8e65'],allowTank:true,spawn:{x:100,y:410},exit:{x:65,y:410},solids:[
  {x:280,y:0,w:60,h:310},{x:280,y:420,w:60,h:380},{x:590,y:150,w:70,h:530},{x:920,y:0,w:60,h:330},{x:920,y:445,w:60,h:355},{x:1180,y:160,w:55,h:500},
  {x:340,y:300,w:250,h:42},{x:660,y:560,w:260,h:45},{x:980,y:320,w:200,h:42}
 ],props:[
  {id:'valve',type:'terminal',x:470,y:205,name:'主泵阀组',lines:[['水站技师','这套泵不是给镇子用的，是给旧军基地供水的。'],['桃夭','难怪钢甲虫一直守在这里。它可能把泵站当成还在服役。']]},
  {id:'saltcrate',type:'crate',x:760,y:470,name:'密封备件箱',loot:{scrap:11,kit:1}},
  {id:'core',type:'lore',x:1080,y:230,name:'旧认证牌',lines:[['旁白','墙上挂着一块褪色的车辆认证牌，编号与赤角突击车一致。'],['桃夭','这就是赤角的原始维护站。我们来对地方了。']]}
 ],enemies:[
  {id:'salt1',x:470,y:660,name:'泵站守卫机',hp:330,atk:34,reward:235},{id:'salt2',x:790,y:245,name:'盐蚀装甲虫',hp:390,atk:39,reward:285},{id:'salt3',x:1110,y:610,name:'阀门警戒车',hp:430,atk:42,reward:315}
 ]},
 relay:{name:'中继塔设备场',w:1360,h:780,palette:['#4a4552','#30333a','#6d6174'],allowTank:true,spawn:{x:105,y:390},exit:{x:65,y:390},solids:[
  {x:310,y:100,w:65,h:520},{x:610,y:0,w:50,h:300},{x:610,y:410,w:50,h:370},{x:900,y:130,w:65,h:500},{x:1160,y:0,w:55,h:320},
  {x:375,y:170,w:235,h:40},{x:660,y:520,w:240,h:45},{x:965,y:380,w:195,h:42}
 ],props:[
  {id:'receiver',type:'terminal',x:500,y:270,name:'失真接收机',lines:[['无线电员','中继塔收到的不是一段广播，而是叠在正常通讯上的控制脉冲。'],['林澄','这解释了为什么居民会昏睡。人的脑子也被迫在跟着它的节奏走。']]},
  {id:'medbox',type:'crate',x:760,y:425,name:'应急箱',loot:{scrap:8,kit:1}},
  {id:'log',type:'lore',x:1070,y:270,name:'维护日志',lines:[['旁白','日志最后一页写着：塞壬九号已从“广播平台”改列为“群体控制试验车”。']]}
 ],enemies:[
  {id:'rel1',x:430,y:650,name:'中继巡逻机',hp:430,atk:44,reward:310},{id:'rel2',x:790,y:230,name:'共振哨兵',hp:480,atk:48,reward:350},{id:'rel3',x:1080,y:610,name:'失控广播车',hp:520,atk:51,reward:390}
 ]},
 mineyard:{name:'黑砂地表矿机坪',w:1400,h:800,palette:['#484540','#292b2c','#645b4e'],allowTank:true,spawn:{x:105,y:405},exit:{x:65,y:405},solids:[{x:310,y:0,w:65,h:330},{x:310,y:445,w:65,h:355},{x:620,y:100,w:70,h:560},{x:970,y:0,w:60,h:350},{x:970,y:470,w:60,h:330},{x:1180,y:160,w:60,h:500}],props:[{id:'lift',type:'terminal',x:500,y:220,name:'升降机控制台',lines:[['矿长','井下主电源已经断了，但有人从下面反复请求升降机。'],['桃夭','或者不是“人”。']]},{id:'orebox',type:'crate',x:810,y:570,name:'矿机备件',loot:{scrap:14}}],enemies:[{id:'mine1',x:470,y:650,name:'装载机守卫',hp:600,atk:57,reward:440},{id:'mine2',x:840,y:220,name:'轨道警戒车',hp:680,atk:62,reward:495}]},
 windfarm:{name:'风机维护场',w:1400,h:800,palette:['#4d5854','#343d3b','#6a756e'],allowTank:true,spawn:{x:105,y:405},exit:{x:65,y:405},solids:[{x:300,y:90,w:55,h:570},{x:640,y:0,w:55,h:320},{x:640,y:440,w:55,h:360},{x:1010,y:100,w:55,h:570}],props:[{id:'windlog',type:'terminal',x:500,y:215,name:'风场维护终端',lines:[['旧飞行员','夜鹫不是在巡逻整个风场。它只在维修灯亮起时才进入攻击航线。']]},{id:'windcrate',type:'crate',x:820,y:590,name:'高空维护箱',loot:{scrap:16,kit:1}}],enemies:[{id:'wind1',x:470,y:650,name:'低空警戒机',hp:980,atk:84,reward:730},{id:'wind2',x:850,y:230,name:'风机防空车',hp:1100,atk:91,reward:810}]},
 pipeline:{name:'旧输油泵站',w:1400,h:800,palette:['#514335','#302d29','#79543b'],allowTank:true,spawn:{x:105,y:405},exit:{x:65,y:405},solids:[{x:300,y:0,w:70,h:340},{x:300,y:460,w:70,h:340},{x:650,y:120,w:70,h:560},{x:1020,y:0,w:65,h:350},{x:1020,y:465,w:65,h:335}],props:[{id:'pressure',type:'terminal',x:505,y:230,name:'压力控制台',lines:[['总工程师','这套泵站没有断电，它一直在把燃料送向一个不存在的军用节点。']]},{id:'oilcrate',type:'crate',x:840,y:585,name:'耐热零件箱',loot:{scrap:19}}],enemies:[{id:'oil1',x:470,y:650,name:'管线守卫车',hp:1550,atk:123,reward:1180},{id:'oil2',x:870,y:230,name:'自动灭火战车',hp:1710,atk:131,reward:1290}]},
 viaduct:{name:'坍塌高架下层',w:1400,h:800,palette:['#454b52','#2e3337','#66727c'],allowTank:true,spawn:{x:105,y:405},exit:{x:65,y:405},solids:[{x:300,y:80,w:60,h:570},{x:610,y:0,w:60,h:300},{x:610,y:425,w:60,h:375},{x:940,y:100,w:65,h:560},{x:1190,y:0,w:55,h:340}],props:[{id:'beaconlog',type:'terminal',x:500,y:210,name:'猎人信标终端',lines:[['柳焰','这是我们小队的旧识别码。最后一次上传发生在赤寡妇启动之前。']]},{id:'skycrate',type:'crate',x:800,y:580,name:'猎人补给箱',loot:{scrap:21,kit:1}}],enemies:[{id:'sky1',x:460,y:650,name:'高架警戒机',hp:1900,atk:146,reward:1470},{id:'sky2',x:840,y:240,name:'磁轨侦察车',hp:2100,atk:155,reward:1600}]},
 zeroyard:{name:'零号外围检查场',w:1440,h:820,palette:['#3c4245','#282c2f','#535b60'],allowTank:true,spawn:{x:110,y:410},exit:{x:65,y:410},solids:[{x:300,y:0,w:70,h:355},{x:300,y:480,w:70,h:340},{x:660,y:100,w:75,h:600},{x:1040,y:0,w:70,h:365},{x:1040,y:485,w:70,h:335},{x:1250,y:180,w:55,h:500}],props:[{id:'zero_term',type:'terminal',x:510,y:235,name:'协议识别终端',lines:[['旁白','终端不断重复同一句：道路控制权已移交零号协议。'],['柳焰','终于找到它们共同的主人了。']]},{id:'zero_crate',type:'crate',x:850,y:600,name:'军工密封箱',loot:{scrap:24,kit:1}}],enemies:[{id:'zero1',x:470,y:670,name:'零号拦截车',hp:2450,atk:176,reward:1900},{id:'zero2',x:900,y:240,name:'协议执行机',hp:2750,atk:188,reward:2140}]}
};
function normalizeState(){
 state.townProgress=Array.from({length:10},(_,i)=>Object.assign({chief:false,mechanic:false,board:false,boss:false,claimed:false,side:false,arrived:false},state.townProgress?.[i]||{}));
 state.sideJobs=Array.from({length:10},(_,i)=>Object.assign({accepted:false,kills:0,done:false,claimed:false},state.sideJobs?.[i]||{}));
 state.looted=state.looted||{};state.roomSeen=state.roomSeen||{};state.bond=Object.assign({liuyan:0,taoyao:0,lincheng:0},state.bond||{});state.scrap=Number.isFinite(state.scrap)?state.scrap:12;
 state.world=Object.assign({discovered:{},poiLooted:{},fieldCleared:{},fieldLooted:{},distance:0,eventMeter:0,eventsSeen:{},mapOpened:false},state.world||{});
 state.fieldId=state.fieldId||null;state.fieldReturn=state.fieldReturn||null;state.saveVersion=10;
}
function saveSilently(){normalizeState();localStorage.setItem('wastelandHunterV10',JSON.stringify(state))}
function save(){saveSilently();sayToast('已保存')}
function load(){try{let raw=localStorage.getItem('wastelandHunterV10')||localStorage.getItem('wastelandHunterV8')||localStorage.getItem('wastelandHunterV7');const data=JSON.parse(raw);if(data)Object.assign(state,data)}catch(e){}normalizeState()}
function v10PointSegDist(x,y,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],l2=dx*dx+dy*dy;let t=((x-a[0])*dx+(y-a[1])*dy)/(l2||1);t=clamp(t,0,1);return Math.hypot(x-(a[0]+dx*t),y-(a[1]+dy*t))}
function v10NearPolyline(lines,x,y,r){for(const line of lines)for(let i=0;i<line.length-1;i++)if(v10PointSegDist(x,y,line[i],line[i+1])<r)return true;return false}
function v10NearBridge(x,y,r=50){return V10_BRIDGES.some(b=>dist(x,y,b.x,b.y)<r)}
function v10MountainBlocked(x,y){if(v9nearRoad(x,y,34))return false;if(v9Biome(x,y)==='rock')return true;for(const range of V9_MOUNTAIN_RANGES){for(let i=0;i<range.pts.length-1;i++)if(v10PointSegDist(x,y,range.pts[i],range.pts[i+1])<44)return true}return false}
function v10TerrainBlocked(x,y){if(x<35||y<35||x>4165||y>2165)return true;const biome=v9Biome(x,y);if(biome==='water'&&!v10NearBridge(x,y,58))return true;if(v10NearPolyline(V9_RIVERS,x,y,17)&&!v10NearBridge(x,y,58))return true;if(v10MountainBlocked(x,y))return true;if(!v9nearRoad(x,y,42)&&V10_DENSE_GROVES.some(g=>((x-g.x)/g.rx)**2+((y-g.y)/g.ry)**2<1))return true;return false}
function v10TerrainSpeed(x,y,inTank){const b=v9Biome(x,y);if(v9nearRoad(x,y,34))return inTank?1.16:1.05;const m={coast:.88,desert:.84,grass:.96,plain:.94,forest:inTank?.58:.80,rock:.70,badland:inTank?.70:.78,tundra:inTank?.72:.76,oil:.82,steppe:.90};return m[b]||.9}
function v10EncounterRisk(x,y){if(v9nearRoad(x,y,38))return .48;const b=v9Biome(x,y);return({forest:1.2,badland:1.3,tundra:1.15,rock:1.05,desert:.9,grass:.75,plain:.85,oil:1.12,steppe:.92,coast:.78}[b]||.9)}
function v10RegionIndex(x,y){let best=0,bd=Infinity;TOWNS.forEach((t,i)=>{const d=dist(x,y,t.x,t.y);if(d<bd){bd=d;best=i}});return best}
function v10BiomeName(x,y){return({water:'水域',coast:'海岸荒地',desert:'盐碱荒漠',grass:'草原',plain:'荒原',forest:'旧林带',rock:'山地',badland:'红色恶地',tundra:'冻原',oil:'油污荒地',steppe:'干草原'}[v9Biome(x,y)]||'荒原')}
function v10DiscoverPois(){if(state.scene!=='world')return;const f=state.player.inTank?state.tank:state.player;for(const p of V10_POIS){if(p.chapter>Math.min(9,state.unlocked+1))continue;if(state.world.discovered[p.id])continue;const r=p.visible?115:92;if(dist(f.x,f.y,p.x,p.y)<r){state.world.discovered[p.id]=true;sayToast(`发现：${p.name}`,2.2);saveSilently()}}}
function v10MaybeWorldEvent(){if(state.scene!=='world'||mode!=='play'||state.world.eventMeter<1650)return;state.world.eventMeter=0;if(Math.random()>.34)return;const f=state.player.inTank?state.tank:state.player,bi=v9Biome(f.x,f.y),pool=[
  {id:'scrap',text:[['旁白','路边一辆报废货车的后轴还算完整。'],['系统','你拆下可用部件，获得废料 ×4。']],apply:()=>state.scrap+=4},
  {id:'trader',text:[['流浪商人','我不卖东西，只换路况。前面有机器活动，别离公路太远。'],['系统','商人送你一只应急修理包。']],apply:()=>state.inventory.repairKits++},
  {id:'mine',text:[['旁白','履带压到一枚老式反战车雷。幸好引信已经锈了一半。'],['系统','战车受到轻微损伤。']],apply:()=>state.tank.hp=Math.max(1,state.tank.hp-Math.round(tankMax()*.08))},
  {id:'radio',text:[['无线电','……如果有人听见，北边的桥还能走。不要走河滩。重复，不要走河滩。'],['旁白','信号很快消失，只剩静电声。']],apply:()=>{}},
  {id:'weather',text:[['旁白',bi==='tundra'?'雪尘突然变密，能见度只剩几十米。':'一阵砂尘越过公路，远处的地标短暂消失。'],['柳焰','减速。荒原上看不见路的时候，最危险的不是撞车。']],apply:()=>{}}
 ];const e=pool[Math.floor(Math.random()*pool.length)];e.apply();state.world.eventsSeen[e.id]=(state.world.eventsSeen[e.id]||0)+1;openDialogue(e.text);saveSilently()}
function v10Field(){return state.fieldId?V10_FIELDS[state.fieldId]:null}
function fieldToScreen(x,y){const f=state.player.inTank?state.tank:state.player,fd=v10Field();if(!fd)return{x,y};const cx=clamp(f.x,W/2,fd.w-W/2),cy=clamp(f.y,H/2,fd.h-H/2);return{x:x-cx+W/2,y:y-cy+H/2}}
function screenPos(x,y){return state.scene==='world'?worldToScreen(x,y):state.scene==='town'?townToScreen(x,y):state.scene==='field'?fieldToScreen(x,y):roomToScreen(x,y)}
function v10FieldCollision(nx,ny){const fd=v10Field();if(!fd)return true;const margin=state.player.inTank?25:13;if(nx<45||ny<45||nx>fd.w-45||ny>fd.h-45)return true;return fd.solids.some(s=>nx>s.x-margin&&nx<s.x+s.w+margin&&ny>s.y-margin&&ny<s.y+s.h+margin)}
function collides(nx,ny){if(state.scene==='world')return v10TerrainBlocked(nx,ny);if(state.scene==='field')return v10FieldCollision(nx,ny);if(state.scene==='town'){if(nx<35||ny<35||nx>1365||ny>865)return true;const solids=[...townBuildings(state.townIndex),...V9_DECOR_BUILDINGS[state.townIndex]];return solids.some(b=>nx>b.x-18&&nx<b.x+b.w+18&&ny>b.y-18&&ny<b.y+b.h+18)}if(nx<62||ny<62||nx>898||ny>478)return true;return false}
function updateMovement(dt){if(mode!=='play')return;state.time=(state.time+dt*.018)%24;if(state.scene==='town')updateNpcs(dt);let dx=(keys.right?1:0)-(keys.left?1:0),dy=(keys.down?1:0)-(keys.up?1:0);if(!dx&&!dy)return;const len=Math.hypot(dx,dy);dx/=len;dy/=len;const obj=state.player.inTank?state.tank:state.player;let speed=state.player.inTank?vehicle().spd:112;if(state.scene==='world')speed*=v10TerrainSpeed(obj.x,obj.y,state.player.inTank);else if(state.scene==='field')speed*=state.player.inTank?.86:.94;obj.dir=Math.atan2(dy,dx);const ox=obj.x,oy=obj.y,nx=obj.x+dx*speed*dt,ny=obj.y+dy*speed*dt;if(!collides(nx,obj.y))obj.x=nx;if(!collides(obj.x,ny))obj.y=ny;const moved=dist(ox,oy,obj.x,obj.y);if(!state.player.inTank)state.player.walk+=dt;else{state.player.x=obj.x;state.player.y=obj.y}if(state.scene==='world'){state.world.distance+=moved;state.world.eventMeter+=moved;v10DiscoverPois();v10MaybeWorldEvent();if(state.player.inTank){encounterMeter+=moved*v10EncounterRisk(obj.x,obj.y);if(encounterMeter>820){encounterMeter=0;if(Math.random()<.58)startRandomBattle()}}}}
function v10PoiVisible(p){return p.visible||state.world.discovered[p.id]||((state.player.inTank?state.tank:state.player)&&dist((state.player.inTank?state.tank:state.player).x,(state.player.inTank?state.tank:state.player).y,p.x,p.y)<95)}
function v10DrawPoi(p){if(p.chapter>Math.min(9,state.unlocked+1)||!v10PoiVisible(p))return;const s=worldToScreen(p.x,p.y);if(s.x<-50||s.y<-50||s.x>W+50||s.y>H+50)return;const known=!!state.world.discovered[p.id]||p.visible;ctx.save();ctx.translate(s.x,s.y);ctx.fillStyle=known?'rgba(20,18,14,.85)':'rgba(40,38,28,.35)';ctx.fillRect(-11,-11,22,22);ctx.strokeStyle=known?'#d7c181':'#8d805d';ctx.lineWidth=1.5;ctx.strokeRect(-11,-11,22,22);ctx.fillStyle=known?'#f0dfab':'#b6aa81';ctx.font='bold 14px monospace';ctx.textAlign='center';ctx.fillText(p.icon,0,5);ctx.restore();const f=state.player.inTank?state.tank:state.player;if(known&&dist(f.x,f.y,p.x,p.y)<145){ctx.fillStyle='rgba(8,9,8,.82)';ctx.fillRect(s.x-54,s.y-38,108,18);ctx.fillStyle='#e6d59b';ctx.font='10px monospace';ctx.textAlign='center';ctx.fillText(p.name,s.x,s.y-25)}}
function v10RoadDirectionAt(x,y){let best={d:Infinity,a:0};for(const line of V9_ROADS)for(let i=0;i<line.length-1;i++){const a=line[i],b=line[i+1],d=v10PointSegDist(x,y,a,b);if(d<best.d)best={d,a:Math.atan2(b[1]-a[1],b[0]-a[0])}}return best.a}
function v10DrawDenseGroves(){for(const g of V10_DENSE_GROVES){const p=worldToScreen(g.x,g.y);if(p.x<-220||p.y<-160||p.x>W+220||p.y>H+160)continue;const count=22;for(let i=0;i<count;i++){const h=v9hash(Math.round(g.x)+i*37,Math.round(g.y)+i*71),a=(h%628)/100,r=Math.sqrt(((h>>>8)%1000)/1000),x=p.x+Math.cos(a)*g.rx*r,y=p.y+Math.sin(a)*g.ry*r;ctx.fillStyle='#263f2c';ctx.fillRect(x-2,y+3,4,8);ctx.fillStyle=(i%3===0)?'#3e6744':'#31563a';ctx.beginPath();ctx.moveTo(x,y-12);ctx.lineTo(x-9,y+5);ctx.lineTo(x+9,y+5);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(x,y-4);ctx.lineTo(x-8,y+10);ctx.lineTo(x+8,y+10);ctx.closePath();ctx.fill()}}}
function v10DrawBridge(b){const p=worldToScreen(b.x,b.y),ang=v10RoadDirectionAt(b.x,b.y);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(ang);ctx.fillStyle='#5a4937';ctx.fillRect(-38,-13,76,26);ctx.fillStyle='#b3915c';ctx.fillRect(-38,-8,76,16);ctx.strokeStyle='#d0b47a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-37,-12);ctx.lineTo(37,-12);ctx.moveTo(-37,12);ctx.lineTo(37,12);ctx.stroke();for(let x=-30;x<=30;x+=15){ctx.strokeStyle='rgba(45,35,25,.5)';ctx.beginPath();ctx.moveTo(x,-8);ctx.lineTo(x,8);ctx.stroke()}ctx.restore()}
function v10DrawWeather(){const f=state.player.inTank?state.tank:state.player,b=v9Biome(f.x,f.y),t=performance.now()/1000;ctx.save();if(b==='tundra'){ctx.fillStyle='rgba(236,244,239,.55)';for(let i=0;i<34;i++){const x=(i*89+t*26*(1+i%3))%W,y=(i*47+t*42*(1+i%2))%H;ctx.fillRect(x,y,2,4)}}else if(b==='desert'||b==='badland'){ctx.fillStyle='rgba(196,153,91,.08)';for(let i=0;i<8;i++)ctx.fillRect(((i*177+t*35)%1100)-70,80+i*54,150,2)}const hour=state.time;let alpha=0;if(hour<5)alpha=.34-(hour*.035);else if(hour>20)alpha=Math.min(.34,(hour-20)*.085);if(alpha>0){ctx.fillStyle=`rgba(11,19,31,${alpha})`;ctx.fillRect(0,0,W,H)}ctx.restore()}
function drawWorld(){const f=state.player.inTank?state.tank:state.player,cx=clamp(f.x,W/2,3900-W/2),cy=clamp(f.y,H/2,2100-H/2),x0=Math.floor((cx-W/2)/V9_TILE)*V9_TILE-32,y0=Math.floor((cy-H/2)/V9_TILE)*V9_TILE-32,x1=cx+W/2+64,y1=cy+H/2+64;ctx.fillStyle='#315b78';ctx.fillRect(0,0,W,H);for(let x=x0;x<x1;x+=V9_TILE)for(let y=y0;y<y1;y+=V9_TILE){if(x<0||y<0||x>V9_WORLD_W||y>V9_WORLD_H)continue;const s=worldToScreen(x,y);v9DrawTile(v9Biome(x+16,y+16),Math.round(s.x),Math.round(s.y),x,y)}v9DrawRivers();v9DrawMountains();v10DrawDenseGroves();v9DrawRoads();V10_BRIDGES.forEach(v10DrawBridge);V10_POIS.forEach(v10DrawPoi);for(let i=0;i<state.unlocked;i++)v9DrawTownMarker(TOWNS[i],i);TOWNS.forEach((t,i)=>{const q=state.townProgress[i];if(i>=state.unlocked||q.boss||q.claimed||!(q.chief&&q.mechanic&&q.board))return;const b=bossPosition(i),sp=worldToScreen(b.x,b.y);ctx.fillStyle='#2a1715';ctx.fillRect(sp.x-18,sp.y-18,36,36);ctx.strokeStyle='#d65b48';ctx.lineWidth=2;ctx.strokeRect(sp.x-18,sp.y-18,36,36);ctx.fillStyle='#f0c498';ctx.font='bold 20px monospace';ctx.textAlign='center';ctx.fillText('!',sp.x,sp.y+7);ctx.fillStyle='rgba(8,9,8,.86)';ctx.fillRect(sp.x-52,sp.y-43,104,18);ctx.fillStyle='#f1c38d';ctx.font='10px monospace';ctx.fillText(t.boss,sp.x,sp.y-30)});drawTank();if(!state.player.inTank)drawPlayer();v10DrawWeather();const g=ctx.createLinearGradient(0,H-90,0,H);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.22)');ctx.fillStyle=g;ctx.fillRect(0,H-90,W,90)}
function v10DrawFieldSolid(s,fd){const p=fieldToScreen(s.x,s.y);ctx.fillStyle=fd.palette[1];ctx.fillRect(p.x,p.y,s.w,s.h);ctx.fillStyle=fd.palette[2];ctx.fillRect(p.x+4,p.y+4,s.w-8,8);ctx.fillStyle='rgba(255,255,255,.04)';for(let x=10;x<s.w-5;x+=28)ctx.fillRect(p.x+x,p.y+18,10,3)}
function v10DrawFieldEnemy(e){const p=fieldToScreen(e.x,e.y),cleared=!!state.world.fieldCleared[`${state.fieldId}:${e.id}`];if(cleared){ctx.fillStyle='#30322f';ctx.fillRect(p.x-22,p.y-8,44,16);ctx.fillStyle='#151716';ctx.fillRect(p.x-14,p.y+8,8,5);ctx.fillRect(p.x+7,p.y+8,8,5);return}ctx.save();ctx.translate(p.x,p.y);ctx.fillStyle='#2b2d2b';ctx.fillRect(-24,-10,48,22);ctx.fillStyle='#9b4539';ctx.fillRect(-17,-17,34,18);ctx.fillStyle='#c5ad7c';ctx.fillRect(3,-20,28,4);ctx.fillStyle='#e15d45';ctx.fillRect(-12,-11,6,5);ctx.restore()}
function v10DrawFieldProp(o){const p=fieldToScreen(o.x,o.y);ctx.save();ctx.translate(p.x,p.y);if(o.type==='crate'){ctx.fillStyle='#725b3f';ctx.fillRect(-16,-12,32,24);ctx.strokeStyle='#b09263';ctx.strokeRect(-16,-12,32,24);ctx.beginPath();ctx.moveTo(-15,-10);ctx.lineTo(15,10);ctx.moveTo(15,-10);ctx.lineTo(-15,10);ctx.stroke()}else if(o.type==='terminal'){ctx.fillStyle='#323735';ctx.fillRect(-15,-21,30,36);ctx.fillStyle='#79a990';ctx.fillRect(-9,-15,18,10);ctx.fillStyle='#171a19';ctx.fillRect(-6,15,12,7)}else{ctx.fillStyle='#5d5549';ctx.fillRect(-18,-12,36,24);ctx.strokeStyle='#92836c';ctx.strokeRect(-18,-12,36,24)}ctx.restore()}
function drawField(){const fd=v10Field();if(!fd){state.scene='world';return}ctx.fillStyle=fd.palette[0];ctx.fillRect(0,0,W,H);const f=state.player.inTank?state.tank:state.player,cx=clamp(f.x,W/2,fd.w-W/2),cy=clamp(f.y,H/2,fd.h-H/2);for(let x=Math.floor((cx-W/2)/32)*32-32;x<cx+W/2+64;x+=32)for(let y=Math.floor((cy-H/2)/32)*32-32;y<cy+H/2+64;y+=32){const p=fieldToScreen(x,y),h=v9hash(x>>5,y>>5);ctx.fillStyle=(h&1)?fd.palette[0]:fd.palette[1];ctx.globalAlpha=.22;ctx.fillRect(p.x,p.y,32,32);ctx.globalAlpha=1;ctx.fillStyle='rgba(255,255,255,.05)';ctx.fillRect(p.x+(h%22),p.y+((h>>>4)%22),2,2)}fd.solids.forEach(s=>v10DrawFieldSolid(s,fd));fd.props.forEach(v10DrawFieldProp);fd.enemies.forEach(v10DrawFieldEnemy);const ep=fieldToScreen(fd.exit.x,fd.exit.y);ctx.fillStyle='#282923';ctx.fillRect(ep.x-28,ep.y-36,18,72);ctx.fillStyle='#b99d64';ctx.font='10px monospace';ctx.textAlign='left';ctx.fillText('荒原出口',ep.x-24,ep.y-45);drawTank();if(!state.player.inTank)drawPlayer();ctx.fillStyle='rgba(5,8,7,.78)';ctx.fillRect(16,68,220,38);ctx.strokeStyle='rgba(222,201,146,.3)';ctx.strokeRect(16,68,220,38);ctx.fillStyle='#ead59c';ctx.font='bold 13px monospace';ctx.textAlign='left';ctx.fillText(fd.name,30,91)}
function v10PoiById(id){return V10_POIS.find(p=>p.id===id)}
function v10EnterField(fieldId,poi){const fd=V10_FIELDS[fieldId];if(!fd)return;state.fieldReturn={x:(state.player.inTank?state.tank.x:state.player.x),y:(state.player.inTank?state.tank.y:state.player.y),inTank:state.player.inTank,poiId:poi?.id||null};state.scene='field';state.fieldId=fieldId;state.tank.x=fd.spawn.x;state.tank.y=fd.spawn.y;state.player.x=fd.spawn.x;state.player.y=fd.spawn.y;state.player.inTank=fd.allowTank&&state.fieldReturn.inTank;currentTown=null;sayToast(`进入 ${fd.name}`);saveSilently()}
function v10LeaveField(){const r=state.fieldReturn||{x:TOWNS[state.townIndex].x+90,y:TOWNS[state.townIndex].y+70,inTank:false};state.scene='world';state.fieldId=null;state.tank.x=r.x;state.tank.y=r.y;state.player.x=r.x+(r.inTank?0:28);state.player.y=r.y;state.player.inTank=!!r.inTank;state.fieldReturn=null;sayToast('返回荒原');saveSilently()}
function v10InteractPoi(p){state.world.discovered[p.id]=true;if(p.type==='field'){if(!state.player.inTank)return sayToast('这种遗迹内部仍有战斗单位，驾驶战车进入');return v10EnterField(p.field,p);}if(p.type==='cache'){if(state.world.poiLooted[p.id])return openDialogue([['旁白',`${p.name} 已经被你搜过，没有剩下可用物资。`]]);state.world.poiLooted[p.id]=true;const sc=p.reward?.scrap||5,kit=p.reward?.kit||0;state.scrap+=sc;state.inventory.repairKits+=kit;openDialogue([['旁白',p.desc],['系统',`找到废料 ×${sc}${kit?`，修理包 ×${kit}`:''}。`]]);saveSilently();return}if(p.type==='camp'){if(!state.world.poiLooted[p.id]){state.world.poiLooted[p.id]=true;state.scrap+=p.reward?.scrap||3;state.tank.hp=Math.min(tankMax(),state.tank.hp+Math.round(tankMax()*.08))}openDialogue([['旁白',p.desc],['流浪者','坐一会儿再走。荒原上最便宜的修理就是别急。'],['系统','战车完成简单检查，恢复少量装甲。']]);saveSilently();return}openDialogue([['旁白',p.desc],['柳焰','把这个位置记下来。很多线索不是任务给你的，是路上自己捡到的。']]);saveSilently()}
function v10NearestFieldInteractable(px,py){const fd=v10Field();if(!fd)return null;if(dist(px,py,fd.exit.x,fd.exit.y)<60)return{type:'fieldExit',name:'离开遗迹'};for(const o of fd.props)if(dist(px,py,o.x,o.y)<60)return{type:'fieldProp',name:o.name,obj:o};for(const e of fd.enemies){if(state.world.fieldCleared[`${state.fieldId}:${e.id}`])continue;if(dist(px,py,e.x,e.y)<75)return{type:'fieldEnemy',name:e.name,enemy:e}}return null}
function nearestInteractable(){const px=state.player.inTank?state.tank.x:state.player.x,py=state.player.inTank?state.tank.y:state.player.y;if(state.scene==='world'){for(let i=0;i<state.unlocked;i++){const t=TOWNS[i];if(dist(px,py,t.x,t.y)<70)return{type:'town',town:i,name:t.name}}const i=state.townIndex,p=state.townProgress[i];if(!p.boss&&!p.claimed&&p.chief&&p.mechanic&&p.board){const b=bossPosition(i);if(dist(px,py,b.x,b.y)<78)return{type:'boss',town:i,name:TOWNS[i].boss}}for(const poi of V10_POIS){if(poi.chapter>Math.min(9,state.unlocked+1))continue;if(dist(px,py,poi.x,poi.y)<62)return{type:'worldPoi',name:poi.name,poi}}return null}else if(state.scene==='field')return v10NearestFieldInteractable(px,py);else if(state.scene==='town'){for(const b of townBuildings(state.townIndex)){const d=buildingDoor(b);if(dist(px,py,d.x,d.y)<54)return d}for(const n of getAmbientNpcs(state.townIndex))if(dist(px,py,n.x,n.y)<48)return{type:'ambient',name:n.name,npc:n};for(const lm of V8_LANDMARKS[state.townIndex]||[])if(dist(px,py,lm.x,lm.y)<56)return{type:'landmark',name:lm.name,landmark:lm};if(dist(px,py,700,850)<60)return{type:'exit',name:'荒原出口'}}else{if(dist(px,py,W/2,H-60)<62)return{type:'exitInterior',name:'离开房间'};for(const n of interiorNpcs(state.currentInterior,state.townIndex))if(dist(px,py,n.x,n.y)<60)return{type:'npc',...n};const fixtures=roomTemplate(state.currentInterior).fixtures;for(const f of fixtures){if(dist(px,py,f[1],f[2])<62)return{type:'fixture',fixture:f[0],name:fixtureName(f[0])}}}return null}
function v10InteractFieldProp(o){if(o.type==='crate'){const key=`${state.fieldId}:${o.id}`;if(state.world.fieldLooted[key])return openDialogue([['系统','箱子已经空了。']]);state.world.fieldLooted[key]=true;const sc=o.loot?.scrap||5,kit=o.loot?.kit||0;state.scrap+=sc;state.inventory.repairKits+=kit;openDialogue([['系统',`找到废料 ×${sc}${kit?`，修理包 ×${kit}`:''}。`]]);saveSilently();return}openDialogue(o.lines||[['旁白','设备已经无法读取。']])}
function interact(i){if(i.type==='town')return enterTown(i.town);if(i.type==='boss'){if(!state.player.inTank)return sayToast('赏金首战需要驾驶战车');return startBossBattle(i.town)}if(i.type==='worldPoi')return v10InteractPoi(i.poi);if(i.type==='fieldExit')return v10LeaveField();if(i.type==='fieldProp')return v10InteractFieldProp(i.obj);if(i.type==='fieldEnemy'){if(!state.player.inTank)return sayToast('这种目标需要战车火力');const e=i.enemy;return startBattle({...e,boss:false,fieldId:state.fieldId,fieldEnemyId:e.id})}if(i.type==='exit')return leaveTown();if(i.type==='door')return enterInterior(i.building);if(i.type==='exitInterior')return leaveInterior();if(i.type==='npc')return talkNpc(i);if(i.type==='ambient')return talkAmbient(i.npc);if(i.type==='fixture')return interactFixture(i.fixture);if(i.type==='landmark')return openDialogue(i.landmark.lines)}
function startRandomBattle(){if(!state.player.inTank)return;const f=state.tank,i=v10RegionIndex(f.x,f.y),pool=V10_ENEMIES[i],e=pool[Math.floor(Math.random()*pool.length)];state.townIndex=i;startBattle({...e,boss:false,region:i})}
function winBattle(){const e=battle.enemy;state.gold+=e.reward;let i=Number.isInteger(e.region)?e.region:state.townIndex;const salvage=e.boss?3+Math.floor((e.town??i)/2):1+Math.floor(i/3);state.scrap+=salvage;if(e.fieldId&&e.fieldEnemyId)state.world.fieldCleared[`${e.fieldId}:${e.fieldEnemyId}`]=true;if(e.boss){const bi=e.town;state.killed[bi]=true;state.townProgress[bi].boss=true;const drop=BOSS_DROPS[bi];if(drop&&!state.inventory.parts.includes(drop))state.inventory.parts.push(drop);battle.log=`${e.name} 被击破！掉落：${findPart(drop)?.name||'核心'} / 废料 +${salvage}。返回 ${TOWNS[bi].name} 交付。`;if(state.party.lincheng)state.tank.hp=Math.min(tankMax(),state.tank.hp+Math.round(tankMax()*.18))}else{const j=state.sideJobs[i];if(j?.accepted&&!j.done&&!e.fieldId){j.kills++;if(j.kills>=SIDE_JOBS[i].goal){j.done=true;battle.log=`敌人被击破！获得 ${e.reward}G / 废料 +${salvage}。本地委托已完成，回酒馆领奖。`}else battle.log=`敌人被击破！获得 ${e.reward}G / 废料 +${salvage}。委托进度 ${j.kills}/${SIDE_JOBS[i].goal}。`}else battle.log=`${e.name} 被击破！获得 ${e.reward}G / 废料 +${salvage}。`}battle.win=true;saveSilently()}
function enemyTurn(){if(!battle)return;let dmg=Math.max(1,Math.round(battle.enemy.atk*rnd(.84,1.2)-tankDef()));state.tank.hp-=dmg;battle.log+=`  ${battle.enemy.name} 反击 -${dmg}`;if(state.tank.hp<=0){state.tank.hp=Math.round(tankMax()*.45);state.player.inTank=false;battle=null;mode='play';const i=v10RegionIndex(state.tank.x,state.tank.y),t=TOWNS[i];state.scene='world';state.fieldId=null;state.fieldReturn=null;state.tank.x=t.x+70;state.tank.y=t.y+70;state.player.x=t.x+25;state.player.y=t.y+70;state.townIndex=i;state.gold=Math.max(0,state.gold-300);sayToast('战车大破，被拖回最近道路')}}
function v10MapItems(){const found=V10_POIS.filter(p=>state.world.discovered[p.id]||p.visible).length;return [`已发现地点 ${found}/${V10_POIS.length}`,`行驶里程 ${Math.round(state.world.distance/10)/10} km`,`当前地形 ${v10BiomeName((state.player.inTank?state.tank:state.player).x,(state.player.inTank?state.tank:state.player).y)}`]}
function openMenu(){menu={items:['继续游戏','任务日志','荒原地图','战车状态','同伴档案','零件仓库','装备改造','保存游戏'],sel:0,sub:null};mode='menu';setHint('方向键选择 · A 确认 · B 返回')}
function menuConfirm(){if(menu.shop){shopConfirm();return}if(menu.sub){if(menu.sub.onSelect)menu.sub.onSelect(menu.sel);return}if(menu.garage){if(menu.sel===0)openPartsMenu();else if(menu.sel===1)openUpgradeSub();else if(menu.sel===2)openVehicleSwitch();else if(menu.sel===3){const cost=Math.max(80,Math.round((tankMax()-state.tank.hp)*.45));if(state.gold<cost)return sayToast(`补满装甲需要 ${cost}G`);state.gold-=cost;state.tank.hp=tankMax();sayToast('装甲已补满');saveSilently()}else closeMenu();return}switch(menu.sel){case 0:closeMenu();break;case 1:menu.sub={title:'任务日志',items:[questText()],onSelect:()=>{}};menu.sel=0;break;case 2:menu.sub={title:'荒原地图',items:v10MapItems(),onSelect:()=>{}};state.world.mapOpened=true;menu.sel=0;break;case 3:menu.sub={title:'战车状态',items:[tankStatusText(),`载重 ${loadUsed().toFixed(1)} / ${loadMax().toFixed(1)} t`],onSelect:()=>{}};menu.sel=0;break;case 4:openCompanionMenu();break;case 5:openPartsMenu();break;case 6:openUpgradeSub();break;case 7:save();closeMenu();break}}
function v10DrawMiniWorldMap(x,y,w,h){ctx.fillStyle='#1a2020';ctx.fillRect(x,y,w,h);ctx.strokeStyle='#6b6f64';ctx.strokeRect(x,y,w,h);const sx=w/V9_WORLD_W,sy=h/V9_WORLD_H;for(const r of V9_RIVERS){ctx.strokeStyle='#426e83';ctx.lineWidth=2;ctx.beginPath();r.forEach((p,i)=>{const px=x+p[0]*sx,py=y+p[1]*sy;i?ctx.lineTo(px,py):ctx.moveTo(px,py)});ctx.stroke()}for(const r of V9_ROADS){ctx.strokeStyle='#91764d';ctx.lineWidth=1.5;ctx.beginPath();r.forEach((p,i)=>{const px=x+p[0]*sx,py=y+p[1]*sy;i?ctx.lineTo(px,py):ctx.moveTo(px,py)});ctx.stroke()}for(let i=0;i<state.unlocked;i++){const t=TOWNS[i];ctx.fillStyle='#e0c681';ctx.fillRect(x+t.x*sx-2,y+t.y*sy-2,5,5)}for(const p of V10_POIS){if(!state.world.discovered[p.id]&&!p.visible)continue;ctx.fillStyle=p.type==='field'?'#c67554':'#9daa7a';ctx.fillRect(x+p.x*sx-1,y+p.y*sy-1,3,3)}const f=state.player.inTank?state.tank:state.player;ctx.fillStyle='#fff3c1';ctx.beginPath();ctx.arc(x+f.x*sx,y+f.y*sy,4,0,TAU);ctx.fill()}
function drawMenu(){if(!menu)return;ctx.fillStyle='rgba(5,8,7,.9)';ctx.fillRect(0,0,W,H);const x=70,y=38,w=820,h=458;v8RoundRect(x,y,w,h,16,'rgba(17,22,19,.98)','rgba(208,177,104,.34)');ctx.fillStyle='#111612';ctx.fillRect(x+18,y+18,238,h-36);ctx.fillStyle='#e3c981';ctx.font='700 20px sans-serif';ctx.textAlign='left';ctx.fillText(menu.sub?.title||'猎人终端',x+40,y+54);ctx.fillStyle='#7f8b7f';ctx.font='11px sans-serif';ctx.fillText(`${tankName()} · ${state.gold}G · 废料 ${state.scrap}`,x+40,y+76);const items=menu.sub?.items||menu.items;items.slice(0,9).forEach((it,i)=>{const yy=y+112+i*38;ctx.fillStyle=i===menu.sel?'#5d4a2e':'rgba(255,255,255,.025)';v8RoundRect(x+31,yy-24,212,31,6,ctx.fillStyle);ctx.fillStyle=i===menu.sel?'#fff0c1':'#c8cec6';ctx.font='12px sans-serif';ctx.fillText(it,x+45,yy-4)});const rx=x+280,ry=y+30,rw=w-310,rh=h-60;v8RoundRect(rx,ry,rw,rh,12,'rgba(255,255,255,.025)','rgba(255,255,255,.06)');ctx.fillStyle='#dfd9c9';ctx.font='bold 15px sans-serif';ctx.fillText(menu.sub?.title||'状态总览',rx+22,ry+32);if(menu.sub?.title==='荒原地图'){v10DrawMiniWorldMap(rx+22,ry+52,rw-44,230);ctx.fillStyle='#aab2aa';ctx.font='12px sans-serif';v10MapItems().forEach((l,k)=>ctx.fillText(l,rx+22,ry+310+k*24))}else if(menu.sub?.title==='零件仓库'){const owned=state.inventory.parts.map(findPart).filter(Boolean),p=owned[menu.sel];if(p){const cur=equipped(p.type);ctx.fillText(`${PART_LABEL[p.type]} / ${p.name}`,rx+22,ry+66);ctx.fillStyle='#e7c676';ctx.font='bold 21px sans-serif';ctx.fillText(p.type==='main'||p.type==='sub'||p.type==='se'?`火力 ${p.power}`:p.type==='engine'?`载重 +${p.capacity}t`:p.type==='armor'?`装甲 +${p.hp}`:`命中 +${p.acc||0}%`,rx+22,ry+102);ctx.fillStyle='#aab2aa';ctx.font='12px sans-serif';ctx.fillText(`当前：${cur.name}`,rx+22,ry+138)}}else{ctx.fillStyle='#aab2aa';ctx.font='12px sans-serif';ctx.fillText(tankStatusText(),rx+22,ry+70);ctx.fillText(`载重 ${loadUsed().toFixed(1)} / ${loadMax().toFixed(1)}t`,rx+22,ry+102);ctx.fillText(`当前任务：${questText()}`,rx+22,ry+140);if(state.scene==='world'){const f=state.player.inTank?state.tank:state.player;ctx.fillText(`地形：${v10BiomeName(f.x,f.y)}`,rx+22,ry+174)}}ctx.fillStyle='#879087';ctx.font='11px sans-serif';ctx.fillText('▲▼ 选择   A 确认   B 返回',rx+22,ry+rh-20)}
function updateHud(){const f=state.player.inTank?state.tank:state.player;$('zone').textContent=state.scene==='world'?v10BiomeName(f.x,f.y):state.scene==='field'?(v10Field()?.name||'遗迹'):state.scene==='town'?(currentTown?.name||'城镇'):`${currentTown?.name||''} · ${interiorName()}`;$('modeTag').textContent=state.player.inTank?'驾驶战车':'步行';$('hp').textContent=state.player.inTank?`${Math.ceil(state.tank.hp)}/${tankMax()}`:'人物';$('gold').textContent=state.gold;$('scrap').textContent=state.scrap;const q=$('quest');if(q)q.textContent=questText().slice(0,24);$('btnA').querySelector('small').textContent=contextALabel()}
function contextALabel(){if(mode==='dialogue')return'继续';if(mode==='menu'||mode==='battle')return'确认';const i=nearestInteractable();if(i)return i.type==='door'?'进入':i.type==='exitInterior'||i.type==='fieldExit'?'离开':i.type==='fieldEnemy'?'交战':'互动';if(state.player.inTank)return'下车';if(dist(state.player.x,state.player.y,state.tank.x,state.tank.y)<66&&state.scene!=='interior')return'上车';return'确认'}
function render(dt){ctx.clearRect(0,0,W,H);if(mode==='battle')drawBattle();else{if(state.scene==='world')drawWorld();else if(state.scene==='town')drawTown();else if(state.scene==='field')drawField();else drawInterior();drawPrompt();if(mode==='dialogue')drawDialogue(dt);if(mode==='menu')drawMenu()}if(toast.t>0){toast.t-=dt;ctx.fillStyle='#0b0e0be8';ctx.fillRect(W/2-235,105,470,38);ctx.strokeStyle='#776a48';ctx.strokeRect(W/2-235,105,470,38);ctx.fillStyle='#fff0bd';ctx.font='13px sans-serif';ctx.textAlign='center';ctx.fillText(toast.text,W/2,130)}updateHud()}


/* === v0.11 first-three-regions deepening: multi-floor dungeons, on-foot combat, hidden tank, schedules === */
const V11_VERSION='0.11.0';
const V11_FOOT_WEAPONS={
 rust_pistol:{name:'锈港 9mm 手枪',power:24,acc:91,crit:7},
 pump_shotgun:{name:'老式泵动霰弹枪',power:39,acc:84,crit:12},
 shock_smg:{name:'短脉冲冲锋枪',power:48,acc:93,crit:9},
 hunter_carbine:{name:'猎人卡宾枪',power:61,acc:95,crit:13}
};
const V11_BODY_ARMOR={
 canvas:{name:'旧猎人夹克',def:3,max:120},
 seawall:{name:'海堤防割背心',def:6,max:145},
 salt:{name:'盐碱复合护甲',def:9,max:170},
 neon:{name:'绝缘战斗服',def:12,max:195}
};
const V11_REGION_DUNGEONS=[
 {chapter:0,name:'锈港地下排水网',poi:'rust_drain',final:'rust_sewer_3',hint:'海堤维修场附近有一处战前排水井。旧猎杀系统曾从地下接入道路网。'},
 {chapter:1,name:'盐风旧输水隧道',poi:'salt_depth',final:'salt_tunnel_3',hint:'钢甲虫在守的不是地表水管，而是地下军用主泵和认证总线。'},
 {chapter:2,name:'霓虹井广播下层',poi:'neon_depth',final:'neon_service_3',hint:'塞壬九号的控制脉冲来自广播塔下方的旧群体控制实验区。'}
];

// New hidden vehicle. It can coexist with chapter reward vehicles.
if(!VEHICLES.some(v=>v.name==='海狼侦察战车'))VEHICLES.push({name:'海狼侦察战车',max:640,spd:184,armor:7,load:17,body:'#516a70',turret:'low',track:'light'});
const V11_HIDDEN_TANK_INDEX=VEHICLES.findIndex(v=>v.name==='海狼侦察战车');

// Dense first-three-region exploration points.
for(const p of [
 {id:'rust_drain',x:740,y:735,name:'暴雨排水井',type:'field',field:'rust_sewer_1',visible:true,chapter:0,icon:'▾',desc:'锈港旧海堤下面的排水井。入口只能步行进入。'},
 {id:'rust_hut',x:360,y:675,name:'海岸猎人棚',type:'camp',visible:false,chapter:0,icon:'♨',reward:{scrap:5},desc:'一间用船壳搭成的猎人棚，墙上钉着铁牙猎犬的巡逻时间。'},
 {id:'salt_depth',x:1695,y:740,name:'裂开的输水检修口',type:'field',field:'salt_tunnel_1',visible:true,chapter:1,icon:'▾',desc:'旧输水管线下方有三层检修通道。'},
 {id:'salt_refuge',x:1435,y:470,name:'盐民避风洞',type:'camp',visible:false,chapter:1,icon:'♨',reward:{scrap:6},desc:'盐民在岩壁里挖出的避风洞，留着一张旧泵站维护图。'},
 {id:'neon_depth',x:2240,y:870,name:'广播塔检修井',type:'field',field:'neon_service_1',visible:true,chapter:2,icon:'▾',desc:'霓虹井广播塔下方的维护入口。地下仍有电。'},
 {id:'neon_rooftop',x:2050,y:640,name:'废广告楼顶',type:'cache',visible:false,chapter:2,icon:'◇',reward:{scrap:9,kit:1},desc:'楼顶能直接看到广播塔和三条旧电缆沟。'}
]) if(!V10_POIS.some(x=>x.id===p.id))V10_POIS.push(p);

function v11Walls(pattern='sewer'){
 const outer=[{x:250,y:0,w:55,h:250},{x:250,y:360,w:55,h:440},{x:565,y:110,w:60,h:570},{x:900,y:0,w:58,h:310},{x:900,y:425,w:58,h:375},{x:1190,y:120,w:60,h:550}];
 if(pattern==='salt')return outer.concat([{x:305,y:290,w:260,h:42},{x:625,y:525,w:275,h:42},{x:958,y:330,w:232,h:42}]);
 if(pattern==='neon')return outer.concat([{x:305,y:170,w:260,h:40},{x:625,y:350,w:275,h:42},{x:958,y:585,w:230,h:40}]);
 return outer.concat([{x:305,y:520,w:260,h:42},{x:625,y:250,w:275,h:42},{x:958,y:490,w:232,h:42}]);
}
function v11FootEnemies(prefix,chapter,floor,names){return names.map((name,k)=>({id:`${prefix}${floor}_${k}`,x:400+k*310,y:k%2?220:620,name,hp:72+chapter*38+floor*30+k*16,atk:10+chapter*5+floor*3+k*2,reward:55+chapter*35+floor*25+k*15,foot:true,exp:28+chapter*16+floor*12+k*6}))}
function v11Floor(name,palette,parentField,nextField,chapter,floor,pattern,names,props=[]){return{name,w:1420,h:800,palette,allowTank:false,parentField,spawn:{x:115,y:400},exit:{x:68,y:400},solids:v11Walls(pattern),props:[...props,...(nextField?[{id:`stairs_${floor}`,type:'stairs',x:1270,y:400,name:'下层通道',target:nextField,targetSpawn:{x:150,y:400}}]:[])],enemies:v11FootEnemies(name.slice(0,4),chapter,floor,names)}}

Object.assign(V10_FIELDS,{
 rust_sewer_1:v11Floor('锈港排水网 B1',['#334245','#20292b','#586267'],null,'rust_sewer_2',0,1,'sewer',['鼠群无人机','排水管巡检机'],[
  {id:'rust_map',type:'lore',x:445,y:185,name:'锈港旧排水图',lines:[['旁白','图纸上三条排水干线最后都汇入海堤旧控制井。'],['柳焰','这就解释了为什么铁牙猎犬总能绕过路障。它走的根本不是地面线路。']]},
  {id:'rust_armory',type:'armory',x:760,y:600,name:'维修警卫柜',loot:{weapon:'pump_shotgun',scrap:5}}
 ]),
 rust_sewer_2:v11Floor('锈港排水网 B2',['#2d3b3d','#1e2526','#516067'],'rust_sewer_1','rust_sewer_3',0,2,'sewer',['维护哨兵','污水处理警戒机','旧保安机器人'],[
  {id:'rust_vest',type:'armory',x:735,y:155,name:'应急防护柜',loot:{armor:'seawall',scrap:7}},
  {id:'rust_log',type:'lore',x:1045,y:585,name:'道路接管日志',lines:[['旧终端','“道路识别权移交：猎杀单元 K-09。优先级：高于地方交通控制。”'],['柳焰','K-09，就是铁牙猎犬。它被允许把整条路当成自己的猎场。']]}
 ]),
 rust_sewer_3:v11Floor('海堤控制井 B3',['#263638','#171f21','#4d5a5d'],'rust_sewer_2',null,0,3,'sewer',['控制井守卫','K-09 认证哨兵'],[
  {id:'rust_elite',type:'intel',x:1125,y:165,name:'K-09 路径核心',chapter:0,requiresClear:true,lines:[['旁白','你从核心里读出了铁牙猎犬每天黄昏使用的真实回收路径。'],['柳焰','这次不是“可能在那里”。我们知道它会从哪条路回来。']]},
  {id:'seawolf',type:'hiddenTank',x:1030,y:610,name:'封存车辆：海狼侦察战车'}
 ]),
 salt_tunnel_1:v11Floor('盐风输水隧道 L1',['#6c654c','#3c3b31','#95845b'],null,'salt_tunnel_2',1,1,'salt',['盐蚀维护机','管线掠夺者'],[
  {id:'salt_note',type:'lore',x:470,y:610,name:'旧供水班记录',lines:[['旁白','记录显示地表水管只是旁路，真正的主泵在更深处。'],['桃夭','钢甲虫是在保护旧基地，不是在攻击镇子。只是它分不清现在是谁在喝水。']]},
  {id:'salt_med',type:'armory',x:770,y:190,name:'工班储物柜',loot:{scrap:8,med:1}}
 ]),
 salt_tunnel_2:v11Floor('盐风输水隧道 L2',['#5d5844','#34342d','#857852'],'salt_tunnel_1','salt_tunnel_3',1,2,'salt',['泵站警戒员','结晶甲虫幼体','高压阀门机'],[
  {id:'salt_armor',type:'armory',x:1080,y:560,name:'旧军防护柜',loot:{armor:'salt',scrap:9}},
  {id:'salt_code',type:'lore',x:730,y:160,name:'赤角认证板',lines:[['桃夭','赤角突击车的维护权限就在这块板里。'],['旁白','认证记录最后一次更新是在战争结束前九天。']]}
 ]),
 salt_tunnel_3:v11Floor('军用主泵核心 L3',['#504b3d','#2c2e29','#796c4b'],'salt_tunnel_2',null,1,3,'salt',['主泵守卫','认证总线哨兵','重型阀门机'],[
  {id:'salt_intel',type:'intel',x:1110,y:180,name:'钢甲虫路径总线',chapter:1,requiresClear:true,lines:[['旁白','总线记录了钢甲虫每天检查三条主水管的顺序。'],['桃夭','路线固定、速度固定、转身慢。好，终于有个能打的窗口了。']]}
 ]),
 neon_service_1:v11Floor('霓虹井广播下层 B1',['#3d3949','#252631','#685c78'],null,'neon_service_2',2,1,'neon',['广播维护机','失控巡检员'],[
  {id:'neon_wave',type:'lore',x:430,y:180,name:'波形记录墙',lines:[['林澄','这些不是广播节目，是把一段控制脉冲伪装进城市通讯。'],['旁白','每隔十七秒，墙上的记录都会出现同样的尖峰。']]},
  {id:'neon_weapon',type:'armory',x:770,y:595,name:'保安武器柜',loot:{weapon:'shock_smg',scrap:8}}
 ]),
 neon_service_2:v11Floor('霓虹井实验层 B2',['#353342','#22242d','#5b5269'],'neon_service_1','neon_service_3',2,2,'neon',['共振实验机','神经脉冲哨兵','旧实验保安'],[
  {id:'neon_armor',type:'armory',x:1045,y:180,name:'绝缘装备柜',loot:{armor:'neon',scrap:10}},
  {id:'neon_subject',type:'lore',x:735,y:590,name:'受试者名单',lines:[['林澄','这里做过群体同步实验。塞壬九号只是把实验室搬到了街上。'],['旁白','名单最后一页标着“平台化部署：SIREN-09”。']]}
 ]),
 neon_service_3:v11Floor('群体控制核心 B3',['#2f2e3d','#1c2027','#514863'],'neon_service_2',null,2,3,'neon',['控制核心哨兵','塞壬信号代理','脉冲防御机'],[
  {id:'neon_intel',type:'intel',x:1110,y:180,name:'塞壬同步主机',chapter:2,requiresClear:true,lines:[['林澄','主机已经把下一次广播周期写进缓存。'],['旁白','你得到塞壬九号下一次进入发射位的精确时间和坐标。']]},
  {id:'carbine',type:'armory',x:1040,y:610,name:'实验保安长柜',loot:{weapon:'hunter_carbine',scrap:12}}
 ])
});

// State migration and true character-combat stats.
const v11OldNormalizeState=normalizeState;
normalizeState=function(){v11OldNormalizeState();state.person=Object.assign({hp:120,max:120,level:1,exp:0,weapon:'rust_pistol',armor:'canvas',medkits:2,guard:false},state.person||{});state.v11=Object.assign({huntIntel:[false,false,false],hiddenTank:false,deepest:{},dungeonVisits:{},eliteKills:{},regionStories:[0,0,0],contracts:[false,false,false]},state.v11||{});if(!Array.isArray(state.v11.huntIntel))state.v11.huntIntel=[false,false,false];state.saveVersion=11;};
normalizeState();saveSilently();
function v11Weapon(){return V11_FOOT_WEAPONS[state.person.weapon]||V11_FOOT_WEAPONS.rust_pistol}
function v11Armor(){return V11_BODY_ARMOR[state.person.armor]||V11_BODY_ARMOR.canvas}
function v11PersonMax(){return v11Armor().max+Math.max(0,state.person.level-1)*10}
function v11PersonAtk(){return v11Weapon().power+Math.max(0,state.person.level-1)*4}
function v11PersonDef(){return v11Armor().def+Math.floor((state.person.level-1)*1.5)}
function v11GainExp(xp){state.person.exp+=xp;let need=70+state.person.level*55;let leveled=false;while(state.person.exp>=need&&state.person.level<12){state.person.exp-=need;state.person.level++;state.person.hp=v11PersonMax();leveled=true;need=70+state.person.level*55}if(leveled)sayToast(`猎人等级提升至 Lv.${state.person.level}`)}

// Dungeon floor transition while retaining original world return point.
function v11TransitionField(target,spawn){const fd=V10_FIELDS[target];if(!fd)return;state.fieldId=target;state.scene='field';state.player.inTank=false;state.player.x=spawn?.x??fd.spawn.x;state.player.y=spawn?.y??fd.spawn.y;state.tank.x=state.player.x;state.tank.y=state.player.y;state.v11.deepest[target.split('_').slice(0,2).join('_')]=Math.max(state.v11.deepest[target.split('_').slice(0,2).join('_')]||0,Number(target.match(/(\d+)$/)?.[1]||1));state.v11.dungeonVisits[target]=(state.v11.dungeonVisits[target]||0)+1;sayToast(fd.name);saveSilently()}
function v11AllFieldEnemiesCleared(fieldId){const fd=V10_FIELDS[fieldId];return fd&&fd.enemies.every(e=>state.world.fieldCleared[`${fieldId}:${e.id}`])}

// Draw foot enemies differently from vehicles.
const v11OldDrawFieldEnemy=v10DrawFieldEnemy;
v10DrawFieldEnemy=function(e){if(!e.foot)return v11OldDrawFieldEnemy(e);const p=fieldToScreen(e.x,e.y),cleared=!!state.world.fieldCleared[`${state.fieldId}:${e.id}`];if(cleared){ctx.fillStyle='#2b2d2b';ctx.fillRect(p.x-8,p.y+4,16,5);return}ctx.save();ctx.translate(p.x,p.y);ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(-10,11,20,4);ctx.fillStyle='#34383b';ctx.fillRect(-7,-5,14,18);ctx.fillStyle=e.id.includes('2_')?'#74646f':'#7a5d49';ctx.fillRect(-9,-5,18,10);ctx.fillStyle='#c7a17c';ctx.fillRect(-5,-15,10,9);ctx.fillStyle='#d85b49';ctx.fillRect(3,-12,2,2);ctx.fillStyle='#696f73';ctx.fillRect(7,-4,12,3);ctx.restore()}
const v11OldDrawFieldProp=v10DrawFieldProp;
v10DrawFieldProp=function(o){if(o.type==='stairs'||o.type==='intel'||o.type==='hiddenTank'||o.type==='armory'){const p=fieldToScreen(o.x,o.y);ctx.save();ctx.translate(p.x,p.y);if(o.type==='stairs'){ctx.fillStyle='#171b1c';ctx.fillRect(-22,-18,44,36);ctx.strokeStyle='#a78d60';ctx.strokeRect(-22,-18,44,36);for(let y=-12;y<=12;y+=8){ctx.strokeStyle='#62635b';ctx.beginPath();ctx.moveTo(-14,y);ctx.lineTo(14,y);ctx.stroke()}}else if(o.type==='intel'){ctx.fillStyle='#2e3334';ctx.fillRect(-20,-26,40,50);ctx.fillStyle='#76b8b0';ctx.fillRect(-13,-18,26,15);ctx.strokeStyle='#d6c485';ctx.strokeRect(-20,-26,40,50)}else if(o.type==='hiddenTank'){ctx.scale(.72,.72);drawTankModel(0,0,0,V11_HIDDEN_TANK_INDEX,1.15,false)}else{ctx.fillStyle='#39403f';ctx.fillRect(-20,-25,40,50);ctx.strokeStyle='#98856a';ctx.strokeRect(-20,-25,40,50);ctx.fillStyle='#6f795f';ctx.fillRect(-13,-15,26,8)}ctx.restore();return}return v11OldDrawFieldProp(o)};

// Walking combat.
function v11StartFootBattle(e){battle={enemy:{...e,max:e.hp},actions:['射击','近战','急救剂','防御','撤退'],sel:0,log:`步战遭遇 ${e.name}！`,win:false,type:'foot'};mode='battle';setHint('方向键选择 · A 确认 · B 返回')}
const v11OldBattleConfirm=battleConfirm;
battleConfirm=function(){if(!battle||battle.type!=='foot')return v11OldBattleConfirm();if(battle.win){endBattle();return}const a=battle.sel,w=v11Weapon();state.person.guard=false;if(a===0){const hit=clamp(w.acc+state.person.level,65,99);if(Math.random()*100>hit){battle.log=`${w.name} 射偏了。`;return enemyTurn()}let dmg=Math.round(v11PersonAtk()*rnd(.88,1.15));if(Math.random()*100<w.crit)dmg=Math.round(dmg*1.65);if(state.party.liuyan)dmg=Math.round(dmg*1.05);battle.enemy.hp-=dmg;battle.log=`${w.name} 命中，造成 ${dmg} 伤害。`;if(battle.enemy.hp<=0)return winBattle();enemyTurn()}else if(a===1){let dmg=Math.round((17+state.person.level*5)*rnd(.9,1.18));battle.enemy.hp-=dmg;battle.log=`近战突击造成 ${dmg} 伤害。`;if(battle.enemy.hp<=0)return winBattle();enemyTurn()}else if(a===2){if(state.person.medkits<=0){battle.log='没有急救剂。';return}state.person.medkits--;const heal=Math.round(v11PersonMax()*.42);state.person.hp=Math.min(v11PersonMax(),state.person.hp+heal);battle.log=`急救恢复 ${heal} 生命。`;enemyTurn()}else if(a===3){state.person.guard=true;battle.log='采取防御姿态。';enemyTurn()}else{if(Math.random()<.78){battle=null;mode='play';sayToast('成功脱离步战')}else{battle.log='撤退失败。';enemyTurn()}}};
const v11OldEnemyTurn=enemyTurn;
enemyTurn=function(){if(!battle||battle.type!=='foot')return v11OldEnemyTurn();let dmg=Math.max(1,Math.round(battle.enemy.atk*rnd(.84,1.16)-v11PersonDef()));if(state.person.guard)dmg=Math.max(1,Math.floor(dmg*.45));state.person.hp-=dmg;battle.log+=`  ${battle.enemy.name} 反击 -${dmg}`;state.person.guard=false;if(state.person.hp<=0){state.person.hp=Math.ceil(v11PersonMax()*.62);state.gold=Math.max(0,state.gold-120);battle=null;mode='play';state.scene='world';state.fieldId=null;state.fieldReturn=null;state.player.inTank=false;const i=Math.min(2,v10RegionIndex(state.player.x,state.player.y)),t=TOWNS[i];state.player.x=t.x+32;state.player.y=t.y+68;state.tank.x=t.x+70;state.tank.y=t.y+70;state.townIndex=i;sayToast('猎人负伤，被路人送回最近城镇') }};
const v11OldWinBattle=winBattle;
winBattle=function(){if(!battle||battle.type!=='foot')return v11OldWinBattle();const e=battle.enemy;state.gold+=e.reward||0;const xp=e.exp||25;state.scrap+=1+Math.floor((e.reward||50)/180);if(e.fieldId&&e.fieldEnemyId)state.world.fieldCleared[`${e.fieldId}:${e.fieldEnemyId}`]=true;v11GainExp(xp);if(e.miniBoss){state.v11.eliteKills[e.miniBoss]=true}battle.log=`${e.name} 被击倒！获得 ${e.reward||0}G / 经验 ${xp}。`;battle.win=true;saveSilently()};
const v11OldDrawBattle=drawBattle;
drawBattle=function(){if(!battle||battle.type!=='foot')return v11OldDrawBattle();const fd=v10Field();ctx.fillStyle=fd?.palette?.[0]||'#313432';ctx.fillRect(0,0,W,H);for(let k=0;k<9;k++){ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(k*120,130+(k%3)*22,70,240)};ctx.save();ctx.translate(180,285);ctx.scale(2,2);ctx.fillStyle='rgba(0,0,0,.28)';ctx.fillRect(-9,13,18,4);ctx.fillStyle='#252926';ctx.fillRect(-7,3,5,12);ctx.fillRect(2,3,5,12);ctx.fillStyle='#704536';ctx.fillRect(-8,-10,16,15);ctx.fillStyle='#d9a078';ctx.fillRect(-6,-19,12,10);ctx.fillStyle='#34261f';ctx.fillRect(-7,-21,14,5);ctx.fillStyle='#171717';ctx.fillRect(3,-16,2,2);ctx.restore();const ex=735,ey=280;ctx.save();ctx.translate(ex,ey);ctx.scale(2.3,2.3);ctx.fillStyle='#34383b';ctx.fillRect(-7,-5,14,18);ctx.fillStyle='#8e5b48';ctx.fillRect(-9,-5,18,10);ctx.fillStyle='#c7a17c';ctx.fillRect(-5,-15,10,9);ctx.fillStyle='#d85b49';ctx.fillRect(3,-12,2,2);ctx.fillStyle='#747b7d';ctx.fillRect(7,-4,12,3);ctx.restore();v8RoundRect(34,28,892,82,12,'rgba(8,11,10,.86)','rgba(255,255,255,.08)');ctx.fillStyle='#f0d08a';ctx.font='700 20px sans-serif';ctx.textAlign='left';ctx.fillText(battle.enemy.name,55,57);ctx.fillStyle='#4b2622';ctx.fillRect(55,72,480,13);ctx.fillStyle='#c65348';ctx.fillRect(55,72,480*clamp(battle.enemy.hp/battle.enemy.max,0,1),13);ctx.fillStyle='#d9ddd7';ctx.font='11px sans-serif';ctx.fillText(`${Math.max(0,Math.round(battle.enemy.hp))}/${battle.enemy.max}`,548,84);ctx.fillStyle='#101410ef';ctx.fillRect(25,350,910,165);ctx.strokeStyle='#6f795f';ctx.strokeRect(25,350,910,165);ctx.fillStyle='#d1d6ce';ctx.font='12px sans-serif';wrapText(battle.log,48,375,840,19);battle.actions.forEach((a,k)=>{const x=48+k*173,y=414,active=k===battle.sel;v8RoundRect(x,y,154,66,10,active?'#694f2f':'#202721',active?'#d0ad63':'rgba(255,255,255,.08)');ctx.fillStyle=active?'#fff0bd':'#d8ddd4';ctx.font='bold 14px sans-serif';ctx.fillText(a,x+15,y+24);ctx.fillStyle=active?'#d8bc79':'#77827a';ctx.font='10px sans-serif';const sub=k===0?`${v11Weapon().name} ${v11PersonAtk()}`:k===1?`近战 ${17+state.person.level*5}`:k===2?`急救剂 ${state.person.medkits}`:k===3?`减伤 55%`:'成功率 78%';ctx.fillText(sub,x+15,y+47)});ctx.fillStyle='#e6d7af';ctx.font='12px monospace';ctx.fillText(`猎人 Lv.${state.person.level}  HP ${Math.max(0,state.person.hp)}/${v11PersonMax()}  防御 ${v11PersonDef()}`,48,333);if(battle.win){ctx.fillStyle='#f2d27d';ctx.font='bold 14px sans-serif';ctx.fillText('A 结束战斗',790,336)}};

// Rich field interactions and stairs.
const v11OldV10Nearest=v10NearestFieldInteractable;
v10NearestFieldInteractable=function(px,py){const fd=v10Field();if(fd?.parentField&&dist(px,py,fd.exit.x,fd.exit.y)<60)return{type:'fieldPortal',name:'返回上层',target:fd.parentField,targetSpawn:{x:1240,y:400}};return v11OldV10Nearest(px,py)};
const v11OldInteractFieldProp=v10InteractFieldProp;
v10InteractFieldProp=function(o){if(o.type==='stairs')return v11TransitionField(o.target,o.targetSpawn);if(o.type==='armory'){const key=`${state.fieldId}:${o.id}`;if(state.world.fieldLooted[key])return openDialogue([['系统','装备柜已经空了。']]);state.world.fieldLooted[key]=true;const lines=[];if(o.loot?.weapon){state.person.weapon=o.loot.weapon;lines.push(['系统',`获得人物武器：${V11_FOOT_WEAPONS[o.loot.weapon].name}，已自动装备。`])}if(o.loot?.armor){state.person.armor=o.loot.armor;state.person.hp=v11PersonMax();lines.push(['系统',`获得人物护甲：${V11_BODY_ARMOR[o.loot.armor].name}，已自动装备。`])}if(o.loot?.med){state.person.medkits+=(o.loot.med||1);lines.push(['系统',`获得急救剂 ×${o.loot.med||1}。`])}if(o.loot?.scrap){state.scrap+=o.loot.scrap;lines.push(['系统',`获得废料 ×${o.loot.scrap}。`])}openDialogue(lines.length?lines:[['系统','里面只剩空包装。']]);saveSilently();return}if(o.type==='intel'){if(o.requiresClear&&!v11AllFieldEnemiesCleared(state.fieldId))return openDialogue([['系统','主机被警戒单位锁定。先清理本层敌人。']]);state.v11.huntIntel[o.chapter]=true;openDialogue(o.lines||[['系统','获得赏金首巢穴坐标。']]);saveSilently();return}if(o.type==='hiddenTank'){if(!v11AllFieldEnemiesCleared(state.fieldId))return openDialogue([['旁白','封存车旁的认证终端仍被警戒单位锁定。']]);if(state.v11.hiddenTank)return openDialogue([['系统','海狼侦察战车已经登记在你的车库。']]);state.v11.hiddenTank=true;if(!state.owned.includes(V11_HIDDEN_TANK_INDEX))state.owned.push(V11_HIDDEN_TANK_INDEX);openDialogue([['旁白','帆布下面是一辆轻型侦察战车，底盘编号仍然完整。'],['桃夭','海狼侦察型。火力不算大，但比主线车快得多。隐藏车就是这种东西——不是更强，是另一种玩法。'],['系统','获得隐藏战车：海狼侦察战车。可在任意车库切换。']]);saveSilently();return}return v11OldInteractFieldProp(o)};

// Interactions: footsteps fight on-foot, portals retain dungeon return.
const v11OldInteract=interact;
interact=function(i){if(i.type==='fieldPortal')return v11TransitionField(i.target,i.targetSpawn);if(i.type==='fieldEnemy'&&i.enemy?.foot){const e=i.enemy;return v11StartFootBattle({...e,boss:false,fieldId:state.fieldId,fieldEnemyId:e.id})}return v11OldInteract(i)};

// The first three bounty hunts now require the final dungeon coordinate, not just three town conversations.
const v11OldStartBossBattle=startBossBattle;
startBossBattle=function(i){if(i<3&&!state.v11.huntIntel[i]){const d=V11_REGION_DUNGEONS[i];return openDialogue([['系统',`现有三条城镇情报仍不足以锁定 ${TOWNS[i].boss}。`],['柳焰',d.hint],['系统',`调查目标：${d.name}。`]])}return v11OldStartBossBattle(i)};
const v11OldQuestText=questText;
questText=function(){const i=state.townIndex,p=state.townProgress[i];if(i<3&&!p.claimed&&!p.boss&&p.chief&&p.mechanic&&p.board&&!state.v11.huntIntel[i])return`深入 ${V11_REGION_DUNGEONS[i].name}，取得 ${TOWNS[i].boss} 的精确追猎坐标。`;return v11OldQuestText()};

// Town schedules and first-three-area residents now feel occupied instead of standing like quest buttons.
const v11OldGetAmbientNpcs=getAmbientNpcs;
getAmbientNpcs=function(i){const base=v11OldGetAmbientNpcs(i);if(i>2)return base;const h=state.time;const slots=[
  [{name:'海堤装卸工',model:'npcA',day:[330,650],night:[470,310],line:'潮位一退，运输队就开始抢时间。铁牙猎犬也知道这个规律。'},{name:'巡堤员',model:'npcB',day:[1010,620],night:[860,235],line:'晚上我会去警报柱值班，白天才沿海堤巡逻。'}],
  [{name:'水站搬运工',model:'npcA',day:[390,690],night:[600,300],line:'白天搬水，晚上守阀门。这里每个人都知道水比弹药贵。'},{name:'盐民向导',model:'npcC',day:[1040,520],night:[840,720],line:'风大的时候看脚印没用，看盐壳裂纹。钢甲虫太重，会把盐层压碎。'}],
  [{name:'广告牌维修员',model:'npcB',day:[330,300],night:[550,680],line:'广告牌不是自己在闪，是地下那条旧电缆一直有人供电。'},{name:'夜班护工',model:'npcA',day:[970,660],night:[760,320],line:'天一黑，昏睡的人就更多。林澄说这和广播周期有关。'}]
 ][i];const extra=slots.map((n,k)=>{const q=(h>=7&&h<19)?n.day:n.night;return{name:n.name,model:n.model,x:q[0],y:q[1],dir:(k?Math.PI:0),walk:(performance.now()/1000+k)*.5,line:n.line}});return base.concat(extra)};
const v11OldTalkAmbient=talkAmbient;
talkAmbient=function(n){if(n.line)return openDialogue([[n.name,n.line],[n.name,state.time<7?'天还没亮，城里只剩值夜班的人。':state.time>=19?'天黑之后，镇上的人会换一套活法。':'白天人多，能问到的东西也多。']]);return v11OldTalkAmbient(n)};

// Person HUD, extra menu status, and prompt labels.
const v11OldOpenMenu=openMenu;
openMenu=function(){v11OldOpenMenu();if(menu&&!menu.items.includes('猎人装备'))menu.items.splice(4,0,'猎人装备')};
const v11OldMenuConfirm=menuConfirm;
menuConfirm=function(){if(menu&&!menu.sub&&!menu.garage&&!menu.shop){const label=menu.items?.[menu.sel];if(label==='猎人装备'){const w=v11Weapon(),a=v11Armor();menu.sub={title:'猎人装备',items:[`等级 Lv.${state.person.level} / EXP ${state.person.exp}`,`生命 ${state.person.hp}/${v11PersonMax()}`,`武器 ${w.name} / 火力 ${v11PersonAtk()}`,`护甲 ${a.name} / 防御 ${v11PersonDef()}`,`急救剂 ${state.person.medkits}`,`隐藏战车 ${state.v11.hiddenTank?'海狼侦察战车':'未发现'}`],onSelect:()=>{}};menu.sel=0;return}const map={'继续游戏':0,'任务日志':1,'荒原地图':2,'战车状态':3,'同伴档案':4,'零件仓库':5,'装备改造':6,'保存游戏':7};if(label in map)menu.sel=map[label]}return v11OldMenuConfirm()};
const v11OldUpdateHud=updateHud;
updateHud=function(){v11OldUpdateHud();if(!state.player.inTank&&$('hp'))$('hp').textContent=`${state.person.hp}/${v11PersonMax()}`;if($('modeTag'))$('modeTag').textContent=state.player.inTank?'驾驶战车':state.scene==='field'?'地下步战':'步行'};
const v11OldContextALabel=contextALabel;
contextALabel=function(){const i=nearestInteractable();if(i?.type==='fieldPortal')return'返回上层';if(i?.type==='fieldProp'&&i.obj?.type==='stairs')return'下层';if(i?.type==='fieldEnemy'&&i.enemy?.foot)return'步战';return v11OldContextALabel()};

// Discovery text and map stats count the denser first three chapters.
const v11OldMapItems=v10MapItems;
v10MapItems=function(){const base=v11OldMapItems();const cleared=[0,1,2].filter(i=>state.v11.huntIntel[i]).length;return[...base,`前三章深层调查 ${cleared}/3`,`人物等级 Lv.${state.person.level}`]};

// Show dungeon depth in field title and slightly stronger environment detail.
const v11OldDrawField=drawField;
drawField=function(){v11OldDrawField();const fd=v10Field();if(!fd)return;const underground=/B\d|L\d|下层|排水网|输水隧道|实验层|控制核心/.test(fd.name);if(underground){ctx.fillStyle='rgba(6,10,12,.16)';for(let k=0;k<8;k++){ctx.fillRect((k*139+performance.now()/15)%W,112+(k%4)*92,90,2)}ctx.fillStyle='rgba(230,202,135,.5)';ctx.font='10px monospace';ctx.textAlign='right';ctx.fillText('地下设施 · 战车已停在入口',W-24,93)}};

// Field exit from deeper layers returns one floor instead of teleporting to the world.
const v11OldLeaveField=v10LeaveField;
v10LeaveField=function(){const fd=v10Field();if(fd?.parentField)return v11TransitionField(fd.parentField,{x:1240,y:400});return v11OldLeaveField()};

// First three dungeon entrances are explicitly walk-in facilities; parking the tank is part of the flow.
const v11OldInteractPoi=v10InteractPoi;
v10InteractPoi=function(p){if(p.type==='field'&&['rust_sewer_1','salt_tunnel_1','neon_service_1'].includes(p.field)){state.world.discovered[p.id]=true;if(!state.player.inTank)return sayToast('先把战车停在入口附近，再进入检修口');openDialogue([['旁白',`${p.name} 的入口太窄，战车无法进入。你把车停在外面，带着随身武器下去。`],['系统','地下区域采用人物步战。人物 HP、武器和护甲独立于战车。']]);const wait=()=>{if(mode==='play')v10EnterField(p.field,p);else setTimeout(wait,50)};setTimeout(wait,50);return}return v11OldInteractPoi(p)};



// First three towns gain secondary civic buildings instead of only five functional boxes.
const V11_TOWN_EXTENSIONS={
 0:[{id:'inn',name:'海风旅店',x:470,y:555,w:235,h:155,style:'inn'},{id:'warehouse',name:'港务仓库',x:680,y:155,w:150,h:150,style:'warehouse2'}],
 1:[{id:'inn',name:'盐井旅舍',x:150,y:525,w:230,h:155,style:'inn'},{id:'house',name:'盐民合住屋',x:770,y:555,w:150,h:135,style:'house'}],
 2:[{id:'inn',name:'霓虹旅馆',x:470,y:550,w:235,h:160,style:'inn'},{id:'warehouse',name:'广播器材库',x:535,y:405,w:230,h:125,style:'warehouse2'}]
};
for(const [i,list] of Object.entries(V11_TOWN_EXTENSIONS))for(const b of list)if(!V9_LAYOUTS[i].some(x=>x.id===b.id))V9_LAYOUTS[i].push(b);
const v11OldDrawBuilding=drawBuilding;
drawBuilding=function(b){v11OldDrawBuilding(b);if(!['inn','house','warehouse'].includes(b.id))return;const p=townToScreen(b.x,b.y);ctx.save();if(b.id==='inn'){ctx.fillStyle='#6a4f3b';ctx.fillRect(p.x+16,p.y+48,b.w-32,26);ctx.fillStyle='#d5a964';for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(p.x+48+k*58,p.y+61,6,0,TAU);ctx.fill()}ctx.fillStyle='#f0d69a';ctx.font='bold 11px sans-serif';ctx.fillText('INN',p.x+28,p.y+102)}else if(b.id==='warehouse'){ctx.fillStyle='#353b39';ctx.fillRect(p.x+14,p.y+48,b.w-28,54);ctx.strokeStyle='#8a7659';ctx.lineWidth=3;for(let x=p.x+24;x<p.x+b.w-20;x+=24){ctx.beginPath();ctx.moveTo(x,p.y+50);ctx.lineTo(x,p.y+100);ctx.stroke()}ctx.fillStyle='#b99058';ctx.fillRect(p.x+18,p.y+112,b.w-36,8)}else{ctx.fillStyle='#5a5945';ctx.fillRect(p.x+16,p.y+48,b.w-32,34);ctx.fillStyle='rgba(239,202,128,.55)';ctx.fillRect(p.x+30,p.y+92,34,28);ctx.fillRect(p.x+b.w-64,p.y+92,34,28)}ctx.restore()};
const v11OldInteriorName=interiorName;
interiorName=function(){return{inn:'旅店',house:'民宅',warehouse:'仓库'}[state.currentInterior]||v11OldInteriorName()};
const v11OldRoomTemplate=roomTemplate;
roomTemplate=function(type){const extra={
 inn:{floor:'#514239',wall:'#2b2522',fixtures:[['desk',690,145],['bed',250,175],['bed',250,330],['table',505,310],['locker',830,300]]},
 house:{floor:'#555142',wall:'#2c2a25',fixtures:[['table',470,250],['bed',220,165],['bed',220,330],['locker',760,175],['shelf',770,330]]},
 warehouse:{floor:'#444944',wall:'#232725',fixtures:[['crate',230,160],['crate',390,160],['crate',230,330],['shelf',700,150],['locker',815,320]]}
 };return extra[type]?{w:960,h:540,...extra[type]}:v11OldRoomTemplate(type)};
const v11OldInteriorNpcs=interiorNpcs;
interiorNpcs=function(type,i){if(type==='inn')return[{name:i===0?'海风老板娘':i===1?'盐井老板':'霓虹旅店老板',role:'innkeeper',model:i===0?'npcB':'npcA',x:690,y:205,dir:Math.PI,walk:0},{name:'旅客',role:'ambient',model:'npcC',x:440,y:330,dir:0,walk:0}];if(type==='house')return[{name:'盐民母亲',role:'resident',model:'npcB',x:560,y:220,dir:Math.PI,walk:0},{name:'老水管工',role:'resident',model:'npcC',x:700,y:330,dir:Math.PI,walk:0}];if(type==='warehouse')return[{name:i===0?'港务保管员':'器材库管理员',role:'quartermaster',model:'npcC',x:650,y:230,dir:Math.PI,walk:0}];return v11OldInteriorNpcs(type,i)};


const v11OldTalkNpc=talkNpc;
talkNpc=function(o){if(o.role==='innkeeper'){const fee=45+state.townIndex*15;if(state.gold>=fee){state.gold-=fee;state.person.hp=v11PersonMax();state.person.medkits=Math.max(state.person.medkits,2);openDialogue([[o.name,`一晚 ${fee}G。热水不保证，但床单是干的。`],['系统','休息后人物生命完全恢复，急救剂补到至少 2 个。']]);saveSilently()}else openDialogue([[o.name,`一晚 ${fee}G。你现在的钱连床脚都不够。`]]);return}if(o.role==='resident'){const lines=state.townIndex===1?[[o.name,'我们以前觉得泵站只是旧废墟，直到钢甲虫开始把每一根新水管都咬断。'],[o.name,'真正懂这里的人都说：它不是在破坏，是在执行某种维护命令。']]:[[o.name,'这城里每个人都有一段不愿意说完的故事。']];return openDialogue(lines)}if(o.role==='quartermaster'){const i=state.townIndex,field=i===0?'rust_sewer_1':'neon_service_1';if(i>2)return v11OldTalkNpc(o);if(!v11AllFieldEnemiesCleared(field))return openDialogue([[o.name,i===0?'港务仓库最近被地下巡检机切断了排水线。把 B1 清干净，我给你一批备用物资。':'器材库下面一直有东西在走。先把广播下层 B1 清干净。'],['系统',`区域委托：清理 ${V10_FIELDS[field].name}。`]]);if(state.v11.contracts[i])return openDialogue([[o.name,'那批物资已经结清。之后再有活，我会在仓库门口挂红布。']]);state.v11.contracts[i]=true;state.gold+=260+i*120;state.scrap+=8+i*2;state.person.medkits++;openDialogue([[o.name,'干得利落。地下那帮东西安静以后，仓库的泵终于重新转了。'],['系统',`获得 ${260+i*120}G / 废料 ${8+i*2} / 急救剂 ×1。`]]);saveSilently();return}return v11OldTalkNpc(o)};
const v11OldInteractFixture=interactFixture;
interactFixture=function(f){if(f==='bed'&&!state.player.inTank){state.person.hp=v11PersonMax();sayToast('人物生命已恢复');return}return v11OldInteractFixture(f)};

// Version visible to testers.
sayToast('v0.11：前三章深层探索 / 人物步战已启用',2.8);

/* === v0.12 hunter-origin prologue + scene-density pass === */
const V12_VERSION='0.12.0';
V11_FOOT_WEAPONS.scrap_knife={name:'潮线拆解刀',power:13,acc:96,crit:5};
V11_FOOT_WEAPONS.harbor_pistol={name:'公会旧式手枪',power:28,acc:92,crit:8};

const v12FreshStart=!state.v12 && state.unlocked===1 && state.killed.every(v=>!v) && state.townProgress.every(p=>!p.chief&&!p.mechanic&&!p.board&&!p.boss&&!p.claimed) && !(state.v11?.huntIntel||[]).some(Boolean) && (state.world?.distance||0)<5;
const v12OldNormalizeState=normalizeState;
normalizeState=function(){
 v12OldNormalizeState();
 state.v12=Object.assign({
  prologueStage:11,originComplete:true,tankUnlocked:true,salvage:0,salvageFound:{},firstHuntCore:false,
  starterParts:{cell:false,coil:false},starterRepaired:false,registered:false,firstDrive:false,sceneFlags:{},originStarted:false
 },state.v12||{});
 state.saveVersion=12;
};
normalizeState();

function v12OriginActive(){return !!state.v12 && !state.v12.originComplete}
function v12SetStage(n){state.v12.prologueStage=Math.max(state.v12.prologueStage||0,n);saveSilently()}
function v12Queue(lines,after){openDialogue(lines);if(after){const wait=()=>{if(mode==='play'){after();return}setTimeout(wait,60)};setTimeout(wait,60)}}
function v12StartOrigin(){
 state.v12={prologueStage:0,originComplete:false,tankUnlocked:false,salvage:0,salvageFound:{},firstHuntCore:false,starterParts:{cell:false,coil:false},starterRepaired:false,registered:false,firstDrive:false,sceneFlags:{},originStarted:true};
 state.scene='field';state.fieldId='origin_tidecamp';state.fieldReturn=null;currentTown=null;state.townIndex=0;state.unlocked=1;
 state.gold=90;state.scrap=0;state.owned=[];state.vehicleIndex=0;state.player.inTank=false;state.player.model='hunter';state.player.x=175;state.player.y=660;state.player.dir=-Math.PI/2;
 state.tank.x=1100;state.tank.y=620;state.tank.hp=260;state.tank.dir=Math.PI;state.party.liuyan=false;state.party.taoyao=false;state.party.lincheng=false;
 state.person=Object.assign(state.person||{},{hp:110,max:110,level:1,exp:0,weapon:'scrap_knife',armor:'canvas',medkits:1,guard:false});state.person.hp=110;
 state.inventory.parts=['m0','s0','e0','eng0','c0','a0'];state.inventory.repairKits=0;
 state.townProgress[0]=Object.assign(state.townProgress[0],{chief:false,mechanic:false,board:false,boss:false,claimed:false,arrived:false});
 if(state.world){state.world.fieldCleared=state.world.fieldCleared||{};state.world.fieldLooted=state.world.fieldLooted||{};state.world.discovered=state.world.discovered||{}}
 mode='play';dialogue=null;menu=null;battle=null;$('shell').classList.remove('dialogue-mode');setHint('方向键移动 · A 互动 · B 菜单');
 saveSilently();
 v12Queue([
  ['旁白','锈港以西，潮线棚屋区。你还不是猎人，只是每天等退潮后去废船里捡能卖钱的铜线和轴承。'],
  ['岚姨','醒了就去码头边找我。今天潮退得早，晚一步好东西就被别人捡走了。'],
  ['旁白','没有战车，没有悬赏徽章，也没有人会替你把路铺好。']
 ]);
}

Object.assign(V10_FIELDS,{
 origin_tidecamp:{name:'潮痕棚屋区',w:1450,h:860,palette:['#5e594b','#3b4240','#8b7655'],allowTank:false,spawn:{x:175,y:660},exit:{x:-999,y:-999},
  solids:[
   {x:110,y:110,w:265,h:150,kind:'shack'},{x:430,y:145,w:210,h:125,kind:'shack'},{x:930,y:100,w:285,h:170,kind:'warehouse'},
   {x:1180,y:400,w:110,h:280,kind:'fence'},{x:780,y:510,w:190,h:80,kind:'scrapwall'}
  ],
  props:[
   {id:'aunt',type:'originNpc',x:345,y:520,name:'岚姨',role:'aunt'},
   {id:'foreman',type:'originNpc',x:850,y:340,name:'阿塔',role:'foreman'},
   {id:'salvage_a',type:'originSalvage',x:470,y:690,name:'潮线废料堆 A'},
   {id:'salvage_b',type:'originSalvage',x:720,y:705,name:'潮线废料堆 B'},
   {id:'salvage_c',type:'originSalvage',x:1040,y:700,name:'翻覆货箱'},
   {id:'memorial',type:'originLore',x:610,y:350,name:'旧猎人路牌',lines:[['旁白','木牌上的字被盐雾磨掉一半，只剩一句：“活着回来，才算完成委托。”']]}
  ],enemies:[]},
 origin_hunt:{name:'北堤废车场',w:1320,h:780,palette:['#565146','#353a37','#7d684d'],allowTank:false,spawn:{x:115,y:390},exit:{x:70,y:390},
  solids:[{x:280,y:110,w:120,h:210,kind:'wreck'},{x:520,y:470,w:180,h:120,kind:'scrapwall'},{x:790,y:120,w:125,h:190,kind:'wreck'},{x:1030,y:440,w:160,h:120,kind:'scrapwall'}],
  props:[{id:'trail',type:'originLore',x:470,y:365,name:'拖曳痕迹',lines:[['旁白','地上的金属拖痕绕开大车，只扑向轻型回收车。'],['旁白','这不是“碰见怪物”，而是第一次学着判断猎物的习性。']]},{id:'hunt_core',type:'originCore',x:1120,y:340,name:'裂齿控制核心'}],
  enemies:[{id:'qualifier',x:1000,y:350,name:'裂齿拾荒机',hp:105,atk:12,reward:85,foot:true,exp:58,originTag:'qualifier'}]},
 origin_yard:{name:'港北封存车场',w:1420,h:820,palette:['#4d5049','#303533','#78654d'],allowTank:true,spawn:{x:120,y:410},exit:{x:68,y:410},
  solids:[{x:285,y:105,w:185,h:145,kind:'warehouse'},{x:565,y:110,w:210,h:120,kind:'scrapwall'},{x:920,y:105,w:190,h:150,kind:'warehouse'},{x:350,y:570,w:160,h:100,kind:'wreck'},{x:760,y:545,w:160,h:100,kind:'wreck'}],
  props:[
   {id:'power_cell',type:'originPart',part:'cell',x:390,y:355,name:'旧启动电容'},
   {id:'ignition_coil',type:'originPart',part:'coil',x:930,y:365,name:'点火线圈'},
   {id:'starter_wreck',type:'originTankWreck',x:1160,y:580,name:'破风巡逻车残骸'},
   {id:'yard_log',type:'originLore',x:650,y:330,name:'封存记录',lines:[['旧终端','“港务巡逻 04：海水倒灌后封存。底盘完整，动力与启动系统缺件。”'],['旁白','它不是奖品，只是一辆别人认为不值得修的旧车。']]}
  ],
  enemies:[{id:'yard_guard',x:705,y:475,name:'封存场警戒机',hp:128,atk:14,reward:110,foot:true,exp:65,originTag:'yard_guard'}]}
});

for(const p of [
 {id:'origin_hunt_poi',x:760,y:525,name:'北堤废车场',type:'field',field:'origin_hunt',visible:true,chapter:0,icon:'◇',originStage:5,desc:'猎人公会给你的第一份资格委托。'},
 {id:'origin_yard_poi',x:705,y:285,name:'港北封存车场',type:'field',field:'origin_yard',visible:true,chapter:0,icon:'▣',originStage:8,desc:'一片被盐雾吃透的旧车场。破风巡逻车就封存在里面。'}
]) if(!V10_POIS.some(x=>x.id===p.id))V10_POIS.push(p);

const v12OldDrawPoi=v10DrawPoi;
v10DrawPoi=function(p){if(p.originStage!==undefined){if(!v12OriginActive()||state.v12.prologueStage<p.originStage)return}return v12OldDrawPoi(p)};
const v12OldNearestInteractable=nearestInteractable;
nearestInteractable=function(){const i=v12OldNearestInteractable();if(i?.type==='worldPoi'&&i.poi?.originStage!==undefined){if(!v12OriginActive()||state.v12.prologueStage<i.poi.originStage)return null}return i};

function v12DrawWaterStrip(fd){
 const f=state.player,cx=clamp(f.x,W/2,fd.w-W/2),cy=clamp(f.y,H/2,fd.h-H/2),t=performance.now()/1000;
 const sy=190-cy+H/2;ctx.fillStyle='#294b59';ctx.fillRect(0,0,W,sy);ctx.fillStyle='#355e6b';for(let y=sy-65;y<sy;y+=15)for(let x=-30;x<W+40;x+=80){ctx.globalAlpha=.22;ctx.fillRect(x+Math.sin(t+y*.03)*12,y,42,2)}ctx.globalAlpha=1;
 const shore=230-cy+H/2;ctx.fillStyle='#87735a';ctx.fillRect(0,sy, W,Math.max(0,shore-sy));for(let x=-30;x<W+30;x+=42){ctx.fillStyle='rgba(233,220,181,.22)';ctx.fillRect(x+(t*10)%42,shore-8,22,2)}
}
function v12DrawFieldSolid(s,fd){const p=fieldToScreen(s.x,s.y);ctx.save();if(s.kind==='shack'){ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(p.x+9,p.y+13,s.w,s.h);ctx.fillStyle='#493f35';ctx.fillRect(p.x,p.y+25,s.w,s.h-25);ctx.fillStyle='#2d302e';ctx.fillRect(p.x-8,p.y,s.w+16,34);ctx.fillStyle='#6d5b45';for(let x=16;x<s.w-12;x+=35)ctx.fillRect(p.x+x,p.y+31,18,4);ctx.fillStyle='#c9a86e';ctx.fillRect(p.x+20,p.y+64,32,24);ctx.fillStyle='#201d19';ctx.fillRect(p.x+s.w/2-15,p.y+s.h-42,30,42)}else if(s.kind==='warehouse'){ctx.fillStyle='rgba(0,0,0,.28)';ctx.fillRect(p.x+10,p.y+14,s.w,s.h);ctx.fillStyle='#3b403e';ctx.fillRect(p.x,p.y+22,s.w,s.h-22);ctx.fillStyle='#242928';ctx.fillRect(p.x-8,p.y,s.w+16,30);ctx.strokeStyle='#8b7657';for(let x=18;x<s.w-10;x+=26){ctx.beginPath();ctx.moveTo(p.x+x,p.y+38);ctx.lineTo(p.x+x,p.y+s.h-10);ctx.stroke()}ctx.fillStyle='#242522';ctx.fillRect(p.x+s.w/2-30,p.y+s.h-55,60,55)}else if(s.kind==='fence'){ctx.strokeStyle='#5b5e59';ctx.lineWidth=4;for(let y=0;y<s.h;y+=28){ctx.beginPath();ctx.moveTo(p.x,p.y+y);ctx.lineTo(p.x+s.w,p.y+y+14);ctx.stroke();ctx.beginPath();ctx.moveTo(p.x+s.w,p.y+y);ctx.lineTo(p.x,p.y+y+14);ctx.stroke()}ctx.strokeStyle='#2b2e2b';ctx.strokeRect(p.x,p.y,s.w,s.h)}else if(s.kind==='wreck'){ctx.fillStyle='#303532';ctx.fillRect(p.x,p.y+22,s.w,s.h-22);ctx.fillStyle='#6a4a38';ctx.fillRect(p.x+8,p.y+12,s.w-16,28);ctx.fillStyle='#171b19';ctx.beginPath();ctx.arc(p.x+30,p.y+s.h,15,0,TAU);ctx.arc(p.x+s.w-30,p.y+s.h,15,0,TAU);ctx.fill()}else if(s.kind==='scrapwall'){ctx.fillStyle='#393a35';ctx.fillRect(p.x,p.y,s.w,s.h);for(let k=0;k<9;k++){ctx.fillStyle=k%2?'#6d533d':'#565a54';ctx.fillRect(p.x+8+(k*37)%Math.max(20,s.w-45),p.y+8+((k*23)%Math.max(18,s.h-30)),28,12)}}else v10DrawFieldSolid(s,fd);ctx.restore()}
function v12DrawOriginProp(o){if(o.type==='originNpc'){drawCharacter(o.role==='aunt'?'npcB':o.role==='foreman'?'npcC':'npcA',o.x,o.y,0,performance.now()/1500,1,o.name);return}const p=fieldToScreen(o.x,o.y);ctx.save();ctx.translate(p.x,p.y);if(o.type==='originSalvage'){const got=!!state.v12.salvageFound[o.id];ctx.globalAlpha=got?.35:1;ctx.fillStyle='#4c4f4a';ctx.fillRect(-22,-12,44,24);ctx.fillStyle='#9b6e45';ctx.fillRect(-15,-18,24,8);ctx.fillStyle='#b18c5a';ctx.fillRect(7,-8,16,6)}else if(o.type==='originCore'){ctx.fillStyle='#2d3332';ctx.fillRect(-15,-18,30,36);ctx.fillStyle=state.v12.firstHuntCore?'#48504c':'#cf7658';ctx.fillRect(-8,-11,16,12)}else if(o.type==='originPart'){const got=!!state.v12.starterParts[o.part];ctx.globalAlpha=got?.35:1;ctx.fillStyle='#383e3b';ctx.fillRect(-18,-16,36,32);ctx.strokeStyle='#b79a62';ctx.strokeRect(-18,-16,36,32);ctx.fillStyle=o.part==='cell'?'#b88a4a':'#7ea08b';ctx.fillRect(-9,-8,18,12)}else if(o.type==='originTankWreck'){ctx.restore();if(!state.v12.starterRepaired)drawTankModel(o.x,o.y,Math.PI,V12_STARTER_INDEX,.95,true);return}else if(o.type==='originLore'){ctx.fillStyle='#5a5242';ctx.fillRect(-16,-18,32,36);ctx.fillStyle='#c4aa76';ctx.fillRect(-10,-12,20,3)}ctx.restore()}

const V12_STARTER_INDEX=0;
function v12DrawOriginField(){const fd=v10Field();if(!fd)return;const f=state.player,cx=clamp(f.x,W/2,fd.w-W/2),cy=clamp(f.y,H/2,fd.h-H/2),t=performance.now()/1000;ctx.fillStyle=fd.palette[0];ctx.fillRect(0,0,W,H);
 if(state.fieldId==='origin_tidecamp')v12DrawWaterStrip(fd);
 for(let x=Math.floor((cx-W/2)/32)*32-32;x<cx+W/2+64;x+=32)for(let y=Math.floor((cy-H/2)/32)*32-32;y<cy+H/2+64;y+=32){if(state.fieldId==='origin_tidecamp'&&y<230)continue;const p=fieldToScreen(x,y),h=v9hash(x>>5,y>>5);ctx.fillStyle=(h&1)?fd.palette[0]:fd.palette[1];ctx.globalAlpha=.12;ctx.fillRect(p.x,p.y,32,32);ctx.globalAlpha=1;if(h%5===0){ctx.fillStyle='rgba(210,190,145,.16)';ctx.fillRect(p.x+(h%23),p.y+((h>>>3)%23),3,2)}}
 // deep ground shadows and traversable paths
 ctx.save();ctx.globalAlpha=.22;ctx.strokeStyle='#1e2422';ctx.lineWidth=52;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(...Object.values(fieldToScreen(120,650)));ctx.lineTo(...Object.values(fieldToScreen(1160,650)));ctx.stroke();ctx.restore();
 fd.solids.forEach(s=>v12DrawFieldSolid(s,fd));
 // ambient props: poles, cables, smoke, puddles
 for(let k=0;k<7;k++){const wp=fieldToScreen(220+k*165,300+(k%2)*40);ctx.strokeStyle='#343834';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(wp.x,wp.y+55);ctx.lineTo(wp.x,wp.y-40);ctx.stroke();ctx.fillStyle='#d4b276';ctx.globalAlpha=.16+.05*Math.sin(t+k);ctx.beginPath();ctx.arc(wp.x,wp.y-33,12,0,TAU);ctx.fill();ctx.globalAlpha=1}
 for(let k=0;k<8;k++){const pp=fieldToScreen(330+k*120,745-(k%3)*32);ctx.fillStyle='rgba(32,48,50,.28)';ctx.beginPath();ctx.ellipse(pp.x,pp.y,24+(k%3)*8,8,0,0,TAU);ctx.fill()}
 fd.props.forEach(o=>v12DrawOriginProp(o));
 fd.enemies.forEach(e=>{if(!state.world.fieldCleared[`${state.fieldId}:${e.id}`])v10DrawFieldEnemy(e)});
 if(state.fieldId!=='origin_tidecamp'){const ep=fieldToScreen(fd.exit.x,fd.exit.y);ctx.fillStyle='#2a2d29';ctx.fillRect(ep.x-28,ep.y-34,20,68);ctx.fillStyle='#d0b376';ctx.font='10px monospace';ctx.textAlign='left';ctx.fillText('返回荒原',ep.x-20,ep.y-42)}
 if(state.fieldId==='origin_yard'&&state.v12.starterRepaired){drawTankModel(state.tank.x,state.tank.y,state.tank.dir,V12_STARTER_INDEX,1,true)}
 if(!state.player.inTank)drawPlayer();
 const title=state.fieldId==='origin_tidecamp'?'锈港外缘 · 潮痕棚屋区':state.fieldId==='origin_hunt'?'猎人资格区 · 北堤废车场':'封存区 · 港北车场';v9PixelFrame(18,68,278,42);ctx.fillStyle='#e9e2cc';ctx.font='bold 13px monospace';ctx.textAlign='left';ctx.fillText(title,34,94);
 // atmospheric particles
 ctx.fillStyle='rgba(218,191,139,.13)';for(let k=0;k<12;k++){const x=(k*109+t*15*(1+k%3))%W,y=80+(k*47)%400;ctx.fillRect(x,y,2,2)}
}
const v12OldDrawField=drawField;
drawField=function(){if(state.fieldId&&state.fieldId.startsWith('origin_'))return v12DrawOriginField();return v12OldDrawField()};

const v12OldDrawFieldProp=v10DrawFieldProp;
v10DrawFieldProp=function(o){if(String(o.type).startsWith('origin'))return v12DrawOriginProp(o);return v12OldDrawFieldProp(o)};

function v12OriginTalkNpc(o){const s=state.v12.prologueStage;if(o.role==='aunt'){
  if(s===0){v12SetStage(1);return openDialogue([['岚姨','你父亲留下的猎人徽章我没有扔，但我也没打算今天就交给你。'],['岚姨','先把今天的饭钱挣出来。潮线有三堆能用的零件，捡回来。'],['系统','序章任务：回收 3 处潮线废料。']])}
  if(s<3)return openDialogue([['岚姨',`还差 ${Math.max(0,3-state.v12.salvage)} 处。别往深水里走。`]]);
  return openDialogue([['岚姨','以前我总觉得，只要不去碰悬赏，就能离那些事远一点。可荒原从来不会问你愿不愿意。']])
 }
 if(o.role==='foreman')return openDialogue([['阿塔',s<2?'今天东堤的装卸机有点不对劲，听见警报就往棚屋后面跑。':'那台机器差点把我撕开。你开枪的时候手还在抖，但没有往后退。']]);
}

const v12OldInteractFieldProp=v10InteractFieldProp;
v10InteractFieldProp=function(o){
 if(o.type==='originNpc')return v12OriginTalkNpc(o);
 if(o.type==='originLore')return openDialogue(o.lines||[['旁白','没有留下更多信息。']]);
 if(o.type==='originSalvage'){
  if(state.v12.prologueStage<1)return openDialogue([['旁白','你今天还没接到回收活。']]);
  if(state.v12.salvageFound[o.id])return openDialogue([['旁白','这堆废料已经翻干净了。']]);
  state.v12.salvageFound[o.id]=true;state.v12.salvage++;state.scrap++;saveSilently();
  if(state.v12.salvage<3)return openDialogue([['旁白','你从盐泥里拆出几枚还能卖钱的轴承。'],['系统',`潮线回收 ${state.v12.salvage}/3 · 废料 +1`]]);
  state.v12.prologueStage=2;saveSilently();
  return v12Queue([['旁白','第三只货箱刚被撬开，棚屋区的警报突然连续响了三次。'],['阿塔','装卸机失控了！它在朝人冲！'],['岚姨','别发呆——拿上那把拆解刀！']],()=>v11StartFootBattle({name:'失控港务装卸机',hp:82,atk:10,reward:35,foot:true,exp:42,originTag:'ambush'}));
 }
 if(o.type==='originCore'){
  if(state.v12.prologueStage<5)return openDialogue([['旁白','这片废车场还不是你现在该来的地方。']]);
  if(!state.world.fieldCleared['origin_hunt:qualifier'])return openDialogue([['旁白','裂齿拾荒机还在附近活动。']]);
  if(state.v12.firstHuntCore)return openDialogue([['旁白','控制核心已经被你拆走了。']]);
  state.v12.firstHuntCore=true;v12SetStage(6);state.scrap+=2;saveSilently();return openDialogue([['旁白','你把裂齿拾荒机的控制核心从泥里拔出来，边缘还带着余热。'],['系统','取得资格猎杀证明 · 废料 +2。返回锈港猎人公会。']]);
 }
 if(o.type==='originPart'){
  if(state.v12.prologueStage<8)return openDialogue([['旁白','你现在还不知道这件旧零件有什么用。']]);
  if(!state.world.fieldCleared['origin_yard:yard_guard'])return openDialogue([['旁白','警戒机还在锁定车场里的移动目标。先处理它。']]);
  if(state.v12.starterParts[o.part])return openDialogue([['旁白','这里已经被你搜过。']]);
  state.v12.starterParts[o.part]=true;saveSilently();return openDialogue([['旁白',o.part==='cell'?'你从旧叉车里拆出一枚还能蓄电的启动电容。':'工具台最底层压着一只防水点火线圈。'],['系统',`破风修复件：${state.v12.starterParts.cell?'启动电容 ✓':'启动电容 ×'} / ${state.v12.starterParts.coil?'点火线圈 ✓':'点火线圈 ×'}`]]);
 }
 if(o.type==='originTankWreck'){
  if(state.v12.starterRepaired)return openDialogue([['系统','破风巡逻车已经可以驾驶。']]);
  if(state.v12.prologueStage<8)return openDialogue([['旁白','一辆泡过海水的旧巡逻车。发动机盖敞着，电路被拆得七零八落。']]);
  if(!state.v12.starterParts.cell||!state.v12.starterParts.coil)return openDialogue([['旁白','底盘还完整，但启动电路缺两样东西。'],['系统',`需要：启动电容 ${state.v12.starterParts.cell?'✓':'×'} / 点火线圈 ${state.v12.starterParts.coil?'✓':'×'}`]]);
  state.v12.starterRepaired=true;state.v12.tankUnlocked=true;state.owned=[V12_STARTER_INDEX];state.vehicleIndex=V12_STARTER_INDEX;state.tank.x=o.x;state.tank.y=o.y;state.tank.hp=Math.round(tankMax()*.72);state.player.x=o.x-48;state.player.y=o.y;state.scrap=Math.max(0,state.scrap-2);v12SetStage(9);saveSilently();
  return v12Queue([['旁白','你把线圈压进生锈的固定槽，接上启动电容，再用剩下的铜线绕过烧毁的保险盒。'],['老技师（无线电）','别急着点火。先把油泵手动压三次……对，现在。'],['旁白','发动机先咳了一声，随后整辆车像从多年沉睡里突然醒来。'],['系统','获得第一辆战车：破风巡逻车。走到车旁按 A 上车，驾驶它返回锈港。']]);
 }
 return v12OldInteractFieldProp(o)
};

const v12OldWinBattle=winBattle;
winBattle=function(){if(battle?.type==='foot'&&battle.enemy?.originTag){const tag=battle.enemy.originTag;const r=v12OldWinBattle();if(tag==='ambush'){state.v12.prologueStage=3;battle.log+='  你第一次在真正的袭击中活了下来。'}if(tag==='qualifier')battle.log+='  裂齿控制核心掉在废车旁。';if(tag==='yard_guard')battle.log+='  封存场重新安静下来。';saveSilently();return r}return v12OldWinBattle()};
const v12OldEndBattle=endBattle;
endBattle=function(){const tag=battle?.enemy?.originTag;v12OldEndBattle();if(tag==='ambush'&&v12OriginActive()&&state.v12.prologueStage===3){v12Queue([['旁白','枪声停下后，一个红发女人从翻倒的货车后走出来。她没有先看你，而是先检查地上的机器。'],['柳焰','核心烧得不彻底。它接到过外部猎杀协议。'],['柳焰','你不是猎人？那刚才为什么没跑？'],['旁白','你没有回答。远处又响起一声警报。'],['柳焰','想知道这种东西为什么会跑到居民区，就跟我去锈港。猎人公会至少会教你怎么活着问这个问题。']],()=>v12TravelToRustport())}}

function v12TravelToRustport(){state.v12.prologueStage=4;state.scene='town';state.fieldId=null;state.fieldReturn=null;state.townIndex=0;currentTown={...TOWNS[0],index:0};state.player.inTank=false;state.player.x=700;state.player.y=790;state.tank.x=1180;state.tank.y=760;state.townProgress[0].arrived=true;saveSilently();sayToast('第一次进入锈港');}

const v12OldV10InteractPoi=v10InteractPoi;
v10InteractPoi=function(p){if(p.originStage!==undefined){if(!v12OriginActive()||state.v12.prologueStage<p.originStage)return sayToast('现在还没有理由去那里');state.world.discovered[p.id]=true;return v10EnterField(p.field,p)}return v12OldV10InteractPoi(p)};

const v12OldLeaveField=v10LeaveField;
v10LeaveField=function(){if(state.fieldId==='origin_tidecamp')return sayToast('先完成棚屋区的事情');if(state.fieldId==='origin_hunt'){return v12OldLeaveField()}if(state.fieldId==='origin_yard'&&state.v12.starterRepaired){const r=state.fieldReturn||{x:705,y:285};state.scene='world';state.fieldId=null;state.tank.x=r.x;state.tank.y=r.y;state.player.x=r.x;state.player.y=r.y;state.player.inTank=true;state.fieldReturn=null;state.v12.firstDrive=true;saveSilently();sayToast('第一次驾驶战车进入荒原');return}return v12OldLeaveField()};

const v12OldDrawTank=drawTank;
drawTank=function(){if(v12OriginActive()&&!state.v12.tankUnlocked)return;return v12OldDrawTank()};
const v12OldPressA=pressA;
pressA=function(){if(mode==='play'&&v12OriginActive()&&!state.v12.tankUnlocked&&state.scene!=='interior'&&dist(state.player.x,state.player.y,state.tank.x,state.tank.y)<75)return sayToast('你还没有自己的战车');return v12OldPressA()};

const v12OldTalkNpc=talkNpc;
talkNpc=function(o){if(v12OriginActive()&&state.townIndex===0){const s=state.v12.prologueStage;if(o.role==='chief'){
  if(s===4){state.person.weapon='harbor_pistol';state.person.hp=v11PersonMax();v12SetStage(5);return openDialogue([['柳焰','猎人公会不收“想试试”的人。你要么接委托，要么回去继续捡废铁。'],['柳焰','北堤废车场有一台裂齿拾荒机。它只值 80G，但最近咬伤了两个孩子。'],['柳焰','这把旧手枪先借你。把控制核心带回来，我才给你登记临时猎人资格。'],['系统','获得借用武器：公会旧式手枪。资格委托地点已标记在锈港东北。']])}
  if(s===5)return openDialogue([['柳焰','资格委托不是比赛。看清环境，能不挨打就别挨打。把核心带回来。']]);
  if(s===6&&state.v12.firstHuntCore){state.v12.registered=true;v12SetStage(7);state.gold+=220;return openDialogue([['柳焰','核心编号对得上。你没有把它打成废铁，也没有把自己送进诊所。'],['公会终端','临时猎人资格：通过。委托报酬 220G。'],['柳焰','现在你会发现第二个问题：猎人没车，能走的路很短。去车库找老技师。别指望他白送你什么。']])}
  if(s>=9&&state.v12.starterRepaired){state.v12.originComplete=true;state.v12.prologueStage=11;state.v12.tankUnlocked=true;state.party.liuyan=true;state.person.weapon='rust_pistol';state.person.hp=v11PersonMax();saveSilently();return openDialogue([['柳焰','破风能自己开回来，说明它现在至少比你刚进公会时可靠。'],['公会终端','猎人登记完成。身份：荒原猎人。'],['柳焰','从今天起，没有人会替你决定接哪张悬赏。也没有人保证你每次都能回来。'],['柳焰','锈港刚好有一件真正的麻烦：运输队正在被一辆无人猎杀车逐个击穿。'],['系统','序章「走上猎人道路」完成。主线第一章「铁牙猎犬」开启。']])}
 }
 if(o.role==='mechanic'){
  if(s<7)return openDialogue([[o.name,'没有猎人登记，我不能把封存车辆交给你动。这里每台车都有人命账。']]);
  if(s===7){v12SetStage(8);return openDialogue([[o.name,'想要战车？公会不送。车库也不送。'],[o.name,'港北封存场有辆“破风 04”，泡过海水，没人愿意修。你能把它弄响，它就是你的。'],[o.name,'启动电容和点火线圈都缺。封存场里应该还能拆到。自己去找。'],['系统','战车修复支线开启：港北封存车场。']])}
  if(s===8)return openDialogue([[o.name,'电容、点火线圈，少一样都别硬接。烧了主线束，我可不替你重绕。']]);
 }
 }
 return v12OldTalkNpc(o)};

const v12OldEnterTown=enterTown;
enterTown=function(i){v12OldEnterTown(i);if(v12OriginActive()&&i===0&&state.v12.prologueStage===9){state.player.inTank=false;state.tank.x=700;state.tank.y=800;state.player.x=650;state.player.y=800;sayToast('把破风停进锈港，去公会完成登记')}};

const v12OldQuestText=questText;
questText=function(){if(v12OriginActive()){
 const s=state.v12.prologueStage;
 if(s===0)return'去码头边找岚姨。';if(s===1)return`回收潮线废料 ${state.v12.salvage}/3。`;if(s===2)return'棚屋区遭到袭击，活下来。';if(s===3)return'跟随柳焰前往锈港。';if(s===4)return'进入锈港猎人公会，询问猎人资格。';if(s===5)return'步行前往北堤废车场，完成第一份资格猎杀。';if(s===6)return'把裂齿控制核心交给柳焰。';if(s===7)return'去锈港车库找老技师。';if(s===8)return`港北封存车场：启动电容 ${state.v12.starterParts.cell?'✓':'×'} / 点火线圈 ${state.v12.starterParts.coil?'✓':'×'}。`;if(s===9)return'驾驶破风巡逻车返回锈港，完成猎人登记。';if(s===10)return'去猎人公会完成正式登记。';
 }
 return v12OldQuestText()};

const v12OldTankStatusText=tankStatusText;
tankStatusText=function(){if(v12OriginActive()&&!state.v12.tankUnlocked)return'尚未拥有战车。猎人资格并不等于有人会送你一辆车。';return v12OldTankStatusText()};

// Rustport receives a denser authored presentation pass: utilities, docks, light, smoke and depth cues.
const v12OldTownFeature=v9TownFeature;
v9TownFeature=function(i){v12OldTownFeature(i);if(i!==0)return;const P=(x,y)=>townToScreen(x,y),t=performance.now()/1000;ctx.save();
 // dock fingers into water
 for(const x of [330,520,880,1080]){const p=P(x,95);ctx.fillStyle='#5a4735';ctx.fillRect(p.x-26,p.y-5,52,105);ctx.fillStyle='#242a29';for(let y=5;y<95;y+=22)ctx.fillRect(p.x-22,p.y+y,44,4)}
 // moored boat silhouettes
 for(const [x,y,s] of [[430,70,1],[960,85,.85]]){const p=P(x,y);ctx.fillStyle='#29302f';ctx.beginPath();ctx.moveTo(p.x-42*s,p.y);ctx.lineTo(p.x+42*s,p.y);ctx.lineTo(p.x+26*s,p.y+18*s);ctx.lineTo(p.x-31*s,p.y+18*s);ctx.closePath();ctx.fill();ctx.strokeStyle='#87704f';ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x,p.y-45*s);ctx.stroke()}
 // utility poles and sagging cables
 const poles=[[250,360],[515,360],[780,360],[1045,360],[1225,520]];poles.forEach(([x,y],k)=>{const p=P(x,y);ctx.strokeStyle='#393b37';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(p.x,p.y+45);ctx.lineTo(p.x,p.y-58);ctx.stroke();ctx.fillStyle='#d9ad64';ctx.globalAlpha=.15+.05*Math.sin(t+k);ctx.beginPath();ctx.arc(p.x,p.y-48,12,0,TAU);ctx.fill();ctx.globalAlpha=1;if(k<poles.length-1){const q=P(poles[k+1][0],poles[k+1][1]);ctx.strokeStyle='#242625';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x,p.y-52);ctx.quadraticCurveTo((p.x+q.x)/2,(p.y+q.y)/2-22,q.x,q.y-52);ctx.stroke()}});
 // drainage gutters, puddles and loading marks
 for(let k=0;k<13;k++){const p=P(180+k*92,475+(k%3)*73);ctx.fillStyle='rgba(35,55,58,.24)';ctx.beginPath();ctx.ellipse(p.x,p.y,25+(k%3)*9,7,0,0,TAU);ctx.fill()}
 // chimney smoke
 for(const [x,y] of [[1120,245],[910,275]]){const p=P(x,y);for(let k=0;k<5;k++){ctx.fillStyle=`rgba(75,79,75,${.12-k*.018})`;ctx.beginPath();ctx.arc(p.x+Math.sin(t*.5+k)*8,p.y-40-k*18,14+k*5,0,TAU);ctx.fill()}}
 ctx.restore()};

const v12OldDrawInterior=drawInterior;
drawInterior=function(){v12OldDrawInterior();if(state.townIndex!==0)return;const type=state.currentInterior,t=performance.now()/1000;ctx.save();
 // foreground architectural frame, room-specific activity and practical clutter
 ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(34,56,18,H-94);ctx.fillRect(W-52,56,18,H-94);
 if(type==='garage'){
  ctx.strokeStyle='#5a5f59';ctx.lineWidth=3;for(let x=130;x<850;x+=120){ctx.beginPath();ctx.moveTo(x,75);ctx.lineTo(x+35,115);ctx.stroke()}
  for(let k=0;k<5;k++){ctx.fillStyle=k%2?'#654b36':'#3c4441';ctx.fillRect(115+k*155,420-(k%2)*18,64,22)}
  ctx.fillStyle='rgba(226,160,82,.08)';ctx.beginPath();ctx.arc(580,220,80+Math.sin(t)*6,0,TAU);ctx.fill();
 }else if(type==='tavern'){
  for(let k=0;k<6;k++){ctx.fillStyle='#b57b43';ctx.globalAlpha=.18+.03*Math.sin(t+k);ctx.beginPath();ctx.arc(170+k*125,105,13,0,TAU);ctx.fill()}ctx.globalAlpha=1;ctx.fillStyle='#352820';ctx.fillRect(90,390,780,18);
 }else if(type==='clinic'){
  ctx.fillStyle='rgba(218,230,218,.07)';ctx.fillRect(85,105,790,240);ctx.strokeStyle='rgba(188,206,196,.18)';for(let x=120;x<850;x+=95){ctx.beginPath();ctx.moveTo(x,90);ctx.lineTo(x,390);ctx.stroke()}
 }else if(type==='guild'){
  ctx.fillStyle='#3a3026';for(let k=0;k<5;k++)ctx.fillRect(95+k*155,90,110,72);ctx.fillStyle='#c9b47d';for(let k=0;k<18;k++)ctx.fillRect(108+(k%5)*155+(k%3)*23,105+Math.floor(k/5)*16,26,3);
 }
 ctx.restore()};

const v12OldUpdateHud=updateHud;
updateHud=function(){v12OldUpdateHud();if(v12OriginActive()&&$('modeTag'))$('modeTag').textContent=state.v12.tankUnlocked&&state.player.inTank?'新手驾驶':'普通居民';if(v12OriginActive()&&$('zone')&&state.scene==='field'&&state.fieldId?.startsWith('origin_'))$('zone').textContent=V10_FIELDS[state.fieldId].name};

// Do not let pre-origin tank menus undermine the story.
const v12OldOpenGarageMenu=openGarageMenu;
openGarageMenu=function(){if(v12OriginActive()&&!state.v12.tankUnlocked)return sayToast('你还没有可登记的战车');return v12OldOpenGarageMenu()};
const v12OldOpenVehicleSwitch=openVehicleSwitch;
openVehicleSwitch=function(){if(v12OriginActive()&&!state.v12.tankUnlocked)return sayToast('车库里还没有属于你的战车');return v12OldOpenVehicleSwitch()};

// Start the authored origin on a genuinely untouched save. Existing saves migrate without being reset.
if(v12FreshStart){v12StartOrigin()}else{normalizeState();saveSilently();sayToast('v0.12：猎人起源 / 场景密度升级',2.8)}

/* === v0.13 showcase vertical slice: Rustport continuity, repair bay, test drive, bounty lair === */
const V13_VERSION='0.13.0';
state.v13=Object.assign({repair:{cell:false,coil:false,bypass:false},trialPassed:false,lairUnlocked:false,lairSeen:false},state.v13||{});

// New authored spaces.
V10_FIELDS.origin_testtrack={name:'港北试车环道',w:1640,h:900,palette:['#5a5448','#383d39','#a17d50'],allowTank:true,spawn:{x:150,y:470},exit:{x:90,y:470},
 solids:[
  {x:0,y:0,w:1640,h:85},{x:0,y:815,w:1640,h:85},{x:0,y:0,w:85,h:900},{x:1555,y:0,w:85,h:900},
  {x:410,y:225,w:430,h:90},{x:760,y:560,w:470,h:90},{x:1260,y:210,w:105,h:340}
 ],
 props:[
  {id:'cp1',type:'trialCheckpoint',order:1,x:360,y:610,name:'制动检查门'},
  {id:'cp2',type:'trialCheckpoint',order:2,x:930,y:680,name:'转向检查门'},
  {id:'cp3',type:'trialCheckpoint',order:3,x:1440,y:470,name:'动力检查门'},
  {id:'cp4',type:'trialCheckpoint',order:4,x:1030,y:170,name:'炮塔稳定门'},
  {id:'cp5',type:'trialCheckpoint',order:5,x:260,y:170,name:'返场门'}
 ],enemies:[]};

V10_FIELDS.rust_hound_lair={name:'铁牙猎犬 · 旧海关猎场',w:1680,h:960,palette:['#4e493e','#303632','#7e6448'],allowTank:true,spawn:{x:140,y:520},exit:{x:75,y:520},
 solids:[
  {x:0,y:0,w:1680,h:80},{x:0,y:880,w:1680,h:80},{x:0,y:0,w:80,h:960},{x:1600,y:0,w:80,h:960},
  {x:360,y:150,w:230,h:110},{x:780,y:120,w:330,h:120},{x:1260,y:150,w:220,h:100},
  {x:410,y:690,w:280,h:120},{x:960,y:680,w:260,h:120}
 ],
 props:[
  {id:'hound_trace_1',type:'originLore',x:350,y:470,name:'75mm 弹壳',lines:[['柳焰','弹壳落点很整齐。它不是慌乱射击，是在控制车队逃跑方向。']]},
  {id:'hound_trace_2',type:'originLore',x:820,y:420,name:'烧毁诱饵车',lines:[['旁白','这辆车的发动机早就坏了，却被拖到路中央。铁牙猎犬在布置猎场。']]},
  {id:'hound_gate',type:'bossGate',x:1390,y:520,name:'猎场深处'}
 ],enemies:[
  {id:'escort1',x:760,y:560,name:'猎犬护卫机',hp:205,atk:22,reward:110},
  {id:'escort2',x:1110,y:420,name:'废弃诱导车',hp:235,atk:24,reward:135}
 ]};

if(!V10_POIS.some(p=>p.id==='rust_hound_lair'))V10_POIS.push({id:'rust_hound_lair',x:650,y:590,name:'旧海关猎场',type:'field',field:'rust_hound_lair',visible:false,chapter:0,icon:'▣',desc:'铁牙猎犬把这里改造成自己的猎场。'});

// Stronger low-res sprite language: silhouette, outline, readable direction, less placeholder-block feel.
const v13OldDrawCharacter=drawCharacter;
drawCharacter=function(modelKey,x,y,dir,walk=0,scale=1,label=''){
 const m=CHAR_MODELS[modelKey]||CHAR_MODELS.npcA,p=screenPos(x,y),face=Math.cos(dir)>=0?1:-1,bob=Math.sin(walk*10)*1.2,leg=Math.sin(walk*10)*2.6;
 ctx.save();ctx.translate(Math.round(p.x),Math.round(p.y+bob));ctx.scale(scale*face,scale);
 ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,15,10,4,0,0,TAU);ctx.fill();
 ctx.strokeStyle='#161814';ctx.lineWidth=2.2;
 // legs and boots
 ctx.fillStyle=m.bottom;ctx.fillRect(-7,3,5,10+leg*.12);ctx.fillRect(2,3,5,10-leg*.12);ctx.strokeRect(-7,3,5,11);ctx.strokeRect(2,3,5,11);
 ctx.fillStyle='#242621';ctx.fillRect(-8,12,7,4);ctx.fillRect(1,12,7,4);
 // torso/jacket
 ctx.fillStyle=m.top;ctx.beginPath();ctx.roundRect(-9,-10,18,15,3);ctx.fill();ctx.stroke();
 ctx.fillStyle=m.accent;ctx.fillRect(-10,-9,4,10);ctx.fillRect(6,-9,4,10);
 // head/hair
 ctx.fillStyle=m.skin;ctx.beginPath();ctx.roundRect(-6,-20,12,11,4);ctx.fill();ctx.stroke();
 ctx.fillStyle=m.hair;ctx.beginPath();ctx.arc(0,-18,7,Math.PI,TAU);ctx.fill();ctx.fillRect(-7,-19,4,8);
 ctx.fillStyle='#141510';ctx.fillRect(3,-16,2,2);
 if(modelKey==='liuyan'){ctx.strokeStyle='#8b3c37';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-5,-20);ctx.quadraticCurveTo(-12,-13,-8,-5);ctx.stroke()}
 if(modelKey==='taoyao'){ctx.fillStyle='#82603d';ctx.fillRect(-7,-24,14,3)}
 if(modelKey==='lincheng'){ctx.fillStyle='#ddd9ce';ctx.fillRect(-5,-24,10,3);ctx.fillStyle='#a24b47';ctx.fillRect(-1,-24,2,3)}
 ctx.restore();
 if(label){ctx.fillStyle='rgba(7,8,7,.78)';ctx.fillRect(p.x-34,p.y-39,68,14);ctx.fillStyle='#f1e4bb';ctx.font='9px monospace';ctx.textAlign='center';ctx.fillText(label,p.x,p.y-29)}
};

// More authored architecture: different roof masses, signs integrated into façade, awnings, utility clutter.
function v13RustBuilding(b){
 const p=townToScreen(b.x,b.y),door=townToScreen(b.x+b.w/2,b.y+b.h),style=b.style||'house';
 ctx.save();
 ctx.fillStyle='rgba(0,0,0,.28)';ctx.fillRect(p.x+10,p.y+16,b.w,b.h);
 const walls={warehouse:'#665845',hangar:'#515752',bar:'#5e4032',shop:'#606049',clinic:'#68797a',house:'#6a5a46',shed:'#54534c'};
 const roofs={warehouse:'#332f29',hangar:'#292f2d',bar:'#3a2925',shop:'#353a2d',clinic:'#39494b',house:'#3c342b',shed:'#343532'};
 ctx.fillStyle=walls[style]||'#615443';ctx.fillRect(p.x,p.y+28,b.w,b.h-28);
 ctx.fillStyle=roofs[style]||'#34312c';ctx.fillRect(p.x-7,p.y+10,b.w+14,25);
 // corrugation / beams
 ctx.fillStyle='rgba(255,255,255,.06)';for(let k=8;k<b.w;k+=28)ctx.fillRect(p.x+k,p.y+14,2,17);
 ctx.fillStyle='rgba(0,0,0,.18)';for(let k=14;k<b.w-10;k+=52)ctx.fillRect(p.x+k,p.y+45,3,b.h-56);
 // windows
 const win='#b29a6b';for(const wx of [28,b.w-56]){ctx.fillStyle='#252b29';ctx.fillRect(p.x+wx,p.y+65,28,24);ctx.fillStyle=win;ctx.globalAlpha=.32;ctx.fillRect(p.x+wx+4,p.y+69,20,16);ctx.globalAlpha=1}
 // awning and door
 ctx.fillStyle=style==='bar'?'#783f31':style==='clinic'?'#d1d5cd':'#574b3b';ctx.fillRect(door.x-32,door.y-50,64,8);
 ctx.fillStyle='#24211c';ctx.fillRect(door.x-15,door.y-41,30,41);ctx.fillStyle='#bea66f';ctx.fillRect(door.x+8,door.y-22,3,3);
 // sign integrated in building
 const sw=Math.min(126,b.w-40);ctx.fillStyle='#2b2b27';ctx.fillRect(p.x+b.w/2-sw/2,p.y+40,sw,22);ctx.strokeStyle='#8b7655';ctx.strokeRect(p.x+b.w/2-sw/2,p.y+40,sw,22);ctx.fillStyle='#e3cc90';ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillText(b.name,p.x+b.w/2,p.y+55);
 if(style==='hangar'){ctx.fillStyle='#333936';ctx.fillRect(p.x+55,p.y+82,b.w-110,b.h-84);ctx.strokeStyle='#797c72';for(let yy=p.y+90;yy<p.y+b.h-10;yy+=18){ctx.beginPath();ctx.moveTo(p.x+58,yy);ctx.lineTo(p.x+b.w-58,yy);ctx.stroke()}}
 if(style==='clinic'){ctx.fillStyle='#c8d2cc';ctx.fillRect(p.x+b.w-40,p.y+42,15,15);ctx.fillStyle='#9b403c';ctx.fillRect(p.x+b.w-35,p.y+44,5,11);ctx.fillRect(p.x+b.w-38,p.y+47,11,5)}
 ctx.restore();
}

function v13RustportGround(){
 // seawall / water with animated strips
 const seaY=townToScreen(0,122).y;ctx.fillStyle='#213d49';ctx.fillRect(0,0,W,Math.max(0,seaY));
 for(let k=0;k<20;k++){const y=seaY-8-k*7;ctx.strokeStyle=`rgba(146,188,194,${.05+(k%4)*.025})`;ctx.beginPath();ctx.moveTo((k*71)%130, y);ctx.lineTo(W,y+Math.sin(performance.now()/700+k)*2);ctx.stroke()}
 // dock edge
 ctx.fillStyle='#282b28';ctx.fillRect(0,seaY-5,W,18);ctx.fillStyle='#725a41';for(let x=0;x<W;x+=42)ctx.fillRect(x,seaY-2,29,11);
 // ground tiles / cracks
 ctx.fillStyle='#575044';ctx.fillRect(0,seaY+13,W,H-seaY-13);
 for(let gx=0;gx<1400;gx+=32)for(let gy=130;gy<900;gy+=32){const p=townToScreen(gx,gy),h=v9hash(gx>>5,gy>>5);if(p.x<-34||p.y<-34||p.x>W+34||p.y>H+34)continue;ctx.fillStyle=(h&1)?'rgba(255,225,175,.035)':'rgba(0,0,0,.045)';ctx.fillRect(p.x,p.y,31,31);if(h%5===0){ctx.strokeStyle='rgba(35,31,26,.2)';ctx.beginPath();ctx.moveTo(p.x+6,p.y+9);ctx.lineTo(p.x+14,p.y+14);ctx.lineTo(p.x+11,p.y+25);ctx.stroke()}}
 // roads with raised curbs
 const road=(pts,w=62)=>{const ss=pts.map(q=>townToScreen(q[0],q[1]));ctx.strokeStyle='#292d2b';ctx.lineWidth=w+12;ctx.lineCap='square';ctx.beginPath();ss.forEach((q,k)=>k?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.stroke();ctx.strokeStyle='#42433d';ctx.lineWidth=w;ctx.stroke();ctx.strokeStyle='rgba(214,180,112,.15)';ctx.lineWidth=2;ctx.setLineDash([12,17]);ctx.stroke();ctx.setLineDash([])};
 road([[700,870],[700,465],[700,180]],72);road([[95,470],[1320,470]],72);road([[300,470],[300,680]],56);road([[1040,470],[1040,245]],56);
 // drainage gutters / bollards
 for(let x=140;x<1300;x+=95){let p=townToScreen(x,510);ctx.fillStyle='#292e2b';ctx.fillRect(p.x-10,p.y-2,20,4)}
 for(const [x,y] of [[530,430],[870,430],[530,505],[870,505]]){const p=townToScreen(x,y);ctx.fillStyle='#a27345';ctx.fillRect(p.x-3,p.y-11,6,22);ctx.fillStyle='#cfb276';ctx.fillRect(p.x-3,p.y-8,6,3)}
}

const v13OldDrawTown=drawTown;
drawTown=function(){
 if((currentTown?.index??state.townIndex)!==0)return v13OldDrawTown();
 v13RustportGround();v9TownFeature(0);v13OldRustExtras();
 for(const b of V9_DECOR_BUILDINGS[0])v9DrawDecorBuilding(b,0);townBuildings(0).forEach(v13RustBuilding);
 v8DrawLandmarks(0);getAmbientNpcs(0).forEach(n=>drawCharacter(n.model,n.x,n.y,n.dir,n.walk,1,n.name));drawTank();if(!state.player.inTank)drawPartyFollowers();drawPlayer();
 const gate=townToScreen(700,850);ctx.fillStyle='#252825';ctx.fillRect(gate.x-90,gate.y-8,180,16);ctx.fillStyle='#c2a66b';ctx.font='10px monospace';ctx.textAlign='center';ctx.fillText('南门 · 前往荒原',gate.x,gate.y-15);drawPrompt();drawAmbientLighting();
};
function v13OldRustExtras(){
 const P=(x,y)=>townToScreen(x,y),t=performance.now()/1000;ctx.save();
 // dock cranes and cargo stacks
 for(const [x,y] of [[150,150],[1210,155]]){const p=P(x,y);ctx.strokeStyle='#403d35';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(p.x,p.y+82);ctx.lineTo(p.x+20,p.y-22);ctx.lineTo(p.x+88,p.y-22);ctx.stroke();ctx.strokeStyle='#8a6b48';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x+80,p.y-20);ctx.lineTo(p.x+80,p.y+45);ctx.stroke()}
 for(const [x,y,c] of [[80,365,'#62513f'],[1185,350,'#4c5550'],[1120,690,'#694a3c'],[505,705,'#5d5745']]){const p=P(x,y);for(let yy=0;yy<2;yy++)for(let xx=0;xx<2;xx++){ctx.fillStyle=c;ctx.fillRect(p.x+xx*35,p.y+yy*24,32,21);ctx.strokeStyle='#2b2b27';ctx.strokeRect(p.x+xx*35,p.y+yy*24,32,21)}}
 // moored patrol boat silhouette
 let p=P(560,84);ctx.fillStyle='#293330';ctx.beginPath();ctx.moveTo(p.x-62,p.y+11);ctx.lineTo(p.x+64,p.y+11);ctx.lineTo(p.x+39,p.y+28);ctx.lineTo(p.x-45,p.y+28);ctx.closePath();ctx.fill();ctx.fillStyle='#4f5c57';ctx.fillRect(p.x-15,p.y-10,34,21);ctx.fillStyle='#8d6d45';ctx.fillRect(p.x+18,p.y-5,29,4);
 // smoke + flags
 for(const [x,y] of [[960,260],[1115,250]]){p=P(x,y);for(let k=0;k<4;k++){ctx.fillStyle=`rgba(45,49,46,${.15-k*.025})`;ctx.beginPath();ctx.arc(p.x+Math.sin(t+k)*7,p.y-35-k*18,10+k*6,0,TAU);ctx.fill()}}
 ctx.restore();
}

// Repair install screen is a real interaction layer instead of one dialogue sentence.
function v13OpenRepairMenu(){
 menu={items:['安装启动电容','安装点火线圈','重做保险盒旁路','执行点火测试','退出检修'],sel:0,sub:null,v13repair:true};mode='menu';setHint('▲▼ 选择安装步骤 · A 操作 · B 退出检修');
}
function v13RepairStatus(){return [
 ['启动电容',state.v13.repair.cell],['点火线圈',state.v13.repair.coil],['保险盒旁路',state.v13.repair.bypass]
 ]}
const v13OldMenuConfirm=menuConfirm;
menuConfirm=function(){
 if(menu?.v13repair){const n=menu.sel;if(n===0){if(!state.v12.starterParts.cell)return sayToast('还没有找到启动电容');state.v13.repair.cell=true;sayToast('启动电容固定完成')}
 else if(n===1){if(!state.v12.starterParts.coil)return sayToast('还没有找到点火线圈');state.v13.repair.coil=true;sayToast('点火线圈接入完成')}
 else if(n===2){if(state.scrap<2)return sayToast('旁路至少需要 2 份废料');if(!state.v13.repair.bypass){state.scrap-=2;state.v13.repair.bypass=true;sayToast('烧毁保险盒已旁路')}}
 else if(n===3){if(!v13RepairStatus().every(x=>x[1]))return sayToast('还有安装步骤没有完成');state.v12.starterRepaired=true;state.v12.tankUnlocked=true;state.owned=[V12_STARTER_INDEX];state.vehicleIndex=V12_STARTER_INDEX;state.tank.hp=Math.round(tankMax()*.72);state.tank.x=1160;state.tank.y=580;state.player.x=1110;state.player.y=580;state.v12.prologueStage=9;state.v13.trialPassed=false;saveSilently();closeMenu();openDialogue([['旁白','启动马达先拖了两圈，随后发动机在整个封存场里轰然醒来。'],['老技师（无线电）','能响不代表能上路。旁边的试车门已经解锁。制动、转向、动力、炮塔稳定，全跑一遍。'],['系统','破风巡逻车修复完成。完成港北试车环道后才能驶出封存区。']]);return}
 else{closeMenu();return}saveSilently();return}
 return v13OldMenuConfirm();
};

const v13OldDrawMenu=drawMenu;
drawMenu=function(){
 if(!menu?.v13repair)return v13OldDrawMenu();
 ctx.fillStyle='#101310';ctx.fillRect(0,0,W,H);const x=72,y=42,w=816,h=454;v9PixelFrame(x,y,w,h);
 ctx.fillStyle='#e6d2a0';ctx.font='bold 20px monospace';ctx.textAlign='left';ctx.fillText('破风 04 · 动力系统检修',x+30,y+40);
 ctx.fillStyle='#847b68';ctx.font='11px monospace';ctx.fillText('港北封存车场 / 老技师远程指导',x+30,y+62);
 // tank schematic
 ctx.save();ctx.translate(x+575,y+205);ctx.scale(2.4,2.4);drawTankModel(0,0,0,V12_STARTER_INDEX,1,false);ctx.restore();
 const items=menu.items;items.forEach((it,i)=>{const yy=y+112+i*54,active=i===menu.sel;ctx.fillStyle=active?'#5c4b31':'#1a1f1b';ctx.fillRect(x+30,yy-28,390,42);ctx.strokeStyle=active?'#c9a969':'#41483e';ctx.strokeRect(x+30,yy-28,390,42);ctx.fillStyle=active?'#fff0c2':'#cbd0c7';ctx.font='14px monospace';ctx.fillText(it,x+48,yy-3)});
 const st=v13RepairStatus();ctx.fillStyle='#d9d8cb';ctx.font='12px monospace';ctx.fillText('检修状态',x+515,y+316);st.forEach((s,k)=>{ctx.fillStyle=s[1]?'#9fca87':'#927b6c';ctx.fillText(`${s[1]?'■':'□'} ${s[0]}`,x+515,y+344+k*25)});ctx.fillStyle='#857f70';ctx.font='10px monospace';ctx.fillText('所有项目完成后执行点火测试',x+515,y+428);
};

const v13OldInteractFieldProp=v10InteractFieldProp;
v10InteractFieldProp=function(o){
 if(o.type==='originTankWreck'&&!state.v12.starterRepaired){if(state.v12.prologueStage<8)return openDialogue([['旁白','一辆泡过海水的港务巡逻车。现在的你还没有理由拆它。']]);return v13OpenRepairMenu()}
 if(o.type==='trialCheckpoint'){return openDialogue([['系统',`${o.name}。驾驶战车穿过检查门即可自动记录。`]])}
 if(o.type==='bossGate'){
  if(!v11AllFieldEnemiesCleared('rust_hound_lair'))return openDialogue([['柳焰','护卫机还在。铁牙猎犬不会在自己的火力区里给我们公平决斗。先清场。']]);
  state.v13.lairSeen=true;saveSilently();return openDialogue([['旁白','广播里只剩规律的机械脉冲。远处，一台低矮的无人战车从报废车后缓慢转出炮塔。'],['柳焰','它知道我们来了。别追它的车身——看炮口。'],['系统','赏金首：铁牙猎犬。准备完成后，从猎场门进入战斗。'],['旁白','A 再次调查猎场门即可进入赏金首战。']])
 }
 return v13OldInteractFieldProp(o)
};

// Second interaction at the lair gate starts the actual tank boss.
const v13OldInteract=interact;
interact=function(i){if(i?.type==='fieldProp'&&i.obj?.type==='bossGate'&&state.v13.lairSeen){state.v13.lairSeen=false;saveSilently();return startBossBattle(0)}return v13OldInteract(i)};

// Trial gate added to the repair yard without replacing the original scene.
V10_FIELDS.origin_yard.props.push({id:'trial_terminal',type:'trialTerminal',x:1280,y:260,name:'试车环道入口'});
const v13OldFieldProp=v10InteractFieldProp;
v10InteractFieldProp=function(o){
 if(o.type==='trialTerminal'){
  if(!state.v12.starterRepaired)return openDialogue([['老技师（无线电）','车都没点着，你想试什么？']]);
  state.fieldReturn={x:1280,y:260,inTank:true,poiId:'origin_yard'};state.scene='field';state.fieldId='origin_testtrack';state.player.inTank=true;state.tank.x=150;state.tank.y=470;state.player.x=150;state.player.y=470;state.v13.trialStep=0;saveSilently();sayToast('进入港北试车环道');return
 }
 return v13OldFieldProp(o)
};

// Detect sequential test gates while driving.
const v13OldUpdateMovement=updateMovement;
updateMovement=function(dt){v13OldUpdateMovement(dt);if(state.scene==='field'&&state.fieldId==='origin_testtrack'&&state.player.inTank&&mode==='play'){
 const fd=V10_FIELDS.origin_testtrack;for(const o of fd.props){if(o.type!=='trialCheckpoint'||o.order!==(state.v13.trialStep||0)+1)continue;if(dist(state.tank.x,state.tank.y,o.x,o.y)<58){state.v13.trialStep=o.order;sayToast(`${o.name}：通过`,1.5);if(o.order===5){state.v13.trialPassed=true;saveSilently();openDialogue([['老技师（无线电）','制动、转向、动力、炮塔稳定都在范围内。'],['老技师（无线电）','行了。现在它不只是会响，是一辆能把你带回来的车。'],['系统','试车合格。返回封存场后可以驶往锈港。']])}else saveSilently();break}}
 }};

// Trial track uses a much clearer authored circuit.
const v13OldDrawField=drawField;
drawField=function(){
 if(state.fieldId==='origin_testtrack')return v13DrawTrack();
 if(state.fieldId==='rust_hound_lair')return v13DrawLair();
 return v13OldDrawField();
};
function v13FieldBase(fd,ground='#514a3e'){
 ctx.fillStyle=ground;ctx.fillRect(0,0,W,H);const f=state.player.inTank?state.tank:state.player,cx=clamp(f.x,W/2,fd.w-W/2),cy=clamp(f.y,H/2,fd.h-H/2);
 for(let x=Math.floor((cx-W/2)/32)*32-32;x<cx+W/2+64;x+=32)for(let y=Math.floor((cy-H/2)/32)*32-32;y<cy+H/2+64;y+=32){const p=fieldToScreen(x,y),h=v9hash(x>>5,y>>5);ctx.fillStyle=(h&1)?'rgba(255,255,255,.025)':'rgba(0,0,0,.035)';ctx.fillRect(p.x,p.y,31,31)}
 fd.solids.forEach(s=>{const p=fieldToScreen(s.x,s.y);ctx.fillStyle='#292d2a';ctx.fillRect(p.x,p.y,s.w,s.h);ctx.strokeStyle='#625746';ctx.strokeRect(p.x,p.y,s.w,s.h)});
}
function v13DrawTrack(){const fd=V10_FIELDS.origin_testtrack;v13FieldBase(fd,'#544d41');
 // racetrack loop
 const path=[[150,470],[320,690],[940,735],[1450,520],[1270,150],[750,125],[220,170],[150,470]].map(q=>fieldToScreen(q[0],q[1]));ctx.strokeStyle='#202522';ctx.lineWidth=92;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();path.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();ctx.strokeStyle='#4d4d45';ctx.lineWidth=70;ctx.stroke();ctx.strokeStyle='rgba(217,190,121,.25)';ctx.lineWidth=2;ctx.setLineDash([18,18]);ctx.stroke();ctx.setLineDash([]);
 for(const o of fd.props){const p=fieldToScreen(o.x,o.y),done=o.order<=(state.v13.trialStep||0);ctx.strokeStyle=done?'#87b178':'#c29755';ctx.lineWidth=5;ctx.strokeRect(p.x-34,p.y-42,68,84);ctx.fillStyle=done?'#a8d399':'#d7b67a';ctx.font='bold 12px monospace';ctx.textAlign='center';ctx.fillText(`${o.order}`,p.x,p.y-50)}
 drawTank();ctx.fillStyle='rgba(5,8,7,.83)';ctx.fillRect(18,68,330,52);ctx.strokeStyle='#b9985e';ctx.strokeRect(18,68,330,52);ctx.fillStyle='#ead7a4';ctx.font='bold 13px monospace';ctx.textAlign='left';ctx.fillText('港北试车环道',34,91);ctx.fillStyle='#9fa79d';ctx.font='11px monospace';ctx.fillText(`检查进度 ${(state.v13.trialStep||0)}/5 · 顺序通过检查门`,34,109)}
function v13DrawLair(){const fd=V10_FIELDS.rust_hound_lair;v13FieldBase(fd,'#49443a');
 // winding kill-lane + wrecks
 const pts=[[100,520],[360,520],[600,450],[850,520],[1120,500],[1450,520]].map(q=>fieldToScreen(q[0],q[1]));ctx.strokeStyle='#272b29';ctx.lineWidth=76;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();ctx.strokeStyle='#4b4940';ctx.lineWidth=58;ctx.stroke();
 for(const [x,y,a] of [[280,350,-.3],[610,650,.2],[925,310,.4],[1230,680,-.25]]){const p=fieldToScreen(x,y);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(a);ctx.fillStyle='#363b38';ctx.fillRect(-34,-12,68,24);ctx.fillStyle='#1f2321';ctx.beginPath();ctx.arc(-22,14,8,0,TAU);ctx.arc(22,14,8,0,TAU);ctx.fill();ctx.restore()}
 fd.props.forEach(v10DrawFieldProp);fd.enemies.forEach(v10DrawFieldEnemy);drawTank();ctx.fillStyle='rgba(5,8,7,.86)';ctx.fillRect(18,68,330,52);ctx.strokeStyle='#9e5a45';ctx.strokeRect(18,68,330,52);ctx.fillStyle='#e8c98e';ctx.font='bold 13px monospace';ctx.textAlign='left';ctx.fillText('旧海关猎场',34,91);ctx.fillStyle='#aa9a7f';ctx.font='11px monospace';ctx.fillText('废弃车辆组成了人为火力走廊',34,109)}

// Leaving trial is only allowed after all checks; leaving repair yard is only allowed after trial.
const v13OldLeave=v10LeaveField;
v10LeaveField=function(){
 if(state.fieldId==='origin_testtrack'){if(!state.v13.trialPassed)return sayToast('试车尚未完成：按顺序通过 5 个检查门');state.scene='field';state.fieldId='origin_yard';state.player.inTank=true;state.tank.x=1280;state.tank.y=300;state.player.x=1280;state.player.y=300;state.fieldReturn=null;saveSilently();return}
 if(state.fieldId==='origin_yard'&&state.v12.starterRepaired&&!state.v13.trialPassed)return sayToast('老技师不允许未完成试车的破风驶上公路');
 return v13OldLeave();
};

// Once first-chapter dungeon intel is obtained, the hunt points to the lair instead of a boss icon in open terrain.
const v13OldQuestText=questText;
questText=function(){if(state.v12?.originComplete&&state.townIndex===0&&!state.townProgress[0].boss&&!state.townProgress[0].claimed&&state.v11?.huntIntel?.[0])return'前往旧海关猎场，清理护卫并击破铁牙猎犬。';return v13OldQuestText()};
const v13OldBossPosition=bossPosition;
bossPosition=function(i){if(i===0&&state.v11?.huntIntel?.[0])return{x:650,y:590};return v13OldBossPosition(i)};

// More cinematic tank battle without abandoning the classic command box.
const v13OldDrawBattle=drawBattle;
drawBattle=function(){
 if(!battle||battle.type==='foot'||battle.enemy?.name!=='铁牙猎犬')return v13OldDrawBattle();
 // industrial sunset kill-zone
 const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#6d6250');g.addColorStop(.55,'#4c493f');g.addColorStop(1,'#272b28');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 ctx.fillStyle='#2f3330';for(let k=0;k<8;k++){const x=k*145-40,h=100+(k%3)*35;ctx.fillRect(x,210-h,80,h);ctx.fillStyle='#515044';ctx.fillRect(x+15,225-h,7,h-25);ctx.fillStyle='#2f3330'}
 ctx.fillStyle='#3b3730';ctx.fillRect(0,310,W,230);ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(180,325,105,24,0,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(760,315,125,27,0,0,TAU);ctx.fill();
 drawTankModel(175,285,0,state.vehicleIndex,2.15,false);
 // hound silhouette / unique boss sprite
 ctx.save();ctx.translate(755,270);ctx.scale(2.15,2.15);ctx.fillStyle='#3c3f39';ctx.fillRect(-35,-14,68,28);ctx.fillStyle='#1d211f';ctx.fillRect(-38,-18,72,7);ctx.fillRect(-38,12,72,7);ctx.fillStyle='#5a493a';ctx.fillRect(-12,-20,29,40);ctx.fillStyle='#b9a984';ctx.fillRect(12,-3,45,6);ctx.fillStyle='#a24b3c';ctx.fillRect(-22,-5,8,8);ctx.fillStyle='#d35e4b';ctx.fillRect(-20,-3,4,4);ctx.restore();
 // top target HUD
 ctx.fillStyle='rgba(6,8,7,.87)';ctx.fillRect(34,24,892,82);ctx.strokeStyle='#8d5a43';ctx.strokeRect(34,24,892,82);ctx.fillStyle='#eccb84';ctx.font='bold 20px monospace';ctx.textAlign='left';ctx.fillText('赏金首  铁牙猎犬',55,55);ctx.fillStyle='#472521';ctx.fillRect(55,70,500,14);ctx.fillStyle='#c04d43';ctx.fillRect(55,70,500*clamp(battle.enemy.hp/battle.enemy.max,0,1),14);ctx.fillStyle='#aaa18c';ctx.font='11px monospace';ctx.fillText(`HP ${Math.max(0,Math.round(battle.enemy.hp))} / ${battle.enemy.max}`,570,82);
 // classic command window
 v9PixelFrame(27,355,906,158);ctx.fillStyle='#cfcdbf';ctx.font='12px monospace';wrapText(battle.log,48,380,830,18);battle.actions.forEach((a,k)=>{const col=k%3,row=Math.floor(k/3),x=50+col*286,y=422+row*43;ctx.fillStyle=k===battle.sel?'#51432d':'#121713';ctx.fillRect(x,y,260,33);ctx.strokeStyle=k===battle.sel?'#d0b16e':'#464b43';ctx.strokeRect(x,y,260,33);ctx.fillStyle=k===battle.sel?'#fff0bd':'#d3d6cd';ctx.font='13px monospace';ctx.fillText(`${k===battle.sel?'▶':' '} ${a}`,x+12,y+21)});if(battle.win){ctx.fillStyle='#efd27f';ctx.font='bold 13px monospace';ctx.fillText('A 结束战斗',785,340)}
};

// Rustport dialogue: small classic portrait bust only for key story lines, never a poster pasted beside the box.
const v13OldDrawDialogue=drawDialogue;
drawDialogue=function(dt){
 if(!dialogue)return;const line=dialogue.lines[dialogue.idx],key=line.portrait;if(!key||!PORTRAITS[key]||!['liuyan','taoyao','lincheng'].includes(key))return v13OldDrawDialogue(dt);
 dialogue.t+=dt;if(dialogue.t>.016&&dialogue.char<line.text.length){dialogue.char++;dialogue.t=0}
 // classic lower dialogue box first
 const x=34,y=338,w=892,h=170;v9PixelFrame(x,y,w,h);
 // bust is cropped inside a dedicated portrait window fused into the box
 const px=x+10,py=y-122,pw=190,ph=120,img=PORTRAITS[key];ctx.save();ctx.beginPath();ctx.rect(px,py,pw,ph);ctx.clip();ctx.fillStyle='#121412';ctx.fillRect(px,py,pw,ph);if(img?.complete&&img.naturalWidth){ctx.imageSmoothingEnabled=true;ctx.drawImage(img,0,0,img.naturalWidth,img.naturalHeight*.58,px-10,py-26,pw+34,ph+74);ctx.imageSmoothingEnabled=false}const fade=ctx.createLinearGradient(px,0,px+pw,0);fade.addColorStop(.55,'rgba(7,8,7,0)');fade.addColorStop(1,'rgba(7,8,7,.92)');ctx.fillStyle=fade;ctx.fillRect(px,py,pw,ph);ctx.restore();ctx.strokeStyle='#77766e';ctx.strokeRect(px+.5,py+.5,pw-1,ph-1);
 ctx.fillStyle='#f1e9d0';ctx.font='bold 16px monospace';ctx.textAlign='left';ctx.fillText(`【${line.speaker}】`,x+28,y+32);ctx.font='18px monospace';wrapText(line.text.slice(0,dialogue.char),x+28,y+62,w-56,28);const done=dialogue.char>=line.text.length;ctx.fillStyle=done&&Math.floor(performance.now()/350)%2===0?'#e9e6d8':'#77766e';ctx.beginPath();ctx.moveTo(x+w-35,y+h-29);ctx.lineTo(x+w-18,y+h-29);ctx.lineTo(x+w-26,y+h-18);ctx.closePath();ctx.fill();
};

// Version messaging.
if($('zone'))sayToast('v0.13：锈港展示切片 / 修车试驾 / 铁牙猎场',2.8);
/* === v0.14 first-chapter presentation pass: authored Rustport, interiors, dialogue, repair UI, boss stage === */
const V14_VERSION='0.14.0';
state.v14=Object.assign({firstChapterPolish:true,licenseNo:'RH-001',rewardSeen:false},state.v14||{});

function v14Panel(x,y,w,h,fill='rgba(7,10,9,.94)',stroke='#bda267',lw=2){
 ctx.fillStyle=fill;ctx.fillRect(x,y,w,h);ctx.strokeStyle='#111713';ctx.lineWidth=lw+2;ctx.strokeRect(x+1,y+1,w-2,h-2);ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.strokeRect(x+5,y+5,w-10,h-10);
 ctx.fillStyle='rgba(255,255,255,.045)';ctx.fillRect(x+8,y+8,w-16,2);ctx.fillStyle='rgba(0,0,0,.28)';ctx.fillRect(x+8,y+h-10,w-16,2);
}
function v14Label(text,x,y,w=126){ctx.fillStyle='#191711';ctx.fillRect(x,y,w,20);ctx.strokeStyle='#80683f';ctx.strokeRect(x+.5,y+.5,w-1,19);ctx.fillStyle='#e7cb84';ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillText(text,x+w/2,y+14)}
function v14Hash(x,y){return v9hash((x|0)*3+7,(y|0)*5+11)}

// --- Pixel character language: taller silhouettes, layered clothing, clear hair shapes and facing cues.
const v14OldDrawCharacter=drawCharacter;
drawCharacter=function(modelKey,x,y,dir,walk=0,scale=1,label=''){
 const m=CHAR_MODELS[modelKey]||CHAR_MODELS.npcA,p=screenPos(x,y),face=Math.cos(dir)>=0?1:-1,fr=((walk*9)|0)%2,bob=walk?Math.sin(walk*10)*1.1:0;
 ctx.save();ctx.translate(Math.round(p.x),Math.round(p.y+bob));ctx.scale(scale*face,scale);
 ctx.fillStyle='rgba(0,0,0,.32)';ctx.beginPath();ctx.ellipse(0,18,11,4,0,0,TAU);ctx.fill();
 ctx.strokeStyle='#161713';ctx.lineWidth=2;
 // boots + legs
 ctx.fillStyle='#292a27';ctx.fillRect(-8,10+(fr?1:0),6,8);ctx.fillRect(2,10+(fr?0:1),6,8);
 ctx.fillStyle=m.bottom;ctx.fillRect(-7,2,5,10);ctx.fillRect(2,2,5,10);
 // torso and short jacket / role silhouette
 ctx.fillStyle=m.top;ctx.beginPath();ctx.roundRect(-9,-11,18,15,3);ctx.fill();ctx.stroke();
 ctx.fillStyle=m.accent;ctx.fillRect(-11,-10,4,11);ctx.fillRect(7,-10,4,11);
 if(modelKey==='liuyan'){ctx.fillStyle='#262622';ctx.fillRect(-8,-4,16,3);ctx.fillStyle='#7d3d31';ctx.fillRect(-10,-11,20,3)}
 if(modelKey==='lincheng'){ctx.fillStyle='#e6e2d7';ctx.fillRect(-8,-9,16,8);ctx.fillStyle='#a34843';ctx.fillRect(-1,-9,2,7);ctx.fillRect(-4,-6,8,2)}
 if(modelKey==='taoyao'){ctx.fillStyle='#9b4c35';ctx.fillRect(-9,-12,18,4);ctx.fillStyle='#2b2925';ctx.fillRect(-4,-3,8,4)}
 // head
 ctx.fillStyle=m.skin;ctx.beginPath();ctx.roundRect(-6,-22,12,11,4);ctx.fill();ctx.stroke();
 ctx.fillStyle=m.hair;ctx.beginPath();ctx.arc(0,-20,7,Math.PI,TAU);ctx.fill();ctx.fillRect(-7,-20,3,9);
 if(modelKey==='liuyan'){ctx.fillStyle='#79302b';ctx.fillRect(-7,-24,14,4);ctx.fillRect(-9,-21,4,10)}
 if(modelKey==='taoyao'){ctx.fillStyle='#b25838';ctx.fillRect(-7,-24,14,4);ctx.fillRect(4,-21,4,8)}
 if(modelKey==='lincheng'){ctx.fillStyle='#4a3328';ctx.fillRect(-7,-24,14,4);ctx.fillStyle='#e7e3db';ctx.fillRect(-5,-27,10,3);ctx.fillStyle='#a34843';ctx.fillRect(-1,-27,2,3)}
 ctx.fillStyle='#141511';ctx.fillRect(3,-18,2,2);
 // hands / gear
 ctx.fillStyle=m.skin;ctx.fillRect(-12,-3,3,6);ctx.fillRect(9,-3,3,6);
 if(modelKey==='liuyan'){ctx.fillStyle='#2e302c';ctx.fillRect(9,-7,3,12)}
 if(modelKey==='taoyao'){ctx.fillStyle='#b5a680';ctx.fillRect(-13,0,7,2)}
 ctx.restore();
 if(label){ctx.fillStyle='rgba(8,10,9,.82)';ctx.fillRect(p.x-35,p.y-45,70,14);ctx.fillStyle='#e9d7a3';ctx.font='9px monospace';ctx.textAlign='center';ctx.fillText(label,p.x,p.y-35)}
};

// --- More expressive tank renderer with suspension, turret ring, optional track motion and equipment silhouettes.
const v14OldDrawTankModel=drawTankModel;
drawTankModel=function(x,y,dir,idx,scale=1,screen=true){
 const v=VEHICLES[idx],p=screen?screenPos(x,y):{x,y},moving=state.player.inTank&&(keys.up||keys.down||keys.left||keys.right),tick=((performance.now()/90)|0)%2;
 ctx.save();ctx.translate(Math.round(p.x),Math.round(p.y));ctx.rotate(dir);ctx.scale(scale,scale);
 ctx.fillStyle='rgba(0,0,0,.34)';ctx.beginPath();ctx.ellipse(-1,7,31,16,0,0,TAU);ctx.fill();
 // tracks
 ctx.fillStyle='#171a17';ctx.fillRect(-29,-18,58,8);ctx.fillRect(-29,10,58,8);ctx.fillStyle='#3e4039';for(let k=-25;k<=22;k+=9){const off=moving?(tick?2:0):0;ctx.fillRect(k+off,-16,6,4);ctx.fillRect(k+off,12,6,4)}
 // hull with beveled nose
 ctx.fillStyle='#1d211f';ctx.beginPath();ctx.moveTo(-25,-13);ctx.lineTo(19,-13);ctx.lineTo(27,-7);ctx.lineTo(27,7);ctx.lineTo(19,13);ctx.lineTo(-25,13);ctx.closePath();ctx.fill();
 ctx.fillStyle=v.body;ctx.beginPath();ctx.moveTo(-21,-11);ctx.lineTo(17,-11);ctx.lineTo(23,-6);ctx.lineTo(23,6);ctx.lineTo(17,11);ctx.lineTo(-21,11);ctx.closePath();ctx.fill();
 ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(-17,-9,27,2);ctx.fillStyle='#2b2e2b';ctx.fillRect(-18,-5,11,10);
 // armor panels
 if(equipped('armor').id!=='a0'||state.tank.upgrades.armor>0){ctx.fillStyle='#8f8a78';ctx.fillRect(-25,-10,5,20);ctx.fillRect(19,-9,4,18);ctx.strokeStyle='#393a34';ctx.strokeRect(-25,-10,5,20);ctx.strokeRect(19,-9,4,18)}
 // turret ring and turret
 ctx.fillStyle='#1b1e1c';ctx.beginPath();ctx.arc(2,0,10,0,TAU);ctx.fill();ctx.fillStyle='#9d9983';ctx.beginPath();ctx.roundRect(-5,-8,18,16,4);ctx.fill();ctx.strokeStyle='#393a34';ctx.stroke();
 const main=equipped('main'),barrel=26+main.rarity*4+state.tank.upgrades.main*2;ctx.fillStyle='#b9b49d';ctx.fillRect(9,-2,barrel,4);ctx.fillStyle='#74766e';ctx.fillRect(9,-1,barrel,1);
 if(equipped('sub').id!=='s0'||state.tank.upgrades.sub>0){ctx.fillStyle='#676b64';ctx.fillRect(5,-9,21,2);ctx.fillRect(5,7,21,2)}
 if(equipped('se').id!=='e0'||state.tank.upgrades.se>0){ctx.fillStyle='#454c45';ctx.fillRect(-13,-17,18,6);ctx.fillRect(-13,11,18,6);ctx.fillStyle='#a99a76';for(let k=0;k<3;k++){ctx.fillRect(-10+k*5,-16,2,4);ctx.fillRect(-10+k*5,12,2,4)}}
 if(equipped('cunit').id!=='c0'){ctx.strokeStyle='#dfcc80';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-4,-10);ctx.lineTo(-8,-23);ctx.stroke();ctx.fillStyle='#e2ce82';ctx.fillRect(-10,-25,4,4)}
 if(equipped('engine').id!=='eng0'||state.tank.upgrades.engine>0){ctx.fillStyle='#3d413c';ctx.fillRect(-25,-6,6,4);ctx.fillRect(-25,3,6,4);if(moving){ctx.fillStyle='rgba(125,122,105,.4)';ctx.beginPath();ctx.arc(-31,-4,3+tick,0,TAU);ctx.arc(-34,5,2+tick,0,TAU);ctx.fill()}}
 ctx.restore();
};

// --- Rustport authored outdoor scene.
function v14RustGround(){
 const sea=townToScreen(0,118).y,t=performance.now()/1000;
 // sea
 const g=ctx.createLinearGradient(0,0,0,Math.max(1,sea));g.addColorStop(0,'#17333f');g.addColorStop(1,'#315463');ctx.fillStyle=g;ctx.fillRect(0,0,W,Math.max(0,sea));
 for(let k=0;k<26;k++){const yy=sea-8-k*7,phase=(t*.6+k*.41);ctx.strokeStyle=`rgba(171,208,210,${.06+(k%3)*.025})`;ctx.lineWidth=1;ctx.beginPath();for(let x=-20;x<W+30;x+=55){ctx.moveTo(x+Math.sin(phase+x*.01)*6,yy);ctx.lineTo(x+31+Math.sin(phase+x*.012)*6,yy+Math.sin(phase+x*.03)*2)}ctx.stroke()}
 // seawall & dock rim
 ctx.fillStyle='#2a2d29';ctx.fillRect(0,sea-5,W,21);ctx.fillStyle='#8a6746';for(let x=0;x<W;x+=42){ctx.fillRect(x,sea-1,30,11);ctx.fillStyle='#2a2925';ctx.fillRect(x+30,sea-1,4,11);ctx.fillStyle='#8a6746'}
 // town base
 ctx.fillStyle='#6f6250';ctx.fillRect(0,sea+16,W,H-sea-16);
 // cobblestone tile language
 for(let gx=0;gx<1400;gx+=26)for(let gy=128;gy<900;gy+=26){const p=townToScreen(gx,gy),h=v14Hash(gx>>3,gy>>3);if(p.x<-30||p.y<-30||p.x>W+30||p.y>H+30)continue;ctx.fillStyle=(h&1)?'rgba(255,235,190,.035)':'rgba(20,18,15,.035)';ctx.fillRect(p.x,p.y,25,25);ctx.strokeStyle='rgba(28,25,21,.09)';ctx.strokeRect(p.x+.5,p.y+.5,24,24);if(h%9===0){ctx.fillStyle='rgba(46,38,31,.25)';ctx.fillRect(p.x+5,p.y+17,12,2)}}
 // roads and plazas
 const road=(pts,w=70)=>{const ss=pts.map(([x,y])=>townToScreen(x,y));ctx.lineCap='square';ctx.lineJoin='miter';ctx.strokeStyle='#272a27';ctx.lineWidth=w+12;ctx.beginPath();ss.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.stroke();ctx.strokeStyle='#45443c';ctx.lineWidth=w;ctx.stroke();ctx.strokeStyle='rgba(226,193,117,.17)';ctx.lineWidth=2;ctx.setLineDash([16,18]);ctx.stroke();ctx.setLineDash([])};
 road([[700,880],[700,180]],78);road([[70,472],[1330,472]],76);road([[300,472],[300,720]],58);road([[1040,472],[1040,230]],58);
 // guild plaza
 const gp=townToScreen(370,385);ctx.fillStyle='rgba(45,43,37,.82)';ctx.beginPath();ctx.roundRect(gp.x-148,gp.y-70,296,140,12);ctx.fill();ctx.strokeStyle='rgba(194,159,91,.18)';for(let k=-120;k<=120;k+=30){ctx.beginPath();ctx.moveTo(gp.x+k,gp.y-64);ctx.lineTo(gp.x+k+35,gp.y+64);ctx.stroke()}
 // drains, lane reflectors
 for(let x=95;x<1320;x+=90){const p=townToScreen(x,510);ctx.fillStyle='#292d2a';ctx.fillRect(p.x-11,p.y-2,22,4);ctx.fillStyle='rgba(194,165,103,.25)';ctx.fillRect(p.x-2,p.y-2,4,4)}
}
function v14RoofPoly(x,y,w,h,roof='#35332d'){ctx.fillStyle=roof;ctx.beginPath();ctx.moveTo(x-8,y+27);ctx.lineTo(x+18,y+4);ctx.lineTo(x+w-18,y+4);ctx.lineTo(x+w+8,y+27);ctx.lineTo(x+w-5,y+42);ctx.lineTo(x+5,y+42);ctx.closePath();ctx.fill();ctx.strokeStyle='#181a17';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='rgba(255,255,255,.06)';ctx.fillRect(x+20,y+10,w-40,2)}
function v14Window(x,y,lit=true){ctx.fillStyle='#202421';ctx.fillRect(x,y,30,25);ctx.strokeStyle='#121512';ctx.strokeRect(x+.5,y+.5,29,24);ctx.fillStyle=lit?'#d6a65d':'#60706b';ctx.globalAlpha=lit?.55:.28;ctx.fillRect(x+4,y+4,22,17);ctx.globalAlpha=1;ctx.fillStyle='#343a36';ctx.fillRect(x+14,y+3,2,19)}
function v14Building(b){
 const p=townToScreen(b.x,b.y),d=townToScreen(b.x+b.w/2,b.y+b.h),id=b.id,night=(state.time<6||state.time>18.5),wall={guild:'#736048',garage:'#59615d',tavern:'#6a4032',shop:'#666146',clinic:'#6c7c7e'}[id]||'#655746',roof={guild:'#31302a',garage:'#2c3432',tavern:'#3b2823',shop:'#37392f',clinic:'#35484a'}[id]||'#33322d';
 ctx.save();
 // deep footprint shadow
 ctx.fillStyle='rgba(0,0,0,.32)';ctx.fillRect(p.x+12,p.y+38,b.w,b.h-18);
 // side wall body
 ctx.fillStyle=wall;ctx.fillRect(p.x,p.y+36,b.w,b.h-36);ctx.strokeStyle='#292a25';ctx.strokeRect(p.x+.5,p.y+36.5,b.w-1,b.h-37);
 v14RoofPoly(p.x,p.y,b.w,40,roof);
 // wall seams / pipes
 ctx.fillStyle='rgba(255,255,255,.04)';for(let xx=18;xx<b.w-8;xx+=48)ctx.fillRect(p.x+xx,p.y+46,2,b.h-57);
 ctx.fillStyle='#313530';ctx.fillRect(p.x+10,p.y+52,4,b.h-66);ctx.fillRect(p.x+b.w-14,p.y+52,4,b.h-66);
 // windows
 v14Window(p.x+24,p.y+70,night||id==='tavern');v14Window(p.x+b.w-54,p.y+70,night||id==='clinic');
 // door and canopy
 ctx.fillStyle=id==='tavern'?'#6d3529':id==='clinic'?'#d6ddd8':'#574a38';ctx.fillRect(d.x-34,d.y-48,68,7);ctx.fillStyle='#23201b';ctx.fillRect(d.x-16,d.y-41,32,41);ctx.fillStyle='#d5b66f';ctx.fillRect(d.x+9,d.y-22,3,3);
 // signage
 const sw=Math.min(150,b.w-36),sx=p.x+b.w/2-sw/2;ctx.fillStyle='#1b1d19';ctx.fillRect(sx,p.y+46,sw,24);ctx.strokeStyle='#8f7444';ctx.strokeRect(sx+.5,p.y+46.5,sw-1,23);ctx.fillStyle='#f0d28b';ctx.font='bold 11px monospace';ctx.textAlign='center';ctx.fillText(b.name,p.x+b.w/2,p.y+62);
 // unique identity
 if(id==='guild'){
  ctx.fillStyle='#b99355';ctx.beginPath();for(let k=0;k<10;k++){const a=-Math.PI/2+k*Math.PI/5,r=k%2?7:14;ctx.lineTo(p.x+b.w/2+Math.cos(a)*r,p.y+22+Math.sin(a)*r)}ctx.closePath();ctx.fill();
  ctx.fillStyle='#493b2d';ctx.fillRect(p.x+18,p.y+b.h-28,72,18);ctx.fillStyle='#d7c086';ctx.font='8px monospace';ctx.fillText('BOUNTY',p.x+54,p.y+b.h-16);
 } else if(id==='garage'){
  const gx=p.x+58,gy=p.y+82,gw=b.w-116,gh=b.h-86;ctx.fillStyle='#333b38';ctx.fillRect(gx,gy,gw,gh);ctx.strokeStyle='#81867d';ctx.strokeRect(gx+.5,gy+.5,gw-1,gh-1);for(let yy=gy+12;yy<gy+gh;yy+=16){ctx.strokeStyle='rgba(197,206,192,.18)';ctx.beginPath();ctx.moveTo(gx+5,yy);ctx.lineTo(gx+gw-5,yy);ctx.stroke()}ctx.fillStyle='#bc8e4a';ctx.fillRect(gx+12,gy+12,38,5);ctx.fillRect(gx+gw-50,gy+12,38,5);
 } else if(id==='tavern'){
  ctx.fillStyle='#8f2e25';ctx.fillRect(p.x+b.w-76,p.y+86,52,20);ctx.fillStyle='#ffd993';ctx.font='bold 12px monospace';ctx.fillText('BAR',p.x+b.w-50,p.y+100);ctx.shadowColor='#c44';ctx.shadowBlur=10;ctx.strokeStyle='#d26048';ctx.strokeRect(p.x+b.w-76,p.y+86,52,20);ctx.shadowBlur=0;
 } else if(id==='clinic'){
  ctx.fillStyle='#d9ddd5';ctx.fillRect(p.x+b.w-42,p.y+47,17,17);ctx.fillStyle='#a74641';ctx.fillRect(p.x+b.w-36,p.y+49,5,13);ctx.fillRect(p.x+b.w-40,p.y+53,13,5);
 } else if(id==='shop'){
  ctx.fillStyle='#756742';ctx.fillRect(p.x+34,p.y+b.h-30,80,8);for(let k=0;k<4;k++){ctx.fillStyle=['#8c603e','#665c3d','#4e5f4d','#875743'][k];ctx.fillRect(p.x+38+k*18,p.y+b.h-43,13,13)}
 }
 // rooftop vents
 ctx.fillStyle='#4b4d47';ctx.fillRect(p.x+b.w-68,p.y+16,22,12);ctx.fillStyle='#77786e';ctx.fillRect(p.x+b.w-65,p.y+13,16,4);
 ctx.restore();
}
function v14RustportProps(){
 const t=performance.now()/1000,P=(x,y)=>townToScreen(x,y);ctx.save();
 // cranes and mooring
 for(const [x,y,s] of [[78,145,1],[1240,140,-1]]){const p=P(x,y);ctx.strokeStyle='#7a5c41';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(p.x,p.y+85);ctx.lineTo(p.x+34*s,p.y);ctx.lineTo(p.x+92*s,p.y);ctx.stroke();ctx.strokeStyle='#b29263';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p.x+82*s,p.y);ctx.lineTo(p.x+82*s,p.y+72);ctx.stroke();ctx.fillStyle='#5e4d39';ctx.fillRect(p.x-7,p.y+75,14,18)}
 // fishing boat
 const boat=P(585,95);ctx.fillStyle='#27312f';ctx.beginPath();ctx.moveTo(boat.x-62,boat.y+18);ctx.lineTo(boat.x+63,boat.y+18);ctx.lineTo(boat.x+42,boat.y+40);ctx.lineTo(boat.x-48,boat.y+40);ctx.closePath();ctx.fill();ctx.fillStyle='#70654e';ctx.fillRect(boat.x-18,boat.y-4,35,22);ctx.fillStyle='#a99c78';ctx.fillRect(boat.x-3,boat.y-26,4,23);
 // cargo + nets
 for(const [x,y,c] of [[115,520,'#77573d'],[150,520,'#65503a'],[1210,552,'#53615b'],[1248,552,'#76503f'],[1040,745,'#66513b']]){const p=P(x,y);ctx.fillStyle=c;ctx.fillRect(p.x-15,p.y-13,30,26);ctx.strokeStyle='#a78459';ctx.strokeRect(p.x-14.5,p.y-12.5,29,25);ctx.beginPath();ctx.moveTo(p.x-13,p.y-11);ctx.lineTo(p.x+13,p.y+11);ctx.moveTo(p.x+13,p.y-11);ctx.lineTo(p.x-13,p.y+11);ctx.stroke()}
 // streetlamps / cables
 const poles=[[530,430],[870,430],[530,515],[870,515]];for(const [x,y] of poles){const p=P(x,y);ctx.fillStyle='#292d29';ctx.fillRect(p.x-3,p.y-29,6,34);ctx.fillStyle='#e2b968';ctx.beginPath();ctx.arc(p.x,p.y-31,5,0,TAU);ctx.fill();ctx.globalAlpha=.08;ctx.fillStyle='#ffd986';ctx.beginPath();ctx.arc(p.x,p.y-31,28+Math.sin(t*2)*2,0,TAU);ctx.fill();ctx.globalAlpha=1}
 const c1=P(530,430),c2=P(870,430);ctx.strokeStyle='#242522';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(c1.x,c1.y-28);ctx.quadraticCurveTo((c1.x+c2.x)/2,c1.y-5,c2.x,c2.y-28);ctx.stroke();
 // flags
 for(const [x,y] of [[430,155],[1160,160]]){const p=P(x,y);ctx.strokeStyle='#373831';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(p.x,p.y+58);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.fillStyle='#863e31';ctx.beginPath();ctx.moveTo(p.x,p.y+5);ctx.lineTo(p.x+40+Math.sin(t*2)*5,p.y+13);ctx.lineTo(p.x,p.y+28);ctx.closePath();ctx.fill()}
 // moving handcart / life
 const cart=P(425+Math.sin(t*.35)*70,690);ctx.fillStyle='#413a30';ctx.fillRect(cart.x-24,cart.y-13,48,20);ctx.fillStyle='#171915';ctx.beginPath();ctx.arc(cart.x-15,cart.y+9,6,0,TAU);ctx.arc(cart.x+15,cart.y+9,6,0,TAU);ctx.fill();ctx.fillStyle='#966d43';ctx.fillRect(cart.x-18,cart.y-24,14,12);ctx.fillRect(cart.x+2,cart.y-28,16,16);
 // garage sparks
 const sp=P(1060,336);if(((t*3)|0)%3!==0){ctx.fillStyle='#ffc05c';for(let k=0;k<5;k++){const a=t*6+k*1.8,rr=8+k*4;ctx.fillRect(sp.x+Math.cos(a)*rr,sp.y+Math.sin(a)*rr,2,2)}}
 // seagulls
 ctx.strokeStyle='rgba(235,232,213,.5)';ctx.lineWidth=1;for(let k=0;k<4;k++){const x=80+k*230+((t*13+k*37)%90),y=45+k*11;ctx.beginPath();ctx.moveTo(x-6,y);ctx.quadraticCurveTo(x-2,y-4,x,y);ctx.quadraticCurveTo(x+2,y-4,x+6,y);ctx.stroke()}
 ctx.restore();
}
function v14RustportForeground(){
 // foreground pipes/chain to create occlusion and depth
 const p=townToScreen(0,790);ctx.save();ctx.globalAlpha=.9;ctx.fillStyle='#343632';ctx.fillRect(0,p.y+64,W,18);for(let x=0;x<W;x+=58){ctx.fillStyle='#222521';ctx.fillRect(x,p.y+58,8,32)}ctx.restore();
}
const v14OldDrawTown=drawTown;
drawTown=function(){
 if((currentTown?.index??state.townIndex)!==0)return v14OldDrawTown();
 v14RustGround();v14RustportProps();
 for(const b of V9_DECOR_BUILDINGS[0])v9DrawDecorBuilding(b,0);
 townBuildings(0).forEach(v14Building);v8DrawLandmarks(0);
 // workers render after architecture, before player
 getAmbientNpcs(0).forEach(n=>drawCharacter(n.model,n.x,n.y,n.dir,n.walk,.96,n.name));
 drawTank();if(!state.player.inTank)drawPartyFollowers();drawPlayer();
 const gate=townToScreen(700,850);ctx.fillStyle='#20231f';ctx.fillRect(gate.x-90,gate.y-8,180,16);ctx.strokeStyle='#6c5b3c';ctx.strokeRect(gate.x-89.5,gate.y-7.5,179,15);ctx.fillStyle='#d8ba72';ctx.font='10px monospace';ctx.textAlign='center';ctx.fillText('南门 · 荒原公路',gate.x,gate.y-15);
 v14RustportForeground();drawPrompt();drawAmbientLighting();
};

// --- Authored Rustport interiors: a room must visually explain its function.
const v14OldDrawInterior=drawInterior;
function v14RoomBase(floor='#4b453a',wall='#282724',trim='#876b45'){
 ctx.fillStyle='#171a17';ctx.fillRect(0,0,W,H);ctx.fillStyle=wall;ctx.fillRect(28,28,W-56,H-56);ctx.fillStyle=floor;ctx.fillRect(48,74,W-96,H-126);
 // floor grid
 for(let x=55;x<W-55;x+=32)for(let y=80;y<H-58;y+=32){ctx.strokeStyle='rgba(255,255,255,.035)';ctx.strokeRect(x+.5,y+.5,31,31)}
 ctx.fillStyle='#1b1e1b';ctx.fillRect(48,58,W-96,18);ctx.fillStyle=trim;for(let x=58;x<W-62;x+=78)ctx.fillRect(x,62,46,4);
 ctx.fillStyle='#141714';ctx.fillRect(W/2-56,H-55,112,22);ctx.fillStyle='#b99656';ctx.fillRect(W/2-50,H-48,100,4);
}
function v14DrawInteriorTitle(title,sub){ctx.fillStyle='rgba(8,10,9,.88)';ctx.fillRect(22,17,360,46);ctx.strokeStyle='#685a3e';ctx.strokeRect(22.5,17.5,359,45);ctx.fillStyle='#e8cf8b';ctx.font='bold 15px monospace';ctx.textAlign='left';ctx.fillText(title,39,39);ctx.fillStyle='#8f978e';ctx.font='9px monospace';ctx.fillText(sub,39,54)}
function v14DrawGuild(){
 v14RoomBase('#52493b','#2a2723','#8b6c42');v14DrawInteriorTitle('锈港 · 猎人公会','RUSTPORT HUNTER GUILD / 登记、悬赏与情报');
 // reception
 ctx.fillStyle='#4f3827';ctx.fillRect(375,130,330,48);ctx.fillStyle='#81603d';ctx.fillRect(365,122,350,14);for(let x=390;x<700;x+=52){ctx.fillStyle='#2d241c';ctx.fillRect(x,142,8,32)}
 // bounty wall
 ctx.fillStyle='#30251c';ctx.fillRect(738,92,150,170);ctx.strokeStyle='#8b6b40';ctx.strokeRect(738.5,92.5,149,169);for(let k=0;k<8;k++){const xx=754+(k%2)*60,yy=110+Math.floor(k/2)*36;ctx.fillStyle=k===0?'#d2bd82':'#b7a77d';ctx.fillRect(xx,yy,48,27);ctx.fillStyle='#583529';ctx.fillRect(xx+5,yy+5,12,10);ctx.fillStyle='#6b5a42';ctx.fillRect(xx+21,yy+7,20,3);ctx.fillRect(xx+21,yy+14,15,3)}
 // map table
 ctx.fillStyle='#4a392b';ctx.beginPath();ctx.ellipse(242,315,108,62,0,0,TAU);ctx.fill();ctx.strokeStyle='#9d7a4d';ctx.stroke();ctx.fillStyle='#bca06d';ctx.fillRect(180,284,126,62);ctx.fillStyle='#687654';ctx.beginPath();ctx.moveTo(202,300);ctx.lineTo(250,289);ctx.lineTo(282,315);ctx.lineTo(241,333);ctx.closePath();ctx.fill();ctx.fillStyle='#4d6d7c';ctx.fillRect(215,308,54,5);
 // benches, lockers, lamps
 for(const y of [250,390]){ctx.fillStyle='#3d342b';ctx.fillRect(100,y,150,18);ctx.fillStyle='#24231f';ctx.fillRect(114,y+16,8,20);ctx.fillRect(228,y+16,8,20)}
 ctx.fillStyle='#4b504c';for(let k=0;k<3;k++){ctx.fillRect(60+k*54,92,46,104);ctx.strokeStyle='#7e837b';ctx.strokeRect(64+k*54,98,38,92)}
 // hanging lamps
 for(const x of [300,520,760]){ctx.strokeStyle='#3d3a32';ctx.beginPath();ctx.moveTo(x,74);ctx.lineTo(x,100);ctx.stroke();ctx.fillStyle='#deb567';ctx.beginPath();ctx.arc(x,105,7,0,TAU);ctx.fill();ctx.globalAlpha=.08;ctx.beginPath();ctx.arc(x,105,38,0,TAU);ctx.fill();ctx.globalAlpha=1}
 interiorNpcs('guild',0).forEach(n=>drawCharacter(n.model,n.x,n.y,n.dir,n.walk,1,n.name));drawPlayer();
}
function v14DrawGarage(){
 v14RoomBase('#3f4541','#242825','#9a7545');v14DrawInteriorTitle('锈港 · 战车车库','SERVICE BAY 01 / 检修、改造与战车整备');
 // large bay doors and gantry
 ctx.fillStyle='#313936';ctx.fillRect(280,82,400,88);ctx.strokeStyle='#69716b';for(let y=94;y<162;y+=14){ctx.beginPath();ctx.moveTo(286,y);ctx.lineTo(674,y);ctx.stroke()}
 ctx.strokeStyle='#8a7046';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(170,78);ctx.lineTo(170,350);ctx.lineTo(790,350);ctx.lineTo(790,78);ctx.stroke();ctx.lineWidth=1;
 // lift pit and tank
 ctx.fillStyle='#202522';ctx.fillRect(310,210,340,160);ctx.strokeStyle='#c1944d';ctx.lineWidth=4;ctx.strokeRect(326,226,308,128);ctx.lineWidth=1;drawTankModel(480,288,0,state.vehicleIndex,2.25,false);
 // tool benches and racks
 ctx.fillStyle='#4c3628';ctx.fillRect(80,118,170,55);ctx.fillStyle='#85613d';ctx.fillRect(76,110,178,12);for(let k=0;k<7;k++){ctx.fillStyle=['#a58458','#777d72','#b46645'][k%3];ctx.fillRect(92+k*22,128,8,26)}
 ctx.fillStyle='#3f4741';for(let k=0;k<4;k++){ctx.fillRect(740,110+k*64,130,50);ctx.strokeStyle='#7d867b';ctx.strokeRect(744,114+k*64,122,42);ctx.fillStyle='#91714a';ctx.fillRect(755,124+k*64,34,20)}
 // hose & parts
 ctx.strokeStyle='#191b19';ctx.lineWidth=5;ctx.beginPath();ctx.arc(205,285,42,0,TAU);ctx.stroke();ctx.lineWidth=1;ctx.fillStyle='#6b5a41';for(let k=0;k<5;k++)ctx.fillRect(98+k*33,390,26,22);
 // sparks near lift
 const t=performance.now()/1000;ctx.fillStyle='#ffc35f';for(let k=0;k<6;k++){const a=t*7+k,rr=10+k*5;ctx.fillRect(650+Math.cos(a)*rr,285+Math.sin(a)*rr,2,2)}
 interiorNpcs('garage',0).forEach(n=>drawCharacter(n.model,n.x,n.y,n.dir,n.walk,1,n.name));drawPlayer();
}
function v14DrawTavern(){
 v14RoomBase('#4b3329','#231b18','#9c603d');v14DrawInteriorTitle('锈港 · 海锚酒馆','THE ANCHOR / 传言、委托与短暂喘息');
 // bar wall
 ctx.fillStyle='#2d201a';ctx.fillRect(545,82,330,126);for(let k=0;k<9;k++){ctx.fillStyle=['#7a4a31','#a06b3b','#546d59'][k%3];ctx.fillRect(566+k*31,105+(k%2)*21,10,27)}
 ctx.fillStyle='#543522';ctx.fillRect(525,205,370,56);ctx.fillStyle='#9a643b';ctx.fillRect(516,196,388,14);for(let x=560;x<875;x+=55){ctx.fillStyle='#30261f';ctx.beginPath();ctx.arc(x,286,16,0,TAU);ctx.fill();ctx.fillRect(x-3,286,6,26)}
 // tables + patrons
 for(const [x,y] of [[210,230],[340,335],[190,405]]){ctx.fillStyle='#553723';ctx.beginPath();ctx.arc(x,y,47,0,TAU);ctx.fill();ctx.strokeStyle='#8f5e39';ctx.stroke();ctx.fillStyle='#d9aa5c';ctx.fillRect(x-4,y-5,8,10)}
 // jukebox neon
 ctx.fillStyle='#202520';ctx.fillRect(86,100,70,112);ctx.strokeStyle='#a54e65';ctx.strokeRect(86.5,100.5,69,111);ctx.fillStyle='#7fc0b4';ctx.fillRect(101,118,40,34);ctx.fillStyle='#d86171';ctx.font='bold 9px monospace';ctx.fillText('JUKE',121,176);
 // warm pools
 for(const [x,y] of [[220,190],[350,295],[680,175]]){ctx.globalAlpha=.07;ctx.fillStyle='#ffc36a';ctx.beginPath();ctx.arc(x,y,78,0,TAU);ctx.fill();ctx.globalAlpha=1}
 interiorNpcs('tavern',0).forEach(n=>drawCharacter(n.model,n.x,n.y,n.dir,n.walk,1,n.name));drawPlayer();
}
function v14DrawClinic(){v14RoomBase('#657477','#2c3738','#759195');v14DrawInteriorTitle('锈港 · 灯塔诊所','CLINIC / 急救、恢复与伤员登记');for(const y of [150,300]){ctx.fillStyle='#d9ded8';ctx.fillRect(105,y,220,68);ctx.fillStyle='#93a8aa';ctx.fillRect(114,y+8,66,52);ctx.fillStyle='#4b5858';ctx.fillRect(326,y+10,6,50)}ctx.fillStyle='#53635f';ctx.fillRect(690,105,170,250);for(let k=0;k<4;k++){ctx.strokeStyle='#8b9b96';ctx.strokeRect(702,118+k*56,146,45);ctx.fillStyle='#d9e0d9';ctx.fillRect(716,132+k*56,28,22);ctx.fillStyle='#a64c46';ctx.fillRect(726,135+k*56,7,16);ctx.fillRect(721,140+k*56,17,6)}ctx.fillStyle='#4e5a58';ctx.fillRect(480,120,150,55);ctx.fillStyle='#769193';ctx.fillRect(470,110,170,12);interiorNpcs('clinic',0).forEach(n=>drawCharacter(n.model,n.x,n.y,n.dir,n.walk,1,n.name));drawPlayer()}
function v14DrawShop(){v14RoomBase('#55523f','#2b2d24','#8e7a4e');v14DrawInteriorTitle('锈港 · 港务补给店','SUPPLY / 弹药、工具与旅途物资');for(const x of [105,275,705]){ctx.fillStyle='#574d38';ctx.fillRect(x,105,125,235);for(let y=125;y<320;y+=55){ctx.fillStyle='#8a7955';ctx.fillRect(x+10,y,105,7);for(let k=0;k<4;k++){ctx.fillStyle=['#7b5439','#4e6550','#76684b','#8b4c3c'][k];ctx.fillRect(x+16+k*24,y-20,17,18)}}}ctx.fillStyle='#5c422e';ctx.fillRect(430,125,220,58);ctx.fillStyle='#8c6942';ctx.fillRect(422,116,236,14);for(let k=0;k<5;k++){ctx.fillStyle='#69523b';ctx.fillRect(430+k*48,375,40,35);ctx.strokeStyle='#a28358';ctx.strokeRect(431+k*48,376,38,33)}interiorNpcs('shop',0).forEach(n=>drawCharacter(n.model,n.x,n.y,n.dir,n.walk,1,n.name));drawPlayer()}
drawInterior=function(){
 if((currentTown?.index??state.townIndex)!==0)return v14OldDrawInterior();
 if(state.currentInterior==='guild')return v14DrawGuild();if(state.currentInterior==='garage')return v14DrawGarage();if(state.currentInterior==='tavern')return v14DrawTavern();if(state.currentInterior==='clinic')return v14DrawClinic();if(state.currentInterior==='shop')return v14DrawShop();return v14OldDrawInterior();
};

// --- Dialogue UI: classic window first; portrait is a cropped bust embedded in the window, never a floating poster.
const v14OldDrawDialogue=drawDialogue;
drawDialogue=function(dt){
 if(!dialogue)return;const line=dialogue.lines[dialogue.idx];dialogue.t+=dt;if(dialogue.t>.016&&dialogue.char<line.text.length){dialogue.char++;dialogue.t=0}
 const key=line.portrait,has=key&&PORTRAITS[key]?.complete&&PORTRAITS[key]?.naturalWidth;ctx.fillStyle='rgba(4,6,5,.28)';ctx.fillRect(0,0,W,H);
 const x=28,y=344,w=904,h=170;v14Panel(x,y,w,h,'rgba(7,9,8,.97)',has?(PORTRAIT_META[key]?.accent||'#bda267'):'#8f8c7b',2);
 let tx=x+26,tw=w-52;
 if(has){const px=x+12,py=y+12,pw=124,ph=h-24;ctx.save();ctx.beginPath();ctx.rect(px,py,pw,ph);ctx.clip();ctx.fillStyle='#151714';ctx.fillRect(px,py,pw,ph);const img=PORTRAITS[key],sx=img.naturalWidth*.13,sy=img.naturalHeight*.03,sw=img.naturalWidth*.65,sh=img.naturalHeight*.58;ctx.imageSmoothingEnabled=true;ctx.drawImage(img,sx,sy,sw,sh,px-10,py-4,pw+30,ph+26);ctx.imageSmoothingEnabled=false;const gg=ctx.createLinearGradient(px,py,px+pw,py);gg.addColorStop(.52,'rgba(7,9,8,0)');gg.addColorStop(1,'rgba(7,9,8,.75)');ctx.fillStyle=gg;ctx.fillRect(px,py,pw,ph);ctx.restore();ctx.strokeStyle='#524f45';ctx.strokeRect(px+.5,py+.5,pw-1,ph-1);tx=px+pw+20;tw=x+w-tx-26}
 const speaker=(line.speaker&&line.speaker!=='旁白'&&line.speaker!=='系统')?line.speaker:'';if(speaker){ctx.fillStyle='#211c14';ctx.fillRect(tx,y+13,Math.min(180,ctx.measureText(speaker).width+52),26);ctx.strokeStyle='#7c6840';ctx.strokeRect(tx+.5,y+13.5,Math.min(180,ctx.measureText(speaker).width+52)-1,25);ctx.fillStyle='#edd08a';ctx.font='bold 14px monospace';ctx.textAlign='left';ctx.fillText(speaker,tx+14,y+31)}
 ctx.fillStyle='#eee9da';ctx.font='18px monospace';ctx.textAlign='left';wrapText(line.text.slice(0,dialogue.char),tx,y+(speaker?62:43),tw,28);
 const done=dialogue.char>=line.text.length;ctx.fillStyle=done&&Math.floor(performance.now()/330)%2===0?'#f3d58e':'#6f7168';ctx.beginPath();ctx.moveTo(x+w-38,y+h-32);ctx.lineTo(x+w-19,y+h-32);ctx.lineTo(x+w-28,y+h-20);ctx.closePath();ctx.fill();ctx.fillStyle='#8f948b';ctx.font='10px monospace';ctx.textAlign='right';ctx.fillText(dialogue.idx===dialogue.lines.length-1?'A 结束':'A 继续',x+w-50,y+h-18);
};

// --- Repair UI: visual diagnostic board rather than a text-only developer menu.
const v14OldDrawMenu=drawMenu;
drawMenu=function(){
 if(!menu?.v13repair)return v14OldDrawMenu();
 ctx.fillStyle='#101411';ctx.fillRect(0,0,W,H);
 // faint garage backdrop
 ctx.fillStyle='#26302c';ctx.fillRect(0,0,W,160);ctx.fillStyle='#3b413d';for(let y=20;y<160;y+=22){ctx.strokeStyle='rgba(255,255,255,.08)';ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
 v14Panel(36,42,888,452,'rgba(12,16,13,.97)','#a8854d',2);
 ctx.fillStyle='#e9ce87';ctx.font='bold 19px monospace';ctx.textAlign='left';ctx.fillText('破风巡逻车 · 启动系统复原',62,78);ctx.fillStyle='#7f8b81';ctx.font='10px monospace';ctx.fillText('PORT AUTHORITY PATROL / SERVICE ORDER 00-17',62,98);
 // left procedure list
 const labels=['01  安装启动电容','02  接入点火线圈','03  重做保险盒旁路','04  执行点火测试','05  退出检修'];for(let i=0;i<labels.length;i++){const yy=136+i*55,active=i===menu.sel;ctx.fillStyle=active?'#5c472b':'#1b221d';ctx.fillRect(60,yy,308,42);ctx.strokeStyle=active?'#d0ae68':'#394239';ctx.strokeRect(60.5,yy+.5,307,41);ctx.fillStyle=active?'#fff0bd':'#c9d0c8';ctx.font='13px monospace';ctx.fillText(`${active?'▶ ':''}${labels[i]}`,76,yy+26)}
 // tank blueprint / schematic
 const bx=560,by=270;ctx.strokeStyle='rgba(107,193,176,.42)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bx-150,by-62);ctx.lineTo(bx+110,by-62);ctx.lineTo(bx+150,by-30);ctx.lineTo(bx+150,by+30);ctx.lineTo(bx+110,by+62);ctx.lineTo(bx-150,by+62);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(bx+5,by,46,0,TAU);ctx.stroke();ctx.strokeRect(bx-175,by-82,350,164);ctx.lineWidth=1;for(let x=bx-150;x<=bx+150;x+=25){ctx.strokeStyle='rgba(107,193,176,.08)';ctx.beginPath();ctx.moveTo(x,by-82);ctx.lineTo(x,by+82);ctx.stroke()}for(let y=by-75;y<=by+75;y+=25){ctx.beginPath();ctx.moveTo(bx-175,y);ctx.lineTo(bx+175,y);ctx.stroke()}
 const nodes=[{x:bx-95,y:by-14,ok:state.v13.repair.cell,label:'启动电容'},{x:bx-20,y:by+34,ok:state.v13.repair.coil,label:'点火线圈'},{x:bx+90,y:by-28,ok:state.v13.repair.bypass,label:'保险旁路'}];for(const n of nodes){ctx.fillStyle=n.ok?'#72b483':'#7b4639';ctx.beginPath();ctx.arc(n.x,n.y,9,0,TAU);ctx.fill();ctx.strokeStyle=n.ok?'#b5dfbd':'#c27663';ctx.beginPath();ctx.arc(n.x,n.y,15,0,TAU);ctx.stroke();ctx.fillStyle=n.ok?'#bfe0c4':'#c8a69b';ctx.font='10px monospace';ctx.textAlign='center';ctx.fillText(n.label,n.x,n.y+30)}
 ctx.fillStyle='#9da89f';ctx.font='11px monospace';ctx.textAlign='left';ctx.fillText(`废料库存 ${state.scrap}  ｜ 当前装甲 ${Math.round(state.tank.hp)}/${tankMax()}`,420,420);ctx.fillStyle='#d2b36d';ctx.fillText('▲▼ 选择步骤    A 执行    B 退出检修',420,452);
};

// --- Trial track and bounty lair get authored stage dressing.
const v14OldDrawField=drawField;
drawField=function(){if(state.fieldId==='origin_testtrack')return v14Track();if(state.fieldId==='rust_hound_lair')return v14Lair();return v14OldDrawField()};
function v14FieldGround(fd,base='#4d483e'){
 ctx.fillStyle=base;ctx.fillRect(0,0,W,H);const f=state.player.inTank?state.tank:state.player,cx=clamp(f.x,W/2,fd.w-W/2),cy=clamp(f.y,H/2,fd.h-H/2);for(let x=Math.floor((cx-W/2)/32)*32-32;x<cx+W/2+64;x+=32)for(let y=Math.floor((cy-H/2)/32)*32-32;y<cy+H/2+64;y+=32){const p=fieldToScreen(x,y),h=v14Hash(x>>4,y>>4);ctx.fillStyle=(h&1)?'rgba(255,255,255,.025)':'rgba(0,0,0,.03)';ctx.fillRect(p.x,p.y,31,31);if(h%13===0){ctx.fillStyle='rgba(40,34,27,.22)';ctx.fillRect(p.x+6,p.y+19,15,2)}}}
function v14Track(){const fd=V10_FIELDS.origin_testtrack;v14FieldGround(fd,'#575044');const pts=[[150,470],[320,690],[940,735],[1450,520],[1270,150],[750,125],[220,170],[150,470]].map(q=>fieldToScreen(q[0],q[1]));ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#1f2321';ctx.lineWidth=110;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();ctx.strokeStyle='#484a43';ctx.lineWidth=82;ctx.stroke();ctx.strokeStyle='rgba(239,204,120,.3)';ctx.lineWidth=3;ctx.setLineDash([18,20]);ctx.stroke();ctx.setLineDash([]);
 // barriers and cones
 for(let k=0;k<16;k++){const a=k/16*TAU,x=800+Math.cos(a)*560,y=440+Math.sin(a)*290,p=fieldToScreen(x,y);ctx.fillStyle='#c9763f';ctx.beginPath();ctx.moveTo(p.x,p.y-8);ctx.lineTo(p.x-6,p.y+7);ctx.lineTo(p.x+6,p.y+7);ctx.closePath();ctx.fill();ctx.fillStyle='#ded2b6';ctx.fillRect(p.x-4,p.y,8,2)}
 for(const o of fd.props){const p=fieldToScreen(o.x,o.y),done=o.order<=(state.v13.trialStep||0);ctx.fillStyle='#292d2a';ctx.fillRect(p.x-42,p.y-50,84,8);ctx.fillRect(p.x-42,p.y+42,84,8);ctx.fillRect(p.x-42,p.y-50,7,100);ctx.fillRect(p.x+35,p.y-50,7,100);ctx.strokeStyle=done?'#8ec18e':'#d5a65d';ctx.lineWidth=3;ctx.strokeRect(p.x-35,p.y-42,70,84);ctx.fillStyle=done?'#a8d399':'#e0bd73';ctx.font='bold 13px monospace';ctx.textAlign='center';ctx.fillText(`${o.order}`,p.x,p.y-57)}
 drawTank();v14Panel(18,66,350,58,'rgba(5,8,7,.86)','#927442',1);ctx.fillStyle='#ead39b';ctx.font='bold 13px monospace';ctx.textAlign='left';ctx.fillText('港北试车环道',34,90);ctx.fillStyle='#8f9b91';ctx.font='10px monospace';ctx.fillText(`制动 / 转向 / 动力 / 炮塔稳定  ${(state.v13.trialStep||0)}/5`,34,108)}
function v14Lair(){const fd=V10_FIELDS.rust_hound_lair;v14FieldGround(fd,'#484238');
 // customs kill-lane road
 const pts=[[100,520],[330,520],[580,455],[840,520],[1120,500],[1500,520]].map(q=>fieldToScreen(q[0],q[1]));ctx.strokeStyle='#202421';ctx.lineWidth=92;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();ctx.strokeStyle='#4a4940';ctx.lineWidth=68;ctx.stroke();ctx.strokeStyle='rgba(224,190,113,.2)';ctx.lineWidth=2;ctx.setLineDash([14,18]);ctx.stroke();ctx.setLineDash([]);
 // customs gantry
 const g=fieldToScreen(1320,520);ctx.fillStyle='#242825';ctx.fillRect(g.x-105,g.y-85,210,10);ctx.fillRect(g.x-100,g.y-75,10,150);ctx.fillRect(g.x+90,g.y-75,10,150);ctx.fillStyle='#86503b';ctx.fillRect(g.x-63,g.y-103,126,24);ctx.fillStyle='#e0c17a';ctx.font='bold 11px monospace';ctx.textAlign='center';ctx.fillText('旧 海 关 · 禁 区',g.x,g.y-87);
 // wrecks / barricades / lights
 for(const [x,y,a] of [[265,350,-.3],[590,655,.2],[900,315,.45],[1180,685,-.25]]){const p=fieldToScreen(x,y);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(a);ctx.fillStyle='#252a27';ctx.fillRect(-38,-13,76,26);ctx.fillStyle='#65483a';ctx.fillRect(-29,-9,58,18);ctx.fillStyle='#151816';ctx.beginPath();ctx.arc(-24,15,8,0,TAU);ctx.arc(24,15,8,0,TAU);ctx.fill();ctx.restore()}
 for(const [x,y] of [[450,365],[735,660],[1040,350]]){const p=fieldToScreen(x,y);ctx.fillStyle='#292d2a';ctx.fillRect(p.x-3,p.y-38,6,42);ctx.fillStyle='#d2a354';ctx.beginPath();ctx.arc(p.x,p.y-40,6,0,TAU);ctx.fill();ctx.globalAlpha=.06;ctx.beginPath();ctx.arc(p.x,p.y-40,50,0,TAU);ctx.fill();ctx.globalAlpha=1}
 fd.props.forEach(v10DrawFieldProp);fd.enemies.forEach(v10DrawFieldEnemy);drawTank();v14Panel(18,66,330,58,'rgba(5,8,7,.88)','#8e553e',1);ctx.fillStyle='#e7c98c';ctx.font='bold 13px monospace';ctx.textAlign='left';ctx.fillText('旧海关猎场',34,90);ctx.fillStyle='#9d9280';ctx.font='10px monospace';ctx.fillText('烧毁车辆构成火力走廊 · 深处侦测到重型目标',34,108)}

// --- Boss battle visual language closer to a finished mobile RPG while keeping classic command logic.
const v14OldDrawBattle=drawBattle;
drawBattle=function(){
 if(!battle||battle.type==='foot'||battle.enemy?.name!=='铁牙猎犬')return v14OldDrawBattle();
 const t=performance.now()/1000;
 // sunset industrial battlefield
 const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#755545');sky.addColorStop(.42,'#7b6751');sky.addColorStop(.68,'#48463d');sky.addColorStop(1,'#292c29');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
 ctx.fillStyle='#323531';for(let k=0;k<10;k++){const x=k*112-20,h=65+(k%4)*32;ctx.fillRect(x,248-h,72,h);ctx.fillStyle='#1e211f';ctx.fillRect(x+14,248-h-20,8,h+20);ctx.fillStyle='#323531'}
 ctx.fillStyle='#403b31';ctx.fillRect(0,300,W,240);ctx.strokeStyle='rgba(212,179,107,.14)';ctx.lineWidth=2;ctx.setLineDash([22,18]);ctx.beginPath();ctx.moveTo(0,367);ctx.lineTo(W,367);ctx.stroke();ctx.setLineDash([]);
 // debris / dust
 ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(190,332,118,25,0,0,TAU);ctx.ellipse(770,320,135,27,0,0,TAU);ctx.fill();for(let k=0;k<16;k++){ctx.fillStyle=`rgba(181,140,85,${.05+(k%3)*.025})`;ctx.beginPath();ctx.arc((k*83+t*16)%W,315+(k%5)*18,3+(k%4),0,TAU);ctx.fill()}
 drawTankModel(185,298,0,state.vehicleIndex,2.35,false);
 // Iron Hound boss, readable unique silhouette
 ctx.save();ctx.translate(764,282);ctx.scale(2.3,2.3);ctx.fillStyle='#191c1a';ctx.fillRect(-43,-20,86,8);ctx.fillRect(-43,15,86,8);ctx.fillStyle='#454943';ctx.beginPath();ctx.moveTo(-38,-14);ctx.lineTo(28,-14);ctx.lineTo(40,-7);ctx.lineTo(40,9);ctx.lineTo(24,16);ctx.lineTo(-38,16);ctx.closePath();ctx.fill();ctx.fillStyle='#6c5140';ctx.fillRect(-10,-23,35,40);ctx.fillStyle='#b8aa89';ctx.fillRect(15,-4,53,7);ctx.fillStyle='#3a3e39';ctx.fillRect(-44,-8,12,19);ctx.fillStyle='#d65142';ctx.beginPath();ctx.arc(-25,-4,5+Math.sin(t*5),0,TAU);ctx.fill();ctx.fillStyle='#e8a75b';ctx.fillRect(-22,-6,3,3);ctx.restore();
 // boss HUD
 v14Panel(32,22,896,84,'rgba(5,7,6,.88)','#89503d',2);ctx.fillStyle='#e9c77f';ctx.font='bold 19px monospace';ctx.textAlign='left';ctx.fillText('赏金首  铁牙猎犬',54,52);ctx.fillStyle='#7e857c';ctx.font='9px monospace';ctx.fillText('RUST HOUND / AUTO-HUNTING VEHICLE',54,68);ctx.fillStyle='#3e211e';ctx.fillRect(390,47,490,16);ctx.fillStyle='#c64f43';ctx.fillRect(390,47,490*clamp(battle.enemy.hp/battle.enemy.max,0,1),16);ctx.strokeStyle='#8c6a52';ctx.strokeRect(389.5,46.5,491,17);ctx.fillStyle='#e1d8c6';ctx.font='10px monospace';ctx.textAlign='right';ctx.fillText(`${Math.max(0,Math.round(battle.enemy.hp))} / ${battle.enemy.max}`,878,80);
 // command UI
 v14Panel(26,353,908,164,'rgba(7,9,8,.96)','#6e715f',2);ctx.fillStyle='#cfd2ca';ctx.font='11px monospace';ctx.textAlign='left';wrapText(battle.log,48,378,836,18);battle.actions.forEach((a,k)=>{const col=k%3,row=Math.floor(k/3),x=49+col*288,y=423+row*44,active=k===battle.sel;ctx.fillStyle=active?'#5e482c':'#151b17';ctx.fillRect(x,y,264,35);ctx.strokeStyle=active?'#d3b16c':'#3e473f';ctx.strokeRect(x+.5,y+.5,263,34);ctx.fillStyle=active?'#fff0bc':'#cbd0c8';ctx.font='13px monospace';ctx.fillText(`${active?'▶':' '} ${a}`,x+13,y+22)});
 if(battle.win){ctx.fillStyle='rgba(10,12,10,.95)';ctx.fillRect(610,118,300,154);ctx.strokeStyle='#c9a35e';ctx.strokeRect(610.5,118.5,299,153);ctx.fillStyle='#f0d286';ctx.font='bold 15px monospace';ctx.fillText('赏金首击破',632,147);ctx.fillStyle='#cbc9bc';ctx.font='11px monospace';ctx.fillText(`赏金：${BOSS_STATS[0].bounty}G`,632,176);ctx.fillText(`战利品：${findPart(BOSS_DROPS[0])?.name||'核心'}`,632,199);ctx.fillText('返回锈港公会完成交付',632,222);ctx.fillStyle='#e8c671';ctx.fillText('A 结束战斗',632,250)}
};

// --- HUD becomes lighter and reads like a game, not a debug strip.
const v14OldUpdateHud=updateHud;
updateHud=function(){v14OldUpdateHud();const hud=$('topHud');if(!hud)return;hud.dataset.rank=state.v12?.originComplete?'HUNTER':'CIVILIAN';};

// --- First chapter badge / release messaging.
if($('zone'))sayToast('v0.14：锈港第一章成品化 / 场景与演出重构',2.8);

// v0.14 route/follower compatibility fix
if(typeof drawPartyFollowers==='undefined'){var drawPartyFollowers=function(){};}
updateNpcs=function(dt){if(state.scene!=='town')return;for(const n of getAmbientNpcs(state.townIndex)){if(!n.route||!n.route.length){n.walk=(n.walk||0)+dt*.15;continue}if(!Number.isInteger(n.target))n.target=1%n.route.length;const target=n.route[n.target]||n.route[0],dx=target.x-n.x,dy=target.y-n.y,d=Math.hypot(dx,dy);if(d<5){n.target=(n.target+1)%n.route.length;continue}n.dir=Math.atan2(dy,dx);n.x+=dx/d*n.speed*dt;n.y+=dy/d*n.speed*dt;n.walk=(n.walk||0)+dt;}};

// --- Hunter identity and bounty-board UX: becoming a hunter is reflected in the interface, not only story text.
const v14IdentityOldOpenMenu=openMenu;
openMenu=function(){v14IdentityOldOpenMenu();if(menu&&state.v12?.originComplete&&!menu.items.includes('猎人执照'))menu.items.splice(2,0,'猎人执照')};
const v14IdentityOldMenuConfirm=menuConfirm;
menuConfirm=function(){
 if(menu&&!menu.sub&&!menu.garage&&!menu.shop&&menu.items?.[menu.sel]==='猎人执照'){
  const cleared=state.killed.filter(Boolean).length,rank=cleared>=7?'S':cleared>=4?'A':cleared>=2?'B':'C';
  menu.sub={title:'猎人执照',license:true,items:[`执照编号 ${state.v14.licenseNo}`,`登记地 锈港猎人公会`,`猎人等级 ${rank}`,`赏金首击破 ${cleared}`,`当前战车 ${tankName()}`,`累计赏金 ${state.gold}G`],onSelect:()=>{}};menu.sel=0;return;
 }
 return v14IdentityOldMenuConfirm();
};
const v14IdentityOldFixture=interactFixture;
interactFixture=function(f){
 if(f==='board'&&state.townIndex===0&&state.v12?.originComplete){
  const p=state.townProgress[0];p.board=true;saveSilently();const killed=state.killed[0];
  menu={items:[],sel:0,sub:{title:'锈港悬赏榜',bountyBoard:true,items:[`${killed?'✓':'★'} 铁牙猎犬     ${BOSS_STATS[0].bounty}G`,`灰礁盗匪团   情报不足`,`盐路巨兽     未确认`],onSelect:(i)=>{if(i===0){closeMenu();openDialogue([['公会终端',killed?'赏金首“铁牙猎犬”已确认击破。':'编号 RH-017，目标“铁牙猎犬”。港区运输队连续三次遭到同一辆无人猎杀车伏击。'],['公会终端',killed?'击破记录已经写入你的猎人执照。':`悬赏金额 ${BOSS_STATS[0].bounty}G。完成城内调查后再追踪目标。`]])}}}};mode='menu';setHint('▲▼ 查看目标 · A 详情 · B 返回');return;
 }
 return v14IdentityOldFixture(f);
};
const v14IdentityDrawMenu=drawMenu;
drawMenu=function(){
 if(menu?.sub?.license){ctx.fillStyle='#0c100d';ctx.fillRect(0,0,W,H);v14Panel(150,72,660,392,'rgba(15,19,16,.98)','#b89451',2);ctx.fillStyle='#e5c779';ctx.font='bold 21px monospace';ctx.textAlign='left';ctx.fillText('荒 原 猎 人 执 照',188,118);ctx.fillStyle='#6f776f';ctx.font='9px monospace';ctx.fillText('WASTELAND HUNTER LICENSE / RUSTPORT BRANCH',188,137);ctx.fillStyle='#2b332e';ctx.fillRect(186,165,160,208);ctx.strokeStyle='#6d725f';ctx.strokeRect(186.5,165.5,159,207);ctx.save();ctx.translate(266,292);ctx.scale(3,3);ctx.fillStyle='#171a17';ctx.beginPath();ctx.ellipse(0,20,11,4,0,0,TAU);ctx.fill();ctx.fillStyle='#292a27';ctx.fillRect(-8,8,6,11);ctx.fillRect(2,8,6,11);ctx.fillStyle='#5e4537';ctx.fillRect(-9,-7,18,16);ctx.fillStyle='#8a593e';ctx.fillRect(-11,-7,4,11);ctx.fillRect(7,-7,4,11);ctx.fillStyle='#d5a07c';ctx.beginPath();ctx.roundRect(-6,-19,12,12,4);ctx.fill();ctx.fillStyle='#30231d';ctx.beginPath();ctx.arc(0,-18,7,Math.PI,TAU);ctx.fill();ctx.fillRect(-7,-19,3,9);ctx.fillStyle='#161713';ctx.fillRect(3,-15,2,2);ctx.restore();ctx.fillStyle='#1d241f';ctx.fillRect(382,166,385,208);ctx.strokeStyle='#465047';ctx.strokeRect(382.5,166.5,384,207);ctx.fillStyle='#d8d5c8';ctx.font='13px monospace';menu.sub.items.forEach((it,k)=>ctx.fillText(it,410,201+k*31));ctx.fillStyle='#9d7a43';ctx.fillRect(188,394,578,30);ctx.fillStyle='#f0d28b';ctx.font='bold 12px monospace';ctx.fillText('「活着回来，才算完成委托。」',207,414);ctx.fillStyle='#7e877f';ctx.font='10px monospace';ctx.fillText('B 返回',705,448);return}
 if(menu?.sub?.bountyBoard){ctx.fillStyle='#171512';ctx.fillRect(0,0,W,H);v14Panel(95,48,770,440,'rgba(26,21,16,.98)','#936d3e',2);ctx.fillStyle='#e3c27b';ctx.font='bold 20px monospace';ctx.textAlign='left';ctx.fillText('锈 港 猎 人 公 会 · 悬 赏 榜',130,91);ctx.fillStyle='#8c7960';ctx.font='9px monospace';ctx.fillText('BOUNTY NOTICE / TARGETS VERIFIED BY RUSTPORT GUILD',130,110);for(let i=0;i<menu.sub.items.length;i++){const y=155+i*86,active=i===menu.sel;ctx.fillStyle=active?'#4d3926':'#211d18';ctx.fillRect(128,y,704,65);ctx.strokeStyle=active?'#c8a35e':'#4c4437';ctx.strokeRect(128.5,y+.5,703,64);ctx.fillStyle=active?'#f2d38a':'#c9c0ab';ctx.font='bold 15px monospace';ctx.fillText(`${active?'▶ ':''}${menu.sub.items[i]}`,151,y+27);ctx.fillStyle='#7f796c';ctx.font='10px monospace';ctx.fillText(i===0?'港务运输线 / 自动猎杀车 / 重型火炮':'档案尚未达到正式悬赏标准',173,y+49)}ctx.fillStyle='#887e6c';ctx.font='10px monospace';ctx.fillText('▲▼ 选择   A 查看档案   B 返回',130,448);return}
 return v14IdentityDrawMenu();
};


/* === v0.15 Rustport art / encounter pass === */
const V15_VERSION='0.15.0';
state.v15=Object.assign({houndPhaseSeen:0,rustportShowcase:true,bountyCeremony:false},state.v15||{});

function v15Poly(points,fill,stroke=null,lw=1){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke()}}
function v15Brick(x,y,w,h,seed=0){ctx.save();for(let yy=y;yy<y+h;yy+=12){const off=((yy-y)/12|0)%2?9:0;for(let xx=x-18+off;xx<x+w;xx+=18){const k=v14Hash((xx+seed)>>2,(yy+seed)>>2);ctx.fillStyle=k%3===0?'rgba(255,224,171,.035)':'rgba(20,17,14,.055)';ctx.fillRect(xx,yy,17,11);ctx.strokeStyle='rgba(20,18,15,.13)';ctx.strokeRect(xx+.5,yy+.5,17,11)}}ctx.restore()}
function v15LightPool(x,y,r=54,a=.10){const g=ctx.createRadialGradient(x,y,2,x,y,r);g.addColorStop(0,`rgba(255,200,110,${a})`);g.addColorStop(1,'rgba(255,190,95,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill()}
function v15RustBuilding(b){
 const p=townToScreen(b.x,b.y),d=townToScreen(b.x+b.w/2,b.y+b.h),id=b.id;
 const cfg={guild:['#80684e','#34322d','#b79355'],garage:['#626c68','#303937','#c08d4d'],tavern:['#75483a','#422b25','#d04d35'],shop:['#777151','#3c3e33','#b99a59'],clinic:['#71878a','#394f52','#d8ded9']}[id]||['#6b5a48','#34322e','#a08356'];
 const wall=cfg[0],roof=cfg[1],accent=cfg[2],depth=18;
 ctx.save();
 // long cast shadow gives town depth
 ctx.fillStyle='rgba(0,0,0,.34)';ctx.beginPath();ctx.moveTo(p.x+16,p.y+36);ctx.lineTo(p.x+b.w+depth,p.y+50);ctx.lineTo(p.x+b.w+depth,p.y+b.h+depth);ctx.lineTo(p.x+16,p.y+b.h+depth);ctx.closePath();ctx.fill();
 // right side face
 v15Poly([[p.x+b.w,p.y+38],[p.x+b.w+depth,p.y+52],[p.x+b.w+depth,p.y+b.h+depth],[p.x+b.w,p.y+b.h]],'#3b352d','#20201d',1);
 // front wall
 ctx.fillStyle=wall;ctx.fillRect(p.x,p.y+38,b.w,b.h-38);ctx.strokeStyle='#292721';ctx.lineWidth=2;ctx.strokeRect(p.x+1,p.y+39,b.w-2,b.h-40);v15Brick(p.x,p.y+42,b.w,b.h-44,b.x+b.y);
 // roof planes: slightly angled / thick
 v15Poly([[p.x-11,p.y+33],[p.x+18,p.y+5],[p.x+b.w-24,p.y+5],[p.x+b.w+11,p.y+33],[p.x+b.w-1,p.y+46],[p.x+3,p.y+46]],roof,'#171917',2);
 ctx.fillStyle='rgba(235,215,172,.08)';ctx.fillRect(p.x+22,p.y+12,b.w-50,3);
 ctx.fillStyle='#262925';ctx.fillRect(p.x+b.w-67,p.y+14,28,15);ctx.fillStyle='#66675e';ctx.fillRect(p.x+b.w-62,p.y+9,18,6);
 // facade ribs and pipes
 for(let xx=22;xx<b.w-18;xx+=54){ctx.fillStyle='rgba(32,30,26,.20)';ctx.fillRect(p.x+xx,p.y+50,3,b.h-62)}
 ctx.fillStyle='#383a34';ctx.fillRect(p.x+10,p.y+55,5,b.h-71);ctx.fillStyle='#8a7451';ctx.fillRect(p.x+12,p.y+66,1,b.h-92);
 // windows with frames, curtains, light pools
 const night=state.time<6||state.time>18.5;for(const wx of [p.x+24,p.x+b.w-59]){ctx.fillStyle='#1c211f';ctx.fillRect(wx,p.y+73,35,30);ctx.strokeStyle='#0e1110';ctx.strokeRect(wx+.5,p.y+73.5,34,29);ctx.fillStyle=(night||id==='tavern'||id==='clinic')?'#d7a65e':'#60747a';ctx.globalAlpha=(night||id==='tavern')?.68:.33;ctx.fillRect(wx+5,p.y+78,25,20);ctx.globalAlpha=1;ctx.fillStyle='#3c403a';ctx.fillRect(wx+16,p.y+75,2,26);ctx.fillRect(wx+3,p.y+87,29,2);if(night||id==='tavern')v15LightPool(wx+17,p.y+100,52,.07)}
 // entrance with step and canopy
 ctx.fillStyle='#28231d';ctx.fillRect(d.x-20,d.y-48,40,48);ctx.fillStyle=accent;ctx.fillRect(d.x-38,d.y-54,76,7);ctx.fillStyle='#141612';ctx.fillRect(d.x-18,d.y-44,36,4);ctx.fillStyle='#b5965d';ctx.fillRect(d.x+11,d.y-25,3,3);ctx.fillStyle='#3d3d35';ctx.fillRect(d.x-29,d.y,58,6);
 // integrated signage
 const signW=Math.min(170,b.w-40),sx=p.x+(b.w-signW)/2;ctx.fillStyle='#151713';ctx.fillRect(sx,p.y+49,signW,27);ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.strokeRect(sx+1,p.y+50,signW-2,25);ctx.fillStyle='#f0d493';ctx.font='bold 12px "Noto Sans SC",monospace';ctx.textAlign='center';ctx.fillText(b.name,p.x+b.w/2,p.y+67);
 // unique scene-readable facade identity
 if(id==='guild'){
   ctx.fillStyle='#b69455';ctx.beginPath();for(let k=0;k<10;k++){const a=-Math.PI/2+k*Math.PI/5,r=k%2?8:16;ctx.lineTo(p.x+44+Math.cos(a)*r,p.y+63+Math.sin(a)*r)}ctx.closePath();ctx.fill();ctx.fillStyle='#292721';ctx.font='bold 8px monospace';ctx.fillText('HUNTERS',p.x+b.w-56,p.y+b.h-16);
   ctx.fillStyle='#43372b';ctx.fillRect(p.x+22,p.y+b.h-31,84,21);ctx.strokeStyle='#85683d';ctx.strokeRect(p.x+22.5,p.y+b.h-30.5,83,20);ctx.fillStyle='#dbc07b';ctx.font='8px monospace';ctx.fillText('BOUNTY',p.x+64,p.y+b.h-17);
 }else if(id==='garage'){
   const gx=p.x+48,gy=p.y+83,gw=b.w-96,gh=b.h-87;ctx.fillStyle='#28302e';ctx.fillRect(gx,gy,gw,gh);ctx.strokeStyle='#7f8c84';ctx.lineWidth=2;ctx.strokeRect(gx+1,gy+1,gw-2,gh-2);for(let yy=gy+12;yy<gy+gh;yy+=14){ctx.strokeStyle='rgba(196,204,192,.17)';ctx.beginPath();ctx.moveTo(gx+4,yy);ctx.lineTo(gx+gw-4,yy);ctx.stroke()}ctx.fillStyle='#c18a43';ctx.fillRect(gx+9,gy+9,42,5);ctx.fillRect(gx+gw-51,gy+9,42,5);ctx.fillStyle='#1e2321';ctx.fillRect(gx+gw/2-18,gy+gh-15,36,10);
 }else if(id==='tavern'){
   ctx.fillStyle='#75261e';ctx.fillRect(p.x+b.w-85,p.y+88,58,22);ctx.strokeStyle='#de7158';ctx.shadowColor='#f35a42';ctx.shadowBlur=12;ctx.strokeRect(p.x+b.w-84.5,p.y+88.5,57,21);ctx.shadowBlur=0;ctx.fillStyle='#ffd98c';ctx.font='bold 12px monospace';ctx.fillText('BAR',p.x+b.w-56,p.y+103);ctx.fillStyle='#49281f';ctx.fillRect(p.x+29,p.y+b.h-33,82,20);for(let k=0;k<4;k++){ctx.fillStyle=['#754736','#8c6940','#53634a','#5f4136'][k];ctx.fillRect(p.x+34+k*18,p.y+b.h-29,12,12)}
 }else if(id==='clinic'){
   ctx.fillStyle='#e0e4df';ctx.fillRect(p.x+b.w-50,p.y+51,22,22);ctx.fillStyle='#a44843';ctx.fillRect(p.x+b.w-42,p.y+53,6,18);ctx.fillRect(p.x+b.w-48,p.y+59,18,6);ctx.fillStyle='#4b6062';ctx.fillRect(p.x+30,p.y+b.h-31,86,16);ctx.fillStyle='#d9ddd7';ctx.font='8px monospace';ctx.fillText('CLINIC',p.x+73,p.y+b.h-20);
 }else if(id==='shop'){
   ctx.fillStyle='#68593c';ctx.fillRect(p.x+26,p.y+b.h-32,102,11);for(let k=0;k<5;k++){ctx.fillStyle=['#895b3c','#655c42','#4d6452','#805143','#6c6b47'][k];ctx.fillRect(p.x+31+k*18,p.y+b.h-47,13,15)}ctx.fillStyle='#282b25';ctx.fillRect(p.x+b.w-115,p.y+b.h-30,84,16);ctx.fillStyle='#d8c184';ctx.font='8px monospace';ctx.fillText('SUPPLY',p.x+b.w-73,p.y+b.h-19);
 }
 ctx.restore();
}

function v15DecorHouse(b,idx){const p=townToScreen(b.x,b.y),depth=12;ctx.save();ctx.fillStyle='rgba(0,0,0,.26)';ctx.fillRect(p.x+depth,p.y+25,b.w,b.h);v15Poly([[p.x,p.y+24],[p.x+b.w,p.y+24],[p.x+b.w+depth,p.y+36],[p.x+depth,p.y+36]],idx%2?'#403d35':'#3b3933','#1e201d');ctx.fillStyle=idx%2?'#675646':'#5d574b';ctx.fillRect(p.x,p.y+36,b.w,b.h-36);v15Brick(p.x,p.y+36,b.w,b.h-36,idx*20);ctx.fillStyle='#1e201c';ctx.fillRect(p.x+b.w/2-13,p.y+b.h-31,26,31);ctx.fillStyle='#b08d5e';ctx.fillRect(p.x+15,p.y+53,22,18);ctx.fillRect(p.x+b.w-37,p.y+53,22,18);ctx.fillStyle='#242620';ctx.fillRect(p.x-6,p.y+16,b.w+12,17);ctx.fillStyle='rgba(255,255,255,.07)';ctx.fillRect(p.x+8,p.y+19,b.w-16,2);ctx.restore()}

function v15RustGround(){
 const t=performance.now()/1000,sea=townToScreen(700,118).y;ctx.fillStyle='#263e43';ctx.fillRect(0,0,W,Math.max(0,sea+9));
 // layered water bands and foam
 for(let k=0;k<18;k++){const yy=sea-5-k*8;ctx.strokeStyle=`rgba(${130+k*2},${174+k},${180+k},${.035+(k%3)*.022})`;ctx.lineWidth=k%4===0?2:1;ctx.beginPath();for(let x=-30;x<W+60;x+=44){const a=t*.75+x*.012+k*.61;ctx.moveTo(x,yy+Math.sin(a)*2);ctx.quadraticCurveTo(x+17,yy-3+Math.sin(a+1)*2,x+36,yy+Math.sin(a+2)*2)}ctx.stroke()}
 // quayside / pier stone
 ctx.fillStyle='#252925';ctx.fillRect(0,sea-1,W,24);ctx.fillStyle='#796044';for(let x=-8;x<W;x+=36){ctx.fillRect(x,sea+2,27,12);ctx.fillStyle='#252823';ctx.fillRect(x+27,sea+2,4,12);ctx.fillStyle='#796044'}
 // ground
 ctx.fillStyle='#5e5548';ctx.fillRect(0,sea+23,W,H-sea-23);
 // top-down cobble mosaic
 for(let gx=0;gx<1400;gx+=22)for(let gy=122;gy<900;gy+=18){const p=townToScreen(gx,gy);if(p.x<-25||p.y<-25||p.x>W+25||p.y>H+25)continue;const h=v14Hash(gx>>2,gy>>2),tone=h%4;ctx.fillStyle=['rgba(235,211,166,.035)','rgba(0,0,0,.045)','rgba(183,160,120,.035)','rgba(38,32,27,.055)'][tone];ctx.fillRect(p.x,p.y,21,17);ctx.strokeStyle='rgba(24,22,19,.10)';ctx.strokeRect(p.x+.5,p.y+.5,20,16);if(h%17===0){ctx.fillStyle='rgba(31,28,25,.28)';ctx.fillRect(p.x+5,p.y+11,10,2)}}
 // road network, wider / wet central street
 const road=(pts,w=80)=>{const ss=pts.map(q=>townToScreen(q[0],q[1]));ctx.lineCap='square';ctx.lineJoin='round';ctx.strokeStyle='#212522';ctx.lineWidth=w+14;ctx.beginPath();ss.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.stroke();ctx.strokeStyle='#393c37';ctx.lineWidth=w;ctx.stroke();ctx.strokeStyle='rgba(228,194,120,.16)';ctx.lineWidth=2;ctx.setLineDash([17,18]);ctx.stroke();ctx.setLineDash([]);};
 road([[700,895],[700,165]],86);road([[85,475],[1315,475]],82);road([[300,475],[300,730]],60);road([[1040,475],[1040,210]],60);
 // wet patches / reflections
 for(const [x,y,w,h] of [[590,535,150,18],[765,405,88,13],[285,512,96,12],[960,535,112,14]]){const p=townToScreen(x,y);ctx.fillStyle='rgba(91,123,119,.16)';ctx.beginPath();ctx.ellipse(p.x,p.y,w*.5,h*.5,0,0,TAU);ctx.fill();ctx.strokeStyle='rgba(180,190,173,.08)';ctx.stroke()}
 // guild plaza patterned stone
 const gp=townToScreen(360,390);ctx.fillStyle='#3d3932';ctx.beginPath();ctx.roundRect(gp.x-168,gp.y-80,336,160,8);ctx.fill();for(let yy=-68;yy<=68;yy+=20){ctx.strokeStyle='rgba(203,172,116,.09)';ctx.beginPath();ctx.moveTo(gp.x-158,gp.y+yy);ctx.lineTo(gp.x+158,gp.y+yy);ctx.stroke()}for(let xx=-148;xx<=148;xx+=26){ctx.beginPath();ctx.moveTo(gp.x+xx,gp.y-74);ctx.lineTo(gp.x+xx+35,gp.y+74);ctx.stroke()}
}

function v15RustAtmosphere(){const t=performance.now()/1000,P=(x,y)=>townToScreen(x,y);ctx.save();
 // large dock cranes
 for(const [x,y,s] of [[85,150,1],[1235,155,-1]]){const p=P(x,y);ctx.strokeStyle='#6b5038';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(p.x,p.y+105);ctx.lineTo(p.x+31*s,p.y+3);ctx.lineTo(p.x+112*s,p.y+3);ctx.stroke();ctx.strokeStyle='#bd9661';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x+101*s,p.y+3);ctx.lineTo(p.x+101*s,p.y+81);ctx.stroke();ctx.fillStyle='#4c4437';ctx.fillRect(p.x+94*s-(s<0?13:0),p.y+77,14,17)}
 // fishing trawler at waterline
 const boat=P(610,100);ctx.fillStyle='#1f2928';v15Poly([[boat.x-73,boat.y+18],[boat.x+77,boat.y+18],[boat.x+50,boat.y+46],[boat.x-54,boat.y+46]],'#283331','#151918',2);ctx.fillStyle='#725f46';ctx.fillRect(boat.x-24,boat.y-5,48,26);ctx.fillStyle='#b19b70';ctx.fillRect(boat.x-3,boat.y-32,5,28);ctx.strokeStyle='#a88a5c';ctx.beginPath();ctx.moveTo(boat.x,boat.y-28);ctx.lineTo(boat.x+40,boat.y+9);ctx.stroke();
 // lamps with reflections
 for(const [x,y] of [[530,430],[870,430],[530,520],[870,520],[300,530],[1040,405]]){const p=P(x,y);ctx.fillStyle='#222522';ctx.fillRect(p.x-3,p.y-34,6,38);ctx.fillStyle='#d9ad61';ctx.beginPath();ctx.arc(p.x,p.y-36,5,0,TAU);ctx.fill();v15LightPool(p.x,p.y-29,64,.085);ctx.fillStyle='rgba(204,157,78,.05)';ctx.fillRect(p.x-2,p.y-3,4,34)}
 // power cables
 const a=P(530,430),b=P(870,430),c=P(1040,405);ctx.strokeStyle='#171a17';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(a.x,a.y-33);ctx.quadraticCurveTo((a.x+b.x)/2,a.y-5,b.x,b.y-33);ctx.quadraticCurveTo((b.x+c.x)/2,b.y-8,c.x,c.y-33);ctx.stroke();
 // market tarp + crates near tavern
 const mk=P(190,610);ctx.fillStyle='#392a22';ctx.fillRect(mk.x-70,mk.y-4,140,9);ctx.fillStyle='#833a2e';v15Poly([[mk.x-76,mk.y-45],[mk.x+70,mk.y-45],[mk.x+55,mk.y-8],[mk.x-65,mk.y-8]],'#7b3b30','#3a2720');for(let k=0;k<5;k++){ctx.fillStyle=['#75543a','#5d6348','#744a37','#807046','#5d5142'][k];ctx.fillRect(mk.x-61+k*25,mk.y+2,20,18)}
 // smoke stacks / animated steam
 for(const [x,y] of [[1110,195],[1145,205],[420,205]]){const p=P(x,y);for(let k=0;k<5;k++){const q=(t*.22+k*.18)%1,rr=5+k*2;ctx.fillStyle=`rgba(145,139,125,${.10*(1-q)})`;ctx.beginPath();ctx.arc(p.x+Math.sin(t+k)*8,p.y-20-q*72,rr+q*12,0,TAU);ctx.fill()}}
 // flags & seagulls
 for(const [x,y] of [[430,160],[1160,165]]){const p=P(x,y);ctx.strokeStyle='#292c28';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(p.x,p.y+62);ctx.lineTo(p.x,p.y);ctx.stroke();const flap=Math.sin(t*3+x)*5;v15Poly([[p.x,p.y+5],[p.x+45+flap,p.y+11],[p.x+31+flap*.6,p.y+22],[p.x,p.y+27]],'#8b3c30','#4a2a24')}
 ctx.strokeStyle='rgba(235,231,211,.58)';ctx.lineWidth=1;for(let k=0;k<5;k++){const x=70+k*185+((t*17+k*41)%80),y=48+(k%3)*15;ctx.beginPath();ctx.moveTo(x-7,y);ctx.quadraticCurveTo(x-3,y-5,x,y);ctx.quadraticCurveTo(x+3,y-5,x+7,y);ctx.stroke()}
 ctx.restore()}

function v15Foreground(){const y=townToScreen(700,810).y;ctx.save();ctx.fillStyle='rgba(26,29,26,.94)';ctx.fillRect(0,y+72,W,21);ctx.fillStyle='#161a17';for(let x=-4;x<W;x+=55){ctx.fillRect(x,y+64,7,37)}ctx.strokeStyle='rgba(128,103,65,.4)';ctx.beginPath();ctx.moveTo(0,y+67);ctx.lineTo(W,y+67);ctx.stroke();ctx.restore()}

const v15OldDrawTown=drawTown;
drawTown=function(){
 if((currentTown?.index??state.townIndex)!==0)return v15OldDrawTown();
 v15RustGround();v15RustAtmosphere();
 V9_DECOR_BUILDINGS[0].forEach((b,i)=>v15DecorHouse(b,i));
 townBuildings(0).forEach(v15RustBuilding);v8DrawLandmarks(0);
 getAmbientNpcs(0).forEach(n=>drawCharacter(n.model,n.x,n.y,n.dir,n.walk,.96,n.name));
 drawTank();if(!state.player.inTank)drawPartyFollowers();drawPlayer();
 // subtle location banner only when not in dialogue/menu
 if(mode==='play'&&!dialogue&&!menu){v14Panel(22,58,260,45,'rgba(6,9,8,.78)','#705936',1);ctx.fillStyle='#e2c47e';ctx.font='bold 13px monospace';ctx.textAlign='left';ctx.fillText('锈港 · 中央码头区',38,80);ctx.fillStyle='#879087';ctx.font='8px monospace';ctx.fillText('RUSTPORT / CENTRAL QUAY',38,94)}
 v15Foreground();drawPrompt();drawAmbientLighting();
};

// More authored garage: perspective service bay, gantry, foreground workbench.
function v15DrawGarage(){
 ctx.fillStyle='#161b19';ctx.fillRect(0,0,W,H);
 // rear wall
 ctx.fillStyle='#313936';ctx.fillRect(35,35,890,183);for(let x=45;x<920;x+=32){ctx.strokeStyle='rgba(199,211,198,.055)';ctx.beginPath();ctx.moveTo(x,35);ctx.lineTo(x,218);ctx.stroke()}
 ctx.fillStyle='#202725';ctx.fillRect(270,58,430,148);ctx.strokeStyle='#78857d';ctx.lineWidth=3;ctx.strokeRect(271.5,59.5,427,145);for(let y=74;y<198;y+=17){ctx.strokeStyle='rgba(196,205,193,.18)';ctx.beginPath();ctx.moveTo(280,y);ctx.lineTo(690,y);ctx.stroke()}
 // floor with perspective converging lines
 v15Poly([[35,218],[925,218],[925,540],[35,540]],'#3d4540');for(let y=240;y<540;y+=36){ctx.strokeStyle='rgba(18,21,19,.25)';ctx.beginPath();ctx.moveTo(35,y);ctx.lineTo(925,y);ctx.stroke()}for(let x=-160;x<1120;x+=80){ctx.strokeStyle='rgba(197,174,121,.10)';ctx.beginPath();ctx.moveTo(480+(x-480)*.38,218);ctx.lineTo(x,540);ctx.stroke()}
 // bay safety stripes / lift rails
 const bx=480,by=338;ctx.fillStyle='#111613';ctx.beginPath();ctx.roundRect(bx-225,by-101,450,202,8);ctx.fill();ctx.strokeStyle='#c19049';ctx.lineWidth=4;ctx.strokeRect(bx-222,by-98,444,196);for(let x=bx-210;x<bx+210;x+=28){ctx.fillStyle=(x/28|0)%2?'#2b2c27':'#aa7b3f';ctx.fillRect(x,by-100,18,8);ctx.fillRect(x,by+92,18,8)}ctx.fillStyle='#5f6a64';ctx.fillRect(bx-182,by-55,364,110);ctx.fillStyle='#2b302d';ctx.fillRect(bx-155,by-44,310,88);
 // tank enlarged on lift
 ctx.save();ctx.translate(bx,by+4);ctx.scale(1.75,1.75);drawTankModel(0,0,-Math.PI/2,state.vehicleIndex,1,false);ctx.restore();
 // overhead gantry
 ctx.fillStyle='#715438';ctx.fillRect(118,90,17,285);ctx.fillRect(825,90,17,285);ctx.fillRect(118,89,724,14);ctx.fillStyle='#a8783d';for(let x=146;x<820;x+=62)ctx.fillRect(x,92,38,5);ctx.strokeStyle='#9f8155';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(650,103);ctx.lineTo(650,190);ctx.stroke();ctx.fillStyle='#4c4940';ctx.fillRect(638,184,24,18);
 // tool wall left
 ctx.fillStyle='#563c2c';ctx.fillRect(58,118,170,105);ctx.strokeStyle='#a97d4d';ctx.strokeRect(58.5,118.5,169,104);for(let x=76;x<210;x+=28){ctx.fillStyle='#baa77d';ctx.fillRect(x,138,4,28);ctx.fillStyle='#75543b';ctx.fillRect(x-4,166,12,6)}ctx.fillStyle='#1c211e';ctx.fillRect(62,229,165,37);for(let k=0;k<5;k++){ctx.fillStyle=['#795739','#5f695c','#a05a3b','#75664b','#4c5b53'][k];ctx.fillRect(72+k*30,238,22,18)}
 // parts racks right
 for(let k=0;k<3;k++){ctx.fillStyle='#54493a';ctx.fillRect(755,245+k*73,155,58);ctx.strokeStyle='#9b7548';ctx.strokeRect(755.5,245.5+k*73,154,57);ctx.fillStyle='#272d29';ctx.fillRect(766,257+k*73,133,31);ctx.fillStyle='#8a704c';for(let j=0;j<4;j++)ctx.fillRect(775+j*30,263+k*73,20,18)}
 // foreground bench creates depth
 ctx.fillStyle='#1d221f';ctx.fillRect(0,476,W,64);ctx.fillStyle='#66503a';ctx.fillRect(75,452,250,40);ctx.fillStyle='#9b7748';ctx.fillRect(68,446,264,10);for(let k=0;k<6;k++){ctx.fillStyle='#b0a283';ctx.fillRect(90+k*36,458,21,5)}ctx.fillStyle='#4c3b2d';ctx.fillRect(665,452,220,40);ctx.fillStyle='#8a6941';ctx.fillRect(657,446,236,10);
 // mechanic + player
 interiorNpcs('garage',0).forEach(n=>drawCharacter(n.model,n.x,n.y,n.dir,n.walk,1,n.name));drawPlayer();
 // signs and animated welding
 v14Panel(24,18,354,46,'rgba(6,9,8,.90)','#8e6b3d',1);ctx.fillStyle='#e4c780';ctx.font='bold 14px monospace';ctx.textAlign='left';ctx.fillText('锈港 · 战车车库 / SERVICE BAY 01',40,40);ctx.fillStyle='#89938b';ctx.font='9px monospace';ctx.fillText('发动机 · 底盘 · 武器 · 装甲 · 战车整备',40,55);
 const t=performance.now()/1000;if(((t*5)|0)%2===0){for(let k=0;k<8;k++){const a=t*8+k*.73,r=8+k*3;ctx.fillStyle=k%2?'#ffcf69':'#f18a3c';ctx.fillRect(706+Math.cos(a)*r,315+Math.sin(a)*r,2,2)}}
}
const v15OldDrawInterior=drawInterior;
drawInterior=function(){if((currentTown?.index??state.townIndex)===0&&state.currentInterior==='garage')return v15DrawGarage();return v15OldDrawInterior()};

// Portrait integration: feathered bust rather than a rectangular poster beside text.
const v15PortraitCanvas=document.createElement('canvas');v15PortraitCanvas.width=340;v15PortraitCanvas.height=250;const v15p=v15PortraitCanvas.getContext('2d');
function v15Bust(key,side='left'){
 const img=PORTRAITS[key];if(!img||!img.complete||!img.naturalWidth)return false;v15p.clearRect(0,0,340,250);v15p.save();v15p.imageSmoothingEnabled=true;
 const sx=0,sy=0,sw=img.naturalWidth,sh=Math.min(img.naturalHeight,img.naturalHeight*.62);v15p.drawImage(img,sx,sy,sw,sh,-20,-48,390,330);
 v15p.globalCompositeOperation='destination-in';const gx=v15p.createLinearGradient(side==='left'?280:60,0,side==='left'?338:2,0);gx.addColorStop(0,'rgba(255,255,255,1)');gx.addColorStop(1,'rgba(255,255,255,0)');v15p.fillStyle=gx;v15p.fillRect(0,0,340,250);const gy=v15p.createLinearGradient(0,110,0,250);gy.addColorStop(0,'rgba(255,255,255,1)');gy.addColorStop(1,'rgba(255,255,255,0)');v15p.fillStyle=gy;v15p.fillRect(0,0,340,250);v15p.restore();
 ctx.save();ctx.globalAlpha=.97;if(side==='left')ctx.drawImage(v15PortraitCanvas,10,276,340,250);else{ctx.translate(W,0);ctx.scale(-1,1);ctx.drawImage(v15PortraitCanvas,10,276,340,250)}ctx.restore();return true;
}
const v15OldDrawDialogue=drawDialogue;
drawDialogue=function(dt){
 if(!dialogue)return;const line=dialogue.lines[dialogue.idx],key=line.portrait;if(!key||!['liuyan','taoyao','lincheng'].includes(key))return v15OldDrawDialogue(dt);
 dialogue.t+=dt;if(dialogue.t>.016&&dialogue.char<line.text.length){dialogue.char++;dialogue.t=0}
 const side=v8SpeakerSide(line);ctx.fillStyle='rgba(4,6,5,.28)';ctx.fillRect(0,0,W,H);v15Bust(key,side);
 const x=side==='left'?265:32,y=358,w=side==='left'?665:665,h=156;v14Panel(x,y,w,h,'rgba(5,8,7,.965)',PORTRAIT_META[key]?.accent||'#b99555',2);
 // small decorative speaker rail
 ctx.fillStyle=PORTRAIT_META[key]?.accent||'#a7824e';ctx.fillRect(x+1,y+1,5,h-2);ctx.fillStyle='#151913';ctx.fillRect(x+24,y-18,150,29);ctx.strokeStyle=PORTRAIT_META[key]?.accent||'#a7824e';ctx.strokeRect(x+24.5,y-17.5,149,28);ctx.fillStyle='#f1d28b';ctx.font='bold 16px "Noto Sans SC",sans-serif';ctx.textAlign='left';ctx.fillText(line.speaker,x+39,y+3);
 ctx.fillStyle='#f1efe7';ctx.font='17px "Noto Sans SC",sans-serif';wrapText(line.text.slice(0,dialogue.char),x+34,y+45,w-67,27);
 const done=dialogue.char>=line.text.length;ctx.fillStyle=done&&Math.floor(performance.now()/330)%2===0?'#f3d884':'#7d796d';ctx.beginPath();ctx.moveTo(x+w-37,y+h-29);ctx.lineTo(x+w-19,y+h-29);ctx.lineTo(x+w-28,y+h-17);ctx.closePath();ctx.fill();ctx.fillStyle='#8c918a';ctx.font='9px monospace';ctx.textAlign='right';ctx.fillText(dialogue.idx===dialogue.lines.length-1?'A 结束':'A 继续',x+w-54,y+h-18);
};

// Iron Hound boss: visual phases + more authored battle composition.
function v15HoundPhase(){if(!battle?.enemy)return 1;const r=battle.enemy.hp/battle.enemy.max;return r>.62?1:r>.30?2:3}
const v15OldEnemyTurn=enemyTurn;
enemyTurn=function(){
 if(!battle||battle.type==='foot'||battle.enemy?.name!=='铁牙猎犬')return v15OldEnemyTurn();
 battle.v15Turn=(battle.v15Turn||0)+1;const phase=v15HoundPhase(),ratio=battle.enemy.hp/battle.enemy.max;
 let mult=phase===1?1:phase===2?1.16:1.34;let dmg=Math.max(1,Math.round(battle.enemy.atk*mult*rnd(.84,1.17)-tankDef()));
 if(phase===2&&battle.v15Turn%3===0){dmg=Math.round(dmg*.72);battle.log+=`  铁牙猎犬扫射履带控制器 -${dmg}（机动受压）`;}
 else if(phase===3&&battle.v15Turn%2===0){dmg=Math.round(dmg*1.28);battle.log+=`  过热炮塔强制齐射 -${dmg}`;}
 else battle.log+=`  铁牙猎犬${phase===1?'短点射':phase===2?'猎杀连射':'过载反击'} -${dmg}`;
 state.tank.hp-=dmg;if(state.tank.hp<=0){state.tank.hp=Math.round(tankMax()*.45);state.player.inTank=false;battle=null;mode='play';state.scene='world';state.fieldId=null;state.fieldReturn=null;state.tank.x=TOWNS[0].x+70;state.tank.y=TOWNS[0].y+70;state.player.x=TOWNS[0].x+25;state.player.y=TOWNS[0].y+70;state.gold=Math.max(0,state.gold-300);sayToast('战车大破，被港务拖车拖回锈港')}
};

const v15OldDrawBattle=drawBattle;
drawBattle=function(){
 if(!battle||battle.type==='foot'||battle.enemy?.name!=='铁牙猎犬')return v15OldDrawBattle();
 const t=performance.now()/1000,phase=v15HoundPhase();
 // sunset customs battlefield
 const sky=ctx.createLinearGradient(0,0,0,330);sky.addColorStop(0,'#57443e');sky.addColorStop(.45,'#9b6847');sky.addColorStop(1,'#352f2b');ctx.fillStyle=sky;ctx.fillRect(0,0,W,360);
 ctx.fillStyle='rgba(245,186,94,.25)';ctx.beginPath();ctx.arc(775,118,58,0,TAU);ctx.fill();
 // ruin silhouettes and gantry
 ctx.fillStyle='#292824';for(let k=0;k<11;k++){const x=k*100-20,h=65+(v14Hash(k,5)%90);ctx.fillRect(x,285-h,68,h);ctx.fillStyle='#1f211e';for(let j=0;j<3;j++)ctx.fillRect(x+10+j*18,296-h,8,14);ctx.fillStyle='#292824'}
 ctx.fillStyle='#252722';ctx.fillRect(0,315,W,45);ctx.fillStyle='#4f4539';ctx.fillRect(0,342,W,198);v15Brick(0,342,W,198,13);
 // customs overhead bridge
 ctx.fillStyle='#242522';ctx.fillRect(130,127,510,20);ctx.fillStyle='#6f5940';ctx.fillRect(138,132,494,6);for(const x of [155,606]){ctx.fillStyle='#292a26';ctx.fillRect(x,144,17,165)}
 ctx.fillStyle='#171a17';ctx.fillRect(284,148,200,36);ctx.strokeStyle='#8a6741';ctx.strokeRect(284.5,148.5,199,35);ctx.fillStyle='#c9a263';ctx.font='bold 12px monospace';ctx.textAlign='center';ctx.fillText('OLD CUSTOMS 07',384,171);
 // wrecks / smoke
 for(const [x,y,s] of [[92,322,.8],[705,322,1],[848,333,.65]]){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#242825';ctx.fillRect(-40,-18,80,28);ctx.fillStyle='#4b392e';ctx.fillRect(-22,-33,44,16);ctx.fillStyle='#111411';ctx.beginPath();ctx.arc(-27,13,12,0,TAU);ctx.arc(27,13,12,0,TAU);ctx.fill();ctx.restore()}
 // player tank left, bigger / grounded
 ctx.save();ctx.translate(190,318);ctx.scale(1.85,1.85);drawTankModel(0,0,0,state.vehicleIndex,1,false);ctx.restore();
 // Hound boss on right - heavier silhouette and damage states
 const ex=725,ey=290;ctx.save();ctx.translate(ex,ey);const bob=Math.sin(t*3)*1.3;ctx.translate(0,bob);ctx.fillStyle='rgba(0,0,0,.33)';ctx.beginPath();ctx.ellipse(0,44,115,22,0,0,TAU);ctx.fill();ctx.fillStyle='#151916';ctx.fillRect(-104,7,208,40);for(let x=-92;x<=74;x+=24){ctx.fillStyle='#5b5e54';ctx.fillRect(x,14,18,24);ctx.fillStyle='#222723';ctx.fillRect(x+3,17,12,18)}ctx.fillStyle=phase===3?'#5b332b':'#554d3e';v15Poly([[-88,-24],[62,-29],[96,-2],[77,28],[-82,28],[-105,4]],ctx.fillStyle,'#181b18',3);ctx.fillStyle='#2a302c';ctx.fillRect(-36,-52,88,39);ctx.strokeStyle='#8c7653';ctx.strokeRect(-35.5,-51.5,87,38);ctx.fillStyle=phase>=2?'#8d342d':'#684838';ctx.fillRect(-8,-60,23,16);ctx.fillStyle='#272b27';ctx.fillRect(10,-56,80,12);ctx.fillStyle='#181b18';ctx.fillRect(80,-59,32,18);ctx.fillStyle='#c44335';ctx.shadowColor='#e64b37';ctx.shadowBlur=phase===3?18:8;ctx.fillRect(-79,-11,9,6);ctx.fillRect(67,-12,9,6);ctx.shadowBlur=0;ctx.fillStyle='#b89b60';ctx.font='bold 8px monospace';ctx.fillText('HOUND-07',0,6);if(phase>=2){ctx.strokeStyle=phase===3?'#f06c45':'#d0a552';ctx.lineWidth=2;ctx.beginPath();ctx.arc(12,-44,33+Math.sin(t*6)*4,0,TAU);ctx.stroke()}ctx.restore();
 // muzzle heat / tracers animated
 if(phase===3){ctx.fillStyle='rgba(239,92,49,.11)';ctx.beginPath();ctx.arc(ex+105,ey-57,44+Math.sin(t*8)*5,0,TAU);ctx.fill()}
 // top boss plate
 v14Panel(28,20,904,89,'rgba(5,7,6,.91)',phase===3?'#b34f35':'#89523d',2);ctx.fillStyle='#f0ce85';ctx.font='bold 20px monospace';ctx.textAlign='left';ctx.fillText('赏金首 · 铁牙猎犬',51,51);ctx.fillStyle='#828a80';ctx.font='9px monospace';ctx.fillText('RUST HOUND / AUTONOMOUS HUNTING VEHICLE',51,68);const px=420,py=47,pw=440;ctx.fillStyle='#321d1a';ctx.fillRect(px,py,pw,16);ctx.fillStyle=phase===3?'#d14f35':'#bd493e';ctx.fillRect(px,py,pw*clamp(battle.enemy.hp/battle.enemy.max,0,1),16);ctx.strokeStyle='#80664e';ctx.strokeRect(px-.5,py-.5,pw+1,17);ctx.fillStyle='#e1d8c5';ctx.font='9px monospace';ctx.textAlign='right';ctx.fillText(`${Math.max(0,Math.round(battle.enemy.hp))} / ${battle.enemy.max}`,860,79);
 // phase indicator
 const phText=phase===1?'PHASE I · 搜索 / 锁定':phase===2?'PHASE II · 猎杀协议': 'PHASE III · 炮塔过载';ctx.fillStyle=phase===3?'#8e3127':phase===2?'#745634':'#39463e';ctx.fillRect(703,83,157,19);ctx.fillStyle='#f0dfb2';ctx.font='bold 8px monospace';ctx.fillText(phText,852,96);
 // command UI
 v14Panel(26,369,908,150,'rgba(5,8,7,.97)','#686f61',2);ctx.fillStyle='#cfd3ca';ctx.font='11px monospace';ctx.textAlign='left';wrapText(battle.log,48,392,838,18);battle.actions.forEach((a,k)=>{const col=k%3,row=Math.floor(k/3),x=48+col*288,y=429+row*42,active=k===battle.sel;ctx.fillStyle=active?'#60482c':'#131814';ctx.fillRect(x,y,264,34);ctx.strokeStyle=active?'#dab76f':'#3b443c';ctx.strokeRect(x+.5,y+.5,263,33);ctx.fillStyle=active?'#fff1bc':'#c7cec5';ctx.font='13px monospace';ctx.fillText(`${active?'▶':' '} ${a}`,x+13,y+22)});
 ctx.fillStyle='#c7b987';ctx.font='10px monospace';ctx.fillText(`破风巡逻车  装甲 ${Math.ceil(state.tank.hp)}/${tankMax()}  ${phase===3?'警告：敌炮塔过热':''}`,48,359);
 if(battle.win){ctx.fillStyle='rgba(6,8,7,.96)';ctx.fillRect(252,171,456,138);ctx.strokeStyle='#cba85d';ctx.lineWidth=2;ctx.strokeRect(253,172,454,136);ctx.fillStyle='#f0cf7a';ctx.font='bold 22px monospace';ctx.textAlign='center';ctx.fillText('赏 金 首 击 破',480,208);ctx.fillStyle='#dad5c6';ctx.font='12px monospace';ctx.fillText('铁牙猎犬 · 自动猎杀协议终止',480,237);ctx.fillStyle='#9f895d';ctx.fillText('战利品：豺狼 75mm 炮 / 核心认证数据',480,260);ctx.fillStyle='#848b83';ctx.font='9px monospace';ctx.fillText('A 结束战斗 · 返回锈港交付',480,286)}
};

// v15 bounty turn-in presentation for Rustport mechanic.
const v15OldTalkNpc=talkNpc;
talkNpc=function(o){
 if(state.townIndex===0&&o.role==='mechanic'&&state.townProgress[0].boss&&!state.townProgress[0].claimed){
   state.townProgress[0].mechanic=true;state.townProgress[0].claimed=true;claimTown(0);state.v15.bountyCeremony=true;
   openDialogue([
    dialogueLine(o.name,'核心认证完成。铁牙猎犬的识别密钥和这台沙狐是同一批军用协议。'),
    dialogueLine('旁白','老技师拉下黄色手柄。车库深处的升降台开始震动，帆布从一辆低矮战车上滑落。'),
    dialogueLine('柳焰','第一张真正的赏金单，第一辆真正属于猎人的战车。别急着高兴——路才刚开始。','liuyan'),
    dialogueLine('系统','获得战车「沙狐 Mk.I」；猎人档案已记录赏金首：铁牙猎犬。')
   ]);saveSilently();return;
 }
 return v15OldTalkNpc(o)
};

// make first-chapter HUD less dominant, more game-like.
const v15OldUpdateHud=updateHud;
updateHud=function(){v15OldUpdateHud();const h=$('topHud');if(h){h.style.minWidth='520px';h.style.maxWidth='66vw'}const hint=$('hint');if(hint)hint.textContent=mode==='play'?'方向移动 · A 互动 / 上下车 · B 菜单':'方向选择 · A 确认 · B 返回'};

saveSilently();
/* === v0.16 asset identity pass: controllable sprites, modular tank bodies, enemy silhouettes === */
const V16_VERSION='0.16.0';
state.v16=Object.assign({assetPass:true,firstSpriteSeen:false},state.v16||{});

const V16_IMG={};
for(const [k,src] of Object.entries({
  chars:'assets/legacy/asset-04.png',
  tanks:'assets/legacy/asset-05.png',
  enemies:'assets/legacy/asset-06.png',
  parts:'assets/legacy/asset-07.png'
})) { const im=new Image(); im.src=src; V16_IMG[k]=im; }
const V16_CHAR_ROW={hunter:0,liuyan:1,lincheng:2,taoyao:3};
const V16_PART_COL={main:0,sub:1,se:2,engine:3,cunit:4,armor:5};
function v16Ready(k){const im=V16_IMG[k];return !!(im&&im.complete&&im.naturalWidth)}
function v16Dir4(a){const c=Math.cos(a),s=Math.sin(a);if(Math.abs(c)>Math.abs(s))return c>=0?2:1;return s>=0?0:3}
function v16EnemyRow(name=''){
 const n=String(name);
 if(/摩托|掠夺|车手|逃亡/.test(n))return 0;
 if(/侦察车|巡逻机|巡逻车|路障|装甲拖车|拦路车/.test(n))return 1;
 if(/猎犬|履带机|守卫机|警戒车|水管破坏/.test(n))return 2;
 if(/钢甲虫|装甲虫|盐蚀/.test(n))return 3;
 if(/广播|无人机|共振|塞壬/.test(n))return 4;
 if(/蜈蚣|钻岩|轨道守卫|装载机/.test(n))return 5;
 if(/竞技|火力车|试车/.test(n))return 6;
 if(/夜鹫|高射|风场|叶片/.test(n))return 7;
 if(/收割|冻原|雪地|低温/.test(n))return 8;
 if(/喷火|炼城|焦化|火蜥/.test(n))return 9;
 if(/磁轨|赤寡妇|高架|火控塔/.test(n))return 10;
 return 11;
}

// Real controllable 4-direction, 3-frame character sprite sheet for the four core characters.
const v16OldDrawCharacter=drawCharacter;
drawCharacter=function(modelKey,x,y,dir,walk=0,scale=1,label=''){
 const row=V16_CHAR_ROW[modelKey];
 if(row===undefined||!v16Ready('chars'))return v16OldDrawCharacter(modelKey,x,y,dir,walk,scale,label);
 const p=screenPos(x,y),d=v16Dir4(dir),moving=Math.abs(walk)>0.001,frame=moving?Math.floor((walk*7)%3):1;
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(Math.round(p.x),Math.round(p.y));ctx.scale(scale,scale);
 ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(0,20,14,5,0,0,TAU);ctx.fill();
 ctx.drawImage(V16_IMG.chars,(d*3+frame)*48,row*48,48,48,-24,-31,48,48);
 ctx.restore();
 if(label){ctx.fillStyle='#f4dfaa';ctx.font='10px "Noto Sans SC",sans-serif';ctx.textAlign='center';ctx.fillText(label,p.x,p.y-37)}
};

// Distinct base body for every tank; modules remain separate visual layers so equipment can change silhouette.
const v16OldDrawTankModel=drawTankModel;
drawTankModel=function(x,y,dir,idx,scale=1,screen=true){
 if(!v16Ready('tanks'))return v16OldDrawTankModel(x,y,dir,idx,scale,screen);
 const p=screen?screenPos(x,y):{x,y},row=clamp(idx|0,0,10),t=performance.now()/1000;
 ctx.save();ctx.translate(Math.round(p.x),Math.round(p.y));ctx.rotate(dir);ctx.scale(scale,scale);ctx.imageSmoothingEnabled=false;
 // tread / road shadow and dust make the sprite feel grounded
 ctx.fillStyle='rgba(0,0,0,.27)';ctx.beginPath();ctx.ellipse(-2,17,38,12,0,0,TAU);ctx.fill();
 ctx.drawImage(V16_IMG.tanks,0,row*64,96,64,-48,-32,96,64);
 const main=equipped('main'),sub=equipped('sub'),se=equipped('se'),armor=equipped('armor'),cu=equipped('cunit');
 const barrel=12+main.rarity*3+(state.tank.upgrades.main||0)*2;
 ctx.fillStyle='#c7b997';ctx.fillRect(13,-2,31+barrel,4);ctx.fillStyle='#565b54';ctx.fillRect(20,-1,29+barrel,2);
 if((sub.rarity||0)>0||state.tank.upgrades.sub>0){ctx.fillStyle='#767b70';ctx.fillRect(9,-12,26,3);ctx.fillRect(9,9,26,3)}
 if((se.rarity||0)>0||state.tank.upgrades.se>0){ctx.fillStyle='#3e4640';for(const yy of [-19,15]){ctx.fillRect(-13,yy,25,6);for(let q=0;q<3;q++){ctx.fillStyle='#9b593e';ctx.fillRect(6+q*5,yy+1,3,4);ctx.fillStyle='#3e4640'}}}
 if((armor.rarity||0)>0||state.tank.upgrades.armor>0){ctx.fillStyle='rgba(199,190,156,.72)';ctx.fillRect(-35,-25,44,4);ctx.fillRect(-35,21,44,4);ctx.fillStyle='#625e51';for(let q=-28;q<6;q+=11){ctx.fillRect(q,-24,2,3);ctx.fillRect(q,22,2,3)}}
 if((cu.rarity||0)>0){ctx.strokeStyle='#dfcd7e';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-8,-18);ctx.lineTo(-16,-31);ctx.stroke();ctx.fillStyle='#e1c968';ctx.fillRect(-18,-33,5,4)}
 // running exhaust / tread flecks only while player is driving this vehicle
 if(screen&&state.player.inTank&&idx===state.vehicleIndex){for(let q=0;q<3;q++){const a=(t*7+q*1.7)%4;ctx.fillStyle=`rgba(155,145,125,${.18-a*.035})`;ctx.fillRect(-46-a*4,-5+q*5,3+a*2,2+a)}}
 ctx.restore();
};

function v16DrawEnemySprite(name,x,y,scale=1,alpha=1){
 if(!v16Ready('enemies'))return false;const r=v16EnemyRow(name);ctx.save();ctx.globalAlpha=alpha;ctx.imageSmoothingEnabled=false;ctx.drawImage(V16_IMG.enemies,0,r*96,128,96,x-64*scale,y-48*scale,128*scale,96*scale);ctx.restore();return true;
}
const v16OldDrawBossSprite=drawBossSprite;
drawBossSprite=function(x,y,name){if(v16DrawEnemySprite(name,x,y,1.12))return;return v16OldDrawBossSprite(x,y,name)};

// Field enemies now carry their own silhouettes instead of the same red rectangle.
const v16OldFieldEnemy=v10DrawFieldEnemy;
v10DrawFieldEnemy=function(e){
 if(!v16Ready('enemies'))return v16OldFieldEnemy(e);const p=fieldToScreen(e.x,e.y),cleared=!!state.world.fieldCleared[`${state.fieldId}:${e.id}`];
 if(cleared){ctx.save();ctx.globalAlpha=.35;v16DrawEnemySprite(e.name,p.x,p.y,.42,.45);ctx.restore();ctx.strokeStyle='#4b5049';ctx.beginPath();ctx.moveTo(p.x-24,p.y+15);ctx.lineTo(p.x+24,p.y+15);ctx.stroke();return}
 v16DrawEnemySprite(e.name,p.x,p.y,.48,1);ctx.fillStyle='#dd6953';ctx.fillRect(p.x-2,p.y-29,4,4);
};

// Rebuild on-foot battle around actual player/enemy sprites.
const v16OldDrawBattle=drawBattle;
drawBattle=function(){
 if(!battle||battle.type!=='foot')return v16OldDrawBattle();
 const fd=v10Field(),t=performance.now()/1000;ctx.fillStyle=fd?.palette?.[0]||'#313432';ctx.fillRect(0,0,W,H);
 // authored dungeon strip with foreground / light pools
 ctx.fillStyle='#181d1b';ctx.fillRect(0,235,W,140);for(let x=0;x<W;x+=96){ctx.fillStyle=(x/96|0)%2?'#2e3531':'#343a35';ctx.fillRect(x,250,86,110);ctx.strokeStyle='rgba(210,196,160,.07)';ctx.strokeRect(x+.5,250.5,85,109)}
 for(const lx of [105,470,815]){const g=ctx.createRadialGradient(lx,240,4,lx,240,130);g.addColorStop(0,'rgba(242,202,117,.14)');g.addColorStop(1,'rgba(242,202,117,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(lx,240,130,0,TAU);ctx.fill()}
 // player hunter and current enemy mod
 const bob=Math.sin(t*3)*1.2;ctx.save();ctx.translate(185,304+bob);ctx.scale(2.35,2.35);ctx.drawImage(V16_IMG.chars,(2*3+1)*48,0,48,48,-24,-31,48,48);ctx.restore();v16DrawEnemySprite(battle.enemy.name,730,292,1.45,1);
 v14Panel(28,22,904,85,'rgba(5,8,7,.92)','#745a3d',2);ctx.fillStyle='#efd08a';ctx.font='bold 19px "Noto Sans SC",sans-serif';ctx.textAlign='left';ctx.fillText(battle.enemy.name,52,53);ctx.fillStyle='#42241f';ctx.fillRect(390,48,485,15);ctx.fillStyle='#c65045';ctx.fillRect(390,48,485*clamp(battle.enemy.hp/battle.enemy.max,0,1),15);ctx.fillStyle='#d8d3c7';ctx.font='10px monospace';ctx.textAlign='right';ctx.fillText(`${Math.max(0,Math.round(battle.enemy.hp))}/${battle.enemy.max}`,875,80);
 v14Panel(24,368,912,151,'rgba(5,8,7,.97)','#667065',2);ctx.fillStyle='#cfd5cc';ctx.font='11px "Noto Sans SC",sans-serif';ctx.textAlign='left';wrapText(battle.log,47,392,848,18);battle.actions.forEach((a,k)=>{const x=46+k*177,y=425,active=k===battle.sel;ctx.fillStyle=active?'#634c2e':'#182019';ctx.fillRect(x,y,158,58);ctx.strokeStyle=active?'#d3ae63':'#3d463f';ctx.strokeRect(x+.5,y+.5,157,57);ctx.fillStyle=active?'#fff0bc':'#d3d9d0';ctx.font='bold 13px sans-serif';ctx.fillText(`${active?'▶ ':''}${a}`,x+13,y+22);ctx.fillStyle='#7f8a81';ctx.font='9px sans-serif';const sub=k===0?`${v11Weapon().name} / ${v11PersonAtk()}`:k===1?`近战突击`:k===2?`急救剂 ${state.person.medkits}`:k===3?'防御姿态':'脱离战斗';ctx.fillText(sub,x+13,y+42)});ctx.fillStyle='#dcca9c';ctx.font='10px monospace';ctx.fillText(`猎人 Lv.${state.person.level}  HP ${Math.max(0,state.person.hp)}/${v11PersonMax()}  DEF ${v11PersonDef()}`,47,354);
};

// Add visual inventory icons to tank part comparison UI.
const v16OldDrawMenu=drawMenu;
drawMenu=function(){
 v16OldDrawMenu();if(!menu||!v16Ready('parts'))return;
 if(menu.sub?.title==='零件仓库'){
   const owned=state.inventory.parts.map(findPart).filter(Boolean),p=owned[menu.sel];if(!p)return;const col=V16_PART_COL[p.type];if(col===undefined)return;
   const x=585,y=138;ctx.fillStyle='#0f1512';ctx.fillRect(x-18,y-18,82,82);ctx.strokeStyle='#8d7144';ctx.strokeRect(x-17.5,y-17.5,81,81);ctx.imageSmoothingEnabled=false;ctx.drawImage(V16_IMG.parts,col*32,0,32,32,x,y,46,46);ctx.fillStyle='#e1c57d';ctx.font='bold 12px sans-serif';ctx.textAlign='left';ctx.fillText(PART_LABEL[p.type]||p.type,x-4,y+65)
 }
};

// Companion archive now demonstrates that portraits are UI display art, while gameplay uses sprites.
const v16OldOpenCompanionMenu=openCompanionMenu;
openCompanionMenu=function(){v16OldOpenCompanionMenu();if(menu?.sub)menu.sub.v16Companion=true};
const v16DrawMenu2=drawMenu;
drawMenu=function(){v16DrawMenu2();if(!menu?.sub?.v16Companion)return;const keys=['liuyan','taoyao','lincheng'],k=keys[clamp(menu.sel,0,2)],meta=PORTRAIT_META[k],img=PORTRAITS[k];if(!meta||!img?.complete||!img.naturalWidth)return;ctx.save();ctx.beginPath();ctx.rect(542,126,280,310);ctx.clip();ctx.imageSmoothingEnabled=true;ctx.drawImage(img,0,0,img.naturalWidth,img.naturalHeight*.72,520,102,320,360);const g=ctx.createLinearGradient(600,100,835,100);g.addColorStop(0,'rgba(7,9,8,0)');g.addColorStop(1,'rgba(7,9,8,.78)');ctx.fillStyle=g;ctx.fillRect(540,112,300,330);ctx.restore();ctx.imageSmoothingEnabled=false;ctx.fillStyle='#e6ca83';ctx.font='bold 15px sans-serif';ctx.textAlign='left';ctx.fillText(meta.name,566,420);ctx.fillStyle='#869087';ctx.font='9px monospace';ctx.fillText('PORTRAIT / EQUIPMENT DISPLAY',566,438)};

// First time the main character appears in the prologue, explain visual identity without interrupting play later.
const v16OldUpdateHud=updateHud;
updateHud=function(){v16OldUpdateHud();if(!state.v16.firstSpriteSeen&&state.v12&&!state.player.inTank&&mode==='play'){state.v16.firstSpriteSeen=true;sayToast('角色像素模型已启用：方向 / 行走 / 同伴外观独立',2.8);saveSilently()}};

saveSilently();
/* === v0.17 motion & combat presentation pass === */
const V17_VERSION='0.17.0';
state.v17=Object.assign({motionPass:true,turretDir:state.tank?.dir||0,seenMotionTip:false},state.v17||{});
const V17_IMG={};
for(const [k,src] of Object.entries({
 chars:'assets/legacy/asset-08.png',
 actions:'assets/legacy/asset-09.png',
 chassis:'assets/legacy/asset-10.png',
 turrets:'assets/legacy/asset-11.png',
 enemies:'assets/legacy/asset-12.png',
 hound:'assets/legacy/asset-13.png'
})) { const im=new Image(); im.src=src; V17_IMG[k]=im; }
const V17_CHAR_ROW={hunter:0,liuyan:1,lincheng:2,taoyao:3};
const V17_ACTION={shoot:0,melee:1,hit:2,down:3};
const V17_FX=[];
let V17_PLAYER_ACT={type:null,t0:0,dur:0},V17_TANK_RECOIL=0,V17_LAST_TANK_T=performance.now();
function v17Ready(k){const im=V17_IMG[k];return !!(im&&im.complete&&im.naturalWidth)}
function v17AngleDiff(a,b){return Math.atan2(Math.sin(b-a),Math.cos(b-a))}
function v17DirChar(a){const A=[Math.PI/2,3*Math.PI/4,Math.PI,-3*Math.PI/4,-Math.PI/2,-Math.PI/4,0,Math.PI/4];let best=0,bd=99;for(let i=0;i<8;i++){const d=Math.abs(v17AngleDiff(a,A[i]));if(d<bd){bd=d;best=i}}return best}
function v17DirTank(a){return ((Math.round(-a/(Math.PI/4))%8)+8)%8}
function v17MoveActive(){return !!(keys.up||keys.down||keys.left||keys.right)}
function v17Action(type,dur=.42){V17_PLAYER_ACT={type,t0:performance.now()/1000,dur}}
function v17AddFx(o){V17_FX.push(Object.assign({t:0,dur:.45},o))}
function v17Muzzle(slot='main',enemy=false){
 const from=enemy?{x:745,y:280}:{x:300,y:298},to=enemy?{x:250,y:302}:{x:710,y:278};
 v17AddFx({type:'tracer',slot,from,to,dur:slot==='se'?.7:.38});
 if(!enemy){V17_TANK_RECOIL=1;v17AddFx({type:'muzzle',x:from.x,y:from.y,dur:.22})}else v17AddFx({type:'muzzle',x:from.x,y:from.y,dur:.22,enemy:true});
}
function v17HitFx(x=710,y=280,big=false){v17AddFx({type:'explosion',x,y,dur:big?.72:.46,big})}
function v17UpdateFx(dt){for(const f of V17_FX)f.t+=dt;for(let i=V17_FX.length-1;i>=0;i--)if(V17_FX[i].t>=V17_FX[i].dur)V17_FX.splice(i,1);V17_TANK_RECOIL=Math.max(0,V17_TANK_RECOIL-dt*5.5)}
function v17DrawFx(){
 for(const f of V17_FX){const q=clamp(f.t/f.dur,0,1);ctx.save();
  if(f.type==='tracer'){
   const p=Math.min(1,q*1.35),x=f.from.x+(f.to.x-f.from.x)*p,y=f.from.y+(f.to.y-f.from.y)*p;
   ctx.strokeStyle=f.slot==='se'?'rgba(255,139,69,.88)':'rgba(244,213,127,.92)';ctx.lineWidth=f.slot==='main'?3:2;ctx.beginPath();ctx.moveTo(f.from.x+(f.to.x-f.from.x)*Math.max(0,p-.16),f.from.y+(f.to.y-f.from.y)*Math.max(0,p-.16));ctx.lineTo(x,y);ctx.stroke();
   if(q>.58&&!f.hit){f.hit=true;v17HitFx(f.to.x,f.to.y,f.slot==='se')}
  }else if(f.type==='muzzle'){
   const r=4+q*24;ctx.globalAlpha=1-q;ctx.fillStyle=f.enemy?'#f05d3c':'#ffd98a';ctx.beginPath();ctx.arc(f.x,f.y,r,0,TAU);ctx.fill();ctx.strokeStyle='#fff2c1';ctx.beginPath();ctx.moveTo(f.x-r*1.4,f.y);ctx.lineTo(f.x+r*1.4,f.y);ctx.moveTo(f.x,f.y-r);ctx.lineTo(f.x,f.y+r);ctx.stroke();
  }else if(f.type==='explosion'){
   const r=(f.big?18:12)+q*(f.big?56:36);ctx.globalAlpha=1-q;for(let n=0;n<3;n++){ctx.fillStyle=n===0?'#ffdf82':n===1?'#e96d39':'#5d4436';ctx.beginPath();ctx.arc(f.x+Math.sin(n*2.1+q*8)*r*.25,f.y+Math.cos(n*1.7+q*7)*r*.18,r*(.42-.08*n),0,TAU);ctx.fill()}for(let n=0;n<7;n++){const a=n*.89+q*2,rr=r*.8;ctx.fillStyle='#f0a34d';ctx.fillRect(f.x+Math.cos(a)*rr,f.y+Math.sin(a)*rr,3,3)}
  }
  ctx.restore();
 }
}

// Eight-direction controllable characters: 4-frame walk cycle and readable silhouettes.
const v17OldDrawCharacter=drawCharacter;
drawCharacter=function(modelKey,x,y,dir,walk=0,scale=1,label=''){
 const row=V17_CHAR_ROW[modelKey];if(row===undefined||!v17Ready('chars'))return v17OldDrawCharacter(modelKey,x,y,dir,walk,scale,label);
 const p=screenPos(x,y),di=v17DirChar(dir),moving=Math.abs(walk)>0.001&&(v17MoveActive()||modelKey!=='hunter'),fr=moving?Math.floor((walk*8)%4):1;
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(Math.round(p.x),Math.round(p.y));ctx.scale(scale,scale);ctx.fillStyle='rgba(0,0,0,.27)';ctx.beginPath();ctx.ellipse(0,23,16,5,0,0,TAU);ctx.fill();ctx.drawImage(V17_IMG.chars,(di*4+fr)*64,row*64,64,64,-32,-41,64,64);ctx.restore();
 if(label){ctx.fillStyle='rgba(7,8,7,.78)';ctx.fillRect(p.x-34,p.y-48,68,14);ctx.fillStyle='#f2e3b4';ctx.font='9px monospace';ctx.textAlign='center';ctx.fillText(label,p.x,p.y-38)}
};
function v17DrawActionChar(modelKey,x,y,dir,type,progress,scale=1){
 const row=V17_CHAR_ROW[modelKey]??0,ai=V17_ACTION[type]??0,di=v17DirChar(dir),fr=clamp(Math.floor(progress*4),0,3);
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(x,y);ctx.scale(scale,scale);ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(0,23,16,5,0,0,TAU);ctx.fill();ctx.drawImage(V17_IMG.actions,((ai*32)+(di*4+fr))*64,row*64,64,64,-32,-41,64,64);ctx.restore();
}

// Chassis and turret are now separate layers. The turret lags the hull slightly in exploration.
const v17OldDrawTankModel=drawTankModel;
drawTankModel=function(x,y,dir,idx,scale=1,screen=true){
 if(!v17Ready('chassis')||!v17Ready('turrets'))return v17OldDrawTankModel(x,y,dir,idx,scale,screen);
 const p=screen?screenPos(x,y):{x,y},moving=screen&&state.player.inTank&&v17MoveActive()&&mode==='play',tf=moving?(Math.floor(performance.now()/95)%2):0,ci=v17DirTank(dir),now=performance.now(),dt=Math.min(.05,(now-V17_LAST_TANK_T)/1000);V17_LAST_TANK_T=now;
 const desired=(mode==='battle')?0:dir;state.v17.turretDir=(state.v17.turretDir??dir)+v17AngleDiff(state.v17.turretDir??dir,desired)*Math.min(1,dt*6.5);const ti=v17DirTank(state.v17.turretDir);
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(Math.round(p.x),Math.round(p.y));ctx.scale(scale,scale);
 ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,27,48,12,0,0,TAU);ctx.fill();
 ctx.drawImage(V17_IMG.chassis,(tf*8+ci)*112,idx*80,112,80,-56,-40,112,80);
 // chassis-mounted equipment modules rotate with hull
 ctx.save();ctx.rotate(dir);const se=equipped('se'),armor=equipped('armor'),cu=equipped('cunit');if((se.rarity||0)>0||state.tank.upgrades.se>0){ctx.fillStyle='#39423d';ctx.fillRect(-20,-29,28,7);ctx.fillRect(-20,22,28,7);for(const yy of [-27,24])for(let q=0;q<3;q++){ctx.fillStyle='#a45e3e';ctx.fillRect(-1+q*6,yy+1,4,4)}}if((armor.rarity||0)>0||state.tank.upgrades.armor>0){ctx.fillStyle='rgba(190,186,159,.7)';ctx.fillRect(-37,-29,51,4);ctx.fillRect(-37,25,51,4)}if((cu.rarity||0)>0){ctx.strokeStyle='#dcc578';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-12,-20);ctx.lineTo(-21,-34);ctx.stroke();ctx.fillStyle='#dbc471';ctx.fillRect(-23,-36,6,4)}ctx.restore();
 // turret sprite independent of hull; recoil shifts the entire turret backwards
 const rx=-Math.cos(state.v17.turretDir)*V17_TANK_RECOIL*5,ry=-Math.sin(state.v17.turretDir)*V17_TANK_RECOIL*5;ctx.drawImage(V17_IMG.turrets,ti*112,idx*80,112,80,-56+rx,-40+ry,112,80);
 if(moving){for(let n=0;n<4;n++){const q=(performance.now()/130+n*1.3)%5;ctx.fillStyle=`rgba(159,142,111,${.24-q*.035})`;ctx.fillRect(-48-q*4,-13+n*8,4+q*1.5,2+q*.4)}}
 const hp=state.tank.hp/Math.max(1,tankMax());if(hp<.45){for(let n=0;n<(hp<.2?4:2);n++){const tt=performance.now()/650+n*1.7;ctx.globalAlpha=.18+(n%2)*.05;ctx.fillStyle=hp<.2?'#5c5149':'#727169';ctx.beginPath();ctx.arc(-26+Math.sin(tt)*8,-32-(tt%2)*15,6+(tt%1)*7,0,TAU);ctx.fill()}ctx.globalAlpha=1}
 ctx.restore();
};

// Animated enemy MOD atlas for field / battle reuse.
function v17DrawEnemy(name,x,y,scale=1,alpha=1){if(!v17Ready('enemies'))return false;const r=v16EnemyRow(name),fr=Math.floor(performance.now()/180)%3;ctx.save();ctx.globalAlpha=alpha;ctx.imageSmoothingEnabled=false;ctx.drawImage(V17_IMG.enemies,fr*160,r*120,160,120,x-80*scale,y-60*scale,160*scale,120*scale);ctx.restore();return true}
drawBossSprite=function(x,y,name){if(v17DrawEnemy(name,x,y,1.1,1))return;return v16OldDrawBossSprite(x,y,name)};
v10DrawFieldEnemy=function(e){const p=fieldToScreen(e.x,e.y),cleared=!!state.world.fieldCleared[`${state.fieldId}:${e.id}`];if(!v17Ready('enemies'))return v16OldFieldEnemy(e);v17DrawEnemy(e.name,p.x,p.y,.42,cleared?.28:1);if(cleared){ctx.strokeStyle='#4b5049';ctx.beginPath();ctx.moveTo(p.x-25,p.y+19);ctx.lineTo(p.x+25,p.y+19);ctx.stroke()}else{ctx.fillStyle='#dc6751';ctx.fillRect(p.x-2,p.y-35,4,4)}};

// Battle visual events do not change combat math; they only expose hits, recoil and enemy counter-fire.
const v17OldEnemyTurn=enemyTurn;
enemyTurn=function(){
 if(battle&&battle.type!=='foot'){v17Muzzle('main',true);setTimeout(()=>{},0)}
 const before=battle?.type==='foot'?state.person.hp:state.tank.hp;const r=v17OldEnemyTurn();if(battle){const after=battle.type==='foot'?state.person.hp:state.tank.hp;if(after<before)v17HitFx(battle.type==='foot'?185:250,300,false)}return r
};
const v17OldBattleConfirm=battleConfirm;
battleConfirm=function(){
 if(!battle)return v17OldBattleConfirm();const foot=battle.type==='foot',sel=battle.sel,before=battle.enemy.hp;let slot=sel<3?['main','sub','se'][sel]:'main';if(foot&&sel===0)v17Action('shoot',.48);else if(foot&&sel===1)v17Action('melee',.5);else if(!foot&&sel<3)v17Muzzle(slot,false);
 const r=v17OldBattleConfirm();if(battle&&battle.enemy.hp<before)v17HitFx(foot?710:720,foot?290:280,(!foot&&slot==='se'));return r
};

// Foot battle: action sprites and enemy animation are real game assets, not placeholder blocks.
const v17OldDrawBattle=drawBattle;
function v17DrawFootBattle(){
 const fd=v10Field(),t=performance.now()/1000;ctx.fillStyle=fd?.palette?.[0]||'#303632';ctx.fillRect(0,0,W,H);const g=ctx.createLinearGradient(0,125,0,380);g.addColorStop(0,'#1d2421');g.addColorStop(1,'#30342f');ctx.fillStyle=g;ctx.fillRect(0,115,W,280);
 for(let x=0;x<W;x+=96){ctx.fillStyle=(x/96|0)%2?'#303731':'#353b35';ctx.fillRect(x,245,86,126);ctx.strokeStyle='rgba(210,196,160,.07)';ctx.strokeRect(x+.5,245.5,85,125)}
 for(const lx of [120,480,825]){const gg=ctx.createRadialGradient(lx,225,4,lx,225,150);gg.addColorStop(0,'rgba(242,202,117,.15)');gg.addColorStop(1,'rgba(242,202,117,0)');ctx.fillStyle=gg;ctx.beginPath();ctx.arc(lx,225,150,0,TAU);ctx.fill()}
 const elapsed=t-V17_PLAYER_ACT.t0,active=V17_PLAYER_ACT.type&&elapsed<V17_PLAYER_ACT.dur;if(active)v17DrawActionChar('hunter',185,309,0,V17_PLAYER_ACT.type,elapsed/V17_PLAYER_ACT.dur,2.45);else{const di=6;ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(185,309);ctx.scale(2.45,2.45);ctx.drawImage(V17_IMG.chars,(di*4+1)*64,0,64,64,-32,-41,64,64);ctx.restore()}
 v17DrawEnemy(battle.enemy.name,725,290,1.32,1);
 v14Panel(28,22,904,85,'rgba(5,8,7,.93)','#745a3d',2);ctx.fillStyle='#efd08a';ctx.font='bold 19px "Noto Sans SC",sans-serif';ctx.textAlign='left';ctx.fillText(battle.enemy.name,52,53);ctx.fillStyle='#42241f';ctx.fillRect(390,48,485,15);ctx.fillStyle='#c65045';ctx.fillRect(390,48,485*clamp(battle.enemy.hp/battle.enemy.max,0,1),15);ctx.fillStyle='#d8d3c7';ctx.font='10px monospace';ctx.textAlign='right';ctx.fillText(`${Math.max(0,Math.round(battle.enemy.hp))}/${battle.enemy.max}`,875,80);
 v14Panel(24,368,912,151,'rgba(5,8,7,.97)','#667065',2);ctx.fillStyle='#cfd5cc';ctx.font='11px "Noto Sans SC",sans-serif';ctx.textAlign='left';wrapText(battle.log,47,392,848,18);battle.actions.forEach((a,k)=>{const x=46+k*177,y=425,act=k===battle.sel;ctx.fillStyle=act?'#634c2e':'#182019';ctx.fillRect(x,y,158,58);ctx.strokeStyle=act?'#d3ae63':'#3d463f';ctx.strokeRect(x+.5,y+.5,157,57);ctx.fillStyle=act?'#fff0bc':'#d3d9d0';ctx.font='bold 13px sans-serif';ctx.fillText(`${act?'▶ ':''}${a}`,x+13,y+22);ctx.fillStyle='#7f8a81';ctx.font='9px sans-serif';const sub=k===0?`${v11Weapon().name} / ${v11PersonAtk()}`:k===1?'近战突击':k===2?`急救剂 ${state.person.medkits}`:k===3?'防御姿态':'脱离战斗';ctx.fillText(sub,x+13,y+42)});ctx.fillStyle='#dcca9c';ctx.font='10px monospace';ctx.fillText(`猎人 Lv.${state.person.level}  HP ${Math.max(0,state.person.hp)}/${v11PersonMax()}  DEF ${v11PersonDef()}`,47,354)
}
function v17DrawHoundBattle(){
 const t=performance.now()/1000,phase=battle.win?4:v15HoundPhase();const sky=ctx.createLinearGradient(0,0,0,340);sky.addColorStop(0,'#57443e');sky.addColorStop(.42,'#a26a45');sky.addColorStop(1,'#302c29');ctx.fillStyle=sky;ctx.fillRect(0,0,W,365);ctx.fillStyle='rgba(247,187,91,.24)';ctx.beginPath();ctx.arc(782,110,55,0,TAU);ctx.fill();ctx.fillStyle='#292824';for(let k=0;k<11;k++){const x=k*100-20,h=60+(v14Hash(k,5)%90);ctx.fillRect(x,292-h,70,h)}ctx.fillStyle='#4c4339';ctx.fillRect(0,345,W,195);v15Brick(0,345,W,195,13);
 ctx.fillStyle='#232521';ctx.fillRect(130,132,510,18);for(const x of [155,606])ctx.fillRect(x,149,17,164);ctx.fillStyle='#151815';ctx.fillRect(280,153,208,34);ctx.strokeStyle='#8a6741';ctx.strokeRect(280.5,153.5,207,33);ctx.fillStyle='#c9a263';ctx.font='bold 12px monospace';ctx.textAlign='center';ctx.fillText('OLD CUSTOMS 07',384,175);
 // player's animated modular tank
 ctx.save();ctx.translate(190,315);ctx.scale(1.72,1.72);drawTankModel(0,0,0,state.vehicleIndex,1,false);ctx.restore();
 // dedicated multi-state boss MOD
 if(v17Ready('hound')){const st=phase===4?3:phase-1;ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(724,283+Math.sin(t*2.6)*1.5);ctx.drawImage(V17_IMG.hound,st*260,0,260,170,-155,-90,310,202);ctx.restore()}
 v14Panel(28,20,904,89,'rgba(5,7,6,.92)',phase>=3?'#b34f35':'#89523d',2);ctx.fillStyle='#f0ce85';ctx.font='bold 20px monospace';ctx.textAlign='left';ctx.fillText('赏金首 · 铁牙猎犬',51,51);ctx.fillStyle='#828a80';ctx.font='9px monospace';ctx.fillText('RUST HOUND / AUTONOMOUS HUNTING VEHICLE',51,68);const px=420,py=47,pw=440;ctx.fillStyle='#321d1a';ctx.fillRect(px,py,pw,16);ctx.fillStyle=phase>=3?'#d14f35':'#bd493e';ctx.fillRect(px,py,pw*clamp(battle.enemy.hp/battle.enemy.max,0,1),16);ctx.strokeStyle='#80664e';ctx.strokeRect(px-.5,py-.5,pw+1,17);ctx.fillStyle='#e1d8c5';ctx.font='9px monospace';ctx.textAlign='right';ctx.fillText(`${Math.max(0,Math.round(battle.enemy.hp))} / ${battle.enemy.max}`,860,79);const ph=phase===1?'PHASE I · 搜索 / 锁定':phase===2?'PHASE II · 猎杀协议':phase===3?'PHASE III · 炮塔过载':'TARGET DESTROYED';ctx.fillStyle=phase>=3?'#8e3127':phase===2?'#745634':'#39463e';ctx.fillRect(703,83,157,19);ctx.fillStyle='#f0dfb2';ctx.font='bold 8px monospace';ctx.fillText(ph,852,96);
 v14Panel(26,369,908,150,'rgba(5,8,7,.97)','#686f61',2);ctx.fillStyle='#cfd3ca';ctx.font='11px monospace';ctx.textAlign='left';wrapText(battle.log,48,392,838,18);battle.actions.forEach((a,k)=>{const col=k%3,row=Math.floor(k/3),x=48+col*288,y=429+row*42,act=k===battle.sel;ctx.fillStyle=act?'#60482c':'#131814';ctx.fillRect(x,y,264,34);ctx.strokeStyle=act?'#dab76f':'#3b443c';ctx.strokeRect(x+.5,y+.5,263,33);ctx.fillStyle=act?'#fff1bc':'#c7cec5';ctx.font='13px monospace';ctx.fillText(`${act?'▶':' '} ${a}`,x+13,y+22)});ctx.fillStyle='#c7b987';ctx.font='10px monospace';ctx.fillText(`${tankName()}  装甲 ${Math.ceil(state.tank.hp)}/${tankMax()}  ${phase===3?'警告：敌炮塔过热':''}`,48,359);
 if(battle.win){ctx.fillStyle='rgba(6,8,7,.96)';ctx.fillRect(252,171,456,138);ctx.strokeStyle='#cba85d';ctx.lineWidth=2;ctx.strokeRect(253,172,454,136);ctx.fillStyle='#f0cf7a';ctx.font='bold 22px monospace';ctx.textAlign='center';ctx.fillText('赏 金 首 击 破',480,208);ctx.fillStyle='#dad5c6';ctx.font='12px monospace';ctx.fillText('铁牙猎犬 · 自动猎杀协议终止',480,237);ctx.fillStyle='#9f895d';ctx.fillText('战利品：豺狼 75mm 炮 / 核心认证数据',480,260);ctx.fillStyle='#848b83';ctx.font='9px monospace';ctx.fillText('A 结束战斗 · 返回锈港交付',480,286)}
}
drawBattle=function(){if(!battle)return;if(battle.type==='foot')return v17DrawFootBattle();if(battle.enemy?.name==='铁牙猎犬')return v17DrawHoundBattle();return v17OldDrawBattle()};

// Dialogue: important characters are represented by a scene-integrated sprite cutout, while portraits stay in equipment/archive UI.
const v17OldDrawDialogue=drawDialogue;
drawDialogue=function(dt){
 if(!dialogue)return;const line=dialogue.lines[dialogue.idx],key=line.portrait;if(!key||V17_CHAR_ROW[key]===undefined||!v17Ready('chars'))return v17OldDrawDialogue(dt);
 dialogue.t+=dt;if(dialogue.t>.016&&dialogue.char<line.text.length){dialogue.char++;dialogue.t=0}
 ctx.fillStyle='rgba(4,6,5,.30)';ctx.fillRect(0,0,W,H);const side=v8SpeakerSide(line),sx=side==='left'?155:805,flip=side==='left'?1:-1;ctx.save();ctx.translate(sx,332);ctx.scale(flip*4.0,4.0);const row=V17_CHAR_ROW[key],di=side==='left'?7:1;ctx.imageSmoothingEnabled=false;ctx.drawImage(V17_IMG.chars,(di*4+1)*64,row*64,64,64,-32,-41,64,64);ctx.restore();
 const fade=ctx.createLinearGradient(side==='left'?260:700,0,side==='left'?360:600,0);fade.addColorStop(0,'rgba(6,8,7,0)');fade.addColorStop(1,'rgba(6,8,7,.7)');ctx.fillStyle=fade;ctx.fillRect(side==='left'?235:560,210,170,180);
 const x=side==='left'?260:35,y=360,w=665,h=154;v14Panel(x,y,w,h,'rgba(5,8,7,.97)',PORTRAIT_META[key]?.accent||'#b99555',2);ctx.fillStyle='#151913';ctx.fillRect(x+24,y-18,150,29);ctx.strokeStyle=PORTRAIT_META[key]?.accent||'#a7824e';ctx.strokeRect(x+24.5,y-17.5,149,28);ctx.fillStyle='#f1d28b';ctx.font='bold 16px "Noto Sans SC",sans-serif';ctx.textAlign='left';ctx.fillText(line.speaker,x+39,y+3);ctx.fillStyle='#f1efe7';ctx.font='17px "Noto Sans SC",sans-serif';wrapText(line.text.slice(0,dialogue.char),x+34,y+45,w-67,27);const done=dialogue.char>=line.text.length;ctx.fillStyle=done&&Math.floor(performance.now()/330)%2===0?'#f3d884':'#7d796d';ctx.beginPath();ctx.moveTo(x+w-37,y+h-29);ctx.lineTo(x+w-19,y+h-29);ctx.lineTo(x+w-28,y+h-17);ctx.closePath();ctx.fill();ctx.fillStyle='#8c918a';ctx.font='9px monospace';ctx.textAlign='right';ctx.fillText(dialogue.idx===dialogue.lines.length-1?'A 结束':'A 继续',x+w-54,y+h-18)
};

// FX overlay runs after the scene has rendered, preserving HUD/menu legibility.
const v17OldRender=render;
render=function(dt){v17OldRender(dt);if(mode==='battle'){v17UpdateFx(dt);v17DrawFx()}else{V17_FX.length=0;V17_TANK_RECOIL=0}}

const v17OldUpdateHud=updateHud;
updateHud=function(){v17OldUpdateHud();if(!state.v17.seenMotionTip&&state.v12&&mode==='play'){state.v17.seenMotionTip=true;sayToast('v0.23：2128 灰烬纪元 Canon / 三大势力 / 旧历人 / 零号协议',2.6);saveSilently()}}
saveSilently();
/* === v0.18 world density & content identity pass === */
const V18_VERSION='0.18.0';
state.v18=Object.assign({spots:{},bossesSeen:{},densityPass:true},state.v18||{});
const V18_IMG={};
for(const [k,src] of Object.entries({npc:'assets/legacy/asset-14.png',props:'assets/legacy/asset-15.png',boss:'assets/legacy/asset-16.png'})){const im=new Image();im.src=src;V18_IMG[k]=im}
function v18Ready(k){const im=V18_IMG[k];return !!(im&&im.complete&&im.naturalWidth)}
const V18_NPC_ROWS={v18_dock:0,v18_guard:1,v18_merchant:2,v18_medic:3,v18_mechanic:4,v18_miner:5,v18_bartender:6,v18_scav:7};
const V18_BOSS_ROWS={'铁牙猎犬':0,'盐壳钢甲虫':1,'塞壬九号':2,'轨吞机械蜈蚣':3,'碎骨王':4,'夜鹫':5,'白色收割者':6,'烬暴君':7,'赤寡妇·原型':8,'利维坦-零':9};
const V18_BOSS_PHASES=[
 ['巡猎扫描','猎杀协议','炮塔过载'],['甲壳封闭','盐蚀喷射','钻角冲锋'],['低频共鸣','信号锁定','塞壬过载'],['潜行掘进','节肢围杀','核心暴走'],['竞技姿态','碎骨冲撞','冠军狂热'],['高空盘旋','俯冲猎杀','风暴过载'],['冰层巡猎','热源锁定','白夜收割'],['火焰封锁','阀门爆燃','炼狱模式'],['磁轨索敌','蜘蛛围锁','轨炮超载'],['堡垒展开','零号协议','灭绝指令']
];

// More actual civic fabric in the first three towns.
const V18_EXTRA_BUILDINGS={
 0:[{id:'house',name:'渔工合住屋',x:535,y:708,w:150,h:115,style:'house'},{id:'house',name:'旧海关宿舍',x:745,y:700,w:150,h:115,style:'house'}],
 1:[{id:'warehouse',name:'水务备件库',x:620,y:315,w:175,h:120,style:'warehouse2'},{id:'house',name:'风塔工人宿舍',x:1110,y:360,w:145,h:120,style:'house'}],
 2:[{id:'house',name:'井口公寓',x:1090,y:385,w:145,h:125,style:'house'},{id:'house',name:'旧广告工宿舍',x:380,y:350,w:145,h:120,style:'house'}]
};
for(const [i,list] of Object.entries(V18_EXTRA_BUILDINGS))for(const b of list)if(!V9_LAYOUTS[i].some(x=>x.name===b.name))V9_LAYOUTS[i].push(b);

// NPC profession sprites replace anonymous palette-swaps.
const v18OldDrawCharacter=drawCharacter;
drawCharacter=function(modelKey,x,y,dir,walk=0,scale=1,label=''){
 const row=V18_NPC_ROWS[modelKey];if(row===undefined||!v18Ready('npc'))return v18OldDrawCharacter(modelKey,x,y,dir,walk,scale,label);
 const p=screenPos(x,y),d=v16Dir4(dir),moving=Math.abs(walk)>.001,fr=moving?Math.floor((walk*6)%3):1;
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(Math.round(p.x),Math.round(p.y));ctx.scale(scale,scale);ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(0,19,13,4,0,0,TAU);ctx.fill();ctx.drawImage(V18_IMG.npc,(d*3+fr)*48,row*48,48,48,-24,-31,48,48);ctx.restore();
 if(label){ctx.fillStyle='#e7d7a9';ctx.font='9px monospace';ctx.textAlign='center';ctx.fillText(label,p.x,p.y-35)}
};
const v18OldAmbientNpcData=ambientNpcData;
ambientNpcData=function(i){if(i>2)return v18OldAmbientNpcData(i);const sets=[
 [['码头搬运工','v18_dock'],['海堤巡逻员','v18_guard'],['鱼货商','v18_merchant'],['废料拾荒客','v18_scav'],['车库学徒','v18_mechanic'],['老港工','v18_dock'],['夜巡猎人','v18_guard'],['行脚商','v18_merchant']],
 [['盐井送水工','v18_dock'],['风塔守卫','v18_guard'],['水票商','v18_merchant'],['盐地拾荒者','v18_scav'],['泵站技工','v18_mechanic'],['老管工','v18_miner'],['沙路护卫','v18_guard'],['行商','v18_merchant']],
 [['广播检修员','v18_mechanic'],['井口保安','v18_guard'],['夜市商贩','v18_merchant'],['广告拆解工','v18_scav'],['诊所护工','v18_medic'],['电缆工','v18_mechanic'],['深井巡逻员','v18_guard'],['数据贩子','v18_merchant']]
 ][i];return sets.map((a,k)=>({id:`v18_${i}_${k}`,name:a[0],model:a[1],route:ambientRoute(i,k),speed:19+(k%4)*4,phase:k*.9}))};
for(const i of [0,1,2])delete npcRuntime[i];
const v18OldInteriorNpcs=interiorNpcs;
interiorNpcs=function(type,i){const arr=v18OldInteriorNpcs(type,i).map(n=>({...n}));for(const n of arr){if(['liuyan','taoyao','lincheng'].includes(n.model))continue;if(n.role==='mechanic')n.model='v18_mechanic';else if(n.role==='shopkeeper'||n.role==='quartermaster')n.model='v18_merchant';else if(n.role==='nurse')n.model='v18_medic';else if(n.role==='board'||n.role==='innkeeper')n.model='v18_bartender';else if(n.role==='resident'||n.role==='ambient')n.model='v18_scav';else n.model='v18_guard'}return arr};

// Themed prop atlas: dense environmental storytelling instead of empty road grids.
const V18_PROP_PLACEMENT={
 0:[[0,70,120,1],[1,1260,112,1],[2,75,420,.9],[3,455,432,.72],[4,1050,430,.8],[5,132,805,.85],[6,630,100,.9],[7,1220,720,.78],[8,820,455,.72],[9,505,330,.75],[3,895,420,.62],[9,1040,805,.7],[5,345,440,.7],[8,1180,350,.65]],
 1:[[0,700,92,1],[1,610,460,.9],[2,1115,730,.8],[3,440,430,.72],[4,720,465,.8],[5,1230,730,.85],[6,310,425,.8],[7,905,420,.72],[8,660,750,.7],[9,120,790,.85],[3,825,745,.62],[6,1130,440,.65]],
 2:[[0,700,185,.9],[1,1260,130,.9],[2,490,445,.78],[3,1160,730,.72],[4,700,455,.86],[5,420,760,.72],[6,1030,430,.9],[7,295,430,.72],[8,760,745,.72],[9,1240,475,.7],[0,600,750,.65],[2,890,430,.68]]
};
function v18DrawProp(theme,idx,x,y,scale=1){if(!v18Ready('props'))return;const p=townToScreen(x,y);ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(V18_IMG.props,idx*96,theme*96,96,96,p.x-48*scale,p.y-65*scale,96*scale,96*scale);ctx.restore()}
function v18DrawDistrictLabels(i){const labels=i===0?[['海堤码头',150,105],['猎人街',250,475],['中央维修区',930,460],['港务宿舍',700,815]]:i===1?[['风塔广场',700,110],['水站街',560,455],['盐民居住区',1000,755],['车库坡道',240,450]]:[['井口环街',700,205],['夜市巷',245,465],['医疗街',655,455],['广播旧区',1080,455]];ctx.save();ctx.font='9px monospace';ctx.textAlign='center';for(const [name,x,y] of labels){const p=townToScreen(x,y);ctx.fillStyle='rgba(6,8,7,.68)';ctx.fillRect(p.x-42,p.y-12,84,18);ctx.fillStyle='#b9ad8c';ctx.fillText(name,p.x,p.y+1)}ctx.restore()}
function v18DrawNpcActivity(n){const p=townToScreen(n.x,n.y),t=performance.now()/1000;ctx.save();if(n.model==='v18_mechanic'&&Math.sin(t*4+n.phase)> .65){ctx.fillStyle='#f2b248';for(let k=0;k<3;k++)ctx.fillRect(p.x+11+k*3,p.y+8-k*4,2,2)}else if(n.model==='v18_dock'){ctx.fillStyle='#7a5939';ctx.fillRect(p.x-8,p.y+3,16,10);ctx.strokeStyle='#b69058';ctx.strokeRect(p.x-7.5,p.y+3.5,15,9)}else if(n.model==='v18_guard'){ctx.strokeStyle='rgba(240,218,150,.24)';ctx.beginPath();ctx.moveTo(p.x+9,p.y+2);ctx.lineTo(p.x+38,p.y+10);ctx.stroke()}ctx.restore()}

const v18OldDrawTown=drawTown;
drawTown=function(){const i=currentTown.index;if(i>2)return v18OldDrawTown();const pal=V8_TOWN_PALETTES[i];ctx.fillStyle=pal.ground;ctx.fillRect(0,0,W,H);
 // textured ground and district-specific material patches
 for(let x=0;x<1400;x+=24)for(let y=0;y<900;y+=24){const s=townToScreen(x,y),h=v9hash(x>>4,y>>4);if(s.x<-30||s.y<-30||s.x>W+30||s.y>H+30)continue;ctx.globalAlpha=.06;ctx.fillStyle=(h&1)?'#fff':'#000';ctx.fillRect(s.x+(h%8),s.y+((h>>>3)%8),2+(h%3),1);ctx.globalAlpha=1}
 v9TownFeature(i);v9TownRoads(i);for(const b of V9_DECOR_BUILDINGS[i])v9DrawDecorBuilding(b,i);townBuildings(i).forEach(drawBuilding);v8DrawLandmarks(i);
 for(const q of V18_PROP_PLACEMENT[i]||[])v18DrawProp(i,q[0],q[1],q[2],q[3]);v18DrawDistrictLabels(i);
 const npcs=getAmbientNpcs(i);npcs.forEach(n=>drawCharacter(n.model,n.x,n.y,n.dir,n.walk,1,n.name));npcs.forEach(v18DrawNpcActivity);
 drawTank();if(!state.player.inTank)drawPartyFollowers();drawPlayer();const gate=townToScreen(700,850);ctx.fillStyle='#302e28';ctx.fillRect(gate.x-76,gate.y-7,152,14);ctx.fillStyle='#9e875c';ctx.font='10px monospace';ctx.textAlign='center';ctx.fillText('荒原出口',gate.x,gate.y-13);drawPrompt();drawAmbientLighting()};

// First three room types gain specific environmental layers.
const v18OldDrawInterior=drawInterior;
drawInterior=function(){v18OldDrawInterior();if(state.townIndex>2)return;const type=state.currentInterior,t=performance.now()/1000;ctx.save();
 if(type==='garage'){ctx.globalAlpha=.18;ctx.strokeStyle=state.townIndex===2?'#68d2d4':'#e0a95a';for(let x=130;x<850;x+=120){ctx.beginPath();ctx.moveTo(x,65);ctx.lineTo(x+25,65);ctx.stroke()}ctx.globalAlpha=1;ctx.fillStyle='rgba(245,174,72,.5)';if(Math.sin(t*8)>0.7){ctx.fillRect(720,295,3,3);ctx.fillRect(727,287,2,2);ctx.fillRect(734,301,2,2)}}
 if(type==='tavern'){const g=ctx.createLinearGradient(0,80,0,470);g.addColorStop(0,'rgba(238,151,72,.06)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(45,45,W-90,H-90)}
 if(type==='clinic'&&state.townIndex===2){ctx.strokeStyle='rgba(91,205,214,.22)';for(let y=90;y<440;y+=44){ctx.beginPath();ctx.moveTo(90,y);ctx.lineTo(860,y);ctx.stroke()}}
 ctx.restore()};

// Environmental story spots: small authored interactions, not quest kiosks.
const V18_SPOTS={
 0:[{id:'r_net',name:'破损拖网',x:92,y:430,lines:[['旁白','拖网里缠着被切断的机械线缆。断口很整齐，不像自然磨损。'],['柳焰','铁牙猎犬不是乱开火。它在清理这条旧运输线。']],reward:2},{id:'r_mem',name:'港工纪念牌',x:690,y:805,lines:[['旁白','牌上有七个名字，最后一个日期停在十三年前。'],['旁白','有人用新焊条在下面补了一句：别让自动机器替我们决定谁该活。']],reward:1},{id:'r_crate',name:'漂上海堤的军箱',x:1260,y:350,lines:[['旁白','箱体上的军徽已经被盐蚀掉，只剩内部的缓冲泡棉。'],['系统','找到可用废料。']],reward:5}],
 1:[{id:'s_pipe',name:'裂开的输水管',x:720,y:465,lines:[['旁白','钢管内侧不是锈蚀，而是密集的啃咬痕。'],['桃夭','钢甲虫在找某种矿物。它把镇子的水管当成矿脉了。']],reward:3},{id:'s_tag',name:'旧泵站铭牌',x:610,y:460,lines:[['旁白','铭牌显示这套泵站曾属于军方“地下维护群”。'],['旁白','维护群的设备编号，与钢甲虫外壳上的残号相同。']],reward:2},{id:'s_cache',name:'埋沙工具箱',x:1115,y:730,lines:[['旁白','半截工具箱露在盐沙外。里面还剩两个密封轴承。'],['系统','获得废料。']],reward:5}],
 2:[{id:'n_ad',name:'失控霓虹牌',x:1030,y:430,lines:[['旁白','广告牌每隔十一秒闪一次同样的蓝紫色波形。'],['林澄','不是广告程序。它在跟地下信号同步。']],reward:2},{id:'n_bed',name:'临时病床',x:655,y:455,lines:[['旁白','床头记录写着：无外伤，持续昏睡，听觉皮层异常活跃。'],['林澄','塞壬九号不是“吵醒”人，它是在把大脑锁进一个循环。']],reward:2},{id:'n_chip',name:'烧毁接收器',x:295,y:430,lines:[['旁白','接收器的滤波芯片被烧穿，但缓存里还留着一段坐标。'],['系统','回收到可用电子废料。']],reward:5}]
};
function v18DrawSpots(i){for(const s of V18_SPOTS[i]||[]){const p=townToScreen(s.x,s.y),done=!!state.v18.spots[s.id];ctx.save();ctx.globalAlpha=done?.35:1;ctx.fillStyle=done?'#6b685c':'#d5b35d';ctx.beginPath();ctx.arc(p.x,p.y-18,4,0,TAU);ctx.fill();if(!done&&Math.sin(performance.now()/350)>0){ctx.strokeStyle='rgba(225,192,104,.35)';ctx.beginPath();ctx.arc(p.x,p.y-18,9,0,TAU);ctx.stroke()}ctx.restore()}}
const v18OldRender=render;
render=function(dt){v18OldRender(dt);if(mode==='play'&&state.scene==='town'&&state.townIndex<3)v18DrawSpots(state.townIndex)};
const v18OldNearest=nearestInteractable;
nearestInteractable=function(){const base=v18OldNearest();if(base)return base;if(state.scene==='town'&&state.townIndex<3){const f=state.player.inTank?state.tank:state.player;for(const s of V18_SPOTS[state.townIndex]||[])if(dist(f.x,f.y,s.x,s.y)<48)return{type:'v18spot',spot:s,name:s.name}}return null};
const v18OldInteract=interact;
interact=function(o){if(o?.type==='v18spot'){const s=o.spot,first=!state.v18.spots[s.id];if(first){state.v18.spots[s.id]=true;state.scrap+=s.reward||0;saveSilently()}const lines=s.lines.map(a=>Array.isArray(a)?a:["旁白",String(a)]);if(first&&(s.reward||0)>0)lines.push(['系统',`获得废料 +${s.reward}。`]);return openDialogue(lines)}return v18OldInteract(o)};

// Add rare local encounters so regions are not just three reskinned stat blocks.
V10_ENEMIES[0].push({name:'港湾装甲拖车',hp:310,atk:29,reward:185},{name:'锈壳重机枪车',hp:275,atk:34,reward:180});
V10_ENEMIES[1].push({name:'盐蚀装甲虫',hp:360,atk:33,reward:210},{name:'水管破坏机',hp:330,atk:37,reward:215});
V10_ENEMIES[2].push({name:'共振侦察无人机',hp:305,atk:40,reward:235},{name:'广播干扰车',hp:385,atk:36,reward:250});

// Every bounty now has a dedicated battle silhouette and a three-stage presentation.
function v18BossPhase(){if(!battle)return 0;if(battle.win)return 3;const r=battle.enemy.hp/battle.enemy.max;return r>.66?0:r>.32?1:2}
function v18DrawBossAsset(i,x,y,scale=1,st=v18BossPhase()){if(!v18Ready('boss'))return false;ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(V18_IMG.boss,clamp(st,0,3)*260,i*170,260,170,x-130*scale,y-85*scale,260*scale,170*scale);ctx.restore();return true}
const v18OldDrawBossSprite=drawBossSprite;
drawBossSprite=function(x,y,name){const r=V18_BOSS_ROWS[name];if(r!==undefined&&v18DrawBossAsset(r,x,y,1.08))return;return v18OldDrawBossSprite(x,y,name)};
function v18BossBackdrop(i){const sky=['#655047','#b79762','#4d425e','#4a443d','#643b34','#43514f','#819399','#60432e','#414b5b','#303638'][i],ground=['#55483b','#a58a55','#34313d','#3d3831','#56382f','#35403d','#73858a','#493827','#353b43','#262c2f'][i];const g=ctx.createLinearGradient(0,0,0,360);g.addColorStop(0,sky);g.addColorStop(1,'#242624');ctx.fillStyle=g;ctx.fillRect(0,0,W,365);ctx.fillStyle=ground;ctx.fillRect(0,330,W,210);for(let k=0;k<12;k++){const h=35+(v14Hash(i,k)%90),x=k*92-20;ctx.fillStyle='rgba(27,29,27,.75)';ctx.fillRect(x,330-h,58,h)}
 if(i===1){ctx.fillStyle='rgba(231,218,174,.22)';for(let k=0;k<8;k++)ctx.fillRect(k*137,290+(k%3)*9,100,3)}
 if(i===2){ctx.strokeStyle='rgba(92,219,225,.22)';for(let k=0;k<4;k++){ctx.beginPath();ctx.arc(720,195,60+k*24,0,TAU);ctx.stroke()}}
}
function v18DrawBossBattle(){const i=clamp(battle.enemy.town??state.townIndex,0,9),st=v18BossPhase(),t=performance.now()/1000;v18BossBackdrop(i);ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(190,346,94,18,0,0,TAU);ctx.fill();drawTankModel(190,316,0,state.vehicleIndex,1.65,false);v18DrawBossAsset(i,720,274+Math.sin(t*2.5)*2,1.18,st);
 v14Panel(28,20,904,91,'rgba(5,7,6,.93)',st>=2?'#b34f35':'#7b6544',2);ctx.fillStyle='#f0ce85';ctx.font='bold 20px monospace';ctx.textAlign='left';ctx.fillText(`赏金首 · ${battle.enemy.name}`,51,51);ctx.fillStyle='#7f897e';ctx.font='9px monospace';ctx.fillText(`BOUNTY TARGET / REGION ${String(i+1).padStart(2,'0')}`,51,69);const px=420,py=47,pw=440;ctx.fillStyle='#321d1a';ctx.fillRect(px,py,pw,16);ctx.fillStyle=st>=2?'#d34e36':'#b64d40';ctx.fillRect(px,py,pw*clamp(battle.enemy.hp/battle.enemy.max,0,1),16);ctx.strokeStyle='#80664e';ctx.strokeRect(px-.5,py-.5,pw+1,17);ctx.fillStyle='#e1d8c5';ctx.font='9px monospace';ctx.textAlign='right';ctx.fillText(`${Math.max(0,Math.round(battle.enemy.hp))} / ${battle.enemy.max}`,860,79);ctx.fillStyle=st>=2?'#8f3127':st===1?'#75552f':'#39463e';ctx.fillRect(690,83,170,19);ctx.fillStyle='#f0dfb2';ctx.font='bold 8px monospace';ctx.fillText(st===3?'TARGET DESTROYED':`PHASE ${st+1} · ${V18_BOSS_PHASES[i][Math.min(st,2)]}`,852,96);
 v14Panel(26,369,908,150,'rgba(5,8,7,.97)','#686f61',2);ctx.fillStyle='#cfd3ca';ctx.font='11px monospace';ctx.textAlign='left';wrapText(battle.log,48,392,838,18);battle.actions.forEach((a,k)=>{const col=k%3,row=Math.floor(k/3),x=48+col*288,y=429+row*42,act=k===battle.sel;ctx.fillStyle=act?'#60482c':'#131814';ctx.fillRect(x,y,264,34);ctx.strokeStyle=act?'#dab76f':'#3b443c';ctx.strokeRect(x+.5,y+.5,263,33);ctx.fillStyle=act?'#fff1bc':'#c7cec5';ctx.font='13px monospace';ctx.fillText(`${act?'▶':' '} ${a}`,x+13,y+22)});ctx.fillStyle='#c7b987';ctx.font='10px monospace';ctx.fillText(`${tankName()}  装甲 ${Math.ceil(state.tank.hp)}/${tankMax()}  ${st>=2?'警告：赏金首进入极限模式':''}`,48,359);
 if(battle.win){ctx.fillStyle='rgba(6,8,7,.96)';ctx.fillRect(252,171,456,138);ctx.strokeStyle='#cba85d';ctx.lineWidth=2;ctx.strokeRect(253,172,454,136);ctx.fillStyle='#f0cf7a';ctx.font='bold 22px monospace';ctx.textAlign='center';ctx.fillText('赏 金 首 击 破',480,208);ctx.fillStyle='#dad5c6';ctx.font='12px monospace';ctx.fillText(`${battle.enemy.name} · 威胁解除`,480,237);ctx.fillStyle='#9f895d';ctx.fillText(`赏金 ${battle.enemy.reward}G · 专属核心已回收`,480,260);ctx.fillStyle='#848b83';ctx.font='9px monospace';ctx.fillText('A 结束战斗 · 返回城镇交付',480,286)}}
const v18OldDrawBattle=drawBattle;
drawBattle=function(){if(battle?.enemy?.boss&&battle.enemy.name!=='铁牙猎犬')return v18DrawBossBattle();return v18OldDrawBattle()};

// Boss phases have a small mechanical consequence, not only a different label.
const v18OldEnemyTurn=enemyTurn;
enemyTurn=function(){if(!battle?.enemy?.boss)return v18OldEnemyTurn();const i=clamp(battle.enemy.town??state.townIndex,0,9),st=v18BossPhase(),old=battle.enemy.atk;battle.turn=(battle.turn||0)+1;battle.enemy.atk=Math.round(old*(st===2?1.22:st===1?1.10:1));const r=v18OldEnemyTurn();if(battle){battle.enemy.atk=old;if(battle.turn%3===0&&!battle.win)battle.log+=`  [${V18_BOSS_PHASES[i][Math.min(st,2)]}]`}return r};

// Debug-only screenshot routes; ignored in normal play.
(function(){try{const q=new URLSearchParams(location.search).get('debug');if(!q)return;setTimeout(()=>{if(q==='rustport'||q==='saltwind'||q==='neonwell'){const i={rustport:0,saltwind:1,neonwell:2}[q];state.scene='town';state.townIndex=i;state.unlocked=Math.max(state.unlocked,i+1);currentTown={...TOWNS[i],index:i};state.player.inTank=false;state.player.x=700;state.player.y=470;state.tank.x=790;state.tank.y=500;mode='play';updateHud()}else if(/^boss[1-9]$/.test(q)){const i=Number(q.slice(4));state.townIndex=i;state.player.inTank=true;startBattle({name:TOWNS[i].boss,hp:BOSS_STATS[i].hp,atk:BOSS_STATS[i].atk,boss:true,reward:BOSS_STATS[i].bounty,town:i});battle.enemy.hp=Math.round(battle.enemy.max*.26)}},120)}catch(e){}})();
saveSilently();
/* === v0.19 soul, memory & lived-in world pass === */
const V19_VERSION='0.19.0';
state.v19=Object.assign({
  trust:{liuyan:0,taoyao:0,lincheng:0},
  memories:{},
  scenes:{},
  radioIndex:0,
  lastRadioDistance:state.world?.distance||0,
  aftermath:{},
  keepsake:false,
  townLife:true
},state.v19||{});
state.v19.trust=Object.assign({liuyan:0,taoyao:0,lincheng:0},state.v19.trust||{});
state.v19.memories=state.v19.memories||{};state.v19.scenes=state.v19.scenes||{};state.v19.aftermath=state.v19.aftermath||{};

const V19_MEMORY_DEF={
 origin:{title:'第一次把发动机点着',text:'港北封存场里，破风巡逻车咳了两声才真正醒来。那是你第一次拥有“能把自己带回来”的东西。'},
 hunter:{title:'猎人登记',text:'公会终端把你的身份从“居民”改成了“荒原猎人”。柳焰没有祝贺，只提醒你：没人保证猎人每次都能回来。'},
 liuyanNight:{title:'锈港的第二杯',text:'柳焰第一次谈起自己没能带回来的同伴。她说猎人不是因为不怕死才上路，而是因为有人得把路重新接起来。'},
 rustBoss:{title:'没有炮声的夜晚',text:'铁牙猎犬停机后，锈港的海堤第一次整夜没有响起短促的三连警报。第二天，运输车重新出港。'},
 taoyaoNight:{title:'修不好的东西',text:'桃夭承认自己喜欢修旧机器，是因为机器坏了会告诉你哪里坏了；人不会。'},
 saltBoss:{title:'水重新流动',text:'盐风站旧泵组重新启动。镇民没有欢呼，只是默默把水桶排成了很长的一列。'},
 linchengNight:{title:'记住病人的名字',text:'林澄说她不喜欢把伤员叫“床号”。在荒原上，名字是一个人还没有被灾难变成数字的证明。'},
 neonBoss:{title:'终于睡着的人',text:'塞壬九号停止广播后，诊所里第一次有人在没有镇静剂的情况下真正睡着。'}
};
function v19Memory(id){if(!state.v19.memories[id]){state.v19.memories[id]=true;saveSilently();sayToast(`旅途记忆：${V19_MEMORY_DEF[id]?.title||id}`,2.1)}}
function v19Trust(key,n=1){state.v19.trust[key]=Math.max(0,(state.v19.trust[key]||0)+n);saveSilently()}
function v19TrustLabel(key){const n=state.v19.trust[key]||0;return n>=4?'生死之交':n>=3?'信赖':n>=2?'默契':n>=1?'熟悉':'同行'}
function v19WhenPlay(fn,tries=30){if(mode==='play')return fn();if(tries>0)setTimeout(()=>v19WhenPlay(fn,tries-1),120)}

// Preserve the emotional milestones already earned in older saves.
if(state.v12?.starterRepaired)v19Memory('origin');
if(state.v12?.originComplete)v19Memory('hunter');
if(state.townProgress?.[0]?.claimed)v19Memory('rustBoss');
if(state.townProgress?.[1]?.claimed)v19Memory('saltBoss');
if(state.townProgress?.[2]?.claimed)v19Memory('neonBoss');

// Recurring, named townspeople. The player meets the same people before and after a crisis.
const V19_NAMED=[
 [
  ['老张','v18_dock'],['梅姨','v18_merchant'],['程安','v18_guard'],['何叔','v18_mechanic'],['阿舟','v18_scav'],['魏伯','v18_dock'],['秋岚','v18_guard'],['梁七','v18_merchant']
 ],[
  ['牧叔','v18_dock'],['伊娜','v18_guard'],['罗婶','v18_merchant'],['小韩','v18_scav'],['岑师傅','v18_mechanic'],['魏岩','v18_miner'],['阿哲','v18_guard'],['宋商','v18_merchant']
 ],[
  ['周工','v18_mechanic'],['秦队','v18_guard'],['阿澄','v18_merchant'],['陆桥','v18_scav'],['白护士','v18_medic'],['肖电工','v18_mechanic'],['老费','v18_guard'],['七码','v18_merchant']
 ]
];
const v19OldAmbientNpcData=ambientNpcData;
ambientNpcData=function(i){if(i>2)return v19OldAmbientNpcData(i);const base=v19OldAmbientNpcData(i);return base.map((n,k)=>({...n,id:`v19_${i}_${k}`,name:V19_NAMED[i][k][0],model:V19_NAMED[i][k][1]}))};
for(const i of [0,1,2])delete npcRuntime[i];

const V19_TOWNSPEOPLE={
 0:{
  '老张':{pre:[['老张','以前这条海堤一天能过二十多辆货车。现在我一听见警报，就先数还有几个人没回来。']],post:[['老张','今天我又把旧装卸表挂出来了。不是因为货多，是想看看它还能不能重新写满。'],['旁白','他把一枚磨平的黄铜货签塞进你的手里。上面还能看见“北堤 07”。']]},
  '梅姨':{pre:[['梅姨','鱼还是会来，潮水也还是会涨。只有人越来越不敢沿海堤走。']],post:[['梅姨','今早有人从东边送来新鲜盐鱼。三个月了，这是第一次有人敢走完整条路。']]},
  '程安':{pre:[['程安','三连警报响的时候，别逞英雄。四十秒，足够你关门，不够你和那台车讲道理。']],post:[['程安','我把三连警报改成单响了。不是警戒，是给进港车队打招呼。听着顺耳多了。']]},
  '何叔':{pre:[['何叔','车坏了可以换零件。人被吓坏了，没人知道该换什么。']],post:[['何叔','老技师让我别告诉你：他昨晚把沙狐擦了三遍。嘴上嫌你，手倒挺诚实。']]},
  '阿舟':{pre:[['阿舟','我在烧毁的运输车里捡过一只没坏的水杯。一直没敢拿回家。']],post:[['阿舟','那只水杯我还回去了。驾驶员的妹妹认得杯底的划痕。她没哭，只说“谢谢”。']]}
 },
 1:{
  '牧叔':{pre:[['牧叔','盐风站的人不怕渴，怕的是不知道明天水还会不会来。']],post:[['牧叔','泵声一响，所有人都没说话。我们只是站着听了很久。']]},
  '罗婶':{pre:[['罗婶','一张水票可以买水，也可以买一晚安心。最近后一样更贵。']],post:[['罗婶','水票今天跌价了。好事。说明水又只是水了。']]},
  '岑师傅':{pre:[['岑师傅','钢甲虫把管线啃得像骨头。它不是饿，是在找东西。']],post:[['岑师傅','我留了一块它的甲壳。不是纪念——拿来垫工作台，正合适。']]}
 },
 2:{
  '周工':{pre:[['周工','这座城以前嫌霓虹太亮。现在一到夜里，谁都不敢把灯关全。']],post:[['周工','我终于把广播塔的备用频道还给音乐台了。昨晚有人投诉太吵，我听着挺高兴。']]},
  '白护士':{pre:[['白护士','最难受的是他们看起来像睡着了，可你怎么叫都叫不醒。']],post:[['白护士','昨晚三床打呼噜吵得我没睡。第一次觉得打呼噜也挺好听。']]},
  '七码':{pre:[['七码','数据可以买命，也能要命。塞壬九号最值钱的东西不是核心，是它知道谁听过什么。']],post:[['七码','那批昏睡记录我全删了。别这么看我——不是每份数据都该卖。']]}
 }
};
const v19OldTalkAmbient=talkAmbient;
talkAmbient=function(n){const i=state.townIndex,book=V19_TOWNSPEOPLE[i]?.[n.name];if(!book)return v19OldTalkAmbient(n);const done=!!state.townProgress[i]?.claimed,lines=(done?book.post:book.pre)||book.pre;openDialogue(lines);if(done&&n.name==='老张')v19Memory('rustBoss');saveSilently()};

// Human-scale scenes: companions reveal themselves when the player is not chasing a marker.
const V19_NIGHT_SCENES={
 0:{id:'night_rust',key:'liuyan',memory:'liuyanNight',lines:[
  ['旁白','酒馆快打烊了。老板把最后一盏灯调暗，外面的海浪声反而更清楚。'],
  ['柳焰','我第一次接赏金的时候，比你现在还急。总觉得跑得快一点，就能把所有人带回来。'],
  ['柳焰','后来我才知道，有些名字会留在路上。猎人能做的不是忘掉他们，是别让下一条路也断在那里。'],
  ['旁白','她把杯子推远，没有再喝。']
 ]},
 1:{id:'night_salt',key:'taoyao',memory:'taoyaoNight',lines:[
  ['旁白','风塔的低鸣隔着墙传进来。桃夭把一个拆坏的轴承在桌上滚来滚去。'],
  ['桃夭','机器挺好的。坏哪里，它会直接告诉你。轴承响、油压掉、温度高。'],
  ['桃夭','人就麻烦多了。明明快撑不住，还会说“没事”。所以我还是比较会修机器。'],
  ['桃夭','……不过你们几个，我可以慢慢学。别得意。']
 ]},
 2:{id:'night_neon',key:'lincheng',memory:'linchengNight',lines:[
  ['旁白','诊所夜班刚交接。林澄在酒馆角落重新抄一张病人名单。'],
  ['林澄','他们总问我为什么还要写名字。仪器上不是都有编号吗。'],
  ['林澄','因为编号告诉你该处理哪张床，名字提醒你那张床上躺的是谁。'],
  ['林澄','荒原最容易做的事，就是把人慢慢变成数字。']
 ]}
};
function v19TryNightScene(i){const sc=V19_NIGHT_SCENES[i];if(!sc||state.v19.scenes[sc.id])return;const has=sc.key==='liuyan'?state.party.liuyan:sc.key==='taoyao'?state.party.taoyao:state.party.lincheng;if(!has)return;const h=state.time;if(!(h>=18||h<4))return;state.v19.scenes[sc.id]=true;v19Trust(sc.key,1);v19Memory(sc.memory);saveSilently();openDialogue(sc.lines)}
const v19OldEnterInterior=enterInterior;
enterInterior=function(type){const i=state.townIndex;v19OldEnterInterior(type);if(type==='tavern'&&i<3)setTimeout(()=>v19WhenPlay(()=>v19TryNightScene(i)),420);if(type==='garage'&&i===0&&state.v12?.originComplete&&!state.v19.keepsake){setTimeout(()=>v19WhenPlay(()=>{if(state.v19.keepsake)return;state.v19.keepsake=true;v19Trust('liuyan',1);saveSilently();openDialogue([['老技师','等一下。破风仪表台底下有个空孔。原来挂港务钥匙牌的。'],['旁白','老技师从抽屉里摸出一枚磨花的黄铜齿轮，用红线绑在仪表盘下面。'],['老技师','别嫌土。车里总得有样东西提醒你：修好它，是为了开回来。'],['柳焰','收着吧。老头很少送东西。']])}),500)}};

// A small travel radio layer: companions comment on distance and the world, not just quests.
const V19_RADIO=[
 [['柳焰','无线电检查。听见就回一声。荒原太安静的时候，我反而不放心。']],
 [['旁白','公路边一排旧风标向同一个方向倾斜。'],['柳焰','以前的人拿这些判断天气。现在我们拿它判断哪条路还有人在维护。']],
 [['桃夭','前轮有一点偏。不是大问题，下一次停车我调一下。'],['柳焰','她说“不是大问题”的时候，最好还是停车。']],
 [['林澄','你们有没有发现，我们最近越来越习惯在车里睡着？'],['柳焰','说明发动机声音已经算安全的声音了。']],
 [['桃夭','废料箱快满了。'],['林澄','上次你也这么说。'],['桃夭','上次是心理上的满。这次是真的。']],
 [['柳焰','看到远处那盏灯了吗？只要还有人愿意给陌生猎人留灯，这条路就不算死。']]
];
const v19OldUpdateMovement=updateMovement;
updateMovement=function(dt){const before=state.world?.distance||0;v19OldUpdateMovement(dt);if(state.scene!=='world'||mode!=='play'||!state.v12?.originComplete)return;const after=state.world?.distance||0;if(after<=before)return;const target=1100+(state.v19.radioIndex||0)*1450;if(after>=target&&state.v19.radioIndex<V19_RADIO.length){const sc=V19_RADIO[state.v19.radioIndex++];state.v19.lastRadioDistance=after;saveSilently();setTimeout(()=>v19WhenPlay(()=>openDialogue(sc)),120)}};

// Return-to-town aftermath: victory changes people and streets before the formal reward claim.
const V19_AFTERMATH={
 0:[['旁白','锈港的城门今天没有拉下防爆闸。第一辆等待许久的运输车正从海堤慢慢开回来。'],['程安','警报没响。不是坏了，是今天真的没有目标。'],['柳焰','记住这个声音。没有炮声的时候，海浪其实挺吵的。']],
 1:[['旁白','旧泵站恢复了低沉而稳定的轰鸣。有人把水桶一只只摆到街边。'],['牧叔','别笑。我们等这个声音等太久了。'],['桃夭','泵轴还会撑几年。只要别再拿钢甲虫当维修工。']],
 2:[['旁白','霓虹井诊所打开了所有窗。有人抱怨街上的广告音乐太吵。'],['白护士','听见没有？会嫌吵了。说明他们是真的醒了。'],['林澄','今天这句抱怨，我负责不记录进病历。']]
};
const v19OldEnterTown=enterTown;
enterTown=function(i){v19OldEnterTown(i);if(i<3&&state.townProgress[i]?.boss&&!state.v19.aftermath[i]){state.v19.aftermath[i]=true;const mem=['rustBoss','saltBoss','neonBoss'][i];v19Memory(mem);saveSilently();setTimeout(()=>v19WhenPlay(()=>openDialogue(V19_AFTERMATH[i])),300)}};

// Victory produces a remembered consequence, not only loot.
const v19OldWinBattle=winBattle;
winBattle=function(){const wasBoss=!!battle?.enemy?.boss,bi=battle?.enemy?.town;const r=v19OldWinBattle();if(wasBoss&&Number.isInteger(bi)){if(bi===0)v19Trust('liuyan',1);if(bi===1)v19Trust('taoyao',1);if(bi===2)v19Trust('lincheng',1);saveSilently()}return r};

// Towns visibly heal after their local boss is resolved.
function v19DrawTownRecovery(i){if(!state.townProgress[i]?.claimed&&!state.townProgress[i]?.boss)return;const t=performance.now()/1000;ctx.save();if(i===0){
  // relit seawall lamps
  for(const [x,y] of [[180,395],[350,405],[1060,407],[1230,390]]){const p=townToScreen(x,y),g=ctx.createRadialGradient(p.x,p.y,1,p.x,p.y,42);g.addColorStop(0,'rgba(255,191,91,.32)');g.addColorStop(1,'rgba(255,191,91,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,42,0,TAU);ctx.fill();ctx.fillStyle='#f4c670';ctx.fillRect(p.x-2,p.y-19,4,4)}
  // a convoy that only exists after the road reopens
  const cx=180+((t*34)%1040),p=townToScreen(cx,438);ctx.fillStyle='#484943';ctx.fillRect(p.x-28,p.y-13,56,25);ctx.fillStyle='#765b3e';ctx.fillRect(p.x-12,p.y-20,23,12);ctx.fillStyle='#181a18';ctx.beginPath();ctx.arc(p.x-18,p.y+14,7,0,TAU);ctx.arc(p.x+19,p.y+14,7,0,TAU);ctx.fill();
 }else if(i===1){const p=townToScreen(700,465);ctx.strokeStyle='rgba(116,190,205,.75)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(p.x-22,p.y-9);ctx.quadraticCurveTo(p.x,p.y-45,p.x+22,p.y-9);ctx.stroke();for(let k=0;k<5;k++){ctx.fillStyle='rgba(165,217,224,.5)';ctx.fillRect(p.x-20+k*10,p.y+8+Math.sin(t*3+k)*3,3,3)}}
 else if(i===2){for(const [x,y] of [[390,350],[1080,385],[700,205]]){const p=townToScreen(x,y);ctx.fillStyle=`rgba(${120+Math.floor(Math.sin(t*2+x)*30)},90,190,.28)`;ctx.fillRect(p.x-28,p.y-53,56,8)}}ctx.restore()}
const v19OldRender=render;
render=function(dt){v19OldRender(dt);if(mode==='play'&&state.scene==='town'&&state.townIndex<3)v19DrawTownRecovery(state.townIndex)};

// A tiny keepsake on the first vehicle persists across the whole game.
const v19OldDrawTankModel=drawTankModel;
drawTankModel=function(x,y,dir,idx,scale=1,screen=true){v19OldDrawTankModel(x,y,dir,idx,scale,screen);if(!state.v19.keepsake||idx!==V12_STARTER_INDEX)return;const p=screen?screenPos(x,y):{x,y};ctx.save();ctx.translate(p.x,p.y);ctx.scale(scale,scale);ctx.rotate(dir);ctx.strokeStyle='#a5382f';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-5,-5);ctx.lineTo(-12,-19);ctx.stroke();ctx.fillStyle='#b99a55';ctx.beginPath();ctx.arc(-12,-21,3,0,TAU);ctx.fill();ctx.restore()};

// Memories are a real menu rather than invisible flags.
function v19OpenMemories(){const ids=Object.keys(V19_MEMORY_DEF).filter(id=>state.v19.memories[id]);const items=ids.length?ids.map(id=>`◆ ${V19_MEMORY_DEF[id].title}`):['还没有形成可回看的旅途记忆。'];menu.sub={title:'旅途记忆',items,onSelect:(idx)=>{if(!ids.length)return;const m=V19_MEMORY_DEF[ids[idx]];openDialogue([['旅途记忆',m.title],['旁白',m.text]])}};menu.sel=0}
const v19OldOpenMenu=openMenu;
openMenu=function(){v19OldOpenMenu();if(menu&&!menu.items.includes('旅途记忆'))menu.items.splice(Math.max(1,menu.items.length-1),0,'旅途记忆')};
const v19OldMenuConfirm=menuConfirm;
menuConfirm=function(){if(menu&&!menu.sub&&!menu.garage&&!menu.shop&&menu.items?.[menu.sel]==='旅途记忆')return v19OpenMemories();return v19OldMenuConfirm()};
const v19OldCompanion=openCompanionMenu;
openCompanionMenu=function(){v19OldCompanion();if(!menu?.sub)return;const map=[['柳焰','liuyan'],['桃夭','taoyao'],['林澄','lincheng']];menu.sub.items=map.map(([n,k])=>{const joined=k==='liuyan'?state.party.liuyan:k==='taoyao'?state.party.taoyao:state.party.lincheng;return joined?`${n}｜${v19TrustLabel(k)} · 默契 ${state.v19.trust[k]||0}`:`${n}｜尚未加入`})};

// Environmental spot dialogue remembers whether the crisis has ended.
const v19OldInteract=interact;
interact=function(o){if(o?.type==='v18spot'&&o.spot?.id==='r_mem'&&state.townProgress[0]?.claimed){return openDialogue([['旁白','纪念牌下面多了一块新焊上的小铁片。'],['旁白','“今天没有新增名字。”'],['柳焰','这句话比任何赏金数字都值钱。']])}return v19OldInteract(o)};

// Screenshot/debug routes for QA only.
(function(){try{const q=new URLSearchParams(location.search).get('debug');if(!q)return;setTimeout(()=>{if(q==='soul_rust'){state.scene='town';state.townIndex=0;state.v12=Object.assign(state.v12||{},{originComplete:true,starterRepaired:true,tankUnlocked:true});state.party.liuyan=true;state.townProgress[0].boss=true;state.townProgress[0].claimed=true;currentTown={...TOWNS[0],index:0};state.player.inTank=false;state.player.x=650;state.player.y=465;state.tank.x=780;state.tank.y=495;mode='play';updateHud()}else if(q==='soul_night'){state.scene='interior';state.currentInterior='tavern';state.townIndex=0;currentTown={...TOWNS[0],index:0};state.party.liuyan=true;state.time=22;mode='play';v19TryNightScene(0)}else if(q==='soul_mem'){state.party.liuyan=true;state.v19.memories={origin:true,hunter:true,liuyanNight:true,rustBoss:true};openMenu();const ix=menu.items.indexOf('旅途记忆');menu.sel=ix;v19OpenMemories();mode='menu'}},250)}catch(e){}})();
saveSilently();
/* === v0.20-v0.22 milestone pass: consequences, companion arcs, lived-in schedules === */
const V22_VERSION='0.22.0';
const v22OldNormalizeState=normalizeState;
normalizeState=function(){
  v22OldNormalizeState();
  state.v22=Object.assign({
    rustSide:{med:0,badge:0,lamp:0},
    choices:{med:null,lamp:null},
    companion:{liuyan:0,taoyao:0,lincheng:0},
    companionDone:{liuyan:false,taoyao:false,lincheng:false},
    flags:{},townRep:[0,0,0,0,0,0,0,0,0,0],hunterRep:0,rank:'F',
    epilogue:false,visited:{},schedulePhase:'',milestoneSeen:false
  },state.v22||{});
  state.v22.rustSide=Object.assign({med:0,badge:0,lamp:0},state.v22.rustSide||{});
  state.v22.choices=Object.assign({med:null,lamp:null},state.v22.choices||{});
  state.v22.companion=Object.assign({liuyan:0,taoyao:0,lincheng:0},state.v22.companion||{});
  state.v22.companionDone=Object.assign({liuyan:false,taoyao:false,lincheng:false},state.v22.companionDone||{});
  state.v22.flags=state.v22.flags||{};state.v22.visited=state.v22.visited||{};
  state.v22.townRep=Array.from({length:10},(_,i)=>Number(state.v22.townRep?.[i]||0));
  state.v22.hunterRep=Number(state.v22.hunterRep||0);state.saveVersion=22;
};
normalizeState();

function v22Rank(){const r=state.v22.hunterRep;return r>=70?'B':r>=45?'C':r>=25?'D':r>=10?'E':'F'}
function v22AddRep(n,town=state.townIndex){state.v22.hunterRep+=n;state.v22.townRep[town]=(state.v22.townRep[town]||0)+n;state.v22.rank=v22Rank();saveSilently()}
function v22Choice(title,items,onPick){menu={items,sel:0,sub:null,v22Choice:true,v22Title:title,v22Pick:onPick};mode='menu';setHint('方向键选择 · A 确认 · B 返回')}
const v22OldMenuConfirm=menuConfirm;
menuConfirm=function(){if(menu?.v22Choice){const cb=menu.v22Pick,idx=menu.sel;menu=null;mode='play';setHint('方向键移动 · A 互动 · B 菜单');cb(idx);return}return v22OldMenuConfirm()};
const v22OldDrawMenu=drawMenu;
drawMenu=function(){if(!menu?.v22Choice)return v22OldDrawMenu();ctx.fillStyle='rgba(5,7,6,.96)';ctx.fillRect(0,0,W,H);ctx.fillStyle='#e8ce87';ctx.font='bold 22px monospace';ctx.textAlign='left';ctx.fillText(menu.v22Title||'选择',80,100);menu.items.forEach((it,i)=>{const y=160+i*62;ctx.fillStyle=i===menu.sel?'#655036':'#171c18';ctx.fillRect(80,y,800,46);ctx.strokeStyle=i===menu.sel?'#d5b36a':'#465047';ctx.strokeRect(80.5,y+.5,799,45);ctx.fillStyle=i===menu.sel?'#fff0ba':'#d0d5cd';ctx.font='16px monospace';ctx.fillText(`${i===menu.sel?'▶':' '} ${it}`,105,y+29)});ctx.fillStyle='#7e877e';ctx.font='10px monospace';ctx.fillText('这个决定会被城镇记住。',80,480)};

/* --- authored Rustport side stories --- */
const V22_RUST_SPOTS=[
 {id:'medcase',name:'搁浅救护箱',x:1235,y:705,enabled:()=>state.v22.rustSide.med===1,lines:[['旁白','一只白色救护箱卡在海堤钢筋之间。锁扣已经锈死。'],['系统','你撬开箱体，里面的止痛针和消毒包仍然密封。']]},
 {id:'badge',name:'烧黑的工牌',x:1110,y:420,enabled:()=>state.v22.rustSide.badge===1,lines:[['旁白','烧毁运输车的座椅下面压着一枚变形工牌。'],['旁白','“北堤装卸组 · 陈牧”。背面用钝刀刻着：回家吃饭。']]},
 {id:'relay',name:'港灯继电器',x:360,y:420,enabled:()=>state.v22.rustSide.lamp===1,lines:[['旁白','旧配电箱里还有一枚完整的大功率继电器。'],['程安','对，就是这个型号。够我们让一条线路重新亮起来。']]}
];
function v22DrawStorySpots(){if(state.scene!=='town'||state.townIndex!==0)return;const t=performance.now()/1000;for(const s of V22_RUST_SPOTS){if(!s.enabled()||state.v22.flags['spot_'+s.id])continue;const p=townToScreen(s.x,s.y);ctx.save();ctx.fillStyle='#f0ce73';ctx.beginPath();ctx.arc(p.x,p.y-14,5+Math.sin(t*4)*1.5,0,TAU);ctx.fill();ctx.strokeStyle='rgba(240,206,115,.28)';ctx.beginPath();ctx.arc(p.x,p.y-14,13+Math.sin(t*3)*2,0,TAU);ctx.stroke();ctx.restore()}}
const v22OldNearest=nearestInteractable;
nearestInteractable=function(){const b=v22OldNearest();if(b)return b;if(state.scene==='town'&&state.townIndex===0){const f=state.player.inTank?state.tank:state.player;for(const s of V22_RUST_SPOTS)if(s.enabled()&&!state.v22.flags['spot_'+s.id]&&dist(f.x,f.y,s.x,s.y)<50)return{type:'v22spot',spot:s,name:s.name}}return null};
const v22OldInteract=interact;
interact=function(o){if(o?.type==='v22spot'){const s=o.spot;state.v22.flags['spot_'+s.id]=true;if(s.id==='medcase')state.v22.rustSide.med=2;if(s.id==='badge')state.v22.rustSide.badge=2;if(s.id==='relay')state.v22.rustSide.lamp=2;saveSilently();return openDialogue(s.lines)}return v22OldInteract(o)};

function v22FinishMed(){
 v22Choice('这批医疗物资怎么处理？',['全部交给灯塔诊所','留下部分药品，换取 320G'],idx=>{
   state.v22.rustSide.med=3;state.v22.choices.med=idx===0?'clinic':'sell';
   if(idx===0){state.inventory.repairKits+=2;v22AddRep(4,0);v19Trust('lincheng',1);openDialogue([['诊所护士','我以为它们早被潮水卷走了。今晚急救柜终于不用空着。'],['旁白','她没有给你钱，而是把两只修理/急救包塞进你的背包。'],['系统','锈港诊所服务改善；获得修理包 ×2；声望 +4。']])}
   else{state.gold+=320;v22AddRep(1,0);openDialogue([['诊所护士','至少你还是把大部分带回来了。荒原上谁都得活。'],['系统','获得 320G；声望 +1。']])}saveSilently();
 })
}
function v22FinishLamp(){
 v22Choice('仅有的继电器接到哪里？',['海堤警戒灯：让夜路更安全','诊所备用线：让夜班不再断电'],idx=>{
  state.v22.rustSide.lamp=3;state.v22.choices.lamp=idx===0?'seawall':'clinic';v22AddRep(4,0);
  if(idx===0)openDialogue([['程安','那我把北堤到旧码头这一段全接上。以后夜里至少能看见路。'],['柳焰','灯不能杀死机器，但能让人早点看见它。已经够值了。'],['系统','海堤夜间照明恢复；声望 +4。']]);
  else openDialogue([['程安','诊所？行。警戒灯可以再等等，病床上的人等不了。'],['林澄','我欠你一个夜班。最好永远别来收。'],['系统','诊所备用电恢复；声望 +4。']]);saveSilently();
 })
}

const v22OldTalkAmbient=talkAmbient;
talkAmbient=function(n){
 if(state.townIndex===0&&n.name==='老张'&&state.v12?.originComplete){
  if(state.v22.rustSide.badge===0&&state.townProgress[0].boss){state.v22.rustSide.badge=1;saveSilently();return openDialogue([['老张','那辆烧毁的二号运输车里，还有个孩子没等到东西。'],['老张','陈牧的工牌。如果你路过那边，帮我找回来。赏金不用算。']])}
  if(state.v22.rustSide.badge===2){state.v22.rustSide.badge=3;v22AddRep(5,0);v19Trust('liuyan',1);saveSilently();return openDialogue([['旁白','老张接过工牌，拇指在“回家吃饭”四个字上停了很久。'],['老张','他妈每天还多摆一双筷子。今晚我去告诉她。'],['柳焰','这种委托没有赏金，也最难交付。'],['系统','港工纪念墙增加新记录；声望 +5。']])}
 }
 if(state.townIndex===0&&n.name==='程安'&&state.townProgress[0].boss){
  if(state.v22.rustSide.lamp===0){state.v22.rustSide.lamp=1;saveSilently();return openDialogue([['程安','铁牙猎犬没了，可北堤的灯也坏了大半。'],['程安','旧市场配电箱还有同型号继电器。找得到的话，我们能救一条线路。']])}
  if(state.v22.rustSide.lamp===2)return v22FinishLamp();
 }
 return v22OldTalkAmbient(n)
};
const v22OldTalkNpc=talkNpc;
talkNpc=function(o){
 if(state.townIndex===0&&o.role==='nurse'&&state.v12?.originComplete){
  if(state.v22.rustSide.med===0){state.v22.rustSide.med=1;saveSilently();return openDialogue([['诊所护士','北堤撤离时丢了一箱急救物资。白箱、红十字，应该卡在海堤附近。'],['诊所护士','找到的话请带回来。我们现在连干净绷带都得剪旧床单。']])}
  if(state.v22.rustSide.med===2)return v22FinishMed();
  if(state.v22.rustSide.med===3&&state.v22.choices.med==='clinic'){const heal=Math.round(tankMax()*.28);state.tank.hp=Math.min(tankMax(),state.tank.hp+heal);state.person.hp=v11PersonMax();sayToast('诊所免费完成全面护理');return}
 }
 return v22OldTalkNpc(o)
};

/* --- companion first personal arcs --- */
if(!V10_POIS.some(p=>p.id==='liuyan_marker'))V10_POIS.push({id:'liuyan_marker',x:820,y:760,name:'旧猎人路标',type:'lore',visible:false,chapter:0,icon:'†',desc:'一块被子弹打穿的旧猎人方向牌。'});
if(!V10_POIS.some(p=>p.id==='taoyao_servo'))V10_POIS.push({id:'taoyao_servo',x:1450,y:610,name:'废泵伺服仓',type:'cache',visible:false,chapter:1,icon:'◇',reward:{scrap:5},desc:'盐风旧泵组旁的伺服器材仓。'});
if(!V10_POIS.some(p=>p.id==='lincheng_tags'))V10_POIS.push({id:'lincheng_tags',x:1890,y:620,name:'旧诊疗转运点',type:'lore',visible:false,chapter:2,icon:'+',desc:'路边帐篷只剩床架和一盒未送达的身份牌。'});
const v22OldPoi=v10InteractPoi;
v10InteractPoi=function(p){
 if(p.id==='liuyan_marker'&&state.v22.companion.liuyan===1){state.v22.companion.liuyan=2;saveSilently();return openDialogue([['旁白','方向牌背后夹着三枚旧猎人识别牌，其中一枚烧掉了半边。'],['柳焰','……是他们。'],['柳焰','别说安慰的话。帮我把名字带回去就行。']])}
 if(p.id==='taoyao_servo'&&state.v22.companion.taoyao===1){state.v22.companion.taoyao=2;saveSilently();return openDialogue([['桃夭','找到了。旧军泵的反馈伺服。'],['桃夭','我小时候就是拆这种东西学会看齿轮间隙的。别问谁教的，没有谁。']])}
 if(p.id==='lincheng_tags'&&state.v22.companion.lincheng===1){state.v22.companion.lincheng=2;saveSilently();return openDialogue([['旁白','纸盒里有十三枚病人牌，号码完整，名字栏却只写到第七枚。'],['林澄','把空白的也带回去。没人记得名字，不代表他们没有名字。']])}
 return v22OldPoi(p)
};
const v22OldCompanionBanter=companionBanter;
companionBanter=function(){
 if(state.townIndex===0&&state.party.liuyan&&state.townProgress[0].claimed&&state.v22.companion.liuyan===0){state.v22.companion.liuyan=1;saveSilently();return openDialogue([['柳焰','有件事不是委托。旧猎人路标附近，可能还留着我以前小队的识别牌。'],['柳焰','你不用陪我去。……但如果你去，我会记得。'],['系统','个人事件：柳焰 · 没带回来的名字。']])}
 if(state.townIndex===0&&state.v22.companion.liuyan===2){state.v22.companion.liuyan=3;state.v22.companionDone.liuyan=true;v19Trust('liuyan',2);v22AddRep(2,0);saveSilently();return openDialogue([['旁白','柳焰把三枚识别牌排在桌上，给每个人倒了一点酒。'],['柳焰','以前我总觉得活下来的人必须替死去的人解释一切。'],['柳焰','现在我想，记得就够了。明天继续上路。'],['系统','柳焰关系提升；对赏金首的首次炮击伤害提高。']])}
 if(state.townIndex===1&&state.party.taoyao&&state.townProgress[1].claimed&&state.v22.companion.taoyao===0){state.v22.companion.taoyao=1;saveSilently();return openDialogue([['桃夭','盐风旧泵站外还有个伺服仓。里面有一套我以前一直想拆开的反馈机构。'],['桃夭','不是为了卖钱。……算了，就是为了我自己。'],['系统','个人事件：桃夭 · 会说真话的机器。']])}
 if(state.townIndex===1&&state.v22.companion.taoyao===2){state.v22.companion.taoyao=3;state.v22.companionDone.taoyao=true;v19Trust('taoyao',2);v22AddRep(2,1);saveSilently();return openDialogue([['桃夭','看，齿轮磨损会留下方向，人就不会。'],['桃夭','不过跟你们走久了，好像也能看懂一点。'],['系统','桃夭关系提升；战车额外载重 +1.5t。']])}
 if(state.townIndex===2&&state.party.lincheng&&state.townProgress[2].claimed&&state.v22.companion.lincheng===0){state.v22.companion.lincheng=1;saveSilently();return openDialogue([['林澄','镇外旧转运点遗失过一盒病人牌。没人愿意再去，因为那里已经没有“任务价值”。'],['林澄','我想把它们找回来。'],['系统','个人事件：林澄 · 名字不是编号。']])}
 if(state.townIndex===2&&state.v22.companion.lincheng===2){state.v22.companion.lincheng=3;state.v22.companionDone.lincheng=true;v19Trust('lincheng',2);v22AddRep(2,2);saveSilently();return openDialogue([['旁白','林澄把十三枚病人牌逐一擦干净，空白的七枚也放进同一个盒子。'],['林澄','至少我们承认，他们曾经在这里。'],['系统','林澄关系提升；战斗后恢复效果提高。']])}
 return v22OldCompanionBanter()
};

/* Passive effects from personal stories. */
const v22OldTankAtk=tankAtk;
tankAtk=function(slot='main'){let n=v22OldTankAtk(slot);if(state.v22.companionDone.liuyan&&battle?.enemy?.boss&&battle.enemy.hp===battle.enemy.max)n=Math.round(n*1.12);return n};
const v22OldLoadMax=loadMax;
loadMax=function(){return v22OldLoadMax()+(state.v22.companionDone.taoyao?1.5:0)};
const v22OldWinBattle=winBattle;
winBattle=function(){const hp0=state.tank.hp,was=!!battle?.enemy?.boss;const r=v22OldWinBattle();if(state.v22.companionDone.lincheng&&state.party.lincheng){const extra=Math.round(tankMax()*.04);state.tank.hp=Math.min(tankMax(),state.tank.hp+extra);if(was)sayToast(`林澄额外整备 +${extra} 装甲`,2)}return r};

/* --- schedules: named residents work, eat, rest, and go home --- */
const V22_SCHEDULES={
 '老张':{work:[180,430],eve:[315,610],night:[180,720],act:['装卸','喝酒','回家']},'梅姨':{work:[965,610],eve:[330,610],night:[990,710],act:['摆摊','收摊','休息']},'程安':{work:[700,815],eve:[690,760],night:[700,815],act:['巡门','换岗','夜巡']},'何叔':{work:[1000,390],eve:[1010,470],night:[1010,650],act:['修车','盘点','休息']},'阿舟':{work:[270,780],eve:[410,610],night:[260,735],act:['拾荒','吃饭','睡觉']},
 '牧叔':{work:[700,460],eve:[300,610],night:[250,720],act:['看水位','歇脚','回家']},'罗婶':{work:[960,600],eve:[360,620],night:[1010,730],act:['卖水票','吃饭','休息']},'岑师傅':{work:[980,380],eve:[900,450],night:[1040,700],act:['检泵','收工具','休息']},
 '周工':{work:[1040,385],eve:[360,610],night:[1020,720],act:['校广播','吃饭','休息']},'白护士':{work:[680,455],eve:[650,455],night:[650,455],act:['巡床','交班','夜班']},'七码':{work:[940,630],eve:[420,620],night:[900,720],act:['做交易','听消息','休息']}
};
function v22Phase(){const h=state.time;return h>=7&&h<18?'work':h>=18&&h<23?'eve':'night'}
const v22OldUpdateNpcs=updateNpcs;
updateNpcs=function(dt){if(state.scene==='town'&&state.townIndex<3){const phase=v22Phase();for(const n of getAmbientNpcs(state.townIndex)){const s=V22_SCHEDULES[n.name];if(!s)continue;if(n.v22Phase!==phase){n.v22Phase=phase;const p=s[phase];n.route=[{x:n.x,y:n.y},{x:p[0],y:p[1]},{x:p[0]+((n.id.charCodeAt(n.id.length-1)%3)-1)*26,y:p[1]+((n.id.charCodeAt(n.id.length-1)%2)?18:-18)}];n.target=1;n.activity=s.act[phase==='work'?0:phase==='eve'?1:2]}}}v22OldUpdateNpcs(dt)};
function v22DrawActivities(){if(state.scene!=='town'||state.townIndex>2||mode!=='play')return;for(const n of getAmbientNpcs(state.townIndex)){if(!n.activity)continue;const f=state.player.inTank?state.tank:state.player;if(dist(f.x,f.y,n.x,n.y)>135)continue;const p=townToScreen(n.x,n.y);ctx.fillStyle='rgba(9,11,9,.82)';ctx.fillRect(p.x-24,p.y-58,48,14);ctx.fillStyle='#c7b986';ctx.font='8px monospace';ctx.textAlign='center';ctx.fillText(n.activity,p.x,p.y-48)}}

/* --- town remembers decisions visually --- */
function v22DrawConsequences(){if(state.scene!=='town'||state.townIndex!==0)return;const t=performance.now()/1000;ctx.save();if(state.v22.rustSide.badge===3){const p=townToScreen(690,805);for(let k=0;k<5;k++){ctx.fillStyle=`rgba(239,181,91,${.22+.1*Math.sin(t*2+k)})`;ctx.beginPath();ctx.arc(p.x-26+k*13,p.y-13,3,0,TAU);ctx.fill()}}
 if(state.v22.choices.lamp==='seawall'&&(state.time>=18||state.time<6)){for(const x of [120,290,460,970,1140,1300]){const p=townToScreen(x,438);const g=ctx.createRadialGradient(p.x,p.y,1,p.x,p.y,46);g.addColorStop(0,'rgba(255,198,92,.38)');g.addColorStop(1,'rgba(255,198,92,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,46,0,TAU);ctx.fill()}}
 if(state.v22.choices.lamp==='clinic'){const p=townToScreen(680,320);const g=ctx.createRadialGradient(p.x,p.y,1,p.x,p.y,75);g.addColorStop(0,'rgba(178,222,208,.25)');g.addColorStop(1,'rgba(178,222,208,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,75,0,TAU);ctx.fill()}
 ctx.restore()}

/* --- first-arc completion and reputation journal --- */
function v22SideDone(){return ['med','badge','lamp'].filter(k=>state.v22.rustSide[k]===3).length}
function v22MaybeEpilogue(){if(state.v22.epilogue||!state.townProgress[0]?.claimed||v22SideDone()<2||!state.v22.companionDone.liuyan)return;state.v22.epilogue=true;v22AddRep(8,0);v19Memory('rustBoss');saveSilently();openDialogue([['旁白','锈港没有为你举行庆典。第二天清晨，码头照常开门，鱼摊照常吵，车库照常有人骂零件贵。'],['老张','这就对了。最好的日子就是没什么值得写进事故表。'],['柳焰','你现在像个猎人了。不是因为打掉了铁牙猎犬。'],['柳焰','是因为这里有人开始相信，你走了以后路还会是通的。'],['系统',`第一章阶段完成 · 猎人等级 ${state.v22.rank} · 锈港声望 ${state.v22.townRep[0]}`]])}
const v22OldEnterTown=enterTown;
enterTown=function(i){v22OldEnterTown(i);if(i===0)setTimeout(()=>v19WhenPlay(v22MaybeEpilogue),700)};
function v22OpenWorldState(){const c=state.v22.choices;const items=[`猎人等级 ${state.v22.rank} ｜ 总声望 ${state.v22.hunterRep}`,`锈港声望 ${state.v22.townRep[0]} ｜ 支线 ${v22SideDone()}/3`,`诊所物资：${c.med==='clinic'?'完整归还':c.med==='sell'?'部分变卖':'未决定'}`,`港灯线路：${c.lamp==='seawall'?'海堤警戒灯':c.lamp==='clinic'?'诊所备用电':'未决定'}`,`柳焰：${state.v22.companionDone.liuyan?'个人事件完成':'未完成'}`,`桃夭：${state.v22.companionDone.taoyao?'个人事件完成':'未完成'}`,`林澄：${state.v22.companionDone.lincheng?'个人事件完成':'未完成'}`];menu.sub={title:'世界状态',items,onSelect:()=>{}};menu.sel=0}
const v22OldOpenMenu=openMenu;
openMenu=function(){v22OldOpenMenu();if(menu&&!menu.items.includes('世界状态'))menu.items.splice(Math.max(1,menu.items.length-1),0,'世界状态')};
const v22MenuConfirm2=menuConfirm;
menuConfirm=function(){if(menu&&!menu.sub&&!menu.garage&&!menu.shop&&menu.items?.[menu.sel]==='世界状态')return v22OpenWorldState();return v22MenuConfirm2()};

/* Shop reputation discount in Rustport; consequence is systemic, not only dialogue. */
const v22OldOpenShop=openShopMenu;
openShopMenu=function(){v22OldOpenShop();if(state.townIndex!==0||!menu?.shop)return;const disc=Math.min(.18,(state.v22.townRep[0]||0)*.01);if(!disc)return;const base=500,price=Math.round(base*(1-disc));menu.items=['修理包｜'+Math.round(180*(1-disc))+'G',`标准副炮｜${price}G`,`标准 SE｜${price}G`,'返回'];menu.v22Discount=disc};
const v22OldShopConfirm=shopConfirm;
shopConfirm=function(){if(!menu?.v22Discount)return v22OldShopConfirm();const i=state.townIndex,d=menu.v22Discount;if(menu.sel===0){const c=Math.round(180*(1-d));if(state.gold<c)return sayToast('资金不足');state.gold-=c;state.inventory.repairKits++;sayToast(`锈港声望折扣：-${Math.round(d*100)}%`);saveSilently()}else if(menu.sel===1||menu.sel===2){const type=menu.sel===1?'sub':'se',p=chapterPart(type,i),c=Math.round((500+i*380)*(1-d));if(state.inventory.parts.includes(p.id))return sayToast('已经拥有');if(state.gold<c)return sayToast(`需要 ${c}G`);state.gold-=c;state.inventory.parts.push(p.id);sayToast(`购买 ${p.name}（声望价）`);saveSilently()}else closeMenu()};

/* Quest text prioritizes authored unresolved threads after the local main story. */
const v22OldQuestText=questText;
questText=function(){if(state.townIndex===0&&state.v12?.originComplete){const q=state.v22.rustSide;if(q.med===1)return'锈港支线：在海堤寻找搁浅的白色救护箱。';if(q.med===2)return'锈港支线：把救护箱带回灯塔诊所。';if(q.badge===1)return'锈港支线：在烧毁运输车附近寻找陈牧的工牌。';if(q.badge===2)return'锈港支线：把工牌交给老张。';if(q.lamp===1)return'锈港支线：在旧市场配电箱寻找港灯继电器。';if(q.lamp===2)return'锈港支线：把继电器交给程安。';if(state.v22.companion.liuyan===1)return'柳焰个人事件：寻找旧猎人路标。';if(state.v22.companion.liuyan===2)return'柳焰个人事件：回锈港酒馆。'}return v22OldQuestText()};

/* Environmental micro-life: gulls, market shutters, recovery traffic, lamps. */
function v22DrawLife(){if(state.scene!=='town'||state.townIndex>2)return;const t=performance.now()/1000,i=state.townIndex;ctx.save();if(i===0){for(let k=0;k<5;k++){const x=120+((t*18+k*170)%900),y=85+Math.sin(t*.7+k)*18;ctx.strokeStyle='rgba(225,225,208,.55)';ctx.beginPath();ctx.arc(x,y,5,Math.PI*.1,Math.PI*.9);ctx.arc(x+10,y,5,Math.PI*.1,Math.PI*.9);ctx.stroke()}if(state.time>=7&&state.time<19){const p=townToScreen(940,620);ctx.fillStyle='#6f4330';ctx.fillRect(p.x-30,p.y-18,60,18);ctx.fillStyle='#d6ad6a';for(let k=0;k<4;k++)ctx.fillRect(p.x-24+k*14,p.y-27,9,7)}}else if(i===1){for(let k=0;k<8;k++){const p=townToScreen(90+k*165,760+Math.sin(k)*20);ctx.fillStyle='rgba(225,218,184,.28)';ctx.fillRect(p.x,p.y,18,2)}}else if(i===2){for(let k=0;k<4;k++){const p=townToScreen(250+k*280,180+(k%2)*90);ctx.fillStyle=`rgba(111,107,221,${.12+.08*Math.sin(t*3+k)})`;ctx.fillRect(p.x-25,p.y-10,50,7)}}ctx.restore()}

const v22OldRender=render;
render=function(dt){v22OldRender(dt);if(mode==='play'){v22DrawStorySpots();v22DrawConsequences();v22DrawActivities();v22DrawLife()}};

/* Debug scenes for milestone QA. */
(function(){try{const q=new URLSearchParams(location.search).get('debug');if(!q)return;setTimeout(()=>{if(q==='milestone_rust'){state.scene='town';state.townIndex=0;currentTown={...TOWNS[0],index:0};state.v12=Object.assign(state.v12||{},{originComplete:true,starterRepaired:true,tankUnlocked:true});state.party.liuyan=true;state.townProgress[0].boss=true;state.townProgress[0].claimed=true;state.v22.rustSide={med:3,badge:3,lamp:3};state.v22.choices={med:'clinic',lamp:'seawall'};state.v22.townRep[0]=15;state.v22.hunterRep=25;state.v22.rank='D';state.player.inTank=false;state.player.x=620;state.player.y=470;state.time=19.5;mode='play';updateHud()}else if(q==='milestone_choice'){state.scene='town';state.townIndex=0;currentTown={...TOWNS[0],index:0};state.v12=Object.assign(state.v12||{},{originComplete:true});state.v22.rustSide.lamp=2;state.player.inTank=false;mode='play';v22FinishLamp()}else if(q==='milestone_world'){state.v22.rustSide={med:3,badge:3,lamp:3};state.v22.choices={med:'clinic',lamp:'seawall'};state.v22.companionDone.liuyan=true;state.v22.hunterRep=31;state.v22.rank='D';openMenu();const ix=menu.items.indexOf('世界状态');menu.sel=ix;v22OpenWorldState();mode='menu'}},350)}catch(e){}})();

saveSilently();
