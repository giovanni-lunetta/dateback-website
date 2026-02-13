// DateBack Website JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const nav = document.querySelector('nav');
    const hamburger = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = mobileMenu?.querySelectorAll('a');
    const navLinks = document.querySelectorAll('.nav-center a');
    const sections = document.querySelectorAll('section[id]');

    // ========================================
    // 1. Nav Shrink on Scroll
    // ========================================
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
    }, { passive: true });

    // ========================================
    // 2. Mobile Menu Toggle
    // ========================================
    function openMenu() {
        mobileMenu.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        hamburger.innerHTML = '✕';
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.innerHTML = '☰';
        document.body.style.overflow = '';
    }

    function toggleMenu() {
        if (mobileMenu.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }

    // Close on link click
    mobileLinks?.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) {
            closeMenu();
        }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (mobileMenu?.classList.contains('open') &&
            !mobileMenu.contains(e.target) &&
            !hamburger.contains(e.target)) {
            closeMenu();
        }
    });

    // ========================================
    // 3. Active Nav Link Highlighting
    // ========================================
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                // Update desktop nav
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // ========================================
    // 4. Export Guide Accordion Deep-Link
    // ========================================
    function openExportGuide() {
        const exportGuideDetails = document.querySelector('#export-guide details');
        if (exportGuideDetails) {
            exportGuideDetails.open = true;
            // Scroll to section after a brief delay
            setTimeout(() => {
                const section = document.querySelector('#export-guide');
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }

    // Check on page load
    if (window.location.hash === '#export-guide' || window.location.hash === '#tutorial') {
        openExportGuide();
    }

    // Listen for hash changes
    window.addEventListener('hashchange', () => {
        if (window.location.hash === '#export-guide' || window.location.hash === '#tutorial') {
            openExportGuide();
        }
    });

    // ========================================
    // 5. Lightbox for Tutorial Images
    // ========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    document.querySelectorAll('.step-image img').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            if (lightbox && lightboxImg) {
                lightbox.classList.add('active');
                lightboxImg.src = img.src;
            }
        });
    });

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === lightboxClose) {
                lightbox.classList.remove('active');
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox?.classList.contains('active')) {
            lightbox.classList.remove('active');
        }
    });

    // ========================================
    // 6. Hero Carousel
    // ========================================
    const carouselImages = document.querySelectorAll('.carousel-image');
    const carouselDots = document.querySelectorAll('.carousel-dots .dot');
    const arrowLeft = document.querySelector('.carousel-arrow-left');
    const arrowRight = document.querySelector('.carousel-arrow-right');
    let currentSlide = 0;

    function showSlide(index) {
        carouselImages.forEach(img => img.classList.remove('active'));
        carouselDots.forEach(dot => dot.classList.remove('active'));

        if (carouselImages[index]) {
            carouselImages[index].classList.add('active');
            carouselDots[index].classList.add('active');
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % carouselImages.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + carouselImages.length) % carouselImages.length;
        showSlide(currentSlide);
    }

    // Arrow click handlers
    if (arrowLeft) {
        arrowLeft.addEventListener('click', prevSlide);
    }

    if (arrowRight) {
        arrowRight.addEventListener('click', nextSlide);
    }

    // Dot click handlers
    carouselDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // ========================================
    // 7. Smooth Scroll for Nav Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();

                // If navigating to export-guide, open the accordion first
                if (targetId === '#export-guide') {
                    const exportGuideDetails = document.querySelector('#export-guide details');
                    if (exportGuideDetails) {
                        exportGuideDetails.open = true;
                    }
                }

                target.scrollIntoView({ behavior: 'smooth' });

                // Update URL without triggering hashchange
                history.pushState(null, null, targetId);
            }
        });
    });
});

// ========================================
// 8. Contact Modal
// ========================================

function openContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        // Reset form
        document.getElementById('contactForm').reset();
        document.getElementById('contactSuccess').style.display = 'none';
        document.getElementById('contactError').style.display = 'none';
    }
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Handle contact form submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            const submitBtn = document.getElementById('contactSubmit');
            const submitText = document.getElementById('submitText');
            const submitSpinner = document.getElementById('submitSpinner');
            const successMsg = document.getElementById('contactSuccess');
            const errorMsg = document.getElementById('contactError');

            // Show loading state
            submitBtn.disabled = true;
            submitText.style.display = 'none';
            submitSpinner.style.display = 'inline';
            successMsg.style.display = 'none';
            errorMsg.style.display = 'none';

            try {
                // Create FormData from the form
                const formData = new FormData(form);

                // Submit to Netlify
                const response = await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData).toString()
                });

                if (response.ok) {
                    // Success!
                    successMsg.style.display = 'block';
                    form.reset();

                    // Close modal after 3 seconds
                    setTimeout(() => {
                        closeContactModal();
                    }, 3000);
                } else {
                    // Server error
                    errorMsg.style.display = 'block';
                }
            } catch (error) {
                // Network error
                console.error('Form submission error:', error);
                errorMsg.style.display = 'block';
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitText.style.display = 'inline';
                submitSpinner.style.display = 'none';
            }
        });
    }
});

// Close on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const contactModal = document.getElementById('contactModal');
        if (contactModal?.classList.contains('show')) {
            closeContactModal();
        }
    }
});

// Close on backdrop click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('contactModal');
    if (modal && e.target === modal) {
        closeContactModal();
    }
});

// ========================================
// 9. Interactive Difference Cards (Restore Date Taken section)
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('#real-example');
    const globalToggleBtns = document.querySelectorAll('.diff-global-btn');
    const viewWithout = document.querySelector('.diff-view--without');
    const viewWith = document.querySelector('.diff-view--with');

    if (!section || globalToggleBtns.length === 0 || !viewWithout || !viewWith) return;

    globalToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const state = btn.dataset.state;

            // Update button states
            globalToggleBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            // Toggle views and caption
            if (state === 'with') {
                section.classList.add('is-with');
                viewWithout.setAttribute('aria-hidden', 'true');
                viewWith.setAttribute('aria-hidden', 'false');

                // Show "With DateBack" caption
                document.querySelector('.caption-without').style.display = 'none';
                document.querySelector('.caption-with').style.display = 'block';
            } else {
                section.classList.remove('is-with');
                viewWithout.setAttribute('aria-hidden', 'false');
                viewWith.setAttribute('aria-hidden', 'true');

                // Show "Without DateBack" caption
                document.querySelector('.caption-without').style.display = 'block';
                document.querySelector('.caption-with').style.display = 'none';
            }
        });

        // Keyboard support
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });
});
