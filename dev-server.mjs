import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const port = Number(process.env.PORT || 4173);
const root = process.cwd();
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8'
};

createServer(async (request, response) => {
  try {
    const rawPath = decodeURIComponent((request.url || '/').split('?')[0]);
    const safePath = normalize(rawPath).replace(/^(\.\.[/\\])+/, '');
    const filePath = join(root, safePath === '/' ? 'index.html' : safePath);
    const body = await readFile(filePath);
    response.writeHead(200, { 'Content-Type': mime[extname(filePath)] || 'application/octet-stream' });
    response.end(body);
  } catch {
    const body = await readFile(join(root, 'index.html'));
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(body);
  }
}).listen(port, () => {
  console.log(`DEV Learning Lab is ready at http://localhost:${port}`);
});
