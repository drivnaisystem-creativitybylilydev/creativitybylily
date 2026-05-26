/** True when a product listing has one or more customer-selectable options. */
export function productHasVariants(product: { variants?: unknown }): boolean {
  return Array.isArray(product.variants) && product.variants.length > 0;
}
