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
const freeDownloadUrl = 'https://github.com/giovanni-lunetta/dateback-releases/releases/latest';
const donationUrl = 'https://www.buymeacoffee.com/dateback';

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

    assert.ok(source.includes('v1.3.1'), 'home page should present the current free-model release version');
    assert.ok(source.includes(donationUrl), 'home page should include the Buy Me A Coffee support link');
    assert.equal(source.includes('$1.99'), false);
    assert.equal(source.includes('license key'), false);
    assert.equal(source.includes('Activate License'), false);
    assert.equal(source.includes('Secure payment via Polar.sh'), false);
});

test('legal pages describe free app and optional external donations', () => {
    const terms = read('terms-of-service.html');
    const privacy = read('privacy-policy.html');

    assert.equal(terms.includes('Polar.sh'), false);
    assert.equal(privacy.includes('Polar.sh'), false);
    assert.ok(terms.includes('Last Updated:</strong> May 5, 2026'));
    assert.ok(privacy.includes('Last Updated:</strong> May 5, 2026'));
    assert.ok(terms.includes('DateBack is currently provided as a free download'));
    assert.ok(terms.includes('Optional donations are processed by Buy Me A Coffee'));
    assert.ok(privacy.includes('DateBack does not require a license key'));
    assert.ok(privacy.includes('Optional donations are handled by Buy Me A Coffee'));
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
