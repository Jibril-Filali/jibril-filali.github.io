/* ═══════════════════════════════════════════════════════
   PORTFOLIO 4.2 — SCRIPT.JS (shared, multi-page)
   ═══════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

const reduced   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isHome    = ['', 'index.html'].includes(window.location.pathname.split('/').pop());

/* ─────────────────────────────────────
   MATRIX RAIN
───────────────────────────────────── */
function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas || reduced) return;
  const ctx = canvas.getContext('2d');

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }, { passive: true });

  const chars   = 'アイウエオカキクケコ0123456789ABCDEF!@#$%';
  const fontSize = 13;
  const cols    = Math.floor(canvas.width / fontSize);
  const drops   = Array(cols).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(9, 13, 9, 0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px JetBrains Mono, monospace';
    drops.forEach((y, i) => {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(ch, i * fontSize, y * fontSize);
      if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }
  setInterval(draw, 45);
}

/* ─────────────────────────────────────
   LOADER TERMINAL
───────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('loader');
  const lines  = document.querySelectorAll('.loader-line');
  const fill   = document.getElementById('loaderFill');
  const pct    = document.getElementById('loaderPct');
  if (!loader) { initAll(); return; }

  if (reduced) { loader.classList.add('hidden'); initAll(); return; }

  initMatrixRain();

  const tl = gsap.timeline({
    onComplete: () => {
      gsap.to(loader, {
        opacity: 0, duration: 0.5, ease: 'power2.inOut',
        onComplete: () => { loader.classList.add('hidden'); initAll(); }
      });
    }
  });

  lines.forEach((line, i) => {
    tl.to(line, { opacity: 1, x: 0, duration: 0.25, ease: 'power2.out' }, i * 0.18);
  });

  let progress = 0;
  const interval = setInterval(() => {
    progress = Math.min(progress + Math.random() * 18, 100);
    if (fill) fill.style.width = progress + '%';
    if (pct)  pct.textContent  = Math.floor(progress) + '%';
    if (progress >= 100) clearInterval(interval);
  }, 120);
}

/* ─────────────────────────────────────
   INIT GLOBAL
───────────────────────────────────── */
function initAll() {
  initLenis();
  setActiveNav();
  initCursor();
  initCursorTrail();
  initNav();
  initScrollProgress();
  initScrollTop();
  initReveal();
  initCmdTyping();
  initCounters();
  initSkillBars();
  initMobileMenu();
  initRipple();
  initMagneticButtons();
  initPageTransitions();
  if (isHome) initHero();
  if (isHome) initTypewriter();
  if (isHome) initVirusOverlay();
  if (isHome) initFakePopups();
  if (isHome) initScreenTear();
  if (isHome) initHeroParallax();
  if (isHome) initHeroScrollParallax();
  if (isHome) initTicker();
  if (isHome) initSessionTimer();
  initCardTilt();
  initMiniTerminal();
  initVisitCounter();
  initProjectFilter();
  initSound();
  initIdleMode();
  initKonami();
  initKeyboardShortcuts();
  initPageLoaders();
  initDevtoolsMessages();
}

/* ─────────────────────────────────────
   ACTIVE NAV LINK
───────────────────────────────────── */
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[href]').forEach(link => {
    if (link.getAttribute('href') === page) {
      link.classList.add('active');
    }
  });
}

/* ─────────────────────────────────────
   CURSOR VERT
───────────────────────────────────── */
function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;
  let mx = -100, my = -100, fx = -100, fy = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    gsap.to(cursor, { x: mx - 5, y: my - 5, duration: 0.08, ease: 'none' });
  }, { passive: true });

  (function loop() {
    fx += (mx - fx) * 0.1;
    fy += (my - fy) * 0.1;
    gsap.set(follower, { x: fx - 18, y: fy - 18 });
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('a, button, .skill-block, .project-item, .chip, .interest-item, .download-btn').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hovering'); follower.classList.add('hovering'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hovering'); follower.classList.remove('hovering'); });
  });
}

/* ─────────────────────────────────────
   NAVIGATION (scroll background)
───────────────────────────────────── */
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ─────────────────────────────────────
   HERO — ANIMATION D'ENTRÉE (index.html)
───────────────────────────────────── */
function initHero() {
  if (!document.querySelector('.hero-line-inner')) return;
  const tl = gsap.timeline({ delay: 0.1 });
  tl
    .to('.boot-line',         { opacity: 1, stagger: 0.2, duration: 0.4, ease: 'power2.out' })
    .to('.hero-line-inner',   { y: '0%', duration: 1, ease: 'power4.out', stagger: 0.1 }, '-=0.2')
    .to('.typewriter-block',  { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
    .to('.hero-availability', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
    .to('.hero-cta',          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
    .to('.hero-scroll',       { opacity: 1, duration: 0.5 }, '-=0.2');
}

/* ─────────────────────────────────────
   TYPEWRITER (index.html)
───────────────────────────────────── */
function initTypewriter() {
  const el = document.getElementById('typedText');
  if (!el) return;
  const phrases = [
    'Étudiant BUT MMI',
    'Fan de code et de design',
    'Disponible pour un stage',
    'Toujours en train d\'apprendre',
  ];
  let pi = 0, ci = 0, deleting = false;

  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.substring(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(type, 1600); return; }
    } else {
      el.textContent = phrase.substring(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(type, 400); return; }
    }
    setTimeout(type, deleting ? 45 : 75);
  }
  setTimeout(type, 800);
}

/* ─────────────────────────────────────
   SCROLL PROGRESS
───────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const max = document.body.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / max * 100) + '%';
  }, { passive: true });
}

/* ─────────────────────────────────────
   REVEAL AU SCROLL
───────────────────────────────────── */
function initReveal() {
  gsap.utils.toArray('.reveal-text').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.75, ease: 'power3.out',
        scrollTrigger: {
          trigger: el, start: 'top 89%', end: 'top 15%',
          toggleActions: 'play none play reverse'
        }
      }
    );
  });

  gsap.utils.toArray('.project-item:not(.project-coming)').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, x: -24 },
      {
        opacity: 1, x: 0, duration: 0.65, ease: 'power3.out',
        scrollTrigger: {
          trigger: item, start: 'top 90%', end: 'top 15%',
          toggleActions: 'play none play reverse'
        }
      }
    );
  });

  const comingItem = document.querySelector('.project-coming');
  if (comingItem) {
    gsap.fromTo(comingItem,
      { opacity: 0, x: -24 },
      {
        opacity: 0.4, x: 0, duration: 0.65, ease: 'power3.out',
        scrollTrigger: {
          trigger: comingItem, start: 'top 90%', end: 'top 15%',
          toggleActions: 'play none play reverse'
        }
      }
    );
  }

  const skillsGrid = document.querySelector('.skills-grid');
  if (skillsGrid) {
    ScrollTrigger.create({
      trigger: skillsGrid, start: 'top 85%', end: 'top 10%',
      toggleActions: 'play none play reverse',
      onEnter:      () => animateSkillBlocks(),
      onEnterBack:  () => animateSkillBlocks(),
      onLeaveBack:  () => gsap.set('.skill-block', { opacity: 0, y: 22 }),
    });
  }
}

