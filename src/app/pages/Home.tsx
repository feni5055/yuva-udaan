import { useState } from "react";
import { Upload, BookOpen, X, ChevronDown, Menu, Download, Eye, Lock, FileText, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import { getMagazines, deleteMagazine, type StoredMagazine } from "../magazineStore";

const member1 = new URL("../../imports/PHOTO-2026-07-17-20-56-35.jpg", import.meta.url).href;
const member2 = new URL("../../imports/Untitled-11.jpg", import.meta.url).href;

interface Issue {
  id: number;
  title: string;
  subtitle: string;
  year: string;
  issue: string;
  cover: string;
  theme: string;
  pages: number;
  fileUrl?: string;
}

const issues: Issue[] = [
  {
    id: 1,
    title: "वसंत विशेषांक",
    subtitle: "Spring Special Edition",
    year: "2024",
    issue: "Vol. 12",
    cover: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400&h=540&fit=crop&auto=format",
    theme: "Nature & Poetry",
    pages: 48,
  },
  {
    id: 2,
    title: "दीपावली अंक",
    subtitle: "Diwali Edition",
    year: "2023",
    issue: "Vol. 11",
    cover: "https://images.unsplash.com/photo-1605289982774-9a6fef564df8?w=400&h=540&fit=crop&auto=format",
    theme: "Festivals & Tradition",
    pages: 56,
  },
  {
    id: 3,
    title: "स्वतंत्रता अंक",
    subtitle: "Independence Edition",
    year: "2023",
    issue: "Vol. 10",
    cover: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&h=540&fit=crop&auto=format",
    theme: "History & Pride",
    pages: 64,
  },
];

const contributors = [
  { name: "Member", role: "Club Member", avatarSrc: member1 },
  { name: "Member", role: "Club Member", avatarSrc: member2 },
];

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm font-devanagari">ह</span>
          </div>
          <div>
            <div className="text-primary font-bold leading-tight font-display" style={{ fontSize: "1.1rem" }}>
              Hindi Club
            </div>
            <div className="text-muted-foreground text-xs leading-tight tracking-widest uppercase font-body">
              Magazine
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {["Issues", "Writers", "Contact"].map((item) => (
            <a key={item} href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm tracking-wide font-body">
              {item}
            </a>
          ))}
          <button
            onClick={() => navigate("/upload")}
            className="flex items-center gap-2 border border-primary text-primary px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors font-body"
          >
            <Upload size={13} /> Upload Magazine
          </button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-5 py-4 flex flex-col gap-4">
          {["Issues", "Writers", "Contact"].map((item) => (
            <a key={item} href="#" className="text-foreground text-sm font-body">{item}</a>
          ))}
        </div>
      )}
    </nav>
  );
}

