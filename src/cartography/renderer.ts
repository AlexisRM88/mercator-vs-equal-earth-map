import type { GeoProjection, GeoPath, GeoPermissibleObjects } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  createEqualEarthProjection,
  createMercatorProjection,
  createGeoPath,
  createGraticule,
} from './projections';

export type DisplayMode = 'split' | 'mercator' | 'equal-earth' | 'morph';

export interface RendererOptions {
  container: HTMLElement;
  onCountryHover?: (countryId: string | number, name: string, coords: [number, number] | null) => void;
  onCountryClick?: (countryId: string | number, name: string, coords: [number, number] | null) => void;
  onMapClickCoords?: (coords: [number, number]) => void;
}

export class MapRenderer {
  private container: HTMLElement;
  private svg!: SVGSVGElement;
  private clipRectEqualEarth!: SVGRectElement;
  private clipRectMercator!: SVGRectElement;
  private mercatorGroup!: SVGGElement;
  private equalEarthGroup!: SVGGElement;
  private graticuleGroupMercator!: SVGGElement;
  private graticuleGroupEqualEarth!: SVGGElement;

  private mercatorProjection: GeoProjection;
  private equalEarthProjection: GeoProjection;
  private mercatorPath: GeoPath<any, GeoPermissibleObjects>;
  private equalEarthPath: GeoPath<any, GeoPermissibleObjects>;

  private worldData: Topology | null = null;
  private countriesGeoJSON: any = null;
  private showGraticules: boolean = true;
  private currentMode: DisplayMode = 'split';
  private splitPercent: number = 50; // 0 to 100

  private onCountryHover?: (id: string | number, name: string, coords: [number, number] | null) => void;
  private onCountryClick?: (id: string | number, name: string, coords: [number, number] | null) => void;
  private onMapClickCoords?: (coords: [number, number]) => void;

  constructor(options: RendererOptions) {
    this.container = options.container;
    this.onCountryHover = options.onCountryHover;
    this.onCountryClick = options.onCountryClick;
    this.onMapClickCoords = options.onMapClickCoords;

    this.mercatorProjection = createMercatorProjection();
    this.equalEarthProjection = createEqualEarthProjection();
    this.mercatorPath = createGeoPath(this.mercatorProjection);
    this.equalEarthPath = createGeoPath(this.equalEarthProjection);

    this.initSVG();
  }