function animateSkillBlocks() {
  gsap.fromTo('.skill-block',
    { opacity: 0, y: 22 },
    { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.08 }
  );
}

/* ─────────────────────────────────────
   COMPTEURS — scanner effect
───────────────────────────────────── */
function initCounters() {
  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    const suffix = el.hasAttribute('data-nosuffix') ? '' : '+';
    let anim, scanInterval;
    const run = () => {
      if (anim) anim.kill();
      clearInterval(scanInterval);
      el.textContent = '??';
      scanInterval = setInterval(() => {
        el.textContent = Math.floor(Math.random() * (target * 3 + 8)) + suffix;
      }, 52);
      setTimeout(() => {
        clearInterval(scanInterval);
        const obj = { val: 0 };
        anim = gsap.to(obj, {
          val: target, duration: 1.2, ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(obj.val) + suffix; }
        });
      }, 520);
    };
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', end: 'top 15%',
      toggleActions: 'play none play reverse',
      onEnter:     run,
      onEnterBack: run,
      onLeaveBack: () => { clearInterval(scanInterval); if (anim) anim.kill(); el.textContent = '0' + suffix; },
    });
  });
}

/* ─────────────────────────────────────
   BARRES DE COMPÉTENCES
───────────────────────────────────── */
function initSkillBars() {
  document.querySelectorAll('.bar-fill').forEach(bar => {
    const targetW = bar.style.getPropertyValue('--w');
    bar.style.width = '0%';
    ScrollTrigger.create({
      trigger: bar, start: 'top 88%', end: 'top 15%',
      toggleActions: 'play none play reverse',
      onEnter:     () => gsap.to(bar, { width: targetW, duration: 1.2, ease: 'power2.out' }),
      onEnterBack: () => gsap.to(bar, { width: targetW, duration: 1.2, ease: 'power2.out' }),
      onLeaveBack: () => gsap.to(bar, { width: '0%', duration: 0.4, ease: 'power2.in' }),
    });
  });
}

/* ─────────────────────────────────────
   MENU MOBILE
───────────────────────────────────── */
let menuOpen = false;

function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn  = document.getElementById('navMenu');
  if (!menu || !btn) return;
  menu.classList.remove('active');
  menu.setAttribute('aria-hidden', 'true');
  btn.classList.remove('active');
  document.body.style.overflow = '';
  menuOpen = false;
}

function initMobileMenu() {
  const btn  = document.getElementById('navMenu');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    menu.classList.toggle('active', menuOpen);
    menu.setAttribute('aria-hidden', String(!menuOpen));
    btn.classList.toggle('active', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuOpen) closeMobileMenu();
  });
}

/* ─────────────────────────────────────
   SCROLL TO TOP
───────────────────────────────────── */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─────────────────────────────────────
   VIRUS OVERLAY (index.html only)
───────────────────────────────────── */
function initVirusOverlay() {
  const overlay  = document.getElementById('virusOverlay');
  const box      = document.getElementById('virusBox');
  const terminal = document.getElementById('virusTerminal');
  const cta      = document.getElementById('virusCta');
  const ignoreBtn = document.getElementById('virusIgnore');
  const cdBar    = document.getElementById('virusCountdown');
  const secEl    = document.getElementById('virusSec');
  if (!overlay || !terminal) return;

  // Show only once per session
  if (sessionStorage.getItem('virus_shown')) return;

  // Script des lignes à taper
  const script = [
    { text: 'root@portfolio:~$ ./intrusion_scan.sh',  cls: '',     pause: 500  },
    { text: '[0.001] Scanning portfolio filesystem...', cls: '',     pause: 280  },
    { text: '[0.112] Core modules loaded......... OK', cls: '',     pause: 250  },
    { text: '[0.287] Public files indexed........ OK', cls: '',     pause: 260  },
    { text: '[0.412] !! WARNING — Anomaly detected !!', cls: 'warn', pause: 400, effect: 'flash' },
    { text: '[0.534] >> Hidden file: [CRYPTÉ].html',   cls: 'found', pause: 380  },
    { text: '[0.689] Access level required: ELEVATED', cls: 'warn', pause: 320  },
    { text: '[0.891] !! CRITICAL — File not in sitemap !!!', cls: 'crit', pause: 0, effect: 'shake' },
  ];

  let countdownTimer;

  function dismiss() {
    sessionStorage.setItem('virus_shown', '1');
    clearInterval(countdownTimer);
    overlay.classList.remove('show');
    overlay.classList.add('hiding');
  }

  function startCountdown(sec) {
    if (cdBar) cdBar.style.display = 'block';
    let left = sec;
    countdownTimer = setInterval(() => {
      left--;
      if (secEl) secEl.textContent = left;
      if (left <= 0) { clearInterval(countdownTimer); dismiss(); }
    }, 1000);
  }

  // Type a single line character by character
  function typeLine(lineEl, text, speed, onDone) {
    let i = 0;
    // blinking cursor at end
    const cursor = document.createElement('span');
    cursor.className = 'vt-blinkcursor';
    cursor.textContent = '▮';
    lineEl.appendChild(cursor);

    function tick() {
      if (i < text.length) {
        cursor.insertAdjacentText('beforebegin', text[i++]);
        setTimeout(tick, speed + Math.random() * 8);
      } else {
        cursor.remove();
        if (onDone) onDone();
      }
    }
    tick();
  }

  // Run all lines sequentially then show CTA
  function runScript(index) {
    if (index >= script.length) {
      // All done — show CTA + countdown
      setTimeout(() => {
        cta.classList.add('show');
        if (secEl) secEl.textContent = 15;
        startCountdown(15);
      }, 500);
      return;
    }

    const item   = script[index];
    const lineEl = document.createElement('p');
    lineEl.className = 'vt-line' + (item.cls ? ' ' + item.cls : '');
    terminal.appendChild(lineEl);

    // Speed: normal lines 11ms, warning/crit lines 14ms (more tension)
    const speed = item.cls === 'crit' || item.cls === 'warn' ? 14 : 11;

    typeLine(lineEl, item.text, speed, () => {
      // Visual effects on certain lines
      if (item.effect === 'flash' && box) {
        box.classList.add('flash-red');
        box.addEventListener('animationend', () => box.classList.remove('flash-red'), { once: true });
      }
      if (item.effect === 'shake' && box) {
        box.classList.add('glitch-shake');
        box.addEventListener('animationend', () => box.classList.remove('glitch-shake'), { once: true });
      }
      setTimeout(() => runScript(index + 1), item.pause + 150);
    });
  }

  // Show overlay after a short breath (hero already visible)
  setTimeout(() => {
    overlay.classList.add('show');
    // Start typing after overlay fade-in
    setTimeout(() => runScript(0), 600);
  }, 1200);

  // Dismiss controls
  if (ignoreBtn) ignoreBtn.addEventListener('click', dismiss);

  // CHERCHER → stay on page, show toast hint, don't redirect
  const searchBtn = document.getElementById('virusSearch');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      dismiss();
      setTimeout(() => {
        const toast = document.getElementById('glitchToast');
        if (!toast) return;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
      }, 400);
    });
  }

  document.addEventListener('keydown', e => { if (e.key === 'Escape') dismiss(); });
}

