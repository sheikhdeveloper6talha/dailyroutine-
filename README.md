# Routine & Budget (React PWA)

React + Vite + IndexedDB (`idb`) + vite-plugin-pwa. Offline-first, data stays on the device.

```bash
npm install
npm run dev                       # development
npm run build && npm run preview  # PWA/service worker works in the built version
```

Deploy `dist/` to any HTTPS host (Netlify, Vercel, GitHub Pages). Open the site on your phone and use "Add to Home Screen" / "Install app".
