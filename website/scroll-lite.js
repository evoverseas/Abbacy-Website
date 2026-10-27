/* Scroll-lite for the homepage (see scroll-lite.css). Does nothing under reduced motion or without
   IntersectionObserver, so the page always stays readable. Never touches forms. */
(function () {
  if (!window.matchMedia || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  var root = document.documentElement;

  // 2. Reveal targets, below the hero only, staggered within each group (60ms, capped)
  var groups = ['#main > section:not(.ab-hero) .ab-head', '.ab-pains > *', '.ab-vs > *', '.ab-steps > .ab-step',
                '.ab-dests > *', '.ab-free > *', '.ab-team > *', '.ab-rv__panel', '.ab-rv__track > *', '.ab-hub > *'];
  var targets = [];
  groups.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el, i) {
      if (el.closest('.ab-hero') || el.closest('form')) return;
      el.setAttribute('data-sl-in', '');
      el.style.setProperty('--sl-delay', Math.min(i, 6) * 60 + 'ms');
      targets.push(el);
    });
  });
  root.classList.add('sl-on');

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('sl-shown');
      io.unobserve(e.target);  // once: never re-hides on the way back up
    });
  }, { rootMargin: '0px 0px -12% 0px' });
  targets.forEach(function (el) { io.observe(el); });

  // Anything already above the viewport (e.g. landing on #reviews) shows at once
  targets.forEach(function (el) { if (el.getBoundingClientRect().bottom < 0) el.classList.add('sl-shown'); });

  // 4. Count the real 4.9 rating up once, ease-out, ~1.4s
  var num = document.querySelector('.ab-rv__num');
  if (num) {
    var final = num.textContent.trim(), target = parseFloat(final), dp = (final.split('.')[1] || '').length;
    var cio = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      cio.disconnect();
      var t0 = performance.now();
      (function tick(now) {
        var p = Math.min(1, (now - t0) / 1400), v = target * (1 - Math.pow(1 - p, 3));
        num.textContent = p < 1 ? v.toFixed(dp) : final;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }, { threshold: 0.5 });
    cio.observe(num);
  }

  // 1 + 3. Scroll-linked: hero glow drift and the "How it works" line, one rAF per frame
  var hero = document.querySelector('.ab-hero'), steps = document.querySelector('.ab-steps');
  var stepEls = steps ? Array.prototype.slice.call(steps.querySelectorAll('.ab-step')) : [];
  var ticking = false;
  function update() {
    ticking = false;
    var vh = innerHeight;
    // Safety net: show anything on screen even if the observer is slow, so content can never stay hidden
    if (targets.length) {
      targets = targets.filter(function (el) {
        if (el.classList.contains('sl-shown')) return false;
        if (el.getBoundingClientRect().top < vh * 0.95) { el.classList.add('sl-shown'); return false; }
        return true;
      });
    }
    if (hero) {
      var r = hero.getBoundingClientRect();
      if (r.bottom > 0) hero.style.setProperty('--sl-hero', Math.max(0, Math.min(1, -r.top / r.height)).toFixed(3));
    }
    if (steps) {
      var s = steps.getBoundingClientRect();
      if (s.top < vh && s.bottom > 0) {
        var prog = Math.max(0, Math.min(1, (vh * 0.85 - s.top) / (s.height + vh * 0.35)));
        stepEls.forEach(function (el, i) {
          var seg = Math.max(0, Math.min(1, prog * stepEls.length - i));
          el.style.setProperty('--sl-fill', (seg * 100).toFixed(1) + '%');
          el.classList.toggle('sl-lit', prog * stepEls.length > i + 0.05);
        });
      }
    }
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update, { passive: true });
  addEventListener('load', function () { setTimeout(update, 600); });
  update();

  // 5. Destination cards lean toward a mouse pointer (max 4 degrees)
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.ab-dest').forEach(function (card) {
      card.addEventListener('mousemove', function (ev) {
        var b = card.getBoundingClientRect();
        card.style.setProperty('--sl-ry', (((ev.clientX - b.left) / b.width - 0.5) * 8).toFixed(2) + 'deg');
        card.style.setProperty('--sl-rx', (-((ev.clientY - b.top) / b.height - 0.5) * 8).toFixed(2) + 'deg');
      });
      card.addEventListener('mouseleave', function () { card.style.setProperty('--sl-rx', '0deg'); card.style.setProperty('--sl-ry', '0deg'); });
    });
  }
})();