/* ─────────────────────────────────────
   RIPPLE EFFECT
───────────────────────────────────── */
function initRipple() {
  document.querySelectorAll('.term-btn, .submit-btn, .validate-btn, .download-btn').forEach(el => {
    el.style.overflow = 'hidden';
    el.style.position = 'relative';
    el.addEventListener('click', e => {
      const rect = el.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute;border-radius:50%;pointer-events:none;
        width:${size}px;height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top - size/2}px;
        background:rgba(0,0,0,.25);
        transform:scale(0);animation:ripple-anim .5s ease-out;
      `;
      if (!document.getElementById('ripple-style')) {
        const s = document.createElement('style');
        s.id = 'ripple-style';
        s.textContent = '@keyframes ripple-anim{to{transform:scale(2.5);opacity:0}}';
        document.head.appendChild(s);
      }
      el.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}

/* ─────────────────────────────────────
   FAKE POPUPS
───────────────────────────────────── */
function initFakePopups() {
  const schedule = [
    { id: 'popupDefender',  delay: 8000  },
    { id: 'popupError',     delay: 15000 },
    { id: 'popupAntivirus', delay: 22000 },
  ];

  schedule.forEach(({ id, delay }) => {
    setTimeout(() => {
      const popup = document.getElementById(id);
      if (!popup) return;
      popup.classList.add('show');
      new Set(popup.querySelectorAll('.fp-closer')).forEach(btn => {
        btn.addEventListener('click', () => {
          popup.classList.add('hiding');
          setTimeout(() => popup.classList.remove('show', 'hiding'), 280);
          if (id === 'popupAntivirus') spawnCascadePopups();
        }, { once: true });
      });
    }, delay);
  });
}

function spawnCascadePopups() {
  const waves = [
    { title: '⚠ Security Alert',   body: 'Unauthorized access attempt blocked on port 443!', bg: '#fff',    top: '65%', left: '12%'  },
    { title: '🔴 Virus Detected',   body: 'THREAT: Trojan.Portfolio.EasterEgg — Remove now?',  bg: '#fff5f5', top: '28%', right: '8%'  },
    { title: '⚠ System Warning',   body: 'Memory usage: 97% — system unstable. Page hidden in RAM.', bg: '#fffde7', top: '72%', right: '18%' },
  ];

  waves.forEach((d, i) => {
    setTimeout(() => {
      const popup = document.createElement('div');
      popup.className = 'fake-popup fp-cascade';
      popup.style.cssText = `top:${d.top};left:${d.left||'auto'};right:${d.right||'auto'};background:${d.bg};z-index:88890`;
      popup.innerHTML = `
        <div class="fp-titlebar">
          <span class="fp-titlebar-title">${d.title}</span>
          <button class="fp-close" style="cursor:pointer!important" onclick="this.closest('.fake-popup').classList.add('hiding');setTimeout(()=>this.closest('.fake-popup').remove(),280)">✕</button>
        </div>
        <div class="fp-body">
          <p style="font-size:11px;color:#333;margin:0 0 10px">${d.body}</p>
          <div class="fp-btns">
            <button class="fp-btn primary" style="cursor:pointer!important" onclick="this.closest('.fake-popup').classList.add('hiding');setTimeout(()=>this.closest('.fake-popup').remove(),280)">OK</button>
          </div>
        </div>
      `;
      document.body.appendChild(popup);
      requestAnimationFrame(() => requestAnimationFrame(() => popup.classList.add('show')));
    }, i * 700);
  });
}

/* ─────────────────────────────────────
   SCREEN TEAR (random)
───────────────────────────────────── */
function initScreenTear() {
  const wrap = document.querySelector('.page-wrap') || document.querySelector('.hero');
  if (!wrap || reduced) return;
  setInterval(() => {
    if (Math.random() < 0.12) {
      wrap.classList.add('tearing');
      wrap.addEventListener('animationend', () => wrap.classList.remove('tearing'), { once: true });
    }
  }, 4000);
}

/* ─────────────────────────────────────
   LENIS SMOOTH SCROLL
───────────────────────────────────── */
function initLenis() {
  if (typeof Lenis === 'undefined' || reduced) return;
  const lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ─────────────────────────────────────
   CMD REVEAL (text clip-path from left)
───────────────────────────────────── */
function initCmdReveal() {
  document.querySelectorAll('.cmd-header').forEach(header => {
    header.classList.add('cmd-reveal');
    ScrollTrigger.create({
      trigger: header, start: 'top 90%', end: 'top 15%',
      onEnter:     () => header.classList.add('cmd-revealed'),
      onEnterBack: () => header.classList.add('cmd-revealed'),
      onLeaveBack: () => header.classList.remove('cmd-revealed'),
    });
  });
}

/* ─────────────────────────────────────
   HERO SCROLL PARALLAX
───────────────────────────────────── */
function initHeroScrollParallax() {
  if (reduced) return;
  gsap.to('.hero-inner', {
    y: -140, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 }
  });
  gsap.to('#matrix-canvas', {
    y: -70, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2 }
  });
}

/* ─────────────────────────────────────
   SKILLS TICKER
───────────────────────────────────── */
function initTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track || reduced) return;
  let pos = 0, vel = 0, lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    vel += (window.scrollY - lastY) * 0.09;
    lastY = window.scrollY;
  }, { passive: true });
  const half = () => track.scrollWidth / 2;
  (function tick() {
    vel *= 0.90;
    pos -= 0.55 + vel;
    if (Math.abs(pos) >= half()) pos += half();
    track.style.transform = `translateX(${pos.toFixed(2)}px)`;
    requestAnimationFrame(tick);
  })();
}

/* ─────────────────────────────────────
   PARALLAXE HERO (mouse depth)
───────────────────────────────────── */
function initHeroParallax() {
  if (reduced || window.matchMedia('(pointer: coarse)').matches) return;
  const layers = [
    { sel: '.boot-block',         d: 0.016 },
    { sel: '.hero-title',         d: 0.028 },
    { sel: '.typewriter-block',   d: 0.020 },
    { sel: '.hero-availability',  d: 0.012 },
    { sel: '.hero-cta',           d: 0.008 },
  ].map(l => ({ el: document.querySelector(l.sel), d: l.d })).filter(l => l.el);

  let raf;
  let tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    tx = e.clientX - window.innerWidth  / 2;
    ty = e.clientY - window.innerHeight / 2;
  }, { passive: true });

  (function tick() {
    layers.forEach(({ el, d }) => {
      el.style.transform = `translate(${(tx * d).toFixed(2)}px, ${(ty * d).toFixed(2)}px)`;
    });
    raf = requestAnimationFrame(tick);
  })();
}

/* ─────────────────────────────────────
   3D CARD TILT
───────────────────────────────────── */
function initCardTilt() {
  if (reduced || window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.expertise-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rx = ((y - r.height / 2) / r.height) * -12;
      const ry = ((x - r.width  / 2) / r.width)  *  12;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px) translateY(-4px)`;
      card.style.transition = 'transform .08s ease';
    }, { passive: true });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1), border-color .35s, box-shadow .35s, background .35s';
    });
  });
}

