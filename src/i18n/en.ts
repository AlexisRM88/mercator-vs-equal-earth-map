export const en = {
  // Brand & Header
  app_title: "Equal Earth vs. Mercator",
  app_tagline: "UN General Assembly Resolution A/80/L.104 (Sept 4, 2026)",
  un_badge: "Official UN Adopted Map",
  lang_name: "English",
  switch_lang: "Español",

  // Controls
  mode_split: "Split Slider (50/50)",
  mode_mercator: "Mercator Only (1569)",
  mode_equal_earth: "Equal Earth Only (2026)",
  mode_morph: "Auto Presentation (Fade)",
  toggle_graticules: "Grid (15°)",
  toggle_labels: "Labels",
  embed_button: "Embed Map",
  github_repo: "GitHub Repository",

  // Slider Badges
  label_mercator_side: "MERCATOR (1569) — Conformal / Inflated",
  label_equal_earth_side: "EQUAL EARTH (2026) — True Proportions",
  slider_instruction: "Drag slider or use Arrow keys to compare",

  // Inspector Panel
  inspector_title: "Distortion Inspector",
  inspector_instruction: "Hover or click anywhere on the map or select a territory below:",
  latitude_label: "Latitude:",
  real_area_label: "True Land Area:",
  mercator_inflation_label: "Mercator Visual Area:",
  equal_earth_accuracy_label: "Equal Earth Area:",
  equal_earth_status: "100% True Scale (0% Area Distortion)",
  distortion_factor: "distortion factor",
  square_km: "km²",
  square_mi: "sq mi",

  // Historical & Scientific Context
  un_resolution_title: "Historical Cartographic Milestone",
  un_resolution_subtitle: "Resolution A/80/L.104 — Adopted September 4, 2026",
  un_resolution_body_1:
    "On September 4, 2026, the United Nations General Assembly officially adopted the Equal Earth projection as the standard world map projection for all official UN publications, educational charts, and geopolitical visualizations.",
  un_resolution_body_2:
    "For over four centuries, Gerardus Mercator's 1569 projection dominated maritime navigation because it preserved compass bearings as straight rhumb lines. However, its mathematical formula (sec² φ) causes polar landmasses to expand toward infinity, magnifying Europe and North America while drastically shrinking Africa, South America, and the equatorial Global South.",
  un_resolution_body_3:
    "Created in 2018 by Bojan Šavrič, Tom Patterson, and Bernhard Jenny, Equal Earth retains an aesthetically pleasing continental curvature while rigorously preserving true relative surface areas across all 193 member states.",

  // Key Comparative Pairs
  key_comparisons_title: "Crucial Scientific Comparisons",
  key_comparisons_subtitle: "How Mercator distorts geopolitical perception vs. reality",

  pair_greenland_africa_title: "Greenland vs. Africa",
  pair_greenland_africa_mercator: "In Mercator, Greenland appears as large as Africa.",
  pair_greenland_africa_truth: "In reality, Africa is 14 times larger than Greenland (30.37M km² vs. 2.16M km²).",

  pair_alaska_brazil_title: "Alaska vs. Brazil",
  pair_alaska_brazil_mercator: "In Mercator, Alaska appears almost equal in size to Brazil.",
  pair_alaska_brazil_truth: "In reality, Brazil is nearly 5 times larger than Alaska (8.52M km² vs. 1.72M km²).",

  pair_europe_south_america_title: "Europe vs. South America",
  pair_europe_south_america_mercator: "In Mercator, Europe looks larger or comparable to South America.",
  pair_europe_south_america_truth: "In reality, South America is nearly double the size of Europe (17.84M km² vs. 10.18M km²).",

  pair_antarctica_title: "Antarctica vs. The Continents",
  pair_antarctica_mercator: "In Mercator, Antarctica stretches infinitely across the bottom as an immense ice wall.",
  pair_antarctica_truth: "In Equal Earth, Antarctica displays its true continent size (14.2M km²), smaller than Russia.",

  // Mathematical Specs
  math_section_title: "Mathematical Foundations",
  math_mercator_title: "Mercator (1569) — Area Distortion Formula",
  math_mercator_formula: "dA_proj / dA_sphere = sec²(φ) = 1 / cos²(φ)",
  math_mercator_desc: "Area scales quadratically with the secant of latitude φ. At 60° latitude, land is inflated 400%; at 80°, over 3,300%.",
  math_equal_earth_title: "Equal Earth (2018) — Pseudocylindrical Equal-Area",
  math_equal_earth_formula: "dA_proj / dA_sphere = 1.0 (Exact Conservation)",
  math_equal_earth_desc: "Developed using polynomial equations calibrated to reduce angular distortion while guaranteeing equal-area integrity.",

  // Embed Modal
  embed_modal_title: "Embed Map in Your Article or School Portal",
  embed_modal_desc: "Copy and paste this clean, responsive iframe snippet into any HTML document, CMS (WordPress, Substack, Medium), or educational platform:",
  embed_copy_btn: "Copy Embed Code",
  embed_copied: "Copied to clipboard!",
  embed_preview_title: "Live Preview",
  embed_options_lang: "Language:",
  embed_options_mode: "Default Mode:",

  // Footer & Credits
  footer_text: "Free, open-source educational resource under MIT License.",
  credits_title: "Credits & References",
  credits_authors: "Equal Earth Projection created by Bojan Šavrič, Tom Patterson, and Bernhard Jenny (2018).",
  credits_un: "United Nations Geospatial Information Section & General Assembly Resolution A/80/L.104 (2026).",
  credits_d3: "Cartographic rendering powered by D3.js and Natural Earth 110m TopoJSON.",

  // Territory Names
  greenland: "Greenland",
  africa: "Africa",
  alaska: "Alaska (USA)",
  brazil: "Brazil",
  europe: "Europe",
  south_america: "South America",
  antarctica: "Antarctica",
  australia: "Australia",
  canada: "Canada",
  india: "India",
  mexico: "Mexico",
  russia: "Russian Federation",
};
