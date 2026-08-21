document.addEventListener('click', (event) => {
  const toggle = event.target.closest('.g4u-facets__toggle');
  if (!toggle) return;

  const form = toggle.closest('.facets__form');
  if (!form) return;

  const isExpanded = form.classList.toggle('g4u-facets--expanded');
  const container = form.closest('.facets-container');
  const wrapper = form.closest('.facets-wrapper');

  container?.classList.toggle('g4u-facets--expanded', isExpanded);
  wrapper?.classList.toggle('g4u-facets--expanded', isExpanded);
  toggle.setAttribute('aria-expanded', String(isExpanded));
});
