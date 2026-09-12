const LOAD_TIMEOUT_MS=15000;

export async function loadProductionAssets(manifestUrl='data/asset_manifest.json',requiredAssetIds=[]){
 const controller=new AbortController();
 const timeout=setTimeout(()=>controller.abort(),LOAD_TIMEOUT_MS);
 let response;
 try{response=await fetch(manifestUrl,{cache:'no-store',signal:controller.signal})}
 finally{clearTimeout(timeout)}
 if(!response.ok)throw new Error(`Production manifest load failed: ${response.status}`);
 const manifest=await response.json();
 const records=new Map(manifest.assets.filter(record=>record.status==='QA_PASS').map(record=>[record.asset_id,record]));
 const missing=requiredAssetIds.filter(assetId=>!records.has(assetId));
 if(missing.length)throw new Error(`Production assets are not QA_PASS: ${missing.join(', ')}`);
 const images=new Map();
 await Promise.all([...records].map(async([assetId,record])=>{
  const image=new Image();
  image.decoding='async';
  await new Promise((resolve,reject)=>{
   const timeout=setTimeout(()=>reject(new Error(`Production asset timed out: ${record.runtime}`)),LOAD_TIMEOUT_MS);
   image.onload=resolve;
   image.onerror=()=>reject(new Error(`Production asset failed to load: ${record.runtime}`));
   image.addEventListener('load',()=>clearTimeout(timeout),{once:true});
   image.addEventListener('error',()=>clearTimeout(timeout),{once:true});
   image.src=record.runtime;
  });
  images.set(assetId,image);
 }));
 return {
  get(assetId){
   const image=images.get(assetId);
   if(!image)throw new Error(`Production asset ${assetId} is not QA_PASS`);
   return image;
  },
  has(assetId){return images.has(assetId)}
 };
}
