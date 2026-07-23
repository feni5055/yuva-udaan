import { useState } from "react";
import {
  Upload, BookOpen, X, ChevronDown, Menu,
  Download, Eye, Lock, FileText, Trash2, Moon, Sun, Languages,
} from "lucide-react";
import { useNavigate } from "react-router";
import { getMagazines, deleteMagazine, type StoredMagazine } from "../magazineStore";
import { useTheme, useLang, useAuth } from "../AppContext";

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

// ── NavBar ─────────────────────────────────────────────────────────────────

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();
  const { isLoggedIn, logout } = useAuth();

  const navLinks = [t("nav.issues"), t("nav.writers"), t("nav.contact")];

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm font-devanagari">ह</span>
          </div>
          <div>
            <div className="text-primary font-bold leading-tight font-display" style={{ fontSize: "1.1rem" }}>
              Hindi Club
            </div>
            <div className="text-muted-foreground text-xs leading-tight tracking-widest uppercase font-body">
              {t("nav.tagline")}
            </div>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((item) => (
            <a key={item} href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm tracking-wide font-body">
              {item}
            </a>
          ))}

          {isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/upload")}
                className="flex items-center gap-2 border border-primary text-primary px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors font-body"
              >
                <Upload size={13} /> {t("nav.upload")}
              </button>
              <button
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground text-sm font-body transition-colors"
              >
                {lang === "en" ? "Sign Out" : "साइन आउट"}
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm hover:bg-primary/90 transition-colors font-body"
            >
              {lang === "en" ? "Sign In" : "साइन इन करें"}
            </button>
          )}

          {/* Language toggle */}
          <button
            onClick={toggleLang}
            title={lang === "en" ? "Switch to Hindi" : "Switch to English"}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-body px-2 py-1.5 rounded-sm hover:bg-secondary"
          >
            <Languages size={15} />
            <span className="font-medium">{lang === "en" ? "हिं" : "EN"}</span>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="w-8 h-8 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggleLang} className="text-muted-foreground hover:text-foreground p-1.5 font-body text-xs font-semibold">
            {lang === "en" ? "हिं" : "EN"}
          </button>
          <button onClick={toggleTheme} className="text-muted-foreground hover:text-foreground p-1.5">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="text-foreground p-1" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-5 py-4 flex flex-col gap-4">
          {navLinks.map((item) => (
            <a key={item} href="#" className="text-foreground text-sm font-body">{item}</a>
          ))}
          {isLoggedIn ? (
            <>
              <button
                onClick={() => { navigate("/upload"); setMenuOpen(false); }}
                className="flex items-center gap-2 border border-primary text-primary px-4 py-2 text-sm w-fit font-body"
              >
                <Upload size={13} /> {t("nav.upload")}
              </button>
              <button onClick={() => { handleSignOut(); setMenuOpen(false); }} className="text-muted-foreground text-sm font-body w-fit">
                {lang === "en" ? "Sign Out" : "साइन आउट"}
              </button>
            </>
          ) : (
            <button
              onClick={() => { navigate("/login"); setMenuOpen(false); }}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm w-fit font-body"
            >
              {lang === "en" ? "Sign In" : "साइन इन करें"}
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────

function Hero() {
  const { t } = useLang();
  const uploadedCount = getMagazines().length;
  const totalIssues = issues.length + uploadedCount;
  const totalContributors = 2; // real team members shown on this site

  const stats = [
    { labelKey: "hero.stat1", value: String(totalIssues) },
    { labelKey: "hero.stat2", value: String(totalContributors) },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-muted pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-accent text-xs tracking-[0.2em] uppercase mb-6 font-medium font-body">
            <span className="w-8 h-px bg-accent inline-block" />
            {t("hero.eyebrow")}
          </div>
          <h1 className="text-5xl md:text-6xl leading-[1.1] text-primary mb-4 font-display font-bold">
            {t("hero.line1")}
            <br />
            <em>{t("hero.line2")}</em>
            <br />
            {t("hero.line3")}
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md font-body">
            {t("hero.desc")}
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <button className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 hover:bg-primary/90 transition-colors text-sm font-body">
              <BookOpen size={15} /> {t("hero.cta")}
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
        {stats.map(({ labelKey, value }) => (
          <div key={labelKey}>
            <div className="text-2xl font-bold text-primary font-display">{value}</div>
            <div className="text-xs text-muted-foreground tracking-widest uppercase mt-0.5 font-body">{t(labelKey)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Issue Modal ────────────────────────────────────────────────────────────

function IssueModal({ issue, onClose }: { issue: Issue; onClose: () => void }) {
  const { t } = useLang();
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
              { label: t("modal.theme"),  value: issue.theme },
              { label: t("modal.pages"),  value: `${issue.pages} ${t("modal.pages.suffix")}` },
              { label: t("modal.volume"), value: issue.issue },
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
                <Download size={14} /> {t("modal.download")}
              </a>
            ) : (
              <button disabled className="flex-1 flex items-center justify-center gap-2 bg-muted text-muted-foreground py-2.5 text-sm rounded-sm cursor-not-allowed font-body">
                <Download size={14} /> {t("modal.nopdf")}
              </button>
            )}
            <button onClick={onClose} className="px-4 py-2.5 border border-border text-sm text-foreground hover:bg-secondary transition-colors rounded-sm font-body">
              {t("modal.close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Uploaded card ──────────────────────────────────────────────────────────

function UploadedCard({ mag, onDelete }: { mag: StoredMagazine; onDelete: () => void }) {
  const { t } = useLang();
  const fileSizeLabel =
    mag.fileSize < 1024 * 1024
      ? `${(mag.fileSize / 1024).toFixed(0)} KB`
      : `${(mag.fileSize / (1024 * 1024)).toFixed(1)} MB`;
  const uploadedDate = new Date(mag.uploadedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <article className="group relative border border-border rounded-sm bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary to-muted flex items-center justify-center" style={{ aspectRatio: "3/4" }}>
        {mag.coverUrl ? (
          <img src={mag.coverUrl} alt={mag.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="text-center px-4 z-10">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText size={24} className="text-primary" />
            </div>
            <p className="text-primary text-lg font-bold leading-tight font-display">{mag.title}</p>
            {mag.subtitle && <p className="text-muted-foreground text-xs mt-1 font-body">{mag.subtitle}</p>}
          </div>
        )}
        {mag.coverUrl && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        )}
        <div className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] font-semibold px-2 py-0.5 rounded-sm tracking-wide font-body uppercase z-10">
          {t("card.new")}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute top-3 right-3 w-7 h-7 bg-black/40 hover:bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
          title="Remove"
        >
          <Trash2 size={12} />
        </button>
        {mag.coverUrl && (
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <p className="text-white text-base font-bold font-display leading-tight">{mag.title}</p>
            {mag.subtitle && <p className="text-white/70 text-xs mt-0.5 font-body">{mag.subtitle}</p>}
          </div>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs text-muted-foreground uppercase tracking-widest font-body">Vol. {mag.volume} · {mag.year}</span>
        {mag.publishDate && (
          <p className="text-xs text-accent font-body mt-0.5">
            {new Date(mag.publishDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        )}
        {mag.theme && <p className="text-sm text-foreground font-body mt-1 mb-2">{t("card.theme")}: {mag.theme}</p>}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-body border-t border-border pt-2 mt-2">
          <FileText size={11} className="shrink-0" />
          <span className="truncate">{mag.fileName}</span>
          <span className="shrink-0 ml-auto">{fileSizeLabel}</span>
        </div>
        <p className="text-[10px] text-muted-foreground font-body mt-1">{t("card.uploaded")} {uploadedDate}</p>
      </div>
    </article>
  );
}

// ── Issues section ─────────────────────────────────────────────────────────

function IssuesSection() {
  const { t } = useLang();
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
            <div className="text-accent text-xs tracking-[0.2em] uppercase mb-2 font-medium font-body">— {t("issues.eyebrow")}</div>
            <h2 className="text-3xl md:text-4xl text-foreground font-display font-bold">{t("issues.heading")}</h2>
          </div>
          <span className="hidden md:block text-muted-foreground text-sm font-body">{totalCount} {t("issues.count")}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {uploaded.map((mag) => (
            <UploadedCard key={mag.id} mag={mag} onDelete={() => handleDelete(mag.id)} />
          ))}
          {issues.map((issue) => (
            <article key={issue.id} className="group cursor-pointer" onClick={() => setSelected(issue)}>
              <div className="relative overflow-hidden rounded-sm bg-muted mb-4 shadow-md" style={{ aspectRatio: "3/4" }}>
                <img src={issue.cover} alt={issue.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2 bg-white/90 text-foreground text-sm px-4 py-2 rounded-full shadow-lg font-body">
                    <Eye size={14} /> {t("issues.view")}
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-white/80 text-xs tracking-widest uppercase font-body">{issue.issue} · {issue.year}</span>
                  <h3 className="text-white text-xl mt-1 font-display font-bold">{issue.title}</h3>
                </div>
                <div className="absolute top-3 right-3 bg-white/95 text-xs px-2 py-1 rounded-sm text-foreground font-body">{issue.pages}p</div>
              </div>
              <div className="text-muted-foreground text-xs uppercase tracking-widest mb-1 font-body">{issue.subtitle}</div>
              <div className="text-sm text-foreground font-body">{t("issues.theme")}: {issue.theme}</div>
            </article>
          ))}
        </div>
      </div>
      {selected && <IssueModal issue={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

// ── Sign-in banner ─────────────────────────────────────────────────────────

function SignInToBanner() {
  const navigate = useNavigate();
  const { t } = useLang();
  return (
    <section className="py-16 bg-secondary border-t border-border">
      <div className="max-w-2xl mx-auto px-5 text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <Lock size={20} className="text-primary" />
        </div>
        <h2 className="text-2xl text-foreground mb-2 font-display font-bold">{t("banner.heading")}</h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-body">{t("banner.desc")}</p>
        <button
          onClick={() => navigate("/login")}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3 text-sm hover:bg-primary/90 transition-colors rounded-sm font-body"
        >
          {t("banner.cta")}
        </button>
      </div>
    </section>
  );
}

// ── Contributors ───────────────────────────────────────────────────────────

function ContributorsSection() {
  const { t } = useLang();
  const members = [
    { name: "Member", avatarSrc: member1 },
    { name: "Member", avatarSrc: member2 },
  ];
  return (
    <section className="py-20 border-t border-border">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-12">
          <div className="text-accent text-xs tracking-[0.2em] uppercase mb-2 font-medium font-body">— {t("team.eyebrow")}</div>
          <h2 className="text-3xl text-foreground font-display font-bold">{t("team.heading")}</h2>
        </div>
        <div className="flex justify-center gap-16">
          {members.map((c, i) => (
            <div key={i} className="text-center group">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 ring-2 ring-border group-hover:ring-accent transition-all bg-muted">
                <img src={c.avatarSrc} alt={c.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-foreground text-base font-display font-semibold">{c.name}</div>
              <div className="text-muted-foreground text-xs mt-0.5 font-body">{t("team.role")}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ────────────────────────────────────────────────────────────────────

function FaqSection() {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
  ];

  return (
    <section className="py-20 bg-secondary border-t border-border">
      <div className="max-w-3xl mx-auto px-5">
        <div className="text-center mb-12">
          <div className="text-accent text-xs tracking-[0.2em] uppercase mb-2 font-medium font-body">— {t("faq.eyebrow")}</div>
          <h2 className="text-3xl text-foreground font-display font-bold">{t("faq.heading")}</h2>
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

// ── Footer ─────────────────────────────────────────────────────────────────

function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-border py-10">
      <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs font-devanagari">ह</span>
          </div>
          <span className="text-sm text-muted-foreground font-body">{t("footer.copy")}</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-muted-foreground font-body">
          <a href="#" className="hover:text-accent transition-colors">{t("footer.privacy")}</a>
          <a href="#" className="hover:text-accent transition-colors">{t("footer.contact")}</a>
          <a href="#" className="hover:text-accent transition-colors">{t("footer.guide")}</a>
        </div>
      </div>
    </footer>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

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
