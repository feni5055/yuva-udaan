import { useState, useCallback, useEffect } from "react";
import { Upload, BookOpen, ArrowRight, X, FileText, CheckCircle, ChevronDown, Menu } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import member1 from "@/imports/PHOTO-2026-07-17-20-56-35.jpg";
import member2 from "@/imports/Untitled-11.jpg";

const issues = [
  {
    id: 1,
    title: "वसंत विशेषांक",
    subtitle: "Spring Special Edition",
    year: "2024",
    issue: "Vol. 12",
    cover: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400&h=540&fit=crop&auto=format",
    theme: "Nature & Poetry",
    pages: 48,
    color: "#8B1A1A",
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
    color: "#C9600A",
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
    color: "#2D5A27",
  },
];

const contributors = [
  { name: "Member", role: "Club Member", avatarSrc: member1 as string },
  { name: "Member", role: "Club Member", avatarSrc: member2 as string },
  { name: "Anita Gupta", role: "Art Director", avatarSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format" },
  { name: "Rahul Verma", role: "Senior Writer", avatarSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format" },
];

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  preview?: string;
}

function NavBar({ onUploadClick }: { onUploadClick: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { label: "Issues", href: "#issues" },
    { label: "Writers", href: "#team" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#FAF6EE]/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm" style={{ fontFamily: "'Noto Serif Devanagari', serif" }}>ह</span>
          </div>
          <div>
            <div className="text-primary font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>
              Hindi Club
            </div>
            <div className="text-muted-foreground text-xs leading-tight tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Magazine
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {link.label}
            </a>
          ))}
          <button
            onClick={onUploadClick}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm hover:bg-primary/90 transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <Upload size={14} />
            Upload Issue
          </button>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-[#FAF6EE] px-5 py-4 flex flex-col gap-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-foreground text-sm"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false);
              onUploadClick();
            }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm w-fit"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <Upload size={14} /> Upload Issue
          </button>
        </div>
      )}
    </nav>
  );
}

