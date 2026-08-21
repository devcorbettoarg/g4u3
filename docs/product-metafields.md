# Modelo de datos de producto G4U

Este es el contrato de contenido para acercar el PDP al Figma sin convertirlo en un conjunto de textos fijos. Crear los campos en **Shopify Admin → Configuración → Datos personalizados → Productos**. La implementación debe degradar con elegancia cuando un campo no esté cargado.

## Datos comerciales nativos

Antes de crear metacampos, completar en cada producto: título, descripción, precio y precio comparativo cuando corresponda, SKU, peso, variantes o formatos de compra, disponibilidad, imágenes (mínimo tres) y colección. Las etiquetas comerciales se resuelven con tags normalizados: `Proteico`, `Low-Carb`, `Apto Keto`, `Alto en fibra` y `Sin azúcar agregada`.

La galería del PDP obtiene sus thumbnails de las imágenes nativas y debe permanecer a la izquierda en desktop. No crear un metacampo para reemplazar las imágenes de producto.

## Metacampos básicos

| Nombre | Namespace y clave | Tipo Shopify | Uso |
| --- | --- | --- | --- |
| Subtítulo | `custom.subtitle` | Texto de una línea | Bajada en card PLP y PDP. |
| Detalles del producto | `custom.product_details` | Texto enriquecido | Acordeón “¿Por qué elegir G4U?”. |
| Ingredientes | `custom.ingredients` | Texto enriquecido | Acordeón “Ingredientes”. |
| Información nutricional | `custom.nutrition` | Texto enriquecido | Acordeón “Información nutricional”. |
| Conservación | `custom.storage` | Texto enriquecido | Acordeón “Conservación”. |
| Envíos y entregas | `custom.shipping` | Texto enriquecido | Acordeón “Envíos”. |
| Porción de referencia | `custom.serving_note` | Texto de una línea | Nota del comparativo nutricional. |

## Beneficios y comparativo del PDP

Crear la definición de metaobjeto **Beneficio de producto** y referenciarla desde el producto. Esto evita repetir seis frases y permite ordenar/ocultar beneficios por SKU.

| Campo del metaobjeto | Tipo | Ejemplo / uso |
| --- | --- | --- |
| `title` | Texto de una línea | “Alto en proteína”. |
| `icon` | Archivo o imagen | Ícono lineal del beneficio. |
| `description` | Texto enriquecido | Texto opcional para la ficha. |

Después crear en Producto:

| Nombre | Namespace y clave | Tipo Shopify | Uso |
| --- | --- | --- | --- |
| Beneficios destacados | `custom.product_benefits` | Lista de referencias a “Beneficio de producto” | Reemplaza el listado fijo bajo la introducción del PDP. |
| Introducción PDP | `custom.product_intro` | Texto enriquecido | Reemplaza “El pan de siempre…” cuando cada producto tenga un mensaje distinto. |
| Métricas G4U | `custom.comparison_g4u` | JSON o metaobjeto de métricas | Valores de proteína, carbos, fibra y azúcar de la columna G4U. |
| Métricas comparación | `custom.comparison_other` | JSON o metaobjeto de métricas | Valores de la columna de referencia. |

Para producción, se recomienda un metaobjeto **Comparativo nutricional** con `label`, `other_value`, `g4u_value`, `other_heading`, `g4u_heading`, `serving_note`, `other_image` y `g4u_image`; el producto referencia un único registro. Así las cifras, fotos y porciones son trazables por producto.

## Módulos editoriales específicos

Los módulos del Figma posteriores a la compra deben leer contenido de producto sólo cuando correspondan a ese SKU. Usar metaobjetos en lugar de duplicar secciones por template.

| Metaobjeto recomendado | Campos mínimos | Referencia desde Producto | Uso |
| --- | --- | --- | --- |
| Ingrediente destacado | título, ícono, resumen, detalle, imagen | `custom.featured_ingredients` (lista) | Sección “Ciencia y nutrición en cada ingrediente”. |
| Bloque editorial PDP | eyebrow, título, cuerpo, checklist, imagen, posición | `custom.editorial_blocks` (lista) | Módulos de ideas de consumo y harina. |
| Reseña de producto | nombre, reseña, estrellas, foto/video | `custom.product_reviews` (lista) | Carrusel “Lo dicen quienes ya lo probaron”. |
| Pregunta PDP | pregunta, respuesta | `custom.product_faq` (lista) | FAQ específico, separado de las FAQs globales. |

Los productos relacionados deben venir de **Shopify Search & Discovery** cuando esté disponible. No mantener una lista fija de handles en Liquid.

## Reglas de carga y QA

1. No cargar afirmaciones nutricionales, ingredientes ni valores de tabla sin ficha técnica aprobada.
2. Vincular los metaobjetos sólo a productos publicados y revisar el orden de cada lista.
3. Si falta un campo opcional, ocultar el bloque correspondiente; nunca mostrar texto de ejemplo al cliente.
4. Validar al menos un producto simple y otro con variantes: cambio de precio, media, disponibilidad y CTA.
5. Antes de publicar, comparar desktop y mobile contra el nodo PDP de Figma y verificar los acordeones, el sticky de compra y los thumbnails.
