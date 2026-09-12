const state={
 scene:'world',townIndex:0,unlocked:1,gold:700,scrap:12,vehicleIndex:0,owned:[0],
 tank:{x:350,y:520,hp:360,dir:0,upgrades:{main:0,sub:0,se:0,armor:0,engine:0},equipped:{main:'m0',sub:'s0',se:'e0',engine:'eng0',cunit:'c0',armor:'a0'}},
 player:{x:315,y:535,dir:0,inTank:false,model:'hunter',walk:0},
 party:{liuyan:false,taoyao:false,lincheng:false},
 inventory:{parts:['m0','s0','e0','eng0','c0','a0'],repairKits:1},
 townProgress:Array.from({length:10},()=>({chief:false,mechanic:false,board:false,boss:false,claimed:false,side:false,arrived:false})),
 sideJobs:Array.from({length:10},()=>({accepted:false,kills:0,done:false,claimed:false})),
 looted:{},roomSeen:{},bond:{liuyan:0,taoyao:0,lincheng:0},
 killed:Array(10).fill(false),currentInterior:null,returnPoint:null,time:8.25,canon:{seen:{},oldTimerMet:false,zeroKnown:false},saveVersion:23
};
let mode='play',dialogue=null,menu=null,battle=null,currentTown=null,keys={up:false,down:false,left:false,right:false};
let last=performance.now(),encounterMeter=0,toast={text:'',t:0},npcClock=0;

