'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart();
  const total = getTotalPrice();
  const itemCount = getTotalItems();
  const FREE_SHIPPING_THRESHOLD = 35;
  const DEFAULT_SHIPPING_COST = 6.99;
  
  // Calculate shipping: free if total >= $35, otherwise show default
  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_COST;
  const cartTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf8f5] py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="font-serif text-4xl font-light text-gray-800 mb-8">Your Cart</h1>
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <svg
              className="w-24 h-24 mx-auto text-gray-300 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="font-serif text-2xl text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Start shopping to add items to your cart!</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[color:var(--logo-pink)] text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-xl"
            >
              Continue Shopping
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-4xl font-light text-gray-800">Your Cart</h1>
          <button
            onClick={clearCart}
            className="text-sm text-gray-600 hover:text-[color:var(--logo-pink)] transition-colors"
          >
            Clear cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.variantId || 'default'}`}
                className="bg-white rounded-2xl shadow-sm p-6 flex gap-6"
              >
                <Link
                  href={`/products/${item.product.slug}`}
                  className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100"
                >
                  <Image
                    src={item.product.image_url}
                    alt={item.product.title}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </Link>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-serif text-lg text-gray-800 hover:text-[color:var(--logo-pink)] transition-colors"
                    >
                      {item.product.title}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">{item.product.category}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            try {
                              updateQuantity(item.product.id, item.quantity - 1, item.variantId);
                            } catch (err: any) {
                              alert(err.message);
                            }
                          }}
                          className="w-8 h-8 rounded-full border border-gray-800 text-gray-800 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="text-gray-800 font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => {
                            try {
                              updateQuantity(item.product.id, item.quantity + 1, item.variantId);
                            } catch (err: any) {
                              alert(err.message);
                            }
                          }}
                          disabled={(item.product.inventory_count || 0) <= item.quantity}
                          className="w-8 h-8 rounded-full border border-gray-800 text-gray-800 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      {(item.product.inventory_count || 0) === 0 && (
                        <p className="text-xs text-red-600 font-medium">Out of Stock</p>
                      )}
                      {(item.product.inventory_count || 0) > 0 && (item.product.inventory_count || 0) <= item.quantity && (
                        <p className="text-xs text-orange-600 font-medium">
                          Only {item.product.inventory_count} available
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-[color:var(--logo-pink)]">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeItem(item.product.id, item.variantId)}
                        className="text-sm text-gray-500 hover:text-red-600 transition-colors mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="font-serif text-xl text-gray-800 mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={total >= FREE_SHIPPING_THRESHOLD ? 'text-green-600' : ''}>
                    {total >= FREE_SHIPPING_THRESHOLD ? 'Free' : `$${DEFAULT_SHIPPING_COST.toFixed(2)}`}
                  </span>
                </div>
                {total < FREE_SHIPPING_THRESHOLD && total > 0 && (
                  <div className="text-sm text-gray-600 -mt-2 mb-2">
                    <span>💡 Add ${(FREE_SHIPPING_THRESHOLD - total).toFixed(2)} more for free shipping!</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="font-semibold text-gray-800">Total</span>
                  <span className="font-semibold text-xl text-[color:var(--logo-pink)]">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="block w-full bg-[color:var(--logo-pink)] text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-xl text-center"
              >
                Proceed to Checkout →
              </Link>
              <Link
                href="/products"
                className="block w-full text-center mt-4 text-gray-600 hover:text-[color:var(--logo-pink)] transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

