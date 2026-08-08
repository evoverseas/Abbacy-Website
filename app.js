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
    'Study Abroad'
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
  const labels = card.querySelectorAll('.eligibility-progress-labels span');
  const prevBtn = document.getElementById('eligPrev');
  const nextBtn = document.getElementById('eligNext');
  const navDiv = document.getElementById('eligNav');
  const restartBtn = document.getElementById('eligRestart');
  const loader = document.getElementById('eligEngineLoader');
  const loaderText = document.getElementById('engineText');
  const gaugeFill = document.getElementById('eligGaugeFill');
  const gaugePct = document.getElementById('eligGaugePct');
  
  const leadCard = document.getElementById('eligLeadCard');
  const successState = document.getElementById('eligSuccessState');
  const leadForm = document.getElementById('eligForm');

  let currentStep = 1;
  const total = 4;
  const answers = {};
  let transitionPending = false;

  /* ── Core: switch to a step using class toggling ── */
  function goTo(n) {
    if (n === 'result') {
      card.querySelectorAll('.eligibility-step').forEach(s => s.classList.remove('active'));
      card.querySelector('.eligibility-step[data-step="result"]').classList.add('active');
      navDiv.classList.add('elig-hidden');
      indicators.forEach(ind => { ind.classList.remove('active'); ind.classList.add('done'); });
      labels.forEach(lbl => { lbl.classList.remove('active'); lbl.classList.add('done'); });
      buildResult();
      currentStep = 'result';
      return;
    }

    const nextStepEl = card.querySelector('.eligibility-step[data-step="' + n + '"]');
    if (!nextStepEl) return;

    card.querySelectorAll('.eligibility-step').forEach(s => s.classList.remove('active'));
    nextStepEl.classList.add('active');
    navDiv.classList.remove('elig-hidden');
    currentStep = n;

    // Progress indicators & labels
    indicators.forEach(ind => {
      const s = parseInt(ind.getAttribute('data-step'));
      ind.classList.remove('active', 'done');
      if (s < n) ind.classList.add('done');
      else if (s === n) ind.classList.add('active');
    });

    labels.forEach(lbl => {
      const s = parseInt(lbl.getAttribute('data-step'));
      lbl.classList.remove('active', 'done');
      if (s < n) lbl.classList.add('done');
      else if (s === n) lbl.classList.add('active');
    });

    // Prev button
    prevBtn.style.visibility = n <= 1 ? 'hidden' : 'visible';

    // Next button label
    nextBtn.innerHTML = n >= total
      ? 'See Results <i class="fas fa-check"></i>'
      : 'Next <i class="fas fa-arrow-right"></i>';

    // Enable/disable next based on prior selection
    nextBtn.disabled = !nextStepEl.querySelector('.elig-option.selected');
  }

  /* ── Simulated AI Engine Overlay & Auto Advance ── */
  function simulateEngineAndAdvance(nextStep) {
    if (transitionPending) return;
    transitionPending = true;

    let loadText = "Analyzing Background...";
    if (currentStep === 1) loadText = "Analyzing academic profile compatibility...";
    else if (currentStep === 2) loadText = "Analyzing global travel document stayback matrices...";
    else if (currentStep === 3) loadText = "Optimizing educational budget & scholarships...";
    else if (currentStep === 4) loadText = "Generating personalized Overseas Blueprint...";

    if (loader && loaderText) {
      loaderText.textContent = loadText;
      loader.classList.add('active');
    }

    setTimeout(function() {
      if (loader) loader.classList.remove('active');
      transitionPending = false;
      goTo(nextStep);
    }, 450); // Slick, responsive 450ms simulated engine latency
  }

  /* ── Clickable Indicator Progress Tabs ── */
  indicators.forEach(ind => {
    ind.addEventListener('click', function() {
      if (transitionPending || currentStep === 'result') return;
      const targetStep = parseInt(ind.getAttribute('data-step'));
      
      // Allow moving back, or moving forward only if predecessors are already selected
      if (targetStep < currentStep) {
        goTo(targetStep);
      } else if (targetStep > currentStep) {
        let canJump = true;
        for (let i = 1; i < targetStep; i++) {
          const stepEl = card.querySelector('.eligibility-step[data-step="' + i + '"]');
          if (!stepEl || !stepEl.querySelector('.elig-option.selected')) {
            canJump = false;
            break;
          }
        }
        if (canJump) goTo(targetStep);
      }
    });
  });

  // Make text labels clickable too
  labels.forEach(lbl => {
    lbl.addEventListener('click', function() {
      if (transitionPending || currentStep === 'result') return;
      const targetStep = parseInt(lbl.getAttribute('data-step'));
      const matchingIndicator = card.querySelector('.eligibility-step-indicator[data-step="' + targetStep + '"]');
      if (matchingIndicator) matchingIndicator.click();
    });
  });

  /* ── Option Selection click (with Auto-Advance) ── */
  card.addEventListener('click', function(e) {
    if (transitionPending) return;
    const opt = e.target.closest('.elig-option');
    if (!opt) return;
    const parent = opt.closest('.eligibility-step');
    if (!parent || !parent.classList.contains('active')) return;

    const sNum = parseInt(parent.getAttribute('data-step'));
    if (isNaN(sNum)) return;

    // Visual selection change
    parent.querySelectorAll('.elig-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    answers[sNum] = opt.getAttribute('data-value');
    
    // Enable manual Next progression just in case
    nextBtn.disabled = false;

    // Frictionless Auto-Advance!
    if (sNum < total) {
      simulateEngineAndAdvance(sNum + 1);
    } else {
      simulateEngineAndAdvance('result');
    }
  });

  /* ── Next / Prev Navigation Buttons ── */
  nextBtn.addEventListener('click', function() {
    if (nextBtn.disabled || transitionPending) return;
    if (currentStep === 'result') return;
    
    if (currentStep < total) {
      goTo(currentStep + 1);
    } else {
      goTo('result');
    }
  });

  prevBtn.addEventListener('click', function() {
    if (transitionPending) return;
    if (currentStep > 1) {
      goTo(currentStep - 1);
    }
  });

  /* ── Restart Checker ── */
  if (restartBtn) {
    restartBtn.addEventListener('click', function() {
      card.querySelectorAll('.elig-option.selected').forEach(o => o.classList.remove('selected'));
      Object.keys(answers).forEach(k => delete answers[k]);
      
      // Reset forms and success views
      if (leadForm) leadForm.reset();
      if (leadCard) leadCard.style.display = 'block';
      if (successState) successState.style.display = 'none';
      
      goTo(1);
    });
  }

  /* ── Results Recommendations Tab Switcher ── */
  card.addEventListener('click', function(e) {
    const tabBtn = e.target.closest('.elig-tab-btn');
    if (!tabBtn) return;
    
    const tabsNav = tabBtn.parentNode;
    tabsNav.querySelectorAll('.elig-tab-btn').forEach(btn => btn.classList.remove('active'));
    tabBtn.classList.add('active');

    const tabType = tabBtn.getAttribute('data-tab');
    const container = tabBtn.closest('.eligibility-step');
    
    container.querySelectorAll('.elig-tab-content').forEach(box => box.classList.remove('active'));
    const targetBox = container.querySelector('#tab-' + tabType);
    if (targetBox) targetBox.classList.add('active');
  });

  /* ── Dynamic Profile Result Generator ── */
  function buildResult() {
    const dest = answers[2] || 'USA';
    const edu = answers[1] || 'bachelors';
    const budget = answers[3] || 'any';
    const ielts = answers[4] || 'no';

    // 1. Calculate Match Score
    let matchScore = 85;
    if (dest === 'Germany' && budget === 'low') matchScore = 98;
    else if (dest === 'USA' && budget === 'high') matchScore = 97;
    else if (dest === 'USA' && budget !== 'low') matchScore = 95;
    else if (dest === 'UK' && ielts === 'without') matchScore = 94;
    else if (dest === 'Canada' && edu === 'bachelors') matchScore = 92;
    else if (budget === 'any') matchScore = 91;
    else matchScore = Math.floor(Math.random() * (96 - 88 + 1)) + 88; // Sleek variance

    // 2. Animate Circular Match Gauge
    if (gaugePct && gaugeFill) {
      gaugePct.textContent = '0%';
      // Radius = 54, circumference = 2 * PI * r = ~339.29
      const circ = 339.29;
      gaugeFill.style.strokeDashoffset = circ;
      
      let count = 0;
      const interval = setInterval(function() {
        count++;
        gaugePct.textContent = count + '%';
        if (count >= matchScore) {
          clearInterval(interval);
        }
      }, 15);

      setTimeout(function() {
        const offset = circ - (matchScore / 100) * circ;
        gaugeFill.style.strokeDashoffset = offset;
      }, 50);
    }

    // Determine Language Step text
    let langStep = 'Initiate strategic mock training at our Himayatnagar coaching center.';
    if (ielts === 'without') {
      langStep = 'Procure Medium of Instruction (MOI) verification letter from your Hyd university to waive IELTS exam.';
    } else if (ielts === 'preparing') {
      langStep = 'Submit existing IELTS/PTE/Duolingo scorecard to lock in fast-track Travel Documentation.';
    }

    // Determine Ideal Course level
    let idealCourse = 'Masters Degree (MS/MSc/MBA)';
    if (edu === '12th') idealCourse = 'International Bachelors Degree (UG)';
    else if (edu === 'masters') idealCourse = 'Postgraduate Specialization / Ph.D. Pathways';
    else if (edu === 'working') idealCourse = 'Fast-track Executive Masters / PG Diploma';

    // 3. Tab 1 & Tab 2 & Tab 3 data structure compilation
    let pathwayHtml = '';
    let scholarshipHtml = '';
    let checklistHtml = '';

    if (dest === 'USA') {
      pathwayHtml = `
        <div style="font-size: 0.88rem; line-height: 1.6; color: rgba(255,255,255,0.9);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; background: rgba(255,255,255,0.04); padding: 8px 12px; border-radius: 6px;">
            <span>Pre-Screening Match Status:</span>
            <strong style="color: #4ADE80;">Highly Favorable (${matchScore}%)</strong>
          </div>
          <p style="margin: 0 0 12px;">Matched course tier: <strong style="color: var(--gold-light);">${idealCourse}</strong></p>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-check-circle" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>Target Country:</strong> Matched for direct university applications in the United States.</span></li>
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-check-circle" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>3-Year STEM OPT Stayback:</strong> Work legally in the US in top tech/engineering fields for 36 months after graduation.</span></li>
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-check-circle" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>High ROI:</strong> Average starting salaries for STEM graduates exceed $75,000/year.</span></li>
          </ul>
        </div>
      `;

      let scholarshipText = 'Your profile qualifies you for merit-based fee waivers and fellowship grants.';
      let scholarshipAmt = 'Up to $15,000 Tuition Fee Waiver';
      if (budget === 'low') {
        scholarshipText = 'Target public universities and maximum merit-based assistantships (TA/RA) to minimize costs.';
        scholarshipAmt = 'Up to $20,000 Merit Scholarships &amp; Assistantships';
      }

      scholarshipHtml = `
        <div style="font-size: 0.88rem; line-height: 1.6; color: rgba(255,255,255,0.9);">
          <div style="background: rgba(201,151,58,0.12); border-left: 4px solid var(--gold); padding: 12px; border-radius: 6px; margin-bottom: 14px;">
            <strong style="color: var(--gold-light); font-size: 0.72rem; text-transform: uppercase; display: block; margin-bottom: 4px;">US Funding Strategy:</strong>
            <span style="font-size: 1rem; font-weight: 800; color: var(--white);">${scholarshipAmt}</span>
          </div>
          <p style="margin: 0 0 10px; color: rgba(255,255,255,0.8); font-size: 0.82rem;">${scholarshipText}</p>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-hand-holding-usd" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>TA/RA Assistantships:</strong> Earn hourly stipends and tuition waivers by assisting professors.</span></li>
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-file-invoice-dollar" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>Unsecured Student Loans:</strong> Pre-screened for collateral-free education loans up to ₹60 Lakhs.</span></li>
          </ul>
        </div>
      `;

      checklistHtml = `
        <div style="font-size: 0.88rem; line-height: 1.6; color: rgba(255,255,255,0.9);">
          <p style="margin: 0 0 12px; font-weight: 700; color: var(--gold-light); font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.03em;">US Admission &amp; F-1 Travel Document Steps:</p>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(201,151,58,0.2); color: var(--gold-light); font-size: 0.72rem; font-weight: 800; flex-shrink: 0; margin-top: 2px;">1</span>
              <div>
                <strong style="display: block; font-size: 0.82rem; color: var(--white);">Document Compilation</strong>
                <span style="font-size: 0.76rem; color: rgba(255,255,255,0.5);">Consolidate mark sheets, draft Statement of Purpose (SOP), and secure LORs.</span>
              </div>
            </div>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(201,151,58,0.2); color: var(--gold-light); font-size: 0.72rem; font-weight: 800; flex-shrink: 0; margin-top: 2px;">2</span>
              <div>
                <strong style="display: block; font-size: 0.82rem; color: var(--white);">English Proficiency &amp; Waiver</strong>
                <span style="font-size: 0.76rem; color: rgba(255,255,255,0.5);">${langStep}</span>
              </div>
            </div>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(201,151,58,0.2); color: var(--gold-light); font-size: 0.72rem; font-weight: 800; flex-shrink: 0; margin-top: 2px;">3</span>
              <div>
                <strong style="display: block; font-size: 0.82rem; color: var(--white);">I-20 Form Request</strong>
                <span style="font-size: 0.76rem; color: rgba(255,255,255,0.5);">Request your official I-20 document from US universities upon offer acceptance.</span>
              </div>
            </div>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(201,151,58,0.2); color: var(--gold-light); font-size: 0.72rem; font-weight: 800; flex-shrink: 0; margin-top: 2px;">4</span>
              <div>
                <strong style="display: block; font-size: 0.82rem; color: var(--white);">F-1 Travel Document Slot &amp; Interview Prep</strong>
                <span style="font-size: 0.76rem; color: rgba(255,255,255,0.5);">Fill DS-160, pay SEVIS fee, secure slots in Hyderabad/Chennai, and attend mock interview prep sessions.</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (dest === 'UK') {
      pathwayHtml = `
        <div style="font-size: 0.88rem; line-height: 1.6; color: rgba(255,255,255,0.9);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; background: rgba(255,255,255,0.04); padding: 8px 12px; border-radius: 6px;">
            <span>Pre-Screening Match Status:</span>
            <strong style="color: #4ADE80;">Highly Favorable (${matchScore}%)</strong>
          </div>
          <p style="margin: 0 0 12px;">Matched course tier: <strong style="color: var(--gold-light);">${idealCourse}</strong></p>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-check-circle" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>Target Country:</strong> UK Fast-track pathway matched.</span></li>
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-check-circle" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>1-Year Masters Option:</strong> Save a full year of living expenses &amp; tuition fees.</span></li>
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-check-circle" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>Graduate Route (PSW):</strong> Live and work legally in the UK for 2 years post-graduation.</span></li>
          </ul>
        </div>
      `;

      scholarshipHtml = `
        <div style="font-size: 0.88rem; line-height: 1.6; color: rgba(255,255,255,0.9);">
          <div style="background: rgba(201,151,58,0.12); border-left: 4px solid var(--gold); padding: 12px; border-radius: 6px; margin-bottom: 14px;">
            <strong style="color: var(--gold-light); font-size: 0.72rem; text-transform: uppercase; display: block; margin-bottom: 4px;">UK Funding Strategy:</strong>
            <span style="font-size: 1rem; font-weight: 800; color: var(--white);">£2,000 to £5,000 Fee Reductions</span>
          </div>
          <p style="margin: 0 0 10px; color: rgba(255,255,255,0.8); font-size: 0.82rem;">Direct fee discounts pre-screened for Abbacy students across 80+ partner UK universities.</p>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-hand-holding-usd" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>Vice-Chancellor Scholarships:</strong> Automatic evaluation upon university application.</span></li>
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-file-invoice-dollar" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>Speed Loans:</strong> Pre-screened for fast collateral-free bank loans up to ₹40 Lakhs.</span></li>
          </ul>
        </div>
      `;

      checklistHtml = `
        <div style="font-size: 0.88rem; line-height: 1.6; color: rgba(255,255,255,0.9);">
          <p style="margin: 0 0 12px; font-weight: 700; color: var(--gold-light); font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.03em;">UK Admissions &amp; Student Travel Document Steps:</p>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(201,151,58,0.2); color: var(--gold-light); font-size: 0.72rem; font-weight: 800; flex-shrink: 0; margin-top: 2px;">1</span>
              <div>
                <strong style="display: block; font-size: 0.82rem; color: var(--white);">Course &amp; University Shortlisting</strong>
                <span style="font-size: 0.76rem; color: rgba(255,255,255,0.5);">Shortlist top 5 high-ROI UK universities with fast 2-4 weeks CAS processing times.</span>
              </div>
            </div>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(201,151,58,0.2); color: var(--gold-light); font-size: 0.72rem; font-weight: 800; flex-shrink: 0; margin-top: 2px;">2</span>
              <div>
                <strong style="display: block; font-size: 0.82rem; color: var(--white);">Language Requirement Waiver</strong>
                <span style="font-size: 0.76rem; color: rgba(255,255,255,0.5);">${langStep}</span>
              </div>
            </div>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(201,151,58,0.2); color: var(--gold-light); font-size: 0.72rem; font-weight: 800; flex-shrink: 0; margin-top: 2px;">3</span>
              <div>
                <strong style="display: block; font-size: 0.82rem; color: var(--white);">CAS Deposit &amp; Letter Collection</strong>
                <span style="font-size: 0.76rem; color: rgba(255,255,255,0.5);">Submit initial university deposit to request your official Confirmation of Acceptance for Studies (CAS) letter.</span>
              </div>
            </div>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(201,151,58,0.2); color: var(--gold-light); font-size: 0.72rem; font-weight: 800; flex-shrink: 0; margin-top: 2px;">4</span>
              <div>
                <strong style="display: block; font-size: 0.82rem; color: var(--white);">UK Student Travel Document Assembly</strong>
                <span style="font-size: 0.76rem; color: rgba(255,255,255,0.5);">Secure your financial proofs (28-day rule for funds in bank), book TB medical test, and submit your UK student travel document file.</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (dest === 'Germany') {
      pathwayHtml = `
        <div style="font-size: 0.88rem; line-height: 1.6; color: rgba(255,255,255,0.9);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; background: rgba(255,255,255,0.04); padding: 8px 12px; border-radius: 6px;">
            <span>Pre-Screening Match Status:</span>
            <strong style="color: #4ADE80;">Highly Favorable (${matchScore}%)</strong>
          </div>
          <p style="margin: 0 0 12px;">Matched course tier: <strong style="color: var(--gold-light);">${idealCourse}</strong></p>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-check-circle" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>Target Country:</strong> Germany Public Tuition-free pathway matched.</span></li>
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-check-circle" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>€0 Tuition Fees:</strong> Pay nothing at Public German Universities (save up to ₹35 Lakhs).</span></li>
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-check-circle" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>Stayback Travel Document:</strong> 18-Month generous post-study work search travel document across Germany and EU.</span></li>
          </ul>
        </div>
      `;

      scholarshipHtml = `
        <div style="font-size: 0.88rem; line-height: 1.6; color: rgba(255,255,255,0.9);">
          <div style="background: rgba(201,151,58,0.12); border-left: 4px solid var(--gold); padding: 12px; border-radius: 6px; margin-bottom: 14px;">
            <strong style="color: var(--gold-light); font-size: 0.72rem; text-transform: uppercase; display: block; margin-bottom: 4px;">Germany Funding Strategy:</strong>
            <span style="font-size: 1rem; font-weight: 800; color: var(--white);">Save ₹35 Lakhs (Tuition-Free)</span>
          </div>
          <p style="margin: 0 0 10px; color: rgba(255,255,255,0.8); font-size: 0.82rem;">Since public universities charge zero tuition fees, your major expense is only the living cost blocked account deposit (€11,904).</p>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-wallet" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>Blocked Account Loans:</strong> Process blocked funds (€11,904) easily via our education loan partners.</span></li>
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-shield-alt" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>APS Support:</strong> Abbacy handles your complete document verification guidance for APS certification.</span></li>
          </ul>
        </div>
      `;

      checklistHtml = `
        <div style="font-size: 0.88rem; line-height: 1.6; color: rgba(255,255,255,0.9);">
          <p style="margin: 0 0 12px; font-weight: 700; color: var(--gold-light); font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.03em;">Germany Public Admission &amp; Travel Document Steps:</p>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(201,151,58,0.2); color: var(--gold-light); font-size: 0.72rem; font-weight: 800; flex-shrink: 0; margin-top: 2px;">1</span>
              <div>
                <strong style="display: block; font-size: 0.82rem; color: var(--white);">Mandatory APS Verification</strong>
                <span style="font-size: 0.76rem; color: rgba(255,255,255,0.5);">Submit academic transcripts to APS India immediately. An APS certificate is mandatory for any German student travel document.</span>
              </div>
            </div>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(201,151,58,0.2); color: var(--gold-light); font-size: 0.72rem; font-weight: 800; flex-shrink: 0; margin-top: 2px;">2</span>
              <div>
                <strong style="display: block; font-size: 0.82rem; color: var(--white);">Course shortlisting &amp; Application</strong>
                <span style="font-size: 0.76rem; color: rgba(255,255,255,0.5);">${langStep} (Target English-taught courses in public systems via Uni-Assist or Direct).</span>
              </div>
            </div>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(201,151,58,0.2); color: var(--gold-light); font-size: 0.72rem; font-weight: 800; flex-shrink: 0; margin-top: 2px;">3</span>
              <div>
                <strong style="display: block; font-size: 0.82rem; color: var(--white);">Blocked Account Setup</strong>
                <span style="font-size: 0.76rem; color: rgba(255,255,255,0.5);">Open a blocked account with Expatrio or Fintiba and deposit the required €11,904 living costs.</span>
              </div>
            </div>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(201,151,58,0.2); color: var(--gold-light); font-size: 0.72rem; font-weight: 800; flex-shrink: 0; margin-top: 2px;">4</span>
              <div>
                <strong style="display: block; font-size: 0.82rem; color: var(--white);">Germany Student Travel Document Slot</strong>
                <span style="font-size: 0.76rem; color: rgba(255,255,255,0.5);">Book national travel document appointment slots via VFS, compile enrollment letter, and submit complete documents.</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (dest === 'Canada') {
      pathwayHtml = `
        <div style="font-size: 0.88rem; line-height: 1.6; color: rgba(255,255,255,0.9);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; background: rgba(255,255,255,0.04); padding: 8px 12px; border-radius: 6px;">
            <span>Pre-Screening Match Status:</span>
            <strong style="color: #4ADE80;">Highly Favorable (${matchScore}%)</strong>
          </div>
          <p style="margin: 0 0 12px;">Matched course tier: <strong style="color: var(--gold-light);">${idealCourse}</strong></p>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-check-circle" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>Target Country:</strong> Canada PGWP and PR pathways matched.</span></li>
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-check-circle" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>PGWP Stayback:</strong> Live and work legally in Canada for up to 3 years post-graduation.</span></li>
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-check-circle" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>Fast-track PR:</strong> Gain Canadian CRS points to transition swiftly into Permanent Residency (PR).</span></li>
          </ul>
        </div>
      `;

      scholarshipHtml = `
        <div style="font-size: 0.88rem; line-height: 1.6; color: rgba(255,255,255,0.9);">
          <div style="background: rgba(201,151,58,0.12); border-left: 4px solid var(--gold); padding: 12px; border-radius: 6px; margin-bottom: 14px;">
            <strong style="color: var(--gold-light); font-size: 0.72rem; text-transform: uppercase; display: block; margin-bottom: 4px;">Canada Funding Strategy:</strong>
            <span style="font-size: 1rem; font-weight: 800; color: var(--white);">$2,000 - $5,000 CAD Entrance Awards</span>
          </div>
          <p style="margin: 0 0 10px; color: rgba(255,255,255,0.8); font-size: 0.82rem;">Eligible for entrance scholarship pools at select partner universities and DLI colleges.</p>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-coins" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>GIC Funding Loans:</strong> Secure low-interest student loans up to ₹45 Lakhs to fund GIC Blocked Account deposit ($20,635 CAD) and first-year fees.</span></li>
          </ul>
        </div>
      `;

      checklistHtml = `
        <div style="font-size: 0.88rem; line-height: 1.6; color: rgba(255,255,255,0.9);">
          <p style="margin: 0 0 12px; font-weight: 700; color: var(--gold-light); font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.03em;">Canada Admissions &amp; Study Permit Steps:</p>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(201,151,58,0.2); color: var(--gold-light); font-size: 0.72rem; font-weight: 800; flex-shrink: 0; margin-top: 2px;">1</span>
              <div>
                <strong style="display: block; font-size: 0.82rem; color: var(--white);">DLI College/University Selection</strong>
                <span style="font-size: 0.76rem; color: rgba(255,255,255,0.5);">Shortlist high-demand programs at PGWP-eligible Designated Learning Institutions (DLI).</span>
              </div>
            </div>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(201,151,58,0.2); color: var(--gold-light); font-size: 0.72rem; font-weight: 800; flex-shrink: 0; margin-top: 2px;">2</span>
              <div>
                <strong style="display: block; font-size: 0.82rem; color: var(--white);">Language Score Strategy</strong>
                <span style="font-size: 0.76rem; color: rgba(255,255,255,0.5);">${ielts === 'without' ? 'Procure Duolingo/PTE scorecards as Canada requires academic exam scores for SDS student Travel Documentation.' : langStep}</span>
              </div>
            </div>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(201,151,58,0.2); color: var(--gold-light); font-size: 0.72rem; font-weight: 800; flex-shrink: 0; margin-top: 2px;">3</span>
              <div>
                <strong style="display: block; font-size: 0.82rem; color: var(--white);">GIC Account Deposit</strong>
                <span style="font-size: 0.76rem; color: rgba(255,255,255,0.5);">Open a GIC account with CIBC or Scotiabank and transfer $20,635 CAD as verified proof of Canadian living costs.</span>
              </div>
            </div>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(201,151,58,0.2); color: var(--gold-light); font-size: 0.72rem; font-weight: 800; flex-shrink: 0; margin-top: 2px;">4</span>
              <div>
                <strong style="display: block; font-size: 0.82rem; color: var(--white);">Study Permit Submission</strong>
                <span style="font-size: 0.76rem; color: rgba(255,255,255,0.5);">Attend upfront medical exams, compile a solid Letter of Explanation (LOE), and submit your travel document application via the IRCC portal.</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (dest === 'Australia') {
      pathwayHtml = `
        <div style="font-size: 0.88rem; line-height: 1.6; color: rgba(255,255,255,0.9);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; background: rgba(255,255,255,0.04); padding: 8px 12px; border-radius: 6px;">
            <span>Pre-Screening Match Status:</span>
            <strong style="color: #4ADE80;">Highly Favorable (${matchScore}%)</strong>
          </div>
          <p style="margin: 0 0 12px;">Matched course tier: <strong style="color: var(--gold-light);">${idealCourse}</strong></p>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-check-circle" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>Target Country:</strong> Australian Group of Eight (Go8) &amp; CRICOS pathways matched.</span></li>
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-check-circle" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>Generous Work Rights:</strong> Part-time work permitted up to 48 hours per fortnight, and full-time on breaks.</span></li>
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-check-circle" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>Post-study travel documents:</strong> Up to 2-4 years stays in high-growth regional employment hubs.</span></li>
          </ul>
        </div>
      `;

      scholarshipHtml = `
        <div style="font-size: 0.88rem; line-height: 1.6; color: rgba(255,255,255,0.9);">
          <div style="background: rgba(201,151,58,0.12); border-left: 4px solid var(--gold); padding: 12px; border-radius: 6px; margin-bottom: 14px;">
            <strong style="color: var(--gold-light); font-size: 0.72rem; text-transform: uppercase; display: block; margin-bottom: 4px;">Australia Funding Strategy:</strong>
            <span style="font-size: 1rem; font-weight: 800; color: var(--white);">15% to 25% Vice-Chancellor Awards</span>
          </div>
          <p style="margin: 0 0 10px; color: rgba(255,255,255,0.8); font-size: 0.82rem;">Qualified for immediate scholarship evaluation pool during university application processing.</p>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-coins" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>Education Funding:</strong> Seamless loan processing up to ₹50 Lakhs from India's top rated banks.</span></li>
          </ul>
        </div>
      `;

      checklistHtml = `
        <div style="font-size: 0.88rem; line-height: 1.6; color: rgba(255,255,255,0.9);">
          <p style="margin: 0 0 12px; font-weight: 700; color: var(--gold-light); font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.03em;">Australia Admissions &amp; Subclass 500 Steps:</p>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(201,151,58,0.2); color: var(--gold-light); font-size: 0.72rem; font-weight: 800; flex-shrink: 0; margin-top: 2px;">1</span>
              <div>
                <strong style="display: block; font-size: 0.82rem; color: var(--white);">University Applications</strong>
                <span style="font-size: 0.76rem; color: rgba(255,255,255,0.5);">Shortlist CRICOS-registered courses at Group of Eight (Go8) or highly ranked institutions.</span>
              </div>
            </div>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(201,151,58,0.2); color: var(--gold-light); font-size: 0.72rem; font-weight: 800; flex-shrink: 0; margin-top: 2px;">2</span>
              <div>
                <strong style="display: block; font-size: 0.82rem; color: var(--white);">Genuine Student (GS) Statement</strong>
                <span style="font-size: 0.76rem; color: rgba(255,255,255,0.5);">Draft a robust GS statement explaining your study intent, course alignment, and financial ties to India.</span>
              </div>
            </div>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(201,151,58,0.2); color: var(--gold-light); font-size: 0.72rem; font-weight: 800; flex-shrink: 0; margin-top: 2px;">3</span>
              <div>
                <strong style="display: block; font-size: 0.82rem; color: var(--white);">OSHC Health Cover &amp; COE Collection</strong>
                <span style="font-size: 0.76rem; color: rgba(255,255,255,0.5);">Purchase Overseas Student Health Cover (OSHC), pay your tuition deposit, and secure your Confirmation of Enrolment (COE).</span>
              </div>
            </div>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(201,151,58,0.2); color: var(--gold-light); font-size: 0.72rem; font-weight: 800; flex-shrink: 0; margin-top: 2px;">4</span>
              <div>
                <strong style="display: block; font-size: 0.82rem; color: var(--white);">Subclass 500 Travel Document Submission</strong>
                <span style="font-size: 0.76rem; color: rgba(255,255,255,0.5);">Compile liquid asset proofs, book upfront medical checks, and submit study travel document via ImmiAccount.</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } else { // Dubai
      pathwayHtml = `
        <div style="font-size: 0.88rem; line-height: 1.6; color: rgba(255,255,255,0.9);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; background: rgba(255,255,255,0.04); padding: 8px 12px; border-radius: 6px;">
            <span>Pre-Screening Match Status:</span>
            <strong style="color: #4ADE80;">Highly Favorable (${matchScore}%)</strong>
          </div>
          <p style="margin: 0 0 12px;">Matched course tier: <strong style="color: var(--gold-light);">${idealCourse}</strong></p>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-check-circle" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>Target Country:</strong> Dubai Branch Campus pathway matched.</span></li>
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-check-circle" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>Study &amp; Work:</strong> Legally intern and work in top multi-national companies while studying.</span></li>
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-check-circle" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>Zero Tax Future:</strong> Secure corporate placements in 0% tax freezones post graduation.</span></li>
          </ul>
        </div>
      `;

      scholarshipHtml = `
        <div style="font-size: 0.88rem; line-height: 1.6; color: rgba(255,255,255,0.9);">
          <div style="background: rgba(201,151,58,0.12); border-left: 4px solid var(--gold); padding: 12px; border-radius: 6px; margin-bottom: 14px;">
            <strong style="color: var(--gold-light); font-size: 0.72rem; text-transform: uppercase; display: block; margin-bottom: 4px;">Dubai Funding Strategy:</strong>
            <span style="font-size: 1rem; font-weight: 800; color: var(--white);">Up to 30% Branch Campus Scholarship</span>
          </div>
          <p style="margin: 0 0 10px; color: rgba(255,255,255,0.8); font-size: 0.82rem;">Direct fee discounts pre-screened based on UG / Intermediate academic marks. Instantly applicable.</p>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
            <li style="display: flex; gap: 8px; align-items: flex-start;"><i class="fas fa-money-bill-wave" style="color: var(--gold-light); margin-top: 3px; font-size: 0.85rem;"></i> <span><strong>Flexible Installments:</strong> Dubai branches offer low-cost monthly and trimester payment options.</span></li>
          </ul>
        </div>
      `;

      checklistHtml = `
        <div style="font-size: 0.88rem; line-height: 1.6; color: rgba(255,255,255,0.9);">
          <p style="margin: 0 0 12px; font-weight: 700; color: var(--gold-light); font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.03em;">Dubai Admissions &amp; Entry Permit Steps:</p>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(201,151,58,0.2); color: var(--gold-light); font-size: 0.72rem; font-weight: 800; flex-shrink: 0; margin-top: 2px;">1</span>
              <div>
                <strong style="display: block; font-size: 0.82rem; color: var(--white);">Branch Campus Selection</strong>
                <span style="font-size: 0.76rem; color: rgba(255,255,255,0.5);">Shortlist branch campuses in Dubai Knowledge Park or Dubai Silicon Oasis.</span>
              </div>
            </div>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(201,151,58,0.2); color: var(--gold-light); font-size: 0.72rem; font-weight: 800; flex-shrink: 0; margin-top: 2px;">2</span>
              <div>
                <strong style="display: block; font-size: 0.82rem; color: var(--white);">Admissions &amp; MOI Submission</strong>
                <span style="font-size: 0.76rem; color: rgba(255,255,255,0.5);">${langStep} (Most Dubai campuses accept MOI waivers, making exams completely optional).</span>
              </div>
            </div>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(201,151,58,0.2); color: var(--gold-light); font-size: 0.72rem; font-weight: 800; flex-shrink: 0; margin-top: 2px;">3</span>
              <div>
                <strong style="display: block; font-size: 0.82rem; color: var(--white);">Admissions Offer Acceptance</strong>
                <span style="font-size: 0.76rem; color: rgba(255,255,255,0.5);">Confirm branch campus offer letter to trigger university-sponsored 1-year student travel document entry permit.</span>
              </div>
            </div>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(201,151,58,0.2); color: var(--gold-light); font-size: 0.72rem; font-weight: 800; flex-shrink: 0; margin-top: 2px;">4</span>
              <div>
                <strong style="display: block; font-size: 0.82rem; color: var(--white);">Arrival, Medical &amp; Residency Card</strong>
                <span style="font-size: 0.76rem; color: rgba(255,255,255,0.5);">Travel to Dubai under entry permit, complete medical test, secure health insurance, and collect your Emirates ID card.</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // 4. Inject the compiled dynamic HTML contents into their tab containers
    const tab1 = document.getElementById('tab-pathway');
    const tab2 = document.getElementById('tab-scholarship');
    const tab3 = document.getElementById('tab-roadmap');
    if (tab1) tab1.innerHTML = pathwayHtml;
    if (tab2) tab2.innerHTML = scholarshipHtml;
    if (tab3) tab3.innerHTML = checklistHtml;
  }

  /* ── Form Capture & Submission to Sheets ── */
  if (leadForm) {
    leadForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Refresh hidden UTM values from sessionStorage
      try {
        const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'];
        UTM_PARAMS.forEach(param => {
          const val = sessionStorage.getItem(param);
          if (val) {
            const fld = document.getElementById('elig_' + param);
            if (fld) fld.value = val;
          }
        });
      } catch(err) {
        console.warn('UTM gathering inside checker failed:', err);
      }

      // Collect data fields
      const formData = new FormData(leadForm);
      const contactData = Object.fromEntries(formData);
      
      if (!contactData.name.trim() || !contactData.phone.trim()) {
        alert('Please enter your name and phone number.');
        return;
      }
      if (!isValidPhone(contactData.phone)) {
        alert('Please enter a valid 10-digit phone number.');
        return;
      }

      const submitBtn = document.getElementById('eligSubmitBtn');
      if (submitBtn) {
        submitBtn.textContent = 'Securing Profile... ⏳';
        submitBtn.disabled = true;
      }

      // Merge selections into final submission payload
      const combinedPayload = {
        ...contactData,
        academic_background: answers[1] || 'Unknown',
        dream_destination: answers[2] || 'Unknown',
        funding_preference: answers[3] || 'Unknown',
        english_test_status: answers[4] || 'Unknown'
      };

      // Send to sheets
      if (typeof submitToGoogleSheets === 'function') {
        submitToGoogleSheets(combinedPayload);
      } else {
        console.warn('submitToGoogleSheets was not defined globally, attempting direct background submission.');
        try {
          fetch(SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(combinedPayload),
            keepalive: true
          });
        } catch(err) {}
      }

      // Smooth visual transition to success state
      setTimeout(function() {
        if (leadCard) leadCard.style.display = 'none';
        if (successState) successState.style.display = 'block';
        
        // Redirect to thank-you page after 3 seconds for pixel conversion tracking
        setTimeout(function() {
          window.location.href = 'thank-you.html';
        }, 3000);
      }, 250);
    });
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
    
    // Refresh hidden UTM values from sessionStorage
    populateHiddenUtmFields();
    
    const data = Object.fromEntries(new FormData(heroForm));
    if (!data.name.trim() || !data.phone.trim()) {
      alert('Please fill in your name and phone number.');
      return;
    }
    if (!isValidPhone(data.phone)) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }

    const btn = heroForm.querySelector('button[type="submit"]');
    if (btn) {
      btn.textContent = 'Submitting... ⏳';
      btn.disabled = true;
    }

    // Send data in background using keepalive
    submitToGoogleSheets(data);

    // Redirect to thank-you page after a tiny visual delay for optimal UX
    setTimeout(() => {
      window.location.href = 'thank-you.html';
    }, 150);
  });
}

