/**
 * Production-Ready HTTP Security Headers Configuration
 * Enforces TLS/HTTPS, Content Security Policy, and Frame Sandboxing.
 */

export const SECURITY_HEADERS = {
  // HTTP Strict Transport Security (HSTS)
  // Enforces HTTPS for 2 years across all subdomains and authorizes preload list inclusion
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',

  // Prevent MIME-sniffing
  'X-Content-Type-Options': 'nosniff',

  // Clickjacking protection: disallow framing in iframes
  'X-Frame-Options': 'DENY',

  // Control referrer information sent in request headers
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Restrict sensitive browser hardware APIs
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',

  // Cross-Origin Isolation & Isolation policies
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',

  // Modern Content Security Policy tailored for React + Vite + Framer Motion
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'", // Note: unsafe-inline permitted for Vite HMR in dev; replace with hashes/nonces in production SSR
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https: wss:",
    "media-src 'self' https:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; '),
};

/**
 * Generates header entries for vercel.json
 * @returns {Array<{source: string, headers: Array<{key: string, value: string}>}>}
 */
export function getVercelHeadersConfig() {
  return [
    {
      source: '/(.*)',
      headers: Object.entries(SECURITY_HEADERS).map(([key, value]) => ({
        key,
        value,
      })),
    },
  ];
}

/**
 * Generates string content for Netlify `_headers` file
 * @returns {string}
 */
export function getNetlifyHeadersString() {
  const lines = ['/*'];
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    lines.push(`  ${key}: ${value}`);
  }
  return lines.join('\n');
}

/**
 * Node.js / Express compatible middleware
 */
export function securityHeadersMiddleware(req, res, next) {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    res.setHeader(key, value);
  }
  if (typeof next === 'function') {
    next();
  }
}

/**
 * Vite Dev Server & Preview security headers plugin
 */
export function viteSecurityHeadersPlugin() {
  return {
    name: 'vite-plugin-security-headers',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
          res.setHeader(key, value);
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
          res.setHeader(key, value);
        }
        next();
      });
    },
  };
}
