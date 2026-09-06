import './styles/main.css';
import './styles/embed.css';
import { initI18n, getLanguage, setLanguage, onLanguageChange, updateDOMTranslations } from './i18n';
import { MapRenderer, type DisplayMode } from './cartography/renderer';
import { SplitSlider } from './components/slider';
import { DistortionInspector } from './components/inspector';
import { ComparisonCards } from './components/comparison-cards';
import { PresentationController } from './components/presentation';
import { EmbedModal } from './components/embed-modal';

// Check if running in embed mode via URL query or path
const urlParams = new URLSearchParams(window.location.search);
const isEmbedMode =
  urlParams.get('embed') === 'true' ||
  window.location.pathname.endsWith('embed.html') ||
  window.location.hash === '#/embed';

if (isEmbedMode) {
  document.body.classList.add('embed-mode');
}

// Initialize I18n
initI18n();

// Global References
let renderer: MapRenderer;
let slider: SplitSlider;
let inspector: DistortionInspector;
let comparisonCards: ComparisonCards | null = null;
let presentation: PresentationController;
let embedModal: EmbedModal | null = null;

let currentMode: DisplayMode = (urlParams.get('mode') as DisplayMode) || 'split';

function setupApp(): void {
  const mapContainer = document.getElementById('map-container');
  if (!mapContainer) return;

  // Initialize Map Renderer
  renderer = new MapRenderer({
    container: mapContainer,
    onCountryHover: (_id, name, coords) => {
      if (coords && coords[1] !== undefined) {
        inspector.inspectCoordinates(coords[1], name);
      }
    },
    onCountryClick: (id, name, coords) => {
      if (coords && coords[1] !== undefined) {
        inspector.inspectCoordinates(coords[1], name);
      }
      renderer.highlightTerritory(id);
    },
    onMapClickCoords: (coords) => {
      inspector.inspectCoordinates(coords[1]);
    },
  });

  // Initialize Split Slider
  const stageCard = document.getElementById('map-stage')!;
  slider = new SplitSlider({
    container: stageCard,
    initialPercent: 50,
    onChange: (percent) => {
      renderer.setSplitPercent(percent);
    },
  });

  // Presentation Controller
  presentation = new PresentationController(renderer);

  // Distortion Inspector
  const inspectorContainer = document.getElementById('distortion-inspector')!;
  inspector = new DistortionInspector({
    container: inspectorContainer,
    onTerritorySelected: (terr) => {
      renderer.highlightTerritory(terr.id);
    },
  });

  // Comparison Cards (only in full mode)
  const cardsContainer = document.getElementById('comparison-cards-container');
  if (cardsContainer && !isEmbedMode) {
    comparisonCards = new ComparisonCards({
      container: cardsContainer,
      onPairSelected: (pair) => {
        // Highlight territory A first, update inspector
        inspector.selectTerritory(pair.territoryA);
        renderer.highlightTerritory(pair.territoryA.id);

        // Scroll to map smoothly
        stageCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // If in full or single mode, switch to split to see the comparison
        if (currentMode !== 'split') {
          setMode('split');
        }
      },
    });
  }

  // Embed Modal
  if (!isEmbedMode) {
    embedModal = new EmbedModal();
    const embedBtn = document.getElementById('btn-open-embed');
    if (embedBtn) {
      embedBtn.addEventListener('click', () => {
        embedModal?.open();
      });
    }
  }

  // Setup Controls
  setupControlButtons();

  // Load Map Data
  renderer.loadData('./data/countries-110m.json');

  // Set initial mode
  setMode(currentMode);

  // Update DOM translations
  updateDOMTranslations();

  // Language Change Listener
  onLanguageChange(() => {
    inspector.onLanguageChanged();
    comparisonCards?.onLanguageChanged();
    updateLanguageButtonText();
  });

  setupLanguageButton();
}

function setupControlButtons(): void {
  // Mode buttons
  const modeButtons = document.querySelectorAll<HTMLButtonElement>('.mode-btn');
  modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode as DisplayMode;
      if (mode) {
        setMode(mode);
      }
    });
  });

  // Graticule toggle
  const graticuleBtn = document.getElementById('toggle-graticule');
  if (graticuleBtn) {
    graticuleBtn.addEventListener('click', () => {
      const active = renderer.toggleGraticules();
      graticuleBtn.classList.toggle('active', active);
    });
  }
}

function setMode(mode: DisplayMode): void {
  currentMode = mode;

  // Stop presentation if switching away from morph
  if (mode !== 'morph' && presentation.getActive()) {
    presentation.stop();
  }

  // Update mode buttons UI
  document.querySelectorAll<HTMLButtonElement>('.mode-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  // Handle slider visibility
  if (mode === 'split') {
    slider.setVisible(true);
    renderer.setMode('split');
  } else if (mode === 'mercator') {
    slider.setVisible(false);
    renderer.setMode('mercator');
  } else if (mode === 'equal-earth') {
    slider.setVisible(false);
    renderer.setMode('equal-earth');
  } else if (mode === 'morph') {
    slider.setVisible(false);
    presentation.start();
  }
}

function setupLanguageButton(): void {
  const langBtn = document.getElementById('btn-switch-lang');
  if (!langBtn) return;

  updateLanguageButtonText();

  langBtn.addEventListener('click', () => {
    const current = getLanguage();
    const next = current === 'en' ? 'es' : 'en';
    setLanguage(next);
  });
}

function updateLanguageButtonText(): void {
  const langBtn = document.getElementById('btn-switch-lang');
  if (!langBtn) return;
  const current = getLanguage();
  // Show opposite language as target to switch to
  langBtn.textContent = current === 'en' ? '🌐 Español' : '🌐 English';
}

// Boot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupApp);
} else {
  setupApp();
}
