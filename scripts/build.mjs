import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import vm from 'node:vm';

export const root = fileURLToPath(new URL('../', import.meta.url));
export async function build() {
  const sources = JSON.parse(await readFile(resolve(root, 'game/sources.json'), 'utf8'));
  const code = (await Promise.all(sources.map(path => readFile(resolve(root, path), 'utf8')))).join('');
  // Keep one classic-script scope until the historical override chain is migrated.
  new vm.Script(code, { filename: 'game.js' });
  const out = resolve(root, 'dist');
  await mkdir(out, { recursive: true });
  await writeFile(resolve(out, 'game.js'), code);
  await cp(resolve(root, 'index.html'), resolve(out, 'index.html'));
  await cp(resolve(root, 'assets'), resolve(out, 'assets'), { recursive: true });
  return out;
}

export function serve(out, port = 5173) {
  out = resolve(out);
  const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.webp': 'image/webp' };
  const server = createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const path = resolve(out, '.' + (pathname === '/' ? '/index.html' : pathname));
      if (!path.startsWith(out + '/')) { res.writeHead(403).end(); return; }
      const data = await readFile(path);
      res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(data);
    } catch { res.writeHead(404).end('Not found'); }
  });
  server.listen(port, '127.0.0.1');
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = await build();
  console.log('Built dist/ from game/sources.json');
  if (process.argv.includes('--serve')) {
    serve(out);
    console.log('Development preview: http://127.0.0.1:5173 (rerun npm run build after edits)');
  }
}
