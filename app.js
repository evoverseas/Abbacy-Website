/* ============================================================
   ABBACY GLOBAL GROUP — app.js
   Next-Level · Interactive · Performant
   ============================================================ */

'use strict';

/* ── Animated Counters ─────────────────────────────────── */
function animateCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    if (el.dataset.animated) return;
    el.dataset.animated = '1';
    const target = parseFloat(el.dataset.target);
    const isDecimal = el.hasAttribute('data-decimal');
    const dur = 2200;
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
  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { animateCounters(); io.disconnect(); }
  }, { threshold: 0.3 });
  io.observe(statsBlock);
}

/* ── Navbar scroll effect ──────────────────────────────── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ── Active nav link on scroll ─────────────────────────── */
const sections = document.querySelectorAll('section[id], .hero[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
if (navLinks.length) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY + 100;
    sections.forEach(sec => {
      if (offset >= sec.offsetTop && offset < sec.offsetTop + sec.offsetHeight) {
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id);
        });
      }
    });
  }, { passive: true });
}

/* ── Hamburger / Mobile Menu ───────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    }
  });
}

/* ── Smooth Scroll ─────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 76, behavior: 'smooth' });
    }
  });
});

/* ── Scroll Animations — Staggered Reveal ──────────────── */
const animEls = document.querySelectorAll(
  '.service-card, .dest-card, .tcard, .journey-card, .why-card, .cinfo-card, .faq-item, .about-grid, .stat-box, .award-item, .blog-card, .video-card, .local-grid, .pillar'
);
if ('IntersectionObserver' in window && animEls.length) {
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 70);
        o.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  animEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .6s cubic-bezier(.4,0,.2,1), transform .6s cubic-bezier(.4,0,.2,1)';
    obs.observe(el);
  });
}

/* ── FAQ Accordion ─────────────────────────────────────── */
const faqList = document.querySelector('.faq-list');
if (faqList) {
  faqList.addEventListener('click', e => {
    const btn = e.target.closest('.faq-q');
    if (!btn) return;
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');

    faqList.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
}

/* ── Hero Typing Text Rotation ─────────────────────────── */
const heroTyping = document.getElementById('heroTyping');
if (heroTyping) {
  const phrases = [
    'World-Class Education',
    'Global Career Success',
    'Your Dream University',
    'A Brighter Future',
    'Study Abroad from Hyderabad'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function typeEffect() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      heroTyping.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      heroTyping.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80;
    }

    if (!isDeleting && charIndex === current.length) {
      typeSpeed = 2500; // Pause at full text
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 400; // Pause before new phrase
    }

    setTimeout(typeEffect, typeSpeed);
  }

  // Start after 2s delay
  setTimeout(typeEffect, 2500);
}

/* ── Testimonials Carousel ─────────────────────────────── */
const carouselTrack = document.getElementById('testimonialsTrack');
const carouselDots = document.getElementById('carouselDots');
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');

if (carouselTrack && carouselDots) {
  const cards = carouselTrack.querySelectorAll('.tcard');
  let currentSlide = 0;
  let slidesPerView = 3;
  let totalSlides = 0;
  let autoplayInterval;

  function getSlideConfig() {
    const w = window.innerWidth;
    if (w <= 768) return 1;
    if (w <= 1024) return 2;
    return 3;
  }

  function updateCarousel() {
    slidesPerView = getSlideConfig();
    totalSlides = Math.ceil(cards.length / slidesPerView);
    if (currentSlide >= totalSlides) currentSlide = totalSlides - 1;

    // Update track position
    const cardWidth = cards[0].offsetWidth + 22; // card width + gap
    const offset = currentSlide * slidesPerView * cardWidth;
    carouselTrack.style.transform = `translateX(-${offset}px)`;

    // Update dots
    carouselDots.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === currentSlide ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => { currentSlide = i; updateCarousel(); resetAutoplay(); });
      carouselDots.appendChild(dot);
    }
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  if (carouselPrev) carouselPrev.addEventListener('click', () => { prevSlide(); resetAutoplay(); });
  if (carouselNext) carouselNext.addEventListener('click', () => { nextSlide(); resetAutoplay(); });

  // Pause on hover
  const carouselContainer = document.getElementById('testimonialsCarousel');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    carouselContainer.addEventListener('mouseleave', resetAutoplay);
  }

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    carouselContainer.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide(); else prevSlide();
        resetAutoplay();
      }
    }, { passive: true });
  }

  // Init
  updateCarousel();
  resetAutoplay();
  window.addEventListener('resize', () => { updateCarousel(); });
}

