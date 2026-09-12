import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { build, root } from '../scripts/build.mjs';

test('migration preserves original source except the documented building-palette fix', async () => {
  const legacy = await readFile(resolve(root, 'legacy/WastelandHunter_CanonBuild_0.23.0_single.html'), 'utf8');
  assert.equal(createHash('sha256').update(legacy).digest('hex'), '4f09c32813dab16f79ab7a6b2dc06ad2768c10538dc6dc9b3326d0667278b65a');
  const out = await build();
  let code = await readFile(resolve(out, 'game.js'), 'utf8');
  const rustportEnhancement = await readFile(resolve(root, 'game/maps/rustport-visual.js'), 'utf8');
  assert.ok(code.endsWith(rustportEnhancement));
  code = code.slice(0, -rustportEnhancement.length);
  const assetRegistry = await readFile(resolve(root, 'game/core/asset-registry.js'), 'utf8');
  assert.equal(code.split(assetRegistry).length, 2);
  code = code.replace(assetRegistry, '');
  const fixedPalette = "clinic:['#66787b','#30393b'],inn:['#6a4f3b','#271d1a'],house:['#675646','#3b3933'],warehouse:['#535b59','#262a2a']}[b.id]";
  assert.equal(code.split(fixedPalette).length, 2);
  code = code.replace(fixedPalette, "clinic:['#66787b','#30393b']}[b.id]");
  const assets = JSON.parse(await readFile(resolve(root, 'assets/legacy/manifest.json'), 'utf8'));
  assert.equal(assets.length, 16);
  for (const asset of assets) {
    const bytes = await readFile(resolve(out, asset.path));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256);
    const mime = asset.path.split('.').pop();
    code = code.replaceAll(asset.path, `data:image/${mime};base64,${bytes.toString('base64')}`);
  }
  assert.equal(code, legacy.match(/<script>([\s\S]*?)<\/script>/)[1]);
  const css = await readFile(resolve(out, 'assets/ui/game.css'), 'utf8');
  const html = await readFile(resolve(out, 'index.html'), 'utf8');
  assert.equal(html.replace('<link rel="stylesheet" href="assets/ui/game.css">', () => `<style>${css}</style>`).replace('<script src="game.js"></script>', () => `<script>${code}</script>`), legacy);
});
