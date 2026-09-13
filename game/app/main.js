import { LOGICAL_HEIGHT } from './core/constants.js';
import { createStorage } from './core/state.js';
import { InputRouter } from './core/input.js';
import { createRenderer } from './core/renderer.js';
import { loadProductionAssets } from './core/assets.js';
import { loadDefinition } from './core/definitions.js';
import { createQuestManager } from './core/quest.js';
import { createDialogueManager } from './core/dialogue.js';
import { createBountyManager } from './core/bounty.js';
import { createMovementController } from './core/movement.js';
import { createInteractionResolver } from './core/interaction.js';
import { createCamera } from './core/camera.js';
import { loadSceneDefinition } from './core/scene.js';

const root=document.querySelector('#next-shell');
const canvas=root.querySelector('canvas');
const query=new URLSearchParams(location.search);
const p0AssetPreview=query.has('test')&&query.has('p0-assets');
const p0AssetIds=[
 'ground_dirt_oily_01','concrete_clean','concrete_cracked','concrete_oily',
 'awning_canvas_beige','barrel_rust','rust_runner_chassis_s',
 'rust_runner_track_left','rust_runner_track_right','rust_runner_turret_00','cannon_75mm'
];
const state=createStorage().load();
const input=new InputRouter(root);
let last=performance.now();
let notice='正在加载锈港生产素材…';
let route;
const movement=createMovementController({obstacles:[
 {x:850,y:410,w:100,h:120},
 {x:480,y:470,w:50,h:50}
]});
const camera=createCamera({bounds:{minX:360,maxX:920,minY:300,maxY:520}});
const interactions=createInteractionResolver([
 {id:'liuyan',x:420,y:470,radius:110,action:'交谈'},
 {id:'garage',x:900,y:470,radius:150,action:'进入车库'},
 {id:'iron_hound',x:640,y:260,radius:120,action:'攻击'}
]);
function distanceTo(x,y){return Math.hypot(state.player.x-x,state.player.y-y)}
function currentInteraction(){
 const objective=route?.quests.current('rustport_first_bounty');
 const target=interactions.nearest(state.player);
 if(!target)return null;
 if(target.id==='liuyan'&&['meet_liuyan','claim_bounty'].includes(objective?.id))return target;
 if(target.id==='garage'&&objective?.id==='repair_starter_tank')return target;
 if(target.id==='iron_hound'&&objective?.id==='kill_iron_hound')return target;
 return null;
}
function interact(){
 if(!route){notice='锈港路线仍在加载';return}
 const objective=route.quests.current('rustport_first_bounty');
 const target=currentInteraction();
 if(target?.id==='liuyan'&&objective?.id==='meet_liuyan'){
  state.rustport.arrivalSeen=true;
  route.dialogue.applyEffects(route.dialogue.resolve('liuyan_intro').effects);
  route.quests.advance('rustport_first_bounty','meet_liuyan');
  notice=route.dialogue.resolve('liuyan_intro').text;
  return;
 }
 if(target?.id==='garage'&&objective?.id==='repair_starter_tank'){
  state.rustport.starterTankReady=true;
  state.inventory.scrap=Math.max(0,state.inventory.scrap-6);
  route.quests.advance('rustport_first_bounty','repair_starter_tank');
  notice='战车修复完成：前往港区北侧迎战铁牙猎犬';
  return;
 }
 if(target?.id==='iron_hound'&&objective?.id==='kill_iron_hound'){
  state.rustport.combatHits++;
  state.rustport.lastAction=state.rustport.combatHits>=3?'death':'hurt';
  state.rustport.actionUntil=performance.now()+520;
  if(state.rustport.combatHits>=3){
   state.rustport.ironHoundDefeated=true;
   route.quests.advance('rustport_first_bounty','kill_iron_hound');
   notice='铁牙猎犬已击败：返回柳焰处领取赏金';
  }
  else notice=`炮击命中铁牙猎犬（${state.rustport.combatHits}/3）`;
  return;
 }
 if(target?.id==='liuyan'&&objective?.id==='claim_bounty'&&state.rustport.ironHoundDefeated){
  if(route.bounty.claim()){
   route.quests.advance('rustport_first_bounty','claim_bounty');
   route.dialogue.applyEffects(route.dialogue.resolve('bounty_claimed').effects);
   notice='赏金已领取：+350G，+8 废料；北面旧路已开放';
  }
  return;
 }
 if(state.rustport.ironHoundDefeated){notice='铁牙猎犬已被击败，返回柳焰处领取赏金';return}
 notice='没有可互动目标';
}
function frame(now,renderer){
 const dt=Math.min(.05,(now-last)/1000);last=now;
 const length=Math.hypot(input.axes.x,input.axes.y)||1;
 if(Math.abs(input.axes.x)>.01||Math.abs(input.axes.y)>.01)state.player.facing=input.axes.y<-.35?(input.axes.x<-.35?'nw':input.axes.x>.35?'ne':'n'):input.axes.y>.35?(input.axes.x<-.35?'sw':input.axes.x>.35?'se':'s'):(input.axes.x<0?'w':'e');
 const next=movement.move(state.player,input.axes,dt);
 state.player.x=next.x;state.player.y=next.y;
 camera.update(state.player,input.axes,dt);
 if(input.consume('confirm'))interact();
 renderer.draw(state,now);
 root.querySelector('[data-next-status]').textContent=notice;
  const context=root.querySelector('[data-next-context]');
  const target=currentInteraction();
  context.textContent=target?.action||'互动';
  context.parentElement.setAttribute('aria-label',target?.action||'互动');
 requestAnimationFrame(nextNow=>frame(nextNow,renderer));
}
async function boot(){
 const [questDefinition,dialogueDefinition,bountyDefinition,vehicleDefinition]=await Promise.all([
  loadDefinition('data/quests/rustport.json','rustport_first_bounty'),
  loadDefinition('data/dialogue/rustport.json','rustport_intro'),
  loadDefinition('data/bounties/iron_hound.json','iron_hound'),
  loadDefinition('data/vehicles/rust_runner.json','rust_runner')
 ]);
 route={
  quests:createQuestManager(state,{rustport_first_bounty:questDefinition}),
  dialogue:createDialogueManager(state,dialogueDefinition),
  bounty:createBountyManager(state,bountyDefinition,{
   isClaimed:()=>route.quests.get('rustport_first_bounty').status==='COMPLETED'
  })
 };
 route.quests.start('rustport_first_bounty');
 const gameplayAssetIds=[
  ...['protagonist','liuyan'].flatMap(character=>
   ['n','ne','e','se','s','sw','w','nw'].map(direction=>`${character}_idle_${direction}_00`)),
  'iron_hound_idle',
  'iron_hound_hurt','iron_hound_enraged','iron_hound_death'
 ];
 const assets=await loadProductionAssets('data/asset_manifest.json',p0AssetPreview?p0AssetIds:[...p0AssetIds,...gameplayAssetIds]);
 const scene=await loadSceneDefinition();
 if(p0AssetPreview){
  state.rustport.starterTankReady=true;
  state.rustport.ironHoundDefeated=true;
  state.player.x=900;
  state.player.y=470;
 }
 const renderer=createRenderer(canvas,assets,camera,scene,vehicleDefinition,{hideIncompleteActors:p0AssetPreview});
 notice=p0AssetPreview?'Rustport P0 素材运行时检查':'抵达锈港：先与柳焰交谈';
 if(query.has('test'))globalThis.__NEXT_TEST__={state,interact};
 requestAnimationFrame(now=>frame(now,renderer));
}
boot().catch(error=>{
 notice='锈港暂不可用：生产素材尚未通过 QA';
 root.querySelector('[data-next-status]').textContent=notice;
 console.error(error);
});
addEventListener('pagehide',()=>{try{createStorage().save(state)}catch(error){console.error(error)}});
