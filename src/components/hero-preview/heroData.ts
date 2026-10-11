export const HERO_IMAGES = [
  "/hero-section-images/IMG_5220.PNG",
  "/hero-section-images/IMG_5221.jpg",
  "/hero-section-images/IMG_5222.jpg",
  "/hero-section-images/IMG_5223.jpg",
  "/hero-section-images/IMG_5224.jpg",
  "/hero-section-images/IMG_5225.jpg",
  "/hero-section-images/IMG_5226.jpg",
  "/hero-section-images/IMG_5227.jpg",
  "/hero-section-images/IMG_5228.jpg",
  "/hero-section-images/IMG_5229.jpg",
  "/hero-section-images/IMG_5230.jpg",
  "/hero-section-images/IMG_5231.jpg",
  "/hero-section-images/IMG_5232.jpg",
  "/hero-section-images/IMG_5233.jpg",
  "/hero-section-images/IMG_5234.jpg",
  "/hero-section-images/IMG_5235.jpg",
  "/hero-section-images/IMG_5236.jpg",
  "/hero-section-images/IMG_5237.jpg",
];

/**
 * Curated subset of HERO_IMAGES safe for full-bleed text overlay: no printed card/logo text baked
 * into the photo, and real open negative space (sky, sand, water) for the headline to sit over.
 * Several source photos are product-card flatlays with "Creativity by Lily / Handcrafted on Cape Cod"
 * printed on them — great as supporting thumbnails, but they collide with an overlaid script headline
 * when used full-bleed, so they're excluded here.
 */
export const HERO_FULLBLEED_IMAGES = [
  "/hero-section-images/IMG_5226.jpg",
  "/hero-section-images/IMG_5231.jpg",
  "/hero-section-images/IMG_5232.jpg",
  "/hero-section-images/IMG_5233.jpg",
  "/hero-section-images/IMG_5234.jpg",
  "/hero-section-images/IMG_5235.jpg",
  "/hero-section-images/IMG_5236.jpg",
];

/** Lily's own caption language from her brand-inspo board — cycled one at a time instead of stacked. */
export const HERO_TAGLINES = [
  "Handmade with heart",
  "Inspired by the ocean",
  "Made for adventures by the sea",
  "Timeless details, coastal soul",
];

export const heroPalette = {
  pink: "#e394a5", // existing brand primary (var(--logo-pink))
  coral: "#f2879a", // warmer supporting accent for hover/depth
  cream: "#f7f0e8", // existing warm-beige
  paper: "#fefcf9", // existing background
  seafoam: "#a7d1cf", // new secondary accent, ocean palette
  navy: "#4a5d7a", // new deep accent for small text/icons
  ink: "#2d2d2d", // existing foreground
};
