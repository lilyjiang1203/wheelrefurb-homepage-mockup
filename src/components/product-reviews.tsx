import { useState, type FormEvent } from "react";
import { Camera, Search, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";

/** Local sandbox preview only; no customer review is published or persisted. */
export type ProductReview = {
  id: string;
  rating: number;
  title: string;
  body: string;
  displayName: string;
  createdAt: string;
  photoNames: string[];
};

export function averageRating(reviews: ProductReview[]): number | null {
  if (!reviews.length) return null;
  return Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10) / 10;
}

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="rv-stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} className={n <= Math.round(value) ? "rv-star-on" : "rv-star-off"} />
      ))}
    </span>
  );
}

export function ReviewSummary({ reviews, onWrite }: { reviews: ProductReview[]; onWrite: () => void }) {
  const avg = averageRating(reviews);
  const scrollToReviews = () => document.getElementById("customer-reviews")?.scrollIntoView({ behavior: "smooth" });
  return (
    <div className="rv-summary rv-summary-opi">
      <button type="button" className="rv-opi-rating" onClick={scrollToReviews}>
        <Stars value={avg ?? 0} size={15} />
        <span>{avg === null ? "No reviews yet" : `${avg.toFixed(1)} (${reviews.length})`}</span>
      </button>
      <button type="button" className="rv-opi-write" onClick={onWrite}>Write a Review</button>
    </div>
  );
}

export function ReviewsSection({ reviews, onWrite }: { reviews: ProductReview[]; onWrite: () => void }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");
  const [topic, setTopic] = useState("");
  const avg = averageRating(reviews);
  const topics = ["Color Accuracy", "Finish Quality", "Application", "Durability"];
  const normalized = query.trim().toLowerCase();

  const shown = reviews
    .filter((review) => {
      const text = `${review.title} ${review.body}`.toLowerCase();
      return (!normalized || text.includes(normalized)) && (!topic || text.includes(topic.toLowerCase().split(" ")[0]));
    })
    .sort((a, b) => sort === "highest"
      ? b.rating - a.rating
      : sort === "lowest"
        ? a.rating - b.rating
        : Date.parse(b.createdAt) - Date.parse(a.createdAt));

  // Photo names are local demo metadata, not actual uploaded image URLs.
  const photoNames = reviews.flatMap((r) => r.photoNames);

  return (
    <section id="customer-reviews" className="pd-section rv-section rv-opi-section" aria-labelledby="rv-title">
      <h2 id="rv-title" className="rv-section-title">Reviews</h2>

      <div className="rv-opi-overview">
        <div>
          <p className="rv-overview-label">Overall Rating</p>
          <div className="rv-opi-score-row">
            <strong className="rv-score">{avg === null ? "—" : avg.toFixed(1)}</strong>
            <div>
              <Stars value={avg ?? 0} />
              <p className="rv-count">{reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}</p>
            </div>
          </div>
        </div>
        <div className="rv-opi-rate-block">
          <p className="rv-overview-label">Review this Product</p>
          <div className="rv-opi-pick-stars" aria-label="Write a product review">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" aria-label={`Write a ${n}-star review`} onClick={onWrite}>
                <Star size={21} />
              </button>
            ))}
          </div>
          <p className="rv-review-note">Share your experience. This sandbox does not verify email or publish reviews.</p>
        </div>
      </div>

      <div className="rv-opi-gallery">
        <h3>Customer Images and Videos</h3>
        {photoNames.length ? (
          <div className="rv-photo-names">
            {photoNames.map((name, index) => <span key={`${name}-${index}`}><Camera size={15} /> {name}</span>)}
          </div>
        ) : (
          <div className="rv-no-media"><Camera size={20} /><span>No customer images or videos yet.</span></div>
        )}
      </div>

      <div className="rv-opi-filter">
        <h3>Filter Reviews</h3>
        <label className="rv-search">
          <input type="search" placeholder="Search topics and reviews" value={query}
            onChange={(event) => setQuery(event.target.value)} disabled={!reviews.length} />
          <Search size={18} aria-hidden="true" />
        </label>
        <div className="rv-topic-row">
          {topics.map((name) => (
            <button key={name} type="button" disabled={!reviews.length}
              aria-pressed={topic === name}
              onClick={() => setTopic(topic === name ? "" : name)}>
              {name}
            </button>
          ))}
        </div>
        <label className="rv-sort">Sort reviews
          <select value={sort} onChange={(event) => setSort(event.target.value)} disabled={!reviews.length}>
            <option value="recent">Most recent</option>
            <option value="highest">Highest rating</option>
            <option value="lowest">Lowest rating</option>
          </select>
        </label>
      </div>

      {!reviews.length ? (
        <p className="rv-empty">No reviews yet. Be the first to share your experience with this product.</p>
      ) : !shown.length ? (
        <p className="rv-empty">No reviews match your filters.</p>
      ) : (
        <ul className="rv-list">
          {shown.map((review) => (
            <li className="rv-card" key={review.id}>
              <Stars value={review.rating} />
              <h4>{review.title}</h4>
              <p>{review.body}</p>
              <p className="rv-meta">{review.displayName} · {new Date(review.createdAt).toLocaleDateString("en-CA")} · Local sandbox preview, not published</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function WriteReviewDialog({
  open, onOpenChange, productName, onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  onSubmit: (review: ProductReview) => void;
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [files, setFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const title = String(values.get("title") ?? "").trim();
    const body = String(values.get("body") ?? "").trim();
    const displayName = String(values.get("name") ?? "").trim();
    const email = String(values.get("email") ?? "").trim();
    if (!rating) return setError("Please choose a star rating.");
    if (!title || !body || !displayName) return setError("Please complete the title, review and display name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email address.");

    onSubmit({
      id: crypto.randomUUID(),
      rating,
      title: title.slice(0, 120),
      body: body.slice(0, 2000),
      displayName: displayName.slice(0, 60),
      createdAt: new Date().toISOString(),
      photoNames: files,
    });
    setRating(0);
    setFiles([]);
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rv-dialog">
        <DialogTitle>Write a Review</DialogTitle>
        <DialogDescription>{productName} · Sandbox only. Reviews stay on this page and are not published.</DialogDescription>
        <form className="rv-form" onSubmit={submit} noValidate>
          <div>
            <span className="rv-label">Your rating</span>
            <div className="rv-rate" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} aria-label={`${n} stars`} aria-pressed={rating === n}
                  onMouseEnter={() => setHover(n)} onClick={() => setRating(n)}>
                  <Star size={25} className={n <= (hover || rating) ? "rv-star-on" : "rv-star-off"} />
                </button>
              ))}
            </div>
          </div>
          <label><span className="rv-label">Review title</span><input name="title" maxLength={120} /></label>
          <label><span className="rv-label">Review</span><textarea name="body" rows={4} maxLength={2000} /></label>
          <div className="rv-row">
            <label><span className="rv-label">Display name</span><input name="name" maxLength={60} /></label>
            <label><span className="rv-label">Email address (demo only, not saved)</span><input name="email" type="email" maxLength={255} /></label>
          </div>
          <label className="rv-upload">
            <Camera size={18} />
            <span>{files.length ? files.join(", ") : "Select photos (names only, no upload)"}</span>
            <input type="file" accept="image/*" multiple
              onChange={(event) => setFiles(Array.from(event.target.files ?? []).map((file) => file.name))} />
          </label>
          {error && <p className="rv-error" role="alert">{error}</p>}
          <Button type="submit">Preview Review</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
