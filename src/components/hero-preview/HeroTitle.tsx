import Link from "next/link";
import { heroPalette } from "./heroData";

type CTA = { label: string; href: string };

/** Thin line — sparkle — thin line. The flourish from Lily's inspo board, redrawn as a single crisp glyph instead of a decorative sticker. */
export function HeroFlourish({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const color = tone === "light" ? "rgba(255,255,255,0.9)" : heroPalette.pink;
  return (
    <div className="mb-4 flex items-center justify-center gap-3" aria-hidden>
      <span className="h-px w-10 sm:w-14" style={{ background: color, opacity: 0.55 }} />
      <svg width="13" height="13" viewBox="0 0 24 24" fill={color} aria-hidden>
        <path d="M12 1 L14.6 9.4 L23 12 L14.6 14.6 L12 23 L9.4 14.6 L1 12 L9.4 9.4 Z" />
      </svg>
      <span className="h-px w-10 sm:w-14" style={{ background: color, opacity: 0.55 }} />
    </div>
  );
}

export function HeroTitle({
  tone = "dark",
  align = "center",
  headline = "Creativity by Lily",
  subhead = "Handcrafted Coastal Jewelry",
  primaryCta,
  secondaryCta,
  size = "default",
  glow: glowOverride,
}: {
  tone?: "dark" | "light";
  align?: "center" | "left";
  headline?: string;
  subhead?: string;
  primaryCta: CTA;
  secondaryCta: CTA;
  size?: "default" | "compact";
  /** Overrides the default text-shadow — e.g. a stronger multi-layer glow for text sitting over a busy multi-photo collage. */
  glow?: string;
}) {
  const textColor = tone === "light" ? "#ffffff" : heroPalette.ink;
  const subColor = tone === "light" ? "rgba(255,255,255,0.92)" : heroPalette.navy;
  const glow =
    glowOverride ??
    (tone === "light"
      ? "0 1px 2px rgba(0,0,0,0.18), 0 0 30px rgba(0,0,0,0.18)"
      : "none");
  const items = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col ${items}`}>
      <HeroFlourish tone={tone} />
      <h1
        className="leading-[0.95] font-normal"
        style={{
          fontFamily: "var(--font-allura)",
          color: textColor,
          fontSize: size === "compact" ? "clamp(2.75rem, 8vw, 5rem)" : "clamp(3.25rem, 9vw, 7rem)",
          textShadow: glow,
        }}
      >
        {headline}
      </h1>
      <p
        className="mt-2 sm:mt-3 font-serif"
        style={{
          fontFamily: "var(--font-playfair)",
          color: subColor,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontSize: size === "compact" ? "0.7rem" : "0.85rem",
          fontWeight: 500,
        }}
      >
        {subhead}
      </p>
      <div className={`mt-6 sm:mt-8 flex flex-row flex-wrap gap-2.5 sm:gap-3 ${align === "center" ? "justify-center" : "justify-start"}`}>
        <Link
          href={primaryCta.href}
          className="rounded-full px-5 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-medium tracking-wide transition-colors duration-300 whitespace-nowrap"
          style={{ background: heroPalette.pink, color: "#fff" }}
        >
          {primaryCta.label}
        </Link>
        <Link
          href={secondaryCta.href}
          className="rounded-full px-5 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-medium tracking-wide border transition-colors duration-300 whitespace-nowrap"
          style={
            tone === "light"
              ? { borderColor: "rgba(255,255,255,0.7)", color: "#fff" }
              : { borderColor: heroPalette.pink, color: heroPalette.pink }
          }
        >
          {secondaryCta.label}
        </Link>
      </div>
    </div>
  );
}