/* ─────────────────────────────────────
   SESSION TIMER (hero)
───────────────────────────────────── */
function initSessionTimer() {
  const el = document.getElementById('sessionTimer');
  if (!el) return;
  const start = Date.now();
  setInterval(() => {
    const s = Math.floor((Date.now() - start) / 1000);
    const hh = String(Math.floor(s / 3600)).padStart(2, '0');
    const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    el.textContent = `${hh}:${mm}:${ss}`;
  }, 1000);
}

/* ─────────────────────────────────────
   MINI-TERMINAL
───────────────────────────────────── */
function initMiniTerminal() {
  const terminal  = document.getElementById('miniTerminal');
  const input     = document.getElementById('mtInput');
  const output    = document.getElementById('mtOutput');
  const openBtn   = document.getElementById('navTerminalBtn');
  const closeBtn  = document.getElementById('mtClose');
  if (!terminal || !input || !output) return;

  let isOpen = false;
  let history = [];
  let histIdx = -1;

  const COMMANDS = {
    help: () => [
      '<span class="mt-dim">Available commands:</span>',
      '  <span class="mt-green">whoami</span>          — About me',
      '  <span class="mt-green">ls</span>              — List pages',
      '  <span class="mt-green">neofetch</span>        — System info',
      '  <span class="mt-green">skills</span>          — My skill stack',
      '  <span class="mt-green">projects</span>        — My projects',
      '  <span class="mt-green">contact</span>         — Get in touch',
      '  <span class="mt-green">ping</span>            — Ping the developer',
      '  <span class="mt-green">hire</span>            — Make a job offer',
      '  <span class="mt-green">cv</span>              — Open CV PDF',
      '  <span class="mt-green">github</span>          — Open GitHub profile',
      '  <span class="mt-green">linkedin</span>        — Open LinkedIn',
      '  <span class="mt-green">uname</span>           — System info',
      '  <span class="mt-green">history</span>         — Command history',
      '  <span class="mt-green">visits</span>          — Nombre de visites',
      '  <span class="mt-green">hack</span>            — ???',
      '  <span class="mt-green">open [page]</span>     — Navigate (ex: open about)',
      '  <span class="mt-green">date</span>            — Current date',
      '  <span class="mt-green">matrix</span>          — Toggle matrix intensity',
      '  <span class="mt-green">indice</span>          — Devinette : page cachee',
      '  <span class="mt-green">clear</span>           — Clear terminal',
    ].join('\n'),

    whoami: () => [
      '<span class="mt-green">jibril_filali</span>',
      '  Formation : BUT MMI — IUT de Troyes (1ère année)',
      '  Aime      : le code, le design, et quand les deux marchent bien ensemble',
      '  Status    : <span class="mt-green">● EN FORMATION</span> — cherche un stage pour 2027',
      '  Stack     : HTML · CSS · JS · PHP · Python · SQL · Docker',
      '  Lieu      : Troyes / Lyon',
    ].join('\n'),

    ls: () => [
      '<span class="mt-dim">total 5 pages</span>',
      '  drwxr-xr-x  <span class="mt-green">index.html</span>     — Home',
      '  drwxr-xr-x  <span class="mt-green">about.html</span>     — About me',
      '  drwxr-xr-x  <span class="mt-green">projects.html</span>  — Projects',
      '  drwxr-xr-x  <span class="mt-green">skills.html</span>    — Skills',
      '  drwxr-xr-x  <span class="mt-green">contact.html</span>   — Contact',
      '  -rw-------  <span class="mt-dim">???.html</span>         — [ENCRYPTED]',
    ].join('\n'),

    neofetch: () => [
      '<span class="mt-green">        ██████████     </span>  <span class="mt-white">jibril</span><span class="mt-dim">@</span><span class="mt-green">portfolio</span>',
      '<span class="mt-green">      ██░░░░░░░░██    </span>  <span class="mt-dim">──────────────────────</span>',
      '<span class="mt-green">    ██░░░░░░░░░░██   </span>  OS:         PortfolioOS 4.2',
      '<span class="mt-green">   ██░░░░░░░░░░░░██  </span>  Host:       BUT MMI · IUT de Troyes',
      '<span class="mt-green">  ██░░░░██░░░░░░░░██ </span>  Kernel:     JavaScript ES2024',
      '<span class="mt-green">  ██░░░░██░░░░░░░░██ </span>  Uptime:     <span id="nfUptime">...</span>',
      '<span class="mt-green">   ██░░░░░░░░░░░░██  </span>  Shell:      JetBrains Mono',
      '<span class="mt-green">    ██░░░░░░░░░░██   </span>  Resolution: \u221e \xd7 \u221e',
      '<span class="mt-green">      ██░░░░░░░░██   </span>  Theme:      Matrix Dark',
      '<span class="mt-green">        ██████████   </span>  Terminal:   Portfolio v4.2',
      '                       Packages:   GSAP · Lenis · Web Audio',
      '                       Visits:     <span class="mt-green">' + (localStorage.getItem('pf_visits') || 1) + '</span>',
      '  <span class="mt-colors">████</span><span style="color:#00c732">████</span><span style="color:#007a1e">████</span><span style="color:#00ff41">████</span><span style="color:#39ff6e">████</span><span style="color:#00e5ff">████</span>',
    ].join('\n'),

    skills: () => [
      '<span class="mt-dim">cat skills.txt</span>',
      '  <span class="mt-green">Frontend</span>   ████████████████░░░░  80%  HTML5 · CSS3 · JavaScript · GSAP',
      '  <span class="mt-green">Backend</span>    █████████████░░░░░░░  65%  PHP · Python · Node.js',
      '  <span class="mt-green">Database</span>   ████████████░░░░░░░░  60%  SQL · MongoDB',
      '  <span class="mt-green">DevOps</span>     ██████████░░░░░░░░░░  50%  Docker · Git · Cloudflare',
      '  <span class="mt-green">Design</span>     ███████████████░░░░░  75%  Figma · UX/UI',
    ].join('\n'),

    projects: () => [
      '<span class="mt-dim">ls ./projects/</span>',
      '  <span class="mt-green">[01]</span> Site Fan Football  — HTML/CSS/JS/PHP/Docker  <span class="mt-dim">2025</span>',
      '  <span class="mt-green">[02]</span> SetupClaude        — HTML/CSS/JS/API Anthropic <span class="mt-dim">2026</span>',
      '  <span class="mt-green">[03]</span> Portfolio v4.2     — JS/GSAP/CSS3             <span class="mt-dim">2026</span>',
      '  <span class="mt-dim">[04]</span> <span class="mt-dim">???                — COMING SOON</span>',
      '  \u2192 <span class="mt-white">open projects</span> pour voir tous les projets',
    ].join('\n'),

    contact: () => [
      '<span class="mt-dim">cat contact.txt</span>',
      '  Mail     : jibril.filali@etudiant.univ-reims.fr',
      '  GitHub   : <span class="mt-green">github.com/Jibril-Filali</span>',
      '  LinkedIn : <span class="mt-green">linkedin.com/in/jibril-filali-59b02b390</span>',
      '  <span class="mt-dim">→</span> <span class="mt-white">open contact</span> pour m\'écrire directement',
      '  Status   : <span class="mt-green">● dispo pour un stage à partir de 2027</span>',
    ].join('\n'),

    indice: () => [
      '<span class="mt-green">[ DEVINETTE — PAGE CACHEE ]</span>',
      '<span class="mt-dim">─────────────────────────────────────────</span>',
      '  Les developpeurs me cachent dans leur code comme un tresor.',
      '  Mon nom est compose de deux mots anglais :',
      '      le premier designe une fete religieuse du printemps,',
      '      le second, ce que les poules pondent.',
      '  Les popups qui t\'ont rendu visite ont murmuré mon prenom.',
      '<span class="mt-dim">─────────────────────────────────────────</span>',
    ].join('\n'),

    date: () => {
      const now = new Date();
      return `${now.toLocaleDateString('fr-FR', { weekday:'long', year:'numeric', month:'long', day:'numeric' })} — ${now.toLocaleTimeString('fr-FR')}`;
    },

    clear: () => { output.innerHTML = ''; return null; },

    matrix: () => {
      const canvas = document.getElementById('matrix-canvas');
      if (!canvas) return 'matrix-canvas not found';
      const current = parseFloat(canvas.style.opacity || 0.12);
      canvas.style.opacity = current > 0.15 ? '0.12' : '0.45';
      canvas.style.transition = 'opacity 1s';
      return current > 0.15
        ? '<span class="mt-dim">Matrix intensity: normal</span>'
        : '<span class="mt-green">Matrix intensity: MAXIMUM</span>';
    },

    ping: () => [
      '<span class="mt-dim">PING jibril.dev — 32 bytes of data</span>',
      '  Reply from jibril.dev: bytes=32 time=<span class="mt-green">12ms</span> TTL=64',
      '  Reply from jibril.dev: bytes=32 time=<span class="mt-green">9ms</span>  TTL=64',
      '  Reply from jibril.dev: bytes=32 time=<span class="mt-green">11ms</span> TTL=64',
      '  <span class="mt-green">Packets: Sent=3, Received=3, Lost=0 (0% loss)</span>',
      '  <span class="mt-dim">→ Developer is ONLINE and responding fast.</span>',
    ].join('\n'),

    hire: () => [
      '<span class="mt-green">[ OFFER RECEIVED ]</span>',
      '  Processing request: sudo hire jibril...',
      '  Checking availability: <span class="mt-green">● DISPONIBLE — stage 2027</span>',
      '  Stack match:          <span class="mt-green">✓ 97% compatible</span>',
      '  Response time:        <span class="mt-green">fast</span>',
      '  → <span class="mt-white">open contact</span> pour envoyer une offre.',
    ].join('\n'),

    cv: () => {
      window.open('fichier/CV%20JIBRIL%20FILALI.pdf', '_blank');
      return '<span class="mt-dim">→ Ouverture du CV en PDF...</span>';
    },

    github: () => {
      window.open('https://github.com/Jibril-Filali', '_blank');
      return '<span class="mt-dim">→ Ouverture de GitHub...</span>';
    },

    linkedin: () => {
      window.open('https://www.linkedin.com/in/jibril-filali-59b02b390/', '_blank');
      return '<span class="mt-dim">→ Ouverture de LinkedIn...</span>';
    },

    uname: () => '<span class="mt-green">PortfolioOS 4.2</span> — JetBrains Mono kernel — x86_64 GNU/Matrix',

    history: () => history.length
      ? history.map((c, i) => `  <span class="mt-dim">${i + 1}</span>  ${c}`).join('\n')
      : '<span class="mt-dim">No history yet.</span>',

    visits: () => {
      const n = parseInt(localStorage.getItem('pf_visits') || '1');
      return `  <span class="mt-green">Visites enregistrées :</span> <span class="mt-white">${n}</span>\n  <span class="mt-dim">(stocké en localStorage · réinitialiser avec</span> <span class="mt-white">reset visits</span><span class="mt-dim">)</span>`;
    },
  };

  // Special: sudo commands
  function handleSudo(cmd) {
    if (cmd === 'sudo find easter-egg' || cmd === 'sudo find easter_egg') {
      return `<span style="color:var(--red)">Permission denied.</span>
<span class="mt-dim">But the file system whispers...</span>
<span class="mt-green">Hint: The page has the same extension as all others.
Its name evokes mysteries and hidden treasures.
It is not linked in the nav. It watches you.</span>`;
    }
    if (cmd === 'sudo hire jibril' || cmd === 'sudo hire') {
      const fn = COMMANDS.hire;
      return fn ? fn() : null;
    }
    if (cmd === 'sudo rm -rf /' || cmd === 'sudo rm -rf') {
      return `<span style="color:var(--red)">nice try.</span> <span class="mt-dim">This system is protected by talent.</span>`;
    }
    if (cmd.startsWith('sudo')) return `<span style="color:var(--red)">sudo: command not allowed in portfolio mode</span>`;
    return null;
  }

  // hack command
  function handleHack(out) {
    const lines = [
      '<span style="color:var(--red)">[ INITIALIZING HACK SEQUENCE ]</span>',
      '<span class="mt-dim">Bypassing firewall............</span> <span class="mt-green">OK</span>',
      '<span class="mt-dim">Cracking encryption...........</span> <span class="mt-green">OK</span>',
      '<span class="mt-dim">Accessing mainframe...........</span> <span class="mt-green">OK</span>',
      '<span style="color:var(--red)">!! ACCESS GRANTED !!</span>',
      '<span class="mt-green">→ Congratulations. You found nothing. This is just a portfolio.</span>',
      '<span class="mt-dim">→ But seriously, hire me. jibrilfilali10@gmail.com</span>',
    ];
    let i = 0;
    const int = setInterval(() => {
      if (i < lines.length) {
        const p = document.createElement('p');
        p.className = 'mt-line';
        p.innerHTML = lines[i++];
        out.appendChild(p);
        out.scrollTop = out.scrollHeight;
      } else {
        clearInterval(int);
        // flash matrix
        const canvas = document.getElementById('matrix-canvas');
        if (canvas) {
          canvas.style.opacity = '0.5'; canvas.style.transition = 'opacity .3s';
          setTimeout(() => { canvas.style.opacity = '0.12'; }, 2000);
        }
      }
    }, 350);
    return null; // handled manually
  }

  // open [page]
  function handleOpen(cmd) {
    const map = { about: 'about.html', projects: 'projects.html', skills: 'skills.html', contact: 'contact.html', home: 'index.html', index: 'index.html' };
    const target = cmd.replace(/^open\s+/, '').replace('.html','').toLowerCase();
    if (map[target]) {
      addBlock(`<span class="mt-dim">\u2192 Navigating to ${map[target]}...</span>`);
      setTimeout(() => window.location.href = map[target], 600);
      return null;
    }
    return `<span style="color:var(--red)">open: page not found: ${target}</span>`;
  }

  /* Ajoute une ligne avec prompt (entrée utilisateur) */
  function addLine(html) {
    const p = document.createElement('p');
    p.className = 'mt-line';
    p.innerHTML = `<span class="mt-prompt-inline">~$</span> ${html}`;
    output.appendChild(p);
    output.scrollTop = output.scrollHeight;
  }

  /* Ajoute un bloc multi-lignes, chaque \n → <p> séparée */
  function addBlock(html) {
    const lines = html.split('\n');
    lines.forEach(line => {
      const p = document.createElement('p');
      p.className = 'mt-line';
      p.innerHTML = line === '' ? '&nbsp;' : line;
      output.appendChild(p);
    });
    output.scrollTop = output.scrollHeight;
  }

  function runCommand(raw) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    history.unshift(raw.trim());
    histIdx = -1;
    addLine(`<span class="mt-white">${raw.trim()}</span>`);

    // sudo
    const sudoResult = handleSudo(cmd);
    if (sudoResult !== null) { addBlock(sudoResult); return; }

    // open
    if (cmd.startsWith('open')) { const r = handleOpen(cmd); if (r !== null) addBlock(r); return; }

    // reset visits
    if (cmd === 'reset visits') {
      localStorage.setItem('pf_visits', '1');
      addBlock('<span class="mt-dim">Compteur de visites réinitialisé.</span>');
      return;
    }

    // hack
    if (cmd === 'hack') { handleHack(output); return; }

    // built-in
    const fn = COMMANDS[cmd];
    if (fn) {
      const result = fn();
      if (result !== null) addBlock(result);
      if (cmd === 'neofetch') {
        setTimeout(() => {
          const nf = document.getElementById('nfUptime');
          if (nf && document.getElementById('sessionTimer')) {
            nf.textContent = document.getElementById('sessionTimer').textContent;
          }
        }, 50);
      }
    } else {
      addBlock(`<span style="color:var(--red)">${raw.trim()}: command not found.</span> Type <span class="mt-green">help</span>.`);
    }
  }

  function toggle() {
    isOpen = !isOpen;
    terminal.classList.toggle('open', isOpen);
    terminal.setAttribute('aria-hidden', String(!isOpen));
    if (isOpen) {
      setTimeout(() => input.focus(), 300);
      if (output.children.length === 0) {
        addBlock(`<span class="mt-green">Portfolio Terminal v4.2</span> — Type <span class="mt-white">help</span> for commands`);
      }
    }
  }

  if (openBtn) openBtn.addEventListener('click', toggle);
  if (closeBtn) closeBtn.addEventListener('click', toggle);

  // Dots macOS
  const dotClose = document.getElementById('mtDotClose');
  const dotMin   = document.getElementById('mtDotMin');
  const dotMax   = document.getElementById('mtDotMax');
  const fsBtn    = document.getElementById('mtFullscreen');
  if (dotClose) dotClose.addEventListener('click', toggle);
  if (dotMin)   dotMin.addEventListener('click', toggle);
  if (dotMax)   dotMax.addEventListener('click', toggleMaximize);
  if (fsBtn)    fsBtn.addEventListener('click', toggleMaximize);

  function toggleMaximize() {
    terminal.classList.toggle('maximized');
    terminal.style.height = '';
    if (fsBtn) fsBtn.textContent = terminal.classList.contains('maximized') ? '[ ⊠ ]' : '[ ⛶ ]';
  }

  // ── Resize par drag ────────────────────────
  const handle = document.getElementById('mtResizeHandle');
  if (handle) {
    let startY, startH;
    handle.addEventListener('mousedown', e => {
      if (terminal.classList.contains('maximized')) return;
      startY = e.clientY;
      startH = terminal.getBoundingClientRect().height;
      handle.classList.add('dragging');
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', stopDrag, { once: true });
      e.preventDefault();
    });
    function onDrag(e) {
      const dy  = startY - e.clientY;
      const newH = Math.max(180, Math.min(window.innerHeight * 0.88, startH + dy));
      terminal.style.height = newH + 'px';
    }
    function stopDrag() {
      handle.classList.remove('dragging');
      document.removeEventListener('mousemove', onDrag);
    }
  }

  // ── Scroll capturé dans le terminal ────────
  const out = document.getElementById('mtOutput');
  if (out) {
    out.addEventListener('wheel', e => {
      e.stopPropagation();
      out.scrollTop += e.deltaY;
    }, { passive: true });
  }

  // Backtick shortcut
  document.addEventListener('keydown', e => {
    if (e.key === '`' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      toggle();
    }
    if (!isOpen) return;
    if (e.key === 'Escape') toggle();
    if (e.key === 'ArrowUp')   { e.preventDefault(); if (history[histIdx + 1] !== undefined) { histIdx++; input.value = history[histIdx]; } }
    if (e.key === 'ArrowDown') { e.preventDefault(); histIdx = Math.max(-1, histIdx - 1); input.value = histIdx >= 0 ? history[histIdx] : ''; }
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { runCommand(input.value); input.value = ''; }
  });
}

