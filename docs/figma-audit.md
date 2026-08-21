# Auditoría Figma → Shopify G4U

Fecha: 2026-08-20  
Figma: `IH6qoc8DmEsYDr9guhzspp`  
Base técnica: Shopify Dawn 16.0.0, Liquid, HTML, CSS y JavaScript nativo.

## Resumen ejecutivo

El archivo cubre el storefront completo de G4U y parte de las superficies controladas por Shopify. La dirección visual es consistente y puede implementarse fielmente sobre Dawn sin convertir el tema en una colección de páginas rígidas.

La estrategia correcta es construir primero una capa de tokens y componentes, después secciones configurables, y finalmente componer las plantillas. No conviene copiar cada frame como HTML independiente: Home, Nosotros, Nuestra Harina, colecciones y producto comparten gran parte de sus módulos.

Hallazgos cuantitativos:

- 16 vistas principales, incluida la variante modal del carrito.
- 19 component sets y 128 componentes en total.
- 0 variables locales y 0 estilos locales en Figma: los valores visuales están aplicados directamente.
- 992 acciones de prototipo a nodos, 518 triggers de clic, 402 de hover y 65 de mouse-enter.
- No hay animaciones de timeline/keyframes exportables. `get_motion_context` sobre Home devolvió 0 nodos animados.
- Todos los diseños principales están en 1440 px; no hay frames finales de tablet o móvil.

## Inventario de pantallas

| Vista | Nodo Figma | Alto desktop | Destino Shopify | Tratamiento |
|---|---:|---:|---|---|
| Home | `1:1910` | 9537 | `templates/index.json` | Composición de secciones reutilizables |
| Nosotros | `1:2132` | 8961 | `templates/page.nosotros.json` | Hero + contenido editorial + módulos compartidos |
| Nuestra Harina | `1:2250` | 9414 | `templates/page.nuestra-harina.json` | Secciones editoriales, comparativa y FAQ |
| FAQs | `1:2366` | 2602 | `templates/page.faqs.json` | FAQ agrupado por categorías |
| Política de privacidad | `1:2412` | 6668 | Política Shopify / plantilla legal | Contenido administrado por Shopify, estilo G4U |
| Términos y condiciones | `1:2487` | 3011 | Política Shopify / plantilla legal | Contenido administrado por Shopify, estilo G4U |
| Política de envío | `1:2518` | 3011 | Política Shopify / plantilla legal | Contenido administrado por Shopify, estilo G4U |
| Productos | `1:2549` | 6455 | `templates/collection.json` | Grid, filtros, orden y módulos globales |
| Packs | `1:2632` | 5276 | Template alternativo de colección | Reusa grid/filtros y cambia colección/contenido |
| Armá tu combo ideal | `1:2707` | 4922 | `templates/page.combo-ideal.json` | Bundle builder con estado y carrito real |
| Detalle de producto | `1:2847` | 8508 | `templates/product.json` | Galería, compra, acordeones, comparativas y recomendaciones |
| Carrito | `1:3321` | 2568 | `templates/cart.json` | Líneas, cantidades, descuento, envío y upsell |
| Contacto | `1:3481` | 1703 | `templates/page.contact.json` | Formulario nativo Shopify + imagen |
| Cart modal | `1:6517` | 900 | `snippets/cart-drawer.liquid` | Drawer/modal responsive con upsell |
| Checkout | `1:6698` | 1856 | Checkout and accounts editor | Fuera del alcance normal de Liquid del tema |
| Log in | `1:6901` | 900 | Customer accounts / sign-in | Branding del editor de checkout y cuentas |

## Secciones compartidas detectadas

La mayoría de las páginas largas se componen de los mismos bloques. Esto reduce el trabajo real y mejora la consistencia:

- pre-header de envíos y redes;
- header transparente, normal, sticky, búsqueda y mega-menú;
- hero editorial o carrusel;
- marquee naranja de beneficios nutricionales;
- grilla de productos y cards;
- selector por tabs de ingredientes/beneficios;
- comparativa nutricional;
- beneficios low-carb;
- testimonios de profesionales;
- galería/Instagram;
- beneficios logísticos;
- newsletter;
- footer.

## Inventario de component sets

