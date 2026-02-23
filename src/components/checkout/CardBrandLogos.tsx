'use client';

/**
 * Card network logos (Visa, Mastercard, Amex, Discover).
 * Uses images from /card-logos/ — see public/card-logos/README.md.
 * Any image size works; they are scaled to fit the payment section.
 */
const LOGOS = [
  { name: 'Visa', file: 'visa', alt: 'Visa' },
  { name: 'Mastercard', file: 'mastercard', alt: 'Mastercard' },
  { name: 'American Express', file: 'amex', alt: 'American Express' },
  { name: 'Discover', file: 'discovery', alt: 'Discover' },
] as const;

// Use .png or .jpg — set extension to match the files you add
function logoSrc(file: string) {
  return `/card-logos/${file}.jpg`;
}

export default function CardBrandLogos() {
  return (
    <div
      className="flex items-center gap-2"
      aria-label="Accepted cards: Visa, Mastercard, American Express, Discover"
    >
      {LOGOS.map(({ name, file, alt }) => (
        <div
          key={name}
          className="h-7 w-10 flex items-center justify-center rounded overflow-hidden bg-white border border-gray-200"
          title={name}
        >
          <img
            src={logoSrc(file)}
            alt={alt}
            className="h-full w-full object-contain"
            width={40}
            height={28}
          />
        </div>
      ))}
    </div>
  );
}
