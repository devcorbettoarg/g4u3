# Propuesta de metaobjetos y metafields para G4U

Fecha: 30 de agosto de 2026  
Alcance: catálogo, PDP, colecciones y contenido reutilizable del tema Shopify.

## Resumen

El tema ya usa algunos datos por producto, pero gran parte del contenido específico todavía está hardcodeado en `templates/product.json`, en bloques de sección o en defaults de los archivos Liquid. La recomendación es separar tres tipos de información:

| Tipo de información | Dónde debería vivir | Ejemplos |
| --- | --- | --- |
| Dato nativo de Shopify | Producto, variante, colección o configuración de Shopify | precio, inventario, SKU, media, título, colección |
| Dato simple propio de un producto | Metafield | subtítulo, porción, conservación, unidades por pack |
| Registro reutilizable con varios campos o relación | Metaobjeto + metafield de referencia | ingrediente, beneficio, reseña, FAQ, comparativa, bloque editorial |
| Layout, orden y estilo de una página | Sección, block y JSON template | posición de imagen, fondo, cantidad de cards, padding |

La regla principal es no convertir todo en metaobjeto. Un valor aislado que sólo pertenece a un producto debe ser un metafield; un contenido con identidad propia, varios campos o uso en más de una superficie debe ser un metaobjeto.

## Hallazgos del código actual

### Ya existe soporte en Liquid

- `product.metafields.custom.product_intro` y `product.metafields.custom.product_benefits` se leen en `snippets/g4u-product-benefits.liquid`.
- `custom.product_details`, `custom.ingredients`, `custom.nutrition`, `custom.storage` y `custom.shipping` se leen en el bloque `collapsible_tab` de `sections/main-product.liquid`.
- `custom.subtitle` se usa en `snippets/card-product.liquid` y `sections/g4u-combo-builder.liquid`.
- La calificación y cantidad de reseñas ya usan `reviews.rating` y `reviews.rating_count`, normalmente administrados por una app o fuente de reviews.
- Los productos relacionados tienen una sección nativa de Shopify; no hace falta crear un objeto propio para el caso estándar.

### Contenido repetido que hoy está dentro de templates

- Beneficios del producto: seis strings en el bloque `g4u_benefits`.
- Comparativa PDP: métricas de otros productos vs. G4U.
- Ingredientes destacados: título y descripción por bloque.
- Ideas de consumo: texto y bloque editorial con imagen, título, descripción y checklist.
- Testimonios: calificación, cita y autor.
- FAQs de producto: pregunta y respuesta.
- Ciencia/tabs, beneficios low-carb y comparativas de harina: registros repetibles con varios campos.
- Expertos: nombre, especialidad, cita, avatar, imagen, video y perfil social.

## Modelo recomendado para producto

### Metafields simples de producto

Crear en `Configuración → Datos personalizados → Productos`:

| Nombre visible | Namespace y clave | Tipo recomendado | Obligatorio | Uso |
| --- | --- | --- | --- | --- |
| Subtítulo | `custom.subtitle` | Texto de una línea | No | Bajada de la card y del PDP. |
| Introducción PDP | `custom.product_intro` | Texto de una línea | No | Frase debajo del precio o antes de los beneficios. |
| Detalles del producto | `custom.product_details` | Texto enriquecido | No | Acordeón “¿Por qué elegir G4U?”. |
| Ingredientes | `custom.ingredients` | Texto enriquecido | Sí | Acordeón legal/informativo de ingredientes. |
| Información nutricional | `custom.nutrition` | Texto enriquecido | Sí | Tabla o contenido nutricional aprobado. |
| Conservación | `custom.storage` | Texto enriquecido | Sí | Instrucciones de conservación. |
| Envíos | `custom.shipping` | Texto enriquecido | No | Excepciones o indicaciones específicas del producto. |
| Nota de porción | `custom.serving_note` | Texto de una línea | Sí para comparativa | Ejemplo: “2 rebanadas / 60 g”. |
| Unidades por presentación | `custom.units_per_pack` | Número entero | Sí | Texto de card, PDP o combo. |
| Peso neto | `custom.net_weight` | Peso | No | Información comercial del producto. |
| Producto comparable | `custom.comparison_reference` | Referencia a producto | No | Producto o SKU de referencia para comparar. |
| Productos relacionados manuales | `custom.manual_related_products` | Lista de referencias a producto | No | Fallback para upsell específico; usar Search & Discovery primero. |

