const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const htmlFiles = [
    'index.html',
    'install.html',
    'privacy-policy.html',
    'terms-of-service.html',
    'changelog.html'
];
const allHtmlFiles = [
    ...htmlFiles,
    'licenses.html'
];
const freeDownloadUrl = 'https://github.com/giovanni-lunetta/dateback-releases/releases/latest';
const donationUrl = 'https://www.buymeacoffee.com/giovannilunetta';
const primaryPages = [
    'index.html',
    'install.html',
    'changelog.html'
];
const appProductionDependencies = [
    ['adm-zip', '0.5.17'],
    ['check-disk-space', '3.4.0'],
    ['electron-updater', '6.8.3'],
    ['glob', '13.0.6']
];

function read(file) {
    return fs.readFileSync(path.join(root, file), 'utf8');
}

test('public pages use GitHub Releases for the free Mac download', () => {
    for (const file of htmlFiles) {
        const source = read(file);
        assert.equal(source.includes('buy.polar.sh'), false, `${file} must not link to Polar checkout`);
        assert.equal(source.includes('Buy &amp; Download for Mac'), false, `${file} must not describe a paid download CTA`);
        assert.ok(source.includes(freeDownloadUrl), `${file} should link to latest GitHub Releases download`);
    }
});

test('home page presents optional donation instead of purchase activation', () => {
    const source = read('index.html');

    assert.ok(source.includes('v1.4.2'), 'home page should present the current free-model release version');
    assert.ok(source.includes(donationUrl), 'home page should include the Buy Me A Coffee support link');
    assert.equal(source.includes('$1.99'), false);
    assert.equal(source.includes('license key'), false);
    assert.equal(source.includes('Activate License'), false);
    assert.equal(source.includes('Secure payment via Polar.sh'), false);
});

test('public pages preserve the no-tracking promise', () => {
    for (const file of htmlFiles) {
        const source = read(file);
        assert.equal(source.includes('googletagmanager.com'), false, `${file} must not load Google Tag Manager`);
        assert.equal(source.includes('google-analytics.com'), false, `${file} must not load Google Analytics`);
        assert.equal(source.includes('gtag('), false, `${file} must not include Google Analytics gtag calls`);
    }
});

test('public pages rely on normal Buy Me A Coffee links instead of the widget script', () => {
    for (const file of htmlFiles) {
        const source = read(file);
        assert.equal(source.includes('cdnjs.buymeacoffee.com'), false, `${file} must not load the Buy Me A Coffee widget`);
        assert.equal(source.includes('data-name="BMC-Widget"'), false, `${file} must not include the Buy Me A Coffee widget markup`);
    }
});

test('legal pages describe free app and optional external donations', () => {
    const terms = read('terms-of-service.html');
    const privacy = read('privacy-policy.html');

    assert.equal(terms.includes('Polar.sh'), false);
    assert.equal(privacy.includes('Polar.sh'), false);
    assert.ok(terms.includes('Last Updated:</strong> May 5, 2026'));
    assert.ok(privacy.includes('Last Updated:</strong> May 12, 2026'));
    assert.ok(terms.includes('DateBack is currently provided as a free download'));
    assert.ok(terms.includes('Optional donations are processed by Buy Me A Coffee'));
    assert.ok(privacy.includes('DateBack does not require a license key'));
    assert.ok(privacy.includes('Optional donations are handled by Buy Me A Coffee'));
    assert.ok(privacy.includes('GDPR and CCPA Notes'));
});

test('install page reflects current free release size guidance', () => {
    const source = read('install.html');

    assert.ok(source.includes('about 180 MB'));
    assert.equal(source.includes('about 80 MB'), false);
});

test('public changelog uses neutral copy for retired paid-model details', () => {
    const source = read('changelog.html');

    assert.equal(source.includes('14-day money-back guarantee'), false);
    assert.equal(source.includes('licensing QA mode'), false);
});

test('Netlify launch headers include HSTS while preserving documented CSP', () => {
    const source = read('netlify.toml');

    assert.match(source, /Strict-Transport-Security\s*=\s*"max-age=31536000; includeSubDomains; preload"/);
    assert.ok(source.includes('Content-Security-Policy = """'));
    assert.ok(source.includes("# Content Security Policy (CSP)"));
    assert.ok(source.includes("upgrade-insecure-requests;"));
    assert.ok(source.includes("img-src 'self' data: https://cdn.buymeacoffee.com;"));
    assert.equal(source.includes("img-src 'self' data: https:;"), false);
});

