'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import type { Product } from '@/lib/supabase/types';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, isInCart, getItemQuantity } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inventoryCount = product.inventory_count || 0;
  const currentCartQuantity = getItemQuantity(product.id);
  const availableQuantity = inventoryCount - currentCartQuantity;
  const isOutOfStock = inventoryCount === 0;
  const cannotAddMore = availableQuantity <= 0 && currentCartQuantity > 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      setError('This product is out of stock');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (cannotAddMore) {
      setError(`Only ${inventoryCount} available in stock`);
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsAdding(true);
    setError(null);
    
    try {
      addItem(product, 1);
      
      // Show success message
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

  const inCart = isInCart(product.id);

  if (isOutOfStock) {
    return (
      <div className="pt-4">
        <button
          disabled
          className="w-full bg-gray-300 text-gray-500 px-8 py-4 rounded-full font-medium cursor-not-allowed"
        >
          Out of Stock
        </button>
      </div>
    );
  }

  return (
    <div className="pt-4">
      {showSuccess ? (
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
          {isAdding ? 'Adding...' : cannotAddMore ? 'Max Quantity Reached' : inCart ? 'Add More to Cart' : 'Add to Cart'}
        </button>
      )}
      {availableQuantity > 0 && availableQuantity <= 5 && (
        <p className="text-xs text-orange-600 mt-2 text-center font-medium">
          Only {availableQuantity} left in stock!
        </p>
      )}
    </div>
  );
}








