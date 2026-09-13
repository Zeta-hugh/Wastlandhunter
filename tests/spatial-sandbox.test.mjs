import assert from 'node:assert/strict';
import test from 'node:test';
import { SANDBOX_SCENE } from '../game/app/spatial-sandbox/scene.js';
import {
  collisionBounds,
  createSpatialObject,
  depthKey,
  intersectsCollision,
  sortSpatialObjects,
  visualPlacement
} from '../game/app/spatial-sandbox/model.js';
import { createCamera } from '../game/app/core/camera.js';
import { createProjection } from '../game/app/core/projection.js';

const byId=id=>SANDBOX_SCENE.find(object=>object.id===id);

test('sandbox covers required spatial fixtures',()=>{
 assert.equal(SANDBOX_SCENE.length,13);
 assert.ok(byId('tall-wall'));
 assert.ok(byId('foreground-fence'));
 assert.ok(byId('elevated-platform'));
 assert.ok(byId('bridge-over'));
 assert.ok(byId('bridge-under'));
});

test('Y-sort and elevation ordering are reproducible',()=>{
 const ordered=sortSpatialObjects(SANDBOX_SCENE).map(object=>object.id);
 assert.ok(ordered.indexOf('actor-ground')<ordered.indexOf('normal-crate'));
 assert.ok(ordered.indexOf('actor-behind-wall')<ordered.indexOf('tall-wall'));
 assert.ok(ordered.indexOf('elevated-platform')<ordered.indexOf('actor-elevated'));
 assert.ok(ordered.indexOf('actor-under-bridge')<ordered.indexOf('bridge-over'));
 assert.ok(ordered.indexOf('foreground-fence')<ordered.indexOf('actor-front'));
 assert.equal(depthKey(byId('actor-elevated')),depthKey(byId('elevated-platform'))+10);
});

test('visual placement is independent from collision footprint',()=>{
 const object=createSpatialObject({
  id:'pivot-test',worldX:100,worldY:200,visualZ:25,pivot:[40,80],
  groundContact:[40,80],collisionFootprint:{x:-8,y:-6,w:16,h:12}
 });
 const movedPivot=createSpatialObject({...object,pivot:[5,10]});
 assert.notDeepEqual(visualPlacement(object),visualPlacement(movedPivot));
 assert.deepEqual(collisionBounds(object),collisionBounds(movedPivot));
 assert.equal(intersectsCollision(object,movedPivot),true);
});

test('visual height does not create floating collision or move ground contact',()=>{
 const low=createSpatialObject({
  id:'low',worldX:20,worldY:30,visualZ:0,height:20,pivot:[10,20],groundContact:[10,20],
  collisionFootprint:{x:-5,y:-5,w:10,h:10}
 });
 const tall=createSpatialObject({...low,id:'tall',height:120,visualZ:0});
 assert.deepEqual(collisionBounds(low),collisionBounds(tall));
 assert.deepEqual(visualPlacement(low),visualPlacement(tall));
});

test('current camera can display sandbox world coordinates',()=>{
 const camera=createCamera({x:640,y:360,followRate:8});
 const projection=createProjection(camera.position);
 camera.update({x:900,y:300},{x:0,y:0},1);
 const point=projection.worldToScreen(byId('elevated-platform').worldX,byId('elevated-platform').worldY,byId('elevated-platform').visualZ);
 assert.ok(Number.isFinite(point.x)&&Number.isFinite(point.y));
 assert.ok(point.x>0&&point.x<1280);
 assert.ok(point.y>0&&point.y<720);
});
