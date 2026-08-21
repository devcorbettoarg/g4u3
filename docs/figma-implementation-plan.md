# Plan operativo Figma → Dawn — G4U

Fecha: 21 de agosto de 2026  
Fuente de verdad: [Figma G4U](https://www.figma.com/design/IH6qoc8DmEsYDr9guhzspp/g4u?node-id=0-1) y sus frames de escritorio.  
Base: Dawn 16, Liquid, JSON templates, CSS y JavaScript nativo.

## Objetivo

Llevar el storefront de G4U a la referencia de Figma sin sustituir los flujos nativos de Shopify. Cada módulo debe poder editarse desde el Theme Editor y el contenido específico de cada producto debe provenir de datos Shopify, no de texto o imágenes fijas en código.

## Reglas de implementación

- Reutilizar primero secciones, snippets y tokens existentes; no duplicar pantallas como HTML aislado.
- Configuración global: settings/blocks de sección y navegación del Admin.
- Datos de producto: metafields/metaobjects, media, colecciones, tags, variantes y recomendaciones nativas.
- Mantener compatibilidad Dawn: búsqueda, facetas, variantes, inventario, add-to-cart, cart drawer, cart, accesibilidad y rendimiento.
- Comparar contra Figma en 1440 px y definir explícitamente los comportamientos en 1024, 768, 390 y 360 px, ya que Figma no aporta los frames responsive finales.
- No cerrar una fase sin estados de carga, vacío, error, hover, focus, sticky, teclado y touch cuando correspondan.

## Estado de la base actual

La biblioteca de secciones ya está ampliamente construida: hero, banner de elección, cards, categorías, ciencia/tabs, marquee, comparativas, low-carb, expertos, Instagram, beneficios de servicio, newsletter, FAQ, módulos editoriales, harina, combo y productos. También están compuestas las continuidades extensas de Home, PLP, Packs y PDP en los JSON templates.

Por eso el trabajo restante no es “crear más páginas” indiscriminadamente: es cerrar fidelidad visual, conectar datos reales de Shopify y completar los flujos de compra. La colección de prueba que muestra “Automated Collection” y snowboards es un problema de datos/asignación de plantilla, no un diseño válido de G4U.

## Backlog priorizado

### P0 — fundamentos y conversión

1. **Datos Shopify reales**
   - Cargar/validar productos G4U, imágenes, variantes/unidades, inventario, precios comparados, descuentos y colecciones.
   - Asignar `collection.json` y `collection.packs.json` a colecciones correctas.
   - Configurar navegación, redes, políticas, envío gratis y medios de pago en Admin.
2. **Header, announcement y navegación**
   - Cerrar variantes claro/transparente, sticky, contraste, áreas de toque, logo e iconos.
   - Igualar arquitectura del menú: Productos, Armá tu combo, ¿Por qué G4U es diferente?, Nuestra filosofía y Contacto.
   - Completar mega-menú a partir de menús y colecciones reales, sin productos de demostración.
3. **PLP y filtros**
   - Validar barra cerrada y fila desplegada debajo: Disponibilidad, Precio, Etiquetas y Colección.
   - Confirmar cuatro cards completas por fila a 1440 px, sin scroll horizontal ni cards cortadas.
   - Unificar card: media, unidades, precio/oferta, badge y chips.
4. **PDP y metacampos**
   - Completar la matriz de metafields de producto para acordeones, beneficios, ingredientes, nutrición, conservación, envíos, usos, comparativa, FAQ, contenido editorial y cross-sell.
   - Validar thumbnails verticales a la izquierda en desktop, selección activa, zoom/lightbox y versión móvil.
   - Contrastar bloque de compra: unidades/variantes, CTA, disponibilidad, envío, medios de pago y acordeones.
5. **Carrito y cart drawer**
   - Probar add-to-cart con variante por defecto, variante elegida, sin stock, error de red, quantities y eliminación.
   - Validar drawer pegado a la derecha, progreso de envío, recomendaciones y actualización de icono/total.
   - Completar carrito de página: cupón, comentario, link compartible, resumen y recomendaciones.

### P1 — continuidad visual de las pantallas

1. **Home**: QA sección por sección del hero, banner de elección, packs, categorías, ciencia, comparativa, profesionales, CTA editorial, Instagram y cierre.
2. **PLP/Packs**: comprobar que la secuencia post-grilla respete Figma: marquee, low-carb, profesionales, Instagram, beneficios, newsletter y footer.
3. **PDP**: validar que la secuencia completa se entregue en este orden: comparación, ingredientes, usos, harina, marquee, low-carb, testimonios, relacionados, FAQ y cierre compartido.
4. **Armá tu combo**: definir regla de negocio de descuentos 5/10/15 %, mínimos por grupo, stock y el modelo de líneas que se agrega al carrito.
5. **Editorial**: Nosotros y Nuestra Harina requieren QA de assets, copy, CTA y espaciado, no una reconstrucción paralela.

### P2 — páginas y superficies de plataforma

1. FAQ: categorías, preguntas/respuestas, acordeones y CTA de contacto.
2. Contacto: envío real del formulario, validación, éxito/error, imagen y responsive.
3. Legales: contenido definitivo de políticas, fecha, ancho de lectura y enlaces de footer.
4. Checkout y login: configurar desde **Checkout and accounts editor**. Su estructura no se controla con Liquid; cualquier diferencia no soportada requiere evaluar Checkout UI Extensions y el plan Shopify.

### P3 — QA de cierre

- Responsive en 1440, 1024, 768, 390 y 360 px.
- Navegación por teclado, foco visible, contraste, textos alternativos y `prefers-reduced-motion`.
- Estados de facetas, menú, búsqueda, carruseles, acordeones, variantes, checkout y carrito vacío.
- Rendimiento: imágenes con media Shopify, tamaños responsivos, carga diferida y sin assets temporales de Figma.
- `shopify theme check --fail-level error`, revisión visual y flujo de compra real en preview.

## Modelo de datos requerido

| Dominio | Fuente Shopify recomendada |
| --- | --- |
| Título, precio, variante, inventario y media | Producto/variante nativos |
| Unidades, subtítulo, ingredientes, nutrición, conservación y envío | Metafields de producto |
| Beneficios, comparativa, FAQs, usos, editorial y media adicional | Metaobjects o metafields de referencia por producto |
| Productos relacionados y upsells | Shopify Search & Discovery / metafield de lista de productos |
| Menú y mega-menú | Navigation + colecciones reales |
| Hero, textos globales, expertos, Instagram y beneficios | Settings/blocks de secciones |
| Umbral/envíos/descuentos/pagos | Shopify Admin; el tema sólo representa el estado calculado |

La definición inicial de campos de producto se mantiene en [`product-metafields.md`](product-metafields.md). Debe extenderse antes de cargar contenido masivo para cubrir la PDP completa.

## Fases y criterios de salida

| Fase | Entregable | Se considera lista cuando… |
| --- | --- | --- |
| 0. Datos y foundations | tokens, tipografía, catálogo/colecciones, navegación | no hay contenido de prueba ni textos/URLs fijos donde deberían existir datos Shopify |
| 1. Shell global | announcement, header, mega-menú, footer y newsletter | las variantes claro/transparente/sticky mantienen contraste, foco y responsive |
| 2. Commerce core | cards, PLP, PDP, filtros y galería | coinciden estructura y estados del Figma usando productos y facetas reales |
| 3. Carrito | drawer, página de carrito, upsells y descuentos | una compra real actualiza líneas, totales y feedback sin recargas erróneas |
| 4. Contenido | Home, harina, nosotros, combo, FAQ, contacto y legales | los módulos siguen el orden Figma y son configurables desde el editor |
| 5. Mobile/QA | validación visual y funcional | no hay cortes, scroll horizontal, superposiciones, errores Theme Check ni flujos rotos |

## Orden de ejecución inmediato

1. Preparar catálogo/colecciones y metacampos con datos G4U reales.
2. Cerrar header + announcement + mega-menú y probar todos sus estados.
3. Corregir PLP/filtros con las cuatro facetas reales y cuatro cards completas.
4. Terminar PDP con datos por producto y comprobar la galería/compra.
5. Terminar y probar drawer/cart en una compra real.
6. Hacer una pasada visual de Home, después las páginas editoriales.
7. Ejecutar QA responsive y configurar checkout/accounts desde Admin.

## Límites explícitos

- Checkout e inicio de sesión no se remaquetan desde este tema Dawn.
- El theme no puede inventar inventario, descuentos o métodos de envío: debe leer lo configurado en Shopify.
- Las afirmaciones nutricionales y de ingredientes deben llegar desde fichas aprobadas; no se completan con copy genérico.
- Las diferencias responsive que Figma no defina se documentan y se aprueban antes de declararlas finales.
