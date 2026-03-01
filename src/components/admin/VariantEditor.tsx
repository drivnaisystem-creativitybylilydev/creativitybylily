'use client';

import type { ProductVariant } from '@/lib/supabase/types';

type Props = {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
};

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export default function VariantEditor({ variants, onChange }: Props) {
  const addVariant = () => {
    onChange([
      ...variants,
      { id: generateId(), name: '', price_modifier: 0, inventory: 0 },
    ]);
  };

  const updateVariant = (
    index: number,
    field: keyof ProductVariant,
    value: string | number
  ) => {
    onChange(variants.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
  };

  const removeVariant = (index: number) => {
    onChange(variants.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {variants.length === 0 ? (
        <p className="text-sm text-gray-500 py-1">
          No variants yet. Add one below if this product comes in different sizes, colours, etc.
        </p>
      ) : (
        <div className="space-y-3">
          {variants.map((variant, index) => (
            <div
              key={variant.id}
              className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200"
            >
              {/* Name */}
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Variant Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={variant.name}
                  onChange={e => updateVariant(index, 'name', e.target.value)}
                  placeholder="e.g. Small, Blue, 7 inch…"
                  className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-all"
                />
              </div>

              {/* Price modifier */}
              <div className="sm:w-40">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Extra Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={variant.price_modifier}
                  onChange={e =>
                    updateVariant(index, 'price_modifier', parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.00"
                  className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-all"
                />
                <p className="text-xs text-gray-400 mt-1">Added on top of base price</p>
              </div>

              {/* Stock */}
              <div className="sm:w-28">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  min="0"
                  value={variant.inventory}
                  onChange={e =>
                    updateVariant(index, 'inventory', parseInt(e.target.value) || 0)
                  }
                  placeholder="0"
                  className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-all"
                />
              </div>

              {/* Remove */}
              <div className="flex sm:items-end">
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg border-2 border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addVariant}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-[color:var(--logo-pink)] text-[color:var(--logo-pink)] text-sm font-semibold hover:bg-pink-50 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Variant
      </button>
    </div>
  );
}
