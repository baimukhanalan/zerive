// Post-export web patch. Expo's `output: "single"` emits a minimal index.html
// and ignores +html.tsx, so we inject PWA metadata + the service-worker
// registration into the built dist/index.html here. Run after `expo export`.

import fs from 'node:fs';
import path from 'node:path';

// ── Fix asset paths that live under `node_modules` ──────────────────────────
// Vercel drops any `node_modules` directory from static deployments, so the
// bundled fonts (assets/node_modules/@expo-google-fonts/...) 404. Rename the
// folder to `deps` and rewrite the references baked into the JS bundle.
const assetsDir = path.resolve('dist/assets');
const oldDir = path.join(assetsDir, 'node_modules');
const newDir = path.join(assetsDir, 'deps');
if (fs.existsSync(oldDir)) {
  fs.rmSync(newDir, { recursive: true, force: true });
  fs.renameSync(oldDir, newDir);
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(js|css|map)$/.test(e.name)) {
        const before = fs.readFileSync(p, 'utf8');
        if (before.includes('assets/node_modules')) {
          fs.writeFileSync(p, before.split('assets/node_modules').join('assets/deps'));
        }
      }
    }
  };
  walk(path.resolve('dist/_expo'));
  console.log('remapped assets/node_modules → assets/deps (Vercel-safe fonts)');
}

const file = path.resolve('dist/index.html');
let html = fs.readFileSync(file, 'utf8');

html = html.replace('<html lang="en">', '<html lang="ru">');

// App-like viewport (safe-area aware, no zoom).
html = html.replace(
  /<meta name="viewport"[^>]*>/,
  '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />',
);

const HEAD = `
    <link rel="manifest" href="/manifest.json" />
    <meta name="description" content="Preventive health for Kazakhstan — one blood draw, a clear picture of your body, and a plan to improve it." />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="ZERIVE" />
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
    <style id="zerive-noflash">:root{color-scheme:light}html,body{background-color:#EFECE6}body{overscroll-behavior-y:none}</style>
`;

if (!html.includes('rel="manifest"')) {
  html = html.replace('</head>', `${HEAD}</head>`);
}

const SW = `
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
          navigator.serviceWorker.register('/sw.js').catch(function () {});
        });
      }
    </script>
`;

if (!html.includes("serviceWorker.register")) {
  html = html.replace('</body>', `${SW}</body>`);
}

fs.writeFileSync(file, html);
console.log('patched dist/index.html — PWA head + service worker injected');
