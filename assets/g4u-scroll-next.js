/* G4U · Flecha "bajar" de los heros.
 * Baja con scroll suave al módulo que sigue al hero, sin agregar nada a la URL.
 * Si en el editor se eligió otro enlace (una página, no un #ancla), lo respeta y navega. */
(() => {
  if (window.g4uScrollNext) return;
  window.g4uScrollNext = true;

  const nextSection = (link) => {
    const section = link.closest('.shopify-section');
    let next = section?.nextElementSibling;
    while (next && (!next.offsetHeight || !next.classList.contains('shopify-section'))) next = next.nextElementSibling;
    return next;
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-g4u-hero-scroll]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;

    const href = link.getAttribute('href') || '';
    if (href && !href.startsWith('#')) return; // enlace a otra página: navegar normal

    // Un #ancla a otro módulo se respeta; uno dentro del propio hero (p. ej. #contenido) baja al módulo siguiente.
    const section = link.closest('.shopify-section');
    const anchor = href.length > 1 && document.getElementById(decodeURIComponent(href.slice(1)));
    const target = (anchor && !section?.contains(anchor) && anchor) || nextSection(link);
    if (!target) return;

    event.preventDefault();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const top = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  });
})();
