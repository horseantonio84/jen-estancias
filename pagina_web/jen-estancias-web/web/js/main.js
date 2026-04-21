/* =============================================
   NAVAS DE TOLOSA 1212 — Main JS
   JEN Estancias · 2026
   ============================================= */

/* ---- Navbar scroll ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ---- Close mobile nav on link click ---- */
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
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

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

/* ---- Embers / Sparks Canvas ---- */
(function initEmbers() {
  const canvas = document.getElementById('embers-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize, { passive: true });
  const MAX = 55, particles = [];
  function rand(min, max) { return Math.random() * (max - min) + min; }
  function createParticle() {
    return { x: rand(0, canvas.width), y: rand(canvas.height * 0.4, canvas.height),
      vx: rand(-0.4, 0.4), vy: rand(-1.2, -0.3), size: rand(1, 2.8),
      life: 0, maxLife: rand(100, 220), hue: rand(40, 55) };
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
    ]
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
    ]
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
    ]
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
      { file: 'PrimerPlanoCaraLadoIzquierdoNiño.png',    label: 'Cara — Izquierda'   },
      { file: 'planoDesdeAtrasCuerpoEnteroNiño.png',      label: 'Vista Trasera'      },
    ]
  },
  {
    icon: '🗡️', name: 'Rodrigo', role: 'El Protagonista',
    desc: 'Protagonista del cortometraje. Soldado castellano cuya historia personal entrelaza los grandes eventos de la batalla con la vida cotidiana del pueblo.',
    folder: 'recursos_imagenes/personajes/Rodrigo_protagonista',
    images: [
      { file: 'Rodrigo_planoCuerpo.png', label: 'Cuerpo'            },
      { file: 'Rodrigo_planoCara.png',   label: 'Primer Plano Cara' },
    ]
  },
  {
    icon: '📜', name: 'Hernando', role: 'El Narrador',
    desc: 'Narrador de la historia. Voz y presencia que guía al espectador a través de los eventos de la Batalla de las Navas de Tolosa.',
    folder: 'recursos_imagenes/personajes/Hernando_narrador',
    images: [
      { file: 'NarradorDeFrente-SinFondo.png',           label: 'Cuerpo — Frontal'       },
      { file: 'NarradorCaraDeFrente.png',                label: 'Cara — Frontal'         },
      { file: 'NarradorDeLado-SinFondo.png',             label: 'Cuerpo — Lateral'       },
      { file: 'NarradorCaraDeLado.png',                  label: 'Cara — Lateral'         },
      { file: 'NarradorDelLadoContrario-SinFondo.png',   label: 'Cuerpo — Lado Contrario'},
      { file: 'NarradorCaraDelLadoContrario.png',        label: 'Cara — Lado Contrario'  },
      { file: 'NarradorDeEspaldas-SinFondo.png',         label: 'Vista Trasera'          },
    ]
  },
  {
    icon: '👒', name: 'Pascasia', role: 'La Esposa',
    desc: 'Personaje secundario. Esposa del protagonista, representa la vida en la retaguardia y el sacrificio del pueblo castellano durante la contienda.',
    folder: 'recursos_imagenes/personajes/Pascasia_esposa',
    images: [
      { file: 'EsposaDeFrente-removebg-preview.png',             label: 'Cuerpo — Frontal'       },
      { file: 'EsposaCaraDeFrente.png',                          label: 'Cara — Frontal'         },
      { file: 'EsposaDeLado-removebg-preview.png',               label: 'Cuerpo — Lateral'       },
      { file: 'EsposaCaraDeLado-removebg-preview.png',           label: 'Cara — Lateral'         },
      { file: 'EsposaDelLadoContrario-removebg-preview.png',     label: 'Cuerpo — Lado Contrario'},
      { file: 'EsposaCaraDeLLadoCntrario-removebg-preview.png',  label: 'Cara — Lado Contrario'  },
      { file: 'EsposaDeEspaldas-removebg-preview.png',           label: 'Vista Trasera'          },
    ]
  },
  {
    icon: '👑', name: 'Sancho VII', role: 'Rey de Navarra',
    desc: 'Rey de Navarra aliado en la batalla. Figura histórica clave en la coalición cristiana que derrotó al ejército almohade en Las Navas de Tolosa.',
    folder: 'recursos_imagenes/personajes/Sancho_VII',
    images: [
      { file: 'SanchoVII_planoFrontal_corporal.png',          label: 'Cuerpo — Frontal'   },
      { file: 'SanchoVII_planoCara_frontal.png',              label: 'Cara — Frontal'     },
      { file: 'SanchoVII_planoLateral_derecho_corporal.png',  label: 'Cuerpo — Derecho'   },
      { file: 'SanchoVII_planoCara_Lateral_derecho.png',      label: 'Cara — Derecha'     },
      { file: 'SanchoVII_planoLateral_izquierda_corporal.png',label: 'Cuerpo — Izquierdo' },
      { file: 'SanchoVII_planoCara_Lateral_izquiera.png',     label: 'Cara — Izquierda'   },
      { file: 'SanchoVII_planoLateral_trasero_corporal.png',  label: 'Vista Trasera'      },
    ]
  },
  {
    icon: '⚜️', name: 'Pedro II', role: 'Rey de Aragón',
    desc: 'Rey de Aragón, aliado cristiano en la coalición. Figura decisiva en la victoria de Las Navas de Tolosa junto a Alfonso VIII y Sancho VII.',
    folder: 'recursos_imagenes/personajes/PEDRO_II',
    images: [
      { file: 'PedroIIDeFrente-removebg-preview.png',              label: 'Cuerpo — Frontal'       },
      { file: 'PedroIICaraDeFrente-removebg-preview.png',          label: 'Cara — Frontal'         },
      { file: 'PedroIIDeLado-removebg-preview.png',                label: 'Cuerpo — Lateral'       },
      { file: 'PedroIICaraDeLado-removebg-preview.png',            label: 'Cara — Lateral'         },
      { file: 'PedroIIDeLadoContrario-removebg-preview.png',       label: 'Cuerpo — Lado Contrario'},
      { file: 'PedroIICaraDelLadoContrario-removebg-preview.png',  label: 'Cara — Lado Contrario'  },
      { file: 'PedroIIDeEspaldas-removebg-preview.png',            label: 'Vista Trasera'          },
    ]
  },
  {
    icon: '☪️', name: 'Muhammad al-Nasir', role: 'Rey Musulmán',
    desc: 'Califa almohade, antagonista principal. Comandó el ejército musulmán en la Batalla de las Navas de Tolosa, en uno de los enfrentamientos más decisivos de la Reconquista.',
    folder: 'recursos_imagenes/personajes/Muhammad_al-Nasir_Rey_Musulman',
    images: [
      { file: 'planoCuerpoEnteroDeFrenteReyMusulman.png',  label: 'Cuerpo — Frontal'   },
      { file: 'planoCaraReyMusulman.png',                  label: 'Cara — Frontal'     },
      { file: 'planoCuerpoLadoDerechoReyMusulman.png',     label: 'Cuerpo — Derecho'   },
      { file: 'planoCaraLadoDerechoReyMusulman.png',       label: 'Cara — Derecha'     },
      { file: 'planoCuerpoLadoIzquierdoReyMusulman.png',   label: 'Cuerpo — Izquierdo' },
      { file: 'planoCaraLadoIzquierdoReyMusulman.png',     label: 'Cara — Izquierda'   },
      { file: 'planoAtrasReyMusulman.png',                 label: 'Vista Trasera'      },
    ]
  },
  {
    icon: '🌙', name: 'Hassan Ibn Muhammad', role: 'Soldado Musulmán',
    desc: 'Soldado del ejército almohade. Contrapunto al soldado cristiano, representa la perspectiva del bando antagonista durante la batalla.',
    folder: 'recursos_imagenes/personajes/Hassan_Ibn_Muhammad_soldado_musulman',
    images: [
      { file: 'planoCuerpoEnteroFrenteMoro.png',          label: 'Cuerpo — Frontal'   },
      { file: 'primerPlanoCaraDeFrenteMoro.png',          label: 'Cara — Frontal'     },
      { file: 'planoCuerpoEnteroLadoDerechoMoro.png',     label: 'Cuerpo — Derecho'   },
      { file: 'primerPlanoCaraLadoDerechoMoro.png',       label: 'Cara — Derecha'     },
      { file: 'planoCuerpoEnteroLadoIzquierdoMoro.png',   label: 'Cuerpo — Izquierdo' },
      { file: 'primerPlanoCaraLadoIzquierdoMoro.png',     label: 'Cara — Izquierda'   },
      { file: 'planoCuerpoEnteroAtrasMoro.png',           label: 'Vista Trasera'      },
    ]
  },
];

