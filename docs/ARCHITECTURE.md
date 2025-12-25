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
| **CI/CD** | GitHub Actions | Automated deployment on push |
| **HTML** | HTML5 | Semantic markup, accessibility |
| **CSS** | Bootstrap 5, Materialize, Custom | Responsive layout, components |
| **JavaScript** | jQuery, ScrollReveal | Interactivity, animations |
| **Build Tools** | PostCSS, esbuild | CSS optimization, JS bundling |

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
│   │   ├── async-noncritical.min.css  # Minified combined CSS
│   │   └── vendors/          # Third-party CSS
│   │
│   ├── javascript/           # JavaScript files
│   │   ├── custom.js         # Main application logic
│   │   ├── custom.modern.js  # ES6+ version
│   │   └── vendors/          # Third-party JS (jQuery, Bootstrap, etc.)
│   │
│   ├── fonts/                # Self-hosted web fonts
│   │   ├── material-icons/   # Material Design icons
│   │   └── raleway/          # Raleway font family
│   │
│   ├── images/               # Content images
│   │   └── backgrounds/      # Responsive background images
│   │
│   ├── docs/                 # Downloadable documents
│   │   └── Alex_Gorevski_Resume_2017.pdf
│   │
│   └── toggle/               # Toggle components
│
├── Images/                   # Image assets
│   ├── profile/              # Profile photos (WebP + fallbacks)
│   ├── icons/                # Section icons
│   ├── logos/                # Company logos
│   └── timeline/             # Timeline images
│
├── dist/                     # Built/compiled assets
│   ├── stylesheets/          # Compiled CSS
│   └── javascript/           # Compiled JavaScript
│
├── scripts/                  # Build scripts
│   └── update-sri.js         # SRI hash generator
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
    /* ... */
}
```

### Dark Mode Support

Dark mode is implemented via:

1. **System preference detection**: `@media (prefers-color-scheme: dark)`
2. **Manual toggle**: `[data-theme="dark"]` attribute on root element

### CSS Processing Pipeline

```text
Source CSS → PurgeCSS → Autoprefixer → cssnano → Minified CSS
```

1. **PurgeCSS**: Removes unused CSS based on HTML/JS analysis
2. **Autoprefixer**: Adds vendor prefixes for browser compatibility
3. **cssnano**: Minifies and optimizes the output

## JavaScript Architecture

### Main Application (`custom.js`)

The JavaScript follows a modular IIFE (Immediately Invoked Function Expression) pattern:

```javascript
(function($) {
    "use strict";
    
    // Navigation initialization
    function initNav() { /* ... */ }
    
    // Smooth scrolling
    function initSmoothScroll() { /* ... */ }
    
    // Scroll-to-top button
    function initScrollToTop() { /* ... */ }
    
    // Initialize on DOM ready
    jQuery(document).on('ready', function() {
        initNav();
        initSmoothScroll();
        initScrollToTop();
    });
    
    // ScrollReveal animations on load
    jQuery(window).on('load', function() { /* ... */ });
})(jQuery);
```

### Third-Party Libraries

| Library | Version | Purpose |
| ------- | ------- | ------- |
| jQuery | 3.7.1 | DOM manipulation |
| Bootstrap 5 | 5.x | Modal dialogs, grid layout |
| Materialize | Custom | Toast notifications, components |
| ScrollReveal | Latest | Scroll-based animations |

## Image Optimization

### Responsive Images

The site uses the `<picture>` element for responsive images:

```html
<picture>
    <source srcset="small.webp 400w, medium.webp 800w, large.webp 1200w"
            sizes="(min-width: 1200px) 400px, 350px"
            type="image/webp">
    <img src="fallback.png" loading="lazy" alt="Description">
</picture>
```

### Image Formats

- **WebP**: Primary format for modern browsers
- **PNG/JPG**: Fallback for older browsers
- **Multiple sizes**: Small, medium, large variants for responsive loading

## Security Architecture

See [SECURITY.md](./SECURITY.md) for detailed security documentation.

Key security features:

- Content Security Policy (CSP)
- Subresource Integrity (SRI) for all scripts
- Security headers via Azure SWA config

## Performance Optimizations

1. **Critical CSS inlined** in `<head>` for above-the-fold content
2. **Async CSS loading** for non-critical styles
3. **Deferred JavaScript** with `defer` attribute
4. **Preload hints** for critical fonts and images
5. **Long-term caching** (1 year) for static assets
6. **PurgeCSS** removes unused styles (~80% reduction)

## Accessibility Features

- Skip navigation link for keyboard users
- ARIA labels on interactive elements
- Semantic HTML5 structure
- Focus management for modals
- WCAG 2.1 AA compliant color contrast