| Component set | Variantes | Equivalente de código |
|---|---:|---|
| `icon` | 6 | Snippets SVG exactos: búsqueda, cuenta y carrito + hover |
| `Nav Link` | 8 | Estados de navegación para fondo claro/hero y dropdown |
| `Button` | 18 | Primitiva CSS global con tono, outline, icono y hover |
| `Tab container` | 4 | Custom element accesible para tabs + slider de contenido |
| `Icon` | 6 | Iconos de atributos: proteína, keto, carb, fibra, azúcar y tecnología |
| `Product-Card` | 2 | Adaptación de `snippets/card-product.liquid` |
| `Product image` | 2 | Imagen principal/secundaria en hover y CTA rápido |
| `Tab link` | 3 | Estados normal, hover y activo |
| `Packs` | 2 | Selector Panes/Snacks del bundle builder |
| `Banner` | 24 | Marquee continuo; no se deben crear 24 DOM states |
| `Tooltip` | 2 | Tooltip accesible para atributos/productos |
| `Header` | 9 | Transparente, normal, submenús, búsqueda, sticky y estados intermedios |
| `Hero` | 3 | Carrusel con navegación, CTA y vínculo a carrito/colección |
| `Filtros` | 2 | Adaptación de facets cerrado/abierto |
| `Accordion Item` | 10 | Acordeones de detalle de producto |
| `Accordion 2` | 8 | Acordeones de almidón, proteínas, fibras y tecnología |
| `Accordion FAQ` | 2 | Pregunta cerrada/abierta |
| `Product` | 4 | Estados de galería/product media |
| `Arrow` | 2 | Indicador animado alternante |

Componentes simples fuera de sets que también deben quedar reutilizables: Logo, Beneficios, Suscribe, Footer, Comparativa, Header/Pre-Header, Tag, Gallery e Instagram.

## Sistema visual implícito

Figma no usa tokens nativos, pero la auditoría de todos los frames muestra un sistema claro que debe formalizarse en CSS custom properties y settings del tema.

### Colores principales

| Rol propuesto | Valor |
|---|---|
| Fondo crema | `#fff8f0` |
| Texto oscuro | `#26131b` |
| Bordó principal | `#500322` |
| Naranja/CTA | `#ff4622` |
| Fondo suave | `#f2ebe4` |
| Rosa | `#ffa6af` |
| Texto secundario | `#766c70` |

### Tipografía

- Marca y storefront: Europa Grotesk SH.
- Títulos: principalmente Bold Condensed.
- Cuerpo: Regular y Medium.
- Tamaños más repetidos: 14, 16, 18, 20, 24, 32, 40 y 48 px.
- Checkout y cuentas usan tipografías de plataforma (SF Pro/Roboto en el archivo), no el mismo rendering del tema.

Antes de implementar debe confirmarse la licencia y disponibilidad web de Europa Grotesk SH. Si no existe licencia web, hay que acordar una alternativa métrica y visualmente cercana; no conviene depender de una fuente local del diseñador.

### Espaciado y forma

- Escala dominante: 4, 8, 12, 16, 24, 32, 48, 60, 80 y 120 px.
- Radios dominantes: 4, 8, 12 y pill (`100px`).
- Contenedor desktop: 1360 px dentro de un canvas de 1440 px, equivalente a 40 px de margen lateral.

## Interacciones y motion

No existen keyframes/timelines de Figma. Las interacciones son estados de prototipo y deben traducirse a comportamiento web semántico:

| Patrón | Especificación detectada | Implementación |
|---|---|---|
| Marquee nutricional | 24 variantes, auto-avance, Smart Animate lineal de 600 ms | CSS marquee continuo con una sola lista duplicada para loop |
| Flecha/indicador | 2 variantes, 800 ms, ease-out, loop | Keyframe CSS de transform/opacity |
| Tabs | Cambio entre 4 estados, 300 ms ease-in; flechas 200 ms | Custom element con tabs ARIA y transición de 200–300 ms |
| Selector de packs | 2 estados, 300 ms ease-out | Estado JS y actualización de selección/precio |
| Hero | 3 estados, autoplay y navegación; clic a colección/carrito | Slideshow ligero con pausa, teclado y swipe |
| Header | hover, submenu, sticky, search y cart overlay | Un solo header stateful; no duplicar tres headers en el DOM |
| Product card | imagen secundaria al entrar/salir | CSS hover/focus y soporte táctil sin depender de hover |
| Acordeones | cambio de variante por clic, sin transición definida | `details/summary` o custom element; no inventar duración |
| Tooltips | entrada/salida casi instantánea (1 ms) | Tooltip accesible en hover y focus |
| Botones e iconos | estados hover instantáneos o dissolve de 1 ms | CSS `:hover`, `:focus-visible`, `:active`, `disabled` |

Todo movimiento debe respetar `prefers-reduced-motion`. Las transiciones de 1 ms del prototipo se interpretan como cambio instantáneo, no como una animación perceptible.

## Riesgos y decisiones pendientes

1. **No hay responsive diseñado.** Deben definirse explícitamente desktop, tablet y móvil. La implementación propondrá reglas, pero el resultado móvil necesita aprobación visual.
2. **No hay tokens ni estilos de Figma.** Sin formalizarlos primero, colores y espaciados se duplicarían en todo el tema.
3. **Nombres de variantes incompletos.** Hay muchos `Variant2`, `Variant3` y un set `Accordion Item` con varias variantes llamadas `Default`; Figma reporta errores existentes en algunos sets.
4. **Componentes sin documentación.** Los 128 componentes tienen descripción vacía; la intención debe registrarse en el código y, opcionalmente, sanearse después en Figma.
5. **Checkout y login no pertenecen al tema.** Deben configurarse en el checkout and accounts editor. Las extensiones avanzadas y Branding API dependen del plan de Shopify.
6. **Combo ideal requiere lógica de negocio.** Falta confirmar si cada combo agrega productos individuales, un bundle nativo o una variante/producto de pack.
7. **Assets de producto y contenido.** Las imágenes visualizadas en Figma deben mapearse a media de producto, archivos del CMS o assets estáticos según su naturaleza; no deben quedar apuntando a URLs temporales de Figma.
8. **Repositorio inicial.** El workspace es Dawn 16.0.0 prácticamente sin personalización y todos los archivos aparecen aún sin seguimiento en Git; hace falta establecer un baseline antes de una implementación grande.

