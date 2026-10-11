"use client";

import { useState } from "react";
import HeroVariantA from "@/components/hero-preview/HeroVariantA";
import HeroVariantB from "@/components/hero-preview/HeroVariantB";
import HeroVariantC from "@/components/hero-preview/HeroVariantC";
import HeroVariantD from "@/components/hero-preview/HeroVariantD";

const VARIANTS = [
  { id: "d", label: "D — Classic Collage", Component: HeroVariantD },
  { id: "a", label: "A — Refined Bento", Component: HeroVariantA },
  { id: "b", label: "B — Full-Bleed Ocean", Component: HeroVariantB },
  { id: "c", label: "C — Editorial Split", Component: HeroVariantC },
] as const;

export default function HeroPreviewPage() {
  const [active, setActive] = useState<(typeof VARIANTS)[number]["id"]>("d");
  const current = VARIANTS.find((v) => v.id === active) ?? VARIANTS[0];
  const Current = current.Component;

  return (
    <div className="min-h-screen bg-[#fefcf9]">
      <div className="fixed inset-x-0 top-0 z-[100] flex justify-center pt-3 pointer-events-none">
        <div
          className="pointer-events-auto inline-flex items-center gap-1 rounded-full p-1 shadow-lg"
          style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)" }}
        >
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setActive(v.id)}
              className="rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-colors"
              style={{
                background: active === v.id ? "#e394a5" : "transparent",
                color: active === v.id ? "#fff" : "#4a5d7a",
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
      <Current />
    </div>
  );
}
