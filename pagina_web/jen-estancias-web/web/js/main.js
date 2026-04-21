/* =============================================
   NAVAS DE TOLOSA 1212 — Main JS
   JEN Estancias · 2026
   ============================================= */

'use strict';

/* ============================================
   CONSTANTES DE ACCESIBILIDAD
   Selector estándar de elementos que pueden
   recibir el foco mediante teclado.
   ============================================ */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/* ---- Detectar preferencia de movimiento reducido ---- */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- Navbar scroll ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ---- Cerrar menú móvil al hacer clic en un enlace ---- */
document.querySelectorAll('.nav-link-custom').forEach(a => {
  a.addEventListener('click', () => {
    const collapse   = document.getElementById('navMenu');
    const bsCollapse = bootstrap.Collapse.getInstance(collapse);
    if (bsCollapse) bsCollapse.hide();
  });
});

/* ============================================
   REVEAL ON SCROLL
   ============================================ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ============================================
   ARIA-CURRENT EN NAVEGACIÓN — WCAG 2.4.8
   Informa al lector de pantalla qué sección
   está activa según el scroll del usuario.
   ============================================ */
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-link-custom');

const activeObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;

    // Limpiar estado anterior
    navLinks.forEach(a => {
      a.removeAttribute('aria-current');
      a.style.color = '';
    });

    // Marcar enlace activo con aria-current
    const match = document.querySelector(`.nav-link-custom[href="#${e.target.id}"]`);
    if (match) {
      match.setAttribute('aria-current', 'true');
      // El color lo gestiona CSS con el selector [aria-current="true"]
    }
  });
}, { threshold: 0.3 });

sections.forEach(s => activeObs.observe(s));

/* ============================================
   EMBERS / SPARKS CANVAS
   Se omite si el usuario tiene activada la
   preferencia de movimiento reducido.
   ============================================ */
