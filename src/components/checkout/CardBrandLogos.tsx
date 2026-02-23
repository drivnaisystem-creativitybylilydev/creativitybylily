'use client';

/**
 * Professional card network logos (Visa, Mastercard, Amex, Discover).
 * Styled to match common brand guidelines; used on checkout payment section.
 */
export default function CardBrandLogos() {
  return (
    <div className="flex items-center gap-2" aria-label="Accepted cards: Visa, Mastercard, American Express, Discover">
      {/* Visa */}
      <div className="w-10 h-7 flex items-center justify-center rounded overflow-hidden bg-[#1A1F71]" title="Visa">
        <svg viewBox="0 0 48 16" className="h-3.5 w-[30px]" fill="white">
          <path d="M19.2 2.2L17 13.8h-3.4l2.2-11.6h3.4zm11.4 8.5c0-1.2-.5-2-1.9-2-.8 0-1.4.4-1.8 1l-1.6-.7c.5-1 1.4-1.7 2.6-1.7 1.8 0 3 1.1 3 3.2 0 2.4-1 3.6-2 4.5-.5.4-.8.8-.8 1.2 0 .6.5.9 1.2.9.7 0 1.4-.3 1.9-.8l1.6.6c-.6.9-1.5 1.4-2.8 1.4-1.8 0-2.9-1-2.9-3zm7.2-8.6l-2 5.5-.2.6-.7-3.3c-.1-.5-.3-.7-.6-.7h-2.6l-.1.4c1 .2 2 .8 2.3 1.5l1.3 6.2h3.5l5.2-11.2h-3.5zm-22.2 0l-3.4 8.5-.4 1.9-.1.5c-.1.5.2.8.6.8h2.1l1.2-11.7H15.6zm-4.2 0L6 13.8H2.6L5.2 2.2h3.4zM7.5 2.2L2.9 13.8H0L4.6 2.2h2.9z" />
        </svg>
      </div>
      {/* Mastercard */}
      <div className="w-10 h-7 flex items-center justify-center rounded overflow-hidden" title="Mastercard">
        <svg viewBox="0 0 24 16" className="h-4 w-6">
          <circle cx="9" cy="8" r="6" fill="#EB001B" />
          <circle cx="15" cy="8" r="6" fill="#F79E1B" />
          <path fill="#FF5F00" d="M12 4.3a6 6 0 0 1 0 7.4 6 6 0 0 1 0-7.4z" />
        </svg>
      </div>
      {/* American Express */}
      <div className="w-10 h-7 flex items-center justify-center rounded overflow-hidden bg-[#006FCF]" title="American Express">
        <span className="text-[9px] font-bold tracking-tight text-white">AMEX</span>
      </div>
      {/* Discover */}
      <div className="w-10 h-7 flex items-center justify-center rounded overflow-hidden bg-[#fff]" title="Discover" style={{ border: '1px solid #eee' }}>
        <svg viewBox="0 0 80 24" className="h-3 w-8">
          <path fill="#231F20" d="M72.2 12h2.6v.9h-2.6v1.6h2.4v.9h-2.4v2.5h-1.1V12zm-4.2 4.2c0 .5.4.8 1 .8.4 0 .8-.2 1-.5l.4.7c-.4.4-.9.6-1.5.6-1.1 0-1.9-.9-1.9-2s.8-2 1.9-2c.6 0 1.1.2 1.5.6l-.4.7c-.2-.3-.6-.5-1-.5-.6 0-1 .3-1 .8zm-2.2-2.9h1.4l.9 2.4.9-2.4h1.3l-1.4 3.5 1.5 3.6h-1.4l-.9-2.3-.9 2.3h-1.3l1.5-3.6-1.4-3.5zm-3.2 1.1v-.8h-3.5v5.9h1.1v-2.4h2.1v-.8h-2.1v-1.1h2.4zm-2.5-1.1h1.2v5.9h-1.2V13.4zm-2.2 2.9c0 .5.4.8 1 .8.4 0 .8-.2 1-.5l.4.7c-.4.4-.9.6-1.5.6-1.1 0-1.9-.9-1.9-2s.8-2 1.9-2c.6 0 1.1.2 1.5.6l-.4.7c-.2-.3-.6-.5-1-.5-.6 0-1 .3-1 .8zm-4.2-2.9h1.4v1.2h.1c.2-.5.7-1.2 1.5-1.2 1.4 0 2.3 1.1 2.3 2.6s-.9 2.6-2.3 2.6c-.8 0-1.3-.7-1.5-1.2h-.1v.9h-1.2V12zm1.2 3.8c.7 0 1.2-.6 1.2-1.4s-.5-1.4-1.2-1.4-1.2.6-1.2 1.4.5 1.4 1.2 1.4z" />
        </svg>
      </div>
    </div>
  );
}
