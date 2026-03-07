/* ============================================================
   CAMPAIGN WEBSITE — JavaScript
   ============================================================ */

'use strict';

/* ── STICKY HEADER ──────────────────────────────────────────── */
const header = document.getElementById('site-header');

function onScroll() {
  header.classList.toggle('scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── MOBILE NAV ─────────────────────────────────────────────── */
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    navToggle.focus();
  }
});

/* ── SCROLL ANIMATIONS ──────────────────────────────────────── */
function initScrollAnimations() {
  if (!window.IntersectionObserver) return;

  // Tag elements to animate
  const animateSelectors = [
    '.issue-card',
    '.involved-card',
    '.about-photo-wrap',
    '.about-content-col',
    '.donate-text',
    '.donate-widget',
    '.contact-form',
    '.contact-info',
  ];

  const allEls = document.querySelectorAll(animateSelectors.join(', '));
  allEls.forEach((el, i) => {
    el.classList.add('fade-in');
    // Stagger cards in a grid
    if (el.classList.contains('issue-card') || el.classList.contains('involved-card')) {
      el.style.transitionDelay = `${(i % 3) * 80}ms`;
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  allEls.forEach(el => observer.observe(el));
}

initScrollAnimations();

/* ── DONATE WIDGET ──────────────────────────────────────────── */
const amountBtns   = document.querySelectorAll('.amount-btn');
const customInput  = document.getElementById('custom-amount');
const donateBtn    = document.getElementById('donate-btn');

// !! Replace this base URL with your actual ActBlue page URL !!
const ACTBLUE_BASE = 'https://secure.actblue.com/donate/[YOUR-ACTBLUE-SLUG]';

function getSelectedAmount() {
  const custom = customInput ? customInput.value.trim() : '';
  if (custom) return Number(custom);
  const active = document.querySelector('.amount-btn.active');
  return active ? Number(active.dataset.amount) : null;
}

function getFrequency() {
  const checked = document.querySelector('input[name="frequency"]:checked');
  return checked ? checked.value : 'once';
}

function updateDonateLink() {
  const amount    = getSelectedAmount();
  const frequency = getFrequency();
  let url = ACTBLUE_BASE;
  if (amount) {
    url += `?amount=${amount}`;
    if (frequency === 'monthly') url += '&recurring=1';
  }
  if (donateBtn) donateBtn.href = url;
}

amountBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    amountBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (customInput) customInput.value = '';
    updateDonateLink();
  });
});

if (customInput) {
  customInput.addEventListener('input', () => {
    amountBtns.forEach(b => b.classList.remove('active'));
    updateDonateLink();
  });
}

document.querySelectorAll('input[name="frequency"]').forEach(radio => {
  radio.addEventListener('change', updateDonateLink);
});

updateDonateLink();

/* ── EMAIL SIGNUP FORMS ─────────────────────────────────────── */
function handleEmailSignup(form, successId) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    const submitBtn  = form.querySelector('button[type="submit"], button:last-of-type');
    const successEl  = document.getElementById(successId);

    if (!emailInput || !emailInput.validity.valid) {
      emailInput.focus();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled  = true;
      submitBtn.textContent = 'Sending…';
    }

    // !! Replace this with your real email list integration (e.g., MailChimp, ActBlue, NGP VAN) !!
    await simulateSubmit(1200);

    form.reset();
    if (submitBtn) {
      submitBtn.disabled  = false;
      submitBtn.textContent = 'Sign Up';
    }
    if (successEl) {
      successEl.hidden = false;
      successEl.focus();
      setTimeout(() => { successEl.hidden = true; }, 5000);
    }
  });
}

const signupForm     = document.getElementById('email-signup');
const footerForm     = document.getElementById('footer-email-form');

if (signupForm) handleEmailSignup(signupForm,  'signup-success');

if (footerForm) {
  footerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = footerForm.querySelector('button');
    if (btn) { btn.disabled = true; btn.textContent = '✓'; }
    await simulateSubmit(800);
    footerForm.reset();
    if (btn) {
      btn.disabled    = false;
      btn.textContent = 'Go';
    }
  });
}

/* ── CONTACT FORM ───────────────────────────────────────────── */
const contactForm    = document.getElementById('contact-form');
const contactSuccess = document.getElementById('contact-success');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic client-side validation
    const required = contactForm.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      if (!field.value.trim() || (field.type === 'email' && !field.validity.valid)) {
        field.classList.add('field-error');
        valid = false;
      } else {
        field.classList.remove('field-error');
      }
    });
    if (!valid) {
      contactForm.querySelector('.field-error')?.focus();
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled    = true;
      submitBtn.textContent = 'Sending…';
    }

    // !! Replace this with your real form backend (e.g., Formspree, Netlify Forms, NGP VAN) !!
    await simulateSubmit(1500);

    contactForm.reset();
    if (submitBtn) {
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Send Message';
    }
    if (contactSuccess) {
      contactSuccess.hidden = false;
      contactSuccess.focus();
      setTimeout(() => { contactSuccess.hidden = true; }, 6000);
    }
  });

  // Clear error styling on change
  contactForm.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('field-error'));
  });
}

/* ── FOOTER YEAR ────────────────────────────────────────────── */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── SMOOTH SCROLL (polyfill for older Safari) ──────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── UTILITY ────────────────────────────────────────────────── */
function simulateSubmit(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ── FIELD ERROR STYLE (injected) ──────────────────────────── */
const errorStyle = document.createElement('style');
errorStyle.textContent = `
  .field-error {
    border-color: #c62828 !important;
    box-shadow: 0 0 0 3px rgba(198,40,40,.15);
  }
`;
document.head.appendChild(errorStyle);
