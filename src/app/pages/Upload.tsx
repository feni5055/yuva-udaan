import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { saveMagazine } from "../magazineStore";
import {
  BookOpen,
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  Calendar,
  Users,
  Hash,
} from "lucide-react";

interface UploadedFile {
  file: File;
  progress: number;
  status: "uploading" | "done" | "error";
  id: string;
}

function NavBar() {
  const navigate = useNavigate();
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-body"
          >
            <ChevronLeft size={15} /> Back to Magazine
          </button>
          <span className="text-border text-sm">|</span>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs font-devanagari">ह</span>
            </div>
            <span className="text-foreground font-semibold font-display text-sm">Member Upload</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          Signed in as Member
        </div>
      </div>
    </nav>
  );
}

function DropZone({
  onFiles,
  disabled,
}: {
  onFiles: (files: File[]) => void;
  disabled: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (disabled) return;
      const pdfs = Array.from(e.dataTransfer.files).filter(
        (f) => f.type === "application/pdf"
      );
      if (pdfs.length) onFiles(pdfs);
    },
    [onFiles, disabled]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) onFiles(files);
    e.target.value = "";
  };

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
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="hidden"
        onChange={handleChange}
      />
      <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${dragging ? "bg-primary/15" : "bg-secondary"}`}>
        <Upload size={24} className={dragging ? "text-primary" : "text-muted-foreground"} />
      </div>
      <p className="text-foreground text-base font-semibold mb-1 font-display">
        {dragging ? "Drop your PDF here" : "Drag & drop your magazine PDF"}
      </p>
      <p className="text-muted-foreground text-sm font-body">
        or <span className="text-accent underline underline-offset-2">browse files</span> — PDF only, up to 50 MB
      </p>
    </div>
  );
}

function FileRow({ item, onRemove }: { item: UploadedFile; onRemove: () => void }) {
  const sizeLabel =
    item.file.size < 1024 * 1024
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
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground font-body">{item.progress}%</span>
            </>
          )}
          {item.status === "done" && (
            <span className="text-xs text-green-600 flex items-center gap-1 font-body">
              <CheckCircle size={11} /> Uploaded
            </span>
          )}
          {item.status === "error" && (
            <span className="text-xs text-destructive flex items-center gap-1 font-body">
              <AlertCircle size={11} /> Failed
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

export default function UploadPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    volume: "",
    year: new Date().getFullYear().toString(),
    theme: "",
    editors: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const simulateUpload = (file: File): string => {
    const id = Math.random().toString(36).slice(2);
    const item: UploadedFile = { file, progress: 0, status: "uploading", id };
    setFiles((prev) => [...prev, item]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 18) + 6;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, progress: 100, status: "done" } : f))
        );
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, progress } : f))
        );
      }
    }, 180);

    return id;
  };

  const handleFiles = (incoming: File[]) => {
    incoming.forEach((f) => simulateUpload(f));
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const allDone = files.length > 0 && files.every((f) => f.status === "done");

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.title.trim()) { setFormError("Issue title is required."); return; }
    if (!form.volume.trim()) { setFormError("Volume number is required."); return; }
    if (!allDone) { setFormError("Please wait for all files to finish uploading."); return; }
    setSubmitting(true);
    setTimeout(() => {
      saveMagazine({
        id: Math.random().toString(36).slice(2),
        title: form.title,
        subtitle: form.subtitle,
        volume: form.volume,
        year: form.year,
        theme: form.theme,
        editors: form.editors,
        fileName: files[0]?.file.name ?? "",
        fileSize: files[0]?.file.size ?? 0,
        uploadedAt: new Date().toISOString(),
      });
      setSubmitting(false);
      setSubmitted(true);
    }, 1400);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="max-w-sm w-full text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h1 className="text-3xl text-foreground mb-3 font-display font-bold">Issue Published!</h1>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2 font-body">
              <strong className="text-foreground">{form.title}</strong> has been submitted to the editorial queue.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mb-10 font-body">
              The editorial board will review and publish it to the magazine archive.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setSubmitted(false); setFiles([]); setForm({ title: "", subtitle: "", volume: "", year: new Date().getFullYear().toString(), theme: "", editors: "" }); }}
                className="flex-1 border border-border text-foreground text-sm py-2.5 hover:bg-secondary transition-colors rounded-sm font-body"
              >
                Upload Another
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-primary text-primary-foreground text-sm py-2.5 hover:bg-primary/90 transition-colors rounded-sm font-body"
              >
                View Magazine
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="max-w-5xl mx-auto px-5 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="text-accent text-xs tracking-[0.2em] uppercase mb-2 font-medium font-body">— Member Portal</div>
          <h1 className="text-4xl text-foreground mb-2 font-display font-bold">Publish a New Issue</h1>
          <p className="text-muted-foreground text-sm font-body">
            Upload a PDF and fill in the issue details. The editorial board will review before it goes live.
          </p>
        </div>

        <form onSubmit={handlePublish}>
          <div className="grid md:grid-cols-5 gap-8">
            {/* Left — upload + file list */}
            <div className="md:col-span-3 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-body">
                  1. Upload PDF File
                </p>
                <DropZone onFiles={handleFiles} disabled={false} />
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((item) => (
                    <FileRow key={item.id} item={item} onRemove={() => removeFile(item.id)} />
                  ))}
                </div>
              )}

              {/* Guidelines */}
              <div className="bg-secondary border border-border rounded-sm p-5">
                <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-3 font-body">Upload Guidelines</p>
                <ul className="space-y-2 text-xs text-muted-foreground font-body">
                  {[
                    "PDF format only, maximum 50 MB per file",
                    "Ensure all fonts are embedded in the PDF",
                    "Images should be at least 150 DPI for print quality",
                    "Include a cover page as the first page",
                    "Review editorial guidelines before submitting",
                  ].map((tip) => (
                    <li key={tip} className="flex items-start gap-2">
                      <span className="text-accent mt-0.5 shrink-0">·</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right — metadata form */}
            <div className="md:col-span-2 space-y-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-body">
                2. Issue Details
              </p>

              {/* Title */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-body">
                  Issue Title <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <BookOpen size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. दीपावली अंक"
                    className="w-full bg-input-background border border-border pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm font-body"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-body">
                  English Subtitle
                </label>
                <input
                  value={form.subtitle}
                  onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
                  placeholder="e.g. Diwali Special Edition"
                  className="w-full bg-input-background border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm font-body"
                />
              </div>

              {/* Volume + Year */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-body">
                    Volume <span className="text-accent">*</span>
                  </label>
                  <div className="relative">
                    <Hash size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      value={form.volume}
                      onChange={(e) => setForm((p) => ({ ...p, volume: e.target.value }))}
                      placeholder="13"
                      className="w-full bg-input-background border border-border pl-8 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm font-body"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-body">
                    Year
                  </label>
                  <div className="relative">
                    <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      value={form.year}
                      onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}
                      placeholder="2025"
                      className="w-full bg-input-background border border-border pl-8 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm font-body"
                    />
                  </div>
                </div>
              </div>

              {/* Theme */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-body">
                  Theme / Topic
                </label>
                <input
                  value={form.theme}
                  onChange={(e) => setForm((p) => ({ ...p, theme: e.target.value }))}
                  placeholder="e.g. Festivals & Tradition"
                  className="w-full bg-input-background border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm font-body"
                />
              </div>

              {/* Editors */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-body">
                  <Users size={11} className="inline mr-1" />
                  Editors / Contributors
                </label>
                <textarea
                  value={form.editors}
                  onChange={(e) => setForm((p) => ({ ...p, editors: e.target.value }))}
                  placeholder="Names of editors and contributors..."
                  rows={3}
                  className="w-full bg-input-background border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm resize-none font-body"
                />
              </div>

              {formError && (
                <p className="text-destructive text-xs flex items-center gap-1.5 font-body">
                  <AlertCircle size={12} /> {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || !allDone || files.length === 0}
                className="w-full bg-primary text-primary-foreground py-3 text-sm font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 rounded-sm font-body"
              >
                {submitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Publishing…
                  </>
                ) : (
                  <>
                    <Upload size={14} /> Publish Issue
                  </>
                )}
              </button>

              {files.length === 0 && (
                <p className="text-muted-foreground text-xs text-center font-body">
                  Upload a PDF file above to enable publishing.
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
