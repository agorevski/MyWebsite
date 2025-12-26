# Development Guide

This guide covers setting up and working with the portfolio website locally.

## Prerequisites

- **Node.js** v18 or higher
- **npm** (comes with Node.js)
- A modern web browser

## Quick Start

```bash
# Clone the repository
git clone https://github.com/agorevski/MyWebsite.git
cd MyWebsite

# Install dependencies
npm install

# Start development server
npm run serve
```

Visit `http://localhost:8080` in your browser.

## Available Commands

### Build Commands

| Command | Description |
| ------- | ----------- |
| `npm run build` | Full build: CSS, JS, images, critical CSS, and SRI hashes |
| `npm run build:css` | Build CSS only (purge, prefix, minify) |
| `npm run build:js` | Bundle and minify JavaScript (ES2020 target) |
| `npm run update:sri` | Regenerate SRI hashes in index.html |
| `npm run clean` | Remove the dist folder |
| `npm run optimize:images` | Optimize images with imagemin |
| `npm run generate:avif` | Generate AVIF images from existing files |
| `npm run critical:generate` | Extract critical CSS for above-the-fold |
| `npm run critical:apply` | Apply critical CSS inline to HTML |

### Code Quality

| Command | Description |
| ------- | ----------- |
| `npm run lint` | Run all linters (CSS + JS) |
| `npm run lint:css` | Lint CSS files with Stylelint |
| `npm run lint:js` | Lint JavaScript with ESLint |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run lint:css:fix` | Auto-fix CSS lint issues |
| `npm run lint:js:fix` | Auto-fix JS lint issues |

### Development

| Command | Description |
| ------- | ----------- |
| `npm run serve` | Start local HTTP server on port 8080 |
| `npm run update:github` | Fetch latest GitHub contributions data |

## Development Workflow

### 1. Make Changes

Edit files in the `Content/` directory:

- **CSS**: `Content/stylesheets/*.css`
- **JavaScript**: `Content/javascript/custom.modern.js`
- **HTML**: `index.html`

### 2. Build and Test

```bash
npm run build    # Build all assets
npm run serve    # Test locally at localhost:8080
```

### 3. Check Output

Built files are output to `dist/`:

- `dist/stylesheets/` - Compiled CSS
- `dist/javascript/` - Bundled JavaScript
- `dist/Images/` - Optimized images

### 4. Lint Before Commit

```bash
npm run lint
```

## File Structure for Development

```text
Content/
├── stylesheets/
│   ├── critical.min.css          # Critical CSS (variables, fonts, accessibility)
│   ├── async-noncritical.min.css # Async-loaded non-critical styles
│   ├── style.min.css             # Combined styles
│   ├── generated-critical.css    # Auto-extracted critical CSS
│   └── vendors/                  # Third-party CSS
│       └── bootstrap5.min.css
│
├── javascript/
│   ├── custom.modern.js          # Main application logic (ES6+ source)
│   ├── custom.modern.min.js      # Minified output
│   └── vendors/                  # Third-party libraries
│       └── bootstrap5.bundle.min.js
│
├── fonts/                        # Self-hosted fonts
│   ├── material-icons/
│   ├── raleway/
│   ├── muli/
│   ├── fa-brands-400.woff2
│   └── fa-solid-900.woff2
│
└── images/
    └── backgrounds/              # Responsive backgrounds (AVIF, WebP, JPG)
```

## CSS Development

### Adding New Styles

1. Edit the appropriate CSS file in `Content/stylesheets/`
2. Run `npm run build:css` to process with PostCSS
3. PurgeCSS will automatically remove unused styles

### CSS Custom Properties

Use CSS variables defined in `critical.min.css` for consistency:

```css
.my-component {
    color: var(--primary-color);
    background: var(--bg-color);
    box-shadow: var(--card-shadow);
}
```

### Dark Mode Support

Add dark mode variants:

```css
/* Light mode (default) */
.my-component {
    background: #fff;
}

/* Dark mode via system preference */
@media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) .my-component {
        background: #1a1a2e;
    }
}

