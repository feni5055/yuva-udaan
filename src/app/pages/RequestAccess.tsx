import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { BookOpen, ArrowLeft, User, Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /\d/.test(password) },
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
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (!form.confirm) e.confirm = "Please confirm your password.";
    else if (form.confirm !== form.password) e.confirm = "Passwords do not match.";
    if (!agreed) e.agreed = "You must agree to the terms to continue.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setDone(true); }, 1500);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl text-foreground mb-3 font-display font-bold">Account Created!</h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-2 font-body">
            Welcome, <strong className="text-foreground">{form.name}</strong>. Your account has been created successfully.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed mb-10 font-body">
            A verification email has been sent to <strong className="text-foreground">{form.email}</strong>.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-primary text-primary-foreground py-3 text-sm hover:bg-primary/90 transition-colors rounded-sm font-body"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-primary flex-col justify-between p-12">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.15) 40px, rgba(255,255,255,0.15) 41px)`,
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 bg-white/15 rounded-sm flex items-center justify-center">
              <BookOpen size={18} className="text-primary-foreground" />
            </div>
            <div>
              <div className="text-primary-foreground font-bold font-display" style={{ fontSize: "1.1rem" }}>Hindi Club</div>
              <div className="text-primary-foreground/60 text-xs tracking-widest uppercase font-body">Magazine</div>
            </div>
          </div>

          <p className="text-primary-foreground text-4xl leading-[1.2] mb-4 font-display font-bold">
            Join our community of readers &amp; writers.
          </p>
          <p className="text-primary-foreground/60 text-sm leading-relaxed font-body">
            Become part of the Hindi Club and get access to all published magazines, events, and the ability to contribute your own writing.
          </p>
        </div>

        <div className="relative space-y-3">
          {[
            "Access all published magazine issues",
            "Submit poems, stories & essays",
            "Join member-only events & workshops",
            "Early access to new editions",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-accent/30 flex items-center justify-center shrink-0">
                <CheckCircle size={11} className="text-primary-foreground" />
              </div>
              <span className="text-primary-foreground/80 text-sm font-body">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-sm">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm mb-8 font-body"
          >
            <ArrowLeft size={14} /> Back to Sign In
          </button>

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <BookOpen size={14} className="text-primary-foreground" />
            </div>
            <div>
              <div className="text-primary font-bold text-sm font-display">Hindi Club</div>
              <div className="text-muted-foreground text-[10px] tracking-widest uppercase font-body">Magazine</div>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl text-foreground mb-1.5 font-display font-bold">Create an account</h1>
            <p className="text-muted-foreground text-sm font-body">
              Already have an account?{" "}
              <Link to="/login" className="text-accent underline underline-offset-2 hover:text-accent/80">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-body">
                Full Name <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Your full name"
                  className={`w-full bg-input-background border pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm font-body ${errors.name ? "border-destructive" : "border-border"}`}
                />
              </div>
              {errors.name && <p className="text-destructive text-xs mt-1 font-body">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-body">
                Email Address <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full bg-input-background border pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm font-body ${errors.email ? "border-destructive" : "border-border"}`}
                />
              </div>
              {errors.email && <p className="text-destructive text-xs mt-1 font-body">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-body">
                Password <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="Create a password"
                  className={`w-full bg-input-background border pl-9 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm font-body ${errors.password ? "border-destructive" : "border-border"}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-xs mt-1 font-body">{errors.password}</p>}
              <PasswordStrength password={form.password} />
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-body">
                Confirm Password <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirm}
                  onChange={(e) => set("confirm", e.target.value)}
                  placeholder="Repeat your password"
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
                  I agree to the{" "}
                  <a href="#" className="text-accent underline underline-offset-2" onClick={(e) => e.stopPropagation()}>Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="text-accent underline underline-offset-2" onClick={(e) => e.stopPropagation()}>Privacy Policy</a>
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
                  Creating account…
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