function buildCharacterHTML(char) {
  const imgs = char.images.map(img => {
    const src = `${char.folder}/${img.file}`;
    return `
      <div class="col-6 col-sm-4 col-md-3">
        <div class="gallery-item gallery-item--portrait lightbox-trigger" data-src="${src}" data-alt="${char.name} — ${img.label}">
          <img src="${src}" alt="${char.name} — ${img.label}" loading="lazy" />
          <div class="gallery-item-overlay"><span class="gallery-item-label">${img.label}</span></div>
        </div>
      </div>`;
  }).join('');

  return `
    <div class="personaje-bloque">
      <div class="personaje-bloque-header">
        <div class="personaje-bloque-icon">${char.icon}</div>
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

/* ---- Gallery Tabs ---- */
(function () {
  const tabBtns = document.querySelectorAll('.gallery-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-bs-target');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('show', 'active'));
      btn.classList.add('active');
      const pane = document.querySelector(target);
      if (pane) pane.classList.add('show', 'active');

      // Asignar lightbox-trigger a elementos recién visibles
      pane && pane.querySelectorAll('.gallery-item:not(.lightbox-trigger)').forEach(el => {
        const imgEl = el.querySelector('img');
        if (!imgEl) return;
        el.classList.add('lightbox-trigger');
        el.dataset.src = imgEl.src;
        el.dataset.alt = imgEl.alt || '';
      });
    });
  });

  // Lightbox-trigger en el pane activo inicial
  document.querySelectorAll('.tab-pane.active .gallery-item:not(.lightbox-trigger)').forEach(el => {
    const imgEl = el.querySelector('img');
    if (!imgEl) return;
    el.classList.add('lightbox-trigger');
    el.dataset.src = imgEl.src;
    el.dataset.alt = imgEl.alt || '';
  });
})();

/* ---- Lightbox ---- */
(function () {
  const overlay  = document.getElementById('lightbox-overlay');
  const img      = document.getElementById('lightbox-img');
  const caption  = document.getElementById('lightbox-caption');
  const btnClose = document.getElementById('lightbox-close');
  const btnPrev  = document.getElementById('lightbox-prev');
  const btnNext  = document.getElementById('lightbox-next');
  let items = [], current = 0;

  function show() {
    const el  = items[current];
    const src = el.dataset.src || el.querySelector('img').src;
    const alt = el.dataset.alt || el.querySelector('img').alt || '';
    img.src = src; img.alt = alt; caption.textContent = alt;
    btnPrev.style.opacity = items.length > 1 ? '1' : '0.3';
    btnNext.style.opacity = items.length > 1 ? '1' : '0.3';
  }

  function open(index, siblings) {
    items = siblings; current = index;
    show();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('open');
    img.src = '';
    document.body.style.overflow = '';
  }

  function prev() { current = (current - 1 + items.length) % items.length; show(); }
  function next() { current = (current + 1) % items.length; show(); }

  document.addEventListener('click', e => {
    const trigger = e.target.closest('.lightbox-trigger');
    if (!trigger) return;
    const bloque   = trigger.closest('.personaje-bloque, .tab-pane');
    const siblings = bloque ? [...bloque.querySelectorAll('.lightbox-trigger')] : [trigger];
    const index    = siblings.indexOf(trigger);
    open(index >= 0 ? index : 0, siblings);
  });

  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', e => { e.stopPropagation(); prev(); });
  btnNext.addEventListener('click', e => { e.stopPropagation(); next(); });

  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // cursor pointer en todos los items
  document.querySelectorAll('.gallery-item').forEach(el => { el.style.cursor = 'zoom-in'; });
})();
