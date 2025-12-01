# Deployment Guide

This guide explains how to deploy the AlexGorevski.com static website to Azure.

## Overview

The site has been migrated from ASP.NET Web Pages (.NET Framework 4.6.1) to a pure static HTML/CSS/JS site. This eliminates the need for .NET runtime and simplifies deployment significantly.

## Option 1: Azure Static Web Apps (Recommended)

Azure Static Web Apps is the best option for static sites - it's free, fast, and includes built-in CI/CD.

### Prerequisites
- Azure account
- GitHub repository access

### Setup Steps

1. **Create Azure Static Web App**
   - Go to [Azure Portal](https://portal.azure.com)
   - Click "Create a resource"
   - Search for "Static Web Apps"
   - Click "Create"

2. **Configure the Static Web App**
   - **Subscription**: Select your Azure subscription
   - **Resource Group**: Create new or use existing
   - **Name**: `alexgorevski` (or your preferred name)
   - **Plan type**: Free
   - **Region**: Choose closest to your users (e.g., West US 2)
   - **Deployment source**: GitHub
   - **GitHub account**: Authorize Azure to access your GitHub
   - **Organization**: Select your GitHub username
   - **Repository**: MyWebsite
   - **Branch**: master

3. **Build Configuration**
   - **Build Presets**: Custom
   - **App location**: `/` (root)
   - **Api location**: (leave empty)
   - **Output location**: (leave empty)

4. **Review and Create**
   - Click "Review + create"
   - Click "Create"

5. **GitHub Actions Setup**
   Azure will automatically:
   - Create a GitHub Actions workflow file
   - Add the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret to your repository
   - Trigger the first deployment

6. **Verify Deployment**
   - Go to your Static Web App resource in Azure Portal
   - Click on "Browse" to view your deployed site
   - The URL will be something like: `https://alexgorevski.azurestaticapps.net`

### Custom Domain Setup

1. In Azure Portal, go to your Static Web App
2. Click "Custom domains" in the left menu
3. Click "Add" and choose "Custom domain on other DNS"
4. Enter your domain: `www.alexgorevski.com`
5. Add the provided CNAME record to your DNS provider:
   - Type: CNAME
   - Name: www
   - Value: (provided by Azure)
6. Wait for DNS propagation (can take up to 48 hours)
7. Once validated, Azure will automatically provision an SSL certificate

### Monitoring

- View deployment history in GitHub Actions
- Monitor traffic in Azure Portal under "Overview"
- View logs under "Application Insights" (if enabled)

## Option 2: Azure App Service

If you prefer traditional App Service hosting:

### Steps

1. **Create App Service**
   - Go to Azure Portal
   - Create "App Service"
   - Choose "Code" (not container)
   - Runtime: Choose any (Node.js 18 LTS recommended)
   - Operating System: Linux or Windows

2. **Deploy Using GitHub Actions**
   
   Update `.github/workflows/master_alexgorevski.yml`:
   ```yaml
   name: Deploy to Azure App Service
   
   on:
     push:
       branches:
         - master
     workflow_dispatch:
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       
       steps:
         - uses: actions/checkout@v3
         
         - name: Deploy to Azure Web App
           uses: azure/webapps-deploy@v2
           with:
             app-name: 'alexgorevski'
             publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
             package: .
   ```

3. **Get Publish Profile**
   - In Azure Portal, go to your App Service
   - Click "Download publish profile"
   - Copy the entire XML content

4. **Add Secret to GitHub**
   - Go to GitHub repository settings
   - Navigate to Secrets and variables > Actions
   - Click "New repository secret"
   - Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
   - Value: Paste the XML content

5. **Push to Trigger Deployment**
   ```bash
   git push origin master
   ```

## Option 3: GitHub Pages

For free hosting with GitHub:

1. **Enable GitHub Pages**
   - Go to repository Settings
   - Click "Pages" in left sidebar
   - Source: "Deploy from a branch"
   - Branch: master, folder: / (root)
   - Click "Save"

2. **Update Workflow** (optional, for custom domain)
   Create `.github/workflows/pages.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ master ]
   
   permissions:
     contents: read
     pages: write
     id-token: write
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Setup Pages
           uses: actions/configure-pages@v3
         - name: Upload artifact
           uses: actions/upload-pages-artifact@v2
           with:
             path: '.'
         - name: Deploy to GitHub Pages
           uses: actions/deploy-pages@v2
   ```

3. **Custom Domain**
   - Add CNAME file with your domain
   - Configure DNS with A records or CNAME

## Testing Locally

Before deploying, test locally:

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Using PHP
php -S localhost:8000
```

Visit `http://localhost:8000` to verify the site works correctly.

## Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Check all images display properly
- [ ] Test all links (internal and external)
- [ ] Verify resume PDF downloads
- [ ] Test contact form (if backend configured)
- [ ] Check Google Maps integration
- [ ] Test on mobile devices
- [ ] Verify SSL certificate is active
- [ ] Test custom domain (if configured)
- [ ] Check analytics tracking (if configured)

## Troubleshooting

### Images Not Loading
- Verify file paths are case-sensitive (especially on Linux)
- Check that all files were copied correctly
- Review browser console for 404 errors

### CSS/JS Not Loading
- Check file paths in index.html
- Verify Content folder was copied correctly
- Clear browser cache

### Deployment Fails
- Check GitHub Actions logs for errors
- Verify secrets are configured correctly
- Ensure workflow YAML syntax is valid

### Custom Domain Issues
- Verify DNS records propagated (use https://dnschecker.org)
- Wait up to 48 hours for DNS changes
- Check SSL certificate status in Azure Portal

## Support

For issues:
1. Check GitHub Actions logs
2. Review Azure Portal diagnostics
3. Check browser console for errors
4. Review deployment documentation links below

## Additional Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