Los cuatro campos de contenido del acordeón pueden mantenerse como texto enriquecido porque son valores largos, unitarios y no necesitan identidad propia. Si el mismo texto debe aparecer en muchos productos, conviene migrarlo a un metaobjeto de “Contenido de producto” más adelante.

### Metaobjetos relacionados con producto

El producto debe referenciarlos mediante listas o referencias simples. En cada lista, el orden en Shopify debe ser el orden de presentación en la página.

#### `quantity_option` — Opción de compra por cantidad

Para el PDP, las cantidades promocionales no deben modelarse como variantes. Crear un metaobjeto con `quantity` (entero), `label` (texto), `total_price` (dinero), `active` (booleano) y `sort_order` (entero), y referenciarlo desde Producto mediante `custom.quantity_options` como lista.

El selector visual debe escribir la cantidad elegida en el campo nativo `quantity` de la variante única. `total_price` sólo controla el precio mostrado en el botón; para que el importe final coincida en carrito y checkout, la promoción debe existir también como descuento automático, Shopify Functions o mecanismo de bundle. No confiar en un precio calculado únicamente por JavaScript.

#### `product_benefit` — Beneficio de producto

Campos: `title` (texto), `icon` (archivo), `description` (texto enriquecido opcional), `short_label` (texto opcional), `sort_order` (entero opcional).

Referencia desde Producto: `custom.product_benefits` como lista de referencias a `product_benefit`.

Reemplaza los seis campos `benefit_1` a `benefit_6` del bloque `g4u_benefits`. La implementación actual ya soporta una lista y busca `benefit.title`.

#### `product_ingredient` — Ingrediente o componente destacado

Campos: `title`, `icon`, `summary`, `details`, `image`, `technical_name`, `approved_claim`.

Referencia: `custom.featured_ingredients` como lista.

Alimenta `g4u-product-ingredients` y permite reutilizar “Almidón resistente RS4”, “Fibras funcionales” o “Proteínas de alta calidad” en PDP, Nuestra Harina y contenido editorial. `approved_claim` debería contener únicamente texto validado por el equipo técnico/legal.

#### `product_review` — Reseña curada

Campos: `quote`, `author_name`, `rating` (entero 1–5), `author_avatar`, `author_role`, `source`, `published_at`, `is_featured`.

Referencia: `custom.product_reviews` como lista.

Usar sólo si las reseñas se administrarán manualmente. Si una app de reviews es la fuente de verdad, no duplicarlas aquí: el tema debe consumir la app y este metaobjeto puede reservarse para testimonios editoriales.

#### `product_faq` — Pregunta frecuente específica

Campos: `question`, `answer`, `sort_order`, `is_published`.

Referencia: `custom.product_faq` como lista.

Separa las preguntas específicas de un SKU de las FAQs generales de `page.faqs.json`.

#### `product_editorial_block` — Bloque editorial PDP

Campos: `eyebrow`, `title`, `body`, `checklist` (lista de texto o texto enriquecido), `image`, `image_alt`, `image_position`, `background`, `link_label`, `link`.

Referencia: `custom.editorial_blocks` como lista.

Reemplaza los bloques `product_ideas` y `product_flour` de `templates/product.json`. El layout y el orden siguen siendo responsabilidad de la sección; el metaobjeto sólo contiene contenido.

#### `nutrition_comparison` — Comparativa nutricional

Campos: `title`, `other_heading`, `g4u_heading`, `other_image`, `g4u_image`, `serving_note`, `source_note`, `metrics`.

