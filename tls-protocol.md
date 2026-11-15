# Transport Layer Security (TLS) Protocol Specification

## 1. Executive Summary & Objectives

Transport Layer Security (TLS) provides cryptographic security for communications over computer networks. This specification defines the baseline configuration, cipher restrictions, certificate lifecycle, and transport headers required to ensure:
- **Confidentiality**: Protection against eavesdropping and packet inspection.
- **Integrity**: Detection of message alteration or tampering in transit.
- **Authentication**: Cryptographic verification of the application server identity.
- **Forward Secrecy**: Protection of past session communications even if long-term private keys are later compromised.

---

## 2. Supported Protocol Versions

| Protocol | Status | Justification |
|---|---|---|
| **TLS 1.3 (RFC 8446)** | **MANDATORY / PRIMARY** | Removes vulnerable legacy primitives, mandates Forward Secrecy, reduces handshake latency to 1-RTT, and encrypts handshake metadata. |
| **TLS 1.2 (RFC 5246)** | **ACCEPTABLE (Restricted)** | Supported strictly with modern AEAD cipher suites for legacy client interoperability. |
| **TLS 1.1** | **PROHIBITED** | Deprecated by IETF RFC 8996; vulnerable to CBC padding attacks (BEAST/POODLE variants). |
| **TLS 1.0** | **PROHIBITED** | Deprecated by IETF RFC 8996; insecure digest and CBC mode vulnerabilities. |
| **SSL 2.0 / SSL 3.0** | **PROHIBITED** | Severely compromised; must be disabled across all listeners. |

---

## 3. Cryptographic Standards & Cipher Suites

### 3.1 TLS 1.3 Cipher Suites
All TLS 1.3 ciphers are modern Authenticated Encryption with Associated Data (AEAD) primitives. Approved order:
1. `TLS_AES_256_GCM_SHA384`
2. `TLS_CHACHA20_POLY1305_SHA256`
3. `TLS_AES_128_GCM_SHA256`

### 3.2 TLS 1.2 Cipher Suites (Restricted Profile)
Only Ephemeral Diffie-Hellman (ECDHE) key exchange paired with AEAD encryption:
1. `ECDHE-ECDSA-AES256-GCM-SHA384`
2. `ECDHE-RSA-AES256-GCM-SHA384`
3. `ECDHE-ECDSA-CHACHA20-POLY1305`
4. `ECDHE-RSA-CHACHA20-POLY1305`
5. `ECDHE-ECDSA-AES128-GCM-SHA256`
6. `ECDHE-RSA-AES128-GCM-SHA256`

*Prohibited in all versions*: Static RSA key exchange, RC4, 3DES, CBC-mode ciphers, NULL ciphers, and export ciphers.

### 3.3 Key Exchange & Curves
- **Elliptic Curves**: `X25519` (preferred), `secp256r1` (NIST P-256), `secp384r1` (NIST P-384).
- **Forward Secrecy**: Ephemeral Diffie-Hellman keys must be generated uniquely per session and discarded immediately after session key derivation.

---

## 4. Public Key Infrastructure (PKI) & Certificates

1. **Key Specifications**:
   - **ECDSA**: Minimum 256-bit curve (secp256r1) — recommended for superior performance and reduced handshake byte size.
   - **RSA**: Minimum 2048-bit modulus (4096-bit recommended for root/intermediate CAs).
2. **Signature Hash Algorithm**: `SHA-256` or `SHA-384`. `SHA-1` and `MD5` are strictly rejected.
3. **Automated Lifecycle (ACME Protocol)**:
   - Certificate renewal must be fully automated via ACME (e.g., Let's Encrypt / ZeroSSL).
   - Certificates must be renewed within **30 days** before expiration (on a standard 90-day lifecycle).
4. **Online Certificate Status Protocol (OCSP) Stapling**:
   - Web servers and CDNs must enable OCSP Stapling (RFC 6066) with caching.
   - Prevents CA availability bottlenecks and client privacy leakage during certificate validation.
5. **Certificate Transparency (CT)**:
   - All issued certificates must include Signed Certificate Timestamps (SCTs) logged to publicly auditable CT logs.

---

## 5. Transport Protocol Negotiation & Latency Optimization

- **ALPN (Application-Layer Protocol Negotiation)**:
  - Servers must announce `h3` (HTTP/3 over QUIC) and `h2` (HTTP/2) before falling back to `http/1.1`.
- **Session Resumption & 0-RTT**:
  - TLS 1.3 0-RTT (Early Data) may be enabled for idempotent `GET` requests, but must reject or disallow state-mutating requests (`POST`, `PUT`, `DELETE`) to prevent replay attacks.
- **SNI (Server Name Indication)**:
  - SNI is mandatory for multi-tenant virtual host routing and TLS handshake initialization.

---

## 6. HTTP Strict Transport Security (HSTS)

All web endpoints must inject the HSTS response header to prevent SSL stripping (e.g., Moxie Marlinspike's SSLstrip attacks) and ensure user agents never send cleartext HTTP requests:

```http
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

- `max-age=63072000`: Enforces HTTPS for a duration of 2 years (minimum requirement for browser HSTS preload list).
- `includeSubDomains`: Recursively applies policy to all current and future subdomains.
- `preload`: Authorizes inclusion into Google Chrome, Firefox, Apple Safari, and Edge embedded preload lists.

---

## 7. Edge & Server Hardening Configurations

### 7.1 Nginx Reverse Proxy Configuration
```nginx
# SSL / TLS Settings
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;
ssl_ciphers "ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256";

# OCSP Stapling
ssl_stapling on;
ssl_stapling_verify on;
resolver 1.1.1.1 8.8.8.8 valid=300s;
resolver_timeout 5s;

# Session Cache
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off;

# HSTS
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
```

### 7.2 Cloudflare / Edge CDN Settings
- Minimum TLS Version: **TLS 1.2**
- TLS 1.3: **Enabled**
- Automatic HTTPS Rewrites: **Enabled**
- Always Use HTTPS: **Enabled**
- Opportunistic Encryption: **Enabled**

---

## 8. Verification & Auditing Commands

To verify TLS configuration on live deployment:

```bash
# 1. Inspect TLS version and active cipher suite
openssl s_client -connect yourdomain.com:443 -tls1_3

# 2. Check OCSP Stapling response
openssl s_client -connect yourdomain.com:443 -status -tlsextdebug < /dev/null

# 3. Test for rejected TLS 1.0 connection (must fail)
openssl s_client -connect yourdomain.com:443 -tls1
```
