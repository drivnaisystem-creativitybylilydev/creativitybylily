/**
 * One-off import of Lily's Etsy reviews (pasted by hand, since Etsy's
 * DataDome bot-protection blocks headless scraping of the public shop page).
 * Safe to re-run — skips any review whose (reviewer_name, comment) pair
 * already exists, so partial runs (e.g. before the nullable product_id
 * migration is applied) don't create duplicates on a second pass.
 *
 * Usage: node scripts/import-etsy-reviews.js
 */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function loadEnvLocal() {
  const envPath = path.join(__dirname, '..', '.env.local');
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'buyer';
}

async function main() {
  const reviews = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'etsy-reviews-import-data.json'), 'utf8')
  );

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, title');
  if (productsError) throw productsError;

  const productByTitle = new Map(products.map((p) => [p.title.trim().toLowerCase(), p.id]));

  let inserted = 0;
  let skippedDuplicate = 0;
  let matchedProduct = 0;
  let unmatchedProduct = 0;
  let featured = 0;

  for (let i = 0; i < reviews.length; i++) {
    const r = reviews[i];

    const { data: existing } = await supabase
      .from('reviews')
      .select('id')
      .eq('reviewer_name', r.name)
      .eq('comment', r.comment)
      .maybeSingle();

    if (existing) {
      skippedDuplicate++;
      continue;
    }

    const productId = r.productTitle ? productByTitle.get(r.productTitle.trim().toLowerCase()) || null : null;
    if (productId) matchedProduct++;
    else unmatchedProduct++;
    if (r.featured) featured++;

    const createdAt = `${r.date}T12:00:00Z`;
    const reviewerEmail = `etsy-import+${slugify(r.name)}-${i}@import.creativitybylily.co`;

    const { error: insertError } = await supabase.from('reviews').insert({
      product_id: productId,
      order_id: null,
      reviewer_name: r.name,
      reviewer_email: reviewerEmail,
      rating: r.rating,
      title: null,
      comment: r.comment,
      images: [],
      is_approved: true,
      is_featured: !!r.featured,
      verified_purchase: true,
      helpful_count: 0,
      created_at: createdAt,
      updated_at: createdAt,
    });

    if (insertError) {
      console.error(`FAILED (${r.name}, ${r.date}):`, insertError.message);
      continue;
    }
    inserted++;
  }

  console.log('--- Import summary ---');
  console.log('Inserted:', inserted);
  console.log('Skipped (already imported):', skippedDuplicate);
  console.log('Matched to a current product:', matchedProduct);
  console.log('No product match (site-wide testimonial):', unmatchedProduct);
  console.log('Marked featured:', featured);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