/* ─────────────────────────────────────
   SON AMBIANT (pentatonique mineure)
───────────────────────────────────── */
function initSound() {
  const btn = document.getElementById('soundToggle');
  if (!btn) return;

  let ctx = null, master = null, enabled = false, noteTimer = null;

  // La mineur pentatonique — doux, cinématique, style Blade Runner
  const NOTES = [110, 130.81, 146.83, 164.81, 196, 220, 261.63, 293.66, 329.63, 392];

  function build() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();

    master = ctx.createGain();
    master.gain.value = 0;

    // Reverb simulé (convolver avec bruit blanc décroissant)
    const revLen  = ctx.sampleRate * 2.8;
    const revBuf  = ctx.createBuffer(2, revLen, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = revBuf.getChannelData(ch);
      for (let i = 0; i < revLen; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / revLen, 2.5);
    }
    const reverb = ctx.createConvolver();
    reverb.buffer = revBuf;
    const revGain = ctx.createGain();
    revGain.gain.value = 0.55;
    reverb.connect(revGain);
    revGain.connect(master);
    master.connect(ctx.destination);

    // Drone de fond très doux (2 sines, quinte)
    [[110, 0.04], [164.81, 0.02]].forEach(([f, v]) => {
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.12;
      const lfoG = ctx.createGain();
      lfoG.gain.value = v * 0.4;
      lfo.connect(lfoG);
      lfo.start();

      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      g.gain.value = v;
      lfoG.connect(g.gain);
      osc.connect(g);
      g.connect(master);
      g.connect(reverb);
      osc.start();
    });

    // Notes aléatoires arpégées
    function scheduleNote() {
      if (!enabled) return;
      const freq = NOTES[Math.floor(Math.random() * NOTES.length)];
      const t    = ctx.currentTime;
      const dur  = 2 + Math.random() * 3.5;

      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.055, t + 0.4);
      g.gain.linearRampToValueAtTime(0, t + dur);
      osc.connect(g);
      g.connect(master);
      g.connect(reverb);
      osc.start(t);
      osc.stop(t + dur + 0.1);

      noteTimer = setTimeout(scheduleNote, 900 + Math.random() * 2200);
    }

    build._scheduleNote = scheduleNote;
  }

  btn.addEventListener('click', () => {
    build();
    ctx.resume();
    enabled = !enabled;
    btn.classList.toggle('sound-on', enabled);
    btn.textContent = enabled ? '[♪ ON ]' : '[♪ OFF]';
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    if (enabled) {
      master.gain.setValueAtTime(0, t);
      master.gain.linearRampToValueAtTime(1, t + 3);
      build._scheduleNote();
    } else {
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(0, t + 1.5);
      clearTimeout(noteTimer);
    }
  });
}

