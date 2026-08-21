document.addEventListener('click', (event) => {
  const toggle = event.target.closest('.g4u-facets__toggle');
  if (!toggle) return;

  const form = toggle.closest('.facets__form');
  if (!form) return;

  const isExpanded = form.classList.toggle('g4u-facets--expanded');
  toggle.setAttribute('aria-expanded', String(isExpanded));
});
