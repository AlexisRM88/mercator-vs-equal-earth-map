export const es = {
  // Brand & Header
  app_title: "Equal Earth vs. Mercator",
  app_tagline: "Resolución de la Asamblea General de la ONU A/80/L.104 (4 de Septiembre de 2026)",
  un_badge: "Mapa Oficial Adoptado por la ONU",
  lang_name: "Español",
  switch_lang: "English",

  // Controls
  mode_split: "Deslizador Dividido (50/50)",
  mode_mercator: "Solo Mercator (1569)",
  mode_equal_earth: "Solo Equal Earth (2026)",
  mode_morph: "Presentación Automática (Fade)",
  toggle_graticules: "Retícula (15°)",
  toggle_labels: "Etiquetas",
  embed_button: "Incrustar Mapa",
  github_repo: "Repositorio GitHub",

  // Slider Badges
  label_mercator_side: "MERCATOR (1569) — Conforme / Inflado",
  label_equal_earth_side: "EQUAL EARTH (2026) — Proporciones Reales",
  slider_instruction: "Arrastra el deslizador o usa las flechas del teclado para comparar",

  // Inspector Panel
  inspector_title: "Inspector de Distorsión",
  inspector_instruction: "Pasa el ratón o pulsa cualquier lugar del mapa o selecciona un territorio:",
  latitude_label: "Latitud:",
  real_area_label: "Superficie Real:",
  mercator_inflation_label: "Área Visual Mercator:",
  equal_earth_accuracy_label: "Área Equal Earth:",
  equal_earth_status: "100% Escala Real (0% Distorsión de Área)",
  distortion_factor: "factor de distorsión",
  square_km: "km²",
  square_mi: "mi²",

  // Historical & Scientific Context
  un_resolution_title: "Hito Histórico de la Cartografía",
  un_resolution_subtitle: "Resolución A/80/L.104 — Aprobada el 4 de Septiembre de 2026",
  un_resolution_body_1:
    "El 4 de septiembre de 2026, la Asamblea General de las Naciones Unidas adoptó formalmente la proyección Equal Earth como estándar mundial para todas las publicaciones oficiales de la ONU, material educativo y análisis geopolíticos.",
  un_resolution_body_2:
    "Durante más de cuatro siglos, la proyección de Gerardus Mercator (1569) dominó la navegación náutica porque trazaba rumbos de brújula como líneas rectas. Sin embargo, su fórmula matemática (sec² φ) expande las masas polares hasta el infinito, magnificando a Europa y Norteamérica mientras reduce drásticamente a África, Sudamérica y el Sur Global ecuatorial.",
  un_resolution_body_3:
    "Creada en 2018 por Bojan Šavrič, Tom Patterson y Bernhard Jenny, Equal Earth conserva una estética continental curva natural al tiempo que preserva con exactitud matemática la superficie de los 193 estados miembros.",

  // Key Comparative Pairs
  key_comparisons_title: "Comparaciones Científicas Cruciales",
  key_comparisons_subtitle: "Cómo Mercator distorsiona la percepción geopolítica frente a la realidad",

  pair_greenland_africa_title: "Groenlandia vs. África",
  pair_greenland_africa_mercator: "En Mercator, Groenlandia parece tener el mismo tamaño que África.",
  pair_greenland_africa_truth: "En la realidad, África es 14 veces más grande que Groenlandia (30.37M km² frente a 2.16M km²).",

  pair_alaska_brazil_title: "Alaska vs. Brasil",
  pair_alaska_brazil_mercator: "En Mercator, Alaska parece casi igual en tamaño a Brasil.",
  pair_alaska_brazil_truth: "En la realidad, Brasil es casi 5 veces mayor que Alaska (8.52M km² frente a 1.72M km²).",

  pair_europe_south_america_title: "Europa vs. América del Sur",
  pair_europe_south_america_mercator: "En Mercator, Europa parece igual o más extensa que Sudamérica.",
  pair_europe_south_america_truth: "En la realidad, Sudamérica casi duplica la superficie de Europa (17.84M km² frente a 10.18M km²).",

  pair_antarctica_title: "La Antártida frente a los Continentes",
  pair_antarctica_mercator: "En Mercator, la Antártida se estira infinitamente en la base como una muralla de hielo colosal.",
  pair_antarctica_truth: "En Equal Earth, la Antártida muestra su tamaño real (14.2M km²), siendo más pequeña que Rusia.",

  // Mathematical Specs
  math_section_title: "Fundamentos Matemáticos",
  math_mercator_title: "Mercator (1569) — Fórmula de Distorsión de Área",
  math_mercator_formula: "dA_proj / dA_esfera = sec²(φ) = 1 / cos²(φ)",
  math_mercator_desc: "El área aumenta cuadráticamente con la secante de la latitud φ. A 60° de latitud, la superficie se infla un 400%; a 80°, más del 3,300%.",
  math_equal_earth_title: "Equal Earth (2018) — Pseudocilíndrica de Áreas Iguales",
  math_equal_earth_formula: "dA_proj / dA_esfera = 1.0 (Conservación Exacta)",
  math_equal_earth_desc: "Desarrollada con ecuaciones polinómicas calibradas para minimizar la distorsión angular garantizando cero distorsión de área.",

  // Embed Modal
  embed_modal_title: "Incrustar Mapa en tu Artículo o Portal Educativo",
  embed_modal_desc: "Copia y pega este fragmento iframe limpio y responsivo en cualquier página web, CMS (WordPress, Substack, Medium) o aula virtual:",
  embed_copy_btn: "Copiar Código Embed",
  embed_copied: "¡Copiado al portapapeles!",
  embed_preview_title: "Vista Previa en Vivo",
  embed_options_lang: "Idioma:",
  embed_options_mode: "Modo inicial:",

  // Footer & Credits
  footer_text: "Recurso educativo abierto y gratuito bajo Licencia MIT.",
  credits_title: "Créditos y Referencias",
  credits_authors: "Proyección Equal Earth creada por Bojan Šavrič, Tom Patterson y Bernhard Jenny (2018).",
  credits_un: "Sección de Información Geoespacial de la ONU y Resolución A/80/L.104 de la Asamblea General (2026).",
  credits_d3: "Cartografía interactiva basada en D3.js y TopoJSON Natural Earth 110m.",

  // Territory Names
  greenland: "Groenlandia",
  africa: "África",
  alaska: "Alaska (EE.UU.)",
  brazil: "Brasil",
  europe: "Europa",
  south_america: "América del Sur",
  antarctica: "Antártida",
  australia: "Australia",
  canada: "Canadá",
  india: "India",
  mexico: "México",
  russia: "Federación Rusa",
};