/* Dark mode via manual toggle */
[data-theme="dark"] .my-component {
    background: #1a1a2e;
}
```

### PurgeCSS Safelisting

If your CSS is being incorrectly removed by PurgeCSS, add it to the safelist in `postcss.config.js`:

```javascript
safelist: {
    standard: ['my-class', 'another-class'],
    deep: [/my-pattern/],
    greedy: [/dynamic/]
}
```

## JavaScript Development

### Module Pattern

The codebase uses vanilla ES6+ JavaScript:

```javascript
const App = {
    init() {
        this.initNav();
        this.initSmoothScroll();
        this.initScrollToTop();
        this.initDarkMode();
        this.initLazySections();
    },
    
    initNav() {
        // Mobile menu handling
    },
    
    initSmoothScroll() {
        // Native scrollIntoView
    },
    
    initScrollToTop() {
        // Passive scroll listener
    },
    
    initDarkMode() {
        // localStorage persistence
    },
    
    initLazySections() {
        // IntersectionObserver for lazy loading
    },
    
    initScrollReveal() {
        // IntersectionObserver for reveal animations
    },
};

document.addEventListener('DOMContentLoaded', () => App.init());
window.addEventListener('load', () => App.initScrollReveal());
```

### Adding New Features

1. Add your function to `Content/javascript/custom.modern.js`
2. Call it in the `init()` method or appropriate event
3. Run `npm run build:js` to bundle
4. Run `npm run update:sri` to update integrity hashes

### Build Output

esbuild bundles and minifies `custom.modern.js` to:

```text
dist/javascript/custom.modern.min.js
```

Target: ES2020 for modern browser support.

## SRI (Subresource Integrity)

All JavaScript and CSS files use SRI hashes for security.

### Automatic Update

After modifying JavaScript or CSS files:

```bash
npm run update:sri
```

This runs `scripts/update-sri.js` which:

1. Calculates SHA-384 hashes for all JS/CSS files
2. Updates `integrity` attributes in `index.html`

### Manual Hash Generation (PowerShell)

```powershell
$bytes = [System.IO.File]::ReadAllBytes("path/to/file.js")
$sha384 = [System.Security.Cryptography.SHA384]::Create()
$hashBytes = $sha384.ComputeHash($bytes)
$b64 = [Convert]::ToBase64String($hashBytes)
Write-Output "sha384-$b64"
```

## Linting Configuration

### ESLint (JavaScript)

Configuration: `.eslintrc.json`

```bash
npm run lint:js      # Check issues
npm run lint:js:fix  # Auto-fix
```

### Stylelint (CSS)

Configuration: `.stylelintrc.json`

```bash
npm run lint:css      # Check issues
npm run lint:css:fix  # Auto-fix
```

### Prettier (Formatting)

Configuration: `.prettierrc`

Prettier can be run manually but is not included in the default workflow.

## Adding Images

1. Add images to the `Images/` directory
2. Run `npm run generate:avif` to create AVIF versions
3. Create WebP versions for fallback
4. Use the `<picture>` element with multiple formats:

```html
<picture>
    <source srcset="image-small.avif 400w,
                    image-medium.avif 800w,
                    image.avif 1200w"
            sizes="(min-width: 1200px) 400px, 350px"
            type="image/avif">
    <source srcset="image-small.webp 400w,
                    image-medium.webp 800w,
                    image.webp 1200w"
            sizes="(min-width: 1200px) 400px, 350px"
            type="image/webp">
    <img src="image-small.png" 
         alt="Descriptive alt text"
         loading="lazy"
         width="400" 
         height="400">
</picture>
```

## Troubleshooting

### Port 8080 Already in Use

```bash
# Use a different port
npx http-server . -p 3000 -o
```

### PurgeCSS Removing Needed Styles

Add classes to the safelist in `postcss.config.js`:

```javascript
safelist: {
    standard: ['my-dynamic-class']
}
```

### Build Errors

```bash
# Clean and rebuild
npm run clean
npm install
npm run build
```

### SRI Hash Mismatch

If you see console errors about SRI hash mismatch:

```bash
npm run update:sri
```

This regenerates all hashes based on current file contents.

### Critical CSS Issues

If critical CSS extraction fails:

```bash
npm run critical:generate
npm run critical:apply
```
