/* ============================================================
   ABBACY GLOBAL GROUP — app.js
   Clean, simple, performant
   ============================================================ */

'use strict';

/* ── Animated Counters ─────────────────────────────────── */
function animateCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const isDecimal = el.hasAttribute('data-decimal');
    const dur = 2000;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = eased * target;
      el.textContent = isDecimal ? val.toFixed(1) : Math.floor(val).toLocaleString('en-IN');
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString('en-IN');
    }
    requestAnimationFrame(tick);
  });
}

const statsBlock = document.querySelector('.hero-stats');
if (statsBlock) {
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCounters();
      entries[0].target._io.disconnect();
    }
  }, { threshold: 0.4 }).observe(statsBlock);
  // fix: can't attach to _io, use a flag
  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { animateCounters(); io.disconnect(); }
  }, { threshold: 0.4 });
  io.observe(statsBlock);
}

/* ── Navbar scroll ─────────────────────────────────── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ── Active nav link on scroll ─────────────────────── */
const sections = document.querySelectorAll('section[id], .hero[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
if (navLinks.length) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY + 90;
    sections.forEach(sec => {
      if (offset >= sec.offsetTop && offset < sec.offsetTop + sec.offsetHeight) {
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id);
        });
      }
    });
  }, { passive: true });
}

/* ── Hamburger / Mobile Menu ───────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    }
  });
}

/* ── Smooth Scroll ─────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
    }
  });
});

/* ── Scroll Animations ─────────────────────────────── */
const animEls = document.querySelectorAll(
  '.service-card, .dest-card, .tcard, .journey-card, .why-card, .cinfo-card, .faq-item, .about-grid, .stat-box'
);
if ('IntersectionObserver' in window && animEls.length) {
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 60);
        o.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  animEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    obs.observe(el);
  });
}

/* ── FAQ Accordion ─────────────────────────────────── */
const faqList = document.querySelector('.faq-list');
if (faqList) {
  faqList.addEventListener('click', e => {
    const btn = e.target.closest('.faq-q');
    if (!btn) return;
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');

    // Close all
    faqList.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });

    // Toggle clicked
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
}

/* ── Phone Validation Helper ───────────────────────── */
function isValidPhone(phone) {
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  // Accept 10-digit Indian numbers (with or without 91 prefix)
  return /^(91)?[6-9]\d{9}$/.test(cleaned);
}

/* ── Hero Quick Form ───────────────────────────────── */
const heroForm = document.getElementById('heroForm');
if (heroForm) {
  heroForm.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(heroForm));
    if (!data.name.trim() || !data.phone.trim()) {
      alert('Please fill in your name and phone number.');
      return;
    }
    if (!isValidPhone(data.phone)) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }

    // Show success instantly
    heroForm.innerHTML = '<p style="color:#16A34A;font-weight:600;text-align:center;padding:20px 0">✅ You\'re all set! Our expert counselor will reach out to you shortly. 🚀</p>';

    // Submit in background
    submitToGoogleSheets(data).catch(() => {});
  });
}

/* ── Contact Form ──────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateContactForm()) return;

    const data = Object.fromEntries(new FormData(contactForm));
    const btn = document.getElementById('submitBtn');

    // Show success instantly
    showMsg('success', '✅ Thank you! Our team will get back to you shortly. We look forward to helping you! 🎓');
    contactForm.reset();
    btn.textContent = 'Submitted ✓';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = 'Submit Enquiry'; btn.disabled = false; }, 3000);

    // Submit in background
    submitToGoogleSheets(data).catch(() => {});
  });
}

function validateContactForm() {
  clearErrors();
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  let valid = true;

  if (name && !name.value.trim()) { markError(name, 'Name is required'); valid = false; }
  if (email && !email.value.trim()) { markError(email, 'Email is required'); valid = false; }
  else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { markError(email, 'Enter a valid email'); valid = false; }
  if (phone && !phone.value.trim()) { markError(phone, 'Phone number is required'); valid = false; }
  else if (phone && !isValidPhone(phone.value)) { markError(phone, 'Enter a valid 10-digit phone number'); valid = false; }

  return valid;
}

function markError(field, msg) {
  field.style.borderColor = '#DC2626';
  const err = document.createElement('p');
  err.className = 'field-err';
  err.style.cssText = 'color:#DC2626;font-size:.78rem;margin-top:4px;';
  err.textContent = msg;
  field.parentNode.appendChild(err);
}

function clearErrors() {
  document.querySelectorAll('.field-err').forEach(e => e.remove());
  document.querySelectorAll('.finput').forEach(f => f.style.borderColor = '');
}

function showMsg(type, text) {
  if (!formMsg) return;
  formMsg.textContent = text;
  formMsg.className = 'form-msg ' + type;
  formMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => { formMsg.className = 'form-msg'; formMsg.textContent = ''; }, 10000);
}

/* ── Google Sheets Integration ─────────────────────── */
/*
 * HOW TO CONNECT TO GOOGLE SHEETS:
 * 1. Create a Google Sheet with columns:
 *    Name | Email | Phone | Destination | Course | Message | Timestamp
 * 2. Go to Extensions > Apps Script and paste this code:
 *
 *    function doPost(e) {
 *      try {
 *        var s = SpreadsheetApp.getActiveSheet();
 *        var d = JSON.parse(e.postData.contents);
 *        s.appendRow([d.name||'', d.email||'', d.phone||'',
 *          d.destination||'', d.course||'', d.message||'', new Date()]);
 *        return ContentService
 *          .createTextOutput(JSON.stringify({result:'success'}))
 *          .setMimeType(ContentService.MimeType.JSON);
 *      } catch(err) {
 *        return ContentService
 *          .createTextOutput(JSON.stringify({result:'error'}))
 *          .setMimeType(ContentService.MimeType.JSON);
 *      }
 *    }
 *
 * 3. Deploy > New Deployment > Web App
 *    Execute as: Me | Who has access: Anyone
 * 4. Copy the deployment URL and paste it below as SCRIPT_URL
 */

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzsV8v426BYo87BZtU8FngVh_6TOpLWvnfAQVO_VXZsN-C2KO6mA5Vpaosjo6gdlawl/exec'; // ← Replace this

async function submitToGoogleSheets(data) {
  const res = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (json.result !== 'success') throw new Error('Script error');
  return json;
}
