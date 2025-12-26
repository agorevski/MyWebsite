# Deployment Guide

This document explains how the portfolio website is deployed and how to manage deployments.

## Overview

The site is hosted on **Azure Static Web Apps** with automatic deployment via **GitHub Actions**.

```text
Developer → Push to GitHub → GitHub Actions → Build → Azure Static Web Apps → CDN
```

## Deployment Architecture

```text
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  GitHub Repo    │────>│  GitHub Actions  │────>│  Azure Static Web   │
│  (master branch)│     │  (CI/CD Pipeline)│     │  Apps               │
└─────────────────┘     └──────────────────┘     └─────────────────────┘
                                │                          │
                                │ npm ci                   │
                                │ npm audit                ▼
                                │ npm run build    ┌───────────────────┐
                                └─────────────────>│  Global CDN       │
                                                   │  (Edge Locations) │
                                                   └───────────────────┘
                                                           │
                                                           ▼
                                                  ┌───────────────────┐
                                                  │  www.alexgorevski │
                                                  │  .com             │
                                                  └───────────────────┘
```

## Automatic Deployment

### Trigger Events

Deployment is triggered automatically on:

1. **Push to master**: Full build and deployment to production
2. **Pull Request opened/updated**: Deploys a staging environment
3. **Pull Request closed**: Cleans up staging environment

### GitHub Actions Workflow

Location: `.github/workflows/azure-static-web-apps-white-rock-0afb4941e.yml`

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - master
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - master

jobs:
  build_and_deploy_job:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Security audit
        run: npm audit --audit-level=high
      - name: Build
        run: npm run build
      - name: Clean up node_modules
        run: rm -rf node_modules
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          app_location: "/"
          output_location: "dist"
          skip_app_build: true  # Build already done above
