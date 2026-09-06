# Equal Earth vs. Mercator — Interactive Cartographic Comparison

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![UN Resolution](https://img.shields.io/badge/UN%20General%20Assembly-Res%20A%2F80%2FL.104-blue.svg)](https://www.un.org)
[![Vite](https://img.shields.io/badge/Bundler-Vite%206-646cff.svg)](https://vitejs.dev/)
[![D3.js](https://img.shields.io/badge/Cartography-D3.js%20Geo-f97316.svg)](https://d3js.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205-3178c6.svg)](https://www.typescriptlang.org/)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-brightgreen.svg)](https://pages.github.com/)

An open-source, mathematically rigorous, interactive educational platform comparing Gerardus Mercator’s 1569 conformal cylindrical projection with the **Equal Earth** projection, officially adopted by the **United Nations General Assembly (Resolution A/80/L.104, approved September 4, 2026)**.

Designed for students, educators, data journalists, and cartographers worldwide. 100% bilingual (**English** and **Español**), zero advertising, zero local commercial branding, and ready for instant iframe embedding.

---

## 🌍 The Historical Context: UN Resolution A/80/L.104

On **September 4, 2026**, the 80th session of the United Nations General Assembly formally approved Resolution **A/80/L.104**, standardizing the **Equal Earth map projection** for all official UN publications, geopolitical dashboards, and educational material.

For over 450 years, the world relied on Gerardus Mercator's 1569 projection. While revolutionary for colonial naval navigation (where constant compass bearings are straight lines), Mercator's mathematical formulation distorts landmass area exponentially toward the poles. This created a persistent Eurocentric visual bias in education and media, vastly inflating Europe and North America while shrinking Africa, South America, and South Asia.

The **Equal Earth** projection, designed in 2018 by cartographers **Bojan Šavrič**, **Tom Patterson**, and **Bernhard Jenny**, solves this challenge: it provides an aesthetically balanced, visually appealing world shape while maintaining **strict equal-area mathematical fidelity (1:1 area ratio worldwide)**.

---

## 📐 Mathematical Foundations

### 1. Mercator Projection (1569) — Conformal Cylindrical
The Mercator projection preserves angles and local shapes (conformality), but its area distortion scale factor $k_A$ grows quadratically with the secant of latitude $\varphi$:

$$\frac{dA_{\text{projected}}}{dA_{\text{sphere}}} = \sec^2(\varphi) = \frac{1}{\cos^2(\varphi)}$$

| Latitude ($\varphi$) | Mercator Area Scale | Area Inflation | Real-World Landmark |
| :--- | :---: | :---: | :--- |
| **$0^\circ$ (Equator)** | $1.0\times$ | $+0\%$ | Congo Basin, Amazon, Indonesia |
| **$30^\circ$ N/S** | $1.33\times$ | $+33\%$ | Cairo, Houston, Shanghai |
| **$45^\circ$ N/S** | $2.00\times$ | $+100\%$ | Bordeaux, Minneapolis, Sapporo |
| **$60^\circ$ N/S** | $4.00\times$ | $+300\%$ | Oslo, Helsinki, Anchorage |
| **$72^\circ$ N** | $10.46\times$ | $+946\%$ | Nuuk (Greenland) |
| **$80^\circ$ N/S** | $33.16\times$ | $+3,216\%$ | Svalbard, North Greenland |
| **$85^\circ$ N/S** | $131.6\times$ | $+13,060\%$ | Polar ice shelf |

### 2. Equal Earth Projection (2018 / UN 2026) — Pseudocylindrical Equal-Area
Equal Earth belongs to the pseudocylindrical equal-area family:

$$\frac{dA_{\text{projected}}}{dA_{\text{sphere}}} = 1.0 \quad (\text{Strictly Constant Everywhere})$$

Its coordinates $(x, y)$ are computed from latitude $\varphi$ and longitude $\lambda$ using calibrated polynomial coefficients:

$$\begin{aligned}
\theta &= \arcsin\left(\frac{\sqrt{3}}{2} \sin \varphi\right) \\
x &= \frac{2 \sqrt{3} \, \lambda \cos \theta}{3 \, (9 A_4 \theta^8 + 7 A_3 \theta^6 + 3 A_2 \theta^2 + A_1)} \\
y &= \theta \, (A_4 \theta^8 + A_3 \theta^6 + A_2 \theta^2 + A_1)
\end{aligned}$$

Where:
- $A_1 = 1.340264$
- $A_2 = -0.081106$
- $A_3 = 0.000893$
- $A_4 = 0.003796$

---

## 🔍 Key Comparative Realities

* **Greenland vs. Africa:**
  * *In Mercator:* Greenland and Africa appear roughly identical in size.
  * *In Reality (Equal Earth):* Africa (**30,370,000 km²**) is **14 times larger** than Greenland (**2,166,086 km²**).
* **Alaska vs. Brazil:**
  * *In Mercator:* Alaska looks almost as big as Brazil.
  * *In Reality (Equal Earth):* Brazil (**8,515,767 km²**) is **5 times larger** than Alaska (**1,717,856 km²**).
* **Europe vs. South America:**
  * *In Mercator:* Europe looks larger than South America.
  * *In Reality (Equal Earth):* South America (**17,840,000 km²**) almost doubles Europe (**10,180,000 km²**).
* **Antarctica:**
  * *In Mercator:* Stretches infinitely across the bottom edge as a gigantic ice wall.
  * *In Reality (Equal Earth):* A compact **14,200,000 km²** continent, smaller than Russia (**17,098,242 km²**).

---

## ✨ Features

- 🎚️ **Interactive 50/50 Split Slider:** Drag with mouse or finger (touch responsive) to reveal the transition line between both projections. Supports keyboard navigation (Arrow keys, Home, End).
- 🧭 **Mathematical Cartography (D3.js):** Genuine projection calculation using `d3.geoEqualEarth()` and `d3.geoMercator()`, aligned at a unified center `[480, 250]` and bounded by a rounded oceanic viewport.
- 🎯 **Distortion Inspector:** Hover or click anywhere on the globe (or tap preset territory pills) to inspect exact latitude, real surface area (km² and sq mi), and Mercator inflation factor ($+X\%$).
- 📽️ **Presentation Mode (Auto Fade):** Smooth crossfade animation with hold cycles, ideal for lecture halls, classroom smartboards, and conference talks.
- 🌐 **True Bilingualism (EN / ES):** English by default, Spanish in one click. Remembers user preference in `localStorage` and supports URL parameters (`?lang=es` / `?lang=en`).
- 🌐 **100% Offline Capability:** All Natural Earth 110m TopoJSON geographic data is pre-bundled in `/public/data/`. Zero external runtime CDNs or network dependencies.
- 📦 **Iframe Embed Ready:** Dedicated minimal view (`/embed.html` or `?embed=true`) for newsrooms, school LMS, and blog posts.

---

## 💻 How to Embed in Your Website or LMS

You can embed the interactive map with a single HTML `<iframe>` snippet:

```html
<iframe
  src="https://<YOUR-USERNAME>.github.io/<YOUR-REPO>/embed.html?lang=en&mode=split"
  width="100%"
  height="540"
  style="border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; max-width: 960px; display: block; margin: auto;"
  title="Equal Earth vs. Mercator - UN Resolution A/80/L.104"
  loading="lazy"
  allowfullscreen>
</iframe>
```

### URL Query Parameters:
| Parameter | Values | Default | Description |
| :--- | :--- | :--- | :--- |
| `lang` | `en`, `es` | `en` | Interface language |
| `mode` | `split`, `equal-earth`, `mercator`, `morph` | `split` | Initial visual mode |
| `embed` | `true`, `false` | `false` | Hides header/footer for iframe use |

---

## 🚀 Quickstart & Development

### Prerequisites
- Node.js 18+
- npm 9+

### Setup
```bash
# Clone the repository
git clone https://github.com/<YOUR-USERNAME>/mercator-vs-equal-earth.git
cd mercator-vs-equal-earth

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Production Build
```bash
npm run build
```
The compiled, optimized static assets will be output to the `dist/` directory.

---

## 🚢 Deployment to GitHub Pages

This project includes a ready-to-use GitHub Actions workflow located at `.github/workflows/deploy.yml`.

To deploy:
1. Push this repository to GitHub.
2. In your GitHub repository, navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Push to the `main` branch. The workflow will automatically compile and publish your site!

---

## 📜 Citations & Academic References

1. **Šavrič, B., Patterson, T., & Jenny, B. (2018).** *The Equal Earth map projection.* International Journal of Geographical Information Science, 33(3), 454–465. [DOI: 10.1080/13658816.2018.1504949](https://doi.org/10.1080/13658816.2018.1504949).
2. **United Nations General Assembly (2026).** *Resolution A/80/L.104: Adoption of the Equal Earth Projection for United Nations Cartographic and Geopolitical Visualizations.* 80th Session, New York.
3. **United Nations Geospatial Information Section (UN GIS).** [https://www.un.org/geospatial](https://www.un.org/geospatial).
4. **Natural Earth.** *1:110m Physical and Cultural Vectors.* [https://www.naturalearthdata.com](https://www.naturalearthdata.com).

---

## ⚖️ License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more details. Open and free for global educational and scientific use.
