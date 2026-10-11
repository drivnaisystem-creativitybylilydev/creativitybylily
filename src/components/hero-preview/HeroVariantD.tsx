"use client";

import Image from "next/image";
import { HeroTitle } from "./HeroTitle";
import { HERO_FULLBLEED_IMAGES } from "./heroData";
import { useRotatingSlots } from "./useHeroRotation";

const STRONG_GLOW =
  "0 1px 2px rgba(0,0,0,0.15), 0 0 15px rgba(255,105,180,0.55), 0 0 35px rgba(255,105,180,0.45), 0 0 55px rgba(255,105,180,0.35), 0 0 85px rgba(255,105,180,0.25), 0 0 120px rgba(255,105,180,0.15)";

/**
 * Feathered mask: a solid, fully-opaque core so each photo still reads crisp and vivid, then a wide
 * fade out to almost the box edge (transparent only starts at 96%/94% of the box — barely any "dead"
 * unused margin), so overlapping tiles genuinely blend in the shared zone instead of leaving a gap
 * of dead space (the bug in the first pass) or making the whole photo uniformly hazy (the second pass).
 */
const TILE_MASK = "radial-gradient(ellipse 96% 94% at 50% 50%, #000 0%, #000 40%, transparent 100%)";

type TileBox = { left: string; top: string; width: string; height: string; rotate: number; z: number };

/** Five heavily overlapping, gently rotated tiles instead of a rigid grid — positions as % of the section box. */
const DESKTOP_TILES: TileBox[] = [
  { left: "-10%", top: "-12%", width: "62%", height: "70%", rotate: -2, z: 5 },
  { left: "40%", top: "-16%", width: "66%", height: "66%", rotate: 1.8, z: 4 },
  { left: "-12%", top: "34%", width: "58%", height: "68%", rotate: 1.6, z: 3 },
  { left: "28%", top: "40%", width: "62%", height: "64%", rotate: -1.7, z: 2 },
  { left: "58%", top: "26%", width: "62%", height: "68%", rotate: 2.1, z: 1 },
];

const MOBILE_TILES: TileBox[] = [
  { left: "-14%", top: "-6%", width: "78%", height: "40%", rotate: -2, z: 5 },
  { left: "38%", top: "-10%", width: "80%", height: "38%", rotate: 1.8, z: 4 },
  { left: "-16%", top: "22%", width: "72%", height: "42%", rotate: 1.6, z: 3 },
  { left: "42%", top: "26%", width: "76%", height: "40%", rotate: -1.7, z: 2 },
  { left: "4%", top: "58%", width: "94%", height: "46%", rotate: 1, z: 1 },
];

function CollageTile({ src, box, priority, sizes }: { src: string; box: TileBox; priority?: boolean; sizes: string }) {
  return (
    <div
      className="absolute"
      style={{
        left: box.left,
        top: box.top,
        width: box.width,
        height: box.height,
        zIndex: box.z,
        transform: `rotate(${box.rotate}deg)`,
        WebkitMaskImage: TILE_MASK,
        maskImage: TILE_MASK,
        filter: "drop-shadow(0 12px 30px rgba(74,40,60,0.12))",
      }}
    >
      <div className="relative w-full h-full">
        <Image src={src} alt="Creativity by Lily jewelry" fill priority={priority} quality={85} sizes={sizes} className="object-cover transition-opacity duration-1000" />
      </div>
    </div>
  );
}

/**
 * Variant D — Classic Collage, Refined
 * Same rotating loop, same glowing-text-over-photos treatment — but instead of hard-edged grid
 * cells butted against a blurred divider bar, each photo sits in a soft feathered oval mask and
 * overlaps its neighbors, so the edges dissolve into each other instead of cutting. Draws only
 * from the curated text-free photo subset: with tiles this overlapped, a product-card flatlay's
 * printed text would ghost through several neighboring tiles at once, which reads as messy, not blended.
 */