  private initSVG(): void {
    this.container.innerHTML = '';

    const svgNS = 'http://www.w3.org/2000/svg';
    this.svg = document.createElementNS(svgNS, 'svg');
    this.svg.setAttribute('viewBox', `0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`);
    this.svg.setAttribute('class', 'map-svg');
    this.svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    // Defs & ClipPaths
    const defs = document.createElementNS(svgNS, 'defs');

    // Clip for Mercator (left side of slider)
    const clipMercator = document.createElementNS(svgNS, 'clipPath');
    clipMercator.setAttribute('id', 'clip-mercator-side');
    this.clipRectMercator = document.createElementNS(svgNS, 'rect');
    this.clipRectMercator.setAttribute('x', '0');
    this.clipRectMercator.setAttribute('y', '0');
    this.clipRectMercator.setAttribute('width', String(CANVAS_WIDTH * 0.5));
    this.clipRectMercator.setAttribute('height', String(CANVAS_HEIGHT));
    clipMercator.appendChild(this.clipRectMercator);

    // Clip for Equal Earth (right side of slider)
    const clipEqualEarth = document.createElementNS(svgNS, 'clipPath');
    clipEqualEarth.setAttribute('id', 'clip-equal-earth-side');
    this.clipRectEqualEarth = document.createElementNS(svgNS, 'rect');
    this.clipRectEqualEarth.setAttribute('x', String(CANVAS_WIDTH * 0.5));
    this.clipRectEqualEarth.setAttribute('y', '0');
    this.clipRectEqualEarth.setAttribute('width', String(CANVAS_WIDTH * 0.5));
    this.clipRectEqualEarth.setAttribute('height', String(CANVAS_HEIGHT));
    clipEqualEarth.appendChild(this.clipRectEqualEarth);

    defs.appendChild(clipMercator);
    defs.appendChild(clipEqualEarth);
    this.svg.appendChild(defs);

    // Unified ocean background
    const bgRect = document.createElementNS(svgNS, 'rect');
    bgRect.setAttribute('width', String(CANVAS_WIDTH));
    bgRect.setAttribute('height', String(CANVAS_HEIGHT));
    bgRect.setAttribute('rx', '16');
    bgRect.setAttribute('class', 'sphere-bg');
    this.svg.appendChild(bgRect);

    // Layers
    this.mercatorGroup = document.createElementNS(svgNS, 'g');
    this.mercatorGroup.setAttribute('class', 'mercator-layer');
    this.mercatorGroup.setAttribute('clip-path', 'url(#clip-mercator-side)');

    this.equalEarthGroup = document.createElementNS(svgNS, 'g');
    this.equalEarthGroup.setAttribute('class', 'equal-earth-layer');
    this.equalEarthGroup.setAttribute('clip-path', 'url(#clip-equal-earth-side)');

    this.svg.appendChild(this.mercatorGroup);
    this.svg.appendChild(this.equalEarthGroup);

    // Map Click Event for coordinates / latitude inspection
    this.svg.addEventListener('click', (e) => {
      const rect = this.svg.getBoundingClientRect();
      const svgX = ((e.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
      const svgY = ((e.clientY - rect.top) / rect.height) * CANVAS_HEIGHT;

      // Determine which projection is active at this coordinate
      const isRightSide = svgX >= (CANVAS_WIDTH * this.splitPercent) / 100;
      const proj =
        this.currentMode === 'equal-earth'
          ? this.equalEarthProjection
          : this.currentMode === 'mercator'
          ? this.mercatorProjection
          : isRightSide
          ? this.equalEarthProjection
          : this.mercatorProjection;

      const coords = proj.invert ? proj.invert([svgX, svgY]) : null;
      if (coords && this.onMapClickCoords) {
        this.onMapClickCoords(coords as [number, number]);
      }
    });

    this.container.appendChild(this.svg);
  }

  public async loadData(topojsonUrl: string): Promise<void> {
    try {
      const res = await fetch(topojsonUrl);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data: Topology = await res.json();
      this.worldData = data;
      this.render();
    } catch (err) {
      console.error('Failed to load map data:', err);
      // Fallback: try relative path from bundled public
      try {
        const fallbackRes = await fetch('./data/countries-110m.json');
        const fallbackData: Topology = await fallbackRes.json();
        this.worldData = fallbackData;
        this.render();
      } catch (fallbackErr) {
        console.error('Fallback map data also failed:', fallbackErr);
      }
    }
  }

  public setWorldData(topology: Topology): void {
    this.worldData = topology;
    this.render();
  }

  public render(): void {
    if (!this.worldData) return;

    // Convert countries TopoJSON to GeoJSON FeatureCollection
    const countriesObject = (this.worldData.objects as any).countries;
    if (!countriesObject) return;

    this.countriesGeoJSON = feature(this.worldData, countriesObject);
    const graticuleData = createGraticule();

    // Clear previous contents
    this.mercatorGroup.innerHTML = '';
    this.equalEarthGroup.innerHTML = '';

    const svgNS = 'http://www.w3.org/2000/svg';

    // 1. Render Graticules
    this.graticuleGroupMercator = document.createElementNS(svgNS, 'g');
    this.graticuleGroupMercator.setAttribute('class', 'graticule-group');
    const gratMercatorPath = document.createElementNS(svgNS, 'path');
    gratMercatorPath.setAttribute('d', this.mercatorPath(graticuleData) || '');
    gratMercatorPath.setAttribute('class', 'graticule');
    this.graticuleGroupMercator.appendChild(gratMercatorPath);

    this.graticuleGroupEqualEarth = document.createElementNS(svgNS, 'g');
    this.graticuleGroupEqualEarth.setAttribute('class', 'graticule-group');
    const gratEqualPath = document.createElementNS(svgNS, 'path');
    gratEqualPath.setAttribute('d', this.equalEarthPath(graticuleData) || '');
    gratEqualPath.setAttribute('class', 'graticule');
    this.graticuleGroupEqualEarth.appendChild(gratEqualPath);

    this.mercatorGroup.appendChild(this.graticuleGroupMercator);
    this.equalEarthGroup.appendChild(this.graticuleGroupEqualEarth);

    // 2. Render Equator Reference Lines for both projections
    const equatorGeo = {
      type: 'LineString',
      coordinates: [
        [-180, 0],
        [-90, 0],
        [0, 0],
        [90, 0],
        [180, 0],
      ],
    };

    const eqMercator = document.createElementNS(svgNS, 'path');
    eqMercator.setAttribute('d', this.mercatorPath(equatorGeo as any) || '');
    eqMercator.setAttribute('class', 'equator');
    this.mercatorGroup.appendChild(eqMercator);

    const eqEqual = document.createElementNS(svgNS, 'path');
    eqEqual.setAttribute('d', this.equalEarthPath(equatorGeo as any) || '');
    eqEqual.setAttribute('class', 'equator');
    this.equalEarthGroup.appendChild(eqEqual);

    // 3. Render Country Polygons
    const features = this.countriesGeoJSON.features;

    // Mercator Countries
    const mercatorFeaturesGroup = document.createElementNS(svgNS, 'g');
    mercatorFeaturesGroup.setAttribute('class', 'countries-group');
    for (const feat of features) {
      const pathStr = this.mercatorPath(feat);
      if (!pathStr) continue;
      const pathEl = document.createElementNS(svgNS, 'path');
      pathEl.setAttribute('d', pathStr);
      pathEl.setAttribute('class', 'country-feature');
      pathEl.setAttribute('data-id', feat.id || feat.properties?.name || '');
      this.attachFeatureEvents(pathEl, feat, this.mercatorProjection);
      mercatorFeaturesGroup.appendChild(pathEl);
    }
    this.mercatorGroup.appendChild(mercatorFeaturesGroup);

    // Equal Earth Countries
    const equalEarthFeaturesGroup = document.createElementNS(svgNS, 'g');
    equalEarthFeaturesGroup.setAttribute('class', 'countries-group');
    for (const feat of features) {
      const pathStr = this.equalEarthPath(feat);
      if (!pathStr) continue;
      const pathEl = document.createElementNS(svgNS, 'path');
      pathEl.setAttribute('d', pathStr);
      pathEl.setAttribute('class', 'country-feature');
      pathEl.setAttribute('data-id', feat.id || feat.properties?.name || '');
      this.attachFeatureEvents(pathEl, feat, this.equalEarthProjection);
      equalEarthFeaturesGroup.appendChild(pathEl);
    }
    this.equalEarthGroup.appendChild(equalEarthFeaturesGroup);

    this.updateGraticuleVisibility();
    this.updateSplit(this.splitPercent);
    this.setMode(this.currentMode);
  }

  private attachFeatureEvents(pathEl: SVGPathElement, feat: any, proj: GeoProjection): void {
    pathEl.addEventListener('mouseenter', () => {
      const name = feat.properties?.name || String(feat.id || 'Territory');
      const centroid = this.getCentroid(feat, proj);
      if (this.onCountryHover) {
        this.onCountryHover(feat.id, name, centroid);
      }
    });

    pathEl.addEventListener('click', (e) => {
      e.stopPropagation();
      const name = feat.properties?.name || String(feat.id || 'Territory');
      const centroid = this.getCentroid(feat, proj);
      this.highlightTerritory(feat.id);
      if (this.onCountryClick) {
        this.onCountryClick(feat.id, name, centroid);
      }
    });
  }

  private getCentroid(feat: any, proj: GeoProjection): [number, number] | null {
    try {
      const [px, py] = this.equalEarthPath.centroid(feat);
      if (isNaN(px) || isNaN(py)) return null;
      const coords = proj.invert ? proj.invert([px, py]) : null;
      return coords as [number, number] | null;
    } catch {
      return null;
    }
  }

  public highlightTerritory(idOrName: string | number): void {
    this.svg.querySelectorAll('.country-feature').forEach((el) => {
      el.classList.remove('highlighted');
      const featureId = el.getAttribute('data-id');
      if (featureId === String(idOrName)) {
        el.classList.add('highlighted');
      }
    });
  }

  public setSplitPercent(percent: number): void {
    this.splitPercent = Math.max(0, Math.min(100, percent));
    this.updateSplit(this.splitPercent);
  }

  private updateSplit(percent: number): void {
    const splitX = (CANVAS_WIDTH * percent) / 100;

    // Mercator covers [0 to splitX]
    this.clipRectMercator.setAttribute('x', '0');
    this.clipRectMercator.setAttribute('width', String(splitX));

    // Equal Earth covers [splitX to CANVAS_WIDTH]
    this.clipRectEqualEarth.setAttribute('x', String(splitX));
    this.clipRectEqualEarth.setAttribute('width', String(CANVAS_WIDTH - splitX));
  }

  public setMode(mode: DisplayMode): void {
    this.currentMode = mode;

    if (mode === 'split') {
      this.mercatorGroup.setAttribute('clip-path', 'url(#clip-mercator-side)');
      this.equalEarthGroup.setAttribute('clip-path', 'url(#clip-equal-earth-side)');
      this.mercatorGroup.style.opacity = '1';
      this.equalEarthGroup.style.opacity = '1';
      this.mercatorGroup.style.transition = '';
      this.equalEarthGroup.style.transition = '';
      this.updateSplit(this.splitPercent);
    } else if (mode === 'mercator') {
      this.mercatorGroup.removeAttribute('clip-path');
      this.equalEarthGroup.setAttribute('clip-path', 'url(#clip-equal-earth-side)');
      this.clipRectEqualEarth.setAttribute('width', '0');
      this.mercatorGroup.style.opacity = '1';
      this.equalEarthGroup.style.opacity = '0';
    } else if (mode === 'equal-earth') {
      this.equalEarthGroup.removeAttribute('clip-path');
      this.mercatorGroup.setAttribute('clip-path', 'url(#clip-mercator-side)');
      this.clipRectMercator.setAttribute('width', '0');
      this.mercatorGroup.style.opacity = '0';
      this.equalEarthGroup.style.opacity = '1';
    } else if (mode === 'morph') {
      this.mercatorGroup.removeAttribute('clip-path');
      this.equalEarthGroup.removeAttribute('clip-path');
      this.mercatorGroup.style.transition = 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
      this.equalEarthGroup.style.transition = 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
    }
  }

  public setCrossfadeProgress(progress: number): void {
    // progress: 0 = 100% Mercator, 1 = 100% Equal Earth
    if (this.currentMode !== 'morph') return;
    const p = Math.max(0, Math.min(1, progress));
    this.mercatorGroup.style.opacity = String(1 - p);
    this.equalEarthGroup.style.opacity = String(p);
  }

  public toggleGraticules(show?: boolean): boolean {
    this.showGraticules = show !== undefined ? show : !this.showGraticules;
    this.updateGraticuleVisibility();
    return this.showGraticules;
  }

  private updateGraticuleVisibility(): void {
    const display = this.showGraticules ? 'inline' : 'none';
    if (this.graticuleGroupMercator) {
      this.graticuleGroupMercator.style.display = display;
    }
    if (this.graticuleGroupEqualEarth) {
      this.graticuleGroupEqualEarth.style.display = display;
    }
  }
}