Para `metrics`, la opción más mantenible es una lista de referencias a otro metaobjeto:

`nutrition_metric`: `label`, `unit`, `other_value`, `g4u_value`, `sort_order`.

Referencia desde Producto: `custom.nutrition_comparison` como referencia simple a `nutrition_comparison`.

Esto evita guardar una tabla como JSON y permite editar, ordenar y reutilizar cada métrica. No mostrar valores nutricionales sin una fuente técnica aprobada.

## Modelo recomendado para contenido global

No todo debe vivir en el producto. Estos registros se usan en varias páginas y conviene administrarlos una sola vez:

| Metaobjeto | Campos principales | Referencia o uso |
| --- | --- | --- |
| `expert` | nombre, rol, cita, avatar, imagen, video, usuario social, perfil | Lista global o `custom.experts` si el orden cambia por producto. |
| `service_benefit` | icono, título, texto, enlace, activo | Home, colecciones, PDP y carrito. |
| `science_tab` | etiqueta, imagen, antetítulo, título, texto, beneficios | Home y Nuestra Harina. |
| `low_carb_benefit` | icono, título, texto, orden | Home, PLP y PDP. |
| `faq_group` | título, descripción, preguntas | Página FAQ y posibles FAQs por categoría. |
| `faq_item` | pregunta, respuesta, grupo, orden, publicado | Referenciado por `faq_group` o por una página. |
| `category_card` | título, imagen, enlace, label del botón, orden | Categorías de Home; si sólo existe una vez, puede seguir como block. |

Los textos de hero, manifiesto, footer, newsletter y CTAs generales pueden seguir como settings de sección. No ganan valor al transformarse en metaobjetos si no hay reutilización, relaciones o edición fuera del layout.

## Qué no convertir

- Precio, precio comparativo, inventario, SKU, peso de variante, imágenes principales y disponibilidad: son datos nativos de producto/variante.
- Colecciones, navegación y productos relacionados estándar: deben venir de Shopify y Search & Discovery.
- Colores, fondo, posición de imagen, cantidad de productos, padding y opciones responsive: son configuración visual de sección.
- Tags como `Proteico`, `Low-Carb` o `Apto Keto`: mantenerlos como tags normalizados sólo si se usan para filtros; para mostrar beneficios controlados, usar `product_benefits`.
- Configuración de envío gratis, descuentos y medios de pago: pertenece a Shopify Admin, no a un metaobjeto del tema.
- Instagram: usar integración/app o URLs administradas desde la sección mientras no exista un CMS editorial que necesite esos registros.

## Oportunidades adicionales detectadas en la segunda revisión

### 1. Datos de variante y presentación

El modelo actual propone unidades y peso a nivel producto, pero en Shopify esos datos pueden cambiar entre variantes. Si un mismo producto tiene presentaciones de 300 g, 600 g o packs distintos, crear estos metafields en **Variantes**:

| Nombre | Namespace y clave | Tipo recomendado | Uso |
| --- | --- | --- | --- |
| Unidades de la variante | `custom.units` | Número entero | “6 unidades”, “12 rebanadas”, etc. |
| Peso de la variante | `custom.net_weight` | Peso | Peso neto mostrado junto a la variante. |
| Nota de variante | `custom.variant_note` | Texto de una línea | Diferencia de formato o conservación. |
| Código de presentación | `custom.pack_code` | Texto de una línea | Integraciones, logística o bundles. |

Mantener `custom.units_per_pack` en Producto sólo cuando sea igual para todas las variantes. No duplicar en ambos niveles sin una regla clara de precedencia.

### 2. Combo y reglas de bundle

`g4u-combo-builder.liquid` contiene hoy los grupos “Panes” y “Snacks” como texto fijo y cada producto se carga como block. Si el combo va a crecer o si habrá reglas de descuento, conviene agregar:

#### `combo_group` — Grupo de combo

Campos: `title`, `handle`, `description`, `icon`, `min_items`, `max_items`, `sort_order`, `available` y `products` (lista de referencias a producto).

