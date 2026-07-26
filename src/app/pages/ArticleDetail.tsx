import { useEffect, useState } from "react";
import { ArrowLeft, LoaderCircle, MessageCircle } from "lucide-react";
import { Link, useParams } from "react-router";
import { useAuth } from "../AppContext";
import {
  getArticle,
  listComments,
  submitComment,
  type Article,
  type Comment,
} from "../contentService";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function ArticleDetail() {
  const { id = "" } = useParams();
  const { isLoggedIn, user } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!UUID_PATTERN.test(id)) {
      setArticle(null);
      setComments([]);
      setError("This article link is invalid.");
      setLoading(false);
      return;
    }

    let active = true;
    void Promise.all([getArticle(id), listComments(id)])
      .then(([articleData, commentData]) => {
        if (!active) return;
        setArticle(articleData);
        setComments(commentData.filter((comment) => comment.isApproved));
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

  const addComment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !body.trim()) return;
    setSubmitting(true);
    setError("");
    setNotice("");
    try {
      await submitComment(id, user.id, body);
      setBody("");
      setNotice("Your comment was submitted and is waiting for approval.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Comment submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center bg-background"><LoaderCircle className="animate-spin text-primary" aria-label="Loading article" /></main>;
  }

  if (!article) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-5">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold mb-3">Article not found</h1>
          <p className="text-muted-foreground font-body mb-6">{error || "This article is not published."}</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 text-sm font-body"><ArrowLeft size={14} /> Back home</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-5 py-4">
          <Link to={article.magazineId ? `/issues/${article.magazineId}` : "/"} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-body">
            <ArrowLeft size={14} /> Back
          </Link>
        </div>
      </header>
      <article className="max-w-3xl mx-auto px-5 py-12 md:py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-accent font-body mb-3">{article.language}</p>
        <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-4">{article.title}</h1>
        {article.excerpt && <p className="text-lg text-muted-foreground font-body leading-relaxed mb-10">{article.excerpt}</p>}
        <div className="whitespace-pre-wrap text-base leading-8 font-body">{article.content}</div>
      </article>

      <section className="max-w-3xl mx-auto px-5 pb-20">
        <div className="border-t border-border pt-10">
          <h2 className="flex items-center gap-2 text-2xl font-display font-bold mb-6"><MessageCircle size={20} /> Comments</h2>
          <div className="space-y-3 mb-8">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-secondary p-4">
                <p className="font-body text-sm whitespace-pre-wrap">{comment.body}</p>
                <p className="text-xs text-muted-foreground font-body mt-2">{new Date(comment.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
            {comments.length === 0 && <p className="text-sm text-muted-foreground font-body">No approved comments yet.</p>}
          </div>

          {isLoggedIn ? (
            <form onSubmit={addComment} className="space-y-3">
              <label htmlFor="comment-body" className="block text-sm font-semibold font-body">Add a comment</label>
              <textarea
                id="comment-body"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                maxLength={2000}
                required
                rows={4}
                className="w-full bg-input-background border border-border p-3 text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button disabled={submitting || !body.trim()} className="bg-primary disabled:opacity-60 text-primary-foreground px-4 py-2.5 text-sm font-body">
                {submitting ? "Submitting…" : "Submit for approval"}
              </button>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground font-body"><Link to="/login" className="text-accent hover:underline">Sign in</Link> to leave a comment.</p>
          )}
          {notice && <p role="status" className="text-sm text-green-700 mt-3 font-body">{notice}</p>}
          {error && <p role="alert" className="text-sm text-destructive mt-3 font-body">{error}</p>}
        </div>
      </section>
    </main>
  );
}