/* ── Eligibility Checker ───────────────────────────────── */
(function() {
  const card = document.querySelector('.eligibility-card');
  if (!card) return;

  const indicators = card.querySelectorAll('.eligibility-step-indicator');
  const prevBtn = document.getElementById('eligPrev');
  const nextBtn = document.getElementById('eligNext');
  const navDiv = document.getElementById('eligNav');
  const summaryEl = document.getElementById('eligSummary');
  const restartBtn = document.getElementById('eligRestart');

  let step = 1;
  const total = 4;
  const answers = {};

  /* ── Core: switch to a step using ONLY class toggling ── */
  function goTo(n) {
    // Remove 'active' from every step (CSS handles display:none by default)
    card.querySelectorAll('.eligibility-step').forEach(s => s.classList.remove('active'));

    if (n === 'result') {
      card.querySelector('[data-step="result"]').classList.add('active');
      navDiv.classList.add('elig-hidden');
      indicators.forEach(ind => { ind.classList.remove('active'); ind.classList.add('done'); });
      buildResult();
      return;
    }

    card.querySelector('[data-step="' + n + '"]').classList.add('active');
    navDiv.classList.remove('elig-hidden');

    // Progress indicators
    indicators.forEach(ind => {
      const s = parseInt(ind.getAttribute('data-step'));
      ind.classList.remove('active', 'done');
      if (s < n) ind.classList.add('done');
      else if (s === n) ind.classList.add('active');
    });

    // Prev button
    prevBtn.style.visibility = n <= 1 ? 'hidden' : 'visible';

    // Next button label
    nextBtn.innerHTML = n >= total
      ? 'See Results <i class="fas fa-check"></i>'
      : 'Next <i class="fas fa-arrow-right"></i>';

    // Enable/disable next based on prior selection
    const activeStep = card.querySelector('[data-step="' + n + '"]');
    nextBtn.disabled = !activeStep.querySelector('.elig-option.selected');
  }

  /* ── Option click ──────────────────────────────── */
  card.addEventListener('click', function(e) {
    const opt = e.target.closest('.elig-option');
    if (!opt) return;
    const parent = opt.closest('.eligibility-step');
    if (!parent || !parent.classList.contains('active')) return;

    // Select this option
    parent.querySelectorAll('.elig-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    answers[step] = opt.getAttribute('data-value');
    nextBtn.disabled = false;

    // Auto-advance after a brief visual delay
    setTimeout(function() {
      if (step < total) {
        step++;
        goTo(step);
      } else {
        goTo('result');
      }
    }, 350);
  });

  /* ── Next / Prev Buttons ───────────────────────── */
  nextBtn.addEventListener('click', function() {
    if (nextBtn.disabled) return;
    if (step < total) { step++; goTo(step); }
    else { goTo('result'); }
  });

  prevBtn.addEventListener('click', function() {
    if (step > 1) { step--; goTo(step); }
  });

  /* ── Restart ───────────────────────────────────── */
  if (restartBtn) {
    restartBtn.addEventListener('click', function() {
      // Clear all selections
      card.querySelectorAll('.elig-option.selected').forEach(o => o.classList.remove('selected'));
      Object.keys(answers).forEach(k => delete answers[k]);
      step = 1;
      goTo(1);
    });
  }

  /* ── Build personalised result message ─────────── */
  function buildResult() {
    if (!summaryEl) return;
    const dest = answers[2] || 'your dream destination';
    const edu = {
      '12th': 'undergraduate',
      'bachelors': "Master's / postgraduate",
      'masters': 'PhD / doctoral',
      'working': 'professional / executive'
    }[answers[1]] || '';
    const budget = {
      'low': 'budget-friendly',
      'medium': 'mid-range',
      'high': 'premium',
      'any': 'flexible-budget'
    }[answers[3]] || '';

    let msg = '🎯 Based on your answers, you\'re a great candidate for ';
    msg += edu ? edu + ' programs' : 'programs';
    msg += ' in <strong>' + dest + '</strong>';
    msg += budget ? ' with ' + budget + ' university options.' : '.';

    if (answers[4] === 'without' || answers[4] === 'no') {
      msg += ' Don\'t worry about English tests — we have universities that accept students without IELTS!';
    } else if (answers[4] === 'preparing') {
      msg += ' Our expert IELTS/PTE coaches can help you hit your target score quickly.';
    }
    summaryEl.innerHTML = msg;
  }
})();

/* ── Back to Top Button ────────────────────────────────── */
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Sticky Mobile CTA ────────────────────────────────── */
const stickyMobileCta = document.getElementById('stickyMobileCta');
if (stickyMobileCta) {
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const heroBottom = hero.offsetTop + hero.offsetHeight;
    const pastHero = window.scrollY > heroBottom;
    const scrollingDown = window.scrollY > lastScroll;
    lastScroll = window.scrollY;

    if (pastHero && window.innerWidth <= 768) {
      stickyMobileCta.classList.add('visible');
    } else {
      stickyMobileCta.classList.remove('visible');
    }
  }, { passive: true });
}

/* ── Phone Validation Helper ───────────────────────────── */
function isValidPhone(phone) {
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  return /^(91)?[6-9]\d{9}$/.test(cleaned);
}

/* ── Hero Quick Form ───────────────────────────────────── */
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

    heroForm.innerHTML = '<p style="color:#16A34A;font-weight:600;text-align:center;padding:20px 0">✅ You\'re all set! Our expert counselor will reach out to you shortly. 🚀</p>';
    submitToGoogleSheets(data).catch(() => {});
  });
}

/* ── Contact Form ──────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateContactForm()) return;

    const data = Object.fromEntries(new FormData(contactForm));
    const btn = document.getElementById('submitBtn');

    showMsg('success', '✅ Thank you! Our team will get back to you shortly. We look forward to helping you! 🎓');
    contactForm.reset();
    btn.textContent = 'Submitted ✓';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = 'Submit Enquiry'; btn.disabled = false; }, 3000);

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

/* ── Google Sheets Integration ─────────────────────────── */
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

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzsV8v426BYo87BZtU8FngVh_6TOpLWvnfAQVO_VXZsN-C2KO6mA5Vpaosjo6gdlawl/exec';

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
