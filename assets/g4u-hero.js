if (!customElements.get('g4u-hero')) {
  customElements.define(
    'g4u-hero',
    class G4uHero extends HTMLElement {
      connectedCallback() {
        this.slides = [...this.querySelectorAll('[data-g4u-slide]')];
        this.dots = [...this.querySelectorAll('[data-g4u-dot]')];
        this.current = 0;
        this.interval = Number(this.dataset.autoplaySeconds || 5) * 1000;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.querySelector('[data-g4u-prev]')?.addEventListener('click', () => this.show(this.current - 1));
        this.querySelector('[data-g4u-next]')?.addEventListener('click', () => this.show(this.current + 1));
        this.dots.forEach((dot, index) => dot.addEventListener('click', () => this.show(index)));
        this.addEventListener('keydown', this.onKeydown.bind(this));
        this.addEventListener('mouseenter', () => this.stop());
        this.addEventListener('mouseleave', () => this.start());
        this.addEventListener('focusin', () => this.stop());
        this.addEventListener('focusout', () => this.start());
        document.addEventListener('visibilitychange', () => document.hidden ? this.stop() : this.start());
        this.show(0, false);
      }

      disconnectedCallback() { this.stop(); }

      onKeydown(event) {
        if (event.key === 'ArrowLeft') this.show(this.current - 1);
        if (event.key === 'ArrowRight') this.show(this.current + 1);
      }

      show(index, restart = true) {
        if (!this.slides.length) return;
        this.current = (index + this.slides.length) % this.slides.length;
        this.slides.forEach((slide, slideIndex) => {
          const active = slideIndex === this.current;
          slide.classList.toggle('is-active', active);
          slide.setAttribute('aria-hidden', String(!active));
        });
        this.dots.forEach((dot, dotIndex) => dot.setAttribute('aria-current', String(dotIndex === this.current)));
        if (restart) { this.stop(); this.start(); }
        else this.start();
      }

      start() {
        if (this.slides.length < 2 || this.reducedMotion || this.dataset.autoplay !== 'true' || this.timer) return;
        this.timer = window.setInterval(() => this.show(this.current + 1, false), this.interval);
      }

      stop() {
        window.clearInterval(this.timer);
        this.timer = null;
      }
    }
  );
}