(function initEmbers() {
  const canvas = document.getElementById('embers-canvas');
  if (!canvas) return;

  // Respetar prefers-reduced-motion (WCAG 2.3.3)
  if (prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  function resize() {
    canvas.width  = canvas.offsetWidth;
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
      const t     = p.life / p.maxLife;
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

/* ============================================
   GALERÍA — Datos y renderizado de personajes
   ============================================ */
const CHARACTERS = [
  {
    icon: '👑', name: 'Alfonso VIII', role: 'Rey de Castilla',
    desc: 'Personaje principal. Generado con IA a partir de documentación histórica sobre indumentaria, armas y rasgos físicos del rey castellano en la Batalla de las Navas de Tolosa (1212).',
    folder: 'recursos_imagenes/personajes/Alfonso_VIII',
    images: [
      { file: 'PlanoFrontalCuerpo.png',    label: 'Cuerpo — Frontal'    },
      { file: 'PlanoFrontalCara.png',      label: 'Cara — Frontal'      },
      { file: 'PlanoDerechoCuerpo.png',    label: 'Cuerpo — Derecho'    },
      { file: 'PlanoDerechoCara.png',      label: 'Cara — Derecha'      },
      { file: 'PlanoIzquierdoCuerpo.png',  label: 'Cuerpo — Izquierdo'  },
      { file: 'PlanoIzquierdoCara.png',    label: 'Cara — Izquierda'    },
      { file: 'PlanoTrasero.png',          label: 'Vista Trasera'       },
    ],
  },
  {
    icon: '⚔️', name: 'Esteban', role: 'Soldado 1',
    desc: 'Soldado cristiano de la hueste castellana. Modelado con IA con rigor histórico en armamento e indumentaria medieval.',
    folder: 'recursos_imagenes/personajes/Esteban_soldado1',
    images: [
      { file: 'PlanoCuerpoEnteroSoldado1.png',              label: 'Cuerpo — Frontal'   },
      { file: 'PrimerPlanoCaraSoldado1.png',                label: 'Cara — Frontal'     },
      { file: 'PlanoCuerpoEnteroLadoDerechoSoldado1.png',   label: 'Cuerpo — Derecho'   },
      { file: 'PrimerPlanoCaraDerechoSoldado1.png',         label: 'Cara — Derecha'     },
      { file: 'PlanoCuerpoEnteroLadoIzquierdoSoldado1.png', label: 'Cuerpo — Izquierdo' },
      { file: 'PrimerPlanoCaraIzquierdoSoldado1.png',       label: 'Cara — Izquierda'   },
      { file: 'PlanoEspaldaSoldado1.png',                   label: 'Vista Trasera'      },
    ],
  },
  {
    icon: '🛡️', name: 'Bautista', role: 'Soldado 2',
    desc: 'Segundo soldado cristiano del contingente castellano. Diseño complementario al de Esteban con variantes de plano y perspectiva.',
    folder: 'recursos_imagenes/personajes/Bautista_soldado2',
    images: [
      { file: 'PlanoFrontalSoldado.png',          label: 'Cuerpo — Frontal'   },
      { file: 'PrimerPlanoCaraSoldado.png',        label: 'Primer Plano Cara'  },
      { file: 'PlanoDerechoCuerpoSoldado.png',     label: 'Cuerpo — Derecho'   },
      { file: 'PlanoCaraDerechoSoldado.png',       label: 'Cara — Derecha'     },
      { file: 'PlanoIzqierdoCuerpoSoldado.png',    label: 'Cuerpo — Izquierdo' },
      { file: 'PlanoCaraIzquierdoSoldado.png',     label: 'Cara — Izquierda'   },
      { file: 'PlanoAtrasSoldadoCuerpoEntero.png', label: 'Vista Trasera'      },
    ],
  },
  {
    icon: '👦', name: 'Fernando', role: 'El Niño',
    desc: 'Personaje secundario. Hijo del protagonista, representa la esperanza y la continuidad del pueblo castellano ante la Reconquista.',
    folder: 'recursos_imagenes/personajes/Fernando_hijo',
    images: [
      { file: 'planoCuerpoDeFrenteNiño.png',              label: 'Cuerpo — Frontal'   },
      { file: 'primerPlanoCaraNiño.png',                  label: 'Cara — Frontal'     },
      { file: 'planoCuerpoEnteroDerechaNiño.png',         label: 'Cuerpo — Derecho'   },
      { file: 'primerPlanoCaraLadoDerechoNiño.png',       label: 'Cara — Derecha'     },
      { file: 'planoCuerpoIzquierdoNiño.png',             label: 'Cuerpo — Izquierdo' },
      { file: 'PrimerPlanoCaraLadoIzquierdoNiño.png',     label: 'Cara — Izquierda'   },
      { file: 'planoDesdeAtrasCuerpoEnteroNiño.png',      label: 'Vista Trasera'      },
    ],
  },
  {
    icon: '🗡️', name: 'Rodrigo', role: 'El Protagonista',
    desc: 'Protagonista del cortometraje. Soldado castellano cuya historia personal entrelaza los grandes eventos de la batalla con la vida cotidiana del pueblo.',
    folder: 'recursos_imagenes/personajes/Rodrigo_protagonista',
    images: [
      { file: 'Rodrigo_planoCuerpo.png', label: 'Cuerpo'            },
      { file: 'Rodrigo_planoCara.png',   label: 'Primer Plano Cara' },
    ],
  },
  {
    icon: '📜', name: 'Hernando', role: 'El Narrador',
    desc: 'Narrador de la historia. Voz y presencia que guía al espectador a través de los eventos de la Batalla de las Navas de Tolosa.',
    folder: 'recursos_imagenes/personajes/Hernando_narrador',
    images: [
      { file: 'NarradorDeFrente-SinFondo.png',           label: 'Cuerpo — Frontal'        },
      { file: 'NarradorCaraDeFrente.png',                label: 'Cara — Frontal'          },
      { file: 'NarradorDeLado-SinFondo.png',             label: 'Cuerpo — Lateral'        },
      { file: 'NarradorCaraDeLado.png',                  label: 'Cara — Lateral'          },
      { file: 'NarradorDelLadoContrario-SinFondo.png',   label: 'Cuerpo — Lado Contrario' },
      { file: 'NarradorCaraDelLadoContrario.png',        label: 'Cara — Lado Contrario'   },
      { file: 'NarradorDeEspaldas-SinFondo.png',         label: 'Vista Trasera'           },
    ],
  },
  {
    icon: '👒', name: 'Pascasia', role: 'La Esposa',
    desc: 'Personaje secundario. Esposa del protagonista, representa la vida en la retaguardia y el sacrificio del pueblo castellano durante la contienda.',
    folder: 'recursos_imagenes/personajes/Pascasia_esposa',
    images: [
      { file: 'EsposaDeFrente-removebg-preview.png',             label: 'Cuerpo — Frontal'        },
      { file: 'EsposaCaraDeFrente.png',                          label: 'Cara — Frontal'          },
      { file: 'EsposaDeLado-removebg-preview.png',               label: 'Cuerpo — Lateral'        },
      { file: 'EsposaCaraDeLado-removebg-preview.png',           label: 'Cara — Lateral'          },
      { file: 'EsposaDelLadoContrario-removebg-preview.png',     label: 'Cuerpo — Lado Contrario' },
      { file: 'EsposaCaraDeLLadoCntrario-removebg-preview.png',  label: 'Cara — Lado Contrario'   },
      { file: 'EsposaDeEspaldas-removebg-preview.png',           label: 'Vista Trasera'           },
    ],
  },
  {
    icon: '👑', name: 'Sancho VII', role: 'Rey de Navarra',
    desc: 'Rey de Navarra aliado en la batalla. Figura histórica clave en la coalición cristiana que derrotó al ejército almohade en Las Navas de Tolosa.',
    folder: 'recursos_imagenes/personajes/Sancho_VII',
    images: [
      { file: 'SanchoVII_planoFrontal_corporal.png',           label: 'Cuerpo — Frontal'   },
      { file: 'SanchoVII_planoCara_frontal.png',               label: 'Cara — Frontal'     },
      { file: 'SanchoVII_planoLateral_derecho_corporal.png',   label: 'Cuerpo — Derecho'   },
      { file: 'SanchoVII_planoCara_Lateral_derecho.png',       label: 'Cara — Derecha'     },
      { file: 'SanchoVII_planoLateral_izquierda_corporal.png', label: 'Cuerpo — Izquierdo' },
      { file: 'SanchoVII_planoCara_Lateral_izquiera.png',      label: 'Cara — Izquierda'   },
      { file: 'SanchoVII_planoLateral_trasero_corporal.png',   label: 'Vista Trasera'      },
    ],
  },
  {
    icon: '⚜️', name: 'Pedro II', role: 'Rey de Aragón',
    desc: 'Rey de Aragón, aliado cristiano en la coalición. Figura decisiva en la victoria de Las Navas de Tolosa junto a Alfonso VIII y Sancho VII.',
    folder: 'recursos_imagenes/personajes/PEDRO_II',
    images: [
      { file: 'PedroIIDeFrente-removebg-preview.png',             label: 'Cuerpo — Frontal'        },
      { file: 'PedroIICaraDeFrente-removebg-preview.png',         label: 'Cara — Frontal'          },
      { file: 'PedroIIDeLado-removebg-preview.png',               label: 'Cuerpo — Lateral'        },
      { file: 'PedroIICaraDeLado-removebg-preview.png',           label: 'Cara — Lateral'          },
      { file: 'PedroIIDeLadoContrario-removebg-preview.png',      label: 'Cuerpo — Lado Contrario' },
      { file: 'PedroIICaraDelLadoContrario-removebg-preview.png', label: 'Cara — Lado Contrario'   },
      { file: 'PedroIIDeEspaldas-removebg-preview.png',           label: 'Vista Trasera'           },
    ],
  },
  {
    icon: '☪️', name: 'Muhammad an-Nasir', role: 'Rey Musulmán',
    desc: 'Califa almohade, antagonista principal. Comandó el ejército musulmán en la Batalla de las Navas de Tolosa, en uno de los enfrentamientos más decisivos de la Reconquista.',
    folder: 'recursos_imagenes/personajes/Muhammad_an-Nasir_Rey_Musulman',
    images: [
      { file: 'planoCuerpoEnteroDeFrenteReyMusulman.png',  label: 'Cuerpo — Frontal'   },
      { file: 'planoCaraReyMusulman.png',                  label: 'Cara — Frontal'     },
      { file: 'planoCuerpoLadoDerechoReyMusulman.png',     label: 'Cuerpo — Derecho'   },
      { file: 'planoCaraLadoDerechoReyMusulman.png',       label: 'Cara — Derecha'     },
      { file: 'planoCuerpoLadoIzquierdoReyMusulman.png',   label: 'Cuerpo — Izquierdo' },
      { file: 'planoCaraLadoIzquierdoReyMusulman.png',     label: 'Cara — Izquierda'   },
      { file: 'planoAtrasReyMusulman.png',                 label: 'Vista Trasera'      },
    ],
  },
  {
    icon: '🌙', name: 'Hassan Ibn Muhammad', role: 'Soldado Musulmán',
    desc: 'Soldado del ejército almohade. Contrapunto al soldado cristiano, representa la perspectiva del bando antagonista durante la batalla.',
    folder: 'recursos_imagenes/personajes/Hassan_Ibn_Muhammad_soldado_musulman',
    images: [
      { file: 'planoCuerpoEnteroFrenteMoro.png',         label: 'Cuerpo — Frontal'   },
      { file: 'primerPlanoCaraDeFrenteMoro.png',         label: 'Cara — Frontal'     },
      { file: 'planoCuerpoEnteroLadoDerechoMoro.png',    label: 'Cuerpo — Derecho'   },
      { file: 'primerPlanoCaraLadoDerechoMoro.png',      label: 'Cara — Derecha'     },
      { file: 'planoCuerpoEnteroLadoIzquierdoMoro.png',  label: 'Cuerpo — Izquierdo' },
      { file: 'primerPlanoCaraLadoIzquierdoMoro.png',    label: 'Cara — Izquierda'   },
      { file: 'planoCuerpoEnteroAtrasMoro.png',          label: 'Vista Trasera'      },
    ],
  },
];

/* ============================================
   RENDERIZADO DE PERSONAJES
   Los emojis decorativos llevan aria-hidden="true"
   para que los lectores de pantalla no los anuncien.
   ============================================ */
function buildCharacterHTML(char) {
  const imgs = char.images.map(img => {
    const src = `${char.folder}/${img.file}`;
    const alt = `${char.name} — ${img.label}`;
    return `
      <div class="col-6 col-sm-4 col-md-3">
        <div class="gallery-item gallery-item--portrait lightbox-trigger"
             data-src="${src}"
             data-alt="${alt}">
          <img src="${src}" alt="${alt}" loading="lazy" />
          <div class="gallery-item-overlay" aria-hidden="true">
            <span class="gallery-item-label">${img.label}</span>
          </div>
        </div>
      </div>`;
  }).join('');

  return `
    <div class="personaje-bloque">
      <div class="personaje-bloque-header">
        <div class="personaje-bloque-icon" aria-hidden="true">${char.icon}</div>
        <div>
          <h3 class="personaje-bloque-nombre">${char.name} <em>— ${char.role}</em></h3>
          <p class="personaje-bloque-desc">${char.desc}</p>
        </div>
      </div>
      <div class="row g-3">${imgs}</div>
    </div>`;
}

const panePersonajes = document.getElementById('pane-personajes');
if (panePersonajes) {
  panePersonajes.innerHTML = CHARACTERS.map(buildCharacterHTML).join('');
}

/* ============================================
   ACCESIBILIDAD EN ITEMS DE GALERÍA — WCAG 2.1.1
   Los .gallery-item son <div> y por defecto no
   son accesibles por teclado. Este módulo:
   1. Añade role="button" y tabindex="0"
   2. Añade aria-label desde el alt de la imagen
   3. El manejador de teclado (Enter/Espacio)
      se gestiona en el bloque del lightbox.
   ============================================ */
function initGalleryItemA11y() {
  document.querySelectorAll('.gallery-item').forEach(el => {
    // Evitar doble inicialización
    if (el.hasAttribute('data-a11y-init')) return;

    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.style.cursor = 'zoom-in';

    const imgEl = el.querySelector('img');
    const label = imgEl?.getAttribute('alt') || el.dataset.alt || '';
    if (label) {
      el.setAttribute('aria-label', `${label} — Ver imagen ampliada`);
    }

    el.setAttribute('data-a11y-init', 'true');
  });
}

/* Inicialización inicial (pane activo) */
initGalleryItemA11y();

/* ============================================
   GALLERY TABS
   Mantiene sincronizado aria-selected al cambiar
   de pestaña, conforme al patrón ARIA Authoring
   Practices Guide (APG) para Tab Panels.
   ============================================ */
(function initGalleryTabs() {
  const tabBtns  = document.querySelectorAll('.gallery-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSelector = btn.getAttribute('data-bs-target');

      /* Actualizar estado de todas las pestañas */
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      /* Ocultar todos los paneles */
      tabPanes.forEach(p => p.classList.remove('show', 'active'));

      /* Activar pestaña y panel seleccionados */
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const pane = document.querySelector(targetSelector);
      if (!pane) return;
      pane.classList.add('show', 'active');

      /*
        Asignar lightbox-trigger a items recién visibles
        y ejecutar la inicialización de accesibilidad
        (los personajes se generan dinámicamente).
      */
      pane.querySelectorAll('.gallery-item:not(.lightbox-trigger)').forEach(el => {
        const imgEl = el.querySelector('img');
        if (!imgEl) return;
        el.classList.add('lightbox-trigger');
        el.dataset.src = imgEl.src;
        el.dataset.alt = imgEl.alt || '';
      });

      initGalleryItemA11y();
    });
  });

  /* Lightbox-trigger en el pane activo inicial */
  document.querySelectorAll('.tab-pane.active .gallery-item:not(.lightbox-trigger)').forEach(el => {
    const imgEl = el.querySelector('img');
    if (!imgEl) return;
    el.classList.add('lightbox-trigger');
    el.dataset.src = imgEl.src;
    el.dataset.alt = imgEl.alt || '';
  });
})();

/* ============================================
   LIGHTBOX — Gestión completa de accesibilidad
   ============================================

   Implementa el patrón ARIA "Dialog (Modal)":
   https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

   Al abrirse:
   - Mueve el foco al botón de cerrar.
   - Oculta el resto de la página con aria-hidden.
   - Activa la trampa de foco (Tab / Shift+Tab).

   Al cerrarse:
   - Restaura aria-hidden en la página.
   - Devuelve el foco al elemento que lo activó.

   Teclado:
   - Escape → cerrar
   - ← → → navegar entre imágenes
   - Tab / Shift+Tab → trampa de foco
   - Enter / Espacio en .gallery-item → abrir
*/
(function initLightbox() {
  const overlay  = document.getElementById('lightbox-overlay');
  const img      = document.getElementById('lightbox-img');
  const caption  = document.getElementById('lightbox-caption');
  const btnClose = document.getElementById('lightbox-close');
  const btnPrev  = document.getElementById('lightbox-prev');
  const btnNext  = document.getElementById('lightbox-next');

  /* Elementos de la página que se ocultarán a lectores de pantalla cuando el modal esté abierto */
  const pageRegions = [
    document.getElementById('navbar'),
    document.querySelector('main'),
    document.querySelector('footer'),
  ].filter(Boolean);

  let items    = [];
  let current  = 0;
  let openerEl = null; // Elemento que activó el lightbox — recibirá el foco al cerrar

  /* ---- Actualizar imagen y caption ---- */
  function showCurrent() {
    const el  = items[current];
    const src = el.dataset.src || el.querySelector('img')?.src || '';
    const alt = el.dataset.alt || el.querySelector('img')?.alt || '';

    img.src = src;
    img.alt = alt;
    caption.textContent = alt;

    /* Opacidad de los botones de navegación cuando solo hay un item */
    const multiItem = items.length > 1;
    btnPrev.style.opacity       = multiItem ? '1' : '0.3';
    btnNext.style.opacity       = multiItem ? '1' : '0.3';
    btnPrev.disabled            = !multiItem;
    btnNext.disabled            = !multiItem;
    btnPrev.setAttribute('aria-hidden', String(!multiItem));
    btnNext.setAttribute('aria-hidden', String(!multiItem));
  }

  /* ---- Abrir lightbox ---- */
  function openLightbox(index, siblings, opener) {
    items    = siblings;
    current  = index;
    openerEl = opener || null;

    showCurrent();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    /* Ocultar regiones de la página a tecnologías asistivas */
    pageRegions.forEach(el => el.setAttribute('aria-hidden', 'true'));

    /* Mover el foco al botón de cerrar */
    requestAnimationFrame(() => btnClose.focus());

    /* Activar escucha de teclado del lightbox */
    document.addEventListener('keydown', handleLightboxKeydown);
  }

  /* ---- Cerrar lightbox ---- */
  function closeLightbox() {
    overlay.classList.remove('open');

    /* Limpiar imagen para liberar memoria y evitar flash al volver a abrir */
    img.src = '';
    img.alt = '';

    document.body.style.overflow = '';

    /* Restaurar visibilidad de la página */
    pageRegions.forEach(el => el.removeAttribute('aria-hidden'));

    /* Desactivar escucha de teclado del lightbox */
    document.removeEventListener('keydown', handleLightboxKeydown);

    /* Devolver el foco al elemento activador */
    if (openerEl) {
      openerEl.focus();
      openerEl = null;
    }
  }

  function prevImage() { current = (current - 1 + items.length) % items.length; showCurrent(); }
  function nextImage() { current = (current + 1) % items.length; showCurrent(); }

  /* ---- Trampa de foco + navegación por teclado ---- */
  function handleLightboxKeydown(e) {
    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;

      case 'ArrowLeft':
        prevImage();
        break;

      case 'ArrowRight':
        nextImage();
        break;

      /*
        Trampa de foco: mantiene la navegación Tab / Shift+Tab
        dentro del overlay mientras el lightbox está abierto.
      */
      case 'Tab': {
        const focusableEls = [...overlay.querySelectorAll(FOCUSABLE_SELECTOR)];
        if (!focusableEls.length) return;

        const first = focusableEls[0];
        const last  = focusableEls[focusableEls.length - 1];

        if (e.shiftKey) {
          /* Shift+Tab: si estamos en el primero, saltar al último */
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          /* Tab: si estamos en el último, saltar al primero */
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
        break;
      }
    }
  }

  /* ---- Abrir al hacer clic en un trigger ---- */
  document.addEventListener('click', e => {
    const trigger = e.target.closest('.lightbox-trigger');
    if (!trigger) return;

    const bloque   = trigger.closest('.personaje-bloque, .tab-pane');
    const siblings = bloque
      ? [...bloque.querySelectorAll('.lightbox-trigger')]
      : [trigger];
    const index = siblings.indexOf(trigger);

    openLightbox(index >= 0 ? index : 0, siblings, trigger);
  });

  /* ---- Abrir con teclado (Enter / Espacio en role="button") ---- */
  document.addEventListener('keydown', e => {
    /* Solo cuando el lightbox está cerrado */
    if (overlay.classList.contains('open')) return;

    if (e.key !== 'Enter' && e.key !== ' ') return;

    const trigger = document.activeElement?.closest('.lightbox-trigger');
    if (!trigger) return;

    e.preventDefault(); /* Prevenir scroll en Espacio */
    trigger.click();
  });

  /* ---- Cerrar al hacer clic en el fondo del overlay ---- */
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeLightbox();
  });

  /* ---- Botones de control ---- */
  btnClose.addEventListener('click', closeLightbox);
  btnPrev.addEventListener('click', e => { e.stopPropagation(); prevImage(); });
  btnNext.addEventListener('click', e => { e.stopPropagation(); nextImage(); });
})();

