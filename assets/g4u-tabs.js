if (!customElements.get('g4u-tabs')) {
  customElements.define(
    'g4u-tabs',
    class G4uTabs extends HTMLElement {
      connectedCallback() {
        this.tabs = [...this.querySelectorAll('[role="tab"]')];
        this.panels = [...this.querySelectorAll('[role="tabpanel"]')];

        this.tabs.forEach((tab, index) => {
          tab.addEventListener('click', () => this.select(index));
          tab.addEventListener('keydown', (event) => this.onKeydown(event, index));
        });
        this.addEventListener('click', (event) => {
          if (event.target.closest('[data-g4u-tabs-previous]')) {
            this.select(this.activeIndex - 1);
          }
          if (event.target.closest('[data-g4u-tabs-next]')) {
            this.select(this.activeIndex + 1);
          }
        });
        this.select(0, false);
      }

      onKeydown(event, index) {
        const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
        if (!keys.includes(event.key)) return;
        event.preventDefault();
        if (event.key === 'Home') this.select(0);
        else if (event.key === 'End') this.select(this.tabs.length - 1);
        else this.select(index + (event.key === 'ArrowRight' ? 1 : -1));
        this.tabs[this.activeIndex]?.focus();
      }

      select(index, announce = true) {
        if (!this.tabs.length) return;
        this.activeIndex = (index + this.tabs.length) % this.tabs.length;
        this.tabs.forEach((tab, tabIndex) => {
          const active = tabIndex === this.activeIndex;
          tab.setAttribute('aria-selected', String(active));
          tab.tabIndex = active ? 0 : -1;
        });
        this.panels.forEach((panel, panelIndex) => {
          const active = panelIndex === this.activeIndex;
          panel.hidden = !active;
          panel.classList.toggle('is-active', active);
        });
        if (announce) this.dispatchEvent(new CustomEvent('g4u:tab-change', { detail: { index: this.activeIndex } }));
      }
    }
  );
}
