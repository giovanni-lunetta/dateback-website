// =============================================
// DateBack — main script
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Platform detection → smart download label
  // ==========================================
  // NOTE: All Mac browsers report "Intel Mac OS X" in the UA string regardless of
  // chip (Apple Silicon or Intel), so UA alone cannot distinguish M-series from Intel.
  // Strategy: default to Apple Silicon (correct for all Macs sold since late 2020),
  // then use the Client Hints API on Chromium browsers to detect Intel specifically.
  const DL_LABEL_IDS = ['hero-dl-label', 'pricing-dl-label', 'nav-dl-label', 'mobile-dl-label'];

  function setDownloadLabel(label) {
    DL_LABEL_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = label;
    });
  }

  const ua = navigator.userAgent;
  if (/Win/i.test(ua)) {
    setDownloadLabel('Download for Windows');
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    // Default to Apple Silicon — the correct chip for most Macs since late 2020.
    setDownloadLabel('Download for Mac — Apple Silicon');
    // On Chromium-based browsers, the Client Hints API can confirm Intel (x86).
    // Safari and Firefox do not expose this API, so we keep the Apple Silicon default.
    if (navigator.userAgentData) {
      navigator.userAgentData.getHighEntropyValues(['architecture']).then(hint => {
        if (hint.architecture === 'x86') {
          setDownloadLabel('Download for Mac — Intel');
        }
      }).catch(() => {});
    }
  }

  // ==========================================
  // 2. Nav shrink on scroll + active link
  // ==========================================
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.style.background = 'var(--nav-bg)';
    } else {
      nav.style.background = '';
    }
  }, { passive: true });

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

  sections.forEach(s => sectionObserver.observe(s));

  // ==========================================
  // 3. Mobile menu toggle
  // ==========================================
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile-menu');

  function closeMobileMenu() {
    if (!mobileMenu || !hamburger) return;
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        mobileMenu.classList.add('open');
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
    });

    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));

    document.addEventListener('click', e => {
      if (mobileMenu.classList.contains('open') &&
          !mobileMenu.contains(e.target) &&
          !hamburger.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }

  // ==========================================
  // 4. Smooth scroll (no scrollIntoView)
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
      history.pushState(null, null, id);
    });
  });

  // ==========================================
  // 5. Other-platforms dropdown
  // ==========================================
  function initOtherPlatforms(toggleId, menuId) {
    const btn  = document.getElementById(toggleId);
    const menu = document.getElementById(menuId);
    if (!btn || !menu) return;

    btn.addEventListener('click', e => {
      e.stopPropagation();
      menu.classList.toggle('open');
      btn.textContent = menu.classList.contains('open') ? 'Fewer options ↑' : 'Other platforms ↓';
    });
    document.addEventListener('click', e => {
      if (!menu.contains(e.target) && e.target !== btn) {
        menu.classList.remove('open');
        btn.textContent = 'Other platforms ↓';
      }
    });
  }
  initOtherPlatforms('other-platforms-toggle', 'other-platforms-menu');
  initOtherPlatforms('pricing-other-toggle', 'pricing-other-menu');

  // ==========================================
  // 6. Proof toggle (date before/after)
  // ==========================================
  const proofBtns   = document.querySelectorAll('.proof-btn');
  const proofWithout = document.getElementById('proof-without');
  const proofWith    = document.getElementById('proof-with');

  proofBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      proofBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const state = btn.dataset.state;
      if (state === 'with') {
        proofWithout.classList.add('hidden');
        proofWith.classList.remove('hidden');
      } else {
        proofWith.classList.add('hidden');
        proofWithout.classList.remove('hidden');
      }
    });
  });

  // ==========================================
  // 7. Hero app screenshot carousel
  // ==========================================
  const screenshots = document.querySelectorAll('.app-screenshot');
  const ssDots      = document.querySelectorAll('.ss-dot');
  let ssIndex = 0;
  let ssTimer = null;

  function showScreenshot(idx) {
    screenshots.forEach((s, i) => {
      s.classList.toggle('active', i === idx);
      s.style.opacity = i === idx ? '1' : '0';
      s.style.position = i === idx ? 'relative' : 'absolute';
    });
    ssDots.forEach((d, i) => d.classList.toggle('active', i === idx));
    ssIndex = idx;
  }

  function advanceScreenshot() {
    showScreenshot((ssIndex + 1) % screenshots.length);
  }

  function startAutoplay() {
    ssTimer = setInterval(advanceScreenshot, 4000);
  }

  function stopAutoplay() {
    clearInterval(ssTimer);
  }

  if (screenshots.length > 0) {
    showScreenshot(0);
    startAutoplay();

    ssDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        stopAutoplay();
        showScreenshot(i);
        startAutoplay();
      });
    });
  }

  // ==========================================
  // 8. Mobile sticky CTA — hide when hero/pricing visible
  // ==========================================
  const stickyCta = document.getElementById('mobile-sticky-cta');
  if (stickyCta) {
    const heroEl    = document.querySelector('.hero');
    const pricingEl = document.getElementById('pricing');

    const hideObserver = new IntersectionObserver(entries => {
      const anyVisible = entries.some(e => e.isIntersecting);
      stickyCta.style.display = anyVisible ? 'none' : '';
    }, { threshold: 0.2 });

    if (heroEl)    hideObserver.observe(heroEl);
    if (pricingEl) hideObserver.observe(pricingEl);
  }

  // ==========================================
  // 10. Lightbox for export step images
  // ==========================================
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lb-img');
  const lbClose    = document.getElementById('lb-close');

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || 'Enlarged view';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (lbClose) lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  document.querySelectorAll('.export-step-img img').forEach(img => {
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox?.classList.contains('open')) closeLightbox();
  });

  // ==========================================
  // 9. Contact modal
  // ==========================================
  function openContactModal(subject) {
    const modal = document.getElementById('contactModal');
    if (!modal) return;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    document.getElementById('contactForm').reset();
    document.getElementById('contactSuccess').style.display = 'none';
    document.getElementById('contactError').style.display = 'none';
    if (subject) {
      const sf = document.getElementById('contact-subject');
      if (sf) sf.value = subject;
    }
    // Move focus to the first focusable element inside the modal (accessibility)
    const firstFocusable = modal.querySelector('button, input, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) firstFocusable.focus();
  }

  function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (!modal) return;
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', e => {
    const opener = e.target.closest('[data-action="open-contact"]');
    if (opener) {
      const modal = document.getElementById('contactModal');
      if (!modal) return;
      e.preventDefault();
      openContactModal(opener.dataset.subject || '');
      return;
    }
    const closer = e.target.closest('[data-action="close-contact"]');
    if (closer) { e.preventDefault(); closeContactModal(); return; }
    const modal = document.getElementById('contactModal');
    if (modal && e.target === modal) closeContactModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('contactModal');
      if (modal && modal.classList.contains('show')) { closeContactModal(); return; }
    }
    // Trap Tab focus inside open modals / lightbox
    if (e.key === 'Tab') {
      const modal = document.getElementById('contactModal');
      if (modal && modal.classList.contains('show')) {
        trapFocus(e, modal);
        return;
      }
      const lb = document.getElementById('lightbox');
      if (lb && lb.classList.contains('open')) {
        trapFocus(e, lb);
      }
    }
  });

  function trapFocus(e, container) {
    const focusable = Array.from(container.querySelectorAll(
      'button, input, textarea, select, a[href], [tabindex]:not([tabindex="-1"])'
    )).filter(el => !el.disabled);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      const submitBtn = document.getElementById('contactSubmit');
      const successMsg = document.getElementById('contactSuccess');
      const errorMsg   = document.getElementById('contactError');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      successMsg.style.display = 'none';
      errorMsg.style.display = 'none';
      try {
        const formData = new FormData(contactForm);
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        });
        if (response.ok) {
          successMsg.style.display = 'block';
          contactForm.reset();
          setTimeout(closeContactModal, 3000);
        } else {
          errorMsg.style.display = 'block';
        }
      } catch {
        errorMsg.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  }

}); // end DOMContentLoaded

