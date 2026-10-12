# Sugerencias del cart drawer

En **Personalizar tema → Configuración del tema → Carrito → Productos sugeridos del carrito** se pueden editar el título, el máximo de productos (1–6) y la colección de respaldo. La colección del carrito vacío es un ajuste independiente.

Al abrir el drawer, el tema solicita los complementarios de los productos del carrito mediante la API nativa de recomendaciones de Shopify, con `intent=complementary`. Estos productos se configuran por producto en **Shopify Search & Discovery → Recomendaciones → Productos complementarios**.

La lista respeta el orden de los productos del carrito y de sus recomendaciones. Excluye productos agotados, productos ya presentes en el carrito —incluidas otras variantes del mismo producto— y duplicados entre recomendaciones. Consulta hasta tres productos del carrito en paralelo y deja de consultar al completar el máximo elegido.

Si no queda ningún complementario válido, muestra productos disponibles de la colección de respaldo, respetando su orden y excluyendo los productos del carrito. También usa ese respaldo si falla la API o excede ocho segundos. Si no hay recomendaciones ni productos válidos en la colección, oculta el bloque. No completa espacios con la colección cuando hay al menos un complementario válido.

Las tarjetas mantienen la selección de variantes y el botón para agregar una unidad. El listado vuelve a calcularse al agregar o quitar productos, cambiar cantidades y recibir una actualización del carrito por los eventos del tema. Las consultas pendientes se cancelan al reemplazar el drawer. El estilo existente de esta columna solo la muestra en escritorio.

La implementación anterior recorría `collections.all.products`, mostraba hasta seis productos disponibles y descartaba los presentes en el carrito. No usaba Search & Discovery, una colección seleccionada ni afinidad entre productos.

Referencia: [API de recomendaciones de productos de Shopify](https://shopify.dev/docs/api/ajax/reference/product-recommendations).

Validación local en Chrome con respuestas de Shopify simuladas: recomendaciones de varios productos, duplicados, exclusión del carrito, colección de respaldo, errores HTTP, timeout, límites, apertura diferida, actualización por eventos y secciones, y cancelación de consultas. Theme Check no agrega errores respecto del estado previo del tema. La configuración real de complementarios y de la colección se realiza en la tienda.
