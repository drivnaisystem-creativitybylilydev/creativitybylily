'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import type { Product, ProductVariant } from '@/lib/supabase/types';

export default function ProductActions({ product }: { product: Product }) {
  const { addItem, isInCart, getItemQuantity } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  const hasVariants =
    Array.isArray(product.variants) && product.variants.length > 0;

  const selectedVariant: ProductVariant | null = hasVariants
    ? (product.variants.find((v: ProductVariant) => v.id === selectedVariantId) ?? null)
    : null;

  const displayPrice =
    product.price + (selectedVariant?.price_modifier ?? 0);

  // Stock logic — per-variant if selected, else product-level
  const stockCount =
    selectedVariant != null
      ? (selectedVariant.inventory ?? 0)
      : product.inventory_count ?? 0;

  const currentCartQty = getItemQuantity(
    product.id,
    selectedVariantId ?? undefined
  );
  const availableQty = stockCount - currentCartQty;
  const isOutOfStock = stockCount === 0;
  const cannotAddMore = availableQty <= 0 && currentCartQty > 0;
  const needsVariantSelection = hasVariants && !selectedVariantId;

  const handleAddToCart = () => {
    if (needsVariantSelection) {
      setError('Please select an option first');
      setTimeout(() => setError(null), 3000);
      return;
    }
    if (isOutOfStock) {
      setError('This item is out of stock');
      setTimeout(() => setError(null), 3000);
      return;
    }
    if (cannotAddMore) {
      setError(`Only ${stockCount} available in stock`);
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsAdding(true);
    setError(null);
    try {
      addItem(product, 1, selectedVariantId ?? undefined);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsAdding(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to add to cart');
      setIsAdding(false);
      setTimeout(() => setError(null), 3000);
    }
  };

  const inCart = isInCart(product.id, selectedVariantId ?? undefined);

  return (
    <div className="space-y-4">
      {/* Variant selector */}
      {hasVariants && (
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-2">
            Options <span className="text-red-500">*</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant: ProductVariant) => {
              const variantStock = variant.inventory ?? 0;
              const isSelected = selectedVariantId === variant.id;
              const variantOOS = variantStock === 0;
              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={variantOOS}
                  onClick={() =>
                    setSelectedVariantId(
                      isSelected ? null : variant.id
                    )
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                    variantOOS
                      ? 'border-gray-200 text-gray-400 line-through cursor-not-allowed bg-gray-50'
                      : isSelected
                      ? 'border-[color:var(--logo-pink)] bg-[color:var(--logo-pink)] text-white shadow-md'
                      : 'border-gray-300 text-gray-700 hover:border-[color:var(--logo-pink)] hover:text-[color:var(--logo-pink)]'
                  }`}
                >
                  {variant.name}
                  {variant.price_modifier > 0 && (
                    <span className="ml-1 opacity-80">
                      (+${variant.price_modifier.toFixed(2)})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {selectedVariant && (
            <p className="text-xs text-gray-500 mt-2">
              Selected: <span className="font-semibold text-gray-700">{selectedVariant.name}</span>
            </p>
          )}
        </div>
      )}

      {/* Price (updates when variant with price_modifier is selected) */}
      {hasVariants && selectedVariant?.price_modifier ? (
        <div className="text-xl font-semibold text-[color:var(--logo-pink)]">
          ${displayPrice.toFixed(2)}
          <span className="text-sm text-gray-400 font-normal ml-2 line-through">
            ${product.price.toFixed(2)}
          </span>
        </div>
      ) : null}

      {/* Add to cart */}
      <div>
        {isOutOfStock && !needsVariantSelection ? (
          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 px-8 py-4 rounded-full font-medium cursor-not-allowed"
          >
            Out of Stock
          </button>
        ) : showSuccess ? (
          <div className="w-full bg-green-500 text-white px-8 py-4 rounded-full font-medium text-center">
            ✓ Added to Cart!
          </div>
        ) : error ? (
          <div className="w-full bg-red-100 border-2 border-red-300 text-red-700 px-8 py-4 rounded-full font-medium text-center">
            {error}
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={isAdding || cannotAddMore}
            className="w-full bg-[color:var(--logo-pink)] text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding
              ? 'Adding…'
              : cannotAddMore
              ? 'Max Quantity Reached'
              : needsVariantSelection
              ? 'Select an Option Above'
              : inCart
              ? 'Add More to Cart'
              : 'Add to Cart'}
          </button>
        )}

        {availableQty > 0 && availableQty <= 5 && !needsVariantSelection && (
          <p className="text-xs text-orange-600 mt-2 text-center font-medium">
            Only {availableQty} left in stock!
          </p>
        )}
      </div>
    </div>
  );
}
