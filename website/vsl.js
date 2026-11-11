/* Abbacy explainer video (VSL): click-to-play, nothing downloads until the visitor taps play.
   Markup: .ab-vsl__frame[data-vsl] with an <img> poster and a .ab-vsl__play button.
   Optional chapter buttons: [data-vsl-seek="seconds"] inside the same [data-vsl-scope].
   GA4 events: vsl_play, vsl_progress (25/50/75), vsl_complete, vsl_chapter, vsl_cta. */
(function () {
  'use strict';
  function track(name, params) {
    if (typeof window.gtag !== 'function') return;
    try { params = params || {}; params.page_path = location.pathname; window.gtag('event', name, params); } catch (_) {}
  }
  function pickSrc(frame) {
    var small = window.matchMedia('(max-width: 899px)').matches || (navigator.connection && navigator.connection.saveData);
    return small ? frame.getAttribute('data-src-sd') : frame.getAttribute('data-src-hd');
  }
  function setup(frame) {
    var scope = frame.closest('[data-vsl-scope]') || frame.parentNode;
    var where = frame.getAttribute('data-vsl') || 'page';
    var video = null, sent = {}, chapters = [].slice.call(scope.querySelectorAll('[data-vsl-seek]'));
    var end = frame.querySelector('.ab-vsl__end');

    function load(at) {
      if (video) {
        if (typeof at === 'number') video.currentTime = at;
        if (end) end.hidden = true;
        frame.classList.remove('is-ended');
        video.play();
        return;
      }
      video = document.createElement('video');
      video.src = pickSrc(frame);
      video.controls = true; video.playsInline = true; video.setAttribute('playsinline', '');
      video.preload = 'auto';
      video.setAttribute('aria-label', frame.getAttribute('data-title') || 'Video');
      frame.insertBefore(video, frame.firstChild);
      frame.classList.add('is-playing');
      if (typeof at === 'number' && at > 0) {
        video.addEventListener('loadedmetadata', function () { video.currentTime = at; }, { once: true });
      }
      var p = video.play(); if (p && p.catch) p.catch(function () {});
      track('vsl_play', { video_location: where });
      video.addEventListener('timeupdate', function () {
        var d = video.duration || 0, t = video.currentTime;
        if (d) [25, 50, 75].forEach(function (q) { if (!sent[q] && t / d * 100 >= q) { sent[q] = 1; track('vsl_progress', { video_location: where, video_percent: q }); } });
        var active = -1;
        chapters.forEach(function (c, i) { if (t >= parseFloat(c.getAttribute('data-vsl-seek')) - .2) active = i; });
        chapters.forEach(function (c, i) { c.classList.toggle('is-active', i === active); });
      });
      video.addEventListener('ended', function () {
        if (!sent.done) { sent.done = 1; track('vsl_complete', { video_location: where }); }
        frame.classList.add('is-ended');
        if (end) { end.hidden = false; var f = end.querySelector('a,button'); if (f) f.focus({ preventScroll: true }); }
        if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {});
      });
    }
    var btn = frame.querySelector('.ab-vsl__play');
    if (btn) btn.addEventListener('click', function () { load(); });
    chapters.forEach(function (c) {
      c.addEventListener('click', function () {
        var at = parseFloat(c.getAttribute('data-vsl-seek')) || 0;
        track('vsl_chapter', { video_location: where, chapter: (c.lastChild.textContent || '').trim() });
        load(at);
        if (frame.getBoundingClientRect().top < 0 || frame.getBoundingClientRect().bottom > window.innerHeight) frame.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
    if (end) {
      var again = end.querySelector('[data-vsl-replay]');
      if (again) again.addEventListener('click', function () { load(0); });
      [].forEach.call(end.querySelectorAll('a'), function (a) {
        a.addEventListener('click', function () { track('vsl_cta', { video_location: where, cta: a.getAttribute('data-cta') || 'link' }); if (video) video.pause(); });
      });
    }
  }
  function init() { [].forEach.call(document.querySelectorAll('[data-vsl]'), setup); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
