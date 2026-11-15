/**
 * Client-Side Security Utilities
 * Provides runtime checks for HTTPS / TLS enforcement, safe external links, and data sanitization.
 */

/**
 * Checks whether the current runtime environment is running in a Secure Context (HTTPS or localhost).
 * @returns {boolean}
 */
export function isSecureContext() {
  if (typeof window === 'undefined') return true;
  return Boolean(window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost');
}

/**
 * Production HTTPS enforcement redirect.
 * Redirects insecure HTTP requests to HTTPS on production hostnames.
 */
export function enforceHttps() {
  if (typeof window === 'undefined') return;

  const isLocal =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.endsWith('.local');

  if (!isLocal && window.location.protocol === 'http:') {
    const secureUrl = 'https://' + window.location.host + window.location.pathname + window.location.search + window.location.hash;
    window.location.replace(secureUrl);
  }
}

/**
 * Returns hardened attributes for external anchor elements (`<a>`),
 * preventing reverse tabnabbing (`noopener`) and referrer leakage (`noreferrer`).
 *
 * @param {string} [relExtra=''] Optional additional rel values
 * @returns {{ target: string, rel: string }}
 */
export function getSecureLinkProps(relExtra = '') {
  const relSet = new Set(['noopener', 'noreferrer', ...relExtra.split(' ').filter(Boolean)]);
  return {
    target: '_blank',
    rel: Array.from(relSet).join(' '),
  };
}

/**
 * Basic string sanitization to escape HTML special characters, preventing XSS injection.
 * @param {unknown} input
 * @returns {string}
 */
export function sanitizeString(input) {
  if (typeof input !== 'string') {
    return input == null ? '' : String(input);
  }
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Performs a runtime security status check.
 * Useful for diagnosing dev/prod security posture.
 * @returns {{ secureContext: boolean, protocol: string, isProduction: boolean, recommendations: string[] }}
 */
export function auditClientSecurity() {
  if (typeof window === 'undefined') {
    return {
      secureContext: true,
      protocol: 'ssr',
      isProduction: false,
      recommendations: [],
    };
  }

  const recommendations = [];
  const secure = isSecureContext();
  const isProd = !['localhost', '127.0.0.1'].includes(window.location.hostname);

  if (!secure && isProd) {
    recommendations.push('Application is running on insecure HTTP in a non-local environment. Enforce TLS/HTTPS immediately.');
  }

  if (window.location.protocol === 'http:' && isProd) {
    recommendations.push('HSTS header or automated HTTPS redirect not detected for this session.');
  }

  return {
    secureContext: secure,
    protocol: window.location.protocol,
    isProduction: isProd,
    recommendations,
  };
}
