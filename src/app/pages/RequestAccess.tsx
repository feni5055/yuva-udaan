import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { BookOpen, ArrowLeft, User, Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useLang, LangToggle, ThemeToggle } from "../AppContext";
import { registerMember, getMembers } from "../magazineStore";

function PasswordStrength({ password }: { password: string }) {
  const { t } = useLang();
  const checks = [
    { label: t("signup.err_pass2").replace("Password must be at least ", "").replace(".", ""), pass: password.length >= 8 },
    { label: "A–Z", pass: /[A-Z]/.test(password) },
    { label: "0–9", pass: /\d/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const bar = ["bg-destructive", "bg-orange-400", "bg-yellow-400", "bg-green-500"][score];
  if (!password) return null;
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < score ? bar : "bg-muted"}`} />
        ))}
      </div>
      <div className="flex gap-3 flex-wrap">
        {checks.map(({ label, pass }) => (
          <span key={label} className={`text-xs flex items-center gap-1 font-body ${pass ? "text-green-600" : "text-muted-foreground"}`}>
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${pass ? "bg-green-500" : "bg-muted-foreground/40"}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SignUp() {
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);

  const set = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t("signup.err_name");
    if (!form.email.trim()) e.email = t("signup.err_email");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t("signup.err_email2");
    if (!form.password) e.password = t("signup.err_pass");
    else if (form.password.length < 8) e.password = t("signup.err_pass2");
    if (!form.confirm) e.confirm = t("signup.err_confirm");
    else if (form.confirm !== form.password) e.confirm = t("signup.err_confirm2");
    if (!agreed) e.agreed = t("signup.err_terms");
    if (form.email && !e.email) {
      const exists = getMembers().some((m) => m.email.toLowerCase() === form.email.toLowerCase().trim());
      if (exists) e.email = lang === "en" ? "An account with this email already exists." : "इस ईमेल से पहले से खाता मौजूद है।";
    }
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    setTimeout(() => {
      registerMember({ name: form.name, email: form.email, password: form.password });
      setSubmitting(false);
      setDone(true);
    }, 1500);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          <div className="absolute top-4 right-4 flex items-center gap-1">
            <LangToggle />
            <ThemeToggle />
          </div>
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl text-foreground mb-3 font-display font-bold">{t("signup.done_heading")}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-2 font-body">
            <strong className="text-foreground">{form.name}</strong> — {t("signup.done_p1")}
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed mb-10 font-body">
            {t("signup.done_p2")} <strong className="text-foreground">{form.email}</strong>.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-primary text-primary-foreground py-3 text-sm hover:bg-primary/90 transition-colors rounded-sm font-body"
          >
            {t("signup.done_cta")}
          </button>
        </div>
      </div>
    );
  }

  const benefits = [
    t("signup.benefit1"),
    t("signup.benefit2"),
    t("signup.benefit3"),
    t("signup.benefit4"),
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-primary flex-col justify-between p-12">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.15) 40px, rgba(255,255,255,0.15) 41px)` }}
        />
        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 bg-white/15 rounded-sm flex items-center justify-center">
              <BookOpen size={18} className="text-primary-foreground" />
            </div>
            <div>
              <div className="text-primary-foreground font-bold font-display" style={{ fontSize: "1.1rem" }}>Hindi Club</div>
              <div className="text-primary-foreground/60 text-xs tracking-widest uppercase font-body">{t("nav.tagline")}</div>
            </div>
          </div>
          <p className="text-primary-foreground text-4xl leading-[1.2] mb-4 font-display font-bold">{t("signup.panel_heading")}</p>
          <p className="text-primary-foreground/60 text-sm leading-relaxed font-body">{t("signup.panel_desc")}</p>
        </div>
        <div className="relative space-y-3">
          {benefits.map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-accent/30 flex items-center justify-center shrink-0">
                <CheckCircle size={11} className="text-primary-foreground" />
              </div>
              <span className="text-primary-foreground/80 text-sm font-body">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-sm">

          {/* Top controls */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-body"
            >
              <ArrowLeft size={14} /> {t("signup.back")}
            </button>
            <div className="flex items-center gap-1">
              <LangToggle />
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <BookOpen size={14} className="text-primary-foreground" />
            </div>
            <div>
              <div className="text-primary font-bold text-sm font-display">Hindi Club</div>
              <div className="text-muted-foreground text-[10px] tracking-widest uppercase font-body">{t("nav.tagline")}</div>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl text-foreground mb-1.5 font-display font-bold">{t("signup.heading")}</h1>
            <p className="text-muted-foreground text-sm font-body">
              {t("signup.subheading")}{" "}
              <Link to="/login" className="text-accent underline underline-offset-2 hover:text-accent/80">
                {t("signup.signin_link")}
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-body">
                {t("signup.name")} <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder={t("signup.name_ph")}
                  className={`w-full bg-input-background border pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm font-body ${errors.name ? "border-destructive" : "border-border"}`}
                />
              </div>
              {errors.name && <p className="text-destructive text-xs mt-1 font-body">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-body">
                {t("signup.email")} <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder={t("signup.email_ph")}
                  className={`w-full bg-input-background border pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm font-body ${errors.email ? "border-destructive" : "border-border"}`}
                />
              </div>
              {errors.email && <p className="text-destructive text-xs mt-1 font-body">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-body">
                {t("signup.password")} <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder={t("signup.password_ph")}
                  className={`w-full bg-input-background border pl-9 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm font-body ${errors.password ? "border-destructive" : "border-border"}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-xs mt-1 font-body">{errors.password}</p>}
              <PasswordStrength password={form.password} />
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-body">
                {t("signup.confirm")} <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirm}
                  onChange={(e) => set("confirm", e.target.value)}
                  placeholder={t("signup.confirm_ph")}
                  className={`w-full bg-input-background border pl-9 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm font-body ${errors.confirm ? "border-destructive" : "border-border"}`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.confirm && <p className="text-destructive text-xs mt-1 font-body">{errors.confirm}</p>}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => { setAgreed(e.target.checked); setErrors((p) => ({ ...p, agreed: "" })); }}
                  className="mt-0.5 w-4 h-4 accent-primary cursor-pointer shrink-0"
                />
                <span className="text-xs text-muted-foreground leading-relaxed font-body">
                  {t("signup.terms")}{" "}
                  <a href="#" className="text-accent underline underline-offset-2" onClick={(e) => e.stopPropagation()}>{t("signup.terms_tos")}</a>
                  {" "}{t("signup.terms_and")}{" "}
                  <a href="#" className="text-accent underline underline-offset-2" onClick={(e) => e.stopPropagation()}>{t("signup.terms_pp")}</a>
                </span>
              </label>
              {errors.agreed && <p className="text-destructive text-xs mt-1 font-body">{errors.agreed}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground py-3 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 rounded-sm mt-2 font-body"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("signup.loading")}
                </>
              ) : t("signup.cta")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
