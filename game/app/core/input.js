export class InputRouter{
 constructor(root){
  this.root=root;this.axes={x:0,y:0};this.actions=new Set();this.pointers=new Map();
  this.bind();
 }
 bind(){
  this.root.querySelectorAll('[data-next-dir]').forEach(button=>{
   const direction=button.dataset.nextDir;
   const release=event=>{
    if(event.pointerId!==undefined)this.pointers.delete(event.pointerId);
    button.classList.remove('active');this.recompute();
   };
   button.addEventListener('pointerdown',event=>{
    event.preventDefault();button.setPointerCapture?.(event.pointerId);
    this.pointers.set(event.pointerId,direction);button.classList.add('active');this.recompute();
   });
   ['pointerup','pointercancel','lostpointercapture'].forEach(type=>button.addEventListener(type,release));
  });
  this.root.querySelectorAll('[data-next-action]').forEach(button=>{
   button.addEventListener('pointerdown',event=>{
    event.preventDefault();button.setPointerCapture?.(event.pointerId);
    this.actions.add(button.dataset.nextAction);button.classList.add('active');
   });
   const release=()=>{this.actions.delete(button.dataset.nextAction);button.classList.remove('active')};
   ['pointerup','pointercancel','lostpointercapture'].forEach(type=>button.addEventListener(type,release));
  });
  addEventListener('keydown',event=>this.key(event,true));
  addEventListener('keyup',event=>this.key(event,false));
 }
 key(event,down){
  const map={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right'};
  const direction=map[event.key];
  if(direction){event.preventDefault();if(down)this.pointers.set(`key:${event.key}`,direction);else this.pointers.delete(`key:${event.key}`);this.recompute()}
  if(down&&event.key==='Enter')this.actions.add('confirm');
  if(!down&&event.key==='Enter')this.actions.delete('confirm');
 }
 recompute(){
  const values=[...this.pointers.values()];
  this.axes={x:(values.includes('right')?1:0)-(values.includes('left')?1:0),y:(values.includes('down')?1:0)-(values.includes('up')?1:0)};
 }
 consume(action){const active=this.actions.has(action);if(active)this.actions.delete(action);return active}
}
