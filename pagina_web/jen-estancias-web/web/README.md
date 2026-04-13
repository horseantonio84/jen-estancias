# 🌐 Página Web del Proyecto — JEN Estancias 2025

Propuesta técnica digital del cortometraje *Las Navas de Tolosa 1212*,  
generado íntegramente con Inteligencia Artificial.

**Cliente:** Museo de la Batalla de las Navas de Tolosa · Diputación de Jaén  
**Equipo:** Jose Antonio Fernández · Elisabeth Ruffolo · Néstor Fernández  
**Empresa:** Tactileventos Digital 3D  

---

## 📁 Estructura de archivos

```
web/
├── index.html                  ← Página principal
├── css/
│   └── styles.css              ← Todos los estilos (CSS puro)
├── js/
│   └── main.js                 ← Toda la interactividad (JS vanilla)
├── recursos_imagenes/          ← Carpeta para imágenes generadas con IA
└── README.md                   ← Este archivo
```

---

## 🖼️ Cómo añadir imágenes a la galería

1. Copia tus imágenes en `recursos_imagenes/`
2. Abre `js/main.js`
3. Localiza el array `imageFiles` al principio del archivo
4. Añade los nombres de tus archivos:

```js
const imageFiles = [
  'batalla_01.jpg',
  'caballero_cristiano.png',
  'ejercito_almohade.jpg',
  // ...
];
```

La galería se construye automáticamente con lightbox incluido.

---

## 📄 Secciones de la web

| Ref | Sección | Contenido |
|-----|---------|-----------|
| 001 | El Proyecto | Descripción, ficha técnica y estadísticas |
| 002 | Propuesta Técnica | Enfoque, entregables y alineación con objetivos del Museo |
| 003 | Fases de Ejecución | Timeline metodológico del proyecto |
| 004 | Herramientas Empleadas | Arsenal tecnológico IA + tabla resumen |
| 005 | Propuesta Económica | Presupuesto desglosado + contrato + documentos |
| 006 | Galería | Imágenes generadas con IA |
| 007 | Equipo | Fichas del equipo + empresa de estancias |

---

## 🛠️ Tecnologías web

- HTML5 semántico
- CSS3 (variables, grid, flexbox, animaciones CSS puras)
- JavaScript ES6+ vanilla (sin dependencias externas)
- Google Fonts: Cinzel + Crimson Pro + JetBrains Mono
- Sin frameworks, sin npm, sin build — abre directamente en el navegador

---

## 🔗 Recursos del proyecto

- Repositorio: https://github.com/horseantonio84/jen-estancias
- Informe de Investigación: `/Informe De Investigación.pdf`
- Informe Lluvia de Ideas: `/Informe Lluvia de Ideas.pdf`
- Guion: `/guion/`
- Imágenes IA: `/recursos_imagenes/`
- Registros: `/registro_asistencia/`
