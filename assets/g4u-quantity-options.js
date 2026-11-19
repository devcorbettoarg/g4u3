/* G4U · Selector de cantidades (1/4/8) del producto.
 * Mantiene sincronizado el input de cantidad de Dawn con la opción elegida:
 * Dawn lo resetea al mínimo al cambiar de variante y después de cada
 * agregado (setQuantityBoundries → quantityUpdate), así que se vuelve a
 * aplicar la opción seleccionada cada vez. Respeta el máximo por stock. */
if (!customElements.get('g4u-quantity-options')) {
  customElements.define(
    'g4u-quantity-options',
    class G4uQuantityOptions extends HTMLElement {
      connectedCallback() {
        this.options = [...this.querySelectorAll('[data-g4u-quantity-option]')];
        if (!this.options.length) return;
        const selected = this.options.find((o) => o.classList.contains('is-selected')) || this.options[0];
        this.selectedQuantity = parseInt(selected.dataset.quantity, 10) || 1;

        this.input?.closest('.product-form__quantity')?.classList.add('g4u-quantity-source-hidden');
        this.onClick = (event) => {
          const option = event.target.closest('[data-g4u-quantity-option]');
          if (!option || option.disabled) return;
          this.select(parseInt(option.dataset.quantity, 10) || 1, true);
        };
        this.addEventListener('click', this.onClick);

        if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
          // Después del reset de Dawn, volver a la opción elegida.
          this.unsubscribers = [
            subscribe(PUB_SUB_EVENTS.quantityUpdate, () => this.apply()),
            subscribe(PUB_SUB_EVENTS.cartUpdate, () => setTimeout(() => this.apply(), 0)),
            subscribe(PUB_SUB_EVENTS.variantChange, () => setTimeout(() => this.apply(), 0)),
          ];
        }
        this.apply();
      }

      disconnectedCallback() {
        this.removeEventListener('click', this.onClick);
        (this.unsubscribers || []).forEach((unsubscribe) => unsubscribe && unsubscribe());
      }

      get input() {
        return document.getElementById(this.dataset.quantityInput);
      }

      select(quantity, notify) {
        this.selectedQuantity = quantity;
        this.apply(notify);
      }

      apply(notify = false) {
        const input = this.input;
        if (!input) return;
        const max = input.max ? parseInt(input.max, 10) : null;
        // Deshabilitar opciones que superan el stock disponible.
        this.options.forEach((option) => {
          const q = parseInt(option.dataset.quantity, 10) || 1;
          option.disabled = max !== null && q > max;
        });
        let quantity = this.selectedQuantity;
        if (max !== null && quantity > max) {
          const allowed = this.options.map((o) => parseInt(o.dataset.quantity, 10)).filter((q) => q <= max);
          quantity = allowed.length ? Math.max(...allowed) : max;
        }
        this.options.forEach((option) => {
          const isSelected = parseInt(option.dataset.quantity, 10) === quantity;
          option.classList.toggle('is-selected', isSelected);
          option.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
        });
        if (String(input.value) !== String(quantity)) {
          input.value = quantity;
          // No publicamos quantityUpdate para no entrar en bucle; el form lee el input al enviar.
          if (notify) input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    }
  );
}