/* ─────────────────────────────────────
   PAGE TRANSITIONS (glitch exit)
───────────────────────────────────── */
function initPageTransitions() {
  const overlay = document.createElement('div');
  overlay.id = 'page-transition';
  document.body.appendChild(overlay);

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('#') || href.includes('.pdf')) return;
    if (!href.endsWith('.html') && href !== '') return;
    link.addEventListener('click', e => {
      e.preventDefault();
      const dest = href;
      overlay.classList.add('active');
      setTimeout(() => { window.location.href = dest; }, 380);
    });
  });
}

/* ─────────────────────────────────────
   CURSOR TRAIL — matrix chars
───────────────────────────────────── */
function initCursorTrail() {
  if (window.matchMedia('(pointer: coarse)').matches || reduced) return;
  const chars = 'アイウエオカキクケコ01アBCDEF!@#%$';
  const POOL  = 16;
  const pool  = [];

  for (let i = 0; i < POOL; i++) {
    const el = document.createElement('div');
    el.className = 'cursor-trail-char';
    el.textContent = chars[Math.floor(Math.random() * chars.length)];
    document.body.appendChild(el);
    pool.push({ el, x: -999, y: -999, life: 0, maxLife: 0.35 + Math.random() * 0.35 });
  }

  let nextIdx = 0, lastSpawn = 0;

  document.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - lastSpawn < 35) return;
    lastSpawn = now;
    const p = pool[nextIdx % POOL]; nextIdx++;
    p.x = e.clientX + (Math.random() - 0.5) * 10;
    p.y = e.clientY + (Math.random() - 0.5) * 10;
    p.life = p.maxLife;
    p.el.textContent = chars[Math.floor(Math.random() * chars.length)];
  }, { passive: true });

  let last = 0;
  (function tick(ts) {
    const dt = Math.min((ts - last) / 1000, 0.05); last = ts;
    pool.forEach(p => {
      if (p.life <= 0) { p.el.style.opacity = 0; return; }
      p.life -= dt;
      p.y -= dt * 20;
      const a = p.life / p.maxLife;
      p.el.style.opacity = a;
      p.el.style.transform = `translate(${p.x - 6}px,${p.y - 6}px) scale(${0.55 + a * 0.45})`;
    });
    requestAnimationFrame(tick);
  })(0);
}

