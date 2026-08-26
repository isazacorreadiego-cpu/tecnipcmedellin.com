/* ==========================================================================
   TecniPC Medellín — comportamiento del sitio
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. DATOS DEL NEGOCIO
   Este es el único bloque que hay que editar para cambiar los datos de contacto.

   TecniPC atiende a domicilio y en taller con cita previa, sin local abierto al
   público. Por eso el sitio no publica una dirección: declara la zona que cubre.
   Así lo entiende Google (negocio de área de servicio) y así se le explica al cliente.
   -------------------------------------------------------------------------- */
const NEGOCIO = {
  nombre:    'TecniPC Medellín',
  telefono:  '+57 318 949 0552',
  whatsapp:  '573189490552',            // solo dígitos, con el 57 adelante
  correo:    'tecnipcm@gmail.com',
  cobertura: 'Medellín y todo el Valle de Aburrá',
  entrega:   'Recogemos y entregamos a domicilio. Taller con cita previa.',
  horario:   'Lunes a viernes 8:00 a.m. – 6:00 p.m. · Sábados 9:00 a.m. – 2:00 p.m.',
  sitio:     'https://tecnipcmedellin.com'
};


/* --------------------------------------------------------------------------
   3. Utilidades
   -------------------------------------------------------------------------- */
const uno   = (sel, raiz = document) => raiz.querySelector(sel);
const todos = (sel, raiz = document) => Array.from(raiz.querySelectorAll(sel));

const menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Arma un enlace de WhatsApp con el mensaje ya escrito. */
function enlaceWhatsApp(mensaje) {
  return 'https://wa.me/' + NEGOCIO.whatsapp + '?text=' + encodeURIComponent(mensaje);
}

/* --------------------------------------------------------------------------
   4. Dirección limpia en la barra del navegador

   Los enlaces al inicio apuntan a "index.html" y no a "/", a propósito: así el
   sitio se puede abrir con doble clic desde el disco, donde una barra suelta
   apuntaría a la raíz del computador y no a la portada.

   El costo es que al publicarlo la barra muestra el nombre del archivo. GitHub
   Pages no permite redirigir del lado del servidor, así que se limpia aquí: se
   reescribe la dirección sin recargar la página. Solo en http y https; en
   file:// no aplica y además fallaría.

   GitHub Pages sirve las dos formas (/servicios y /servicios.html devuelven lo
   mismo), así que ningún enlace se rompe.
   -------------------------------------------------------------------------- */
function limpiarDireccion() {
  if (location.protocol !== 'http:' && location.protocol !== 'https:') return;

  var ruta = location.pathname;
  var limpia;
  if (/\/index\.html$/.test(ruta)) {
    limpia = ruta.replace(/index\.html$/, '');   // /index.html -> /
  } else if (/\.html$/.test(ruta)) {
    limpia = ruta.replace(/\.html$/, '');        // /servicios.html -> /servicios
  } else {
    return;
  }

  try {
    history.replaceState(null, '', limpia + location.search + location.hash);
  } catch (e) {
    /* Si el navegador no lo permite, no pasa nada: la página funciona igual. */
  }
}

/* --------------------------------------------------------------------------
   5. Datos del negocio en la página
   Cualquier elemento con data-negocio="campo" recibe el valor correspondiente.
   Si además es un enlace, se le arma el href adecuado.
   -------------------------------------------------------------------------- */
function pintarDatosNegocio() {
  todos('[data-negocio]').forEach((el) => {
    const campo = el.dataset.negocio;
    const valor = NEGOCIO[campo];
    if (!valor) return;

    if (!el.hasAttribute('data-conservar-texto')) el.textContent = valor;

    if (el.tagName === 'A') {
      if (campo === 'telefono') el.href = 'tel:' + valor.replace(/\s/g, '');
      if (campo === 'correo')   el.href = 'mailto:' + valor;
      if (campo === 'whatsapp') el.href = enlaceWhatsApp('Hola, quiero información sobre sus servicios.');
    }
  });

  // Enlaces de WhatsApp con mensaje propio: data-wa="mensaje"
  todos('[data-wa]').forEach((el) => {
    el.href = enlaceWhatsApp(el.dataset.wa);
  });

  const anio = uno('[data-anio]');
  if (anio) anio.textContent = new Date().getFullYear();
}

