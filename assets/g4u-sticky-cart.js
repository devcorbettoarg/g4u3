if (!customElements.get('g4u-sticky-cart')) {
  customElements.define('g4u-sticky-cart', class extends HTMLElement {
    connectedCallback() {
      this.productInfo = document.getElementById(`MainProduct-${this.dataset.sectionId}`);
      if (!this.productInfo) return;
      this.button = this.querySelector('[data-sticky-submit]');
      this.buyButton = this.querySelector('[data-sticky-buy]');
      this.price = this.querySelector('[data-sticky-price]');
      this.onClick = () => {
        const source = this.getSubmitButton();
        if (!source || source.disabled || source.getAttribute('aria-disabled') === 'true') return;
        // Use the existing form so variant, quantity, validation and cart drawer stay in sync.
        source.click();
      };
      this.button.addEventListener('click', this.onClick);
      this.onBuyClick = () => this.buyNow();
      this.buyButton.addEventListener('click', this.onBuyClick);
      this.intersectionObserver = new IntersectionObserver(([entry]) => {
        this.hidden = entry.boundingClientRect.bottom >= 0;
      });
      this.mutationObserver = new MutationObserver(() => this.sync());
      this.mutationObserver.observe(this.productInfo, {
        subtree: true, childList: true, characterData: true, attributes: true,
        attributeFilter: ['disabled', 'aria-disabled', 'class', 'hidden'],
      });
      this.sync();
    }

    getSubmitButton() {
      return document.getElementById(`ProductSubmitButton-${this.dataset.sectionId}`);
    }

    async buyNow() {
      const source = this.getSubmitButton();
      if (this.buying || !source || source.disabled || source.getAttribute('aria-disabled') === 'true') return;
      const form = source.form;
      if (!form || !form.reportValidity()) return;
      const productForm = source.closest('product-form');
      // Capture associated fields too, including the quantity selected outside the form.
      const body = new FormData(form);
      this.buying = true;
      source.setAttribute('aria-disabled', 'true');
      this.buyButton.setAttribute('aria-busy', 'true');
      productForm?.handleErrorMessage();
      this.sync();
      try {
        const response = await fetch(window.routes.cart_add_url, {
          method: 'POST', headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, body,
        });
        const result = await response.json();
        if (!response.ok || result.status) throw new Error(result.description || result.message);
        window.location.assign(`${window.Shopify?.routes?.root || '/'}checkout`);
      } catch (error) {
        productForm?.handleErrorMessage(error.message || 'No pudimos iniciar la compra. Intentalo nuevamente.');
        productForm?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      } finally {
        this.buying = false;
        source.removeAttribute('aria-disabled');
        this.buyButton.removeAttribute('aria-busy');
        this.sync();
      }
    }

    sync() {
      const source = this.getSubmitButton();
      if (!source) {
        this.hidden = true;
        this.intersectionObserver.disconnect();
        this.observedButton = null;
        return;
      }
      if (source !== this.observedButton) {
        this.intersectionObserver.disconnect();
        this.intersectionObserver.observe(source);
        this.observedButton = source;
      }
      this.button.disabled = this.buying || source.disabled || source.getAttribute('aria-disabled') === 'true';
      this.buyButton.disabled = this.button.disabled;
      this.button.textContent = source.querySelector('span:not(.hidden)')?.textContent.trim() || source.textContent.trim();
      const price = document.getElementById(`price-${this.dataset.sectionId}`)?.querySelector('.price');
      if (price && this.price.innerHTML !== price.outerHTML) this.price.innerHTML = price.outerHTML;
      const error = this.productInfo.querySelector('.product-form__error-message-wrapper:not([hidden])');
      if (error?.textContent.trim() && !this.hidden) {
        this.productInfo.querySelector('product-form')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }

    disconnectedCallback() {
      this.intersectionObserver?.disconnect();
      this.mutationObserver?.disconnect();
      this.button?.removeEventListener('click', this.onClick);
      this.buyButton?.removeEventListener('click', this.onBuyClick);
    }
  });
}
