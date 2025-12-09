import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === 'production';
const app = express();

async function start() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: 'ssr' },
      appType: 'custom'
    });

    app.use(vite.middlewares);

    app.get('*', async (req, res) => {
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);

        const mod = await vite.ssrLoadModule('/src/server/entry-server.tsx');
        const appHtml = mod.render(url);

        const html = template.replace('<!--ssr-outlet-->', appHtml);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        console.error(e);
        res.status(500).end(e.stack);
      }
    });
  } else {
    // Production: serve built client and use server bundle to render
    app.use(express.static(path.resolve(__dirname, 'dist/client')));

    app.get('*', async (req, res) => {
      try {
        const url = req.originalUrl;
        const template = fs.readFileSync(path.resolve(__dirname, 'dist/client/index.html'), 'utf-8');
        const { render } = await import(path.resolve(__dirname, 'dist/server/entry-server.js'));
        const appHtml = render(url);
        const html = template.replace('<!--ssr-outlet-->', appHtml);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        console.error(e);
        res.status(500).end(e.stack);
      }
    });
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running: http://localhost:${port}`);
  });
}

start();
