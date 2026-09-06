import { COMPARATIVE_PAIRS, type ComparativePair } from '../cartography/distortion';
import { t, type TranslationKey } from '../i18n';

export interface ComparisonCardsOptions {
  container: HTMLElement;
  onPairSelected: (pair: ComparativePair) => void;
}

export class ComparisonCards {
  private container: HTMLElement;
  private onPairSelected: (pair: ComparativePair) => void;

  constructor(options: ComparisonCardsOptions) {
    this.container = options.container;
    this.onPairSelected = options.onPairSelected;

    this.render();
  }

  public render(): void {
    this.container.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'cards-grid';

    for (const pair of COMPARATIVE_PAIRS) {
      const card = document.createElement('div');
      card.className = 'comparison-card';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');

      const multiplierText =
        pair.ratioMultiplier >= 1
          ? `${pair.ratioMultiplier.toFixed(1)}x larger`
          : `${(1 / pair.ratioMultiplier).toFixed(1)}x smaller`;

      card.innerHTML = `
        <div>
          <div class="card-title">
            <span>${t(pair.titleKey as TranslationKey)}</span>
            <span class="card-multiplier">${multiplierText}</span>
          </div>
          <div class="card-mercator-view">
            <strong>Mercator (1569):</strong> ${t(pair.mercatorVisualPerceptionKey as TranslationKey)}
          </div>
          <div class="card-truth-view">
            <strong>Equal Earth (2026):</strong> ${t(pair.trueScientificRatioKey as TranslationKey)}
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        this.onPairSelected(pair);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.onPairSelected(pair);
        }
      });

      grid.appendChild(card);
    }

    this.container.appendChild(grid);
  }

  public onLanguageChanged(): void {
    this.render();
  }
}
