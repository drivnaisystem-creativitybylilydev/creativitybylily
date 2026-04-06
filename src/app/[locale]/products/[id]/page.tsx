import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getRelatedProducts,
  getBestsellerProductIdSet,
} from "@/lib/supabase/products";
import type { Metadata } from "next";
import ProductActions from "@/components/ProductActions";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductReviewsSection from "@/components/ProductReviewsSection";
import BestsellerTag from "@/components/BestsellerTag";
import RelatedProductsGrid from "@/components/RelatedProductsGrid";
import {
  sunhoneyPDPTitleClass,
  sunhoneyProductPriceClass,
  sunhoneySectionHeadingClass,
} from "@/lib/productDisplayStyle";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
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

  const bestsellerIds = await getBestsellerProductIdSet(36);

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

  const bestsellerProductIds = Array.from(bestsellerIds);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 md:gap-12">
          <div className="relative">
            {bestsellerIds.has(product.id) && <BestsellerTag />}
            <ProductImageGallery images={productImages} productTitle={product.title} />
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <h1 className={sunhoneyPDPTitleClass}>
                  {product.title}
                </h1>
                {(product.inventory_count || 0) === 0 && (
                  <span className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold text-white">
                    Out of Stock
                  </span>
                )}
              </div>
              <p className="text-sm text-[color:var(--text-muted)]">Handcrafted on Cape Cod</p>
            </div>
            <div className={`${sunhoneyProductPriceClass} !text-left text-base sm:text-lg md:text-xl`}>
              ${product.price}
            </div>
            <p className="leading-relaxed text-[color:var(--text-muted)]">{product.description}</p>
            <ProductActions product={product} />
            <div className="border-t border-gray-200 pt-4">
              <h3 className={`mb-2 text-sm sm:text-base ${sunhoneySectionHeadingClass}`}>
                Product details
              </h3>
              <ul className="space-y-1 text-sm text-[color:var(--text-muted)]">
                <li>• Waterproof & Hypoallergenic</li>
                <li>• Handcrafted with love</li>
                <li>• Made on Cape Cod</li>
                <li>• Each piece is unique</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ProductReviewsSection productId={product.id} />

        {/* Product Recommendations Section */}
        <div className="mt-14 sm:mt-20">
          <div className="mb-8 text-center sm:mb-12">
            <h2 className={`mb-3 text-2xl sm:mb-4 sm:text-3xl md:text-4xl ${sunhoneySectionHeadingClass} text-center`}>
              You might also like
            </h2>
            <p className="mx-auto max-w-2xl px-1 text-sm text-[color:var(--text-muted)] sm:text-base">
              Discover more handcrafted pieces from our collection
            </p>
          </div>

          <RelatedProductsGrid products={recommendedProducts} bestsellerProductIds={bestsellerProductIds} />

          {/* Call to Action */}
          <div className="mt-10 text-center sm:mt-12">
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


