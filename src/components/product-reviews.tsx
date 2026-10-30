import { useState, type FormEvent } from "react";
import { Camera, Search, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";

/** Shape a future moderated review system can return. No fake reviews are ever seeded. */
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
  return Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;
}

function Stars({ value, size = 14 }: { value: number; size?: number }) {
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
  const scroll = () => document.getElementById("customer-reviews")?.scrollIntoView({ behavior: "smooth" });
  return (
    <div className="rv-summary">
      {avg === null ? (
        <button type="button" className="rv-link-muted" onClick={scroll}>
          No reviews yet
        </button>
      ) : (
        <button type="button" className="rv-link-muted" onClick={scroll}>
          {avg} <Stars value={avg} size={12} /> ({reviews.length} {reviews.length === 1 ? "Review" : "Reviews"})
        </button>
      )}
      <span aria-hidden="true">·</span>
      <button type="button" className="rv-link" onClick={onWrite}>
        Write a Review
      </button>
    </div>
  );
}

export function ReviewsSection({ reviews, onWrite }: { reviews: ProductReview[]; onWrite: () => void }) {
  const [query, setQuery] = useState("");
  const avg = averageRating(reviews);
  const q = query.trim().toLowerCase();
  const shown = q
    ? reviews.filter((r) => `${r.title} ${r.body}`.toLowerCase().includes(q))
    : reviews;
  const photos = reviews.flatMap((r) => r.photoNames);
  return (
    <section id="customer-reviews" className="pd-section rv-section" aria-labelledby="rv-title">
      <h2 id="rv-title">Customer Reviews</h2>
      <div className="rv-head">
        <div className="rv-overall">
          <span className="rv-score">{avg ?? "—"}</span>
          <div>
            <Stars value={avg ?? 0} size={16} />
            <p>
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>
        <Button onClick={onWrite}>Write a Review</Button>
      </div>

      <div className="rv-media">
        <h3>Customer Photos &amp; Videos</h3>
        {photos.length ? (
          <ul>
            {photos.map((n, i) => (
              <li key={i}>
                <Camera size={14} /> {n}
              </li>
            ))}
          </ul>
        ) : (
          <p>No customer photos or videos yet.</p>
        )}
      </div>

      <div className="rv-tools">
        <label className="rv-search">
          <Search size={14} />
          <input
            type="search"
            placeholder="Search reviews"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={!reviews.length}
          />
        </label>
        <select aria-label="Sort reviews" disabled={!reviews.length}>
          <option>Most recent</option>
          <option>Highest rating</option>
          <option>Lowest rating</option>
        </select>
      </div>

      {reviews.length === 0 ? (
        <p className="rv-empty">No reviews yet. Be the first to share your experience with this product.</p>
      ) : (
        <ul className="rv-list">
          {shown.map((r) => (
            <li key={r.id} className="rv-card">
              <Stars value={r.rating} />
              <h4>{r.title}</h4>
              <p>{r.body}</p>
              <p className="rv-meta">
                {r.displayName} · {new Date(r.createdAt).toLocaleDateString("en-US")} · Pending moderation (sandbox)
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function WriteReviewDialog({
  open,
  onOpenChange,
  productName,
  onSubmit,
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

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const title = String(f.get("title") ?? "").trim();
    const body = String(f.get("body") ?? "").trim();
    const displayName = String(f.get("name") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
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
        <DialogDescription>
          {productName} · Sandbox only — reviews stay on this page and are not published.
        </DialogDescription>
        <form className="rv-form" onSubmit={submit} noValidate>
          <div>
            <span className="rv-label">Your rating</span>
            <div className="rv-rate" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  aria-pressed={rating === n}
                  onMouseEnter={() => setHover(n)}
                  onClick={() => setRating(n)}
                >
                  <Star size={24} className={n <= (hover || rating) ? "rv-star-on" : "rv-star-off"} />
                </button>
              ))}
            </div>
          </div>
          <label>
            <span className="rv-label">Review title</span>
            <input name="title" maxLength={120} />
          </label>
          <label>
            <span className="rv-label">Review</span>
            <textarea name="body" rows={4} maxLength={2000} />
          </label>
          <div className="rv-row">
            <label>
              <span className="rv-label">Display name</span>
              <input name="name" maxLength={60} />
            </label>
            <label>
              <span className="rv-label">Email address</span>
              <input name="email" type="email" maxLength={255} />
            </label>
          </div>
          <label className="rv-upload">
            <Camera size={18} />
            <span>{files.length ? files.join(", ") : "Add photos (optional)"}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((x) => x.name))}
            />
          </label>
          {error && <p className="rv-error">{error}</p>}
          <Button type="submit">Submit Review</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
