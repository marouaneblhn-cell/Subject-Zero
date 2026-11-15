/**
 * Security Protocols & Configuration Module
 * Exports Row-Level Security (RLS) standards and Transport Layer Security (TLS) configurations.
 */

// TLS & HTTP Security Headers
export {
  SECURITY_HEADERS,
  getVercelHeadersConfig,
  getNetlifyHeadersString,
  securityHeadersMiddleware,
  viteSecurityHeadersPlugin,
} from './securityHeaders.js';

// Client-side Security & Runtime Utilities
export {
  isSecureContext,
  enforceHttps,
  getSecureLinkProps,
  sanitizeString,
  auditClientSecurity,
} from './securityUtils.js';

// Row-Level Security (RLS) Constants and Roles
export const RLS_ROLES = {
  ANON: 'anon',
  AUTHENTICATED: 'authenticated',
  USER: 'user',
  EDITOR: 'editor',
  ADMIN: 'admin',
  SERVICE_ROLE: 'service_role',
};

export const RLS_OPERATIONS = {
  SELECT: 'SELECT',
  INSERT: 'INSERT',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  ALL: 'ALL',
};