/* --------------------------------------------------------------------------
   6. Barra superior
   -------------------------------------------------------------------------- */
function activarBarra() {
  const barra = uno('.barra');
  const boton = uno('.boton-menu');
  const menu  = uno('.menu');
  if (!barra) return;

  const marcarScroll = () => {
    barra.dataset.fija = window.scrollY > 12 ? 'si' : 'no';
  };
  marcarScroll();
  window.addEventListener('scroll', marcarScroll, { passive: true });

  if (!boton || !menu) return;

  const cerrar = () => {
    boton.setAttribute('aria-expanded', 'false');
    menu.dataset.abierto = 'no';
  };

  boton.addEventListener('click', () => {
    const abierto = boton.getAttribute('aria-expanded') === 'true';
    boton.setAttribute('aria-expanded', String(!abierto));
    menu.dataset.abierto = abierto ? 'no' : 'si';
  });

  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) cerrar();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrar();
  });
}

/* --------------------------------------------------------------------------
   7. Panel de diagnóstico
   -------------------------------------------------------------------------- */
function activarDiagnostico() {
  const panel = uno('.diagnostico');
  if (!panel) return;

  const botones  = todos('.sintoma', panel);
  const lecturas = todos('.lectura', panel);

  /* El texto de cada síntoma está escrito en el HTML, no aquí: así lo leen los
     buscadores y sigue estando si el visitante no ejecuta JavaScript. Este
     código solo decide cuál se ve. */
  function elegir(clave, boton) {
    botones.forEach((b) => b.setAttribute('aria-pressed', String(b === boton)));
    lecturas.forEach((l) => { l.hidden = l.dataset.lecturaDe !== clave; });
  }

  botones.forEach((boton) => {
    boton.addEventListener('click', () => elegir(boton.dataset.sintoma, boton));
  });

  /* Arranca con el caso más común para que el panel nunca se vea vacío. */
  const inicial = botones.find((b) => b.dataset.sintoma === 'lento') || botones[0];
  if (inicial) elegir(inicial.dataset.sintoma, inicial);
}

/* --------------------------------------------------------------------------
   8. Aparición al desplazar
   -------------------------------------------------------------------------- */
function activarApariciones() {
  const piezas = todos('[data-aparece]');
  if (!piezas.length) return;

  if (menosMovimiento || !('IntersectionObserver' in window)) {
    piezas.forEach((p) => p.setAttribute('data-visible', ''));
    return;
  }

  const observador = new IntersectionObserver((entradas, obs) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      const retraso = Number(entrada.target.dataset.aparece) || 0;
      setTimeout(() => entrada.target.setAttribute('data-visible', ''), retraso * 70);
      obs.unobserve(entrada.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

  piezas.forEach((p) => observador.observe(p));
}

/* --------------------------------------------------------------------------
   9. Formulario de contacto
   No hay servidor: el formulario arma el mensaje y lo abre en WhatsApp.
   -------------------------------------------------------------------------- */
function activarFormulario() {
  const forma = uno('#forma-contacto');
  if (!forma) return;

  forma.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(forma);

    const mensaje = [
      'Hola TecniPC Medellín, quiero solicitar un servicio.',
      '',
      'Nombre: '  + (d.get('nombre')  || '—'),
      'Equipo: '  + (d.get('equipo')  || '—'),
      'Servicio: ' + (d.get('servicio') || '—'),
      'Zona: '    + (d.get('zona')    || '—'),
      '',
      'Lo que pasa: ' + (d.get('detalle') || '—')
    ].join('\n');

    window.open(enlaceWhatsApp(mensaje), '_blank', 'noopener');

    const aviso = uno('#aviso-forma');
    if (aviso) {
      aviso.textContent = 'Abrimos WhatsApp con su solicitud lista para enviar. Si no se abrió, escríbanos al ' + NEGOCIO.telefono + '.';
      aviso.hidden = false;
    }
  });
}

/* --------------------------------------------------------------------------
   10. Arranque
   -------------------------------------------------------------------------- */
function iniciar() {
  limpiarDireccion();
  pintarDatosNegocio();
  activarBarra();
  activarDiagnostico();
  activarApariciones();
  activarFormulario();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciar);
} else {
  iniciar();
}
