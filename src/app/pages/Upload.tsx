import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { saveMagazine } from "../magazineStore";
import { useLang, LangToggle, ThemeToggle, THEME_OPTIONS } from "../AppContext";
import {
  BookOpen, Upload, FileText, X, CheckCircle,
  AlertCircle, ChevronLeft, Calendar, Users, Hash, ImagePlus, ChevronDown,
} from "lucide-react";

interface UploadedFile {
  file: File;
  progress: number;
  status: "uploading" | "done" | "error";
  id: string;
}

// ── NavBar ─────────────────────────────────────────────────────────────────

function NavBar() {
  const navigate = useNavigate();
  const { t } = useLang();
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-body"
          >
            <ChevronLeft size={15} /> {t("upload.back")}
          </button>
          <span className="text-border text-sm">|</span>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs font-devanagari">ह</span>
            </div>
            <span className="text-foreground font-semibold font-display text-sm">{t("upload.portal")}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LangToggle />
          <ThemeToggle />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-body ml-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            {t("upload.signed_in")}
          </div>
        </div>
      </div>
    </nav>
  );
}

// ── Cover image picker ─────────────────────────────────────────────────────

function CoverPicker({ coverUrl, onChange }: { coverUrl: string | null; onChange: (url: string | null) => void }) {
  const { t } = useLang();
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const readFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  }, []);

  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-body">
        {t("upload.cover_label")}
      </label>
      {coverUrl ? (
        <div className="relative group rounded-sm overflow-hidden border border-border shadow-sm" style={{ width: "160px", aspectRatio: "3/4" }}>
          <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button type="button" onClick={() => inputRef.current?.click()}
              className="bg-white/90 text-foreground text-xs px-3 py-1.5 rounded-sm font-body hover:bg-white transition-colors">
              {t("upload.cover_change")}
            </button>
            <button type="button" onClick={() => onChange(null)}
              className="bg-white/90 text-destructive text-xs px-3 py-1.5 rounded-sm font-body hover:bg-white transition-colors">
              {t("upload.cover_remove")}
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-sm cursor-pointer transition-all select-none
            ${dragging ? "border-primary bg-primary/5" : "border-border hover:border-accent hover:bg-secondary/40"}
            py-8 px-4 text-center`}
          style={{ width: "160px", aspectRatio: "3/4" }}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${dragging ? "bg-primary/15" : "bg-secondary"}`}>
            <ImagePlus size={18} className={dragging ? "text-primary" : "text-muted-foreground"} />
          </div>
          <p className="text-xs text-muted-foreground font-body leading-snug">
            {t("upload.cover_drop")}<br />
            {t("upload.pdf_browse") === "browse files" ? "or " : "या "}
            <span className="text-accent underline underline-offset-1">{t("upload.cover_browse")}</span>
          </p>
          <p className="text-[10px] text-muted-foreground/60 font-body">JPG · PNG · WEBP</p>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) readFile(f); e.target.value = ""; }} />
    </div>
  );
}

// ── Theme dropdown ─────────────────────────────────────────────────────────

function ThemeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { lang, t } = useLang();
  const [open, setOpen] = useState(false);
  const isOther = value === "__other__";
  const [custom, setCustom] = useState("");

  const selectedOption = THEME_OPTIONS.find((o) => o.en === value);
  const displayLabel = selectedOption
    ? (lang === "hi" ? selectedOption.hi : selectedOption.en)
    : isOther
    ? t("upload.theme_other")
    : "";

  const handleSelect = (optEn: string) => {
    onChange(optEn);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`w-full bg-input-background border border-border px-3 py-2.5 text-sm text-left flex items-center justify-between rounded-sm font-body focus:outline-none focus:ring-1 focus:ring-ring ${!value ? "text-muted-foreground" : "text-foreground"}`}
        >
          <span>{displayLabel || t("upload.theme_ph")}</span>
          <ChevronDown size={14} className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute z-30 mt-1 w-full bg-card border border-border rounded-sm shadow-xl max-h-60 overflow-y-auto">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.en}
                type="button"
                onClick={() => handleSelect(opt.en)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors font-body flex items-center justify-between
                  ${value === opt.en ? "bg-secondary text-foreground font-medium" : "text-foreground"}`}
              >
                <span>{lang === "hi" ? opt.hi : opt.en}</span>
                {lang === "hi" && <span className="text-xs text-muted-foreground ml-2">{opt.en}</span>}
              </button>
            ))}
            <button
              type="button"
              onClick={() => { onChange("__other__"); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors font-body border-t border-border
                ${isOther ? "bg-secondary text-foreground font-medium" : "text-muted-foreground"}`}
            >
              {t("upload.theme_other")}
            </button>
          </div>
        )}
      </div>

      {isOther && (
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder={t("upload.theme_custom_ph")}
          className="w-full bg-input-background border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm font-body"
          onBlur={() => { if (custom.trim()) onChange(custom.trim()); }}
        />
      )}
    </div>
  );
}

// ── PDF drop zone ──────────────────────────────────────────────────────────

