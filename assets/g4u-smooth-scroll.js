/* G4U · Scroll suave en todo el sitio con Lenis (assets/g4u-lenis.min.js).
 * - Solo suaviza la rueda del mouse / trackpad; en celulares táctiles queda el scroll nativo.
 * - Se frena mientras hay un drawer o modal abierto (carrito, menú, búsqueda, filtros, galería):
 *   Dawn bloquea el scroll con clases overflow-hidden* en <body>/<html>.
 * - Los contenedores con scroll propio (drawers, popups de apps, carruseles) scrollean normal.
 * - No corre con "reducir movimiento" ni dentro del editor de Shopify.
 * La instancia queda en window.g4uLenis para usarla desde otros scripts (p. ej. g4u-scroll-next). */
(() => {
  if (window.g4uLenis !== undefined) return;
  window.g4uLenis = null;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !window.Lenis || (window.Shopify && window.Shopify.designMode)) return;

  // Elementos de apps o de Dawn que tienen su propio scroll y no deben pasar por Lenis.
  const PREVENT = [
    'cart-drawer', 'menu-drawer', '.menu-drawer', 'details[open] .header__submenu',
    '.facets-container', 'facet-filters-form', 'menu-drawer details[open]',
    'predictive-search', '.predictive-search', 'product-modal', '.product-media-modal',
    'modal-dialog', '.modal__content', '.popup-modal', 'quick-add-modal',
    '.kaching-bundles', '#whatsapp-widget-root', '.chat-window',
    '[role="dialog"]', '[aria-modal="true"]', '.klaviyo-form', '[class*="kl-private"]',
  ].join(',');

  const lenis = new window.Lenis({
    autoRaf: true,
    lerp: 0.1,
    smoothWheel: true,
    syncTouch: false,
    anchors: false, // los #anclas los maneja el navegador; la flecha del hero usa g4u-scroll-next
    allowNestedScroll: true,
    prevent: (node) => !!(node && node.closest && node.closest(PREVENT)),
  });
  window.g4uLenis = lenis;

  // Frenar Lenis mientras Dawn (o una app) bloquea el scroll de la página.
  const isLocked = () => {
    const b = document.body, h = document.documentElement;
    const cls = `${b.className} ${h.className}`;
    if (/\boverflow-hidden(-mobile|-tablet|-desktop)?\b/.test(cls)) return true;
    return getComputedStyle(b).overflowY === 'hidden' || getComputedStyle(h).overflowY === 'hidden';
  };
  let locked = false;
  const sync = () => {
    const now = isLocked();
    if (now === locked) return;
    locked = now;
    if (now) lenis.stop(); else lenis.start();
  };
  const observer = new MutationObserver(sync);
  observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
  sync();
})();
