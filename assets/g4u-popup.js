if (!customElements.get('g4u-popup')) {
  customElements.define('g4u-popup', class extends HTMLElement {
    connectedCallback() {
      this.dialog = this.querySelector('dialog');
      if (!this.dialog) return;
      this.controller = new AbortController();
      const options = { signal: this.controller.signal };
      this.key = `g4u-popup:${this.dataset.section}:${this.dataset.campaign}`;
      this.pendingKey = `${this.key}:pending`;
      this.querySelector('.g4u-popup__form')?.addEventListener('submit', () => {
        if (window.Shopify?.designMode) return;
        try {
          sessionStorage.setItem(this.pendingKey, String(Date.now()));
        } catch (_) {
          // Native form submission still works without browser storage.
        }
      }, options);
      this.querySelector('[data-popup-close]').addEventListener('click', () => this.dialog.close(), options);
      this.dialog.addEventListener('click', (event) => {
        if (!this.dataset.closeOverlay || event.target !== this.dialog) return;
        const rect = this.dialog.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
          this.dialog.close();
        }
      }, options);
      this.dialog.addEventListener('close', () => {
        if (!window.Shopify?.designMode) this.remember();
      }, options);
      document.addEventListener('shopify:section:select', (event) => {
        if (event.detail.sectionId === this.dataset.section) this.open(true);
      }, options);
      document.addEventListener('shopify:block:select', (event) => {
        if (event.detail.sectionId === this.dataset.section) this.open(true);
      }, options);
      document.addEventListener('shopify:section:deselect', (event) => {
        if (event.detail.sectionId === this.dataset.section) this.dialog.close();
      }, options);
      if (window.Shopify?.designMode) {
        if (this.dataset.preview === 'true') this.open(true);
        return;
      }
      const result = this.querySelector('[data-popup-result="error"]') || this.querySelector('[data-popup-result="success"]');
      const posted = new URLSearchParams(window.location.search).get('customer_posted') === 'true';
      const ownSubmission = this.pendingSubmission() || window.location.hash === `#${this.dataset.form}`;
      const message = result || (posted && this.querySelector('[data-popup-success]'));
      if (message && ownSubmission) {
        message.hidden = false;
        this.resultMessage = message;
        this.open(true);
        if (message.dataset.popupResult === 'success' || !result && posted) this.remember();
        try {
          sessionStorage.removeItem(this.pendingKey);
        } catch (_) {
          // Storage may be unavailable in private browsing.
        }
        const url = new URL(window.location.href);
        url.searchParams.delete('customer_posted');
        if (url.hash === `#${this.dataset.form}` || url.hash === '#contact_form') url.hash = '';
        window.history.replaceState(window.history.state, '', url);
        return;
      }
      if (this.dataset.enabled !== 'true' || this.dismissed()) return;
      if (this.dataset.pages === 'home' && this.dataset.page !== 'index') return;
      const mobile = window.matchMedia('(max-width: 749px)').matches;
      if (this.dataset.devices === 'desktop' && mobile || this.dataset.devices === 'mobile' && !mobile) return;
      if (this.dataset.trigger === 'scroll') {
        const onScroll = () => {
          const available = document.documentElement.scrollHeight - window.innerHeight;
          if (available <= 0 || window.scrollY / available * 100 >= Number(this.dataset.scroll)) {
            this.open();
            window.removeEventListener('scroll', onScroll);
          }
        };
        window.addEventListener('scroll', onScroll, { passive: true, ...options });
        onScroll();
      } else {
        this.timer = window.setTimeout(() => this.open(), Number(this.dataset.delay) * 1000);
      }
    }

    open(preview = false) {
      if (this.dialog.open || !this.isConnected) return;
      if (!preview && document.querySelector('dialog[open], modal-dialog[open], cart-drawer.active, details-modal details[open]')) {
        this.timer = window.setTimeout(() => this.open(), 1000);
        return;
      }
      this.dialog.showModal();
      this.resultMessage?.focus();
    }

    pendingSubmission() {
      try {
        const submittedAt = Number(sessionStorage.getItem(this.pendingKey));
        if (submittedAt > 0 && Date.now() - submittedAt >= 0 && Date.now() - submittedAt < 1800000) return true;
        sessionStorage.removeItem(this.pendingKey);
      } catch (_) {
        // Fall back to the form anchor when storage is unavailable.
      }
      return false;
    }

    dismissed() {
      try {
        if (this.dataset.frequency === 'always') return false;
        if (this.dataset.frequency === 'session') return sessionStorage.getItem(this.key) === 'dismissed';
        const dismissedAt = Number(localStorage.getItem(this.key));
        return dismissedAt > 0 && Date.now() - dismissedAt < Number(this.dataset.days) * 86400000;
      } catch (_) {
        return false;
      }
    }

    remember() {
      try {
        if (this.dataset.frequency === 'session') sessionStorage.setItem(this.key, 'dismissed');
        if (this.dataset.frequency === 'days') localStorage.setItem(this.key, String(Date.now()));
      } catch (_) {
        // The popup remains usable when browser storage is unavailable.
      }
    }

    disconnectedCallback() {
      window.clearTimeout(this.timer);
      this.controller?.abort();
      if (this.dialog?.open) this.dialog.close();
    }
  });
}
