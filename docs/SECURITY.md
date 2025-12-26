# Security Documentation

This document details the security measures implemented in the portfolio website.

## Security Overview

The site implements defense-in-depth with multiple security layers:

1. **HTTP Security Headers** - Browser-level protections
2. **Subresource Integrity (SRI)** - Script and stylesheet tampering prevention
3. **Content Security Policy (CSP)** - Resource loading restrictions
4. **HTTPS Everywhere** - Transport layer security

## Security Headers Configuration

Configured in `staticwebapp.config.json`:

```json
{
  "globalHeaders": {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.github.com; frame-ancestors 'none'"
  }
}
```

### Header Explanations

| Header | Value | Protection |
| ------ | ----- | ---------- |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME type sniffing attacks |
| `X-Frame-Options` | `DENY` | Blocks clickjacking via iframes |
| `X-XSS-Protection` | `1; mode=block` | Enables browser XSS filter |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controls referrer leakage |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` | Disables unused APIs |

## Content Security Policy (CSP)

The CSP restricts which resources can be loaded:

```text
default-src 'self';
script-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self' https://api.github.com;
frame-ancestors 'none'
```

### CSP Directives Explained

| Directive | Value | Allowed Sources |
| --------- | ----- | --------------- |
| `default-src` | `'self'` | Same origin only (fallback) |
| `script-src` | `'self' 'unsafe-inline'` | Same origin + inline scripts |
| `style-src` | `'self' 'unsafe-inline'` | Same origin + inline styles |
| `font-src` | `'self' https://fonts.gstatic.com` | Same origin + Google Fonts |
| `img-src` | `'self' data: https:` | Same origin + data URIs + HTTPS |
| `connect-src` | `'self' https://api.github.com` | XHR/fetch to same origin + GitHub API |
| `frame-ancestors` | `'none'` | Cannot be embedded in frames |

### CSP Considerations

- **`'unsafe-inline'`**: Required for inline styles/scripts in the HTML (critical CSS). Consider using nonces for stricter CSP.
- **Google Fonts**: If you self-host all fonts (which this site does), you can remove the Google Fonts exceptions.
- **GitHub API**: Allowed for the GitHub contributions widget.

## Subresource Integrity (SRI)

All JavaScript and CSS files include SRI hashes to ensure they haven't been tampered with.

### How SRI Works

```html
<script src="script.js" 
        integrity="sha384-abc123..." 
        crossorigin="anonymous">
</script>

<link rel="stylesheet" href="styles.css"
      integrity="sha384-xyz789..."
      crossorigin="anonymous">
```

The browser:

1. Downloads the resource
2. Calculates its SHA-384 hash
3. Compares with the `integrity` attribute
4. **Blocks loading** if hashes don't match

### Protected Resources

| File | Type | Protection |
| ---- | ---- | ---------- |
| `bootstrap5.min.css` | CSS | SRI hash |
| `async-noncritical.min.css` | CSS | SRI hash |
| `bootstrap5.bundle.min.js` | JS | SRI hash |
| `custom.modern.js` | JS | SRI hash |

### Updating SRI Hashes

When JavaScript or CSS files are modified:

```bash
npm run update:sri
```

This runs `scripts/update-sri.js` which:

1. Reads each JS/CSS file
2. Calculates SHA-384 hash
3. Updates the `integrity` attribute in `index.html`

### Manual SRI Generation

#### PowerShell

```powershell
$bytes = [System.IO.File]::ReadAllBytes("path/to/file.js")
$sha384 = [System.Security.Cryptography.SHA384]::Create()
$hashBytes = $sha384.ComputeHash($bytes)
$b64 = [Convert]::ToBase64String($hashBytes)
Write-Output "sha384-$b64"
```

#### Bash

```bash
cat file.js | openssl dgst -sha384 -binary | openssl base64 -A
```

#### Online Tool

Use [srihash.org](https://www.srihash.org/) for quick generation.

## HTTPS/TLS

Azure Static Web Apps provides:

- **Automatic SSL certificates** via Let's Encrypt
- **TLS 1.2+** minimum version
- **Automatic HTTP → HTTPS redirect**

## Security Checklist

### Before Deployment

- [ ] Run `npm run lint` to check for issues
- [ ] Run `npm run update:sri` to update integrity hashes
- [ ] Verify no sensitive data in repository
- [ ] Check CSP doesn't block needed resources
- [ ] Test in browser with DevTools open for CSP violations

### Regular Maintenance

- [ ] Update dependencies: `npm update`
- [ ] Check for security advisories: `npm audit`
- [ ] Review security headers: [securityheaders.com](https://securityheaders.com)
- [ ] Test CSP: Browser DevTools → Console for violations

## Testing Security

### Security Headers

Test your security headers at:

- [securityheaders.com](https://securityheaders.com/?q=alexgorevski.com)
- [observatory.mozilla.org](https://observatory.mozilla.org)

### CSP Validation

1. Open DevTools (F12)
2. Go to Console tab
3. Look for CSP violation messages
4. Adjust policy if needed

### SRI Verification

1. Open DevTools → Network tab
2. Find a JS/CSS file → Headers
3. Verify `integrity` attribute matches

## Incident Response

### If a Security Issue is Found

1. **Assess severity** - Is data at risk?
2. **Contain** - Remove affected content if needed
3. **Fix** - Update code/configuration
4. **Deploy** - Push fix to production
5. **Review** - Document and prevent recurrence

### Reporting Security Issues

If you discover a security vulnerability:

1. **Do not** open a public issue
2. Email: [admin@alexgorevski.com](mailto:admin@alexgorevski.com)
3. Include: Description, steps to reproduce, potential impact

## Additional Hardening (Future Considerations)

### Stricter CSP

Remove `'unsafe-inline'` by:

1. Moving inline styles to external CSS
2. Using CSP nonces for inline scripts
3. Adding specific script hashes

### HSTS Header

Add HTTP Strict Transport Security:

```json
"Strict-Transport-Security": "max-age=31536000; includeSubDomains"
```

### Feature Policy Updates

Consider adding more restrictive permissions:

```text
accelerometer=(), ambient-light-sensor=(), autoplay=(),
battery=(), camera=(), cross-origin-isolated=(), ...
```

## Resources

- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [SRI Hash Generator](https://www.srihash.org/)
- [Mozilla Observatory](https://observatory.mozilla.org/)
- [Security Headers](https://securityheaders.com/)