/* â”€â”€ Contact Form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    
    // Refresh hidden UTM values from sessionStorage
    populateHiddenUtmFields();
    
    if (!validateContactForm()) return;

    const data = Object.fromEntries(new FormData(contactForm));
    const btn = document.getElementById('submitBtn');
    
    if (btn) {
      btn.textContent = 'Submitting... ⏳';
      btn.disabled = true;
    }

    // Send data in background using keepalive
    submitToGoogleSheets(data);

    // Redirect to thank-you page after a tiny visual delay for optimal UX
    setTimeout(() => {
      window.location.href = 'thank-you.html';
    }, 150);
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

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxvdUdZJDAIbYjM1OaZF96iTb5oh81VK5Z6TWtS9eNxSVWYm6nwPkOK5N0Be_56ga6c/exec';

function submitToGoogleSheets(data) {
  try {
    fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(data),
      keepalive: true
    }).catch(err => {
      console.warn('Background Google Sheet submission error:', err);
    });
  } catch (err) {
    console.error('Failed to initiate background submission:', err);
  }
}

/* â”€â”€ UTM & Paid Ads Conversion Attribution Tracker â”€â”€â”€â”€â”€â”€â”€â”€ */
const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'];

function captureUtmParameters() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    
    // 1. Check if any UTM parameter is in the current URL query string and store in session
    UTM_PARAMS.forEach(param => {
      const val = urlParams.get(param);
      if (val) {
        sessionStorage.setItem(param, val);
      }
    });
    
    // 2. Automatically populate form hidden fields
    populateHiddenUtmFields();
  } catch (err) {
    console.error('UTM capture failed:', err);
  }
}

