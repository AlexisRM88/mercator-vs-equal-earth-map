import { t, getLanguage, type Language } from '../i18n';

export class EmbedModal {
  private backdrop!: HTMLDivElement;
  private codeBox!: HTMLPreElement;
  private copyBtn!: HTMLButtonElement;

  constructor() {
    this.createModal();
  }

  private createModal(): void {
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'modal-backdrop';

    this.backdrop.innerHTML = `
      <div class="modal-box">
        <button class="modal-close-btn" aria-label="Close modal">&times;</button>
        <h3 class="modal-title" data-i18n="embed_modal_title">${t('embed_modal_title')}</h3>
        <p class="modal-desc" data-i18n="embed_modal_desc">${t('embed_modal_desc')}</p>
        
        <div style="display:flex; gap:1rem; margin-bottom:1rem; font-size:0.85rem;">
          <label style="display:flex; align-items:center; gap:0.5rem;">
            <span data-i18n="embed_options_lang">${t('embed_options_lang')}</span>
            <select id="embed-lang-select" style="background:#1f293d; color:#fff; border:1px solid rgba(255,255,255,0.2); border-radius:4px; padding:0.25rem 0.5rem;">
              <option value="en" ${getLanguage() === 'en' ? 'selected' : ''}>English</option>
              <option value="es" ${getLanguage() === 'es' ? 'selected' : ''}>Español</option>
            </select>
          </label>
          <label style="display:flex; align-items:center; gap:0.5rem;">
            <span data-i18n="embed_options_mode">${t('embed_options_mode')}</span>
            <select id="embed-mode-select" style="background:#1f293d; color:#fff; border:1px solid rgba(255,255,255,0.2); border-radius:4px; padding:0.25rem 0.5rem;">
              <option value="split">Split Slider (50/50)</option>
              <option value="equal-earth">Equal Earth Only</option>
              <option value="mercator">Mercator Only</option>
            </select>
          </label>
        </div>

        <pre class="embed-code-box"></pre>

        <div class="modal-actions">
          <button class="btn-pill btn-primary modal-copy-btn" data-i18n="embed_copy_btn">${t('embed_copy_btn')}</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.backdrop);

    this.codeBox = this.backdrop.querySelector('.embed-code-box')!;
    this.copyBtn = this.backdrop.querySelector('.modal-copy-btn')!;
    const closeBtn = this.backdrop.querySelector('.modal-close-btn')!;
    const langSelect = this.backdrop.querySelector('#embed-lang-select') as HTMLSelectElement;
    const modeSelect = this.backdrop.querySelector('#embed-mode-select') as HTMLSelectElement;

    closeBtn.addEventListener('click', () => this.close());
    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) this.close();
    });

    langSelect.addEventListener('change', () => this.updateSnippet());
    modeSelect.addEventListener('change', () => this.updateSnippet());

    this.copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(this.codeBox.textContent || '').then(() => {
        this.copyBtn.textContent = t('embed_copied');
        setTimeout(() => {
          this.copyBtn.textContent = t('embed_copy_btn');
        }, 2500);
      });
    });

    this.updateSnippet();
  }

  public open(): void {
    const langSelect = this.backdrop.querySelector('#embed-lang-select') as HTMLSelectElement;
    if (langSelect) langSelect.value = getLanguage();
    this.updateSnippet();
    this.backdrop.classList.add('open');
  }

  public close(): void {
    this.backdrop.classList.remove('open');
  }

  private updateSnippet(): void {
    const langSelect = this.backdrop.querySelector('#embed-lang-select') as HTMLSelectElement;
    const modeSelect = this.backdrop.querySelector('#embed-mode-select') as HTMLSelectElement;

    const lang: Language = (langSelect?.value as Language) || getLanguage();
    const mode = modeSelect?.value || 'split';

    // Construct clean embed URL
    const baseUrl = window.location.href.split('?')[0].split('#')[0];
    const embedUrl = `${baseUrl.replace(/index\.html$/, '')}embed.html?lang=${lang}&mode=${mode}`;

    const snippet = `<iframe
  src="${embedUrl}"
  width="100%"
  height="540"
  style="border:1px solid rgba(255,255,255,0.1); border-radius:12px; max-width:960px; display:block; margin:auto;"
  title="Equal Earth vs. Mercator - UN Resolution A/80/L.104"
  loading="lazy"
  allowfullscreen>
</iframe>`;

    this.codeBox.textContent = snippet;
  }
}
