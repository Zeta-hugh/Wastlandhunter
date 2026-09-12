import { cp, mkdir, rm, rename } from 'node:fs/promises';
import { resolve } from 'node:path';
import { build, root } from './build.mjs';

const source=await build();
const target=resolve(root,'dist-next');
await rm(target,{recursive:true,force:true});
await mkdir(target,{recursive:true});
await cp(source,target,{recursive:true});
await rename(resolve(target,'next.html'),resolve(target,'index.html'));
console.log('Built dist-next/ from the independent next runtime');