Referencia desde una página o una configuración global: `custom.combo_groups` como lista.

#### `combo_offer` — Oferta de combo

Campos: `title`, `minimum_items`, `discount_type` (porcentaje o importe), `discount_value`, `message`, `start_at`, `end_at`, `active`.

Referencia: `custom.combo_offers` como lista, o mantener las reglas en Shopify Functions/descuentos automáticos si el cálculo debe ser transaccional.

El metaobjeto puede definir qué mostrar; no debe ser la fuente de verdad del precio final. El descuento real debe resolverse en Shopify para que carrito y checkout calculen el mismo importe.

### 3. Información de logística por producto

La sección de envíos está repetida en cada acordeón del PDP y la FAQ global contiene zonas y plazos. Si las reglas cambian por producto, zona o cadena de frío, crear un metaobjeto `shipping_profile`:

Campos: `title`, `zones`, `delivery_time`, `temperature_requirement`, `storage_after_delivery`, `free_shipping_eligible` y `note`.

Referencia desde Producto: `custom.shipping_profile` como referencia simple.

Usarlo sólo para información editorial. Tarifas, disponibilidad de métodos y promesas finales deben seguir viniendo de la configuración de Shipping de Shopify.

### 4. Fuente técnica y documentos aprobados

Las secciones de Nuestra Harina incluyen un enlace fijo a un análisis CONICET. Para evitar URLs hardcodeadas y poder actualizar documentos sin tocar Liquid, crear un metaobjeto `technical_document`:

Campos: `title`, `document` (archivo), `document_type`, `issuer`, `published_at`, `version`, `summary` y `is_current`.

Referencia desde una página, producto o metaobjeto: `custom.technical_documents` como lista. Esto también permite vincular ficha nutricional, certificado o análisis de laboratorio con su versión vigente. No publicar más de un documento marcado como actual para la misma finalidad.

### 5. Taxonomía nutricional controlada

Los tags sirven para filtros, pero son texto libre y el snippet actual los busca por coincidencia (`prote`, `low-carb`, `keto`, `fibra`, `azúcar`). Para evitar variaciones como `low carb`, `low-carb` y `Low Carb`, crear un metaobjeto `nutrition_claim`:

Campos: `label`, `handle`, `icon`, `description`, `claim_type`, `display_order`, `is_filterable` y `approval_status`.

Referencia desde Producto: `custom.nutrition_claims` como lista.

Los tags pueden conservarse para compatibilidad con filtros existentes, pero la presentación visible y las afirmaciones deberían salir de referencias aprobadas. `approval_status` no reemplaza la revisión legal; sólo ayuda a evitar mostrar registros incompletos.

### 6. FAQ global: reemplazar preguntas y respuestas paralelas

`g4u-faq-page.liquid` guarda preguntas y respuestas en dos textareas separadas y depende de que ambas mantengan exactamente el mismo orden. Es una estructura frágil: una línea vacía o un reordenamiento puede asociar una respuesta a la pregunta equivocada.

La recomendación es usar `faq_item` con `question`, `answer`, `category`, `sort_order` y `published`, y `faq_group` con `title`, `subtitle` y `items` (lista de referencias a `faq_item`). La página puede referenciar una lista de grupos mediante `custom.faq_groups` o recibir una referencia desde la configuración de la página.

### 7. Social posts, sólo si dejan de ser contenido manual

Los ocho bloques de Instagram actuales son adecuados si el equipo los actualiza manualmente. Si se necesita reutilizar publicaciones en Home, colecciones y campañas, crear `social_post` con `image`, `url`, `alt_text`, `platform`, `published_at` y `active`, y referenciarlo desde una página o sección. No conviene crear este metaobjeto si una integración de Instagram ya sincroniza el feed.

### 8. Contenido de marca reutilizable

Los valores de Nosotros, tabs de ciencia, beneficios low-carb y beneficios de compra aparecen en varias plantillas. En la primera versión pueden seguir como blocks, pero si se espera que el contenido cambie con frecuencia o se publique en más de dos páginas, crear:

- `brand_value`: `title`, `text`, `image`, `sort_order`.
- `nutrition_benefit`: `title`, `text`, `icon`, `claim_type`, `sort_order`.
- `purchase_benefit`: `text`, `icon`, `link`, `active`, `sort_order`.

No migrar estos registros sólo por consistencia técnica: la ganancia aparece cuando se necesita un único cambio reflejado en Home, PLP y PDP.

### 9. Metafields de colección

Las colecciones `Productos` y `Packs` comparten módulos, pero pueden necesitar copy e información propios. Crear en **Colecciones** únicamente los campos que cambian por colección:

| Nombre | Namespace y clave | Tipo recomendado | Uso |
| --- | --- | --- | --- |
| Subtítulo de colección | `custom.subtitle` | Texto de una línea | Bajada bajo el título. |
| Descripción editorial | `custom.editorial_description` | Texto enriquecido | Introducción o cierre de PLP. |
| Beneficios de colección | `custom.collection_benefits` | Lista de referencias a `nutrition_benefit` | Mensajes propios de Packs o Snacks. |
| Imagen móvil de colección | `custom.mobile_image` | Archivo | Hero responsive específico. |
| Productos destacados | `custom.featured_products` | Lista de referencias a producto | Orden editorial distinto al sort estándar. |

No duplicar título, descripción e imagen nativos de la colección; estos campos sólo cubren la capa editorial adicional.

## Priorización de implementación

### Fase 1 — necesaria para completar el PDP

1. Confirmar y crear los metafields simples ya usados por Liquid.
2. Crear `product_benefit` y cargar `custom.product_benefits`.
3. Crear `nutrition_comparison` y `nutrition_metric`.
4. Crear `product_ingredient` y `custom.featured_ingredients`.
5. Migrar editorial, testimonios y FAQ sólo después de confirmar el contenido final.

### Fase 2 — reutilización transversal

1. `expert`.
2. `service_benefit`.
3. `science_tab` y `low_carb_benefit`.
4. `faq_group` y `faq_item`.

### Fase 3 — según crecimiento del catálogo

1. Datos a nivel variante (`custom.units`, `custom.net_weight`, `custom.variant_note`).
2. `combo_group` y `combo_offer` si el combo deja de ser una selección fija de hasta 12 blocks.
3. `shipping_profile` si existen condiciones logísticas diferentes por SKU.
4. `technical_document` y `nutrition_claim` para gobernanza técnica y legal.
5. Metafields de colección y `social_post` sólo cuando haya reutilización real.

## Migración y criterios de QA

1. Crear primero las definiciones en Shopify con descripciones, ejemplos y validaciones de tipo.
2. Cargar un producto simple y uno con variantes para probar fallbacks y cambios de variante.
3. Migrar el contenido de `templates/product.json` a registros, conservando temporalmente los blocks como fallback.
4. Cambiar cada sección para leer el metafield/metaobjeto y ocultarse cuando no haya contenido.
5. Validar orden de listas, imágenes, texto enriquecido, enlaces, accesibilidad y valores vacíos.
6. Comparar PDP, Home, PLP, Packs y carrito con datos reales; eliminar defaults de ejemplo antes de publicar.
7. Mantener una fuente de verdad por dato: no editar la misma reseña, métrica o FAQ en template y en Shopify.

## Convención de nombres

Usar namespace `custom` para campos propios del storefront, nombres en inglés para claves estables y etiquetas visibles en español para el equipo de contenido. Mantener claves en `snake_case`, por ejemplo `custom.featured_ingredients` y `custom.nutrition_comparison`.

### Resultado esperado

Con este modelo, el editor podrá cambiar el contenido de cada producto sin tocar templates, mientras que el código seguirá controlando el layout, los estados y la presentación. El mayor beneficio está en beneficios, ingredientes, comparativas, editorial, FAQs y reseñas; el resto debe permanecer en Shopify nativo o en settings de sección.
