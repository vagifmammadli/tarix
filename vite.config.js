import { defineConfig } from 'vite';
import { createReadStream, existsSync, cpSync, mkdirSync } from 'node:fs';
import { resolve, sep } from 'node:path';

const models = resolve('assets/3d');
export default defineConfig({
  base: './',
  plugins: [{
    name: 'local-museum-models',
    configureServer(server) {
      server.middlewares.use('/models', (req, res, next) => {
        let pathname;
        try { pathname = decodeURIComponent((req.url || '').split('?')[0]); } catch { res.statusCode = 400; return res.end(); }
        const path = resolve(models, '.' + pathname);
        if (!path.startsWith(models + sep) || !existsSync(path) || !/\.(glb|stl|md)$/.test(path)) return next();
        res.setHeader('Content-Type', path.endsWith('.glb') ? 'model/gltf-binary' : path.endsWith('.stl') ? 'model/stl' : 'text/plain; charset=utf-8');
        createReadStream(path).pipe(res);
      });
    },
    closeBundle() { mkdirSync('dist/models', { recursive: true }); cpSync(models, 'dist/models', { recursive: true }); },
  }],
  build: { rollupOptions: { output: { manualChunks: { three: ['three'] } } } },
});
