if (!customElements.get('g4u-scroll-carousel')) {
  customElements.define(
    'g4u-scroll-carousel',
    class G4uScrollCarousel extends HTMLElement {
      connectedCallback() {
        this.track = this.querySelector('[data-g4u-scroll-track]');
        this.previousButton = this.querySelector('[data-g4u-scroll-prev]');
        this.nextButton = this.querySelector('[data-g4u-scroll-next]');
        this.previousButton?.addEventListener('click', () => this.move(-1));
        this.nextButton?.addEventListener('click', () => this.move(1));
        this.track?.addEventListener('scroll', () => this.updateControls(), { passive: true });
        this.resizeObserver = new ResizeObserver(() => this.updateControls());
        if (this.track) this.resizeObserver.observe(this.track);
        this.updateControls();
      }

      disconnectedCallback() { this.resizeObserver?.disconnect(); }

      updateControls() {
        if (!this.track) return;
        const maximumScroll = Math.max(0, this.track.scrollWidth - this.track.clientWidth);
        const isStatic = maximumScroll < 2;
        this.toggleAttribute('data-g4u-static', isStatic);
        if (this.previousButton) this.previousButton.disabled = isStatic || this.track.scrollLeft <= 1;
        if (this.nextButton) this.nextButton.disabled = isStatic || this.track.scrollLeft >= maximumScroll - 1;
      }

      move(direction) {
        const item = this.track?.firstElementChild;
        if (!this.track || !item) return;
        const gap = Number.parseFloat(getComputedStyle(this.track).columnGap) || 0;
        this.track.scrollBy({ left: direction * (item.getBoundingClientRect().width + gap), behavior: 'smooth' });
      }
    }
  );
}
