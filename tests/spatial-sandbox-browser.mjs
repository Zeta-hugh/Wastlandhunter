import assert from 'node:assert/strict';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { build, serve } from '../scripts/build.mjs';
import { createRequire } from 'node:module';

const require=createRequire(import.meta.url);
const { chromium }=require('playwright');
const server=serve(await build(),0);
await once(server,'listening');
let browser;
try{
 browser=await chromium.launch({headless:true,channel:'chrome'});
 const page=await browser.newPage({viewport:{width:1200,height:700},deviceScaleFactor:1});
 const errors=[];
 page.on('pageerror',error=>errors.push(error.stack||error.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/game/app/spatial-sandbox/index.html`);
 await page.waitForFunction(()=>globalThis.__SPATIAL_TEST__);
 await page.waitForTimeout(1000);
 const stats=await page.evaluate(()=>globalThis.__SPATIAL_TEST__.stats());
 assert.equal(errors.length,0);
 assert.equal(await page.locator('canvas').count(),1);
 assert.equal(await page.evaluate(()=>globalThis.__SPATIAL_TEST__.scene.length),13);
 assert.ok(stats.frameCount>=45,`expected at least 45 FPS, got ${stats.frameCount}`);
 assert.equal(stats.drawCount,stats.frameCount);
 await page.screenshot({path:fileURLToPath(new URL('../qa/runtime_previews/2_5d_spatial_sandbox.png',import.meta.url))});
 console.log(`PASS: 2.5D sandbox rendered 13 objects at ${stats.frameCount} FPS-equivalent with ${stats.drawCount} draws.`);
}finally{
 await browser?.close();
 await new Promise(resolve=>server.close(resolve));
}
