# Sitio web de TecniPC Medellín

Sitio estático: solo HTML, CSS y JavaScript. No necesita servidor de aplicaciones,
ni base de datos, ni compilación. Se sube tal cual a cualquier hosting.

---

## Estado

Los datos de contacto y el dominio **ya están puestos**. El sitio está listo para subir.

### 1. Teléfono, WhatsApp, correo, cobertura y horario

Todo está en **un solo lugar**: al principio de `assets/js/sitio.js`, en el
objeto `NEGOCIO`.

```js
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
```

Con cambiar eso, se actualizan **todos** los teléfonos, correos, coberturas y
botones de WhatsApp del sitio entero, en las siete páginas.

> **Importante si cambia el número.** El teléfono, el correo y los enlaces de
> WhatsApp también están escritos dentro del HTML, no solo en este objeto. Es a
> propósito: si el navegador del visitante no ejecuta JavaScript, los botones de
> WhatsApp seguirían vivos y Google alcanza a leer el teléfono. Pero significa que,
> al cambiar el número, hay que hacer además un **buscar y reemplazar** de
> `573189490552` y `+57 318 949 0552` en los archivos `.html`.

> El número de WhatsApp va sin `+`, sin espacios y sin guiones.
> Ejemplo: para `+57 301 234 5678` se escribe `573012345678`.

### 2. Dominio

Ya configurado como `https://tecnipcmedellin.com` (sin `www`) en las canónicas, en
Open Graph, en el `sitemap.xml`, en `robots.txt` y en la ficha de Google. Si algún día
cambia de dominio, hay que reemplazarlo en esos cinco lugares.

---

## Por qué el sitio no publica una dirección

TecniPC atiende **a domicilio y en taller con cita previa**, sin local abierto al
público. Eso en marketing local se llama *negocio de área de servicio*, y tiene una
forma correcta de manejarse:

- El sitio **no muestra dirección de calle**. En su lugar declara la zona que cubre
  (`cobertura`) y cómo recibe los equipos (`entrega`).
- La ficha que lee Google (`application/ld+json` en `index.html`) usa
  `serviceArea` con un radio de 25 km alrededor de Medellín, y un `address` que solo
  dice ciudad, departamento y país, **sin `streetAddress`**. Así es como Google espera
  que se declare un negocio sin local.
- El mensaje del sitio convierte esto en ventaja: *"no tiene que traerlo, vamos por él"*.

**Publicar la dirección de la casa sería contraproducente**, y no solo por privacidad:
Google penaliza los perfiles con una dirección donde no se atiende público, y las
reseñas negativas por "fui y no había nada" hacen daño real.

### Al registrarse en Google Business Profile

Cuando cree el perfil del negocio, elija **"Presto servicios a domicilio"** y marque
que **no** tiene local que los clientes puedan visitar. Google le va a pedir una
dirección real para verificar por correo postal, pero al marcar esa opción la
**mantiene oculta** al público: los clientes solo ven la zona de cobertura.

Defina las zonas exactamente como están en el sitio: Medellín, Envigado, Sabaneta,
Itagüí, Bello, La Estrella y Copacabana. Que coincidan ayuda al posicionamiento.

---

### 3. El sitio no publica precios

Por decisión del negocio, ninguna página muestra valores. En su lugar cada servicio
dice **cuánto se demora**, y la cotización se pasa por WhatsApp después del
diagnóstico. Si algún día quiere volver a publicarlos, avíseme: la estructura quedó
lista para recibirlos.

### 4. La cifra "+3.400 equipos atendidos"

Aparece en la portada y en la franja de garantía. Si no corresponde a la realidad,
cámbiela o quítela: es una afirmación pública sobre el negocio.

---

## La página 404

`404.html` es lo que ve alguien que llega a una dirección que no existe (un enlace
viejo, una URL mal escrita). No hay que enlazarla desde ningún lado: el servidor la
muestra solo.

- **Netlify, Cloudflare Pages y GitHub Pages** la usan automáticamente por estar en la
  raíz y llamarse `404.html`. No hay que configurar nada.
- **Hosting con cPanel o Apache**: cree un archivo `.htaccess` en la raíz con la línea
  `ErrorDocument 404 /404.html`.

**Esta página es autónoma**, a diferencia del resto del sitio: lleva su CSS, su logo
y sus datos de contacto adentro del propio archivo. No carga `estilos.css` ni
`sitio.js` ni ninguna imagen del servidor.

