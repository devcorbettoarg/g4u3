/* G4U · Parallax de los heros (home, Nosotros, Harina).
 * Al scrollear hacia abajo, la imagen del hero sube más despacio que el resto de la página.
 * Se aplica a los elementos con [data-g4u-parallax] (el <picture> de cada hero), que viven
 * dentro de un contenedor con overflow: hidden. Como la imagen baja respecto del hero mientras
 * el hero sale por arriba, nunca queda un hueco visible.
 * Velocidad: data-g4u-parallax="0.35" (0 = quieta con la página, 1 = fija en pantalla).
 * Sin JS o con "reducir movimiento" la imagen queda quieta. */
(() => {
  if (window.g4uHeroParallax) return;
  window.g4uHeroParallax = true;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let items = [];
  let ticking = false;

  const collect = () => {
    items = [...document.querySelectorAll('[data-g4u-parallax]')].map((el) => ({
      el,
      speed: Math.min(Math.max(parseFloat(el.dataset.g4uParallax) || 0.35, 0), 1),
      box: el.closest('[data-g4u-parallax-box]') || el.parentElement,
    }));
  };

  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    items.forEach(({ el, speed, box }) => {
      if (reduced.matches) { el.style.transform = ''; return; }
      const rect = box.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) return; // fuera de pantalla: no hace falta calcular
      // Cuánto se corrió el hero hacia arriba (0 mientras está en su lugar).
      const offset = Math.max(-rect.top, 0) * speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });
  };

  const request = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  };

  const init = () => {
    collect();
    if (!items.length) return;
    items.forEach(({ el }) => { el.style.willChange = 'transform'; });
    update();
  };

  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request, { passive: true });
  reduced.addEventListener('change', request);
  document.addEventListener('shopify:section:load', init); // editor del theme
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