```

### Key Configuration

| Setting | Value | Description |
| ------- | ----- | ----------- |
| `app_location` | `/` | Root of repository |
| `output_location` | `dist` | Built assets directory |
| `skip_app_build` | `true` | Build is handled by npm scripts |

### Build Steps

The CI/CD pipeline runs these steps:

1. **Install dependencies**: `npm ci` (clean install)
2. **Security audit**: `npm audit --audit-level=high`
3. **Full build**: `npm run build` which runs:
   - `npm run clean` - Remove dist folder
   - `npm run update:github` - Update GitHub contributions data
   - `npm run optimize:images` - Optimize images
   - `npm run generate:avif` - Generate AVIF images
   - `npm run extract:fontawesome` - Extract Font Awesome icons
   - `npm run build:css` - Build CSS with PurgeCSS
   - `npm run build:js` - Bundle and minify JavaScript
   - `npm run bundle:assets` - Bundle assets
   - `npm run critical:generate` - Extract critical CSS
   - `npm run critical:apply` - Apply critical CSS to HTML
   - `npm run update:sri` - Update SRI hashes

## Deployment Process

### 1. Make Changes Locally

```bash
# Make your changes
npm run build           # Build locally to test
npm run serve           # Test at localhost:8080
git add .
git commit -m "Update: description of changes"
```

### 2. Push to GitHub

```bash
git push origin master
```

### 3. Monitor Deployment

1. Go to GitHub repository → **Actions** tab
2. Find the running workflow
3. Click to view logs and status

### 4. Verify Deployment

Visit [https://www.alexgorevski.com](https://www.alexgorevski.com) to verify changes are live.

## Pull Request Previews

When you open a pull request:

1. GitHub Actions builds and deploys to a **staging environment**
2. Azure provides a unique preview URL
3. You can test changes before merging
4. Staging is cleaned up when PR is closed/merged

## Azure Static Web Apps Configuration

### Configuration File

Location: `staticwebapp.config.json`

```json
{
  "globalHeaders": {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
    "Content-Security-Policy": "..."
  },
  "mimeTypes": {
    ".webp": "image/webp",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
    ".json": "application/json"
  },
  "routes": [
    {
      "route": "/Content/*",
      "headers": { "Cache-Control": "public, max-age=31536000, immutable" }
    },
    {
      "route": "/Images/*",
      "headers": { "Cache-Control": "public, max-age=31536000, immutable" }
    },
    {
      "route": "/data/*",
      "headers": { "Cache-Control": "public, max-age=3600" }
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/Images/*", "/Content/*", "/data/*", "/*.ico", "/*.pdf"]
  }
}
```

### Configuration Sections

#### Global Headers

Security headers applied to all responses. See [SECURITY.md](./SECURITY.md) for details.

#### MIME Types

Custom content types for specific file extensions:

- `.webp` → `image/webp`
- `.woff2` → `font/woff2`
- `.woff` → `font/woff`
- `.json` → `application/json`

#### Routes

Custom routing rules:

- **Static assets** (`/Content/*`, `/Images/*`): 1-year immutable cache
- **Data files** (`/data/*`): 1-hour cache (for GitHub contributions)
- **Navigation fallback**: SPA-style routing to `index.html`

## Manual Deployment

If automatic deployment fails, you can deploy manually:

### Using Azure CLI

```bash
# Login to Azure
az login

# Deploy using SWA CLI
npx @azure/static-web-apps-cli deploy . \
  --deployment-token $AZURE_STATIC_WEB_APPS_API_TOKEN
```

### Using GitHub Actions Re-run

1. Go to GitHub → Actions → Failed workflow
2. Click **Re-run all jobs**

## Environment Variables

### Required Secrets

Configure in GitHub repository settings → Secrets:

| Secret | Description |
| ------ | ----------- |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_WHITE_ROCK_0AFB4941E` | Azure SWA deployment token |

### Getting the Deployment Token

1. Go to Azure Portal → Static Web Apps resource
2. Click **Manage deployment token**
3. Copy the token
4. Add to GitHub Secrets

## Custom Domain Setup

The site uses a custom domain: `www.alexgorevski.com`

### Adding a Custom Domain

1. **Azure Portal** → Static Web Apps → Your app
2. Click **Custom domains**
3. Add your domain
4. Configure DNS:
   - **CNAME**: `www` → `<app-name>.azurestaticapps.net`
   - **TXT** (for apex): Verification record
5. Azure automatically provisions SSL certificate

## Monitoring & Troubleshooting

### Check Deployment Status

```bash
# View recent workflows
gh run list --limit 5

# View specific run
gh run view <run-id>
```

### Common Issues

#### Deployment Fails

1. Check GitHub Actions logs for errors
2. Verify secrets are configured correctly
3. Ensure `staticwebapp.config.json` is valid JSON
4. Check `npm audit` results for high-severity vulnerabilities

#### Changes Not Appearing

1. Clear browser cache (Ctrl+Shift+R)
2. Check if CDN cache needs clearing
3. Verify the correct branch was deployed

#### 404 Errors

1. Check `navigationFallback` excludes in config
2. Verify file paths are correct (case-sensitive on Azure)

#### Build Fails

1. Check npm install/audit errors
2. Verify all build scripts complete successfully
3. Test build locally: `npm run build`

### Viewing Logs

1. GitHub Actions: Repository → Actions → Select workflow
2. Azure Portal: Static Web Apps → Monitoring → Logs

## Rollback

### Revert to Previous Version

```bash
# Find the commit to revert to
git log --oneline -10

# Revert and push
git revert HEAD
git push origin master
```

### Redeploy Specific Commit

```bash
# Create branch from old commit
git checkout -b rollback <commit-sha>
git push origin rollback

# Create PR to merge back to master
# Or force push to master (not recommended)
```

## Performance

Azure Static Web Apps provides:

- **Global CDN**: Content served from edge locations
- **Automatic SSL**: Free HTTPS certificate
- **Compression**: Gzip/Brotli for text assets
- **HTTP/2**: Multiplexed connections

### Cache Strategy

| Path | Cache-Control | Duration |
| ---- | ------------- | -------- |
| `/Content/*` | `public, max-age=31536000, immutable` | 1 year |
| `/Images/*` | `public, max-age=31536000, immutable` | 1 year |
| `/data/*` | `public, max-age=3600` | 1 hour |
| `/index.html` | Default (short cache) | Browser default |
