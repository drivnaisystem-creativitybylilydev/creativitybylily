'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import type { Product } from '@/lib/supabase/types';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product, 1);
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsAdding(false);
    }, 2000);
  };

  const inCart = isInCart(product.id);

  return (
    <div className="pt-4">
      {showSuccess ? (
        <div className="w-full bg-green-500 text-white px-8 py-4 rounded-full font-medium text-center">
          ✓ Added to Cart!
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full bg-[color:var(--logo-pink)] text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? 'Adding...' : inCart ? 'Add More to Cart' : 'Add to Cart'}
        </button>
      )}
    </div>
  );
}