/* ─────────────────────────────────────
   CMD HEADER TYPING (replaces clip-path reveal)
───────────────────────────────────── */
function initCmdTyping() {
  document.querySelectorAll('.cmd-header').forEach(header => {
    const promptEl = header.querySelector('.prompt');
    if (!promptEl) return;

    // Collect text nodes after the prompt
    let cmdText = '';
    header.childNodes.forEach(n => { if (n.nodeType === 3) cmdText += n.textContent; });
    cmdText = cmdText.trim();
    if (!cmdText) return;

    // Remove text nodes, insert typed + cursor spans
    Array.from(header.childNodes).forEach(n => { if (n.nodeType === 3) n.remove(); });
    const typedSpan  = document.createElement('span');
    typedSpan.className = 'cmd-typed';
    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'cmd-type-cursor';
    cursorSpan.textContent = '▮';
    header.appendChild(typedSpan);
    header.appendChild(cursorSpan);

    let started = false;
    ScrollTrigger.create({
      trigger: header, start: 'top 92%',
      onEnter: () => {
        if (started) return; started = true;
        let i = 0;
        function tick() {
          typedSpan.textContent = ' ' + cmdText.substring(0, i++);
          if (i <= cmdText.length) setTimeout(tick, 20 + Math.random() * 18);
          else setTimeout(() => { cursorSpan.style.animation = 'none'; cursorSpan.style.opacity = '0'; }, 900);
        }
        setTimeout(tick, 200);
      }
    });
  });
}

/* ─────────────────────────────────────
   CONSOLE DEVTOOLS — messages stylisés
───────────────────────────────────── */
function initDevtoolsMessages() {
  console.log('%c👋 Salut le curieux !', 'font-size:20px;font-weight:bold;color:#00ff41;background:#090d09;padding:8px 18px;border-left:3px solid #00ff41');
  console.log('%c🔍 Tu inspectes le code — bonne idée.', 'font-size:13px;color:#00c732;background:#090d09;padding:4px 18px');
  console.log('%c📧  jibrilfilali10@gmail.com', 'font-size:13px;color:#00e5ff;background:#090d09;padding:4px 18px;font-style:italic');
  console.log('%c💼  Je cherche un stage en 2027 — contacte-moi !', 'font-size:13px;color:#00ff41;background:#090d09;padding:4px 18px 8px');
  console.log(
    '%c  ██╗██╗██████╗ ██████╗ ██╗██╗\n  ██║██║██╔══██╗██╔══██╗██║██║\n  ██║██║██████╔╝██████╔╝██║██║\n  ╚═╝╚═╝╚═════╝ ╚═════╝ ╚═╝╚═╝',
    'font-size:9px;color:#007a1e;background:#090d09;line-height:1.5;padding:0 18px'
  );
}

/* ─────────────────────────────────────
   GLOBAL TOAST
───────────────────────────────────── */
function showToast(msg, duration = 3500) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), duration);
}