function populateHiddenUtmFields() {
  try {
    UTM_PARAMS.forEach(param => {
      const val = sessionStorage.getItem(param);
      if (val) {
        // For Hero form
        const heroField = document.getElementById('hero_' + param);
        if (heroField) {
          heroField.value = val;
        }
        // For Contact form
        const contactField = document.getElementById('contact_' + param);
        if (contactField) {
          contactField.value = val;
        }
      }
    });
  } catch (err) {
    console.error('Populating UTM hidden fields failed:', err);
  }
}

// Automatically capture and populate on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', captureUtmParameters);
} else {
  captureUtmParameters();
}

/* ── Page Scroll Progress Bar ──────────────────────────── */
(function() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress-bar';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    progressBar.style.width = scrolled + '%';
  }, { passive: true });
})();

/* ── Interactive Input Fields Feedback ──────────────────── */
document.querySelectorAll('.finput, .qform input, .qform select').forEach(input => {
  input.addEventListener('blur', () => {
    if (input.required) {
      if (!input.value.trim()) {
        input.style.borderColor = 'var(--red)';
      } else {
        if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          input.style.borderColor = 'var(--red)';
        } else if (input.type === 'tel' && !isValidPhone(input.value)) {
          input.style.borderColor = 'var(--red)';
        } else {
          input.style.borderColor = 'var(--green)';
        }
      }
    }
  });

  input.addEventListener('input', () => {
    if (input.style.borderColor === 'var(--red)' || input.style.borderColor === 'rgb(220, 38, 38)') {
      if (input.value.trim()) {
        if (input.type === 'email' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          input.style.borderColor = '';
        } else if (input.type === 'tel' && isValidPhone(input.value)) {
          input.style.borderColor = '';
        } else if (input.type !== 'email' && input.type !== 'tel') {
          input.style.borderColor = '';
        }
      }
    }
  });
});
/* ── Staggered Scroll Reveal System ───────────────────────── */
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.05
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  });
})();

