import { describe, expect, it } from "vitest";
import { availableGalleryMedia, selectGalleryMedia } from "./product-gallery-media";

describe("available product gallery media", () => {
  const images = [
    { id: "front", src: "/front.jpg", alt: "Front", label: "Front View" },
    { id: "back", src: "/back.jpg", alt: "Back", label: "Back View" },
    { id: "wheel", src: null, alt: "Wheel", label: "Wheel Image" },
    { id: "empty", src: "  ", alt: "Empty", label: "Empty" },
  ];
  it("keeps Front View and Back View and hides missing images", () => {
    expect(availableGalleryMedia(images).map((item) => item.id)).toEqual(["front", "back"]);
  });
  it("hides videos without actual sources even if a poster exists", () => {
    expect(availableGalleryMedia([], [{ id: "video", label: "Video", poster: "/poster.jpg", sources: [{ src: null, type: "video/mp4" }, { src: " ", type: "video/webm" }] }])).toEqual([]);
  });
  it("keeps a video when at least one actual source exists", () => {
    expect(availableGalleryMedia([], [{ id: "video", label: "Video", sources: [{ src: null, type: "video/webm" }, { src: "/video.mp4", type: "video/mp4" }] }])[0]).toMatchObject({ id: "video", sources: [{ src: "/video.mp4", type: "video/mp4" }] });
  });
  it("falls back to an available image when the selected media fails", () => {
    const result = selectGalleryMedia(availableGalleryMedia(images), "front", ["front"]);
    expect(result.available.map((item) => item.id)).toEqual(["back"]);
    expect(result.active?.id).toBe("back");
  });
  it("returns no active media when all sources are unavailable", () => {
    expect(selectGalleryMedia(availableGalleryMedia(images), "back", ["front", "back"]).active).toBeUndefined();
  });
});