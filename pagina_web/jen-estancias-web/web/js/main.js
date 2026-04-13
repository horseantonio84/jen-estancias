/* ============================================
   NAVAS DE TOLOSA 1212 — main.js
   JEN Estancias · 2025
   ============================================ */
'use strict';

// ─── Añade aquí los nombres de tus imágenes de /recursos_imagenes ────────────
// Ejemplo: const imageFiles = ['batalla_01.jpg', 'caballero.png'];
const imageFiles = [];

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});

navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ─── SMOOTH SCROLL ───────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ─── REVEAL on scroll ────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...entry.target.parentElement.children];
    const delay = siblings.indexOf(entry.target) * 90;
    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── CONTADORES animados ─────────────────────────────────────────────────────
function animateCounter(el) {
  const raw = el.textContent.trim();
  const num  = parseInt(raw.replace(/\D/g, ''), 10);
  if (isNaN(num)) return;
  const suffix = raw.replace(/[\d]/g, '');
  const dur    = 1200;
  const start  = performance.now();

  requestAnimationFrame(function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(e * num) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  });
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.8 });

document.querySelectorAll('.stat-n').forEach(el => counterObs.observe(el));

// ─── GALERÍA DINÁMICA ─────────────────────────────────────────────────────────
function buildGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid || imageFiles.length === 0) return;

  grid.innerHTML = '';

  imageFiles.forEach((filename, idx) => {
    const item = document.createElement('div');
    item.className = 'gallery-item reveal';
    item.style.transitionDelay = `${idx * 60}ms`;

    const img = document.createElement('img');
    img.src     = `recursos_imagenes/${filename}`;
    img.alt     = filename.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ');
    img.loading = 'lazy';

    const overlay = document.createElement('div');
    overlay.className = 'gallery-item-overlay';

    const label = document.createElement('span');
    label.className = 'gallery-item-label';
    label.textContent = img.alt;

    overlay.appendChild(label);
    item.appendChild(img);
    item.appendChild(overlay);

    item.addEventListener('click', () => openLightbox(img.src, img.alt));

    grid.appendChild(item);
    revealObserver.observe(item);
  });
}

// ─── LIGHTBOX ─────────────────────────────────────────────────────────────────
let lb = null;

function buildLightbox() {
  const el = document.createElement('div');
  el.style.cssText = `
    position:fixed;inset:0;z-index:9999;background:rgba(8,6,5,0.97);
    display:flex;align-items:center;justify-content:center;padding:2rem;
    cursor:zoom-out;opacity:0;transition:opacity 0.3s;
  `;

  const img = document.createElement('img');
  img.style.cssText = `
    max-width:90vw;max-height:85vh;object-fit:contain;
    border-radius:3px;box-shadow:0 40px 80px rgba(0,0,0,0.9);
  `;

  const caption = document.createElement('p');
  caption.style.cssText = `
    position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);
    font-family:'Cinzel',serif;font-size:0.65rem;letter-spacing:0.25em;
    text-transform:uppercase;color:rgba(200,149,42,0.7);white-space:nowrap;
  `;

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.cssText = `
    position:absolute;top:1.5rem;right:2rem;
    background:none;border:1px solid rgba(200,149,42,0.3);
    color:rgba(200,149,42,0.7);font-size:1.3rem;
    width:2.2rem;height:2.2rem;cursor:pointer;border-radius:2px;
    display:flex;align-items:center;justify-content:center;
    transition:border-color 0.2s,color 0.2s;
  `;
  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.borderColor = 'rgba(200,149,42,0.9)';
    closeBtn.style.color = 'rgba(200,149,42,0.9)';
  });
  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.borderColor = 'rgba(200,149,42,0.3)';
    closeBtn.style.color = 'rgba(200,149,42,0.7)';
  });

  el.append(img, caption, closeBtn);
  document.body.appendChild(el);

  [el, closeBtn].forEach(t => t.addEventListener('click', e => {
    if (e.target === el || e.target === closeBtn) closeLightbox();
  }));

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  return { el, img, caption };
}

function openLightbox(src, alt) {
  if (!lb) lb = buildLightbox();
  lb.img.src = src;
  lb.caption.textContent = alt;
  lb.el.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => lb.el.style.opacity = '1');
}

function closeLightbox() {
  if (!lb) return;
  lb.el.style.opacity = '0';
  document.body.style.overflow = '';
  setTimeout(() => { lb.el.style.display = 'none'; }, 300);
}

// ─── PARALLAX hero ────────────────────────────────────────────────────────────
function initParallax() {
  const bg = document.querySelector('.hero-bg');
  if (!bg) return;
  window.addEventListener('scroll', () => {
    bg.style.transform = `translateY(${window.scrollY * 0.2}px)`;
  }, { passive: true });
}

// ─── CURSOR personalizado ─────────────────────────────────────────────────────
function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.createElement('div');
  dot.style.cssText = `
    position:fixed;pointer-events:none;z-index:99999;
    width:7px;height:7px;border-radius:50%;
    background:rgba(200,149,42,0.95);
    transform:translate(-50%,-50%);
    transition:width 0.25s,height 0.25s,opacity 0.3s;
    mix-blend-mode:screen;
  `;

  const ring = document.createElement('div');
  ring.style.cssText = `
    position:fixed;pointer-events:none;z-index:99998;
    width:26px;height:26px;border-radius:50%;
    border:1px solid rgba(200,149,42,0.35);
    transform:translate(-50%,-50%);
    transition:width 0.2s,height 0.2s,border-color 0.2s,left 0.06s,top 0.06s;
  `;

  document.body.append(dot, ring);

  document.addEventListener('mousemove', e => {
    dot.style.left  = e.clientX + 'px';
    dot.style.top   = e.clientY + 'px';
    ring.style.left = e.clientX + 'px';
    ring.style.top  = e.clientY + 'px';
  });

  const targets = 'a, button, .bloque-card, .fase-item, .tool-item, .gallery-item, .doc-item, .stat-mini, .team-card';

  document.querySelectorAll(targets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.width  = '12px'; dot.style.height = '12px';
      ring.style.width = '40px'; ring.style.height = '40px';
      ring.style.borderColor = 'rgba(200,149,42,0.65)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width  = '7px'; dot.style.height = '7px';
      ring.style.width = '26px'; ring.style.height = '26px';
      ring.style.borderColor = 'rgba(200,149,42,0.35)';
    });
  });
}

// ─── ACTIVE NAV LINK ─────────────────────────────────────────────────────────
const allSections = document.querySelectorAll('section[id], header[id]');
const allNavLinks = document.querySelectorAll('.nav-links a');

const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      allNavLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${e.target.id}`
          ? 'var(--c-gold-lt)' : '';
      });
    }
  });
}, { threshold: 0.5 });

allSections.forEach(s => sectionObs.observe(s));

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildGallery();
  initParallax();
  initCursor();
  document.body.classList.add('js-ready');
});