/* ─── 3D ROTATING INTERACTIVE GLOBE ───────────────────────── */
(function() {
  const canvas = document.getElementById('globeCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const overlayCard = document.getElementById('globeOverlayCard');
  const overlayFlag = document.getElementById('overlayFlag');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayDesc = document.getElementById('overlayDesc');
  const closeOverlay = document.getElementById('closeOverlay');
  const legendTags = document.querySelectorAll('.legend-tag');

  const destinations = {
    USA: { lat: 39.8283, lon: -98.5795, name: 'USA', flag: 'https://flagcdn.com/w40/us.png', desc: 'USA: Top destination for MS & MBA. STEM graduates enjoy a 3-year OPT work permit, high-paying jobs, and generous university scholarships.' },
    UK: { lat: 55.3781, lon: -3.4360, name: 'United Kingdom', flag: 'https://flagcdn.com/w40/gb.png', desc: 'UK: Fast-track 1-year Masters, 2-year Graduate Route work travel document, and numerous options to study without IELTS. Excellent global repute.' },
    Canada: { lat: 56.1304, lon: -106.3468, name: 'Canada', flag: 'https://flagcdn.com/w40/ca.png', desc: 'Canada: Popular destination offering up to 3 years PGWP (work permit) and clear pathways to Permanent Residency (PR). High standard of living.' },
    Australia: { lat: -25.2744, lon: 133.7751, name: 'Australia', flag: 'https://flagcdn.com/w40/au.png', desc: 'Australia: Study at world-famous Group of Eight (Go8) universities with up to 4 years post-study work rights. Sun-kissed cities.' },
    Europe: { lat: 51.1657, lon: 10.4515, name: 'Germany', flag: 'https://flagcdn.com/w40/de.png', desc: 'Germany: Access €0 tuition public universities and live in Europe’s economic powerhouse. 18-month stayback job-search travel document.' },
    Dubai: { lat: 23.4241, lon: 53.8478, name: 'Dubai', flag: 'https://flagcdn.com/w40/ae.png', desc: 'Dubai: Study at renowned branch campuses close to home. 100% tax-free employment, fast travel document approvals, and vibrant lifestyle.' },
    Malaysia: { lat: 3.1390, lon: 101.6869, name: 'Malaysia', flag: 'https://flagcdn.com/w40/my.png', desc: 'Malaysia: Highly affordable tuition, low living costs, and branch campuses of top UK/Australian universities. Safe & multicultural.' },
    Singapore: { lat: 1.3521, lon: 103.8198, name: 'Singapore', flag: 'https://flagcdn.com/w40/sg.png', desc: 'Singapore: Asia’s premier financial hub. Home to world-class universities like NUS & NTU, and exceptional global career opportunities.' },
    NewZealand: { lat: -40.9006, lon: 174.8860, name: 'New Zealand', flag: 'https://flagcdn.com/w40/nz.png', desc: 'New Zealand: Excellent work rights, up to 3 years post-study work travel document, and pristine quality of life. Highly welcoming to students.' },
    SouthKorea: { lat: 35.9078, lon: 127.7669, name: 'South Korea', flag: 'https://flagcdn.com/w40/kr.png', desc: 'South Korea: Global leader in tech and innovation. Affordable tuition, extensive scholarships, and booming employment opportunities.' },
    China: { lat: 35.8617, lon: 104.1954, name: 'China', flag: 'https://flagcdn.com/w40/cn.png', desc: 'China: Highly affordable medicine (MBBS) & engineering programs. World-class infrastructure and growing global influence.' }
  };
  const origin = { lat: 17.3850, lon: 78.4867, name: 'Hyderabad (India)' };

  // Generate uniform sphere mesh coordinates
  const spherePoints = [];
  for (let lat = -80; lat <= 80; lat += 5.5) {
    for (let lon = -180; lon <= 180; lon += 6.5) {
      spherePoints.push({ phi: lat * Math.PI / 180, theta: lon * Math.PI / 180 });
    }
  }

  // landPoints loop removed

  let width, height, R, cx, cy;
  const dpr = window.devicePixelRatio || 1;
  let initialized = false;

  function resize() {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    if (width > 0 && height > 0) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      R = Math.min(width, height) * 0.47;
      cx = width / 2;
      cy = height / 2 - 10;
      initialized = true;
    }
  }
  resize();

  let rotationX = -0.3, rotationY = -4.25, autoRotateSpeed = 0.002, isDragging = false;
  let startMouseX = 0, startMouseY = 0, startRotationY = 0, startRotationX = 0;
  let targetRotationY = null, targetRotationX = -0.3, activeDestKey = null;
  let vx = 0, vy = 0, mouseX = -999, mouseY = -999;

  const connections = Object.keys(destinations).map(key => ({
    key, dest: destinations[key], t: Math.random(), speed: 0.004 + Math.random() * 0.003
  }));

  function latLonToXYZ(lat, lon, radius) {
    const phi = lat * Math.PI / 180, theta = (lon + 180) * Math.PI / 180;
    return { x: -radius * Math.cos(phi) * Math.sin(theta), y: radius * Math.sin(phi), z: radius * Math.cos(phi) * Math.cos(theta) };
  }

  function project(p, rotX, rotY) {
    const x1 = p.x * Math.cos(rotY) - p.z * Math.sin(rotY);
    const z1 = p.x * Math.sin(rotY) + p.z * Math.cos(rotY);
    const y2 = p.y * Math.cos(rotX) - z1 * Math.sin(rotX);
    const z2 = p.y * Math.sin(rotX) + z1 * Math.cos(rotX);
    return { x: cx + x1, y: cy - y2, z: z2 };
  }

  function generatePath(pt1, pt2, R, numSegments = 40) {
    const p1 = latLonToXYZ(pt1.lat, pt1.lon, R), p2 = latLonToXYZ(pt2.lat, pt2.lon, R);
    const midX = (p1.x + p2.x) / 2, midY = (p1.y + p2.y) / 2, midZ = (p1.z + p2.z) / 2;
    const len = Math.sqrt(midX**2 + midY**2 + midZ**2), elev = R * 1.32;
    const ctrl = { x: (midX/len)*elev, y: (midY/len)*elev, z: (midZ/len)*elev };
    const path = [];
    for (let i = 0; i <= numSegments; i++) {
      const t = i / numSegments, mt = 1 - t;
      path.push({ x: mt**2*p1.x + 2*mt*t*ctrl.x + t**2*p2.x, y: mt**2*p1.y + 2*mt*t*ctrl.y + t**2*p2.y, z: mt**2*p1.z + 2*mt*t*ctrl.z + t**2*p2.z });
    }
    return path;
  }

  function selectDestination(key) {
    activeDestKey = key;
    legendTags.forEach(tag => tag.classList.toggle('active', tag.getAttribute('data-dest') === key));
    
    const dest = destinations[key];
    if (!dest) return;
    
    const theta = (dest.lon + 180) * Math.PI / 180;
    const phi = dest.lat * Math.PI / 180;
    targetRotationY = -theta + Math.PI/12; 
    targetRotationX = Math.max(-0.3, Math.min(0.5, -phi));

    overlayFlag.src = dest.flag;
    overlayFlag.alt = dest.name + ' Flag';
    overlayTitle.textContent = dest.name;
    overlayDesc.textContent = dest.desc;
    overlayCard.classList.add('active');
  }

  // Interactivity Dragging
  canvas.addEventListener('mousedown', e => {
    isDragging = true;
    startMouseX = e.clientX;
    startMouseY = e.clientY;
    startRotationY = rotationY;
    startRotationX = rotationX;
    vx = 0;
    vy = 0;
    targetRotationY = null;
    canvas.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', e => {
    // Coordinate tracking for hover highlights
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    if (!isDragging) return;
    const dx = e.clientX - startMouseX;
    const dy = e.clientY - startMouseY;
    
    const newRotY = startRotationY - dx * 0.005;
    const newRotX = Math.max(-0.6, Math.min(0.6, startRotationX + dy * 0.005));
    
    vx = newRotY - rotationY;
    vy = newRotX - rotationX;
    
    rotationY = newRotY;
    rotationX = newRotX;
  });

  canvas.addEventListener('mouseleave', () => {
    mouseX = -999;
    mouseY = -999;
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      canvas.style.cursor = 'grab';
    }
  });

  canvas.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) return;
    isDragging = true;
    startMouseX = e.touches[0].clientX;
    startMouseY = e.touches[0].clientY;
    startRotationY = rotationY;
    startRotationX = rotationX;
    vx = 0;
    vy = 0;
    targetRotationY = null;
  }, { passive: true });

  window.addEventListener('touchmove', e => {
    if (e.touches.length !== 1) return;
    
    const rect = canvas.getBoundingClientRect();
    mouseX = e.touches[0].clientX - rect.left;
    mouseY = e.touches[0].clientY - rect.top;

    if (!isDragging) return;
    const dx = e.touches[0].clientX - startMouseX;
    const dy = e.touches[0].clientY - startMouseY;
    
    const newRotY = startRotationY - dx * 0.006;
    const newRotX = Math.max(-0.6, Math.min(0.6, startRotationX + dy * 0.006));
    
    vx = newRotY - rotationY;
    vy = newRotX - rotationX;
    
    rotationY = newRotY;
    rotationX = newRotX;
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
    mouseX = -999;
    mouseY = -999;
  });

  // Clicking nodes on Canvas
  canvas.addEventListener('click', e => {
    if (Math.abs(e.clientX - startMouseX) > 5 || Math.abs(e.clientY - startMouseY) > 5) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    let clickedDest = null;
    let minDist = 20;

    Object.keys(destinations).forEach(key => {
      const dest = destinations[key];
      const xyz = latLonToXYZ(dest.lat, dest.lon, R);
      const proj = project(xyz, rotationX, rotationY);
      if (proj.z > 0) {
        const dist = Math.hypot(clickX - proj.x, clickY - proj.y);
        if (dist < minDist) {
          minDist = dist;
          clickedDest = key;
        }
      }
    });

    if (clickedDest) {
      selectDestination(clickedDest);
    }
  });

  // Legend Clicking
  legendTags.forEach(tag => {
    tag.addEventListener('click', e => {
      e.preventDefault();
      const destKey = tag.getAttribute('data-dest');
      selectDestination(destKey);
    });
  });

  // Close Overlay
  if (closeOverlay) {
    closeOverlay.addEventListener('click', e => {
      e.stopPropagation();
      overlayCard.classList.remove('active');
      activeDestKey = null;
      legendTags.forEach(tag => tag.classList.remove('active'));
      targetRotationY = null;
    });
  }

  // Animation Loop
  function animate() {
    if (!initialized) {
      resize();
      if (!initialized) {
        requestAnimationFrame(animate);
        return;
      }
    }

    ctx.clearRect(0, 0, width, height);

    // Auto rotate & targeting interpolation
    if (!isDragging) {
      if (targetRotationY !== null) {
        let diffY = targetRotationY - rotationY;
        diffY = Math.atan2(Math.sin(diffY), Math.cos(diffY));
        rotationY += diffY * 0.05;
        let diffX = targetRotationX - rotationX;
        rotationX += diffX * 0.05;
        vx = 0;
        vy = 0;
      } else {
        // Dragging inertia
        rotationY += vx;
        rotationX += vy;
        vx *= 0.94;
        vy *= 0.94;

        // Auto spin blends back in as inertia dies down
        const inertiaAmt = Math.abs(vx) * 20;
        rotationY += autoRotateSpeed * Math.max(0, 1 - inertiaAmt);
        rotationX += (0.25 - rotationX) * 0.01; 
      }
    }

    // 0.5. Draw Outer Atmospheric Halo Glow
    const haloGrad = ctx.createRadialGradient(cx, cy, R - 10, cx, cy, R + 25);
    haloGrad.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
    haloGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.06)');
    haloGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, R + 25, 0, Math.PI * 2);
    ctx.fill();

    // 1. Draw Globe Shader background
    const grad = ctx.createRadialGradient(cx - R/3, cy - R/3, R/10, cx, cy, R);
    grad.addColorStop(0, 'rgba(27, 58, 92, 0.45)');
    grad.addColorStop(0.6, 'rgba(10, 25, 47, 0.75)');
    grad.addColorStop(1, 'rgba(5, 19, 34, 0.95)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 1.5. Draw Rotating Graticule Grid (faint wireframe lines)
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = 'rgba(100, 210, 255, 0.07)';
    
    // Latitude grid lines
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      let first = true;
      for (let lon = -180; lon <= 180; lon += 6) {
        const xyz = latLonToXYZ(lat, lon, R);
        const proj = project(xyz, rotationX, rotationY);
        if (proj.z > 0) {
          if (first) {
            ctx.moveTo(proj.x, proj.y);
            first = false;
          } else {
            ctx.lineTo(proj.x, proj.y);
          }
        } else {
          first = true;
        }
      }
      ctx.stroke();
    }
    
    // Longitude grid lines
    for (let lon = -180; lon < 180; lon += 30) {
      ctx.beginPath();
      let first = true;
      for (let lat = -80; lat <= 80; lat += 6) {
        const xyz = latLonToXYZ(lat, lon, R);
        const proj = project(xyz, rotationX, rotationY);
        if (proj.z > 0) {
          if (first) {
            ctx.moveTo(proj.x, proj.y);
            first = false;
          } else {
            ctx.lineTo(proj.x, proj.y);
          }
        } else {
          first = true;
        }
      }
      ctx.stroke();
    }

    // 2. Draw uniform sphere mesh dots (adds a high-tech glowing mesh structure across the entire sphere)
    spherePoints.forEach(p => {
      const theta = p.theta;
      const phi = p.phi;
      const xyz = {
        x: -R * Math.cos(phi) * Math.sin(theta + Math.PI),
        y: R * Math.sin(phi),
        z: R * Math.cos(phi) * Math.cos(theta + Math.PI)
      };
      const proj = project(xyz, rotationX, rotationY);
      if (proj.z > 0) {
        ctx.fillStyle = 'rgba(100, 215, 255, 0.28)'; // increased opacity for front mesh visibility
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 1.1, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(100, 215, 255, 0.08)'; // increased opacity for back mesh visibility
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 2.5. Draw Specular Gloss & Shadow Overlay (adds 3D spherical depth)
    const glassGrad = ctx.createRadialGradient(cx - R/3, cy - R/3, R/10, cx, cy, R);
    glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
    glassGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    glassGrad.addColorStop(0.8, 'rgba(0, 0, 0, 0)');
    glassGrad.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
    ctx.fillStyle = glassGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();

    // Project origin (Hyderabad)
    const originXYZ = latLonToXYZ(origin.lat, origin.lon, R);
    const projOrigin = project(originXYZ, rotationX, rotationY);

    // 3. Draw connection routes
    connections.forEach(conn => {
      const isActive = (conn.key === activeDestKey);
      const path = generatePath(origin, conn.dest, R, 40);

      ctx.lineWidth = isActive ? 2.25 : 1.0;
      ctx.lineCap = 'round';

      const baseColor = isActive ? '201, 151, 58' : '6, 182, 212'; 

      for (let i = 0; i < path.length - 1; i++) {
        const p1 = project(path[i], rotationX, rotationY);
        const p2 = project(path[i+1], rotationX, rotationY);

        const avgZ = (p1.z + p2.z) / 2;
        if (avgZ > 0) {
          if (isActive) {
            ctx.shadowColor = 'rgba(201, 151, 58, 0.8)';
            ctx.shadowBlur = 6;
          }
          ctx.strokeStyle = `rgba(${baseColor}, ${isActive ? 0.9 : 0.4})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          if (isActive) {
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
          }
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Draw particle
      conn.t += conn.speed * (isActive ? 1.5 : 1.0);
      if (conn.t > 1) {
        conn.t = 0;
        conn.speed = 0.004 + Math.random() * 0.003;
      }
      const pIndex = Math.floor(conn.t * path.length);
      const pNode = path[Math.min(pIndex, path.length - 1)];
      const projNode = project(pNode, rotationX, rotationY);

      if (projNode.z > 0) {
        // Main particle
        ctx.shadowColor = isActive ? 'rgba(240, 200, 80, 0.9)' : 'rgba(6, 182, 212, 0.8)';
        ctx.shadowBlur = isActive ? 10 : 6;
        ctx.fillStyle = isActive ? '#FFFFFF' : 'rgba(100, 245, 255, 1)';
        ctx.beginPath();
        ctx.arc(projNode.x, projNode.y, isActive ? 3.5 : 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';

        // 3-dot meteor trail
        const trailLength = 3;
        for (let j = 1; j <= trailLength; j++) {
          const trailIndex = pIndex - j * 2;
          if (trailIndex >= 0) {
            const trailNode = path[trailIndex];
            const projTrailNode = project(trailNode, rotationX, rotationY);
            if (projTrailNode.z > 0) {
              const trailOpacity = (1 - j / (trailLength + 1)) * (isActive ? 0.7 : 0.4);
              ctx.fillStyle = isActive ? `rgba(240, 200, 80, ${trailOpacity})` : `rgba(6, 182, 212, ${trailOpacity})`;
              ctx.beginPath();
              ctx.arc(projTrailNode.x, projTrailNode.y, (isActive ? 2.5 : 1.5) * (1 - j/5), 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }
    });

    // 4. Draw origin (Hyderabad) node
    if (projOrigin.z > 0) {
      const pulseRad = 3.5 + Math.sin(Date.now() / 150) * 1.2;

      ctx.strokeStyle = 'rgba(74, 222, 128, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(projOrigin.x, projOrigin.y, pulseRad * 2.2, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#4ADE80'; 
      ctx.beginPath();
      ctx.arc(projOrigin.x, projOrigin.y, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px var(--font-body), sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText('Hyderabad', projOrigin.x, projOrigin.y - 10);
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
    }

    // 5. Draw destination nodes
    let hoveredDest = null;
    Object.keys(destinations).forEach(key => {
      const dest = destinations[key];
      const xyz = latLonToXYZ(dest.lat, dest.lon, R);
      const proj = project(xyz, rotationX, rotationY);

      if (proj.z > 0) {
        const isActive = (key === activeDestKey);
        
        // Calculate hover distance
        const distToMouse = Math.hypot(mouseX - proj.x, mouseY - proj.y);
        const isHovered = distToMouse < 18;

        if (isHovered) {
          hoveredDest = { key, name: dest.name, projX: proj.x, projY: proj.y };
        }

        if (isActive || isHovered) {
          // Inner pulsing concentric ripple 1
          const pct1 = (Date.now() % 1200) / 1200;
          ctx.strokeStyle = isActive ? `rgba(201, 151, 58, ${1 - pct1})` : `rgba(6, 182, 212, ${0.7 - pct1 * 0.7})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, 4 + pct1 * (isActive ? 14 : 10), 0, Math.PI * 2);
          ctx.stroke();

          // Outer pulsing concentric ripple 2 (offset by 50%)
          const pct2 = (pct1 + 0.5) % 1.0;
          ctx.strokeStyle = isActive ? `rgba(201, 151, 58, ${1 - pct2})` : `rgba(6, 182, 212, ${0.7 - pct2 * 0.7})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, 4 + pct2 * (isActive ? 14 : 10), 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = isActive ? '#F0C850' : (isHovered ? '#64F0FF' : '#06B6D4'); 
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, isActive ? 5.5 : (isHovered ? 4.8 : 4), 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = isActive ? '#F0C850' : (isHovered ? '#64F0FF' : 'rgba(255,255,255,0.95)');
        ctx.font = isActive ? 'bold 9.5px var(--font-body), sans-serif' : '600 8.5px var(--font-body), sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.85)';
        ctx.shadowBlur = 4;
        ctx.fillText(dest.name === 'United Kingdom' ? 'UK' : (dest.name === 'New Zealand' ? 'NZ' : (dest.name === 'South Korea' ? 'S. Korea' : dest.name)), proj.x, proj.y - (isActive ? 11 : 8));
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
      }
    });

    // 6. Draw floating tooltip capsule on top of everything when hovered
    if (hoveredDest) {
      const isHoveredActive = (hoveredDest.key === activeDestKey);
      const titleText = hoveredDest.name;
      const subText = isHoveredActive ? "Selected" : "Click to Explore";
      
      ctx.font = 'bold 9.5px var(--font-body), sans-serif';
      const w1 = ctx.measureText(titleText).width;
      ctx.font = '500 7.5px var(--font-body), sans-serif';
      const w2 = ctx.measureText(subText).width;
      
      const boxWidth = Math.max(w1, w2) + 20;
      const boxHeight = 27;
      const bx = hoveredDest.projX - boxWidth / 2;
      const by = hoveredDest.projY - (boxHeight + 14);
      
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 6;
      ctx.fillStyle = 'rgba(10, 25, 47, 0.96)';
      ctx.strokeStyle = isHoveredActive ? 'rgba(201, 151, 58, 0.75)' : 'rgba(6, 182, 212, 0.65)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(bx, by, boxWidth, boxHeight, 5);
      } else {
        ctx.rect(bx, by, boxWidth, boxHeight);
      }
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
      
      // Little triangle pointer under the tooltip
      ctx.fillStyle = 'rgba(10, 25, 47, 0.96)';
      ctx.strokeStyle = isHoveredActive ? 'rgba(201, 151, 58, 0.75)' : 'rgba(6, 182, 212, 0.65)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(hoveredDest.projX - 4, by + boxHeight);
      ctx.lineTo(hoveredDest.projX, by + boxHeight + 4);
      ctx.lineTo(hoveredDest.projX + 4, by + boxHeight);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(hoveredDest.projX - 4, by + boxHeight);
      ctx.lineTo(hoveredDest.projX, by + boxHeight + 4);
      ctx.lineTo(hoveredDest.projX + 4, by + boxHeight);
      ctx.stroke();

      // Tooltip texts
      ctx.textAlign = 'center';
      ctx.fillStyle = isHoveredActive ? '#F0C850' : '#FFFFFF';
      ctx.font = 'bold 9.5px var(--font-body), sans-serif';
      ctx.fillText(titleText, hoveredDest.projX, by + 11.5);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.font = '500 7.5px var(--font-body), sans-serif';
      ctx.fillText(subText, hoveredDest.projX, by + 21);
    }

    requestAnimationFrame(animate);
  }

  // Handle Resize
  window.addEventListener('resize', () => {
    initialized = false;
  });

  // Start Animation
  requestAnimationFrame(animate);
})();