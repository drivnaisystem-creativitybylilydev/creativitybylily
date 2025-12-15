/**
 * Scans public/products/** for images and generates src/data/gallery.ts
 * Supports jpg, jpeg, png, webp, avif. Keeps filenames as-is.
 * @fileoverview Node.js script for generating product gallery data
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const PRODUCTS_ROOT = path.join(PUBLIC_DIR, 'products');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'src', 'data', 'gallery.ts');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

/**
 * Recursively walk directory and find image files
 * @param {string} dir - Directory to scan
 * @returns {Array<{abs: string, rel: string}>} Array of image file objects
 */
function walk(dir) {
  try {
    const entries = fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : [];
    /** @type {Array<{abs:string, rel:string}>} */
    const files = [];
    for (const entry of entries) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...walk(abs));
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (IMAGE_EXTS.has(ext)) {
          const rel = '/' + path.relative(PUBLIC_DIR, abs).replace(/\\/g, '/');
          files.push({ abs, rel });
        }
      }
    }
    return files;
  } catch (error) {
    console.warn(`Warning: Could not read directory ${dir}:`, error.message);
    return [];
  }
}

/**
 * Convert filename to title case
 * @param {string} filename - Filename to convert
 * @returns {string} Title case string
 */
function toTitle(filename) {
  const base = path.basename(filename, path.extname(filename));
  return base
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

/**
 * Main function to generate gallery data
 */
function main() {
  try {
    if (!fs.existsSync(PRODUCTS_ROOT)) {
      console.error(`No products directory found at ${PRODUCTS_ROOT}. Create it and add images.`);
      return;
    }

    // Get all category folders (earrings, necklaces, bracelets)
    const categoryFolders = fs.readdirSync(PRODUCTS_ROOT, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

  const products = [];
  
  // Process each category
  for (const category of categoryFolders) {
    const categoryPath = path.join(PRODUCTS_ROOT, category);
    const productFolders = fs.readdirSync(categoryPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const folderName of productFolders) {
      const folderPath = path.join(categoryPath, folderName);
      const imagesInFolder = fs.readdirSync(folderPath, { withFileTypes: true })
        .filter(dirent => dirent.isFile() && IMAGE_EXTS.has(path.extname(dirent.name).toLowerCase()))
        .map(dirent => path.join('/', path.relative(PUBLIC_DIR, folderPath), dirent.name));

      // Only include products that have images
      if (imagesInFolder.length > 0) {
        products.push({
          id: folderName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, ''),
          title: toTitle(folderName),
          category: category,
          image: imagesInFolder[0],
          description: `A beautifully handcrafted piece from the ${toTitle(folderName)} collection, made with love on Cape Cod.`,
          price: 10, // Demo pricing - will be updated later
        });
      }
    }
  }

  const outDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Also create gallery items for hero collage (all individual images)
  const files = walk(PRODUCTS_ROOT);
  const galleryItems = [];
  for (const { rel } of files) {
    const parts = rel.split('/');
    const category = parts[2]; // category name (earrings, necklaces, etc.)
    const productName = parts[3]; // product folder name
    galleryItems.push({
      src: rel,
      title: toTitle(productName),
      collection: toTitle(productName),
      category: category,
    });
  }

    const banner = `// AUTO-GENERATED FILE. Do not edit by hand.\n`;
    const contents = `${banner}export type Product = { id: string; title: string; category: string; image: string; description: string; price: number; };\nexport const products: Product[] = ${JSON.stringify(products, null, 2)};\n\nexport type GalleryItem = { src: string; title: string; collection: string; category: string };\nexport const galleryItems: GalleryItem[] = ${JSON.stringify(galleryItems, null, 2)};\n`;
    fs.writeFileSync(OUTPUT_FILE, contents, 'utf8');
    console.log(`Generated ${OUTPUT_FILE} with ${products.length} products and ${galleryItems.length} gallery items.`);
  } catch (error) {
    console.error('Error generating gallery data:', error.message);
    process.exit(1);
  }
}

main();


