/**
 * Test script to check Supabase connection and products
 */
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  process.exit(1);
}

// Test with anon key (what the website uses)
console.log('🔍 Testing with anon key (public access)...\n');
const anonClient = createClient(supabaseUrl, supabaseAnonKey);

anonClient
  .from('products')
  .select('*')
  .eq('is_active', true)
  .then(({ data, error }) => {
    if (error) {
      console.error('❌ Error with anon key:', error);
    } else {
      console.log(`✅ Found ${data?.length || 0} products with anon key`);
      if (data && data.length > 0) {
        console.log('Sample product:', data[0].title);
      }
    }

    // Test with service key (bypasses RLS)
    if (supabaseServiceKey) {
      console.log('\n🔍 Testing with service key (admin access)...\n');
      const adminClient = createClient(supabaseUrl, supabaseServiceKey);
      
      adminClient
        .from('products')
        .select('*')
        .then(({ data: adminData, error: adminError }) => {
          if (adminError) {
            console.error('❌ Error with service key:', adminError);
          } else {
            console.log(`✅ Found ${adminData?.length || 0} total products with service key`);
            if (adminData && adminData.length > 0) {
              console.log('Sample products:');
              adminData.slice(0, 3).forEach(p => {
                console.log(`  - ${p.title} (active: ${p.is_active})`);
              });
            }
          }
          
          // Check RLS status
          console.log('\n🔍 Checking RLS policies...');
          adminClient
            .rpc('check_rls_enabled', {})
            .then(() => {})
            .catch(() => {
              // RLS check function doesn't exist, that's fine
            });
        });
    }
  });








