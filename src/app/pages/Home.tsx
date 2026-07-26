import { useEffect, useState } from "react";
import {
  Upload, BookOpen, ChevronDown, Menu, X,
  Lock, FileText, Moon, Sun, Languages, LoaderCircle, Send,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useTheme, useLang, useAuth } from "../AppContext";
import {
  listAuthors,
  listCategories,
  listPublishedMagazines,
  submitContactMessage,
  type Author,
  type Category,
  type Magazine,
} from "../contentService";

// ── NavBar ─────────────────────────────────────────────────────────────────

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();
  const { isLoggedIn, isAdmin, logout } = useAuth();

  const navLinks = [
    { label: t("nav.issues"), href: "#issues" },
    { label: t("nav.writers"), href: "#contributors" },
    { label: t("nav.contact"), href: "#contact" },
  ];

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
            <a key={item.href} href={item.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm tracking-wide font-body">
              {item.label}
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
              {isAdmin && (
                <button onClick={() => navigate("/admin")} className="text-accent hover:underline text-sm font-body">
                  Admin
                </button>
              )}
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
            aria-label={lang === "en" ? "Switch to Hindi" : "Switch to English"}
            title={lang === "en" ? "Switch to Hindi" : "Switch to English"}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-body px-2 py-1.5 rounded-sm hover:bg-secondary"
          >
            <Languages size={15} />
            <span className="font-medium">{lang === "en" ? "हिं" : "EN"}</span>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={theme === "dark"}
            className="w-8 h-8 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggleLang} aria-label={lang === "en" ? "Switch to Hindi" : "Switch to English"} className="text-muted-foreground hover:text-foreground p-1.5 font-body text-xs font-semibold">
            {lang === "en" ? "हिं" : "EN"}
          </button>
          <button onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} aria-pressed={theme === "dark"} className="text-muted-foreground hover:text-foreground p-1.5">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button id="mobile-menu-button" aria-label="Toggle navigation menu" aria-expanded={menuOpen} aria-controls="mobile-menu" className="text-foreground p-1" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" role="menu" className="md:hidden border-t border-border bg-background px-5 py-4 flex flex-col gap-4">
          {navLinks.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="text-foreground text-sm font-body">{item.label}</a>
          ))}
          {isLoggedIn ? (
            <>
              <button
                onClick={() => { navigate("/upload"); setMenuOpen(false); }}
                className="flex items-center gap-2 border border-primary text-primary px-4 py-2 text-sm w-fit font-body"
              >
                <Upload size={13} /> {t("nav.upload")}
              </button>
              {isAdmin && (
                <button onClick={() => { navigate("/admin"); setMenuOpen(false); }} className="text-accent text-sm font-body w-fit">
                  Admin dashboard
                </button>
              )}
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

function Hero({ magazines, contributorCount }: { magazines: Magazine[]; contributorCount: number }) {
  const { t } = useLang();
  const totalIssues = magazines.length;
  const featuredMagazines = magazines.filter((magazine) => magazine.coverUrl).slice(0, 2);

  const stats = [
    { labelKey: "hero.stat1", value: String(totalIssues) },
    { labelKey: "hero.stat2", value: String(contributorCount) },
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
            <a href="#issues" className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 hover:bg-primary/90 transition-colors text-sm font-body">
              <BookOpen size={15} /> {t("hero.cta")}
            </a>
          </div>
        </div>

        <div className="relative hidden md:flex min-h-72 items-center justify-center">
          <div className="absolute -top-4 -right-4 w-64 h-80 bg-accent/10 rounded-sm" />
          <div className="absolute -bottom-4 -left-4 w-48 h-64 bg-primary/8 rounded-sm" />
          {featuredMagazines.length > 0 ? (
            <div className="relative flex gap-4 justify-center">
              {featuredMagazines.map((magazine, index) => (
                <div key={magazine.id} className={`w-40 h-56 overflow-hidden shadow-xl rounded-sm bg-muted ${index === 0 ? "mt-8" : ""}`}>
                  <img src={magazine.coverUrl} alt={magazine.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative w-56 h-72 border border-border bg-card shadow-xl flex flex-col items-center justify-center text-center px-8">
              <BookOpen size={42} className="text-primary mb-4" />
              <p className="font-display font-bold text-xl text-primary">Hindi Club</p>
              <p className="font-body text-sm text-muted-foreground mt-1">New issues coming soon</p>
            </div>
          )}
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

function LatestIssue({ magazines }: { magazines: Magazine[] }) {
  const { t } = useLang();
  const latest = magazines[0];

  if (!latest) return null;

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-[180px_1fr] gap-8 items-center">
        <div className="w-36 md:w-44 aspect-[3/4] bg-white/10 shadow-2xl mx-auto md:mx-0 overflow-hidden flex items-center justify-center">
          {latest.coverUrl ? <img src={latest.coverUrl} alt={latest.title} className="w-full h-full object-cover" /> : <FileText size={38} className="text-primary-foreground/70" />}
        </div>
        <div className="text-center md:text-left">
          <p className="text-primary-foreground/70 text-xs tracking-[0.2em] uppercase font-body mb-3">{t("issues.latest")}</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">{latest.title}</h2>
          {latest.subtitle && <p className="text-primary-foreground/75 font-body mb-5">{latest.subtitle}</p>}
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6 text-xs font-body">
            {latest.category && <span className="bg-white/10 px-3 py-1.5">{latest.category}</span>}
            <span className="bg-white/10 px-3 py-1.5">Vol. {latest.volume} · {latest.year}</span>
          </div>
          <a href="#issues" className="inline-flex items-center gap-2 border border-primary-foreground/40 px-4 py-2.5 text-sm hover:bg-white/10 transition-colors font-body">
            <BookOpen size={14} /> {t("issues.latest_cta")}
          </a>
        </div>
      </div>
    </section>
  );
}

function CategoriesSection({ activeCategory, categories, onSelect }: { activeCategory: string; categories: Category[]; onSelect: (category: string) => void }) {
  const { t } = useLang();
  const selectCategory = (category: string) => {
    onSelect(category);
    document.getElementById("issues")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <section className="py-14 border-t border-border">
      <div className="max-w-6xl mx-auto px-5">
        <h2 className="text-center text-2xl text-foreground font-display font-bold mb-7">{t("issues.categories")}</h2>
        <div className="flex flex-wrap justify-center gap-2.5">
          <button type="button" onClick={() => selectCategory("")} className={`border px-4 py-2 text-sm transition-colors font-body ${!activeCategory ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-accent hover:text-accent"}`}>All issues</button>
          {categories.map((category) => (
            <button type="button" key={category.id} onClick={() => selectCategory(category.name)} className={`border px-4 py-2 text-sm transition-colors font-body ${activeCategory === category.name ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-accent hover:text-accent"}`}>
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Uploaded card ──────────────────────────────────────────────────────────

function UploadedCard({ mag }: { mag: Magazine }) {
  const { t } = useLang();
  const navigate = useNavigate();
  const uploadedDate = new Date(mag.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <article className="group relative border border-border rounded-sm bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary to-muted flex items-center justify-center" style={{ aspectRatio: "3/4" }}>
        {mag.coverUrl ? (
          <img src={mag.coverUrl} alt={mag.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
        {mag.coverUrl && (
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <p className="text-white text-base font-bold font-display leading-tight">{mag.title}</p>
            {mag.subtitle && <p className="text-white/70 text-xs mt-0.5 font-body">{mag.subtitle}</p>}
          </div>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs text-muted-foreground uppercase tracking-widest font-body">Vol. {mag.volume} · {mag.year}</span>
        {mag.publicationDate && (
          <p className="text-xs text-accent font-body mt-0.5">
            {new Date(mag.publicationDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        )}
        {mag.category && <p className="text-sm text-foreground font-body mt-1 mb-2">{t("issues.category")}: {mag.category}</p>}
        <p className="text-[10px] text-muted-foreground font-body mt-1">{t("card.uploaded")} {uploadedDate}</p>
        <button type="button" onClick={() => navigate(`/issues/${mag.id}`)} className="mt-3 text-sm text-accent hover:underline font-body">View issue</button>
      </div>
    </article>
  );
}

// ── Issues section ─────────────────────────────────────────────────────────

function IssuesSection({ activeCategory, magazines, loading, error }: { activeCategory: string; magazines: Magazine[]; loading: boolean; error: string }) {
  const { t } = useLang();
  const totalCount = magazines.length;
  const filteredUploaded = activeCategory ? magazines.filter((mag) => mag.category === activeCategory) : magazines;

  return (
    <section id="issues" className="py-20 border-t border-border scroll-mt-20">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="text-accent text-xs tracking-[0.2em] uppercase mb-2 font-medium font-body">— {t("issues.eyebrow")}</div>
            <h2 className="text-3xl md:text-4xl text-foreground font-display font-bold">{t("issues.heading")}</h2>
          </div>
          <span className="hidden md:block text-muted-foreground text-sm font-body">{totalCount} {t("issues.count")}</span>
        </div>
        {loading ? (
          <div className="py-12 flex justify-center"><LoaderCircle className="animate-spin text-primary" aria-label="Loading issues" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredUploaded.map((mag) => <UploadedCard key={mag.id} mag={mag} />)}
          </div>
        )}
        {!loading && filteredUploaded.length === 0 && <p className="py-10 text-center text-muted-foreground font-body">No published magazines are available in this category yet.</p>}
        {error && <p role="alert" className="py-4 text-center text-destructive font-body">{error}</p>}
      </div>
    </section>
  );
}

// ── Sign-in banner ─────────────────────────────────────────────────────────

function SignInToBanner() {
  const navigate = useNavigate();
  const { t } = useLang();
  return (
    <section className="py-16 bg-secondary/20 border-t border-border">
      <div className="max-w-2xl mx-auto px-5 text-center">
        <div className="rounded-lg p-8 md:p-12 bg-secondary/95 shadow-lg">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5 ring-1 ring-border">
            <Lock size={20} className="text-primary" aria-hidden="true" />
          </div>
          <h2 id="banner-heading" className="text-2xl text-foreground mb-2 font-display font-bold">{t("banner.heading")}</h2>
          <p id="banner-desc" className="text-muted-foreground text-sm leading-relaxed mb-6 font-body">{t("banner.desc")}</p>
          <button
            onClick={() => navigate("/login")}
            aria-labelledby="banner-heading"
            aria-describedby="banner-desc"
            className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 text-sm hover:bg-primary/95 transition-colors rounded-md font-body shadow-sm focus-visible:outline-none"
          >
            <Lock size={14} aria-hidden="true" />
            <span>{t("banner.cta")}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Contributors ───────────────────────────────────────────────────────────

function ContributorsSection({ authors }: { authors: Author[] }) {
  const { t } = useLang();
  const orderedAuthors = [...authors].sort((a, b) => {
    const roleRank = (role: string) => role.toLowerCase() === "team leader" ? 0 : 1;
    return roleRank(a.bio) - roleRank(b.bio) || a.displayName.localeCompare(b.displayName);
  });

  return (
    <section id="contributors" className="py-20 border-t border-border scroll-mt-20">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-12">
          <div className="text-accent text-xs tracking-[0.2em] uppercase font-medium font-body">— {t("team.eyebrow")}</div>
        </div>
        <div className="flex justify-center gap-16">
          {orderedAuthors.map((author) => (
            <div key={author.id} className="text-center group">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 ring-2 ring-border group-hover:ring-accent transition-all bg-muted">
                {author.avatarUrl ? (
                  <img src={author.avatarUrl} alt={author.displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-display text-primary">{author.displayName.slice(0, 1).toUpperCase()}</div>
                )}
              </div>
              <div className="text-foreground text-base font-display font-semibold">{author.displayName}</div>
              <div className="text-muted-foreground text-xs mt-0.5 font-body">{author.bio || t("team.role")}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const { lang } = useLang();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setNotice("");
    setError("");
    try {
      await submitContactMessage(form);
      setForm({ name: "", email: "", subject: "", message: "" });
      setNotice(lang === "hi" ? "आपका संदेश भेज दिया गया है।" : "Your message has been sent.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Message could not be sent.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 border-t border-border scroll-mt-20">
      <div className="max-w-3xl mx-auto px-5">
        <div className="text-center mb-10">
          <p className="text-accent text-xs tracking-[0.2em] uppercase mb-2 font-body">— Contact</p>
          <h2 className="text-3xl font-display font-bold">{lang === "hi" ? "संपर्क करें" : "Send us a message"}</h2>
        </div>
        <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
          <input required maxLength={120} aria-label="Name" placeholder={lang === "hi" ? "नाम" : "Name"} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="bg-input-background border border-border p-3 text-sm font-body" />
          <input required type="email" aria-label="Email" placeholder={lang === "hi" ? "ईमेल" : "Email"} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="bg-input-background border border-border p-3 text-sm font-body" />
          <input maxLength={200} aria-label="Subject" placeholder={lang === "hi" ? "विषय" : "Subject"} value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} className="sm:col-span-2 bg-input-background border border-border p-3 text-sm font-body" />
          <textarea required maxLength={5000} rows={5} aria-label="Message" placeholder={lang === "hi" ? "संदेश" : "Message"} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="sm:col-span-2 bg-input-background border border-border p-3 text-sm font-body" />
          <button disabled={submitting} className="sm:col-span-2 justify-self-start inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 text-sm font-body disabled:opacity-60">
            <Send size={14} /> {submitting ? "Sending…" : "Send message"}
          </button>
        </form>
        {notice && <p role="status" className="text-sm text-green-700 mt-4 font-body">{notice}</p>}
        {error && <p role="alert" className="text-sm text-destructive mt-4 font-body">{error}</p>}
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
  const [activeCategory, setActiveCategory] = useState("");
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void Promise.all([listPublishedMagazines(), listCategories(), listAuthors()])
      .then(([magazineData, categoryData, authorData]) => {
        if (!active) return;
        setMagazines(magazineData);
        setCategories(categoryData);
        setAuthors(authorData);
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
  }, []);

  const teamMembers = authors.filter((author) => author.bio.trim().length > 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <Hero magazines={magazines} contributorCount={teamMembers.length} />
      <LatestIssue magazines={magazines} />
      <CategoriesSection activeCategory={activeCategory} categories={categories} onSelect={setActiveCategory} />
      <IssuesSection activeCategory={activeCategory} magazines={magazines} loading={loading} error={error} />
      <SignInToBanner />
      <ContributorsSection authors={teamMembers} />
      <FaqSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