## Arquitectura propuesta

### Capa 1 — Foundations

- Tokens G4U en `assets/g4u-tokens.css` y settings globales equivalentes.
- Carga legal de la fuente o fallback aprobado.
- Primitivas de botones, campos, tags, iconos, contenedores y estados de foco.
- Breakpoints y reglas responsive documentadas.

### Capa 2 — Shell global

- Announcement bar.
- Header/mega-menu/search/sticky.
- Cart drawer.
- Newsletter, beneficios y footer.

### Capa 3 — Commerce primitives

- Product card e imagen secundaria.
- Grid, filtros, orden y paginación.
- Product gallery, compra, cantidades, disponibilidad y acordeones.
- Recomendaciones y upsell.

### Capa 4 — Marketing sections

- Hero/slideshow.
- Marquee nutricional.
- Split editorial image/text.
- Tabs de ciencia/ingredientes.
- Comparativa nutricional.
- Profesionales/testimonios.
- Instagram/gallery.
- FAQ.

### Capa 5 — Templates

- Home.
- Nosotros y Nuestra Harina.
- Colecciones y Packs.
- Detalle de producto.
- Combo ideal.
- Carrito, Contacto, FAQs y legales.

### Capa 6 — Superficies Shopify

- Branding de Checkout en el checkout and accounts editor.
- Branding de Sign-in/customer accounts en el mismo editor.
- Si se requieren cambios funcionales fuera de lo que permite el editor: checkout/customer account UI extension separada del tema.

## Fases de implementación

### Fase 0 — Preparación

- Crear baseline Git y rama de implementación.
- Confirmar store de desarrollo, plan Shopify y estrategia de cuentas.
- Confirmar fuente, assets y modelo de datos del combo.
- Acordar comportamiento responsive.

### Fase 1 — Design system + shell

- Tokens, tipografía, botones e inputs.
- Header, navegación, búsqueda, newsletter, beneficios, footer y cart drawer.
- Story/test page temporal para validar cada estado aislado.

### Fase 2 — Commerce core

- Card de producto, colección, filtros y detalle de producto.
- Carrito completo, descuentos, envío gratis y recomendaciones.

### Fase 3 — Home

- Implementar todas las secciones de Home usando la biblioteca anterior.
- Validar primero una sección completa contra Figma y luego replicar el patrón de QA.

### Fase 4 — Contenido editorial

- Nosotros, Nuestra Harina, FAQ, legales y Contacto.
- Reusar secciones; evitar HTML específico por página salvo contenido verdaderamente único.

### Fase 5 — Combo ideal

- Resolver producto/bundle, reglas de descuento, selección, errores y actualización del carrito.

### Fase 6 — Checkout y cuentas

- Aplicar branding permitido por el plan.
- Documentar cualquier diferencia inevitable respecto de Figma.

### Fase 7 — QA y cierre

- Comparación visual en 1440, 1024, 768, 390 y 360 px.
- Estados hover, focus, active, disabled, loading, empty y error.
- Teclado, lector de pantalla, contraste y reduced motion.
- Theme Check, pruebas funcionales de carrito y checkout, Lighthouse y revisión cross-browser.

## Definition of Done

Una pantalla no se considera terminada solo porque “se parece” al frame. Debe cumplir:

- estructura y contenido equivalentes al Figma;
- componentes configurables desde el editor de Shopify;
- producto, precio, descuento, inventario y carrito conectados a datos reales;
- desktop y responsive aprobados;
- interacciones completas con teclado y touch;
- motion fiel donde existe y sin movimiento inventado;
- `prefers-reduced-motion` respetado;
- sin assets temporales ni URLs de Figma;
- sin errores de Theme Check;
- comparación visual documentada y diferencias aceptadas explícitamente.

## Referencias oficiales de plataforma

- [Arquitectura de temas Shopify](https://shopify.dev/docs/storefronts/themes/architecture)
- [Secciones y bloques](https://shopify.dev/docs/storefronts/themes/best-practices/templates-sections-blocks)
- [Checkout y accounts editor](https://help.shopify.com/en/manual/checkout-settings/customize-checkout-configurations)
- [Personalización de customer accounts](https://help.shopify.com/en/manual/customers/customer-accounts/new-customer-accounts/customize)

