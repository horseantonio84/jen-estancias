/* =============================================
   NAVAS DE TOLOSA 1212 — Main JS
   JEN Estancias · 2026 — Bootstrap Edition
   ============================================= */

/* ---- Navbar scroll ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ---- Close mobile nav on link click (Bootstrap collapse) ---- */
document.querySelectorAll('.nav-link-custom').forEach(a => {
  a.addEventListener('click', () => {
    const collapse = document.getElementById('navMenu');
    const bsCollapse = bootstrap.Collapse.getInstance(collapse);
    if (bsCollapse) bsCollapse.hide();
  });
});

/* ---- Reveal on scroll ---- */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ---- Embers / Sparks Canvas ---- */
(function initEmbers() {
  const canvas = document.getElementById('embers-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const MAX = 55;
  const particles = [];

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    return {
      x: rand(0, canvas.width),
      y: rand(canvas.height * 0.4, canvas.height),
      vx: rand(-0.4, 0.4),
      vy: rand(-1.2, -0.3),
      size: rand(1, 2.8),
      life: 0,
      maxLife: rand(100, 220),
      hue: rand(40, 55),
    };
  }

  while (particles.length < MAX) particles.push(createParticle());

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.life++;
      p.x += p.vx + Math.sin(p.life * 0.04) * 0.3;
      p.y += p.vy;
      const t = p.life / p.maxLife;
      const alpha = t < 0.2 ? t / 0.2 : t > 0.75 ? 1 - (t - 0.75) / 0.25 : 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (1 - t * 0.4), 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${alpha * 0.55})`;
      ctx.fill();
      if (p.life >= p.maxLife || p.y < -10) particles[i] = createParticle();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ---- Gallery ---- */
const imageFiles = [
  // Añade aquí los nombres de archivo de tus imágenes:
  // 'escenarios/campamento.png',
  // 'escenarios/poblado.png',
];

const grid = document.getElementById('galleryGrid');
if (grid && imageFiles.length > 0) {
  grid.innerHTML = '';
  imageFiles.forEach(filename => {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-md-4 col-lg-3';
    col.innerHTML = `
      <div class="gallery-item">
        <img src="recursos_imagenes/${filename}" alt="${filename}" loading="lazy" />
        <div class="gallery-item-overlay">
          <span class="gallery-item-label">${filename.replace(/\.[^/.]+$/, '').replace(/_/g, ' ').split('/').pop()}</span>
        </div>
      </div>
    `;
    grid.appendChild(col);
  });
}

/* ---- Active nav highlight on scroll ---- */
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-link-custom');

const activeObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.style.color = '');
      const match = document.querySelector(`.nav-link-custom[href="#${e.target.id}"]`);
      if (match) match.style.color = 'var(--c-gold-lt)';
    }
  });
}, { threshold: 0.3 });

sections.forEach(s => activeObs.observe(s));
