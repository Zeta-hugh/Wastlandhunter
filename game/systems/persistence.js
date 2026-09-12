function normalizeState(){
 state.townProgress=Array.from({length:10},(_,i)=>Object.assign({chief:false,mechanic:false,board:false,boss:false,claimed:false,side:false,arrived:false},state.townProgress?.[i]||{}));
 state.sideJobs=Array.from({length:10},(_,i)=>Object.assign({accepted:false,kills:0,done:false,claimed:false},state.sideJobs?.[i]||{}));
 state.looted=state.looted||{};state.roomSeen=state.roomSeen||{};state.bond=Object.assign({liuyan:0,taoyao:0,lincheng:0},state.bond||{});state.scrap=Number.isFinite(state.scrap)?state.scrap:12;state.canon=Object.assign({seen:{},oldTimerMet:false,zeroKnown:false},state.canon||{});state.canon.seen=state.canon.seen||{};state.saveVersion=23;
}
function saveSilently(){
 normalizeState();
 try{localStorage.setItem('wastelandHunterV8',JSON.stringify(state));return true}
 catch(error){console.error('Save failed',error);return false}
}
function save(){if(saveSilently())sayToast('已保存');else sayToast('保存失败：请检查设备存储')}
function load(){
 try{
  let raw=localStorage.getItem('wastelandHunterV8');
  if(!raw)raw=localStorage.getItem('wastelandHunterV7');
  if(raw)Object.assign(state,JSON.parse(raw));
 }catch(error){console.error('Save load failed',error);sayToast('存档损坏，已使用默认状态')}
 normalizeState();
}
load(); if(state.scene==='town'||state.scene==='interior')currentTown={...TOWNS[state.townIndex],index:state.townIndex};