export default function HeroVariantD() {
  const slots = useRotatingSlots(HERO_FULLBLEED_IMAGES, 5, 8000);
  const mobileSlots = useRotatingSlots(HERO_FULLBLEED_IMAGES, 5, 9000);

  return (
    <section className="relative overflow-hidden bg-[#fef5f8]" style={{ minHeight: "100dvh" }}>
      {/* IMAGE LAYER — desktop: 5 overlapping feathered tiles */}
      <div className="absolute inset-0 hidden md:block">
        {slots.map((src, i) => (
          <CollageTile key={DESKTOP_TILES[i].z} src={src} box={DESKTOP_TILES[i]} priority={i === 0} sizes="55vw" />
        ))}
      </div>
      {/* IMAGE LAYER — mobile: 4 overlapping feathered tiles, taller boxes for a narrower canvas */}
      <div className="absolute inset-0 md:hidden">
        {mobileSlots.map((src, i) => (
          <CollageTile key={MOBILE_TILES[i].z} src={src} box={MOBILE_TILES[i]} priority={i === 0} sizes="80vw" />
        ))}
      </div>

      {/* Soft pink-to-blue wash, same diagonal as the live site */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        aria-hidden
        style={{ background: "linear-gradient(135deg, rgba(255,105,180,0.26) 0%, rgba(173,216,230,0.28) 100%)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, rgba(255,105,180,0.32) 0%, transparent 20%), linear-gradient(0deg, rgba(255,105,180,0.28) 0%, transparent 22%)",
        }}
      />

      {/* Liquid glow behind the text — three blobs instead of four, same organic language, less clutter */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[3] w-[min(140%,620px)] h-[min(80vh,400px)]"
        aria-hidden
        style={{
          borderRadius: "60% 40% 55% 45% / 45% 55% 45% 55%",
          background: "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(255,105,180,0.45) 0%, rgba(255,105,180,0.2) 50%, transparent 75%)",
          filter: "blur(48px)",
        }}
      />
      <div
        className="absolute left-[35%] top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[3] w-[min(100%,400px)] h-[min(55vh,260px)] hidden md:block"
        aria-hidden
        style={{
          borderRadius: "45% 55% 50% 50% / 50% 45% 55% 50%",
          background: "radial-gradient(ellipse 80% 90% at 50% 50%, rgba(173,216,230,0.5) 0%, rgba(173,216,230,0.2) 55%, transparent 80%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute left-[65%] top-[45%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[3] w-[min(90%,360px)] h-[min(50vh,220px)] hidden md:block"
        aria-hidden
        style={{
          borderRadius: "50% 50% 45% 55% / 55% 50% 50% 45%",
          background: "radial-gradient(ellipse 85% 75% at 50% 50%, rgba(221,160,221,0.4) 0%, rgba(221,160,221,0.15) 60%, transparent 85%)",
          filter: "blur(36px)",
        }}
      />

      {/* TEXT — new flourish + Allura + tracked subhead + differentiated CTAs, same floating-over-photos treatment */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4 md:px-6 z-10">
        <div className="pointer-events-auto w-full max-w-2xl sm:max-w-3xl md:max-w-4xl flex flex-col items-center justify-center py-6 md:py-10 relative">
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[140%]"
            aria-hidden
            style={{
              aspectRatio: "2.4 / 1",
              background: "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(245,238,220,0.45) 0%, rgba(242,232,210,0.25) 50%, rgba(238,224,200,0.08) 75%, transparent 100%)",
              borderRadius: "50%",
              filter: "blur(20px)",
              zIndex: 0,
            }}
          />
          <div className="relative z-[1]">
            <HeroTitle
              tone="light"
              align="center"
              glow={STRONG_GLOW}
              primaryCta={{ label: "Shop Collection", href: "/products" }}
              secondaryCta={{ label: "Our Story", href: "/about" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
