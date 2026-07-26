import { ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <BookOpen size={34} className="mx-auto mb-5 text-primary" aria-hidden="true" />
        <p className="text-xs uppercase tracking-[0.2em] text-accent font-body mb-3">404</p>
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">Page not found</h1>
        <p className="text-muted-foreground font-body mb-7">
          The page you requested may have moved or no longer exists.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 text-sm font-body"
        >
          <ArrowLeft size={14} /> Back to Magazine
        </Link>
      </div>
    </main>
  );
}
