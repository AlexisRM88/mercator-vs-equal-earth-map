import {
  COMPARISON_TERRITORIES,
  calculateMercatorDistortion,
  type TerritoryComparison,
} from '../cartography/distortion';
import { t, type TranslationKey } from '../i18n';

export interface InspectorOptions {
  container: HTMLElement;
  onTerritorySelected?: (territory: TerritoryComparison) => void;
}

export class DistortionInspector {
  private container: HTMLElement;
  private onTerritorySelected?: (territory: TerritoryComparison) => void;

  private currentTerritory: TerritoryComparison = COMPARISON_TERRITORIES.greenland;
  private currentLat: number = 72;
  private currentName: string = 'Greenland';

  // Elements
  private territoryPillsContainer!: HTMLDivElement;
  private titleEl!: HTMLSpanElement;
  private latValueEl!: HTMLDivElement;
  private trueAreaEl!: HTMLDivElement;
  private mercatorInflationEl!: HTMLDivElement;
  private equalEarthEl!: HTMLDivElement;

  constructor(options: InspectorOptions) {
    this.container = options.container;
    this.onTerritorySelected = options.onTerritorySelected;

    this.renderSkeleton();
    this.updateData();
  }

  private renderSkeleton(): void {
    this.container.innerHTML = `
      <div class="inspector-header">
        <div class="inspector-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="22" y1="12" x2="18" y2="12"></line>
            <line x1="6" y1="12" x2="2" y2="12"></line>
            <line x1="12" y1="6" x2="12" y2="2"></line>
            <line x1="12" y1="22" x2="12" y2="18"></line>
          </svg>
          <span class="inspector-territory-title">${this.currentName}</span>
        </div>
        <div class="territory-selector-pills"></div>
      </div>
      <div class="inspector-grid">
        <div class="inspector-metric">
          <div class="metric-label" data-i18n="latitude_label">${t('latitude_label')}</div>
          <div class="metric-value inspector-lat-val">72.0° N</div>
          <div class="metric-sub">φ (phi)</div>
        </div>
        <div class="inspector-metric">
          <div class="metric-label" data-i18n="real_area_label">${t('real_area_label')}</div>
          <div class="metric-value inspector-true-area">2,166,086 km²</div>
          <div class="metric-sub inspector-true-area-sub">836,330 sq mi</div>
        </div>
        <div class="inspector-metric">
          <div class="metric-label" data-i18n="mercator_inflation_label">${t('mercator_inflation_label')}</div>
          <div class="metric-value mercator-text inspector-mercator-val">+950%</div>
          <div class="metric-sub inspector-mercator-factor">10.5x ${t('distortion_factor')}</div>
        </div>
        <div class="inspector-metric">
          <div class="metric-label" data-i18n="equal_earth_accuracy_label">${t('equal_earth_accuracy_label')}</div>
          <div class="metric-value equal-text inspector-equal-val">1.0x (100%)</div>
          <div class="metric-sub" data-i18n="equal_earth_status">${t('equal_earth_status')}</div>
        </div>
      </div>
    `;

    this.titleEl = this.container.querySelector('.inspector-territory-title')!;
    this.latValueEl = this.container.querySelector('.inspector-lat-val')!;
    this.trueAreaEl = this.container.querySelector('.inspector-true-area')!;
    this.mercatorInflationEl = this.container.querySelector('.inspector-mercator-val')!;
    this.equalEarthEl = this.container.querySelector('.inspector-equal-val')!;
    this.territoryPillsContainer = this.container.querySelector('.territory-selector-pills')!;

    // Populate territory pills
    this.renderTerritoryPills();
  }

  private renderTerritoryPills(): void {
    this.territoryPillsContainer.innerHTML = '';
    const territories = Object.values(COMPARISON_TERRITORIES);

    for (const terr of territories) {
      const pill = document.createElement('button');
      pill.className = `territory-pill ${terr.id === this.currentTerritory.id ? 'active' : ''}`;
      pill.textContent = t(terr.nameKey as TranslationKey);
      pill.dataset.id = terr.id;

      pill.addEventListener('click', () => {
        this.selectTerritory(terr);
      });

      this.territoryPillsContainer.appendChild(pill);
    }
  }

  public selectTerritory(terr: TerritoryComparison): void {
    this.currentTerritory = terr;
    this.currentLat = terr.centroidLat;
    this.currentName = t(terr.nameKey as TranslationKey);

    // Update active state in pills
    this.territoryPillsContainer.querySelectorAll('.territory-pill').forEach((el) => {
      el.classList.toggle('active', (el as HTMLElement).dataset.id === terr.id);
    });

    this.updateData();

    if (this.onTerritorySelected) {
      this.onTerritorySelected(terr);
    }
  }

  public inspectCoordinates(lat: number, name?: string): void {
    this.currentLat = lat;
    if (name) {
      this.currentName = name;
    } else {
      const hemisphere = lat >= 0 ? 'N' : 'S';
      this.currentName = `Latitude ${Math.abs(lat).toFixed(1)}° ${hemisphere}`;
    }

    // Remove active state from preset pills if custom lat
    this.territoryPillsContainer.querySelectorAll('.territory-pill').forEach((el) => {
      el.classList.remove('active');
    });

    this.updateData(true);
  }

  public updateData(isCustomCoord: boolean = false): void {
    const dist = calculateMercatorDistortion(this.currentLat);
    const hemi = this.currentLat >= 0 ? 'N' : 'S';

    this.titleEl.textContent = this.currentName;
    this.latValueEl.textContent = `${Math.abs(this.currentLat).toFixed(1)}° ${hemi}`;

    if (isCustomCoord) {
      this.trueAreaEl.textContent = '—';
      const subEl = this.container.querySelector('.inspector-true-area-sub') as HTMLElement;
      if (subEl) subEl.textContent = 'Custom point on sphere';
    } else {
      this.trueAreaEl.textContent = `${this.currentTerritory.actualAreaKm2.toLocaleString()} km²`;
      const subEl = this.container.querySelector('.inspector-true-area-sub') as HTMLElement;
      if (subEl) subEl.textContent = `${this.currentTerritory.actualAreaSqMi.toLocaleString()} sq mi`;
    }

    const sign = dist.mercatorInflationPercent >= 0 ? '+' : '';
    this.mercatorInflationEl.textContent = `${sign}${dist.mercatorInflationPercent.toLocaleString()}%`;

    const factorEl = this.container.querySelector('.inspector-mercator-factor') as HTMLElement;
    if (factorEl) {
      factorEl.textContent = `${dist.mercatorInflationFactor.toFixed(2)}x ${t('distortion_factor')}`;
    }

    this.equalEarthEl.textContent = `1.0x (100%)`;
  }

  public onLanguageChanged(): void {
    this.renderTerritoryPills();
    this.currentName = t(this.currentTerritory.nameKey as TranslationKey);
    this.updateData();
  }
}
