import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

// Content Security Policy, added to production builds only (the dev server injects inline scripts).
// The same policy is also sent as a header by Caddy (deploy/aws/Caddyfile.poelys). Scripts: this site and Google's Firebase only.
const CSP = [
  "default-src 'self'",
  "script-src 'self' https://apis.google.com https://www.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https://i.ytimg.com https://*.googleusercontent.com",
  "connect-src 'self' https://firestore.googleapis.com https://*.googleapis.com",
  "frame-src https:",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ')

const csp = (): Plugin => ({
  name: 'poelys-csp',
  apply: 'build',
  transformIndexHtml: (html) => html.replace('<head>', `<head>\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`),
})

export default defineConfig({
  plugins: [react(), csp()],
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  build: {
    rollupOptions: {
      output: {
        // Keep the Console (and the Firebase SDK it needs) out of the public bundle.
        manualChunks(id) {
          if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) return 'firebase'
        },
      },
    },
  },
})
