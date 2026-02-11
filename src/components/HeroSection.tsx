"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const HERO_IMAGES = [
  "/hero-section-images/IMG_5220.PNG",
  "/hero-section-images/IMG_5221.jpg",
  "/hero-section-images/IMG_5222.jpg",
  "/hero-section-images/IMG_5223.jpg",
  "/hero-section-images/IMG_5224.jpg",
  "/hero-section-images/IMG_5225.jpg",
  "/hero-section-images/IMG_5226.jpg",
  "/hero-section-images/IMG_5227.jpg",
  "/hero-section-images/IMG_5228.jpg",
  "/hero-section-images/IMG_5229.jpg",
  "/hero-section-images/IMG_5230.jpg",
  "/hero-section-images/IMG_5231.jpg",
  "/hero-section-images/IMG_5232.jpg",
  "/hero-section-images/IMG_5233.jpg",
  "/hero-section-images/IMG_5234.jpg",
  "/hero-section-images/IMG_5235.jpg",
  "/hero-section-images/IMG_5236.jpg",
  "/hero-section-images/IMG_5237.jpg",
];

const SLOT_COUNT = 5;
const ROTATE_INTERVAL_MS = 90 * 1000;
const MOBILE_ROTATE_INTERVAL_MS = 5 * 1000;

/** Fixed initial order so server and client render the same (avoids hydration mismatch). */
const INITIAL_SLOTS = HERO_IMAGES.slice(0, SLOT_COUNT);

function pickRandomSlots(): string[] {
  const shuffled = [...HERO_IMAGES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, SLOT_COUNT);
}

