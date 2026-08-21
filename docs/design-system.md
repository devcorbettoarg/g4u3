# Sistema visual G4U

Guía de referencia para mantener consistencia al crear o editar secciones del tema Shopify. Los valores proceden del diseño de Figma y de la implementación actual.

## Colores

| Token CSS | Uso | Valor |
| --- | --- | --- |
| `--g4u-cream` | Fondo principal, texto sobre bordó | `#FFF8F0` |
| `--g4u-burgundy` | Marca, header superior, footer, fondos de contraste | `#500322` |
| `--g4u-orange` | CTA, destacados y logo | `#FF4622` |
| `--g4u-ink` | Texto principal oscuro | `#231F20` |
| — | Fondo suave/editorial | `#F2EBE4` |
| — | Destacado rosa | `#FFA6AF` |
| — | Texto secundario | `#766C70` |

Regla práctica: usá bordó para superficies de marca, naranja solo para acciones o énfasis, y crema como base. Evitá introducir nuevos hexadecimales si uno de estos roles ya resuelve el caso.

## Tipografías

| Rol | Familia | Peso | Uso |
| --- | --- | --- | --- |
| Display | `Europa Grotesk SH` | Bold Condensed / 700 | Héroes, títulos y mensajes de alto impacto |
| UI y cuerpo | `Europa Grotesk SH` | Regular / 400 | Navegación, botones, textos editoriales |
| Fallback | Fuente configurada en Shopify | Variable | Se utiliza si Europa Grotesk SH no está disponible |

La fuente display se expone como `--g4u-display`. Sus títulos se escriben en mayúsculas, con `line-height: .9` y `letter-spacing: .02em` mediante la clase `.g4u-display`.

Escala recomendada:

| Elemento | Desktop | Móvil |
| --- | ---: | ---: |
| Hero principal | 56 px | 41–42 px |
| Hero editorial | 92 px | 56 px |
| Título de sección | 48 px | 40 px |
| Título secundario | 40 px | 36 px |
| Subtítulo | 24 px | 20 px |
| Cuerpo destacado | 18 px | 16 px |
| Navegación | 16 px | 16 px |
| Texto pequeño | 14 px | 11–14 px |

## Espaciado y forma

La escala base usa múltiplos de 4 px: `4, 8, 12, 16, 24, 32, 48, 60, 80, 120`.

- Canvas desktop: 1440 px.
- Contenedor editorial: 1360 px, con 40 px laterales.
- Separación vertical habitual entre secciones: 80 px.
- Radio de imágenes/cards: 12 px.
- Botones y controles: pill, `border-radius: 999px`.
- Botón estándar: altura mínima 50 px, padding horizontal 24 px.

## Componentes

### Header

- Pre-header: 40 px de alto, fondo bordó y texto crema.
- Header normal/sticky: 60 px, fondo crema, logo y texto oscuros.
- Header sobre hero: 88 px, transparente, logo y texto claros.
- Íconos de búsqueda, cuenta y carrito: 24 px; separación de 16 px.
- Navegación: 16 px, con 24 px entre enlaces.

El comportamiento está en [g4u-shell.css](/Users/gabrielcorbetto/Documents/GitHub/g4u3/assets/g4u-shell.css) y mantiene la interacción nativa de Dawn.

### Botones

Usar `.g4u-pill` para CTAs. Sus variantes se definen por el contexto:

- Fondo crema + texto bordó: CTA sobre imágenes oscuras.
- Borde bordó + fondo transparente: CTA secundario sobre crema.
- Borde crema + texto crema: CTA sobre bordó o imágenes oscuras.

En hover el botón sube 2 px. Todo control interactivo debe conservar `:focus-visible` con outline de 2 px y offset de 4 px.

### Cards e imágenes

- Imágenes: `object-fit: cover` y radio 12 px.
- Cards de producto: imagen sobre fondo suave, título bordó y precio legible.
- En desktop las grillas suelen ser de cuatro columnas; en móvil se convierten en dos columnas o carruseles horizontales según la sección.

### Footer

- Fondo bordó; logo naranja; texto crema.
- Cuatro columnas desktop: marca, tres menús y redes.
- La franja inferior incluye copyright y los medios de pago habilitados en Shopify.
- Los menús, redes y LinkedIn son configurables desde el editor; los medios de pago proceden de `shop.enabled_payment_types`.

## Movimiento y accesibilidad

- Transiciones habituales: 200–300 ms para hover, tabs y slides.
- Marquee: movimiento lineal continuo; se pausa al hover.
- No inventar animaciones largas cuando Figma no especifica una.
- Respetar `prefers-reduced-motion` y desactivar transiciones no esenciales.
- Las imágenes decorativas llevan `alt=""`; las imágenes de contenido deben tener una descripción útil.
- Mantener contrastes altos: crema sobre bordó, o tinta sobre crema.

## Dónde editar

| Necesidad | Ubicación |
| --- | --- |
| Tokens, secciones de marketing | [g4u-home.css](/Users/gabrielcorbetto/Documents/GitHub/g4u3/assets/g4u-home.css) |
| Header y footer | [g4u-shell.css](/Users/gabrielcorbetto/Documents/GitHub/g4u3/assets/g4u-shell.css) |
| Configuración de navegación | [header-group.json](/Users/gabrielcorbetto/Documents/GitHub/g4u3/sections/header-group.json) |
| Configuración del footer | [footer-group.json](/Users/gabrielcorbetto/Documents/GitHub/g4u3/sections/footer-group.json) |
| Colores y fuentes configurables de Shopify | `config/settings_data.json` |

## Criterio de implementación

Antes de sumar un módulo, reutilizá los tokens y patrones existentes. Las secciones deben seguir siendo editables desde Shopify y los precios, productos, navegación, carrito y pagos deben provenir de datos reales de la tienda; nunca de contenido estático copiado desde Figma.
