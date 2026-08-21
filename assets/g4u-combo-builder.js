if (!customElements.get('combo-builder')) {
  customElements.define('combo-builder', class ComboBuilder extends HTMLElement {
    connectedCallback() {
      this.items = [...this.querySelectorAll('[data-combo-item]')];
      this.addButton = this.querySelector('[data-combo-add]');
      this.summary = this.querySelector('[data-combo-summary]');
      this.error = this.querySelector('[data-combo-error]');
      this.querySelectorAll('[data-combo-tab]').forEach((tab) => tab.addEventListener('click', () => this.changeTab(tab)));
      this.items.forEach((item) => item.addEventListener('change', () => this.update()));
      this.addButton.addEventListener('click', () => this.addToCart());
      this.update();
    }

    changeTab(tab) {
      const group = tab.dataset.comboTab;
      this.querySelectorAll('[data-combo-tab]').forEach((button) => {
        const active = button === tab;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-selected', active);
      });
      this.querySelectorAll('[data-combo-group]').forEach((product) => {
        product.hidden = product.dataset.comboGroup !== group;
      });
    }

    update() {
      const selected = this.items.filter((item) => item.checked).length;
      this.addButton.disabled = selected === 0;
      this.summary.textContent = selected ? `${selected} ${selected === 1 ? 'producto seleccionado' : 'productos seleccionados'}.` : 'Elegí tus productos para armar el combo.';
    }

    async addToCart() {
      const items = this.items.filter((item) => item.checked).map((item) => ({ id: Number(item.dataset.variantId), quantity: 1 }));
      if (!items.length) return;
      this.addButton.disabled = true;
      this.error.hidden = true;
      try {
        const cart = document.querySelector('cart-drawer');
        const body = { items };
        if (cart) {
          body.sections = cart.getSectionsToRender().map((section) => section.id);
          body.sections_url = window.location.pathname;
          cart.setActiveElement(this.addButton);
        }
        const response = await fetch(this.dataset.cartAddUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, body: JSON.stringify(body) });
        const data = await response.json();
        if (!response.ok || data.status) throw new Error(data.description || 'No se pudo agregar la selección al carrito.');
        if (cart) cart.renderContents(data);
        else window.location.assign(window.routes.cart_url);
      } catch (error) {
        this.error.textContent = error.message;
        this.error.hidden = false;
        this.update();
      }
    }
  });
}
