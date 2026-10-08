import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "./ui/button";
import { availableGalleryMedia, selectGalleryMedia, type GalleryImage, type GalleryVideo } from "./product-gallery-media";

export function ProductGallery({ images, videos = [] }: { images: GalleryImage[]; videos?: GalleryVideo[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [failedIds, setFailedIds] = useState<string[]>([]);
  const { available, active } = selectGalleryMedia(availableGalleryMedia(images, videos), selectedId, failedIds);
  const hideMedia = (id: string) => setFailedIds((ids) => ids.includes(id) ? ids : [...ids, id]);
  if (!active) return null;

  return <>
    <div className="pd-gallery-stage" aria-live="polite">
      {active.kind === "image" ? <img key={active.id} src={active.src} alt={active.alt} width={768} height={768} onError={() => hideMedia(active.id)} /> : <video key={active.id} poster={active.poster} controls playsInline preload="metadata" aria-label={active.label} onError={() => hideMedia(active.id)}>{active.sources.map((source) => <source key={source.src} src={source.src} type={source.type} />)}</video>}
    </div>
    <div className="pd-thumbs" aria-label="Product gallery">
      {available.map((item) => <Button key={item.id} variant="outline" className="pd-thumb" aria-label={item.label} aria-pressed={active.id === item.id} onClick={() => setSelectedId(item.id)}>
        {item.kind === "image" ? <img src={item.src} alt="" onError={() => hideMedia(item.id)} /> : <>
          {item.poster ? <img src={item.poster} alt="" onError={(event) => { event.currentTarget.hidden = true; }} /> : <video muted playsInline preload="metadata" aria-hidden="true" onError={() => hideMedia(item.id)}>{item.sources.map((source) => <source key={source.src} src={source.src} type={source.type} />)}</video>}
          <span className="pd-play"><Play /></span><span className="pd-thumb-label">Video</span>
        </>}
      </Button>)}
    </div>
  </>;
}