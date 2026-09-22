const WIDTH = 120;
const HEIGHT = 28;

/** A stat-tile trend sparkline — see dataviz skill's "Stat tile (value + delta + sparkline)" form. */
export function Sparkline({ values, className = "text-primary" }: { values: number[]; className?: string }) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * WIDTH;
    const y = HEIGHT - ((value - min) / range) * HEIGHT;
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`;

  return (
    <svg
      className={className}
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path d={areaPath} fill="currentColor" opacity={0.1} />
      <path d={linePath} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
