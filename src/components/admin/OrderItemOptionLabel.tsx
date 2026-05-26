import { resolveVariantName } from '@/lib/orders/resolveVariantName';

type Props = {
  variants: unknown;
  variantId: string | null | undefined;
  className?: string;
};

/** Shows "Option: …" for any order line with a saved variant_id (all products, present and future). */
export default function OrderItemOptionLabel({ variants, variantId, className = 'mb-1' }: Props) {
  const optionLabel = resolveVariantName(variants, variantId);

  if (optionLabel) {
    return (
      <p className={`text-sm text-gray-800 ${className}`}>
        <span className="font-medium">Option:</span> {optionLabel}
      </p>
    );
  }

  if (variantId) {
    return (
      <p className={`text-sm text-amber-700 ${className}`}>
        Option selected (name no longer on product listing)
      </p>
    );
  }

  return null;
}
