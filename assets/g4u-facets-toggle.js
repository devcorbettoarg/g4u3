if (!window.g4uFacetsControlsInitialized) {
  window.g4uFacetsControlsInitialized = true;
  let selectedView = 'grid';

  const applyProductView = () => {
    document.querySelectorAll('.template-collection #product-grid').forEach((grid) => {
      grid.classList.toggle('g4u-product-grid--list', selectedView === 'list');
    });
    document.querySelectorAll('.template-collection [data-g4u-view]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.g4uView === selectedView));
    });
  };

  document.addEventListener('click', (event) => {
    const viewButton = event.target.closest('[data-g4u-view]');
    if (viewButton?.closest('.template-collection')) {
      selectedView = viewButton.dataset.g4uView;
      applyProductView();
      return;
    }

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

  const productGridContainer = document.querySelector('.template-collection #ProductGridContainer');
  if (productGridContainer) {
    new MutationObserver(applyProductView).observe(productGridContainer, { childList: true, subtree: true });
  }
}