function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-muted pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-accent text-xs tracking-[0.2em] uppercase mb-6 font-medium font-body">
            <span className="w-8 h-px bg-accent inline-block" />
            The Club Magazine
          </div>
          <h1 className="text-5xl md:text-6xl leading-[1.1] text-primary mb-4 font-display font-bold">
            Welcome to
            <br />
            <em>Hindi Club</em>
            <br />
            Magazine
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md font-body">
            Celebrating Hindi language and literature through poetry, short stories, essays, and cultural features — written by club members and published each semester.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <button className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 hover:bg-primary/90 transition-colors text-sm font-body">
              <BookOpen size={15} /> Explore Issues
            </button>
          </div>
        </div>

        <div className="relative hidden md:block">
          <div className="absolute -top-4 -right-4 w-64 h-80 bg-accent/10 rounded-sm" />
          <div className="absolute -bottom-4 -left-4 w-48 h-64 bg-primary/8 rounded-sm" />
          <div className="relative flex gap-4 justify-center">
            <div className="w-40 h-56 overflow-hidden shadow-xl rounded-sm mt-8 bg-muted">
              <img src={issues[0].cover} alt={issues[0].title} className="w-full h-full object-cover" />
            </div>
            <div className="w-40 h-56 overflow-hidden shadow-xl rounded-sm bg-muted">
              <img src={issues[1].cover} alt={issues[1].title} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-5 pb-8 flex gap-12 flex-wrap">
        {[
          { label: "Published Issues", value: "12+" },
          { label: "Contributors", value: "80+" },
          { label: "Readers", value: "2,000+" },
        ].map(({ label, value }) => (
          <div key={label}>
            <div className="text-2xl font-bold text-primary font-display">{value}</div>
            <div className="text-xs text-muted-foreground tracking-widest uppercase mt-0.5 font-body">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function IssueModal({ issue, onClose }: { issue: Issue; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-card border border-border rounded-sm shadow-2xl max-w-lg w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors">
          <X size={14} />
        </button>
        <div className="relative h-56 bg-muted overflow-hidden">
          <img src={issue.cover} alt={issue.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-5 left-5 right-12">
            <span className="text-white/70 text-xs tracking-widest uppercase font-body">{issue.issue} · {issue.year}</span>
            <h3 className="text-white text-2xl mt-1 font-display font-bold">{issue.title}</h3>
            <p className="text-white/80 text-sm mt-0.5 font-body">{issue.subtitle}</p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Theme", value: issue.theme },
              { label: "Pages", value: `${issue.pages} pages` },
              { label: "Volume", value: issue.issue },
            ].map(({ label, value }) => (
              <div key={label} className="bg-secondary rounded-sm p-3 text-center">
                <div className="text-xs text-muted-foreground mb-0.5 font-body">{label}</div>
                <div className="text-sm font-medium text-foreground font-body">{value}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            {issue.fileUrl ? (
              <a href={issue.fileUrl} download className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 text-sm hover:bg-primary/90 transition-colors rounded-sm font-body">
                <Download size={14} /> Download PDF
              </a>
            ) : (
              <button disabled className="flex-1 flex items-center justify-center gap-2 bg-muted text-muted-foreground py-2.5 text-sm rounded-sm cursor-not-allowed font-body">
                <Download size={14} /> No PDF uploaded yet
              </button>
            )}
            <button onClick={onClose} className="px-4 py-2.5 border border-border text-sm text-foreground hover:bg-secondary transition-colors rounded-sm font-body">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadedCard({ mag, onDelete }: { mag: StoredMagazine; onDelete: () => void }) {
  const fileSizeLabel =
    mag.fileSize < 1024 * 1024
      ? `${(mag.fileSize / 1024).toFixed(0)} KB`
      : `${(mag.fileSize / (1024 * 1024)).toFixed(1)} MB`;
  const uploadedDate = new Date(mag.uploadedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <article className="group relative border border-border rounded-sm bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Cover placeholder */}
      <div className="relative bg-gradient-to-br from-primary/10 via-secondary to-muted flex items-center justify-center" style={{ aspectRatio: "3/4" }}>
        <div className="text-center px-4">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <FileText size={24} className="text-primary" />
          </div>
          <p className="text-primary text-lg font-bold leading-tight font-display">{mag.title}</p>
          {mag.subtitle && <p className="text-muted-foreground text-xs mt-1 font-body">{mag.subtitle}</p>}
        </div>
        {/* New badge */}
        <div className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] font-semibold px-2 py-0.5 rounded-sm tracking-wide font-body uppercase">
          New
        </div>
        {/* Delete button */}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute top-3 right-3 w-7 h-7 bg-black/40 hover:bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
          title="Remove"
        >
          <Trash2 size={12} />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-body">Vol. {mag.volume} · {mag.year}</span>
        </div>
        {mag.theme && <p className="text-sm text-foreground font-body mb-2">Theme: {mag.theme}</p>}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-body border-t border-border pt-2 mt-2">
          <FileText size={11} className="shrink-0" />
          <span className="truncate">{mag.fileName}</span>
          <span className="shrink-0 ml-auto">{fileSizeLabel}</span>
        </div>
        <p className="text-[10px] text-muted-foreground font-body mt-1">Uploaded {uploadedDate}</p>
      </div>
    </article>
  );
}

function IssuesSection() {
  const [selected, setSelected] = useState<Issue | null>(null);
  const [uploaded, setUploaded] = useState<StoredMagazine[]>(() => getMagazines());

  const handleDelete = (id: string) => {
    deleteMagazine(id);
    setUploaded(getMagazines());
  };

  const totalCount = issues.length + uploaded.length;

  return (
    <section className="py-20 border-t border-border">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="text-accent text-xs tracking-[0.2em] uppercase mb-2 font-medium font-body">— Published Issues</div>
            <h2 className="text-3xl md:text-4xl text-foreground font-display font-bold">Past Issues</h2>
          </div>
          <span className="hidden md:block text-muted-foreground text-sm font-body">{totalCount} issues published</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Uploaded magazines — shown first */}
          {uploaded.map((mag) => (
            <UploadedCard key={mag.id} mag={mag} onDelete={() => handleDelete(mag.id)} />
          ))}
          {/* Static archive */}
          {issues.map((issue) => (
            <article key={issue.id} className="group cursor-pointer" onClick={() => setSelected(issue)}>
              <div className="relative overflow-hidden rounded-sm bg-muted mb-4 shadow-md" style={{ aspectRatio: "3/4" }}>
                <img src={issue.cover} alt={issue.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2 bg-white/90 text-foreground text-sm px-4 py-2 rounded-full shadow-lg font-body">
                    <Eye size={14} /> View Issue
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-white/80 text-xs tracking-widest uppercase font-body">{issue.issue} · {issue.year}</span>
                  <h3 className="text-white text-xl mt-1 font-display font-bold">{issue.title}</h3>
                </div>
                <div className="absolute top-3 right-3 bg-white/95 text-xs px-2 py-1 rounded-sm text-foreground font-body">{issue.pages}p</div>
              </div>
              <div className="text-muted-foreground text-xs uppercase tracking-widest mb-1 font-body">{issue.subtitle}</div>
              <div className="text-sm text-foreground font-body">Theme: {issue.theme}</div>
            </article>
          ))}
        </div>
      </div>
      {selected && <IssueModal issue={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

function SignInToBanner() {
  const navigate = useNavigate();
  return (
    <section className="py-16 bg-secondary border-t border-border">
      <div className="max-w-2xl mx-auto px-5 text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <Lock size={20} className="text-primary" />
        </div>
        <h2 className="text-2xl text-foreground mb-2 font-display font-bold">
          Want to publish an issue?
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-body">
          Uploading and publishing magazine issues is available to registered Hindi Club members only. Sign in to access the member portal.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3 text-sm hover:bg-primary/90 transition-colors rounded-sm font-body"
        >
          Sign In to Upload
        </button>
      </div>
    </section>
  );
}

function ContributorsSection() {
  return (
    <section className="py-20 border-t border-border">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-12">
          <div className="text-accent text-xs tracking-[0.2em] uppercase mb-2 font-medium font-body">— Our Team</div>
          <h2 className="text-3xl text-foreground font-display font-bold">Editorial Board</h2>
        </div>
        <div className="flex justify-center gap-16">
          {contributors.map((c, i) => (
            <div key={i} className="text-center group">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 ring-2 ring-border group-hover:ring-accent transition-all bg-muted">
                <img src={c.avatarSrc} alt={c.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-foreground text-base font-display font-semibold">{c.name}</div>
              <div className="text-muted-foreground text-xs mt-0.5 font-body">{c.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: "Who can publish to this magazine?", a: "Only registered Hindi Club members can upload and publish issues. Sign in to access the member upload portal." },
    { q: "Can I write in both Hindi and English?", a: "Yes! We welcome bilingual contributions. Many of our articles feature both Hindi and English content to serve our diverse membership." },
    { q: "When is the submission deadline?", a: "Each edition has its own deadline. Check the editorial calendar or contact the editorial board for the upcoming issue's deadline." },
    { q: "Are illustrations and photos accepted?", a: "Absolutely. High-resolution images (at least 300 DPI) accompanying your article are welcome and encouraged." },
  ];

  return (
    <section className="py-20 bg-secondary border-t border-border">
      <div className="max-w-3xl mx-auto px-5">
        <div className="text-center mb-12">
          <div className="text-accent text-xs tracking-[0.2em] uppercase mb-2 font-medium font-body">— FAQ</div>
          <h2 className="text-3xl text-foreground font-display font-bold">Frequently Asked</h2>
        </div>
        <div className="divide-y divide-border">
          {faqs.map((faq, i) => (
            <div key={i} className="py-4">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between text-left gap-4">
                <span className="text-sm font-medium text-foreground font-body">{faq.q}</span>
                <ChevronDown size={16} className={`text-muted-foreground transition-transform shrink-0 ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <p className="mt-3 text-sm text-muted-foreground leading-relaxed font-body">{faq.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs font-devanagari">ह</span>
          </div>
          <span className="text-sm text-muted-foreground font-body">Hindi Club · Magazine · © 2025</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-muted-foreground font-body">
          <a href="#" className="hover:text-accent transition-colors">Privacy</a>
          <a href="#" className="hover:text-accent transition-colors">Contact</a>
          <a href="#" className="hover:text-accent transition-colors">Guidelines</a>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <Hero />
      <IssuesSection />
      <SignInToBanner />
      <ContributorsSection />
      <FaqSection />
      <Footer />
    </div>
  );
}
