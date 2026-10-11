"use client";

import Image from "next/image";
import { HeroTitle } from "./HeroTitle";
import { HERO_IMAGES, heroPalette } from "./heroData";
import { useCyclingIndex } from "./useHeroRotation";

const TRUST_CHIPS: { label: string; icon: "shell" | "wave" | "anchor" }[] = [
  { label: "Handmade", icon: "shell" },
  { label: "Hypoallergenic", icon: "wave" },
  { label: "Cape Cod Made", icon: "anchor" },
];

function ChipIcon({ icon }: { icon: "shell" | "wave" | "anchor" }) {
  const common = {
    width: 15,
    height: 15,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: heroPalette.pink,
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (icon === "shell") {
    return (
      <svg {...common} aria-hidden>
        <path d="M12 3c4.5 1.5 8 6 8 11a8 8 0 0 1-16 0c0-5 3.5-9.5 8-11Z" />
        <path d="M12 6v14M8.5 8.5 12 20M15.5 8.5 12 20" />
      </svg>
    );
  }
  if (icon === "wave") {
    return (
      <svg {...common} aria-hidden>
        <path d="M2 15c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
        <path d="M2 10c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
      </svg>
    );
  }
  return (
    <svg {...common} aria-hidden>
      <path d="M12 4v13M9 6h6M6 12H3a9 9 0 0 0 18 0h-3M8 15l4 2 4-2" />
    </svg>
  );
}

/**
 * Variant C — Editorial Split
 * Text lives on a solid cream panel, the photo lives on its own framed panel — they never overlap,
 * so contrast is guaranteed regardless of which photo is rotating in. Closest to how a premium
 * jewelry storefront (not a poster) actually reads. Trust chips replace the five scattered captions.
 */
export default function HeroVariantC() {
  const index = useCyclingIndex(HERO_IMAGES.length, 6500);
  const current = HERO_IMAGES[index];

  return (
    <section className="relative min-h-[100dvh] grid lg:grid-cols-2" style={{ background: heroPalette.paper }}>
      {/* Text panel */}
      <div className="order-2 lg:order-1 flex items-center justify-center px-6 sm:px-12 py-14 lg:py-0">
        <div className="max-w-md w-full">
          <HeroTitle
            tone="dark"
            align="left"
            primaryCta={{ label: "Shop Collection", href: "/products" }}
            secondaryCta={{ label: "Our Story", href: "/about" }}
          />
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {TRUST_CHIPS.map((chip) => (
              <span key={chip.label} className="inline-flex items-center gap-2 text-xs font-medium tracking-wide" style={{ color: heroPalette.navy }}>
                <ChipIcon icon={chip.icon} />
                {chip.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Photo panel — framed, not full-bleed, feels like a real photograph */}
      <div className="order-1 lg:order-2 relative min-h-[45vh] lg:min-h-0 p-4 sm:p-6 lg:p-10 flex items-center">
        <div
          className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-[78vh] rounded-[1.5rem] overflow-hidden"
          style={{ boxShadow: "0 20px 50px -20px rgba(74,93,122,0.35)" }}
        >
          <Image
            key={current}
            src={current}
            alt="Creativity by Lily jewelry, styled"
            fill
            priority
            quality={90}
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover transition-opacity duration-1000"
          />
        </div>
      </div>
    </section>
  );
}
