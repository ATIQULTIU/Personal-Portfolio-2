# ATIK.DEV — Creative Portfolio

A futuristic, single-page personal portfolio for **MD. Atiqul Islam (Atik)**, Software Developer from Bangladesh. It is a static website built with HTML, CSS and vanilla JavaScript, with no frameworks or build step.

## Features

- Fixed glassmorphism navigation with an active-section indicator, smooth scrolling and an animated mobile menu
- Hero section with a status badge, gradient name and a typing animation that cycles through four roles
- `PROFILE.EXE` card with a neon border, a moving scan line, a holographic overlay, HUD corners and a floating animation
- 3D tilt effect that follows the mouse, with a cursor-following glow (desktop only)
- Floating terminal-style code snippets around the profile card
- Lightweight canvas particle background with faint connecting lines (pauses when the tab is hidden)
- About section with a terminal card that types out its output when it scrolls into view
- Skills dashboard with animated progress bars and counters, plus skills grouped by category
- Three project cards with hover lift, glow, gradient and arrow motion
- Contact section with client-side form validation and a `mailto:` fallback
- Custom neon cursor on desktop only; disabled on touch devices and small screens
- Scroll-reveal animations using `IntersectionObserver`
- Responsive layout for desktop (1200px+), tablet (768–1199px) and mobile (below 768px)
- Accessibility: semantic HTML, skip link, `aria-*` attributes, visible focus states and `prefers-reduced-motion` support
- SEO basics: title, meta description, author, viewport and Open Graph tags

## Technologies

HTML5 · CSS3 (custom properties, grid, flexbox, `backdrop-filter`) · Vanilla JavaScript (ES6+) · Canvas API · Google Fonts (Space Grotesk, Inter, JetBrains Mono)

## Folder structure

```
atik-creative-portfolio/
├── index.html      # Page structure and content
├── style.css       # All styles (design tokens at the top)
├── script.js       # Interactions and animations
├── README.md
└── assets/
    └── profile.jpg # Profile photo
```

## How to run

No installation is needed. Open `index.html` in any modern browser.

To use a local server instead:

```bash
cd atik-creative-portfolio
python3 -m http.server 8000
# then visit http://localhost:8000
```

The Google Fonts stylesheet needs an internet connection. Without one, the site falls back to system fonts.

## How to replace the profile image

1. Choose a new photo (a JPG of about 1000–1400px on the long edge keeps the page fast).
2. Save it as `assets/profile.jpg`, replacing the existing file.
3. If your face sits off-centre, adjust `object-position` in `style.css` under `.profile-card__photo img` (currently `52% 45%`).
4. Update the `alt` text on the `<img>` in `index.html` to describe the new photo.

## How to customize text

| What | Where |
| --- | --- |
| Name, role, hero text, sections, projects, contact details | `index.html` |
| Rotating roles in the typing effect | `phrases` array in `script.js` (section 4) |
| Skill percentages | `data-level` attribute on each `.skill` in `index.html` (also update `aria-valuenow`) |
| Colours and fonts | CSS variables at the top of `style.css` (`:root`) |
| Email used by the form's `mailto:` link | `TO_EMAIL` in `script.js` (section 9) |
| Project links | The `href` on each `.project` card in `index.html` |

The skill percentages are visual indicators for the portfolio, not certified measurements.

## Contact form

This is a static site, so the form does not send email. After validation it shows a confirmation message and offers an "Open in email app" button that opens a pre-filled `mailto:` link. To receive real submissions, connect the form to a service such as Formspree or Netlify Forms.

## How to deploy with GitHub Pages

1. Create a new repository on GitHub, for example `atik-creative-portfolio`.
2. Upload the project files, keeping `index.html` in the repository root and the `assets/` folder beside it:
   ```bash
   git init
   git add .
   git commit -m "Add portfolio"
   git branch -M main
   git remote add origin https://github.com/ATIQULTIU/atik-creative-portfolio.git
   git push -u origin main
   ```
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose the `main` branch and the `/ (root)` folder, then save.
5. After a minute or two the site is live at `https://atiqultiu.github.io/atik-creative-portfolio/`.

## Links

- GitHub: https://github.com/ATIQULTIU
- Portfolio: https://md-atiqul-islam.my.canva.site/
- Email: atik.cmttiu1001@gmail.com

© 2026 MD. Atiqul Islam (Atik)
