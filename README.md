# tecnipcmedellin.com

Sitio web de **TecniPC Medellín** — servicio técnico de computadores, soporte remoto
y armado de equipos a la medida.

Sitio estático: HTML, CSS y JavaScript. Sin dependencias, sin compilación, sin
servidor de aplicaciones. Se publica tal cual.

## Publicado con GitHub Pages

- Los archivos del sitio están en la raíz del repositorio, que es lo que Pages sirve.
- `CNAME` fija el dominio `tecnipcmedellin.com`.
- `.nojekyll` desactiva el procesamiento de Jekyll, que no hace falta y podría
  interferir con las carpetas de `assets`.

## Estructura

| Ruta | Qué es |
|---|---|
| `index.html` | Portada, con el panel de diagnóstico |
| `servicios.html` | Servicios agrupados y tiempos de entrega |
| `soporte-remoto.html` | Soporte remoto, alcance nacional |
| `armamos-tu-pc.html` | Los tres armados de referencia |
| `componentes.html` | Catálogo de repuestos |
| `contacto.html` | Formulario y datos directos |
| `404.html` | Página de error, autónoma (lleva su propio CSS) |
| `assets/css/estilos.css` | Toda la hoja de estilos, comentada por secciones |
| `assets/js/sitio.js` | Datos del negocio y comportamiento |
| `assets/img/` | Imágenes en WebP, en dos tamaños (`srcset`) |
| `LEEME.md` | **Guía de operación: qué editar y cómo** |

## Para editar

Los datos de contacto están en un solo objeto al principio de
[`assets/js/sitio.js`](assets/js/sitio.js). El resto está explicado en
[`LEEME.md`](LEEME.md).

## Verificado

- Sin desbordamiento horizontal de 320 a 2560 px, en las siete páginas.
- Contraste AA en todo el texto, medido contra el fondo real de cada bloque.
- Funciona sin JavaScript: los teléfonos y los botones de WhatsApp siguen vivos.
- Respeta `prefers-reduced-motion`. Navegable con teclado, con foco visible.
- Datos estructurados válidos (`ComputerRepairService`, `Service`, `FAQPage`).
