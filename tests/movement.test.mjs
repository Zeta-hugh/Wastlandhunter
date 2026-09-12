import assert from 'node:assert/strict';
import test from 'node:test';
import { createMovementController } from '../game/app/core/movement.js';
import { createInteractionResolver } from '../game/app/core/interaction.js';
import { createCamera } from '../game/app/core/camera.js';

test('movement slides along a blocked axis instead of crossing an obstacle',()=>{
 const movement=createMovementController({speed:100,minY:0,obstacles:[{x:100,y:80,w:30,h:60}]});
 const next=movement.move({x:80,y:100},{x:1,y:0},.3);
 assert.equal(next.x,80);
 const slide=movement.move({x:80,y:70},{x:1,y:1},.3);
 assert.ok(slide.y>70);
});

test('interaction resolver selects the nearest active target',()=>{
 const resolver=createInteractionResolver([
  {id:'far',x:100,y:100,radius:50,action:'检查'},
  {id:'near',x:110,y:100,radius:50,action:'交谈'}
 ]);
 assert.equal(resolver.nearest({x:108,y:100}).id,'near');
 assert.equal(resolver.nearest({x:0,y:0}),null);
});

test('movement accelerates and decelerates instead of teleporting',()=>{
 const movement=createMovementController({speed:100,acceleration:200,deceleration:100,minY:0});
 const first=movement.move({x:80,y:100},{x:1,y:0},.1);
 assert.ok(first.x<90);
 const second=movement.move(first,{x:1,y:0},.1);
 assert.ok(second.x>first.x);
 const stopped=movement.move(second,{x:0,y:0},.1);
 assert.ok(stopped.x>second.x);
});

test('camera follows with damping and look-ahead',()=>{
 const camera=createCamera({x:0,y:0,followRate:8,lookAhead:20});
 const position=camera.update({x:100,y:50},{x:1,y:0},.1);
 assert.ok(position.x>0&&position.x<120);
});