Es a propósito. Una página de error se muestra justo cuando algo ya salió mal, desde
una dirección de cualquier profundidad (`sudominio.com/algo/que/no/existe`). Si
dependiera de archivos externos, llegaría rota en el peor momento. Así se ve igual
de bien servida desde la raíz, desde una ruta profunda, o abierta con doble clic
desde el disco.

**Lo que cuesta:** si cambia los colores o el logo del sitio, esta página no se entera.
Hay un comentario dentro del archivo recordándolo, y los colores están agrupados
arriba del todo para que sea fácil.

> Lo único que sí carga de afuera son las tipografías de Google, porque van por
> dirección absoluta (`https://...`) y no dependen de dónde esté el sitio. Sin
> internet, el CSS cae en las fuentes del sistema y la página sigue legible.

### Los enlaces de la 404

Empiezan con `/` porque, ya publicada, la página se muestra desde direcciones de
cualquier profundidad y solo una ruta absoluta lleva de vuelta al sitio.

El detalle es que `/` significa la raíz del **servidor**, no la del sitio. Para que
también funcione al abrir el archivo con doble clic o al previsualizarlo con un
servidor que apunta a una carpeta superior (la Vista Previa de VS Code sirve el
proyecto entero y deja el sitio en `/sitio/`), hay un script al final del archivo
que recalcula la raíz cuando detecta que está en vista local.

**Si publica el sitio dentro de una subcarpeta** en vez de en la raíz del dominio,
cambie esta línea en ese script:

```js
var RAIZ = '/';        // p. ej. '/sitio/' si el sitio no va en la raíz
```

Probado en cuatro escenarios: doble clic, servidor en la carpeta del sitio, servidor
un nivel arriba, y la página devuelta desde una ruta profunda del dominio real.

---

## El soporte remoto y el alcance nacional

`soporte-remoto.html` es la única parte del sitio que promete cobertura fuera del
Valle de Aburrá, y es una decisión de negocio, no de diseño: en remoto solo hace falta
internet, así que ese servicio sí llega a cualquier ciudad del país. La reparación
física y el domicilio siguen siendo solo en Medellín y alrededores, y el sitio lo dice
explícitamente en varios puntos para que nadie llegue con una expectativa equivocada.

Dos cosas de esa página conviene que revisen:

1. **No se nombra ninguna herramienta.** El texto dice "un programa liviano de conexión
   que no requiere instalación". Si ya usan AnyDesk, TeamViewer u otra, vale la pena
   nombrarla: da confianza porque mucha gente ya la conoce. Está en el paso 02 de
   "Cómo funciona" y en la primera pregunta frecuente.
2. **"Si no se resuelve, no se cobra"** aparece en la portada de esa página, en la
   franja de cifras y en las preguntas. Es la promesa más fuerte del sitio. Si no
   quieren sostenerla en esos términos, hay que cambiarla en los tres lugares.

Los medios de pago que menciona (transferencia, Nequi y Daviplata) también son un
supuesto: ajústelos a los que de verdad reciben.

---

## Cómo verlo en el computador

Haga doble clic en `index.html` y se abre en el navegador. Para que todo funcione
igual que en internet, es mejor levantarlo con un servidor local:

```
python -m http.server 8000
```

Y abrir `http://localhost:8000`.

---

## Cómo publicarlo

Es un sitio estático, así que sirve cualquiera de estas opciones:

| Opción | Costo | Cómo |
|---|---|---|
| **Netlify** | Gratis | Arrastre la carpeta `sitio` a app.netlify.com/drop |
| **Cloudflare Pages** | Gratis | Conecte un repositorio o suba la carpeta |
| **GitHub Pages** | Gratis | Suba la carpeta a un repositorio y actívelo en Settings |
| **Hosting tradicional** | Según plan | Suba el contenido de `sitio` por FTP a `public_html` |

En todos los casos se sube **el contenido de la carpeta `sitio`**, no la carpeta.
`index.html` debe quedar en la raíz del dominio.

### Pasos para dejarlo en línea

1. **Suba los archivos.** En Netlify o Cloudflare Pages basta arrastrar la carpeta.
   En hosting tradicional, por FTP a `public_html`.
2. **Apunte el dominio.** En el panel de su proveedor de dominio, cambie los
   servidores DNS o cree el registro que le indique el hosting. Tarda de minutos a
   unas horas en propagarse.
3. **Fuerce HTTPS.** Netlify y Cloudflare lo activan solos con certificado gratuito.
   En cPanel se activa con Let's Encrypt.
