#!/usr/bin/env python3
"""Verify downloaded external packs and build their offline browsing index.

Does not alter production manifests or image pixels. Original model dependency
paths are preserved; only self-contained GLB files receive normalized copies.
"""
import hashlib
import html
import json
import struct
import zipfile
from collections import Counter
from pathlib import Path
from urllib.parse import quote, unquote
from PIL import Image

ROOT = Path(__file__).resolve().parents[2] / 'external_assets'

def digest(data):
    return hashlib.sha256(data).hexdigest()

def glb_document(data):
    magic, version, length = struct.unpack_from('<4sII', data)
    assert magic == b'glTF' and version == 2 and length == len(data)
    size, kind = struct.unpack_from('<I4s', data, 12)
    assert kind == b'JSON'
    return json.loads(data[20:20 + size])

def main():
    packs, errors, cards = [], [], []
    counts = Counter()
    for catalog in sorted(ROOT.glob('*/*/catalog.json')):
        pack = json.loads(catalog.read_text())
        archive = ROOT / pack['archive']
        try:
            assert digest(archive.read_bytes()) == pack['archive_sha256']
            if archive.suffix == '.zip':
                with zipfile.ZipFile(archive) as z:
                    assert z.testzip() is None
            for evidence in pack['license_files']:
                assert (ROOT / evidence).is_file(), evidence
            keys = set()
            for entry in pack['files']:
                path = ROOT / entry['original_path']
                data = path.read_bytes()
                assert digest(data) == entry['sha256'], str(path)
                assert entry['asset_key'] not in keys, entry['asset_key']
                keys.add(entry['asset_key'])
                counts['original_files'] += 1
                ext = path.suffix.lower()
                if ext in {'.png', '.jpg', '.jpeg'}:
                    with Image.open(path) as image:
                        entry['image_size'] = list(image.size)
                        entry['image_mode'] = image.mode
                        if 'A' in image.getbands():
                            entry['alpha_range'] = list(image.getchannel('A').getextrema())
                        image.load()
                    counts['images_checked'] += 1
                if ext in {'.glb', '.gltf'}:
                    doc = glb_document(data) if ext == '.glb' else json.loads(data)
                    uris = [x['uri'] for k in ('buffers', 'images') for x in doc.get(k, [])
                            if 'uri' in x and not x['uri'].startswith('data:')]
                    for uri in uris:
                        assert (path.parent / unquote(uri)).is_file(), f'missing model dependency: {path} -> {uri}'
                    counts['gltf_checked'] += 1
                    if ext == '.glb' and not uris:
                        named = catalog.parent / 'named_models' / (entry['asset_key'][:-4] + '.glb')
                        named.parent.mkdir(exist_ok=True)
                        if not named.exists():
                            named.write_bytes(data)
                        entry['named_path'] = str(named.relative_to(ROOT))
                if ext == '.blend':
                    # Some Blender files are gzip-compressed; do not execute them.
                    assert data.startswith((b'BLENDER', b'\x1f\x8b')), str(path)
                    counts['blend_headers_checked'] += 1
                if 'named_path' in entry:
                    assert digest((ROOT / entry['named_path']).read_bytes()) == entry['sha256']
                    counts['normalized_copies'] += 1
            pack['intake_status'] = 'FILES_VERIFIED'
        except Exception as error:
            errors.append(f"{pack['pack_id']}: {error}")
            pack['intake_status'] = 'QA_FAIL'
        if not pack.get('preview'):
            previews = [f['original_path'] for f in pack['files']
                        if Path(f['original_path']).name.lower() in ('preview.png', 'preview.jpg')]
            if previews:
                pack['preview'] = previews[0]
        catalog.write_text(json.dumps(pack, ensure_ascii=False, indent=2) + '\n')
        summary = {k: v for k, v in pack.items() if k != 'files'}
        summary['catalog'] = str(catalog.relative_to(ROOT))
        packs.append(summary)
        base = quote(str(catalog.parent.relative_to(ROOT)))
        picture = f'<img loading="lazy" src="{quote(pack["preview"])}" alt="{html.escape(pack["pack_id"])}">' if pack.get('preview') else ''
        links = ''.join(f'<a href="{quote(f["named_path"] if "named_path" in f else f["original_path"])}">{html.escape(f["asset_key"])}</a><br>' for f in pack['files'])
        (catalog.parent / 'files.html').write_text('<!doctype html><meta charset="utf-8"><title>Asset files</title><h1>' + html.escape(pack['pack_id']) + '</h1><p>Source filenames and normalized aliases: <a href="catalog.json">catalog.json</a></p>' + links.replace('href="', 'href="../../'), encoding='utf-8')
        cards.append(f'<article data-search="{html.escape(pack["category"]+" "+pack["pack_id"]+" "+pack.get("usage_cn",pack["usage"]))}"><div class="image">{picture}</div><h2>{html.escape(pack["pack_id"])}</h2><p>{html.escape(pack["category"])} · {pack["file_count"]} 原始文件 · CC0</p><strong>{html.escape(pack.get("decision_cn",pack["decision"]))}</strong><p>{html.escape(pack.get("usage_cn",pack["usage"]))}</p><p><a href="{base}/files.html">浏览文件</a> · <a href="{base}/catalog.json">来源与命名映射</a> · <a href="{html.escape(pack["source_url"])}">作者页面</a></p></article>')
    report = {'result': 'PASS' if not errors else 'FAIL', 'packs': len(packs), 'counts': dict(counts), 'errors': errors,
              'limitations': ['Files and GLB/glTF dependency checks only; OBJ/FBX/BLEND rendering is not verified.', 'No asset is promoted to production QA_PASS.', 'File counts include formats, textures, previews and documentation, not unique designs.']}
    (ROOT / 'catalog.json').write_text(json.dumps({'schema_version': '1.0', 'date': '2026-09-14', 'packs': packs}, ensure_ascii=False, indent=2) + '\n')
    (ROOT / 'validation.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    (ROOT / 'index.html').write_text('''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>锈港共享素材库</title><style>
body{margin:0;background:#172124;color:#e8e1d5;font:15px system-ui}header{padding:28px 36px;border-bottom:1px solid #506064}h1{margin:0;font-size:28px}input{padding:12px;width:min(580px,90%);margin-top:14px;font:inherit}main{padding:24px;display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:18px}article{padding:18px;background:#243135;border:1px solid #4b5759;border-radius:8px}article[hidden]{display:none}h2{font-size:16px;overflow-wrap:anywhere}a{color:#e9b776}.image{height:180px;background:#f1f1ef;display:flex;justify-content:center}.image img{max-width:100%;height:100%;object-fit:contain}p{line-height:1.6}strong{color:#dfb179}
</style><header><h1>锈港 · 共享素材库</h1><p>本地分类资源与用途决策。预览来自作者；下载完成不等于正式画面验收。<a href="README_CN.md">使用说明</a> · <a href="validation.json">验证记录</a></p><input id="filter" placeholder="搜索：坦克、房屋、地图、武器、植被…" aria-label="搜索素材"></header><main>''' + ''.join(cards) + '''</main><script>document.querySelector('#filter').addEventListener('input',event=>{const q=event.target.value.toLowerCase();document.querySelectorAll('article').forEach(card=>card.hidden=!card.dataset.search.toLowerCase().includes(q))})</script></html>''', encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return int(bool(errors))

if __name__ == '__main__':
    raise SystemExit(main())
