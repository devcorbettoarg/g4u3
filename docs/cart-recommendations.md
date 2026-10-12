# Sugerencias del cart drawer

En **Personalizar tema → Configuración del tema → Carrito → Productos sugeridos del carrito** se pueden editar el título, el máximo de productos (1–6) y la colección de respaldo. La colección del carrito vacío es un ajuste independiente.

Si el bloque aparece vacío y oculto, seleccioná y guardá una colección de respaldo con productos disponibles que no estén en el carrito, o configurá complementarios para el producto agregado en Search & Discovery. El atributo `hidden` se quita al cargar sugerencias válidas. El título tiene un respaldo en Liquid aunque el ajuste todavía no esté guardado. Al subir el tema, incluí también `config/settings_schema.json`, `assets/g4u-cart-upsells.js`, `sections/g4u-cart-recommendations.liquid` y `snippets/g4u-cart-upsell-product.liquid`; copiar únicamente el markup del drawer no alcanza.

Al abrir el drawer, el tema solicita los complementarios de los productos del carrito mediante la API nativa de recomendaciones de Shopify, con `intent=complementary`. Estos productos se configuran por producto en **Shopify Search & Discovery → Recomendaciones → Productos complementarios**.

La lista respeta el orden de los productos del carrito y de sus recomendaciones. Excluye productos agotados, productos ya presentes en el carrito —incluidas otras variantes del mismo producto— y duplicados entre recomendaciones. Consulta hasta tres productos del carrito en paralelo y deja de consultar al completar el máximo elegido.

Después de los complementarios válidos, siempre completa los espacios restantes con productos disponibles de la colección de respaldo, hasta el máximo elegido. Respeta el orden de la colección y excluye los productos del carrito y los que ya aparecen como complementarios. Por ejemplo, con máximo seis y un complementario, agrega hasta cinco productos de la colección. También usa la colección si falla la API o excede ocho segundos. Si no hay recomendaciones ni productos válidos en la colección, oculta el bloque. Si la colección tiene pocos productos válidos, muestra los disponibles sin repetirlos.

Las tarjetas mantienen la selección de variantes y el botón para agregar una unidad. El listado vuelve a calcularse al agregar o quitar productos, cambiar cantidades y recibir una actualización del carrito por los eventos del tema. Las consultas pendientes se cancelan al reemplazar el drawer. El estilo existente de esta columna solo la muestra en escritorio.

La implementación anterior recorría `collections.all.products`, mostraba hasta seis productos disponibles y descartaba los presentes en el carrito. No usaba Search & Discovery, una colección seleccionada ni afinidad entre productos.

Referencia: [API de recomendaciones de productos de Shopify](https://shopify.dev/docs/api/ajax/reference/product-recommendations).

Validación local en Chrome con respuestas de Shopify simuladas: recomendaciones de varios productos, duplicados, exclusión del carrito, colección de respaldo, errores HTTP, timeout, límites, apertura diferida, actualización por eventos y secciones, y cancelación de consultas. Theme Check no agrega errores respecto del estado previo del tema. La configuración real de complementarios y de la colección se realiza en la tienda.
