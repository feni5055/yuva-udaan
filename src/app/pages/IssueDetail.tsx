import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Download, FileText, LoaderCircle, Users } from "lucide-react";
import { Link, useParams } from "react-router";
import {
  getMagazine,
  getMagazinePdfLink,
  listPublishedArticles,
  type Article,
  type Magazine,
} from "../contentService";

export default function IssueDetail() {
  const { id = "" } = useParams();
  const [issue, setIssue] = useState<Magazine | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let active = true;
    void Promise.all([getMagazine(id), listPublishedArticles(id)])
      .then(([magazine, magazineArticles]) => {
        if (!active) return;
        setIssue(magazine);
        setArticles(magazineArticles);
      })
      .catch((requestError: Error) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const downloadPdf = async () => {
    if (!issue?.pdfPath) return;
    setDownloading(true);
    setError("");
    try {
      const url = await getMagazinePdfLink(issue.pdfPath, issue.id);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The PDF could not be opened.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <LoaderCircle className="animate-spin text-primary" aria-label="Loading issue" />
      </main>
    );
  }

  if (!issue) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <h1 className="text-3xl font-display font-bold mb-3">Issue not found</h1>
          <p className="text-muted-foreground font-body mb-6">
            {error || "This magazine may have been removed or is not published yet."}
          </p>
          <Link to="/#issues" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 text-sm font-body">
            <ArrowLeft size={14} /> Back to archive
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-5 py-4">
          <Link to="/#issues" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
            <ArrowLeft size={15} /> Back to archive
          </Link>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-5 py-12 md:py-20 grid md:grid-cols-[minmax(0,280px)_1fr] gap-10 md:gap-14 items-start">
        <div className="aspect-[3/4] bg-secondary shadow-xl overflow-hidden">
          {issue.coverUrl ? (
            <img src={issue.coverUrl} alt={issue.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText size={44} className="text-primary" />
            </div>
          )}
        </div>
        <div>
          <p className="text-accent text-xs uppercase tracking-[0.2em] font-body mb-3">
            {issue.category || "Uncategorised"}
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-2">{issue.title}</h1>
          {issue.subtitle && <p className="text-lg text-muted-foreground font-body mb-7">{issue.subtitle}</p>}
          <div className="grid grid-cols-2 gap-3 mb-8 text-sm font-body">
            <div className="bg-secondary p-3"><span className="block text-xs text-muted-foreground mb-1">Volume</span>Vol. {issue.volume}</div>
            <div className="bg-secondary p-3"><span className="block text-xs text-muted-foreground mb-1">Year</span>{issue.year}</div>
          </div>
          {issue.editors && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground font-body mb-8">
              <Users size={15} /> {issue.editors}
            </p>
          )}
          <button
            type="button"
            disabled={!issue.pdfPath || downloading}
            onClick={() => void downloadPdf()}
            className="inline-flex items-center gap-2 bg-primary disabled:bg-muted disabled:text-muted-foreground text-primary-foreground px-5 py-3 text-sm font-body"
          >
            {downloading ? <LoaderCircle size={15} className="animate-spin" /> : <Download size={15} />}
            {issue.pdfPath ? "Open PDF" : "PDF unavailable"}
          </button>
          {error && <p role="alert" className="text-sm text-destructive mt-3 font-body">{error}</p>}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 pb-16">
        <h2 className="text-2xl font-display font-bold mb-6">Articles in this issue</h2>
        {articles.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {articles.map((article) => (
              <Link key={article.id} to={`/articles/${article.id}`} className="border border-border bg-card p-5 hover:border-accent transition-colors">
                <h3 className="font-display font-semibold text-lg mb-2">{article.title}</h3>
                <p className="font-body text-sm text-muted-foreground line-clamp-3">{article.excerpt || "Read this article"}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground font-body">No individual articles have been published for this issue yet.</p>
        )}
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground font-body">
        <BookOpen size={13} className="inline mr-1" /> Hindi Club Magazine
      </footer>
    </main>
  );
}
