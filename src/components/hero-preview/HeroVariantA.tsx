"use client";

import Image from "next/image";
import { HeroTitle } from "./HeroTitle";
import { HERO_FULLBLEED_IMAGES, HERO_IMAGES, HERO_TAGLINES, heroPalette } from "./heroData";
import { useCyclingIndex, useRotatingSlots } from "./useHeroRotation";

/**
 * Variant A — Refined Bento
 * Fixes the ChatGPT mock's biggest problem: hard crosshair seams cutting through photos and text.
 * Real cream gutters (whitespace, not blurred pink lines) separate the photo cells from a solid
 * white title plate — the headline never sits on top of a photo, so it's always legible without
 * needing a heavy color wash over the images. The large cell only draws from the curated
 * text-free pool (its small caption badge would otherwise collide with printed product-card text);
 * the two supporting cells draw from the full pool since they carry no overlaid text.
 */
export default function HeroVariantA() {
  const largeIndex = useCyclingIndex(HERO_FULLBLEED_IMAGES.length, 7000);
  const large = HERO_FULLBLEED_IMAGES[largeIndex];
  const [topRight, bottomRight] = useRotatingSlots(HERO_IMAGES, 2, 8000);
  const taglineIndex = useCyclingIndex(HERO_TAGLINES.length, 4000);

  return (
    <section
      className="relative min-h-[100dvh] flex items-center"
      style={{ background: heroPalette.cream }}
    >
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-3 md:gap-4 h-[calc(100dvh-3rem)] md:h-[80vh]">
          {/* Large cell */}
          <div className="relative md:col-span-7 md:row-span-2 rounded-[1.75rem] overflow-hidden min-h-[220px]">
            <Image
              key={large}
              src={large}
              alt="Creativity by Lily jewelry"
              fill
              priority
              quality={90}
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover transition-opacity duration-1000"
            />
            {/* Single caption, not five */}
            <span
              className="absolute left-4 top-4 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] backdrop-blur-md"
              style={{ background: "rgba(255,255,255,0.82)", color: heroPalette.navy }}
            >
              {HERO_TAGLINES[taglineIndex]}
            </span>
          </div>

          {/* Top-right cell */}
          <div className="relative hidden md:block md:col-span-5 md:row-span-1 rounded-[1.75rem] overflow-hidden">
            <Image
              key={topRight}
              src={topRight}
              alt="Creativity by Lily jewelry detail"
              fill
              quality={80}
              sizes="40vw"
              className="object-cover transition-opacity duration-1000"
            />
          </div>

          {/* Bottom-right: title plate */}
          <div
            className="relative md:col-span-5 md:row-span-1 rounded-[1.75rem] flex items-center justify-center p-6 md:p-8"
            style={{ background: "#ffffff" }}
          >
            <HeroTitle
              tone="dark"
              align="center"
              size="compact"
              primaryCta={{ label: "Shop Collection", href: "/products" }}
              secondaryCta={{ label: "Our Story", href: "/about" }}
            />
          </div>
        </div>

        {/* Mobile fallback strip for the two desktop-only cells, kept small + real */}
        <div className="mt-3 grid grid-cols-2 gap-3 md:hidden">
          <div className="relative aspect-square rounded-2xl overflow-hidden">
            <Image src={topRight} alt="Creativity by Lily jewelry detail" fill quality={75} sizes="50vw" className="object-cover" />
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden">
            <Image src={bottomRight} alt="Creativity by Lily jewelry detail" fill quality={75} sizes="50vw" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
