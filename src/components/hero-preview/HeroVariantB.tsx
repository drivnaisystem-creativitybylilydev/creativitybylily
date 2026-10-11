"use client";

import Image from "next/image";
import { HeroTitle } from "./HeroTitle";
import { HERO_FULLBLEED_IMAGES, HERO_TAGLINES } from "./heroData";
import { useCyclingIndex } from "./useHeroRotation";

/**
 * Variant B — Full-Bleed Ocean Moment
 * No grid, no seams, no color wash over the photos. One real photo crossfades to the next,
 * full-bleed and true-color. Only a bottom scrim (not a full pink tint) lifts the text.
 * The five caption badges become one line that cycles through the same phrases sequentially,
 * so nothing competes with the headline. Pulls only from the curated text-free photo subset —
 * product-card flatlays are excluded here because the headline would collide with their printed text.
 */
export default function HeroVariantB() {
  const index = useCyclingIndex(HERO_FULLBLEED_IMAGES.length, 6000);
  const taglineIndex = useCyclingIndex(HERO_TAGLINES.length, 3500);
  const current = HERO_FULLBLEED_IMAGES[index];

  return (
    <section className="relative min-h-[100dvh] flex items-end overflow-hidden">
      <Image
        key={current}
        src={current}
        alt="Creativity by Lily — handcrafted coastal jewelry"
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover transition-opacity duration-1000"
      />
      {/* Bottom scrim only — the photo stays vibrant everywhere else */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(20,15,15,0.55) 100%)",
        }}
      />
      <div className="relative z-10 w-full px-5 sm:px-10 pb-14 sm:pb-20">
        <div className="mx-auto max-w-3xl">
          <HeroTitle
            tone="light"
            align="center"
            primaryCta={{ label: "Shop Collection", href: "/products" }}
            secondaryCta={{ label: "Our Story", href: "/about" }}
          />
          <p
            className="mt-5 text-center text-sm sm:text-base"
            style={{ color: "rgba(255,255,255,0.9)", textShadow: "0 1px 3px rgba(0,0,0,0.35)" }}
          >
            {HERO_TAGLINES[taglineIndex]}
          </p>
        </div>
      </div>
    </section>
  );
}
