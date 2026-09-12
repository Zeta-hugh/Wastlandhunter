import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { once } from 'node:events';
import { build, serve, root } from '../scripts/build.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const server = serve(await build(), 0);
await once(server, 'listening');
const url = `http://127.0.0.1:${server.address().port}`;
const artifacts = resolve(root, 'artifacts/runtime-qa');
await mkdir(artifacts, { recursive: true });
let browser;
const errors = [];
try {
  browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const legacyServer = serve(root, 0);
  await once(legacyServer, 'listening');
  try {
    const legacyPage = await browser.newPage();
    const legacyErrors = [];
    legacyPage.on('pageerror', error => legacyErrors.push(error.stack || error.message));
    await legacyPage.goto(`http://127.0.0.1:${legacyServer.address().port}/legacy/WastelandHunter_CanonBuild_0.23.0_single.html?debug=rustport`);
    await legacyPage.waitForTimeout(800);
    assert.ok(legacyErrors.some(error => error.includes('v8BuildingPalette')), 'Untouched legacy reproduces the missing-building-palette crash');
    await legacyPage.close();
  } finally { await new Promise(resolve => legacyServer.close(resolve)); }
  const context = await browser.newContext({ viewport: { width: 960, height: 540 } });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.stack || error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto(url);
  await page.waitForFunction(() => typeof state !== 'undefined' && state.v22 && Object.values(V18_IMG).every(im => im.complete && im.naturalWidth));
  await page.waitForTimeout(600);
  const fresh = await page.evaluate(() => ({ field: state.fieldId, tank: state.v12.tankUnlocked, version: state.saveVersion }));
  assert.equal(fresh.field, 'origin_tidecamp');
  assert.equal(fresh.tank, false);
  // The late v22 normalizer overwrites the earlier Canon saveVersion=23.
  // Preserve and document this legacy behavior during mechanical extraction.
  assert.equal(fresh.version, 22);
  await page.screenshot({ path: resolve(artifacts, '00-origin.png') });
  await page.evaluate(() => { closeDialogue(); mode = 'play'; });
  const before = await page.evaluate(() => state.player.x);
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(200);
  await page.keyboard.up('ArrowRight');
  assert.notEqual(await page.evaluate(() => state.player.x), before);
  await page.evaluate(() => {
    state.gold = 1234;
    state.v22.choices.med = 'clinic';
    state.v19.memories.origin = true;
    saveSilently();
  });
  await page.reload();
  await page.waitForTimeout(500);
  assert.deepEqual(await page.evaluate(() => [state.gold, state.v22.choices.med, state.v19.memories.origin, state.v12.tankUnlocked]), [1234, 'clinic', true, false]);
  // Verify the existing V7-key fallback, without claiming coverage of all historical schemas.
  await page.evaluate(() => {
    localStorage.setItem('wastelandHunterV7', localStorage.getItem('wastelandHunterV8'));
    localStorage.removeItem('wastelandHunterV8');
  });
  await page.reload();
  await page.waitForTimeout(500);
  assert.equal(await page.evaluate(() => state.gold), 1234);

  // QA scene setup only: these captures document the existing visual baseline.
  await page.goto(url + '/?debug=rustport');
  await page.waitForTimeout(700);
  await page.evaluate(() => {
    state.v12.originComplete = true;
    state.v12.tankUnlocked = true;
    state.v12.starterRepaired = true;
    state.party.liuyan = true;
    mode = 'play';
    updateHud();
  });
  await page.waitForTimeout(100);
  await page.screenshot({ path: resolve(artifacts, '01-rustport.png') });
  await page.evaluate(() => { state.scene = 'world'; state.player.x = 520; state.player.y = 430; mode = 'play'; });
  await page.waitForTimeout(100);
  await page.screenshot({ path: resolve(artifacts, '02-world.png') });
  await page.evaluate(() => { state.scene = 'town'; state.player.inTank = false; enterInterior('tavern'); });
  await page.waitForTimeout(300);
  await page.evaluate(() => { closeDialogue(); mode = 'play'; });
  await page.waitForTimeout(100);
  await page.screenshot({ path: resolve(artifacts, '03-tavern.png') });
  await page.evaluate(() => openDialogue([['柳焰', '从今天起，没有人会替你决定接哪张悬赏。']]));
  await page.waitForTimeout(100);
  await page.screenshot({ path: resolve(artifacts, '04-liuyan.png') });
  await page.evaluate(() => { closeDialogue(); mode = 'play'; enterInterior('garage'); });
  await page.waitForTimeout(300);
  await page.evaluate(() => { closeDialogue(); mode = 'play'; });
  await page.waitForTimeout(100);
  await page.screenshot({ path: resolve(artifacts, '05-garage.png') });
  await page.evaluate(() => {
    Math.random = () => 0.5;
    state.player.inTank = true;
    startBattle({ name: TOWNS[0].boss, hp: BOSS_STATS[0].hp, atk: BOSS_STATS[0].atk, boss: true, reward: BOSS_STATS[0].bounty, town: 0 });
  });
  await page.waitForTimeout(200);
  await page.screenshot({ path: resolve(artifacts, '06-iron-hound.png') });
  const hp = await page.evaluate(() => battle.enemy.hp);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(900);
  assert.ok(await page.evaluate(() => battle.enemy.hp) < hp);
  assert.deepEqual(errors, []);
  await writeFile(resolve(artifacts, 'checks.json'), JSON.stringify({ freshStart: fresh, movement: true, saveReload: true, v7KeyFallback: true, combat: true, runtimeErrors: errors, screenshots: 7 }, null, 2));
  console.log('PASS: origin, movement, save/reload, V7 fallback, combat, asset loading; seven runtime QA screenshots.');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