// =============================================
// Tweaks panel
// Tweaks panel (theme switcher)
// =============================================
(function() {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{"theme":"slate"}/*EDITMODE-END*/;

  let current = { ...TWEAK_DEFAULTS };

  // Apply saved theme
  document.documentElement.setAttribute('data-theme', current.theme);

  const EDITOR_ORIGIN = 'https://dateback.app';

  function applyTheme(t) {
    current.theme = t;
    document.documentElement.setAttribute('data-theme', t);
    document.querySelectorAll('.theme-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === t);
    });
    if (window.parent !== window) {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { theme: t } }, EDITOR_ORIGIN);
    }
  }

  function buildPanel() {
    const panel = document.createElement('div');
    panel.className = 'tweaks-panel';
    panel.id = 'tweaks-panel';
    // Swatch colors are set via CSS classes (theme-swatch-slate etc.) to avoid
    // inline style attributes which violate the style-src CSP directive.
    panel.innerHTML = `
      <div class="tweaks-panel-header">
        <h4>Tweaks</h4>
        <button class="tweaks-close" id="tweaks-close">&#x2715;</button>
      </div>
      <p class="tweaks-label">Theme</p>
      <div class="tweaks-themes">
        <button class="theme-option${current.theme === 'slate' ? ' active' : ''}" data-theme="slate">
          <span class="theme-swatch theme-swatch-slate"></span>
          Slate &mdash; Dark Navy
        </button>
        <button class="theme-option${current.theme === 'obsidian' ? ' active' : ''}" data-theme="obsidian">
          <span class="theme-swatch theme-swatch-obsidian"></span>
          Obsidian &mdash; Editorial
        </button>
        <button class="theme-option${current.theme === 'paper' ? ' active' : ''}" data-theme="paper">
          <span class="theme-swatch theme-swatch-paper"></span>
          Paper &mdash; Light
        </button>
      </div>
    `;
    document.body.appendChild(panel);

    panel.querySelectorAll('.theme-option').forEach(btn => {
      btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
    });

    document.getElementById('tweaks-close').addEventListener('click', () => {
      panel.classList.remove('open');
      if (window.parent !== window) {
        window.parent.postMessage({ type: '__edit_mode_dismissed' }, EDITOR_ORIGIN);
      }
    });
  }

  window.addEventListener('message', e => {
    if (e.origin !== EDITOR_ORIGIN && window.parent === window) return;
    if (e.data?.type === '__activate_edit_mode') {
      if (!document.getElementById('tweaks-panel')) buildPanel();
      document.getElementById('tweaks-panel').classList.add('open');
    }
    if (e.data?.type === '__deactivate_edit_mode') {
      const p = document.getElementById('tweaks-panel');
      if (p) p.classList.remove('open');
    }
  });

  if (window.parent !== window) {
    window.parent.postMessage({ type: '__edit_mode_available' }, EDITOR_ORIGIN);
  }
})();
