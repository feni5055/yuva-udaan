import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { CheckCircle2, ExternalLink, LoaderCircle, RefreshCw, ShieldCheck, Trash2, Undo2 } from "lucide-react";
import { useAuth } from "../AppContext";
import {
  deleteComment,
  deleteMagazine,
  getAdminData,
  getMagazinePdfLink,
  updateArticleStatus,
  updateCommentApproval,
  updateContactStatus,
  updateMagazineStatus,
  type AdminData,
  type ContactStatus,
  type PublicationStatus,
} from "../contentService";

const publicationStatuses: PublicationStatus[] = ["draft", "review", "published"];
const contactStatuses: ContactStatus[] = ["new", "read", "resolved"];

function EmptyRow({ message }: { message: string }) {
  return <p className="text-sm text-muted-foreground font-body py-4">{message}</p>;
}

export default function Admin() {
  const { authReady, isLoggedIn, isAdmin, user, logout } = useAuth();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [updatingMagazineId, setUpdatingMagazineId] = useState<string | null>(null);
  const [deletingMagazineId, setDeletingMagazineId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await getAdminData());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Admin data could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authReady && isAdmin) void loadData();
  }, [authReady, isAdmin, loadData]);

  const mutate = async (action: () => Promise<void>, message: string) => {
    setError("");
    setNotice("");
    try {
      await action();
      setNotice(message);
      await loadData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The update failed.");
    }
  };

  const previewMagazine = async (magazineId: string, pdfPath: string | null) => {
    if (!pdfPath) return;
    setError("");
    setPreviewingId(magazineId);
    try {
      const url = await getMagazinePdfLink(pdfPath, magazineId);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The PDF preview could not be opened.");
    } finally {
      setPreviewingId(null);
    }
  };

  const changeMagazineStatus = async (magazineId: string, status: PublicationStatus) => {
    setUpdatingMagazineId(magazineId);
    try {
      await mutate(
        () => updateMagazineStatus(magazineId, status),
        status === "published" ? "Magazine approved and published." : "Magazine unpublished and returned to the review queue.",
      );
    } finally {
      setUpdatingMagazineId(null);
    }
  };

  const removeMagazine = async (magazineId: string, title: string) => {
    const confirmed = window.confirm(
      `Permanently delete “${title}”? This removes its PDF, cover image, and database record.`,
    );
    if (!confirmed) return;

    setDeletingMagazineId(magazineId);
    try {
      await mutate(
        () => deleteMagazine(magazineId),
        "Magazine and uploaded files deleted.",
      );
    } finally {
      setDeletingMagazineId(null);
    }
  };

  if (!authReady) {
    return <main className="min-h-screen bg-background text-foreground flex items-center justify-center font-body">Checking your secure session…</main>;
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-5">
        <div className="max-w-sm text-center">
          <ShieldCheck size={32} className="mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-display font-bold mb-3">Admin access</h1>
          <p className="text-muted-foreground font-body mb-6">Sign in with an approved administrator account to continue.</p>
          <Link to="/login" className="inline-flex bg-primary text-primary-foreground px-4 py-2.5 text-sm font-body">Sign in</Link>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-5">
        <div className="max-w-md text-center">
          <ShieldCheck size={36} className="mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-display font-bold mb-3">Administrator approval required</h1>
          <p className="text-muted-foreground font-body leading-relaxed mb-3">You are signed in as <strong className="text-foreground">{user?.email}</strong>.</p>
          <p className="text-muted-foreground font-body leading-relaxed mb-7">This account exists, but its profile does not have the administrator role yet.</p>
          <div className="flex justify-center gap-3">
            <Link to="/" className="border border-border px-4 py-2.5 text-sm font-body">Back home</Link>
            <button type="button" onClick={() => void logout()} className="bg-primary text-primary-foreground px-4 py-2.5 text-sm font-body">Sign out</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-20">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-body">Hindi Club</p>
            <h1 className="text-2xl font-display font-bold">Content dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => void loadData()} className="inline-flex items-center gap-2 border border-border px-3 py-2 text-sm font-body">
              <RefreshCw size={14} /> Refresh
            </button>
            <Link to="/" className="text-sm text-accent hover:underline font-body">View website</Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 py-8 space-y-10">
        {loading && <div className="flex items-center gap-2 text-sm text-muted-foreground font-body"><LoaderCircle size={16} className="animate-spin" /> Loading dashboard…</div>}
        {notice && <p role="status" className="bg-green-50 text-green-800 border border-green-200 p-3 text-sm font-body">{notice}</p>}
        {error && <p role="alert" className="bg-destructive/10 text-destructive border border-destructive/20 p-3 text-sm font-body">{error}</p>}

        {data && (
          <>
            <section>
              <h2 className="text-xl font-display font-bold mb-4">Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                  ["Users", data.profiles.length],
                  ["Authors", data.authors.length],
                  ["Categories", data.categories.length],
                  ["Magazines", data.magazines.length],
                  ["Articles", data.articles.length],
                  ["Comments", data.comments.length],
                  ["Messages", data.messages.length],
                ].map(([label, value]) => (
                  <div key={String(label)} className="border border-border bg-card p-4">
                    <p className="text-2xl font-display font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-body">{label}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold mb-4">Magazine review queue</h2>
              <div className="space-y-3">
                {data.magazines.map((magazine) => (
                  <div key={magazine.id} className="border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1">
                      <p className="font-display font-semibold">{magazine.title}</p>
                      <p className="text-xs text-muted-foreground font-body">{magazine.category || "Uncategorised"} · Vol. {magazine.volume} · {magazine.year}</p>
                      <span className={`inline-flex mt-2 px-2 py-1 text-[11px] uppercase tracking-wider font-body ${
                        magazine.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-secondary text-secondary-foreground"
                      }`}>
                        {magazine.status === "published" ? "Published" : "Pending review"}
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled={!magazine.pdfPath || previewingId === magazine.id}
                      onClick={() => void previewMagazine(magazine.id, magazine.pdfPath)}
                      className="inline-flex items-center justify-center gap-1.5 border border-border px-3 py-2 text-sm font-body disabled:opacity-40"
                    >
                      {previewingId === magazine.id
                        ? <LoaderCircle size={14} className="animate-spin" />
                        : <ExternalLink size={14} />}
                      Preview PDF
                    </button>
                    <button
                      type="button"
                      disabled={updatingMagazineId === magazine.id || deletingMagazineId === magazine.id}
                      onClick={() => void changeMagazineStatus(
                        magazine.id,
                        magazine.status === "published" ? "draft" : "published",
                      )}
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-body disabled:opacity-40 ${
                        magazine.status === "published"
                          ? "border border-border"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {updatingMagazineId === magazine.id
                        ? <LoaderCircle size={14} className="animate-spin" />
                        : magazine.status === "published"
                          ? <Undo2 size={14} />
                          : <CheckCircle2 size={14} />}
                      {magazine.status === "published" ? "Unpublish" : "Approve & Publish"}
                    </button>
                    <button
                      type="button"
                      disabled={deletingMagazineId === magazine.id || updatingMagazineId === magazine.id}
                      onClick={() => void removeMagazine(magazine.id, magazine.title)}
                      className="inline-flex items-center justify-center gap-1.5 border border-destructive/40 text-destructive px-3 py-2 text-sm font-body hover:bg-destructive/10 disabled:opacity-40"
                    >
                      {deletingMagazineId === magazine.id
                        ? <LoaderCircle size={14} className="animate-spin" />
                        : <Trash2 size={14} />}
                      Delete
                    </button>
                  </div>
                ))}
                {data.magazines.length === 0 && <EmptyRow message="No magazine submissions yet." />}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold mb-4">Articles</h2>
              <div className="space-y-3">
                {data.articles.map((article) => (
                  <div key={article.id} className="border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1">
                      <p className="font-display font-semibold">{article.title}</p>
                      <p className="text-xs text-muted-foreground font-body">{article.language} · {article.excerpt || "No excerpt"}</p>
                    </div>
                    <select
                      value={article.status}
                      aria-label={`Status for ${article.title}`}
                      onChange={(event) => void mutate(() => updateArticleStatus(article.id, event.target.value as PublicationStatus), "Article status updated.")}
                      className="bg-input-background border border-border px-3 py-2 text-sm font-body"
                    >
                      {publicationStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </div>
                ))}
                {data.articles.length === 0 && <EmptyRow message="No articles yet." />}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold mb-4">Comment moderation</h2>
              <div className="space-y-3">
                {data.comments.map((comment) => (
                  <div key={comment.id} className="border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-body whitespace-pre-wrap">{comment.body}</p>
                      <p className="text-xs text-muted-foreground font-body mt-2">
                        {data.profiles.find((profile) => profile.id === comment.profileId)?.fullName || "Member"}
                        {comment.magazineId
                          ? ` · ${data.magazines.find((magazine) => magazine.id === comment.magazineId)?.title || "Magazine"}`
                          : " · Article comment"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void mutate(() => updateCommentApproval(comment.id, !comment.isApproved), "Comment moderation updated.")}
                      className={`px-3 py-2 text-sm font-body ${comment.isApproved ? "border border-border" : "bg-primary text-primary-foreground"}`}
                    >
                      {comment.isApproved ? "Unapprove" : "Approve"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Delete this comment permanently?")) {
                          void mutate(() => deleteComment(comment.id), "Comment deleted.");
                        }
                      }}
                      className="inline-flex items-center justify-center gap-1.5 border border-destructive/40 text-destructive px-3 py-2 text-sm font-body hover:bg-destructive/10"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                ))}
                {data.comments.length === 0 && <EmptyRow message="No comments awaiting moderation." />}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold mb-4">Contact messages</h2>
              <div className="space-y-3">
                {data.messages.map((message) => (
                  <div key={message.id} className="border border-border bg-card p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <div className="flex-1">
                        <p className="font-display font-semibold">{message.subject || "No subject"}</p>
                        <p className="text-xs text-muted-foreground font-body">{message.name} · {message.email}</p>
                        <p className="text-sm font-body mt-3 whitespace-pre-wrap">{message.message}</p>
                      </div>
                      <select
                        value={message.status}
                        aria-label={`Status for message from ${message.name}`}
                        onChange={(event) => void mutate(() => updateContactStatus(message.id, event.target.value as ContactStatus), "Message status updated.")}
                        className="bg-input-background border border-border px-3 py-2 text-sm font-body"
                      >
                        {contactStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
                {data.messages.length === 0 && <EmptyRow message="No contact messages yet." />}
              </div>
            </section>

            <section className="grid md:grid-cols-3 gap-6 pb-10">
              <div>
                <h2 className="text-xl font-display font-bold mb-4">Users</h2>
                <div className="space-y-2">
                  {data.profiles.map((profile) => <div key={profile.id} className="border border-border p-3 text-sm font-body">{profile.fullName || "Unnamed user"}{profile.isAdmin && <span className="text-accent"> · Admin</span>}</div>)}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-display font-bold mb-4">Authors</h2>
                <div className="space-y-2">
                  {data.authors.map((author) => <div key={author.id} className="border border-border p-3 text-sm font-body">{author.displayName}</div>)}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-display font-bold mb-4">Categories</h2>
                <div className="space-y-2">
                  {data.categories.map((category) => <div key={category.id} className="border border-border p-3 text-sm font-body">{category.name}</div>)}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
