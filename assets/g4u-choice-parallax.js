/* G4U · Parallax del banner "No tenés que elegir entre cuidarte y disfrutar".
 * Misma mecánica que el manifiesto de Nosotros, con recorridos más cortos
 * porque los productos van dentro del título:
 *  - entrada desde distintos lados (posición, escala y giro) según el scroll,
 *  - leve deriva con el scroll una vez adentro,
 *  - seguimiento del mouse (solo con puntero fino),
 *  - flotación suave.
 * Sin JS o con "reducir movimiento" los productos quedan quietos y visibles. */
(() => {
  if (customElements.get('g4u-choice-parallax')) return;

  // Recorridos en "em" del título: escalan con el tamaño de letra (desktop y mobile).
  const PRESETS = [
    // pan de molde: desde arriba a la izquierda
    { entryX: -1.6, entryY: -0.9, startRotate: -9, scrollY: -0.12, mouseX: 0.16, mouseY: 0.12, floatX: 0.03, floatY: 0.045, freq: 0.0011, phase: 0.2 },
    // pan de hamburguesa: desde abajo a la izquierda
    { entryX: -1.3, entryY: 1.0, startRotate: 8, scrollY: 0.1, mouseX: 0.1, mouseY: 0.08, floatX: 0.035, floatY: 0.04, freq: 0.0013, phase: 1.7 },
    // tortilla: desde la derecha
    { entryX: 1.8, entryY: -0.4, startRotate: 11, scrollY: -0.08, mouseX: -0.14, mouseY: 0.1, floatX: 0.03, floatY: 0.05, freq: 0.001, phase: 3.1 },
  ];
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
  const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic
  const lerp = (a, b, t) => a + (b - a) * t;

  class G4uChoiceParallax extends HTMLElement {
    connectedCallback() {
      this.section = this.closest('.g4u-choice-banner') || this;
      this.objects = [...this.section.querySelectorAll('.g4u-choice-banner__object')];
      this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
      if (!this.objects.length || this.reduced.matches) return;

      this.section.classList.add('is-parallax');
      this.pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      this.abort = new AbortController();
      const opts = { passive: true, signal: this.abort.signal };

      this.section.addEventListener('pointermove', (e) => {
        if (!this.finePointer.matches) return;
        const r = this.section.getBoundingClientRect();
        this.pointer.tx = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
        this.pointer.ty = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
      }, opts);
      this.section.addEventListener('pointerleave', () => { this.pointer.tx = 0; this.pointer.ty = 0; }, opts);
      this.reduced.addEventListener('change', () => this.reduced.matches && this.reset(), { signal: this.abort.signal });

      // Solo anima mientras el banner está cerca de la pantalla.
      this.observer = new IntersectionObserver(([entry]) => {
        this.visible = entry.isIntersecting;
        if (this.visible && !this.raf) this.raf = requestAnimationFrame((t) => this.tick(t));
      }, { rootMargin: '20% 0px 20% 0px' });
      this.observer.observe(this.section);
    }

    disconnectedCallback() {
      this.abort?.abort();
      this.observer?.disconnect();
      if (this.raf) cancelAnimationFrame(this.raf);
      this.raf = null;
      this.reset();
    }

    reset() {
      this.section?.classList.remove('is-parallax');
      this.objects?.forEach((o) => { o.style.transform = ''; o.style.opacity = ''; });
    }

    tick(time) {
      this.raf = null;
      if (!this.visible || this.reduced.matches) return;
      const r = this.section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 cuando el banner asoma por abajo, 1 cuando su centro llega cerca del medio de la pantalla.
      const entry = ease(clamp((vh - r.top) / (vh * 0.55 + r.height * 0.5), 0, 1));
      // -1..1 según la posición del centro del banner en la pantalla (deriva con el scroll).
      const drift = clamp((r.top + r.height / 2 - vh / 2) / vh, -1, 1);
      this.pointer.x = lerp(this.pointer.x, this.pointer.tx, 0.08);
      this.pointer.y = lerp(this.pointer.y, this.pointer.ty, 0.08);
      const em = parseFloat(getComputedStyle(this.section.querySelector('.g4u-choice-banner__copy') || this.section).fontSize) || 60;

      this.objects.forEach((o, i) => {
        const p = PRESETS[i % PRESETS.length];
        const out = 1 - entry;
        const x = (p.entryX * out + p.mouseX * this.pointer.x * entry + Math.sin(time * p.freq + p.phase) * p.floatX * entry) * em;
        const y = (p.entryY * out + p.scrollY * drift * entry + p.mouseY * this.pointer.y * entry + Math.cos(time * p.freq * 0.9 + p.phase) * p.floatY * entry) * em;
        const rot = p.startRotate * out + this.pointer.x * 3 * entry;
        const scale = lerp(0.68, 1, entry);
        o.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        o.style.opacity = clamp(entry * 1.4, 0, 1).toFixed(3);
      });
      this.raf = requestAnimationFrame((t) => this.tick(t));
    }
  }

  customElements.define('g4u-choice-parallax', G4uChoiceParallax);
})();
