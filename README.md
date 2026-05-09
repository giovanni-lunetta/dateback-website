# DateBack Website

Official website for [DateBack](https://dateback.app) - Archive your Snapchat Memories the right way.

## 🌐 Live Site

**Production:** [https://dateback.app](https://dateback.app)

## 📋 About

DateBack is a macOS app that processes Snapchat Memories exports, fixing metadata and organizing files for cloud storage. This repository contains the marketing website and documentation.

## 🛠️ Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript (no frameworks)
- **Hosting:** Netlify
- **Security:** Content Security Policy, security headers
- **Forms:** Netlify Forms

## 🚀 Local Development

```bash
# Clone the repository
git clone https://github.com/giovanni-lunetta/dateback-website.git
cd dateback-website

# Option 1: Open directly in browser
open index.html

# Option 2: Use Python HTTP server
python3 -m http.server 8000
# Visit http://localhost:8000

# Option 3: Use Node.js http-server
npx http-server -p 8000
```

Additional local-device testing notes live in `docs/MOBILE_TESTING_LOCAL_WEBSITE.md`.

## 🚦 Deployment Gate

The site download buttons point to GitHub `releases/latest`, so do not deploy website copy for a new app version until the release repository is public and `latest` points at that version:

```bash
unset GH_TOKEN
gh repo view giovanni-lunetta/dateback-releases --json latestRelease,visibility --jq '{visibility:.visibility, latestTag:.latestRelease.tagName}'
```

For the current free-download launch, this must return `PUBLIC` and the version shown on the home page. Deploying before that would advertise one app version while the download page can still serve an older build.

## 📁 Project Structure

```
dateback-website/
├── docs/               # Repo-local notes for website development/testing
├── index.html          # Main landing page
├── changelog.html      # Release notes
├── styles.css          # All styles
├── script.js           # Interactive features
├── netlify.toml        # Netlify config & security headers
├── images/             # Assets and screenshots
├── licenses/           # Third-party licenses
└── README.md           # This file
```

## 🔒 Security Features

- **Content Security Policy (CSP)** - Prevents XSS attacks
- **X-Frame-Options** - Prevents clickjacking
- **X-Content-Type-Options** - Prevents MIME sniffing
- **Strict HTTPS** - All resources loaded over HTTPS
- **Referrer Policy** - Controls referrer information

See `netlify.toml` for full security header configuration.

## 🎨 Features

- **Responsive Design** - Mobile-first, works on all devices
- **Accessibility** - WCAG compliant, keyboard navigation
- **Performance** - Optimized images, lazy loading
- **SEO** - Semantic HTML, meta tags, structured data
- **Interactive Demo** - Before/after comparison slider

## 🤝 Contributing

Found a typo or bug? Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b fix/typo-in-faq`)
3. Commit your changes (`git commit -m 'Fix typo in FAQ section'`)
4. Push to the branch (`git push origin fix/typo-in-faq`)
5. Open a Pull Request

### Contribution Guidelines

- Keep the design consistent with existing style
- Test on mobile devices before submitting
- Ensure all links work
- Run HTML/CSS validators
- Check accessibility with browser DevTools

## 📝 License

Website code: **MIT License** (see [LICENSE](LICENSE))  
DateBack app: Proprietary

## 🔗 Links

- **Website:** [dateback.app](https://dateback.app)
- **Download:** [Latest Mac release](https://github.com/giovanni-lunetta/dateback-releases/releases/latest)
- **Optional support:** [Buy Me A Coffee](https://www.buymeacoffee.com/giovannilunetta)
- **Support:** Contact form on website
- **App Repository:** Private

## 🙏 Acknowledgments

- Design inspiration from modern SaaS landing pages
- Icons and assets created specifically for DateBack
- Hosted on [Netlify](https://www.netlify.com/)

---

**Made with ❤️ by Giovanni Lunetta**
