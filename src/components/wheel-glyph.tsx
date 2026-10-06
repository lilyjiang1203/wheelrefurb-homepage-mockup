/** Placeholder wheel illustration for mock style cards; spoke count varies per style. */
export function WheelGlyph({ variant = 0 }: { variant?: number }) {
  const spokes = [5, 10, 7, 6][variant % 4];
  return <svg viewBox="0 0 100 100" aria-hidden="true" fill="none" stroke="currentColor">
    <circle cx="50" cy="50" r="46" strokeWidth="6" /><circle cx="50" cy="50" r="38" strokeWidth="1.5" /><circle cx="50" cy="50" r="9" strokeWidth="3" />
    {Array.from({ length: spokes }, (_, i) => { const a = (i / spokes) * Math.PI * 2; return <line key={i} x1={50 + Math.cos(a) * 10} y1={50 + Math.sin(a) * 10} x2={50 + Math.cos(a) * 37} y2={50 + Math.sin(a) * 37} strokeWidth={spokes > 7 ? 3 : 6} strokeLinecap="round" />; })}
  </svg>;
}
