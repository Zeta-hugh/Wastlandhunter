/* Production asset lookup. Paths and render metadata come only from data/asset_manifest.json. */
class ProductionAssetRegistry {
 constructor(manifestUrl='data/asset_manifest.json') {
  this.manifestUrl=manifestUrl;
  this.records=new Map();
  this.images=new Map();
  this.loaded=false;
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

 get(assetId,{allowIncomplete=false}={}) {
  if(!this.loaded)throw new Error(`AssetRegistry is not ready while resolving ${assetId}`);
  const record=this.records.get(assetId);
  if(!record)throw new Error(`Unknown production asset_id: ${assetId}`);
  if(!allowIncomplete&&record.status!=='QA_PASS')throw new Error(`Production asset ${assetId} is ${record.status}, expected QA_PASS`);
  return record;
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