/* ─────────────────────────────────────
   KONAMI CODE
───────────────────────────────────── */
function initKonami() {
  const TARGET = 'arrowup,arrowup,arrowdown,arrowdown,arrowleft,arrowright,arrowleft,arrowright,b,a';
  const buf = [];
  document.addEventListener('keydown', e => {
    buf.push(e.key.toLowerCase());
    if (buf.length > 10) buf.shift();
    if (buf.join(',') === TARGET) { buf.length = 0; triggerKonamiMode(); }
  });
}

function triggerKonamiMode() {
  const canvas = document.getElementById('matrix-canvas');
  if (canvas) { canvas.style.opacity = '0.6'; canvas.style.transition = 'opacity 0.5s'; }

  document.body.style.animation = 'hack-flash 0.3s steps(2) 6';
  const flash = document.createElement('div');
  flash.style.cssText = 'position:fixed;inset:0;background:#00ff41;opacity:0.18;z-index:99997;pointer-events:none;transition:opacity 2s';
  document.body.appendChild(flash);
  setTimeout(() => { flash.style.opacity = '0'; }, 300);
  setTimeout(() => { flash.remove(); document.body.style.animation = ''; }, 2500);

  showToast('⚡ KONAMI CODE — HACKER MODE UNLOCKED', 4000);

  setTimeout(() => {
    if (canvas) { canvas.style.opacity = '0.12'; canvas.style.transition = 'opacity 3s'; }
  }, 3000);
}

/* ─────────────────────────────────────
   MAGNETIC BUTTONS
───────────────────────────────────── */
function initMagneticButtons() {
  if (window.matchMedia('(pointer: coarse)').matches || reduced) return;
  document.querySelectorAll('.term-btn, .submit-btn, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2))  * 0.26;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.26;
      gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
    }, { passive: true });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1,0.4)' });
    });
  });
}

/* ─────────────────────────────────────
   IDLE MODE — matrix intensifies
───────────────────────────────────── */
function initIdleMode() {
  if (reduced) return;
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  let idleTimer, idle = false;

  function resetIdle() {
    clearTimeout(idleTimer);
    if (idle) {
      idle = false;
      canvas.style.opacity = '0.12';
      canvas.style.transition = 'opacity 2.5s';
    }
    idleTimer = setTimeout(() => {
      idle = true;
      canvas.style.opacity = '0.3';
      canvas.style.transition = 'opacity 4s';
      showToast('[ IDLE MODE ] — bougez pour revenir');
    }, 18000);
  }
  ['mousemove','keydown','scroll','click','touchstart'].forEach(ev => {
    window.addEventListener(ev, resetIdle, { passive: true });
  });
  resetIdle();
}

/* ─────────────────────────────────────
   KEYBOARD SHORTCUTS POPUP (H key)
───────────────────────────────────── */
function initKeyboardShortcuts() {
  const shortcuts = [
    { key: '`',              desc: 'Ouvrir / fermer le terminal' },
    { key: 'H',              desc: 'Afficher ces raccourcis' },
    { key: 'Esc',            desc: 'Fermer terminal / menu' },
    { key: '↑↑↓↓←→←→BA',  desc: 'Konami Code — Hacker mode' },
    { key: 'hack',           desc: 'Commande secrète (terminal)' },
    { key: 'hire',           desc: 'Faire une offre (terminal)' },
  ];

  const popup = document.createElement('div');
  popup.id = 'keyboardShortcuts';
  popup.innerHTML = `
    <div class="ks-header">
      <span class="prompt">$ raccourcis clavier</span>
      <button id="ksClose">[ ✕ ]</button>
    </div>
    <div class="ks-list">
      ${shortcuts.map(s => `<div class="ks-item"><span class="ks-key">${s.key}</span><span class="ks-desc">${s.desc}</span></div>`).join('')}
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById('ksClose').addEventListener('click', () => popup.classList.remove('show'));
  document.addEventListener('keydown', e => {
    if (e.code === 'KeyH' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      popup.classList.toggle('show');
    }
    if (e.key === 'Escape') popup.classList.remove('show');
  });
}

/* ─────────────────────────────────────
   PAGE-SPECIFIC LOADER MESSAGES
───────────────────────────────────── */
function initPageLoaders() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const msgs = {
    'about.html': [
      '[ 0.000 ] Loading profile data...',
      '[ 0.214 ] Parsing profile.json... OK',
      '[ 0.438 ] Mounting /usr/bio/... OK',
      '[ 0.672 ] Rendering timeline... OK',
      '[ 0.891 ] Profile loaded.',
    ],
    'projects.html': [
      '[ 0.000 ] Fetching repositories...',
      '[ 0.198 ] Cloning project data... OK',
      '[ 0.421 ] Building project list... OK',
      '[ 0.653 ] Compiling metadata... OK',
      '[ 0.891 ] Projects ready.',
    ],
    'skills.html': [
      '[ 0.000 ] Scanning tech stack...',
      '[ 0.201 ] Loading skill matrix... OK',
      '[ 0.445 ] Calibrating bars... OK',
      '[ 0.673 ] Analyzing proficiency... OK',
      '[ 0.891 ] Stack loaded.',
    ],
    'contact.html': [
      '[ 0.000 ] Initializing secure channel...',
      '[ 0.218 ] Encrypting connection... OK',
      '[ 0.452 ] Loading contact form... OK',
      '[ 0.671 ] Verifying Formspree... OK',
      '[ 0.891 ] Ready to connect.',
    ],
  };

  const pageMsgs = msgs[page];
  if (!pageMsgs) return;
  const lines = document.querySelectorAll('.loader-line');
  lines.forEach((line, i) => {
    if (!pageMsgs[i]) return;
    const ts   = line.querySelector('.ts');
    const ok   = line.querySelector('.ok');
    const parts = pageMsgs[i].split(' ');
    const tsText = parts[0] + ' ' + parts[1];
    const rest   = pageMsgs[i].replace(tsText, '').trim();
    if (ts) ts.textContent = tsText;
    // Set text node (non-OK text)
    line.childNodes.forEach(n => { if (n.nodeType === 3) n.textContent = ' ' + rest.replace(' OK', ''); });
    if (ok && rest.endsWith('OK')) ok.textContent = 'OK';
  });
}

/* ─────────────────────────────────────
   COMPTEUR DE VISITES
───────────────────────────────────── */
function initVisitCounter() {
  const key = 'pf_visits';
  const n = parseInt(localStorage.getItem(key) || '0') + 1;
  localStorage.setItem(key, String(n));
}

/* ─────────────────────────────────────
   FILTRE PROJETS
───────────────────────────────────── */
function initProjectFilter() {
  const bar = document.getElementById('projectFilterBar');
  if (!bar) return;
  const cards = document.querySelectorAll('.project-item[data-tech]');
  bar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const techs = card.dataset.tech || '';
        card.closest('.project-item-wrap').style.display =
          (filter === 'all' || techs.includes(filter)) ? '' : 'none';
      });
    });
  });
}

/* ─────────────────────────────────────
   DÉMARRAGE
───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', initLoader);