/* ============================================
   CONTADOR INCREMENTAL — stat-n
   Anima cada .stat-n desde 0 hasta su valor
   cuando la tarjeta entra en el viewport.
   ============================================ */
(function initCounters() {
  /* Si el usuario prefiere movimiento reducido, los valores ya son visibles */
  if (prefersReducedMotion) return;

  /**
   * Extrae el prefijo ("+"), sufijo ("%" etc.) y el número base
   * del texto de un elemento .stat-n
   */
  function parseValue(text) {
    const cleaned = text.trim();
    const prefix  = cleaned.match(/^[+\-]*/)?.[0] ?? '';
    const suffix  = cleaned.match(/[^0-9]+$/)?.[0]  ?? '';
    const num     = parseFloat(cleaned.replace(/[^0-9.]/g, ''));
    return { prefix, suffix, num: isNaN(num) ? 0 : num };
  }

  /**
   * Anima un único elemento con easing cuadrático.
   * @param {HTMLElement} el   – elemento a animar
   * @param {number} duration  – duración en ms
   */
  function animateCounter(el, duration = 1800) {
    const { prefix, suffix, num } = parseValue(el.textContent);
    /* Números enteros grandes (1212): sin decimales; porcentajes y pequeños: sin decimales también */
    const decimals = num % 1 !== 0 ? 1 : 0;

    let start = null;

    function step(ts) {
      if (!start) start = ts;
      const elapsed  = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      /* Ease-out cuadrático */
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = num * eased;

      el.textContent = prefix + current.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        /* Asegurar valor exacto al final */
        el.textContent = prefix + num.toFixed(decimals) + suffix;
        el.closest('.stat-mini')?.classList.remove('counting');
      }
    }

    el.closest('.stat-mini')?.classList.add('counting');
    requestAnimationFrame(step);
  }

  /* Guardar los textos originales en data-target para poder reanimar si necesario */
  document.querySelectorAll('.stat-n').forEach(el => {
    el.dataset.target = el.textContent.trim();
  });

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      /* Restaurar texto original por si el elemento fue re-observado */
      el.textContent = el.dataset.target;
      animateCounter(el, 1800);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.stat-n').forEach(el => counterObs.observe(el));
})();

/* ============================================
   HERO VIDEO — Carga diferida (lazy)
   El vídeo no descarga ningún byte hasta que
   el hero entra en el viewport del usuario.
   ============================================ */
(function initHeroVideo() {
  const video = document.getElementById('hero-video');
  if (!video) return;

  /* Si el usuario prefiere movimiento reducido, ocultar el vídeo */
  if (prefersReducedMotion) {
    video.remove();
    return;
  }

  const heroObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;

      /* Activar la carga del vídeo */
      video.preload = 'auto';
      video.load();

      video.addEventListener('canplay', () => {
        video.play().catch(() => { /* autoplay bloqueado: el poster se mantiene */ });
        /* Fade-in suave */
        video.classList.add('loaded');
      }, { once: true });

      /* Dejar de observar: solo se activa una vez */
      heroObs.unobserve(e.target);
    });
  }, { threshold: 0.1 });

  heroObs.observe(document.getElementById('hero'));
})();
