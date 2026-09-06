export interface SliderOptions {
  container: HTMLElement;
  initialPercent?: number;
  onChange: (percent: number) => void;
}

export class SplitSlider {
  private container: HTMLElement;
  private dividerLine!: HTMLDivElement;
  private handle!: HTMLDivElement;
  private percent: number;
  private isDragging: boolean = false;
  private onChange: (percent: number) => void;

  constructor(options: SliderOptions) {
    this.container = options.container;
    this.percent = options.initialPercent ?? 50;
    this.onChange = options.onChange;

    this.createElements();
    this.bindEvents();
    this.updatePosition(this.percent);
  }

  private createElements(): void {
    // Divider line
    this.dividerLine = document.createElement('div');
    this.dividerLine.className = 'slider-divider-line';

    // Draggable handle
    this.handle = document.createElement('div');
    this.handle.className = 'slider-handle';
    this.handle.setAttribute('role', 'slider');
    this.handle.setAttribute('tabindex', '0');
    this.handle.setAttribute('aria-label', 'Map projection split slider');
    this.handle.setAttribute('aria-valuemin', '0');
    this.handle.setAttribute('aria-valuemax', '100');
    this.handle.setAttribute('aria-valuenow', String(this.percent));

    // Double arrow icon (horizontal)
    this.handle.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
        <polyline points="9 18 3 12 9 6" style="display:none"></polyline>
        <polyline points="9 6 15 12 9 18"></polyline>
      </svg>
    `;

    this.dividerLine.appendChild(this.handle);
    this.container.appendChild(this.dividerLine);
  }

  private bindEvents(): void {
    // Pointer Events for Dragging (Mouse & Touch)
    const onPointerMove = (e: PointerEvent) => {
      if (!this.isDragging) return;
      this.handlePointerPosition(e.clientX);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.handle.classList.remove('dragging');
      try {
        this.handle.releasePointerCapture(e.pointerId);
      } catch {
        // Fallback for older browsers
      }
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    this.handle.addEventListener('pointerdown', (e: PointerEvent) => {
      e.preventDefault();
      this.isDragging = true;
      this.handle.classList.add('dragging');
      try {
        this.handle.setPointerCapture(e.pointerId);
      } catch {
        // Fallback
      }
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    });

    // Also allow clicking directly on the container to move the slider
    this.container.addEventListener('pointerdown', (e: PointerEvent) => {
      // Ignore if clicking on buttons or controls inside container
      if ((e.target as HTMLElement).closest('.legend-badge, button, a')) return;
      this.handlePointerPosition(e.clientX);
    });

    // Keyboard accessibility
    this.handle.addEventListener('keydown', (e: KeyboardEvent) => {
      let delta = 0;
      const step = e.shiftKey ? 10 : 2;

      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        delta = -step;
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        delta = step;
      } else if (e.key === 'Home') {
        this.setPercent(0);
        return;
      } else if (e.key === 'End') {
        this.setPercent(100);
        return;
      }

      if (delta !== 0) {
        e.preventDefault();
        this.setPercent(this.percent + delta);
      }
    });
  }

  private handlePointerPosition(clientX: number): void {
    const rect = this.container.getBoundingClientRect();
    const x = clientX - rect.left;
    const rawPercent = (x / rect.width) * 100;
    this.setPercent(rawPercent);
  }

  public setPercent(percent: number): void {
    this.percent = Math.max(0, Math.min(100, Math.round(percent)));
    this.updatePosition(this.percent);
    this.handle.setAttribute('aria-valuenow', String(this.percent));
    this.onChange(this.percent);
  }

  public getPercent(): number {
    return this.percent;
  }

  private updatePosition(percent: number): void {
    this.dividerLine.style.left = `${percent}%`;
  }

  public setVisible(visible: boolean): void {
    this.dividerLine.style.display = visible ? 'block' : 'none';
  }
}
