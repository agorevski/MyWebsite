# Architecture Overview

This document describes the architecture and structure of Alex Gorevski's personal portfolio website.

## High-Level Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                     Azure Static Web Apps                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    CDN Edge Nodes                         │  │
│  │                  (Global Distribution)                    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Static Content                          │  │
│  │  ┌─────────┐  ┌─────────────┐  ┌────────────────────────┐ │  │
│  │  │  HTML   │  │    CSS      │  │      JavaScript        │ │  │
│  │  └─────────┘  └─────────────┘  └────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

| Layer | Technology | Purpose |
| ----- | ---------- | ------- |
| **Hosting** | Azure Static Web Apps | Global CDN, SSL, custom domains |
| **CI/CD** | GitHub Actions | Automated build & deployment on push |
| **HTML** | HTML5 | Semantic markup, accessibility |
| **CSS** | Bootstrap 5, Custom | Responsive layout, components |
| **JavaScript** | Vanilla ES6+ | Interactivity, animations |
| **Build Tools** | PostCSS, esbuild, Critical | CSS optimization, JS bundling, critical CSS extraction |

## Project Structure

```text
MyWebsite/
├── index.html                 # Main entry point (single-page app)
├── favicon.ico                # Site favicon
├── staticwebapp.config.json   # Azure SWA configuration
├── package.json               # npm dependencies and scripts
├── postcss.config.js          # PostCSS configuration
│
├── Content/                   # Source assets
│   ├── stylesheets/          # CSS files
│   │   ├── critical.min.css  # Combined critical CSS (variables, accessibility, fonts)
│   │   ├── async-noncritical.min.css  # Async-loaded non-critical styles
│   │   ├── style.min.css     # Combined minified styles
│   │   ├── generated-critical.css  # Auto-extracted critical CSS
│   │   └── vendors/          # Third-party CSS
│   │       └── bootstrap5.min.css
│   │
│   ├── javascript/           # JavaScript files
│   │   ├── custom.modern.js      # Main application logic (ES6+ source)
│   │   ├── custom.modern.min.js  # Minified output
│   │   └── vendors/              # Third-party JS
│   │       └── bootstrap5.bundle.min.js
│   │
│   ├── fonts/                # Self-hosted web fonts
│   │   ├── material-icons/   # Material Design icons
│   │   ├── raleway/          # Raleway font family
│   │   ├── muli/             # Muli font family
│   │   ├── fa-brands-400.woff2    # Font Awesome brands
│   │   └── fa-solid-900.woff2     # Font Awesome solid
│   │
│   ├── images/               # Content images
│   │   └── backgrounds/      # Responsive background images (AVIF, WebP, JPG)
│   │
│   ├── docs/                 # Downloadable documents
│   │   └── Alex_Gorevski_Resume_2025.pdf
│   │
│   └── toggle/               # Toggle components
│
├── Images/                   # Image assets
│   ├── profile/              # Profile photos (AVIF, WebP + fallbacks)
│   ├── icons/                # Section icons (AVIF, WebP + fallbacks)
│   ├── logos/                # Company logos
│   └── timeline/             # Timeline images
│
├── dist/                     # Built/compiled assets
│   ├── stylesheets/          # Compiled CSS
│   ├── javascript/           # Compiled JavaScript
│   └── Images/               # Optimized images
│
├── data/                     # JSON data files
│   └── github-contributions.json  # Cached GitHub contributions
│
├── scripts/                  # Build scripts
│   ├── update-sri.js              # SRI hash generator
│   ├── extract-critical-css.mjs   # Critical CSS extraction
│   ├── bundle-assets.js           # Asset bundling
│   ├── generate-avif.js           # AVIF image generation
│   ├── extract-fontawesome.js     # Font Awesome icon extraction
│   └── update-github-contributions.js  # GitHub data fetcher
│
├── docs/                     # Documentation
│
└── .github/
    └── workflows/            # GitHub Actions CI/CD
        └── azure-static-web-apps-white-rock-0afb4941e.yml
```

## CSS Architecture

### CSS Custom Properties

The site uses CSS Custom Properties (variables) for theming, defined in `Content/stylesheets/critical.min.css`:

```css
:root {
    --primary-color: #06a763;
    --accent-color: #1976d2;
    --bg-color: #f5f5f5;
    --card-bg: #fff;
    --heading-color: rgba(0,0,0,.87);
    --text-color: #616161;
    --card-shadow: 0 2px 5px 0 rgba(0,0,0,.16), 0 2px 10px 0 rgba(0,0,0,.12);
    /* ... */
}
```

### Dark Mode Support

Dark mode is implemented via:

1. **System preference detection**: `@media (prefers-color-scheme: dark)`
2. **Manual toggle**: `[data-theme="dark"]` attribute on root element
3. **CSS variables** that automatically adjust for dark mode

