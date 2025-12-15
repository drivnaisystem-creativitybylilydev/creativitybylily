import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, getProducts } from "@/lib/supabase/products";
import type { Metadata } from "next";
import AddToCartButton from "@/components/AddToCartButton";
import ProductImageGallery from "@/components/ProductImageGallery";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductBySlug(id);
  
  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.title,
    description: `${product.description} Handcrafted on Cape Cod. ${product.title} - $${product.price}`,
    openGraph: {
      title: `${product.title} | creativity by lily`,
      description: `${product.description} Handcrafted on Cape Cod.`,
      images: [
        {
          url: product.image_url,
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | creativity by lily`,
      description: `${product.description} Handcrafted on Cape Cod.`,
      images: [product.image_url],
    },
  };
}

export default async function ProductDetailPage(props: PageProps) {
  const { id } = await props.params;
  const product = await getProductBySlug(id);
  if (!product) return notFound();

  // Get all images for this product (use images array from database, fallback to main image)
  const productImages = product.images && Array.isArray(product.images) && product.images.length > 0 
    ? product.images.filter((img: string) => img && img.trim() !== '') // Filter out empty strings
    : product.image_url ? [product.image_url] : [];

  // Get recommended products
  const recommendedProducts = await getRelatedProducts(
    product.id,
    product.category,
    6
  );

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <ProductImageGallery images={productImages} productTitle={product.title} />
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="font-serif text-3xl font-light text-gray-800 mb-2">{product.title}</h1>
              <p className="text-sm text-gray-500">Handcrafted on Cape Cod</p>
            </div>
            <div className="text-2xl font-semibold text-[color:var(--logo-pink)]">${product.price}</div>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
            <AddToCartButton product={product} />
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-serif text-lg text-gray-800 mb-2">Product Details</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Waterproof & Hypoallergenic</li>
                <li>• Handcrafted with love</li>
                <li>• Made on Cape Cod</li>
                <li>• Each piece is unique</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Product Recommendations Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-light text-gray-800 mb-4">
              You Might Also Like
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover more handcrafted pieces from our collection
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {recommendedProducts.map((recommendedProduct) => (
              <Link
                key={recommendedProduct.id}
                href={`/products/${recommendedProduct.slug}`}
                className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={recommendedProduct.image_url}
                    alt={recommendedProduct.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                    loading="lazy"
                    quality={75}
                  />
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full text-gray-700">
                      {recommendedProduct.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-sm text-gray-800 mb-2 line-clamp-2 group-hover:text-[color:var(--logo-pink)] transition-colors">
                    {recommendedProduct.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-[color:var(--logo-pink)]">
                      ${recommendedProduct.price}
                    </span>
                    <span className="text-[color:var(--logo-pink)] hover:opacity-80 transition-opacity text-xs font-medium">
                      View →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[color:var(--logo-pink)] text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-xl"
            >
              View All Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


