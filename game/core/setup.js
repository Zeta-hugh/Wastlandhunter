'use strict';
const canvas=document.getElementById('game'),ctx=canvas.getContext('2d');
const W=960,H=540,TAU=Math.PI*2;
function resizeCanvas(){
 const dpr=Math.min(window.devicePixelRatio||1,2);
 canvas.width=Math.round(W*dpr);
 canvas.height=Math.round(H*dpr);
 ctx.setTransform(dpr,0,0,dpr,0,0);
 ctx.imageSmoothingEnabled=false;
}
resizeCanvas();
window.addEventListener('resize',resizeCanvas,{passive:true});
window.addEventListener('orientationchange',resizeCanvas,{passive:true});
const $=id=>document.getElementById(id),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),dist=(a,b,c,d)=>Math.hypot(a-c,b-d);
const rnd=(a,b)=>a+Math.random()*(b-a);
