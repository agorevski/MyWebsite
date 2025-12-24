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

## 📊 Quick Wins (High Impact, Low Effort)

| Priority | Suggestion | Impact | Effort |
|----------|-----------|--------|--------|
| 1 | Update resume PDF | High | Low |
| 2 | Add dark mode CSS | Medium | Medium |

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
