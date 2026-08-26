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
   2. TABLA DE DIAGNÓSTICO
   Cada síntoma tiene la causa que más se repite en el banco de trabajo,
   el servicio que la resuelve y el tiempo típico. El valor se cotiza aparte,
   después de ver el equipo.
   -------------------------------------------------------------------------- */
const SINTOMAS = {
  'no-enciende': {
    mensaje: 'Hola, mi equipo no enciende. Quisiera saber por la revisión de energía.',
    etiqueta: 'No enciende',
    causa: 'Casi siempre es la fuente de poder o el botón de encendido. En portátiles, el cargador o el conector de carga. Si enciende y se apaga de una, revisamos la placa.',
    servicio: 'Revisión de energía',
    tiempo: '1 – 3 días'
  },
  'lento': {
    remoto: true,
    mensaje: 'Hola, mi equipo va muy lento. Quisiera saber por el cambio a disco SSD.',
    etiqueta: 'Va muy lento',
    causa: 'Disco mecánico saturado o memoria insuficiente. Cambiar a SSD es el salto que más se nota: el equipo arranca en segundos.',
    servicio: 'Migración a SSD + optimización',
    tiempo: 'Mismo día'
  },
  'calienta': {
    mensaje: 'Hola, mi equipo se calienta y suena mucho. Quisiera saber por el mantenimiento.',
    etiqueta: 'Se calienta o suena mucho',
    causa: 'Polvo acumulado en el disipador y pasta térmica seca. El equipo baja su rendimiento solo para no quemarse.',
    servicio: 'Mantenimiento y cambio de pasta térmica',
    tiempo: '4 – 8 horas'
  },
  'pantalla': {
    mensaje: 'Hola, mi equipo se reinicia y me saca pantalla azul. Quisiera saber por el diagnóstico.',
    etiqueta: 'Pantalla azul o se reinicia',
    causa: 'Memoria RAM con fallas, controladores en conflicto o disco con sectores dañados. Lo confirmamos con pruebas antes de cambiar nada.',
    servicio: 'Diagnóstico de estabilidad',
    tiempo: '1 – 2 días'
  },
  'virus': {
    remoto: true,
    mensaje: 'Hola, mi equipo tiene virus y publicidad. Quisiera saber por la limpieza.',
    etiqueta: 'Virus o publicidad',
    causa: 'Programas no deseados en el navegador y en el arranque de Windows. Se limpia sin perder los archivos.',
    servicio: 'Limpieza y protección',
    tiempo: 'Mismo día'
  },
  'datos': {
    mensaje: 'Hola, perdí archivos de mi equipo. Quisiera saber por la recuperación de datos.',
    etiqueta: 'Perdí mis archivos',
    causa: 'Formateo accidental, disco que no monta o borrado por error. Entre menos se use el disco, más se puede recuperar.',
    servicio: 'Recuperación de datos',
    tiempo: '2 – 5 días'
  },
  'liquido': {
    mensaje: 'Hola, se me regó líquido en el equipo y no lo he encendido. ¿Qué hago?',
    etiqueta: 'Se me regó líquido',
    causa: 'Urgente: no lo encienda. La corrosión avanza por horas. Se desarma, se lava la placa y se evalúa qué quedó vivo.',
    servicio: 'Limpieza de placa por líquido',
    tiempo: '2 – 4 días'
  },
  'armar': {
    mensaje: 'Hola, quiero armar un PC. Lo voy a usar para ____ y mi presupuesto es de ____.',
    etiqueta: 'Quiero armar un PC',
    causa: 'Partimos del uso real y del presupuesto, no de una lista copiada. Le decimos en qué vale la pena gastar y en qué no.',
    servicio: 'Asesoría y ensamble a la medida',
    tiempo: '3 – 7 días'
  }
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

   El costo es que al publicarlo la barra muestra /index.html. GitHub Pages no
   permite redirigir del lado del servidor, así que se limpia aquí: se reescribe
   la dirección sin recargar la página. Solo en http y https; en file:// no
   aplica y además fallaría.
   -------------------------------------------------------------------------- */
function limpiarDireccion() {
  if (location.protocol !== 'http:' && location.protocol !== 'https:') return;
  if (!/\/index\.html$/.test(location.pathname)) return;
  try {
    var limpia = location.pathname.replace(/index\.html$/, '') + location.search + location.hash;
    history.replaceState(null, '', limpia);
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

  const botones = todos('.sintoma', panel);
  const lectura = uno('.lectura', panel);
  const texto   = uno('.lectura__texto', panel);
  const servicio = uno('[data-lectura="servicio"]', panel);
  const tiempo   = uno('[data-lectura="tiempo"]', panel);
  const accion   = uno('.lectura__accion a', panel);
  const avisoRemoto = uno('.lectura__remoto', panel);

  let escribiendo = null;

  /** Escribe la causa carácter por carácter, como una lectura de consola. */
  function escribir(frase) {
    clearInterval(escribiendo);
    lectura.dataset.listo = 'no';

    if (menosMovimiento) {
      texto.textContent = frase;
      lectura.dataset.listo = 'si';
      return;
    }

    texto.textContent = '';
    let i = 0;
    escribiendo = setInterval(() => {
      texto.textContent = frase.slice(0, ++i);
      if (i >= frase.length) {
        clearInterval(escribiendo);
        lectura.dataset.listo = 'si';
      }
    }, 12);
  }

  function elegir(clave, boton) {
    const dato = SINTOMAS[clave];
    if (!dato) return;

    botones.forEach((b) => b.setAttribute('aria-pressed', String(b === boton)));

    lectura.hidden = false;
    if (avisoRemoto) avisoRemoto.hidden = !dato.remoto;
    servicio.textContent = dato.servicio;
    tiempo.textContent   = dato.tiempo;
    accion.href = enlaceWhatsApp(dato.mensaje);
    escribir(dato.causa);
  }

  botones.forEach((boton) => {
    boton.addEventListener('click', () => elegir(boton.dataset.sintoma, boton));
  });

  // Se abre con el síntoma más común para que el panel nunca se vea vacío.
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
