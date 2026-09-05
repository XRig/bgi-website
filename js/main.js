(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 767px)');
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('#main-nav');
  const motionToggle = document.querySelector('.motion-toggle');
  let userPaused = false;
  try { userPaused = localStorage.getItem('bgi-motion-paused') === 'true'; } catch { /* Preferences are optional. */ }

  const closeNav = (returnFocus = false) => {
    if (!navToggle || !mainNav) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation');
    mainNav.classList.remove('is-open');
    if (returnFocus) navToggle.focus();
  };
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') !== 'true';
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      mainNav.classList.toggle('is-open', open);
    });
    mainNav.addEventListener('click', event => {
      if (event.target.closest('a')) closeNav();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') closeNav(true);
    });
    document.addEventListener('click', event => {
      if (!header?.contains(event.target)) closeNav();
    });
    header?.addEventListener('focusout', event => {
      if (event.relatedTarget && !header.contains(event.relatedTarget)) closeNav();
    });
    mobile.addEventListener('change', () => closeNav(mobile.matches && mainNav.contains(document.activeElement)));
  }

  const pageName = window.location.pathname.replace(/\/$/, '').split('/').pop() || 'index';
  const currentPage = pageName.includes('.') ? pageName : `${pageName}.html`;
  document.querySelectorAll('.main-nav__link').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });
  const updateHeader = () => header?.classList.toggle('site-header--scrolled', window.scrollY > 16);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // Content starts visible. Only add a reveal when the element is below the viewport.
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.editorial-grid, .section-heading, .operation-card, .resources-overview, .bio, .journal-empty__layout, .prospect').forEach(el => {
      if (el.getBoundingClientRect().top <= window.innerHeight) return;
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }

  // Scroll depth uses the original photograph on two image planes.
  // The near plane is limited to ground below the equipment, so machinery stays intact.
  const depthHero = document.querySelector('.hero--depth');
  const depthCards = [...document.querySelectorAll('.operation-card__image')];
  let depthFrame = 0;
  const updateDepth = () => {
    depthFrame = 0;
    const enabled = !reducedMotion.matches && !userPaused && !mobile.matches && !document.hidden;
    if (depthHero) {
      const bounds = depthHero.getBoundingClientRect();
      const progress = enabled ? Math.max(0, Math.min(1, -bounds.top / Math.max(bounds.height, 1))) : 0;
      depthHero.style.setProperty('--depth-progress', progress.toFixed(4));
    }
    depthCards.forEach(card => {
      const bounds = card.getBoundingClientRect();
      const position = enabled ? Math.max(-1, Math.min(1, (bounds.top + bounds.height / 2 - innerHeight / 2) / innerHeight)) : 0;
      card.style.setProperty('--card-depth', position.toFixed(4));
    });
  };
  const scheduleDepth = () => { if (!depthFrame) depthFrame = requestAnimationFrame(updateDepth); };
  window.addEventListener('scroll', scheduleDepth, { passive: true });
  window.addEventListener('resize', scheduleDepth, { passive: true });

  const films = [...document.querySelectorAll('[data-motion-video]')].map(video => ({ video, visible: false, failed: false }));
  const syncFilms = () => {
    films.forEach(film => {
      const play = film.visible && !reducedMotion.matches && !userPaused && !document.hidden && !navigator.connection?.saveData && !film.failed;
      if (!play) { film.video.pause(); return; }
      if (!film.video.src) { film.video.src = film.video.dataset.motionVideo; film.video.load(); }
      if (film.video.paused) film.video.play().catch(() => { film.video.closest('.field-film')?.classList.remove('film-ready'); });
    });
  };
  films.forEach(film => {
    film.video.addEventListener('playing', () => film.video.closest('.field-film')?.classList.add('film-ready'));
    film.video.addEventListener('error', () => { film.failed = true; film.video.closest('.field-film')?.classList.remove('film-ready'); });
  });
  if ('IntersectionObserver' in window) {
    const filmObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => { const film = films.find(item => item.video === entry.target); if (film) film.visible = entry.isIntersecting; });
      syncFilms();
    }, { threshold: 0.1 });
    films.forEach(film => filmObserver.observe(film.video));
  } else films.forEach(film => { film.visible = true; });

  // Abstract signal traces echo the company's seismic roots; these are decorative, not field data.
  const signals = [...document.querySelectorAll('.signal-canvas')].map(canvas => {
    const context = canvas.getContext('2d');
    return { canvas, context, width: 0, height: 0, visible: true };
  }).filter(signal => signal.context);
  let frame = 0;
  let lastTime = 0;
  let phase = 0;
  const canAnimate = () => !reducedMotion.matches && !userPaused && !document.hidden;
  const draw = signal => {
    const { context: ctx, width, height } = signal;
    if (!width || !height) return;
    ctx.clearRect(0, 0, width, height);
    const rows = 21;
    for (let row = 0; row < rows; row++) {
      ctx.beginPath();
      ctx.lineWidth = row % 5 === 0 ? 1.3 : 0.7;
      ctx.strokeStyle = row % 5 === 0 ? 'rgba(230,194,121,0.52)' : 'rgba(222,232,222,0.22)';
      for (let x = 0; x <= width; x += 5) {
        const u = x / width;
        const envelope = Math.sin(u * Math.PI);
        const y = height * (0.12 + row * 0.033) + Math.sin(u * 9 + row * 0.19 + phase) * height * 0.13 * envelope + Math.sin(u * 19 - phase * 0.65) * height * 0.035 * envelope;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  };
  const resize = () => {
    signals.forEach(signal => {
      const bounds = signal.canvas.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      signal.width = bounds.width;
      signal.height = bounds.height;
      signal.canvas.width = Math.round(bounds.width * scale);
      signal.canvas.height = Math.round(bounds.height * scale);
      signal.context.setTransform(scale, 0, 0, scale, 0, 0);
      draw(signal);
    });
  };
  const tick = time => {
    frame = 0;
    if (!canAnimate() || !signals.some(signal => signal.visible)) { lastTime = 0; return; }
    if (!lastTime || time - lastTime >= 32) {
      phase += lastTime ? Math.min(time - lastTime, 100) * 0.00014 : 0;
      lastTime = time;
      signals.filter(signal => signal.visible).forEach(draw);
    }
    frame = requestAnimationFrame(tick);
  };
  const syncMotion = () => {
    const paused = userPaused || reducedMotion.matches;
    root.dataset.motion = paused ? 'paused' : 'running';
    if (motionToggle) {
      motionToggle.hidden = false;
      motionToggle.disabled = reducedMotion.matches;
      motionToggle.setAttribute('aria-pressed', String(paused));
      motionToggle.querySelector('.motion-toggle__label').textContent = reducedMotion.matches ? 'Reduced motion on' : userPaused ? 'Play motion' : 'Pause motion';
      motionToggle.querySelector('.motion-toggle__icon').textContent = paused ? '▷' : 'Ⅱ';
    }
    scheduleDepth();
    syncFilms();
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    if (canAnimate() && signals.some(signal => signal.visible)) frame = requestAnimationFrame(tick);
    else signals.forEach(draw);
  };
  motionToggle?.addEventListener('click', () => {
    userPaused = !userPaused;
    try { localStorage.setItem('bgi-motion-paused', String(userPaused)); } catch { /* Continue without storing. */ }
    syncMotion();
  });
  reducedMotion.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  if ('IntersectionObserver' in window) {
    const signalObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const signal = signals.find(item => item.canvas === entry.target);
        if (signal) signal.visible = entry.isIntersecting;
      });
      syncMotion();
    });
    signals.forEach(signal => signalObserver.observe(signal.canvas));
  }
  if ('ResizeObserver' in window) {
    const sizeObserver = new ResizeObserver(resize);
    signals.forEach(signal => sizeObserver.observe(signal.canvas));
  } else window.addEventListener('resize', resize, { passive: true });
  resize();
  syncMotion();
})();