4. **Redirija `www` al dominio sin `www`.** Todas las direcciones canónicas del sitio
   son sin `www`, así que `www.tecnipcmedellin.com` debe redirigir a
   `tecnipcmedellin.com`. Si quedan las dos vivas, Google las trata como sitios
   distintos y se reparte la autoridad entre ambas.
5. **Verifique la página 404.** Entre a una dirección inventada, por ejemplo
   `tecnipcmedellin.com/prueba`, y confirme que sale la página de error del sitio y
   no la del hosting. En cPanel hay que añadir `ErrorDocument 404 /404.html` al
   `.htaccess`.
6. **Registre el sitio en Google Search Console** (search.google.com/search-console),
   verifique la propiedad y envíe `https://tecnipcmedellin.com/sitemap.xml`. Sin esto
   Google puede tardar semanas en encontrarlo.
7. **Cree el perfil de Google Business Profile** como negocio a domicilio, según se
   explica más abajo. Para un servicio técnico local, esto trae más clientes que el
   sitio mismo.
8. **Pruebe la ficha** en search.google.com/test/rich-results pegando la dirección,
   para confirmar que Google lee bien los datos del negocio.

---

## Estructura

```
sitio/
├── index.html              Portada, con el panel de diagnóstico
├── servicios.html          Servicios agrupados y tablas de precios
├── soporte-remoto.html     Soporte remoto, alcance nacional
├── armamos-tu-pc.html      Los tres armados y el proceso de ensamble
├── componentes.html        Catálogo de repuestos por categoría
├── contacto.html           Formulario y datos directos
├── 404.html                Página de error, para direcciones que no existen
├── robots.txt              Permisos para buscadores
├── sitemap.xml             Mapa del sitio para Google
├── site.webmanifest        Datos para instalarlo como app
├── favicon.ico
└── assets/
    ├── css/estilos.css     Toda la hoja de estilos, comentada por secciones
    ├── js/sitio.js         Datos del negocio y comportamiento
    └── img/                Imágenes optimizadas en WebP
```

---

## Cómo funciona el formulario de contacto

**No envía correos ni guarda nada en un servidor.** Toma lo que el visitante
escribió, arma un mensaje ordenado y lo abre en WhatsApp para que lo revise antes
de enviarlo. Esto tiene dos ventajas: no hay que pagar un servicio de correo, y la
conversación queda en WhatsApp, que es donde ustedes ya atienden.

Si más adelante quieren recibirlos por correo, se puede conectar a un servicio como
Formspree cambiando el `<form>` de `contacto.html`.

---

## Detalles de las imágenes

Las 20 imágenes originales pesaban **46 MB** en PNG. Se convirtieron a WebP,
se recortaron al contenido visible y quedaron en **2,7 MB** en total (94% menos),
sin pérdida visible de calidad.

Los renders de componentes conservan el fondo transparente, que es lo que permite
que floten sobre el resplandor azul en la sección de componentes.

El logotipo original venía sobre fondo negro. Se le quitó el fondo para que se pueda
usar sobre cualquier superficie, y se generó aparte el emblema "TP" que se usa en la
barra superior (`assets/img/emblema.webp`).

Los archivos PNG originales siguen intactos en `tecnipc_medellin_imagenes/`.

---

## Accesibilidad y compatibilidad

- Funciona sin JavaScript: el contenido se lee completo, los teléfonos y los botones
  de WhatsApp siguen funcionando, y lo único que se pierde es el panel de diagnóstico
  de la portada.
- Respeta `prefers-reduced-motion`: si el visitante pidió menos animación en su
  sistema, se desactivan las apariciones y el efecto de escritura.
- Navegable con teclado, con foco visible en azul cian.
- Todas las imágenes tienen texto alternativo.
- Probado sin desbordamiento horizontal desde 320 px de ancho, en las siete páginas.
- Contraste AA en todo el texto, medido contra el fondo real de cada bloque.
- Objetivos táctiles de 40 px o más en móvil, salvo los enlaces dentro de párrafos,
  que la norma exime.
- Las imágenes se sirven en dos tamaños con `srcset`: los teléfonos descargan la
  versión pequeña y no la de escritorio.

---

## Un detalle sobre el horario

El horario que aparece es el de **atención**, no el de un local abierto. Si responden
WhatsApp fuera de ese rango, vale la pena ampliarlo: para un negocio a domicilio, el
horario en que contestan es lo que el cliente necesita saber.
