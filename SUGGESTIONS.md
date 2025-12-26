# Website Improvement Suggestions

Based on a review of the codebase, here are recommendations to improve the website's performance, accessibility, maintainability, and user experience.

---

## 📱 User Experience

### 15. Update Resume Link
- The resume links to `Alex_Gorevski_Resume_2017.pdf`
- **Recommendation:** Update to a current resume or generate dynamically

### 20. Add Analytics and Error Tracking
- Consider privacy-respecting analytics (Plausible, Fathom, or self-hosted)

---

## 📊 Quick Wins (High Impact, Low Effort)

| Priority | Suggestion | Impact | Effort |
|----------|-----------|--------|--------|
| 1 | Update resume PDF | High | Low |

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
