if (!customElements.get('g4u-sticky-cart')) {
  customElements.define('g4u-sticky-cart', class extends HTMLElement {
    connectedCallback() {
      this.productInfo = document.getElementById(`MainProduct-${this.dataset.sectionId}`);
      if (!this.productInfo) return;
      this.button = this.querySelector('[data-sticky-submit]');
      this.price = this.querySelector('[data-sticky-price]');
      this.onClick = () => {
        const source = this.getSubmitButton();
        if (!source || source.disabled || source.getAttribute('aria-disabled') === 'true') return;
        // Use the existing form so variant, quantity, validation and cart drawer stay in sync.
        source.click();
      };
      this.button.addEventListener('click', this.onClick);
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
      this.button.disabled = source.disabled || source.getAttribute('aria-disabled') === 'true';
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
    }
  });
}
