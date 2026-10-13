if (!customElements.get('g4u-cart-upsells')) {
  customElements.define('g4u-cart-upsells', class extends HTMLElement {
    connectedCallback() {
      this.loaded = false;
      if (this.closest('cart-drawer')?.classList.contains('active')) this.load();
    }

    async load() {
      if (this.loaded) return;
      this.loaded = true;
      this.controller = new AbortController();
      const aside = this.querySelector('aside');
      const list = this.querySelector('[data-upsell-list]');
      const collectionCards = [...list.querySelectorAll('[data-upsell-product]')];
      const productIds = JSON.parse(this.dataset.products || '[]').map(String);
      if (!productIds.length) return;
      const limit = Number(this.dataset.limit) || 6;
      const excluded = new Set(productIds);
      const seen = new Set();
      const cards = [];
      const appendCards = (candidates) => {
        for (const card of candidates) {
          const id = card.dataset.upsellProduct;
          if (excluded.has(id) || seen.has(id) || cards.length >= limit) continue;
          seen.add(id);
          cards.push(card);
        }
      };
      const timeout = window.setTimeout(() => this.controller.abort(), 8000);
      aside.setAttribute('aria-busy', 'true');
      try {
        // Keep cart order, with at most three recommendation requests in flight.
        for (let index = 0; index < productIds.length && cards.length < limit; index += 3) {
          const results = await Promise.allSettled(productIds.slice(index, index + 3).map(async (productId) => {
            const url = new URL(this.dataset.url, window.location.origin);
            url.searchParams.set('section_id', 'g4u-cart-recommendations');
            url.searchParams.set('product_id', productId);
            url.searchParams.set('intent', 'complementary');
            url.searchParams.set('limit', '10');
            const response = await fetch(url, { signal: this.controller.signal });
            if (!response.ok) throw new Error('Recommendation request failed');
            const html = new DOMParser().parseFromString(await response.text(), 'text/html');
            return [...html.querySelectorAll('[data-upsell-product]')];
          }));
          if (!this.isConnected) return;
          for (const result of results) {
            if (result.status !== 'fulfilled') continue;
            appendCards(result.value);
          }
        }
        // Fill remaining slots from the selected collection after complementary products.
        appendCards(collectionCards);
        list.replaceChildren(...cards);
        aside.hidden = !cards.length;
      } finally {
        window.clearTimeout(timeout);
        if (this.isConnected) aside.removeAttribute('aria-busy');
      }
    }

    disconnectedCallback() {
      this.controller?.abort();
    }
  });
}
