/**
 * Shared Cape Cod photo + pink wash + light veil (matches About Us section).
 */
export function CoastalBackdropLayers() {
  return (
    <>
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: "url('/cape-codbg.jpg')" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(255, 114, 166, 0.28) 0%, rgba(255, 114, 166, 0.42) 45%, rgba(255, 180, 205, 0.38) 100%)',
        }}
        aria-hidden
      />
      <div className="absolute inset-0 z-[2] pointer-events-none bg-white/25" aria-hidden />
    </>
  );
}

/** Full-viewport shop / page shell with coastal background */
export default function CoastalBackdrop({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <CoastalBackdropLayers />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
