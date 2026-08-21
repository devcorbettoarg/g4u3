if (!customElements.get('g4u-scroll-carousel')) {
  customElements.define(
    'g4u-scroll-carousel',
    class G4uScrollCarousel extends HTMLElement {
      connectedCallback() {
        this.track = this.querySelector('[data-g4u-scroll-track]');
        this.querySelector('[data-g4u-scroll-prev]')?.addEventListener('click', () => this.move(-1));
        this.querySelector('[data-g4u-scroll-next]')?.addEventListener('click', () => this.move(1));
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
