/**
 * Migration script to move products from gallery.ts to Supabase
 * 
 * Run this after:
 * 1. Setting up Supabase (see README-SUPABASE-SETUP.md)
 * 2. Adding environment variables to .env.local
 * 3. Running the schema.sql in Supabase
 * 
 * Usage: node scripts/migrate-products-to-supabase.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Make sure .env.local has:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Import products from gallery.ts
const galleryPath = path.join(__dirname, '..', 'src', 'data', 'gallery.ts');
let products = [];

try {
  // Read and parse the gallery.ts file
  const galleryContent = fs.readFileSync(galleryPath, 'utf8');
  
  // Extract products array using regex (simple approach)
  const productsMatch = galleryContent.match(/export const products: Product\[\] = (\[[\s\S]*?\]);/);
  if (productsMatch) {
    // Evaluate the array (safe since it's our own file)
    products = eval(productsMatch[1]);
  } else {
    throw new Error('Could not find products array in gallery.ts');
  }
} catch (error) {
  console.error('❌ Error reading gallery.ts:', error.message);
  process.exit(1);
}

/**
 * Convert product to Supabase format
 */
function convertToSupabaseProduct(product) {
  return {
    title: product.title,
    slug: product.id, // Use existing ID as slug
    category: product.category,
    description: product.description,
    price: product.price,
    compare_at_price: null,
    image_url: product.image,
    images: [product.image], // Start with main image, we'll add more later
    variants: [], // Will be populated from variant folders later
    inventory_count: 0, // Default to 0, admin will set later
    is_active: true,
  };
}

/**
 * Main migration function
 */
async function migrateProducts() {
  console.log(`🚀 Starting migration of ${products.length} products...\n`);

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  for (const product of products) {
    try {
      const supabaseProduct = convertToSupabaseProduct(product);
      
      // Check if product already exists
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('slug', supabaseProduct.slug)
        .single();

      if (existing) {
        console.log(`⏭️  Skipping "${product.title}" (already exists)`);
        continue;
      }

      // Insert product
      const { data, error } = await supabase
        .from('products')
        .insert(supabaseProduct)
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log(`✅ Migrated: "${product.title}"`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error migrating "${product.title}":`, error.message);
      errorCount++;
      errors.push({ product: product.title, error: error.message });
    }
  }

  console.log(`\n📊 Migration Summary:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);

  if (errors.length > 0) {
    console.log(`\n⚠️  Errors encountered:`);
    errors.forEach(({ product, error }) => {
      console.log(`   - ${product}: ${error}`);
    });
  }

  if (successCount > 0) {
    console.log(`\n🎉 Migration complete! Products are now in Supabase.`);
    console.log(`   Next: Update the website to read from Supabase instead of gallery.ts`);
  }
}

// Run migration
migrateProducts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });








