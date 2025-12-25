# Deployment Guide

This document explains how the portfolio website is deployed and how to manage deployments.

## Overview

The site is hosted on **Azure Static Web Apps** with automatic deployment via **GitHub Actions**.

```text
Developer → Push to GitHub → GitHub Actions → Azure Static Web Apps → CDN
```

## Deployment Architecture

```text
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  GitHub Repo    │────>│  GitHub Actions  │────>│  Azure Static Web   │
│  (master branch)│     │  (CI/CD Pipeline)│     │  Apps               │
└─────────────────┘     └──────────────────┘     └─────────────────────┘
                                                          │
                                                          ▼
                                                 ┌─────────────────────┐
                                                 │  Global CDN         │
                                                 │  (Edge Locations)   │
                                                 └─────────────────────┘
                                                          │
                                                          ▼
                                                 ┌─────────────────────┐
                                                 │  www.alexgorevski   │
                                                 │  .com               │
                                                 └─────────────────────┘
```

## Automatic Deployment

### Trigger Events

Deployment is triggered automatically on:

1. **Push to master**: Full deployment to production
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
    steps:
      - uses: actions/checkout@v3
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          app_location: "/"
          output_location: "."
          skip_app_build: true  # Static site, no build needed
```

### Key Configuration

| Setting | Value | Description |
| ------- | ----- | ----------- |
| `app_location` | `/` | Root of repository |
| `output_location` | `.` | Same as app location |
| `skip_app_build` | `true` | No server-side build process |

## Deployment Process

### 1. Make Changes Locally

```bash
# Make your changes
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

1. GitHub Actions deploys to a **staging environment**
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
    ...
  },
  "mimeTypes": {
    ".webp": "image/webp",
    ".woff2": "font/woff2"
  },
  "routes": [
    {
      "route": "/Content/*",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/Images/*", "/Content/*"]
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

- **Static assets** (`/Content/*`, `/Images/*`): 1-year cache
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

#### Changes Not Appearing

1. Clear browser cache (Ctrl+Shift+R)
2. Check if CDN cache needs clearing
3. Verify the correct branch was deployed

#### 404 Errors

1. Check `navigationFallback` excludes in config
2. Verify file paths are correct (case-sensitive on Azure)

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
| `/index.html` | Default (short cache) | Browser default |
