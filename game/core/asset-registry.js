/* Production asset lookup. Paths and render metadata come only from data/asset_manifest.json. */
class ProductionAssetRegistry {
 constructor(manifestUrl='data/asset_manifest.json',bindingsUrl='data/asset_bindings.json') {
  this.manifestUrl=manifestUrl;
  this.bindingsUrl=bindingsUrl;
  this.records=new Map();
  this.images=new Map();
  this.bindings=new Map();
   this.scene=null;
  this.loaded=false;
  this.bindingsLoaded=false;
 }

 async loadBindings() {
  if(!this.loaded)await this.load();
  const response=await fetch(this.bindingsUrl,{cache:'no-store'});
  if(!response.ok)throw new Error(`Asset bindings load failed: ${response.status} ${this.bindingsUrl}`);
  const data=await response.json();
  if(!data||data.schema_version!=='1.0'||!data.bindings||typeof data.bindings!=='object')throw new Error('Asset bindings schema is invalid');
  for(const [binding,assetIds] of Object.entries(data.bindings)){
   if(!Array.isArray(assetIds)||assetIds.length===0)throw new Error(`Asset binding ${binding} must contain asset_ids`);
   for(const assetId of assetIds)if(!this.records.has(assetId))throw new Error(`Asset binding ${binding} references unknown production asset_id: ${assetId}`);
   this.bindings.set(binding,Object.freeze([...assetIds]));
  }
  this.bindingPlan=Object.freeze(data.planned_bindings||{});
  this.bindingsLoaded=true;
  return this;
 }

 async load() {
  const response=await fetch(this.manifestUrl,{cache:'no-store'});
  if(!response.ok)throw new Error(`Asset manifest load failed: ${response.status} ${this.manifestUrl}`);
  const manifest=await response.json();
  if(!manifest||manifest.schema_version!=='1.0'||!Array.isArray(manifest.assets))throw new Error('Asset manifest schema is invalid');
  for(const record of manifest.assets){
   if(!record.asset_id)throw new Error('Asset manifest contains a record without asset_id');
   if(this.records.has(record.asset_id))throw new Error(`Duplicate production asset_id: ${record.asset_id}`);
   this.records.set(record.asset_id,Object.freeze(record));
  }

  this.manifest=Object.freeze(manifest);
  this.loaded=true;
  return this;
 }

 async loadScene(sceneUrl='data/rustport_scene.json') {
  if(!this.bindingsLoaded)await this.loadBindings();
  const response=await fetch(sceneUrl,{cache:'no-store'});
  if(!response.ok)throw new Error(`Asset scene load failed: ${response.status} ${sceneUrl}`);
  const scene=await response.json();
  if(!scene||scene.schema_version!=='1.0'||!Array.isArray(scene.layers)||!Array.isArray(scene.objects)){
   throw new Error('Asset scene schema is invalid');
  }
  const layers=new Set(scene.layers);
  for(const object of scene.objects){
   if(!object?.id||!Array.isArray(object.position)||object.position.length!==2){
    throw new Error('Asset scene object requires id and [x, y] position');
   }
   if(!layers.has(object.depth_layer))throw new Error(`Asset scene object ${object.id} uses unknown depth_layer ${object.depth_layer}`);
   if(!this.bindings.has(object.binding))throw new Error(`Asset scene object ${object.id} references unknown binding ${object.binding}`);
   if(object.asset_id&&!this.bindings.get(object.binding).includes(object.asset_id)){
    throw new Error(`Asset scene object ${object.id} asset_id is not in binding ${object.binding}`);
   }
  }
  this.scene=Object.freeze(scene);
  return this.scene;
 }

 get(assetId,{allowIncomplete=false}={}) {
  if(!this.loaded)throw new Error(`AssetRegistry is not ready while resolving ${assetId}`);
  const record=this.records.get(assetId);
  if(!record)throw new Error(`Unknown production asset_id: ${assetId}`);
  if(!allowIncomplete&&record.status!=='QA_PASS')throw new Error(`Production asset ${assetId} is ${record.status}, expected QA_PASS`);
  return record;
 }

 resolve(binding,{allowIncomplete=false}={}) {
  if(!this.bindingsLoaded)throw new Error(`AssetRegistry bindings are not ready while resolving ${binding}`);
  const assetIds=this.bindings.get(binding);
  if(!assetIds)throw new Error(`Unknown production asset binding: ${binding}`);
  return assetIds.map(assetId=>this.get(assetId,{allowIncomplete}));
 }

 async preload(binding,{allowIncomplete=false}={}) {
  const records=this.resolve(binding,{allowIncomplete});
  await Promise.all(records.filter(record=>record.runtime.endsWith('.png')).map(record=>{
   const image=new Image();
   this.images.set(record.asset_id,image);
   return this.bindImage(record.asset_id,image);
  }));
  return records;
 }

 bindImage(assetId,image) {
  const record=this.get(assetId);
  if(!record.runtime.endsWith('.png'))throw new Error(`Production image ${assetId} must use PNG runtime data`);
  image.decoding='async';
  image.dataset.assetId=assetId;
  return new Promise((resolve,reject)=>{
   image.onload=()=>resolve(image);
   image.onerror=()=>reject(new Error(`Production asset file failed to load: ${record.runtime}`));
   image.src=record.runtime;
  });
 }

 image(assetId) {
  if(this.images.has(assetId))return this.images.get(assetId);
  const image=new Image();
  this.images.set(assetId,image);
  this.bindImage(assetId,image).catch(error=>setTimeout(()=>{throw error},0));
  return image;
 }
}

const AssetRegistry=new ProductionAssetRegistry();
const ASSET_REGISTRY_READY=AssetRegistry.load();
const ASSET_BINDINGS_READY=ASSET_REGISTRY_READY.then(()=>AssetRegistry.loadBindings());
globalThis.AssetRegistry=AssetRegistry;
globalThis.ASSET_REGISTRY_READY=ASSET_REGISTRY_READY;
globalThis.ASSET_BINDINGS_READY=ASSET_BINDINGS_READY;