function Hero({ onExploreClick, onUploadClick }: { onExploreClick: () => void; onUploadClick: () => void }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FAF6EE] via-[#F5EDD8] to-[#EFE0C2] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-accent text-xs tracking-[0.2em] uppercase mb-6 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <span className="w-8 h-px bg-accent inline-block" />
            The Club Magazine
          </div>
          <h1 className="text-5xl md:text-6xl leading-[1.1] text-primary mb-4" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
            Welcome to
            <br />
            <em>Hindi Club</em>
            <br />
            Magazine
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed mb-6 max-w-xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Celebrating Hindi language and literature through poetry, short stories, essays, and cultural features — written by club members and published each semester.
          </p>
          <div className="grid gap-2 text-sm text-muted-foreground max-w-xl mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <div>• Thoughtful issues shaped around festivals, culture, and student voices.</div>
            <div>• Easy uploads for contributors, polished presentation for readers.</div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={onExploreClick}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 hover:bg-primary/90 transition-colors text-sm"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <BookOpen size={15} /> Explore Issues
            </button>
            <button
              onClick={onUploadClick}
              className="flex items-center gap-2 border border-accent text-accent px-6 py-3 hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Upload size={15} /> Publish Issue
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
            <div className="text-2xl font-bold text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>{value}</div>
            <div className="text-xs text-muted-foreground tracking-widest uppercase mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function IssuesSection() {
  return (
    <section id="issues" className="py-20 border-t border-border">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-accent text-xs tracking-[0.2em] uppercase mb-2 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              — Past Issues
            </div>
            <h2 className="text-3xl md:text-4xl text-foreground" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
              Past Issues
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Discover the latest club editions, curated essays, and literary highlights from our members.
            </p>
          </div>
          <a href="#issues" className="hidden md:inline-flex items-center gap-1 text-accent text-sm hover:gap-2 transition-all" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            View all <ArrowRight size={14} />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {issues.map((issue) => (
            <article key={issue.id} className="group cursor-pointer overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                <div className="absolute inset-x-0 top-0 h-2" style={{ backgroundColor: issue.color }} />
                <img
                  src={issue.cover}
                  alt={issue.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-white/80 text-xs tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {issue.issue} · {issue.year}
                  </span>
                  <h3 className="text-white text-xl mt-1" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                    {issue.title}
                  </h3>
                </div>
                <div className="absolute top-3 right-3 bg-white/95 text-xs px-2 py-1 rounded-sm text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {issue.pages}p
                </div>
              </div>
              <div className="px-5 pb-6 pt-4">
                <div className="text-muted-foreground text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {issue.subtitle}
                </div>
                <div className="text-sm text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Theme: {issue.theme}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function UploadSection() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [coverFile, setCoverFile] = useState<UploadedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [title, setTitle] = useState("");
  const [edition, setEdition] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (coverFile?.preview) {
        URL.revokeObjectURL(coverFile.preview);
      }
    };
  }, [coverFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file for the magazine.");
      return;
    }

    setError(null);
    setUploadedFile({ name: file.name, size: file.size, type: file.type });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file for the magazine.");
      return;
    }

    setError(null);
    setUploadedFile({ name: file.name, size: file.size, type: file.type });
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image for the cover.");
      return;
    }

    const preview = URL.createObjectURL(file);
    setError(null);
    setCoverFile({ name: file.name, size: file.size, type: file.type, preview });
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile) return;

    setError(null);
    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          setDone(true);
          return 100;
        }
        return Math.min(100, p + Math.random() * 18);
      });
    }, 200);
  };

  const reset = () => {
    if (coverFile?.preview) {
      URL.revokeObjectURL(coverFile.preview);
    }
    setDone(false);
    setUploadedFile(null);
    setCoverFile(null);
    setTitle("");
    setEdition("");
    setDescription("");
    setYear(new Date().getFullYear().toString());
    setProgress(0);
    setError(null);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <section ref={sectionRef as React.RefObject<HTMLElement>} className="py-20 bg-secondary border-t border-border" id="upload">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-12">
          <div className="text-accent text-xs tracking-[0.2em] uppercase mb-2 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            — Publish to the Web
          </div>
          <h2 className="text-3xl md:text-4xl text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
            Upload a New Magazine Issue
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Upload your magazine PDF and cover image. Once published, it will appear live on the website immediately for all readers.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-card border border-border rounded-sm shadow-sm overflow-hidden">
          {done ? (
            <div className="text-center py-16 px-8">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="text-2xl text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Published Successfully!
              </h3>
              <p className="text-muted-foreground text-sm mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <strong className="text-foreground">{title || "Your issue"}</strong> — {edition || "New edition"} is now live on the website.
              </p>
              <p className="text-muted-foreground text-xs mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Readers can access and download the issue from the Past Issues section.
              </p>
              <button onClick={reset} className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 text-sm mx-auto hover:bg-primary/90 transition-colors rounded-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <Upload size={14} /> Publish Another Issue
              </button>
            </div>
          ) : (
            <form onSubmit={handlePublish}>
              <div className="px-8 pt-8 pb-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Magazine Title <span className="text-accent">*</span>
                    </label>
                    <input
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Spring Special Edition"
                      className="w-full bg-input-background border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Volume / Issue <span className="text-accent">*</span>
                    </label>
                    <input
                      required
                      value={edition}
                      onChange={(e) => setEdition(e.target.value)}
                      placeholder="e.g. Vol. 13"
                      className="w-full bg-input-background border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Theme / Description
                    </label>
                    <input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g. Poetry and Nature"
                      className="w-full bg-input-background border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Year
                    </label>
                    <input
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="2025"
                      className="w-full bg-input-background border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Magazine PDF <span className="text-accent">*</span>
                  </label>
                  {uploadedFile ? (
                    <div className="flex items-center gap-3 border border-border bg-input-background px-3 py-3 rounded-sm">
                      <div className="w-8 h-10 bg-primary/10 rounded-sm flex items-center justify-center shrink-0">
                        <FileText size={14} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-foreground truncate font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>{uploadedFile.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{formatSize(uploadedFile.size)} · PDF</div>
                      </div>
                      <button type="button" onClick={() => setUploadedFile(null)} className="text-muted-foreground hover:text-foreground transition-colors p-1" aria-label="Remove selected PDF">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragActive(true);
                      }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-sm px-4 py-10 text-center cursor-pointer transition-all ${
                        dragActive ? "border-accent bg-accent/5 scale-[1.01]" : "border-border hover:border-accent/60 hover:bg-secondary/60"
                      }`}
                      role="button"
                      aria-describedby="pdf-upload-description"
                    >
                      <div className="w-10 h-10 bg-muted rounded-sm flex items-center justify-center mx-auto mb-3">
                        <Upload size={18} className="text-muted-foreground" />
                      </div>
                      <p className="text-sm text-foreground font-medium mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Drag & drop the magazine PDF here
                      </p>
                      <p id="pdf-upload-description" className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        or <span className="text-accent underline underline-offset-2 cursor-pointer">browse to select</span> — PDF up to 250 MB
                      </p>
                      <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Cover Image <span className="text-xs normal-case tracking-normal text-muted-foreground font-normal">(JPG or PNG, optional)</span>
                  </label>
                  {coverFile ? (
                    <div className="space-y-3">
                      {coverFile.preview && (
                        <div className="overflow-hidden rounded-sm border border-border bg-card">
                          <img src={coverFile.preview} alt={coverFile.name} className="w-full h-48 object-cover" />
                        </div>
                      )}
                      <div className="flex items-center gap-3 border border-border bg-input-background px-3 py-3 rounded-sm">
                        <div className="w-8 h-10 bg-accent/10 rounded-sm flex items-center justify-center shrink-0">
                          <BookOpen size={14} className="text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-foreground truncate font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>{coverFile.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{formatSize(coverFile.size)} · Cover image</div>
                        </div>
                        <button type="button" onClick={() => setCoverFile(null)} className="text-muted-foreground hover:text-foreground transition-colors p-1" aria-label="Remove selected cover image">
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      className="w-full flex items-center gap-3 border border-border bg-input-background px-4 py-3 rounded-sm text-sm text-muted-foreground hover:border-accent/60 hover:text-foreground transition-colors text-left"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <BookOpen size={14} className="shrink-0" />
                      Choose a cover image to display in the issues grid…
                    </button>
                  )}
                  <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                </div>

                {error && (
                  <p className="text-sm text-destructive px-1" role="alert" aria-live="polite" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {error}
                  </p>
                )}
              </div>

              {uploading && (
                <div className="px-8 pb-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <span>Uploading and publishing…</span>
                    <span>{Math.min(100, Math.round(progress))}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all duration-200 rounded-full"
                      style={{ width: `${Math.min(100, progress)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="px-8 pb-8 pt-3 border-t border-border bg-secondary/40 flex items-center gap-4 mt-2">
                <button
                  type="submit"
                  disabled={uploading || !uploadedFile || !title || !edition}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-sm"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {uploading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Publishing…
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      Publish to Website
                    </>
                  )}
                </button>
                <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  The issue will go live immediately after upload.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function ContributorsSection() {
  return (
    <section id="team" className="py-20 border-t border-border">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-12">
          <div className="text-accent text-xs tracking-[0.2em] uppercase mb-2 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            — Our Team
          </div>
          <h2 className="text-3xl text-foreground" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
            Editorial Board
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {contributors.map((c, i) => (
            <div key={i} className="text-center group">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 ring-2 ring-border group-hover:ring-accent transition-all bg-muted">
                <ImageWithFallback src={c.avatarSrc} alt={c.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-foreground text-base" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>{c.name}</div>
              <div className="text-muted-foreground text-xs mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{c.role}</div>
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
    { q: "How do I submit an article?", a: "Use our Upload section above to submit a complete article or issue. We accept PDF and EPUB formats. Our editorial team will review your submission within 5–7 business days." },
    { q: "Can I write in both Hindi and English?", a: "Yes! We welcome bilingual contributions. Many of our articles feature both Hindi and English content to serve our diverse membership." },
    { q: "When is the submission deadline?", a: "Each edition has its own deadline. Check the editorial calendar or contact the editorial board for the upcoming issue's deadline." },
    { q: "Are illustrations and photos accepted?", a: "Absolutely. High-resolution images (at least 300 DPI) accompanying your article are welcome and encouraged." },
  ];

  return (
    <section className="py-20 bg-secondary border-t border-border">
      <div className="max-w-3xl mx-auto px-5">
        <div className="text-center mb-12">
          <div className="text-accent text-xs tracking-[0.2em] uppercase mb-2 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            — FAQ
          </div>
          <h2 className="text-3xl text-foreground" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
            Frequently Asked
          </h2>
        </div>

        <div className="divide-y divide-border">
          {faqs.map((faq, i) => (
            <div key={i} className="py-4">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between text-left gap-4"
                aria-expanded={open === i}
              >
                <span className="text-sm font-medium text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>{faq.q}</span>
                <ChevronDown size={16} className={`text-muted-foreground transition-transform shrink-0 ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="py-20 border-t border-border">
      <div className="max-w-6xl mx-auto px-5 grid gap-10 lg:grid-cols-[1.5fr_1fr] items-center">
        <div>
          <div className="text-accent text-xs tracking-[0.2em] uppercase mb-2 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            — Get in Touch
          </div>
          <h2 className="text-3xl md:text-4xl text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
            Join the Hindi Club Community
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Have questions about contribution guidelines, publication dates, or upcoming events? Reach out to our editorial board and start contributing to the next issue.
          </p>
        </div>

        <div className="rounded-sm bg-card border border-border p-8 shadow-sm">
          <div className="text-sm text-muted-foreground uppercase tracking-[0.2em] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Editorial Office
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase text-muted-foreground tracking-[0.2em] mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Email</p>
              <a href="mailto:editorial@hindiclub.example" className="text-foreground hover:text-accent transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                editorial@hindiclub.example
              </a>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground tracking-[0.2em] mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Phone</p>
              <a href="tel:+911234567890" className="text-foreground hover:text-accent transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                +91 12345 67890
              </a>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground tracking-[0.2em] mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Follow</p>
              <div className="flex flex-wrap gap-3">
                {['Instagram', 'Twitter', 'LinkedIn'].map((platform) => (
                  <a key={platform} href="#" className="text-accent text-sm hover:text-primary transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {platform}
                  </a>
                ))}
              </div>
            </div>
          </div>
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
            <span className="text-primary-foreground font-bold text-xs" style={{ fontFamily: "'Noto Serif Devanagari', serif" }}>ह</span>
          </div>
          <span className="text-sm text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Hindi Club · Magazine · © 2025
          </span>
        </div>
        <nav aria-label="Footer navigation" className="flex items-center gap-6 text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <a href="#contact" className="hover:text-accent transition-colors">Privacy</a>
          <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
          <a href="#contact" className="hover:text-accent transition-colors">Guidelines</a>
        </nav>
      </div>
    </footer>
  );
}

export default function App() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar onUploadClick={() => scrollToSection("upload")} />
      <main>
        <Hero onExploreClick={() => scrollToSection("issues")} onUploadClick={() => scrollToSection("upload")} />
        <IssuesSection />
        <UploadSection />
        <ContributorsSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