function DropZone({ onFiles, disabled }: { onFiles: (files: File[]) => void; disabled: boolean }) {
  const { t } = useLang();
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const pdfs = Array.from(e.dataTransfer.files).filter((f) => f.type === "application/pdf");
    if (pdfs.length) onFiles(pdfs);
  }, [onFiles, disabled]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-sm transition-all cursor-pointer select-none
        ${dragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-accent hover:bg-secondary/50"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        p-12 text-center`}
    >
      <input ref={inputRef} type="file" accept="application/pdf" multiple className="hidden"
        onChange={(e) => { const files = Array.from(e.target.files ?? []); if (files.length) onFiles(files); e.target.value = ""; }} />
      <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${dragging ? "bg-primary/15" : "bg-secondary"}`}>
        <Upload size={24} className={dragging ? "text-primary" : "text-muted-foreground"} />
      </div>
      <p className="text-foreground text-base font-semibold mb-1 font-display">
        {dragging ? t("upload.pdf_drop") : t("upload.pdf_heading")}
      </p>
      <p className="text-muted-foreground text-sm font-body">
        or <span className="text-accent underline underline-offset-2">{t("upload.pdf_browse")}</span> — {t("upload.pdf_hint")}
      </p>
    </div>
  );
}

// ── File row ───────────────────────────────────────────────────────────────

function FileRow({ item, onRemove }: { item: UploadedFile; onRemove: () => void }) {
  const { t } = useLang();
  const sizeLabel = item.file.size < 1024 * 1024
    ? `${(item.file.size / 1024).toFixed(0)} KB`
    : `${(item.file.size / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-sm">
      <div className="w-10 h-10 bg-secondary rounded-sm flex items-center justify-center shrink-0">
        <FileText size={18} className="text-accent" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate font-body">{item.file.name}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-muted-foreground font-body">{sizeLabel}</span>
          {item.status === "uploading" && (
            <>
              <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden max-w-32">
                <div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${item.progress}%` }} />
              </div>
              <span className="text-xs text-muted-foreground font-body">{item.progress}%</span>
            </>
          )}
          {item.status === "done" && (
            <span className="text-xs text-green-600 flex items-center gap-1 font-body">
              <CheckCircle size={11} /> {t("upload.done")}
            </span>
          )}
          {item.status === "error" && (
            <span className="text-xs text-destructive flex items-center gap-1 font-body">
              <AlertCircle size={11} /> {t("upload.failed")}
            </span>
          )}
        </div>
      </div>
      {item.status !== "uploading" && (
        <button onClick={onRemove} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
          <X size={16} />
        </button>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function UploadPage() {
  const navigate = useNavigate();
  const { t } = useLang();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [theme, setTheme] = useState("");
  const [form, setForm] = useState({ title: "", subtitle: "", volume: "", year: new Date().getFullYear().toString(), publishDate: "", editors: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const simulateUpload = (file: File) => {
    const id = Math.random().toString(36).slice(2);
    setFiles((prev) => [...prev, { file, progress: 0, status: "uploading", id }]);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 18) + 6;
      if (progress >= 100) {
        clearInterval(interval);
        setFiles((prev) => prev.map((f) => f.id === id ? { ...f, progress: 100, status: "done" } : f));
      } else {
        setFiles((prev) => prev.map((f) => f.id === id ? { ...f, progress } : f));
      }
    }, 180);
  };

  const handleFiles = (incoming: File[]) => incoming.forEach(simulateUpload);
  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));
  const allDone = files.length > 0 && files.every((f) => f.status === "done");

  const reset = () => {
    setFiles([]);
    setCoverUrl(null);
    setTheme("");
    setForm({ title: "", subtitle: "", volume: "", year: new Date().getFullYear().toString(), publishDate: "", editors: "" });
  };

  const resolvedTheme = theme === "__other__" ? "" : theme;

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.title.trim()) { setFormError(t("upload.err_title")); return; }
    if (!form.volume.trim()) { setFormError(t("upload.err_volume")); return; }
    if (!allDone) { setFormError(t("upload.err_wait")); return; }
    setSubmitting(true);
    setTimeout(() => {
      saveMagazine({
        id: Math.random().toString(36).slice(2),
        title: form.title,
        subtitle: form.subtitle,
        volume: form.volume,
        year: form.year,
        theme: resolvedTheme,
        editors: form.editors,
        publishDate: form.publishDate || undefined,
        fileName: files[0]?.file.name ?? "",
        fileSize: files[0]?.file.size ?? 0,
        uploadedAt: new Date().toISOString(),
        coverUrl: coverUrl ?? undefined,
      });
      setSubmitting(false);
      setSubmitted(true);
    }, 1400);
  };

  // ── Success ───────────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="max-w-sm w-full text-center">
            {coverUrl ? (
              <div className="w-24 h-32 mx-auto mb-6 rounded-sm overflow-hidden shadow-lg border border-border">
                <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-600" />
              </div>
            )}
            <h1 className="text-3xl text-foreground mb-3 font-display font-bold">{t("upload.success_heading")}</h1>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2 font-body">
              <strong className="text-foreground">{form.title}</strong> {t("upload.success_p1")}
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mb-10 font-body">{t("upload.success_p2")}</p>
            <div className="flex gap-3">
              <button onClick={() => { setSubmitted(false); reset(); }}
                className="flex-1 border border-border text-foreground text-sm py-2.5 hover:bg-secondary transition-colors rounded-sm font-body">
                {t("upload.another")}
              </button>
              <button onClick={() => navigate("/")}
                className="flex-1 bg-primary text-primary-foreground text-sm py-2.5 hover:bg-primary/90 transition-colors rounded-sm font-body">
                {t("upload.view_mag")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  const guidelines = [
    t("upload.guide1"), t("upload.guide2"), t("upload.guide3"),
    t("upload.guide4"), t("upload.guide5"),
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="max-w-5xl mx-auto px-5 py-12">
        <div className="mb-10">
          <div className="text-accent text-xs tracking-[0.2em] uppercase mb-2 font-medium font-body">— {t("upload.eyebrow")}</div>
          <h1 className="text-4xl text-foreground mb-2 font-display font-bold">{t("upload.heading")}</h1>
          <p className="text-muted-foreground text-sm font-body">{t("upload.subheading")}</p>
        </div>

        <form onSubmit={handlePublish}>
          <div className="grid md:grid-cols-5 gap-8">

            {/* Left */}
            <div className="md:col-span-3 space-y-6">

              {/* PDF */}
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-body">{t("upload.step1")}</p>
                <DropZone onFiles={handleFiles} disabled={false} />
              </div>
              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((item) => <FileRow key={item.id} item={item} onRemove={() => removeFile(item.id)} />)}
                </div>
              )}

              {/* Cover */}
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-body">{t("upload.step2")}</p>
                <div className="bg-secondary/50 border border-border rounded-sm p-6 flex flex-col items-center gap-5">
                  <CoverPicker coverUrl={coverUrl} onChange={setCoverUrl} />
                  <div className="text-center space-y-1.5 max-w-xs">
                    <p className="text-xs text-muted-foreground font-body leading-relaxed">{t("upload.cover_desc")}</p>
                    <p className="text-xs text-muted-foreground/60 font-body">{t("upload.cover_hint")}</p>
                    {!coverUrl
                      ? <p className="text-xs text-accent font-body flex items-center justify-center gap-1"><ImagePlus size={11} /> {t("upload.cover_optional")}</p>
                      : <p className="text-xs text-green-600 font-body flex items-center justify-center gap-1"><CheckCircle size={11} /> {t("upload.cover_added")}</p>
                    }
                  </div>
                </div>
              </div>

              {/* Guidelines */}
              <div className="bg-secondary border border-border rounded-sm p-5">
                <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-3 font-body">{t("upload.guidelines")}</p>
                <ul className="space-y-2 text-xs text-muted-foreground font-body">
                  {guidelines.map((tip) => (
                    <li key={tip} className="flex items-start gap-2">
                      <span className="text-accent mt-0.5 shrink-0">·</span>{tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right — metadata */}
            <div className="md:col-span-2 space-y-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-body">{t("upload.step3")}</p>

              {/* Title */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-body">
                  {t("upload.title")} <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <BookOpen size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder={t("upload.title_ph")}
                    className="w-full bg-input-background border border-border pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm font-body" />
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-body">
                  {t("upload.subtitle")}
                </label>
                <input value={form.subtitle} onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
                  placeholder={t("upload.subtitle_ph")}
                  className="w-full bg-input-background border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm font-body" />
              </div>

              {/* Volume + Year */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-body">
                    {t("upload.volume")} <span className="text-accent">*</span>
                  </label>
                  <div className="relative">
                    <Hash size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input value={form.volume} onChange={(e) => setForm((p) => ({ ...p, volume: e.target.value }))}
                      placeholder="13"
                      className="w-full bg-input-background border border-border pl-8 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm font-body" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-body">
                    {t("upload.year")}
                  </label>
                  <div className="relative">
                    <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}
                      placeholder="2025"
                      className="w-full bg-input-background border border-border pl-8 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm font-body" />
                  </div>
                </div>
              </div>

              {/* Publication date */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-body">
                  {t("upload.pub_date")}
                </label>
                <div className="relative">
                  <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    type="date"
                    value={form.publishDate}
                    onChange={(e) => setForm((p) => ({ ...p, publishDate: e.target.value }))}
                    className="w-full bg-input-background border border-border pl-8 pr-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm font-body [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Theme dropdown */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-body">
                  {t("upload.theme")}
                </label>
                <ThemeSelect value={theme} onChange={setTheme} />
              </div>

              {/* Editors */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-body">
                  <Users size={11} className="inline mr-1" />{t("upload.editors")}
                </label>
                <textarea value={form.editors} onChange={(e) => setForm((p) => ({ ...p, editors: e.target.value }))}
                  placeholder={t("upload.editors_ph")} rows={3}
                  className="w-full bg-input-background border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm resize-none font-body" />
              </div>

              {formError && (
                <p className="text-destructive text-xs flex items-center gap-1.5 font-body">
                  <AlertCircle size={12} /> {formError}
                </p>
              )}

              <button type="submit" disabled={submitting || !allDone || files.length === 0}
                className="w-full bg-primary text-primary-foreground py-3 text-sm font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 rounded-sm font-body">
                {submitting ? (
                  <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t("upload.loading")}</>
                ) : (
                  <><Upload size={14} /> {t("upload.cta")}</>
                )}
              </button>

              {files.length === 0 && (
                <p className="text-muted-foreground text-xs text-center font-body">{t("upload.pdf_required")}</p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
