const SCENE_SCHEMA='1.0';

export async function loadSceneDefinition(sceneUrl='data/rustport_scene.json',bindingsUrl='data/asset_bindings.json'){
 const [sceneResponse,bindingsResponse]=await Promise.all([
  fetch(sceneUrl,{cache:'no-store'}),
  fetch(bindingsUrl,{cache:'no-store'})
 ]);
 if(!sceneResponse.ok)throw new Error(`Asset scene load failed: ${sceneResponse.status} ${sceneUrl}`);
 if(!bindingsResponse.ok)throw new Error(`Asset bindings load failed: ${bindingsResponse.status} ${bindingsUrl}`);
 const [scene,bindings]=await Promise.all([sceneResponse.json(),bindingsResponse.json()]);
 if(!scene||scene.schema_version!==SCENE_SCHEMA||!Array.isArray(scene.layers)||!Array.isArray(scene.objects)){
  throw new Error('Asset scene schema is invalid');
 }
 if(!bindings||bindings.schema_version!==SCENE_SCHEMA||!bindings.bindings||typeof bindings.bindings!=='object'){
  throw new Error('Asset bindings schema is invalid');
 }
 const layers=new Set(scene.layers);
 for(const object of scene.objects){
  if(!object?.id||!Array.isArray(object.position)||object.position.length!==2){
   throw new Error('Asset scene object requires id and [x, y] position');
  }
  if(!layers.has(object.depth_layer))throw new Error(`Asset scene object ${object.id} uses unknown depth_layer ${object.depth_layer}`);
  const assetIds=bindings.bindings[object.binding];
  if(!Array.isArray(assetIds)||assetIds.length===0)throw new Error(`Asset scene object ${object.id} references unknown binding ${object.binding}`);
  if(object.asset_id&&!assetIds.includes(object.asset_id)){
   throw new Error(`Asset scene object ${object.id} asset_id is not in binding ${object.binding}`);
  }
 }
 return Object.freeze(scene);
}
