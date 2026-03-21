# About section carousel images

1. Add your photos here (e.g. `1.webp`, `2.jpg`, …).
2. Open `src/components/AboutUsStoryCarousel.tsx` and set `ABOUT_CAROUSEL_FILES` to those filenames in order.

Example:

```ts
const ABOUT_CAROUSEL_FILES: readonly string[] = [
  'lily-studio.webp',
  'cape-inspiration.jpg',
];
```

While the list is **empty**, the carousel shows **empty placeholder slots** (same layout, no images).
