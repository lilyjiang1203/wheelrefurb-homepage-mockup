import { useState } from "react";

/** Missing and failed product photos disappear rather than becoming invented imagery. */
export function FinderProductImage({ sources, name, compact = false }: { sources: string[]; name: string; compact?: boolean }) {
  const [failed, setFailed] = useState<string[]>([]);
  const src = sources.find((source) => !failed.includes(source));
  if (!src) return null;
  const image = <img src={src} alt={`${name} — supplied product swatch`} loading="lazy" onError={() => setFailed((previous) => [...previous, src])} />;
  return compact ? image : <div className="featured-media">{image}</div>;
}