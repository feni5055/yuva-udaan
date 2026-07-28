import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Download, FileText, LoaderCircle, MessageCircle, Trash2, Users } from "lucide-react";
import { Link, useParams } from "react-router";
import { useAuth } from "../AppContext";
import {
  deleteComment,
  getMagazine,
  getMagazinePdfLink,
  listMagazineComments,
  listPublishedArticles,
  submitMagazineComment,
  type Article,
  type Comment,
  type Magazine,
} from "../contentService";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function IssueDetail() {
  const { id = "" } = useParams();
  const { authReady, isLoggedIn, isAdmin, user, profile } = useAuth();
  const [issue, setIssue] = useState<Magazine | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBody, setCommentBody] = useState("");
  const [commentNotice, setCommentNotice] = useState("");
  const [commentError, setCommentError] = useState("");
  const [commentBusy, setCommentBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!UUID_PATTERN.test(id)) {
      setIssue(null);
      setArticles([]);
      setComments([]);
      setError("This magazine link is invalid.");
      setLoading(false);
      return;
    }

    let active = true;
    void Promise.all([getMagazine(id), listPublishedArticles(id), listMagazineComments(id)])
      .then(([magazine, magazineArticles, magazineComments]) => {
        if (!active) return;
        setIssue(magazine);
        setArticles(magazineArticles);
        setComments(magazineComments);
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
  }, [id, user?.id]);

  const refreshComments = async () => {
    setComments(await listMagazineComments(id));
  };

  const postComment = async () => {
    const body = commentBody.trim();
    if (!user || !body) return;
    setCommentBusy(true);
    setCommentError("");
    setCommentNotice("");
    try {
      await submitMagazineComment(id, user.id, body);
      setCommentBody("");
      setCommentNotice("Your comment was submitted for admin approval.");
      await refreshComments();
    } catch (requestError) {
      setCommentError(requestError instanceof Error ? requestError.message : "The comment could not be submitted.");
    } finally {
      setCommentBusy(false);
    }
  };

  const removeComment = async (commentId: string) => {
    if (!window.confirm("Delete this comment permanently?")) return;
    setCommentBusy(true);
    setCommentError("");
    try {
      await deleteComment(commentId);
      await refreshComments();
    } catch (requestError) {
      setCommentError(requestError instanceof Error ? requestError.message : "The comment could not be deleted.");
    } finally {
      setCommentBusy(false);
    }
  };

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

      <section className="max-w-5xl mx-auto px-5 pb-20">
        <div className="border-t border-border pt-10">
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle size={20} className="text-primary" />
            <h2 className="text-2xl font-display font-bold">Comments</h2>
          </div>

          {authReady && isLoggedIn ? (
            <div className="bg-card border border-border p-5 mb-8">
              <label htmlFor="magazine-comment" className="block text-sm font-display font-semibold mb-2">
                Comment as {profile?.fullName || user?.email || "member"}
              </label>
              <textarea
                id="magazine-comment"
                value={commentBody}
                maxLength={2000}
                rows={4}
                onChange={(event) => setCommentBody(event.target.value)}
                placeholder="Write your comment about this magazine…"
                className="w-full resize-y bg-input-background border border-border p-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground font-body">{commentBody.length}/2000</span>
                <button
                  type="button"
                  disabled={commentBusy || !commentBody.trim()}
                  onClick={() => void postComment()}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 text-sm font-body disabled:opacity-50"
                >
                  {commentBusy && <LoaderCircle size={14} className="animate-spin" />}
                  Submit comment
                </button>
              </div>
              <p className="text-xs text-muted-foreground font-body mt-3">Comments appear publicly after administrator approval.</p>
            </div>
          ) : authReady ? (
            <div className="bg-secondary p-5 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm font-body text-secondary-foreground">Please sign in to leave a comment.</p>
              <Link to="/login" className="inline-flex justify-center bg-primary text-primary-foreground px-4 py-2.5 text-sm font-body">
                Sign in to comment
              </Link>
            </div>
          ) : (
            <div className="mb-8 text-sm text-muted-foreground font-body">Checking your account…</div>
          )}

          {commentNotice && <p role="status" className="mb-5 text-sm bg-green-50 text-green-800 border border-green-200 p-3 font-body">{commentNotice}</p>}
          {commentError && <p role="alert" className="mb-5 text-sm bg-destructive/10 text-destructive border border-destructive/20 p-3 font-body">{commentError}</p>}

          <div className="space-y-4">
            {comments.map((comment) => {
              const ownsComment = comment.profileId === user?.id;
              return (
                <article key={comment.id} className="border border-border bg-card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-display font-semibold">
                        {ownsComment ? (profile?.fullName || "You") : "Yuva Kalam member"}
                      </p>
                      <p className="text-xs text-muted-foreground font-body mt-1">
                        {new Date(comment.createdAt).toLocaleDateString()}
                        {!comment.isApproved && " · Awaiting approval"}
                      </p>
                    </div>
                    {(ownsComment || isAdmin) && (
                      <button
                        type="button"
                        disabled={commentBusy}
                        onClick={() => void removeComment(comment.id)}
                        className="inline-flex items-center gap-1 text-xs text-destructive hover:underline font-body disabled:opacity-50"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    )}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed font-body whitespace-pre-wrap">{comment.body}</p>
                </article>
              );
            })}
            {comments.length === 0 && (
              <p className="text-sm text-muted-foreground font-body">No comments yet. Be the first to join the discussion.</p>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground font-body">
        <BookOpen size={13} className="inline mr-1" /> Hindi Club Magazine
      </footer>
    </main>
  );
}
