# Auditoría de brechas actual — Figma → tema Shopify G4U

Fecha: 21 de agosto de 2026  
Referencia: [archivo Figma G4U](https://www.figma.com/design/IH6qoc8DmEsYDr9guhzspp/g4u?node-id=0-1) y capturas integrales compartidas.  
Alcance revisado: templates, secciones, snippets y assets actualmente presentes en este repositorio.

## Cómo leer este documento

- **Listo en estructura**: existe una sección o plantilla equivalente; resta validación visual, contenido o interacción.
- **Parcial**: existe una aproximación, pero no reproduce todavía el frame o todos sus estados.
- **Pendiente**: no hay una implementación equivalente en el tema.
- **Plataforma Shopify**: no se resuelve desde Liquid/CSS del tema, sino desde Shopify Admin, Checkout/Accounts Editor o una extensión.

Esta es una lista de brechas para priorizar trabajo; no sustituye la validación visual en el preview a 1440 px y en responsive.

## Prioridad 0 — coherencia que afecta todas las pantallas

| Área | Estado | Falta concreta |
|---|---|---|
| Header, navegación y announcement bar | Parcial | Igualar alto, espaciado, contraste sobre hero, logo claro/oscuro, tamaño de iconos, contador de carrito y comportamiento sticky. La navegación debe reflejar la arquitectura de Figma: **Productos**, **Armá tu combo**, **¿Por qué G4U es diferente?**, **Nuestra filosofía** y **Contacto**. |
| Submenú de Productos | Parcial | Completar menú/mega-menú y sus productos/colecciones desde navegación de Shopify, con imágenes y enlaces reales donde el diseño los requiera. |
| Breadcrumbs | Pendiente/irregular | Aplicar la franja y jerarquía de Figma en PLP, PDP, Packs y Carrito (`Home > …`). |
| Sistema de cards | Parcial | Normalizar imagen, nombre, unidades, precio normal/oferta, badge de descuento y chips con iconos. Debe ser el mismo componente en home, PLP, carrito upsell y recomendaciones. |
| Tipografía, colores y spacing | Parcial | Consolidar el uso de los tokens G4U y verificar pesos/tamaños/line-height frente a Figma. Los títulos condensados, naranja, bordó, crema y rosa necesitan QA de contraste y consistencia. |
| Footer, newsletter y beneficios | Listo en estructura | Validar navegación, enlaces sociales, medios de pago, espaciado y contenido definitivo del Admin. Deben cerrar consistentemente todas las páginas de contenido. |

## Prioridad 1 — compra y descubrimiento de productos

### PLP: Productos y Packs

| Brecha | Estado actual | Trabajo pendiente |
|---|---|---|
| Cabecera de colección y breadcrumb | Parcial | Ajustar título, franja de breadcrumb, espaciado vertical y copy según cada colección. |
| Filtros cerrados/abiertos | Parcial | El toggle ya existe, pero falta reproducir el layout exacto: icono/etiqueta, contador, selector de orden, controles de vista y cuatro filtros visibles al expandir (Disponibilidad, Precio, Etiquetas y Colección). |
| Filtros reales | Parcial | Confirmar que tags, disponibilidad, precio y colección proceden de los filtros Shopify correctos y que no se muestran opciones vacías. |
| Grid y cards | Parcial | Lograr cuatro columnas completas en desktop, sin cortes ni scroll horizontal; completar estados de oferta, cantidades y chips; revisar proporciones de imagen. |
| Continuidad post-grid | Parcial | En ambas PLP ya están agregados Instagram, beneficios de servicio y newsletter. Aún faltan los bloques de Figma: marquee naranja, beneficios low-carb y carrusel de profesionales. |
| Colección Packs | Parcial | Verificar 7 packs, sus precios/ofertas, orden y copy; no debe depender de productos de ejemplo. |

### PDP

| Brecha | Estado actual | Trabajo pendiente |
|---|---|---|
| Galería y thumbnails | Parcial | Conservar thumbnails en columna izquierda en desktop, sincronizados con la imagen principal, con estados activos y comportamiento móvil. |
| Bloque de compra | Parcial | Igualar título, precio, rating/opiniones, chips, selección de unidades, CTA principal/secundario, aviso de envío y medios de pago. |
| Datos específicos de producto | Parcial | Completar metafields de beneficios, ingredientes, nutrición, conservación, envíos, unidades, comparativas, FAQs, recomendaciones y media. Sin estos datos la PDP no puede completar el diseño. |
| Acordeones | Parcial | Ajustar orden, copy y contenido de “¿Por qué elegir G4U?”, ingredientes, información nutricional, conservación y envíos. |
| Comparativa nutricional | Pendiente | Crear el módulo “Otros integrales vs. Pan de Molde G4U”, alimentado por metafields o bloques editables. |
| Ciencia/ingredientes | Pendiente | Añadir bloque de acordeones de ingredientes y el módulo editorial “Un pan, infinitas posibilidades”. |
| Cross-sell y prueba social | Pendiente | Añadir testimonios, productos relacionados y FAQ de cierre como aparece en Figma. |
| Cierre compartido | Parcial | Incorporar secuencia post-PDP: marquee, low-carb, profesionales, Instagram, servicios, newsletter y footer según corresponda al producto. |

### Carrito y cart drawer

| Brecha | Estado actual | Trabajo pendiente |
|---|---|---|
| Cart drawer | Parcial | Igualar dos columnas, progreso hacia envío gratis, líneas de producto, descuentos, eliminación, quantity stepper, total, CTAs, medios de pago y recomendaciones con botón `+`. |
| Carrito completo | Parcial | Implementar la composición Figma: breadcrumb, tabla de líneas, cupón, comentario, compartir enlace, resumen de pedido, envío gratis y acciones. |
| Recomendaciones en carrito | Pendiente | Conectar productos relacionados/upsell a product recommendations o colección fallback; evitar productos ficticios. |
| Reglas de envío/descuento | Plataforma Shopify + theme | Definir umbral real de envío gratis y descuentos en Admin. El tema sólo puede representar el progreso y los importes que Shopify devuelve. |

### Armá tu combo ideal

| Brecha | Estado actual | Trabajo pendiente |
|---|---|---|
| Builder de panes/snacks | Parcial | Replicar tabs, navegación, tarjetas, selección, validaciones por grupo, resumen lateral y CTA deshabilitado/habilitado. |
| Descuento escalonado | Pendiente de definición | Confirmar regla de negocio: productos individuales, bundle, Shopify Functions/app o descuento automático. Después conectar barra de 5/10/15% a datos reales. |
| Añadir combo al carrito | Parcial | Verificar stock, cantidades, errores y que se agreguen exactamente las líneas seleccionadas. |

## Prioridad 2 — marketing y contenido editorial

| Pantalla | Estado | Brechas que faltan cerrar |
|---|---|---|
| Home | Parcial | La estructura principal existe (hero, elección, productos, categorías, ciencia, comparativa, low-carb, expertos, Instagram, servicios y newsletter). Requiere QA visual sección por sección: overlay del hero, logo/iconos sobre imagen, announcement bar, copy de banner, cards, carrusel de profesionales y responsive. |
| Nosotros | Listo en estructura | Validar fidelidad de hero, manifiesto, historia, filosofía, valores, CTA de harina y cierre. Confirmar contenido definitivo e imágenes en editor. |
| Nuestra harina | Listo en estructura | Validar hero, desafío, fórmula, beneficios, tabla comparativa, calidad, FAQ y expertos. Falta verificar detalle visual de secciones largas y todos sus CTAs. |
| FAQ | Parcial | Confirmar categorías, todas las preguntas/respuestas, bloque de contacto y espaciado de Figma. |
| Contacto | Listo en estructura | Ajustar a Figma la relación imagen/formulario, labels, estados de error/éxito y enlaces de cierre. |
| Política de envío, privacidad y términos | Parcial | Existen templates legales, pero falta cargar/validar textos finales, fecha de actualización, anchura de lectura y todas las rutas del footer. |

## Prioridad 3 — superficies gestionadas por Shopify

| Superficie | Estado | Responsable/acción |
|---|---|---|
| Inicio de sesión de customer accounts | Plataforma Shopify | Configurar logo, colores y copy en **Checkout and accounts editor**. La pantalla no se controla desde las plantillas Liquid del tema. |
| Checkout | Plataforma Shopify | Configurar branding, métodos de pago, impuestos, shipping y campos desde Shopify. Cualquier layout/función que el editor no permita requiere evaluar Checkout UI Extensions y depende del plan. |
| Productos, colecciones y metafields | Shopify Admin | Cargar productos reales, media, inventario, precios, variantes/unidades, tags, colecciones, metaobjects/metafields y relaciones de cross-sell. |
| Navegación, enlaces sociales y políticas | Shopify Admin | Configurar los menús reales, URLs de redes, políticas y páginas. El theme no debería hardcodearlos. |

## Datos que deben estar completos antes del QA final

1. Productos: fotos principales/secundarias, título, unidades, precio de comparación, descuento, stock y orden de colección.
2. Metafields de PDP: beneficios, ingredientes, tabla nutricional, conservación, FAQs, usos, media editorial y producto comparable.
3. Colecciones: Productos, Packs, Panes, Snacks y las subcolecciones que alimenten el menú.
4. Recomendaciones: productos relacionados para PDP, carrito y home.
5. Contenido global: enlaces de menú/footer, redes, textos de envío, umbral de envío gratis, newsletter y políticas legales.
6. Activos de editor: hero, imágenes editoriales y videos de profesionales con licencia/URLs definitivas.

## Orden recomendado de ejecución

1. **Shell global:** header, announcement, navegación, logo/iconos, sticky y footer.
2. **Commerce core:** card, PLP/filtros, PDP y datos/metafields.
3. **Carrito:** drawer, cart page, shipping progress, descuentos y recomendaciones.
4. **Bloques reutilizables de cierre:** marquee, low-carb, expertos, Instagram, servicios y newsletter; insertarlos en PLP y PDP según Figma.
5. **Combo ideal:** cerrar la regla de negocio y luego la interfaz.
6. **Editorial y legales:** FAQ, contacto, nosotros y harina; la estructura está avanzada, principalmente requieren fidelidad visual y contenido final.
7. **Configuración Shopify:** cuentas, checkout, catálogo, navegación, envío y pagos.
8. **QA:** desktop 1440, tablet y mobile; estados hover/focus/error/loading, teclado, carrito y checkout reales.

## Criterio de cierre

Cada ítem se da por terminado sólo cuando cumple estructura y datos reales, no sólo apariencia estática. Debe verificarse en preview con el tamaño de Figma, funcionar con datos Shopify reales y no introducir scroll horizontal, superposiciones del header ni componentes recortados.

## Relación con la auditoría anterior

`docs/figma-audit.md` documenta el inventario inicial y la arquitectura propuesta. Este archivo es la lista operativa de **lo que falta hoy** y debe actualizarse al cerrar cada bloque.
