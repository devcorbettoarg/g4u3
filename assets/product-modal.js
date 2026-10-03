if (!customElements.get('product-modal')) {
  customElements.define(
    'product-modal',
    class ProductModal extends ModalDialog {
      constructor() {
        super();
        this.container = this.querySelector('[role="document"]');
        this.previousButton = this.querySelector('[data-product-modal-prev]');
        this.nextButton = this.querySelector('[data-product-modal-next]');
        this.currentCounter = this.querySelector('[data-product-modal-current]');
        this.scrollTimer = null;

        this.previousButton?.addEventListener('click', () => this.move(-1));
        this.nextButton?.addEventListener('click', () => this.move(1));
        this.addEventListener('keydown', (event) => {
          if (event.key === 'ArrowLeft') this.move(-1);
          if (event.key === 'ArrowRight') this.move(1);
        });
        this.container?.addEventListener('scroll', () => {
          window.clearTimeout(this.scrollTimer);
          this.scrollTimer = window.setTimeout(() => this.updateActiveFromScroll(), 80);
        });
      }

      hide() {
        super.hide();
      }

      show(opener) {
        super.show(opener);
        this.showActiveMedia();
      }

      showActiveMedia() {
        this.querySelectorAll(
          `[data-media-id]:not([data-media-id="${this.openedBy.getAttribute('data-media-id')}"])`
        ).forEach((element) => {
          element.classList.remove('active');
        });
        const activeMedia = this.querySelector(`[data-media-id="${this.openedBy.getAttribute('data-media-id')}"]`);
        const activeMediaTemplate = activeMedia.querySelector('template');
        const activeMediaContent = activeMediaTemplate ? activeMediaTemplate.content : null;
        activeMedia.classList.add('active');
        activeMedia.scrollIntoView({ block: 'nearest', inline: 'center' });
        this.updateCounter(activeMedia);

        if (
          activeMedia.nodeName == 'DEFERRED-MEDIA' &&
          activeMediaContent &&
          activeMediaContent.querySelector('.js-youtube')
        )
          activeMedia.loadContent();
      }

      getMediaItems() {
        return Array.from(this.container?.querySelectorAll('[data-media-id]') || []);
      }

      move(direction) {
        const items = this.getMediaItems();
        if (!items.length) return;
        const activeIndex = Math.max(0, items.findIndex((item) => item.classList.contains('active')));
        const nextIndex = (activeIndex + direction + items.length) % items.length;
        items.forEach((item, index) => item.classList.toggle('active', index === nextIndex));
        items[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        this.updateCounter(items[nextIndex]);
      }

      updateActiveFromScroll() {
        const items = this.getMediaItems();
        if (!items.length || !this.container) return;
        const center = this.container.scrollLeft + this.container.clientWidth / 2;
        const activeMedia = items.reduce((closest, item) => {
          const itemCenter = item.offsetLeft + item.offsetWidth / 2;
          return Math.abs(itemCenter - center) < Math.abs(closest.offsetLeft + closest.offsetWidth / 2 - center)
            ? item
            : closest;
        }, items[0]);
        items.forEach((item) => item.classList.toggle('active', item === activeMedia));
        this.updateCounter(activeMedia);
      }

      updateCounter(activeMedia) {
        if (!this.currentCounter) return;
        const index = this.getMediaItems().indexOf(activeMedia);
        if (index >= 0) this.currentCounter.textContent = String(index + 1);
      }
    }
  );
}
