document.querySelectorAll('[data-g4u-quantity-options]').forEach((options) => {
  const input = document.getElementById(options.dataset.quantityInput);
  if (!input) return;

  input.closest('.product-form__quantity')?.classList.add('g4u-quantity-source-hidden');
  const quantityOptions = options.querySelectorAll('[data-g4u-quantity-option]');
  const firstOption = quantityOptions[0];
  if (firstOption) input.value = firstOption.dataset.quantity;
  quantityOptions.forEach((option) => {
    option.addEventListener('click', () => {
      input.value = option.dataset.quantity;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      options.querySelectorAll('[data-g4u-quantity-option]').forEach((item) => {
        const selected = item === option;
        item.classList.toggle('is-selected', selected);
        item.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });
    });
  });
});