test('redirects canonicalize www dateback domain to apex HTTPS', () => {
    const source = read('_redirects');

    assert.ok(
        source.includes('https://www.dateback.app/* https://dateback.app/:splat 301!'),
        'www DateBack HTTPS requests should permanently redirect to the apex domain'
    );
});

test('CSS exposes legacy variable aliases used by website components', () => {
    const source = read('styles.css');

    for (const variable of [
        '--text-primary',
        '--text-secondary',
        '--accent-blue',
        '--accent-green',
        '--bg-section'
    ]) {
        assert.match(source, new RegExp(`${variable}:\\s*var\\(--`), `${variable} should map to an existing design token`);
    }
});

test('contact form fields have a visible scoped focus treatment', () => {
    const source = read('styles.css');

    assert.match(source, /\.contact-modal\s+\.form-group\s+(?:input|textarea):focus-visible/);
    assert.match(source, /box-shadow:\s*0 0 0 3px rgba\(136,\s*189,\s*242,\s*0\.28\)/);
});

test('mobile menu buttons declare explicit button type', () => {
    for (const file of htmlFiles) {
        const source = read(file);
        const matches = source.match(/<button[^>]*class="mobile-menu-btn"[^>]*>/g) || [];

        assert.ok(matches.length > 0, `${file} should include a mobile menu button`);
        for (const match of matches) {
            assert.match(match, /\stype="button"/, `${file} mobile menu button should not default to submit`);
        }
    }
});

test('primary pages expose a main content landmark target', () => {
    for (const file of primaryPages) {
        const source = read(file);

        assert.match(source, /<main\b[^>]*id="main-content"/, `${file} should include <main id="main-content">`);
        assert.match(source, /<\/main>/, `${file} should close the main landmark before footer content`);
    }
});

test('website license references DateBack rather than stale app names', () => {
    const source = read('LICENSE');

    assert.ok(source.includes('The DateBack application'));
    assert.equal(source.includes('MemSavr'), false);
});

test('website open source license page matches current app production dependencies', () => {
    const source = read('licenses.html');

    for (const [name, version] of appProductionDependencies) {
        assert.match(source, new RegExp(`<td>${name}</td>\\s*<td>${version}</td>`));
    }

    assert.equal(source.includes('<td>dotenv</td>'), false, 'dotenv is dev-only and should not be listed as production');
    assert.equal(source.includes('<td>0.5.16</td>'), false, 'adm-zip version should not be stale');
    assert.equal(source.includes('<td>13.0.0</td>'), false, 'glob version should not be stale');
    assert.ok(fs.existsSync(path.join(root, 'licenses', 'PYTHON-PSF-LICENSE.txt')));
    assert.ok(fs.existsSync(path.join(root, 'licenses', 'PILLOW-HPND-LICENSE.txt')));
    assert.ok(source.includes('PYTHON-PSF-LICENSE.txt'));
    assert.ok(source.includes('PILLOW-HPND-LICENSE.txt'));
});

test('all public HTML pages declare 1200 by 630 social image metadata', () => {
    for (const file of allHtmlFiles) {
        const source = read(file);

        assert.match(source, /<meta property="og:image" content="https:\/\/dateback\.app\/images\/og-image\.jpg">/);
        assert.match(source, /<meta property="og:image:width" content="1200">/, `${file} should declare OG width`);
        assert.match(source, /<meta property="og:image:height" content="630">/, `${file} should declare OG height`);
    }
});

test('sitemap orders higher-priority pages before lower-priority pages', () => {
    const source = read('sitemap.xml');
    const priorities = [...source.matchAll(/<url>[\s\S]*?<priority>([0-9.]+)<\/priority>[\s\S]*?<\/url>/g)]
        .map((match) => Number(match[1]));

    assert.ok(priorities.length > 0, 'sitemap should include priority values');
    for (let index = 1; index < priorities.length; index += 1) {
        assert.ok(
            priorities[index - 1] >= priorities[index],
            `priority ${priorities[index - 1]} should be >= following priority ${priorities[index]}`
        );
    }
});
