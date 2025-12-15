import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] });
    }

    const supabase = createServerClient();
    const searchTerm = query.trim().toLowerCase();

    // Search products by title, description, and category
    const { data: products, error } = await supabase
      .from('products')
      .select('id, title, image_url, category, price')
      .eq('is_active', true)
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
      .limit(20);

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json(
        { error: 'Failed to search products' },
        { status: 500 }
      );
    }

    // Sort results: exact title matches first, then partial matches
    const sortedResults = (products || []).sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      
      // Exact match gets highest priority
      if (aTitle === searchTerm) return -1;
      if (bTitle === searchTerm) return 1;
      
      // Starts with search term gets second priority
      if (aTitle.startsWith(searchTerm)) return -1;
      if (bTitle.startsWith(searchTerm)) return 1;
      
      // Otherwise maintain original order
      return 0;
    });

    return NextResponse.json({ results: sortedResults });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search products' },
      { status: 500 }
    );
  }
}

