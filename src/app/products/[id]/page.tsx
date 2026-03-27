import Image from "next/image";
import Link from "next/link";
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
import {
  sunhoneyPDPTitleClass,
  sunhoneyProductNameClass,
  sunhoneyProductPriceClass,
  sunhoneySectionHeadingClass,
} from "@/lib/productDisplayStyle";

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

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
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
        <div className="mt-20">
          <div className="mb-12 text-center">
            <h2 className={`mb-4 text-2xl sm:text-3xl md:text-4xl ${sunhoneySectionHeadingClass} text-center`}>
              You might also like
            </h2>
            <p className="mx-auto max-w-2xl text-[color:var(--text-muted)]">
              Discover more handcrafted pieces from our collection
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {recommendedProducts.map((recommendedProduct) => (
              <Link
                key={recommendedProduct.id}
                href={`/products/${recommendedProduct.slug}`}
                className="group block border border-stone-200/80 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-none bg-stone-50">
                  <Image
                    src={recommendedProduct.image_url}
                    alt={recommendedProduct.title}
                    fill
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    loading="lazy"
                    quality={75}
                  />
                  {bestsellerIds.has(recommendedProduct.id) && <BestsellerTag />}
                  <div className="absolute left-2 top-2">
                    <span className="rounded-none border border-stone-200/80 bg-white/95 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-[color:var(--text-muted)] backdrop-blur-sm">
                      {recommendedProduct.category}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 border-t border-stone-200/80 px-3 py-4 text-center">
                  <h3 className={`${sunhoneyProductNameClass} line-clamp-4`}>
                    {recommendedProduct.title}
                  </h3>
                  <p className={sunhoneyProductPriceClass}>${recommendedProduct.price}</p>
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


