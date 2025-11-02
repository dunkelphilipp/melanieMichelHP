# 📸 Melanie Michel Photography

Professional photography portfolio website showcasing weddings, events, and personal shootings in Zürich, Switzerland.

## 🌐 Live Website

[View Live Site](https://melaniemichelfotografie.ch)

## ✨ Features

- **Modern Design**: Clean, elegant interface focused on showcasing photography
- **Responsive**: Fully responsive design works on desktop, tablet, and mobile
- **Smooth Animations**: Scroll-driven animations throughout the site
- **Image Gallery**: Interactive lightbox gallery with keyboard/swipe navigation
- **Performance Optimized**: WebP images, lazy loading, optimized delivery
- **Security**: Meta tag security headers, GDPR-compliant cookie consent
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Grid, Flexbox, smooth animations
- **Vanilla JavaScript**: No frameworks, pure JS for optimal performance
- **WebP Images**: Next-gen image format for faster loading
- **GitHub Pages**: Free, secure hosting with automatic HTTPS

## 📁 Project Structure

```
melanie-michel-photography/
├── index.html              # Main homepage
├── impressum.html          # Legal imprint (German requirement)
├── datenschutz.html        # Privacy policy (GDPR compliance)
├── robots.txt              # Search engine instructions
├── css/
│   └── styles.css          # All styles
├── js/
│   └── app.js              # All JavaScript functionality
├── img/                    # All images organized by section
│   ├── logo/
│   ├── frontpage/
│   ├── selfportrait/
│   ├── portfolio/
│   │   ├── wedding/
│   │   ├── event/
│   │   └── shooting/
│   └── cta/
└── .well-known/
    └── security.txt        # Security contact info
```

## 🚀 Local Development

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/melanie-michel-photography.git
cd melanie-michel-photography
```

2. Open `index.html` in your browser or use a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using VS Code
# Install "Live Server" extension and click "Go Live"
```

3. Visit `http://localhost:8000` in your browser

## 📝 Content Updates

### Updating Text Content
Edit the HTML files directly:
- `index.html` - Main page content
- `impressum.html` - Legal imprint
- `datenschutz.html` - Privacy policy

### Adding New Images

1. **Optimize images first** (using your thumbnail builder):
    - Create WebP format
    - Generate thumbnails for gallery images
    - Keep file sizes reasonable

2. **Upload to appropriate folder** in `img/`

3. **Update HTML** in the gallery section:
```html
<figure class="gallery__item">
    <img src="img/portfolio/wedding/wedding-new-thumb.webp"
         data-full="img/portfolio/wedding/wedding-new.webp"
         alt="Wedding description"
         loading="lazy"
         decoding="async">
</figure>
```

### Deploying Updates

```bash
git add .
git commit -m "Description of changes"
git push origin main
```

GitHub Pages will automatically rebuild (1-2 minutes).

## 🔒 Security Features

- Content Security Policy via meta tags
- XSS protection headers
- Clickjacking prevention (X-Frame-Options)
- HTTPS enforced by GitHub Pages
- No server-side code = minimal attack surface
- GDPR-compliant cookie consent
- Secure contact form alternative (mailto)

## 🎨 Design Philosophy

- **Minimalist**: Content-first design, no distractions
- **Photography-Focused**: Large images, immersive galleries
- **Swiss Design**: Clean, precise, functional
- **Performance**: Fast loading, smooth animations
- **Accessibility**: Keyboard navigation, screen reader friendly

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

© 2025 Melanie Michel. All rights reserved.

All photographs are copyrighted by Melanie Michel.
Unauthorized use, reproduction, or distribution is prohibited.

Website code may be used as reference with attribution.

## 📞 Contact

- **Email**: melaniemichelfotografie@gmail.com
- **Instagram**: [@_melaniemichelfotografie](https://www.instagram.com/_melaniemichelfotografie)
- **Location**: Zürich, Switzerland

## 🙏 Acknowledgments

Built with care for showcasing professional photography.
Designed and developed in 2025.

---

**Note**: This repository contains only the final optimized images and website code.
Original source files, RAW images, and build tools are kept private.