export default function HeroSection() {
  const [slotImages, setSlotImages] = useState<string[]>(INITIAL_SLOTS);
  const [mobileImageIndex, setMobileImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const rotate = useCallback(() => setSlotImages(pickRandomSlots()), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setSlotImages(pickRandomSlots());
    const t = setInterval(rotate, ROTATE_INTERVAL_MS);
    return () => clearInterval(t);
  }, [mounted, rotate]);

  useEffect(() => {
    if (!mounted) return;
    const t = setInterval(() => {
      setMobileImageIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, MOBILE_ROTATE_INTERVAL_MS);
    return () => clearInterval(t);
  }, [mounted]);

  const [topLeft, topRight, bottomLeft, bottomCenter, bottomRight] = slotImages;

  return (
    <section className="relative overflow-hidden bg-[#fef5f8] min-h-[70svh] md:min-h-[85vh] flex flex-col">
      {/* IMAGE LAYER: one full-width rotating image on mobile; two rows on desktop */}
      <div className="relative flex flex-col gap-0 flex-1 min-h-0">
        {/* Mobile only: single image slot rotating through all 18 images */}
        <div className="hero-image-container relative w-full flex-1 min-h-[50vh] flex md:hidden">
          <Image
            key={mobileImageIndex}
            src={HERO_IMAGES[mobileImageIndex]}
            alt="Creativity by Lily"
            fill
            className="object-cover transition-opacity duration-700"
            sizes="100vw"
            priority
            quality={85}
          />
        </div>

        {/* Desktop only: top row */}
        <div className="hidden md:flex relative w-full aspect-[16/5] min-h-[200px] max-h-[360px]">
          <div className="hero-image-container relative flex-1 min-w-0 h-full">
            <Image src={topLeft} alt="Creativity by Lily" fill className="object-cover transition-opacity duration-700" sizes="50vw" priority quality={82} />
          </div>
          <div
            className="flex-shrink-0 w-12 h-full"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,105,180,0.4) 20%, rgba(255,105,180,0.35) 50%, rgba(255,105,180,0.4) 80%, transparent)",
              filter: "blur(8px)",
            }}
          />
          <div className="hero-image-container relative flex-1 min-w-0 h-full">
            <Image src={topRight} alt="Creativity by Lily" fill className="object-cover transition-opacity duration-700" sizes="50vw" quality={80} />
          </div>
        </div>

        {/* Desktop only: bottom row */}
        <div className="hidden md:flex relative w-full aspect-[16/5] min-h-[160px] max-h-[300px]">
          <div className="hero-image-container relative flex-1 min-w-0 h-full">
            <Image src={bottomLeft} alt="Creativity by Lily jewelry" fill className="object-cover transition-opacity duration-700" sizes="33vw" loading="lazy" quality={80} />
          </div>
          <div
            className="flex-shrink-0 w-2 md:w-5 h-full"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,105,180,0.4) 25%, rgba(255,105,180,0.35) 50%, rgba(255,105,180,0.4) 75%, transparent)",
              filter: "blur(8px)",
            }}
          />
          <div className="hero-image-container relative flex-1 min-w-0 h-full">
            <Image src={bottomCenter} alt="Creativity by Lily jewelry" fill className="object-cover transition-opacity duration-700" sizes="33vw" loading="lazy" quality={80} />
          </div>
          <div
            className="flex-shrink-0 w-2 md:w-5 h-full"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,105,180,0.4) 25%, rgba(255,105,180,0.35) 50%, rgba(255,105,180,0.4) 75%, transparent)",
              filter: "blur(8px)",
            }}
          />
          <div className="hero-image-container relative flex-1 min-w-0 h-full">
            <Image src={bottomRight} alt="Creativity by Lily jewelry" fill className="object-cover transition-opacity duration-700" sizes="33vw" loading="lazy" quality={80} />
          </div>
        </div>
      </div>

      {/* Soft pink-to-blue gradient overlay – stronger on mobile so text reads clearly */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        aria-hidden
        style={{
          background: "linear-gradient(135deg, rgba(255, 105, 180, 0.28) 0%, rgba(173, 216, 230, 0.3) 100%)",
        }}
      />
      {/* Mobile: stronger overlay to reduce visual clutter from background images */}
      <div
        className="absolute inset-0 pointer-events-none z-[2] md:hidden"
        aria-hidden
        style={{
          background: "linear-gradient(180deg, rgba(254, 245, 248, 0.4) 0%, rgba(255, 200, 220, 0.5) 40%, rgba(255, 180, 210, 0.45) 100%)",
        }}
      />
      {/* Peripheral frame: top and bottom pink blurs */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        aria-hidden
        style={{
          background: `
            linear-gradient(180deg, rgba(255,105,180,0.35) 0%, transparent 20%),
            linear-gradient(0deg, rgba(255,105,180,0.3) 0%, transparent 22%)
          `,
        }}
      />

      {/* Liquid blurs: one central glow on mobile; all four on desktop */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[3] w-[min(140%,600px)] h-[min(80vh,380px)]"
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
      <div
        className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[3] w-[min(70%,320px)] h-[min(40vh,180px)] hidden md:block"
        aria-hidden
        style={{
          borderRadius: "52% 48% 48% 52% / 48% 52% 48% 52%",
          background: "radial-gradient(ellipse 90% 85% at 50% 50%, rgba(255,218,185,0.35) 0%, rgba(255,218,185,0.1) 65%, transparent 85%)",
          filter: "blur(32px)",
        }}
      />

      {/* TEXT: no box, just content over liquid blurs */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4 sm:px-4 md:px-6 z-10">
        <div className="pointer-events-auto w-full max-w-2xl sm:max-w-3xl md:max-w-4xl flex flex-col items-center justify-center py-6 md:py-10 lg:py-14 px-4 sm:px-4 relative">
          {/* Beige oval glow – subtler on mobile, full on desktop */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[120%] md:hidden"
            style={{
              aspectRatio: "2.4 / 1",
              background: "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(245, 238, 220, 0.3) 0%, rgba(242, 232, 210, 0.15) 50%, transparent 75%)",
              borderRadius: "50%",
              filter: "blur(20px)",
              zIndex: 0,
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[140%] hidden md:block"
            style={{
              aspectRatio: "2.4 / 1",
              background: "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(245, 238, 220, 0.45) 0%, rgba(242, 232, 210, 0.25) 50%, rgba(238, 224, 200, 0.08) 75%, transparent 100%)",
              borderRadius: "50%",
              filter: "blur(20px)",
              zIndex: 0,
            }}
          />
          <h1
            className="font-normal leading-tight text-center whitespace-normal md:whitespace-nowrap relative z-[1]"
            style={{
              fontFamily: "var(--font-script)",
              color: "#fff",
              fontSize: "clamp(2.25rem, 10vw, 6.72rem)",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.15), 0 0 15px rgba(255, 105, 180, 0.55), 0 0 35px rgba(255, 105, 180, 0.45), 0 0 55px rgba(255, 105, 180, 0.35), 0 0 85px rgba(255, 105, 180, 0.25), 0 0 120px rgba(255, 105, 180, 0.15), 0 0 160px rgba(255, 105, 180, 0.08)",
            }}
          >
            Creativity by Lily
          </h1>
          <p
            className="mt-0 text-base md:text-xl lg:text-2xl font-normal text-center relative z-[1]"
            style={{
              fontFamily: "var(--font-playfair)",
              color: "#fff",
              letterSpacing: "2px",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.15), 0 0 12px rgba(255, 105, 180, 0.5), 0 0 28px rgba(255, 105, 180, 0.4), 0 0 45px rgba(255, 105, 180, 0.28), 0 0 70px rgba(255, 105, 180, 0.18), 0 0 100px rgba(255, 105, 180, 0.1)",
            }}
          >
            Handcrafted Coastal Jewelry
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mt-4 md:mt-8 relative z-[1]">
            <Link
              href="/products"
              className="shop-collection-btn bg-[color:var(--logo-pink)] text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-medium text-center inline-block text-sm md:text-base"
              style={{
                background: "linear-gradient(135deg, var(--logo-pink) 0%, #ec4899 100%)",
                boxShadow: "0 4px 15px rgba(255, 105, 180, 0.4), 0 8px 25px rgba(255, 105, 180, 0.3)",
                transition: "all 0.3s ease",
              }}
            >
              Shop Collection
            </Link>
            <Link
              href="#about"
              className="shop-collection-btn bg-[color:var(--logo-pink)] text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-medium text-center inline-block text-sm md:text-base"
              style={{
                background: "linear-gradient(135deg, var(--logo-pink) 0%, #ec4899 100%)",
                boxShadow: "0 4px 15px rgba(255, 105, 180, 0.4), 0 8px 25px rgba(255, 105, 180, 0.3)",
                transition: "all 0.3s ease",
              }}
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
