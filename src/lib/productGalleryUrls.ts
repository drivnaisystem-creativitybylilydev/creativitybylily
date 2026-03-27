/**
 * Dedupes and orders gallery URLs: primary `image_url` first, then extra entries from `images`.
 */
export function normalizeProductGalleryUrls(
  imageUrl: string,
  images: string[] | null | undefined
): string[] {
  const clean = (s: string) => s.trim();
  const fromArr = Array.isArray(images)
    ? images.map((x) => clean(String(x))).filter((u) => u.length > 0)
    : [];
  const primary = clean(imageUrl || '');
  const out: string[] = [];
  if (primary) out.push(primary);
  for (const u of fromArr) {
    if (!out.includes(u)) out.push(u);
  }
  return out;
}
