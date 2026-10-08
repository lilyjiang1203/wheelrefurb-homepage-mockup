export type GalleryImage = { id: string; src?: string | null; alt: string; label: string };
export type GalleryVideo = { id: string; label: string; poster?: string | null; sources: { src?: string | null; type: string }[] };
export type GalleryMedia =
  | { kind: "image"; id: string; src: string; alt: string; label: string }
  | { kind: "video"; id: string; label: string; poster?: string; sources: { src: string; type: string }[] };

export function availableGalleryMedia(images: GalleryImage[], videos: GalleryVideo[] = []): GalleryMedia[] {
  const media: GalleryMedia[] = [];
  for (const image of images) {
    const src = image.src?.trim();
    if (src) media.push({ ...image, src, kind: "image" });
  }
  for (const video of videos) {
    const sources = video.sources.flatMap((source) => {
      const src = source.src?.trim();
      return src ? [{ src, type: source.type }] : [];
    });
    if (sources.length) media.push({ ...video, kind: "video", poster: video.poster?.trim() || undefined, sources });
  }
  return media;
}

export function selectGalleryMedia(media: GalleryMedia[], selectedId: string | null, failedIds: string[]) {
  const available = media.filter((item) => !failedIds.includes(item.id));
  return { available, active: available.find((item) => item.id === selectedId) ?? available[0] };
}