### CSS Processing Pipeline

```text
Source CSS → PurgeCSS → Autoprefixer → cssnano → Minified CSS
                                         ↓
                              Critical CSS Extraction
```

1. **PurgeCSS**: Removes unused CSS based on HTML/JS analysis
2. **Autoprefixer**: Adds vendor prefixes for browser compatibility
3. **cssnano**: Minifies and optimizes the output
4. **Critical CSS**: Extracts above-the-fold styles for inline injection

### Critical CSS Strategy

- **Inline critical CSS** in `<head>` for above-the-fold content
- **Async load** non-critical CSS via `preload` with `onload` attribute
- Generated using the `critical` package during build

## JavaScript Architecture

### Main Application (`custom.modern.js`)

The JavaScript uses a modern ES6+ module pattern with vanilla JavaScript:

```javascript
// Modern JavaScript with ES6+ features
// Vanilla JS - no jQuery or other dependencies
// Uses native IntersectionObserver for scroll reveal animations

const App = {
    init() {
        this.initNav();
        this.initSmoothScroll();
        this.initScrollToTop();
        this.initDarkMode();
        this.initLazySections();
    },
    
    // Navigation initialization with mobile menu
    initNav() { /* ... */ },
    
    // Smooth scrolling using native scrollIntoView
    initSmoothScroll() { /* ... */ },
    
    // Scroll-to-top button with passive scroll listener
    initScrollToTop() { /* ... */ },
    
    // Dark mode toggle with localStorage persistence
    initDarkMode() { /* ... */ },
    
    // Lazy section loading with IntersectionObserver
    initLazySections() { /* ... */ },
    
    // IntersectionObserver-based scroll reveal animations
    initScrollReveal() { /* ... */ },
};

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => App.init());

// Initialize reveal animations on load
window.addEventListener('load', () => App.initScrollReveal());
```

### Third-Party Libraries

| Library | Version | Purpose |
| ------- | ------- | ------- |
| Bootstrap 5 | 5.3.x | Modal dialogs, grid layout, responsive utilities |

> **Note**: jQuery, Materialize, and ScrollReveal were removed in favor of vanilla ES6+ JavaScript with native `IntersectionObserver` for scroll animations. This reduces the JS bundle size significantly.

### GitHub Contributions Widget

The site includes a custom GitHub contributions graph that:

- Fetches data from GitHub's public API
- Caches results in localStorage for 24 hours
- Falls back to historical data from `data/github-contributions.json`
- Renders a visual contribution grid similar to GitHub's profile

## Image Optimization

### Responsive Images

The site uses the `<picture>` element for responsive images with modern formats:

```html
<picture>
    <source media="(min-width: 1281px)" srcset="background-large.avif" type="image/avif">
    <source media="(min-width: 1281px)" srcset="background-large.webp" type="image/webp">
    <source media="(min-width: 769px)" srcset="background-medium.avif" type="image/avif">
    <source media="(min-width: 769px)" srcset="background-medium.webp" type="image/webp">
    <source media="(max-width: 768px)" srcset="background-small.avif" type="image/avif">
    <source media="(max-width: 768px)" srcset="background-small.webp" type="image/webp">
    <img src="fallback.jpg" loading="lazy" alt="Description">
</picture>
```

### Image Formats

- **AVIF**: Primary format for modern browsers (best compression)
- **WebP**: Fallback for browsers without AVIF support
- **PNG/JPG**: Fallback for older browsers
- **Multiple sizes**: Small, medium, large variants for responsive loading

### Image Generation

- `npm run optimize:images` - Optimize existing images
- `npm run generate:avif` - Generate AVIF versions from existing images

## Security Architecture

See [SECURITY.md](./SECURITY.md) for detailed security documentation.

Key security features:

- Content Security Policy (CSP) with GitHub API allowance
- Subresource Integrity (SRI) for all scripts and stylesheets
- Security headers via Azure SWA config

## Performance Optimizations

1. **Critical CSS inlined** in `<head>` for above-the-fold content
2. **Async CSS loading** for non-critical styles using `preload`
3. **Deferred JavaScript** with `defer` attribute
4. **Preload hints** for critical fonts and LCP images
5. **Long-term caching** (1 year) for static assets
6. **PurgeCSS** removes unused styles
7. **AVIF/WebP images** for modern format support
8. **Native IntersectionObserver** for lazy loading sections

## Accessibility Features

- Skip navigation link for keyboard users
- ARIA labels on interactive elements
- Semantic HTML5 structure (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- Focus management for modals
- WCAG 2.1 AA compliant color contrast
- `visually-hidden` and `sr-only` classes for screen reader text
