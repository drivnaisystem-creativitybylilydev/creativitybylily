/**
 * Shared founder story copy for the home teaser and the full /about page.
 */
export function OurStoryContent() {
  return (
    <>
      <div className="space-y-5 text-gray-700 text-base sm:text-lg leading-[1.75]">
        <p>
          Creativity By Lily Co was founded when Lily was just 13 during COVID, turning her lifelong dream of owning a
          business into something real.
        </p>
        <p>
          Growing up with sensitive skin, she struggled to find jewelry she could wear comfortably, which inspired her
          to create pieces that are both hypoallergenic and made for everyday wear.
        </p>
        <p>
          Deeply inspired by the beauty of the Cape, the ocean, the calm, and the effortless coastal lifestyle, each
          piece is designed to reflect that same feeling.
        </p>
      </div>

      <blockquote
        className="relative my-2 border-l-[3px] border-[color:var(--logo-pink)]/70 py-1 pl-5 sm:pl-6"
        style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
      >
        <p className="text-lg font-light italic leading-relaxed tracking-wide text-gray-800 sm:text-xl">
          Timeless, water-resistant, and meant to be lived in.
        </p>
      </blockquote>

      <div className="space-y-5 text-gray-700 text-base sm:text-lg leading-[1.75]">
        <p>
          What began as a small idea has grown into something so meaningful, and every order truly means the world.
        </p>
      </div>

      <blockquote
        className="relative my-2 border-l-[3px] border-[color:var(--logo-pink)]/70 py-1 pl-5 sm:pl-6"
        style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
      >
        <p className="text-lg font-light italic leading-relaxed tracking-wide text-gray-800 sm:text-xl">
          Thank you for visiting and supporting her dream—it wouldn&apos;t be possible without you.
        </p>
      </blockquote>
    </>
  );
}
