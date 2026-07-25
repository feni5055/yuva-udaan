import { ArrowLeft, BookOpen, Download, FileText, Users } from "lucide-react";
import { Link, useParams } from "react-router";
import { getMagazines } from "../magazineStore";

export default function IssueDetail() {
  const { id } = useParams();
  const savedIssue = getMagazines().find((magazine) => magazine.id === id);

  if (!savedIssue) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <h1 className="text-3xl font-display font-bold mb-3">Issue not found</h1>
          <p className="text-muted-foreground font-body mb-6">This magazine may have been removed or is not available on this device.</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 text-sm font-body"><ArrowLeft size={14} /> Back to archive</Link>
        </div>
      </main>
    );
  }

  const issue = {
    id: savedIssue.id,
    title: savedIssue.title,
    subtitle: savedIssue.subtitle,
    year: savedIssue.year,
    volume: `Vol. ${savedIssue.volume}`,
    cover: savedIssue.coverUrl,
    category: savedIssue.category || "Uncategorised",
    theme: "",
    pages: undefined,
    editors: savedIssue.editors,
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-5 py-4">
          <Link to="/#issues" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-body"><ArrowLeft size={15} /> Back to archive</Link>
        </div>
      </header>
      <section className="max-w-5xl mx-auto px-5 py-12 md:py-20 grid md:grid-cols-[minmax(0,280px)_1fr] gap-10 md:gap-14 items-start">
        <div className="aspect-[3/4] bg-secondary shadow-xl overflow-hidden">
          {issue.cover ? <img src={issue.cover} alt={issue.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><FileText size={44} className="text-primary" /></div>}
        </div>
        <div>
          <p className="text-accent text-xs uppercase tracking-[0.2em] font-body mb-3">{issue.category}</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-2">{issue.title}</h1>
          {issue.subtitle && <p className="text-lg text-muted-foreground font-body mb-7">{issue.subtitle}</p>}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 text-sm font-body">
            <div className="bg-secondary p-3"><span className="block text-xs text-muted-foreground mb-1">Volume</span>{issue.volume}</div>
            <div className="bg-secondary p-3"><span className="block text-xs text-muted-foreground mb-1">Year</span>{issue.year}</div>
            {issue.pages && <div className="bg-secondary p-3"><span className="block text-xs text-muted-foreground mb-1">Pages</span>{issue.pages}</div>}
          </div>
          {issue.theme && <p className="text-sm text-muted-foreground font-body mb-3"><strong className="text-foreground">Theme:</strong> {issue.theme}</p>}
          {issue.editors && <p className="flex items-center gap-2 text-sm text-muted-foreground font-body mb-8"><Users size={15} /> {issue.editors}</p>}
          <button disabled className="inline-flex items-center gap-2 bg-muted text-muted-foreground px-5 py-3 text-sm cursor-not-allowed font-body" title="PDF files will be connected in the storage phase"><Download size={15} /> PDF coming soon</button>
        </div>
      </section>
      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground font-body"><BookOpen size={13} className="inline mr-1" /> Hindi Club Magazine</footer>
    </main>
  );
}
