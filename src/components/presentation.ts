import type { MapRenderer } from '../cartography/renderer';

export class PresentationController {
  private renderer: MapRenderer;
  private isRunning: boolean = false;
  private animFrameId: number | null = null;
  private startTime: number = 0;
  private durationMs: number = 5000; // 5s full cycle

  constructor(renderer: MapRenderer) {
    this.renderer = renderer;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.renderer.setMode('morph');
    this.startTime = performance.now();
    this.loop();
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private loop = (): void => {
    if (!this.isRunning) return;

    const now = performance.now();
    const elapsed = now - this.startTime;
    // Oscillate between 0 (Mercator) and 1 (Equal Earth) using smooth cosine wave
    // Add hold periods at the extremes for clear presentation viewing
    const cycle = (elapsed % this.durationMs) / this.durationMs;
    // Remap: 0.0-0.35 = hold 0, 0.35-0.5 = transition 0->1, 0.5-0.85 = hold 1, 0.85-1.0 = transition 1->0
    let progress: number;
    if (cycle < 0.35) {
      progress = 0; // Mercator
    } else if (cycle < 0.5) {
      // Ease from 0 to 1
      const t = (cycle - 0.35) / 0.15;
      progress = 0.5 - 0.5 * Math.cos(Math.PI * t);
    } else if (cycle < 0.85) {
      progress = 1; // Equal Earth
    } else {
      // Ease from 1 to 0
      const t = (cycle - 0.85) / 0.15;
      progress = 0.5 + 0.5 * Math.cos(Math.PI * t);
    }

    this.renderer.setCrossfadeProgress(progress);
    this.animFrameId = requestAnimationFrame(this.loop);
  };

  public getActive(): boolean {
    return this.isRunning;
  }
}
