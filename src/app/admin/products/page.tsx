import { createAdminClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export default async function AdminProductsPage() {
  const supabase = createAdminClient();

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading products: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-light text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-[color:var(--logo-pink)] text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg"
        >
          + Add Product
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product: any) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-square w-full bg-gray-100">
              <Image
                src={product.image_url}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {!product.is_active && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  Inactive
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 flex-1">
                  {product.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-3 capitalize">{product.category}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold text-[color:var(--logo-pink)]">
                  ${Number(product.price).toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">
                  Stock: {product.inventory_count || 0}
                </span>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="flex-1 text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Edit
                </Link>
                <Link
                  href={`/products/${product.slug}`}
                  target="_blank"
                  className="flex-1 text-center border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:border-gray-400 transition-colors"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!products || products.length === 0) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">No products yet</p>
          <Link
            href="/admin/products/new"
            className="inline-block bg-[color:var(--logo-pink)] text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Add Your First Product
          </Link>
        </div>
      )}
    </div>
  );
}








