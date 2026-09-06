import { en } from './en';
import { es } from './es';

export type Language = 'en' | 'es';
export type TranslationKey = keyof typeof en;

const translations: Record<Language, typeof en> = { en, es };

let currentLanguage: Language = 'en';
const listeners: Array<(lang: Language) => void> = [];

export function initI18n(): Language {
  // Check URL search parameters first: ?lang=es or ?lang=en
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang')?.toLowerCase();

  if (langParam === 'es' || langParam === 'en') {
    currentLanguage = langParam;
  } else {
    // Check localStorage
    const saved = localStorage.getItem('map_lang');
    if (saved === 'es' || saved === 'en') {
      currentLanguage = saved;
    } else {
      // Default to English as specified in requirements
      currentLanguage = 'en';
    }
  }

  return currentLanguage;
}

export function getLanguage(): Language {
  return currentLanguage;
}

export function setLanguage(lang: Language): void {
  if (lang !== 'en' && lang !== 'es') return;
  currentLanguage = lang;
  localStorage.setItem('map_lang', lang);

  // Update URL parameter without full page reload
  const url = new URL(window.location.href);
  url.searchParams.set('lang', lang);
  window.history.replaceState({}, '', url.toString());

  // Notify listeners
  listeners.forEach((fn) => fn(currentLanguage));
  updateDOMTranslations();
}

export function t(key: TranslationKey): string {
  const dict = translations[currentLanguage];
  return dict[key] || en[key] || String(key);
}

export function onLanguageChange(callback: (lang: Language) => void): () => void {
  listeners.push(callback);
  return () => {
    const idx = listeners.indexOf(callback);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

export function updateDOMTranslations(): void {
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n') as TranslationKey;
    if (key) {
      el.textContent = t(key);
    }
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title') as TranslationKey;
    if (key) {
      el.setAttribute('title', t(key));
    }
  });

  document.querySelectorAll<HTMLInputElement>('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder') as TranslationKey;
    if (key) {
      el.setAttribute('placeholder', t(key));
    }
  });

  document.documentElement.lang = currentLanguage;
}
