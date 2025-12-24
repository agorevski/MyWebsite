# Website Improvement Suggestions

Based on a review of the codebase, here are recommendations to improve the website's performance, accessibility, maintainability, and user experience.

---

## 🚀 Performance

### 5. Optimize Font Loading
- **Current:** Loading Material Icons, Raleway, and Muli from Google Fonts
- **Recommendation:** 
  - Self-host fonts for better performance and privacy
  - Subset fonts to include only needed characters
  - Use `font-display: swap` (already done via `&display=swap`)

---

## ♿ Accessibility

### 6. Add Skip Navigation Link
- Add a "Skip to main content" link at the top of the page for keyboard users
- Example: `<a href="#about" class="sr-only sr-only-focusable">Skip to main content</a>`

### 7. Improve Form Labels and Validation
- Add `aria-describedby` for form error messages
- Include visible error messages, not just disabled submit button
- The submit button is permanently disabled (`disabled="true"`); consider enabling it after validation

### 8. Add ARIA Landmarks
- Add `role="navigation"` to the nav element or use `<nav aria-label="Main navigation">`
- The modal dialogs need proper focus management

### 9. Improve Color Contrast
- Verify text contrast ratios meet WCAG 2.1 AA standards (4.5:1 for normal text)
- The green (#06a763) on white may not meet contrast requirements for small text

### 10. Add Alt Text Descriptions
- Some alt texts are generic (e.g., "profile-image", "book", "stack")
- Provide more descriptive alt text or use empty alt="" for purely decorative images

---

## 📱 User Experience

### 15. Update Resume Link
- The resume links to `Alex_Gorevski_Resume_2017.pdf`
- **Recommendation:** Update to a current resume or generate dynamically

### 16. Update Experience Timeline
- The experience section shows "2017 - Present" but it's now 2025
- Consider adding more recent experience or updating dates

### 17. Add Dark Mode Support
- Add a dark mode toggle using CSS `prefers-color-scheme`
- Many users prefer dark mode, especially developers

### 18. Improve Mobile Navigation
- The hamburger menu is positioned at `-225px` left; consider a more visible toggle on mobile
- Add smooth animation for menu open/close
- Consider a bottom navigation bar for mobile

### 19. Add Lazy Loading for Below-Fold Content
- Timeline content, interests section, and modals could use `loading="lazy"` on images
- Consider lazy loading entire sections with Intersection Observer

### 20. Add Analytics and Error Tracking
- Consider privacy-respecting analytics (Plausible, Fathom, or self-hosted)

---

## 🔒 Security

### 22. Add Security Headers
- Add Content Security Policy (CSP), X-Frame-Options, etc.
- Can be configured in Azure Static Web Apps `staticwebapp.config.json`

### 23. Add Subresource Integrity (SRI)
- Add SRI hashes to external scripts
- Example: `<script src="..." integrity="sha384-..." crossorigin="anonymous">`

---

## 📊 Quick Wins (High Impact, Low Effort)

| Priority | Suggestion | Impact | Effort | Status |
|----------|-----------|--------|--------|--------|
| ~~1~~ | ~~Update resume PDF~~ | ~~High~~ | ~~Low~~ | Pending |
| ~~2~~ | ~~Add Open Graph meta tags~~ | ~~Medium~~ | ~~Low~~ | Pending |
| ~~3~~ | ~~Add skip navigation link~~ | ~~Medium~~ | ~~Low~~ | Pending |
| ~~6~~ | ~~Add dark mode CSS~~ | ~~Medium~~ | ~~Medium~~ | Pending |

---

## 📁 Suggested New File Structure

```text
MyWebsite/
├── src/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── main.js
│   └── assets/
│       └── images/
├── dist/                    # Build output ✅ Now in use
├── index.html
├── package.json             # ✅ Added
├── postcss.config.js        # ✅ Added
├── .eslintrc.json           # ✅ Added
├── .stylelintrc.json        # ✅ Added
├── .prettierrc              # ✅ Added
├── staticwebapp.config.json # Azure config with security headers
└── README.md
```

---

*Generated: December 2025*
*Last Updated: December 2025*
