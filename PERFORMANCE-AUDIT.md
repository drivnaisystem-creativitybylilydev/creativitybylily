# Performance Audit Summary

Quick reference for keeping the site fast. Run this periodically (e.g. before launch or after big changes).

## What Was Checked / Done

### Build & config
- **Production build** runs successfully (`npm run build`).
- **next.config.ts** updated:
  - Removed deprecated `eslint` and `experimental.serverComponentsExternalPackages`.
  - Using `serverExternalPackages: ['square']` so the Square SDK isn’t bundled.
  - **Production only:** `removeConsole: true` strips `console.*` in production builds to reduce bundle size and noise.

### Images
- Hero and product images use Next.js `<Image>` with:
  - `priority` on above-the-fold hero images.
  - `loading="lazy"` and sensible `sizes` on below-the-fold images.
- `next.config` uses WebP and reasonable `deviceSizes` / `imageSizes` / `qualities`.

### Home page
- **Below-the-fold sections** are loaded with `next/dynamic` so they don’t block first paint:
  - Customer Favorites
  - Featured Events
  - Product Carousel  
- Hero and About stay in the main bundle for a fast first screen.

### Heavy dependencies
- **Square SDK** is externalized (not bundled by Next), which keeps server bundles smaller.
- **Recharts** and **lucide-react** are only used where needed (e.g. admin/analytics).

## Recommended Checks

1. **Lighthouse (manual)**  
   - Build and run: `npm run build && npm run start`  
   - Open the site and run Lighthouse in Chrome DevTools (Performance + Best practices).  
   - Aim for high Performance and no critical issues.

2. **Bundle size**  
   - After `npm run build`, check the printed route list and any warnings.  
   - If you add large dependencies, consider dynamic imports or moving them to server-only code.

3. **Images**  
   - Keep hero and product images in `public/` and reference them via Next `<Image>`.  
   - Avoid huge source files; Next will generate optimized variants.

4. **Fonts**  
   - Layout uses `next/font` (Playfair, Inter, Dancing Script) with `display: swap` to avoid invisible text.

## Quick commands

```bash
npm run build    # Production build (see bundle and any warnings)
npm run start    # Run production server (for Lighthouse or real-device testing)
npm run dev      # Development (Turbopack)
```

No automated performance score is run in CI; run Lighthouse locally when you want to confirm the site runs smoothly.
