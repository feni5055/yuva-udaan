import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { BookOpen, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useLang, LangToggle, ThemeToggle, useAuth } from "../AppContext";
import { findMember } from "../magazineStore";

export default function Login() {
  const navigate = useNavigate();
  const { t } = useLang();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (!email || !password) {
        setError(t("login.error"));
        return;
      }
      const member = findMember(email, password);
      if (member) {
        login();
        navigate("/upload");
      } else {
        setError(t("login.error_invalid"));
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary flex-col justify-between p-12">
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
              <div className="text-primary-foreground/60 text-xs tracking-widest uppercase font-body">{t("login.tagline")}</div>
            </div>
          </div>

          <blockquote>
            <p className="text-primary-foreground text-4xl leading-[1.2] mb-6 font-display font-bold">
              {t("login.quote")}
            </p>
            <p className="text-primary-foreground/60 text-sm font-body">{t("login.quote_attr")}</p>
          </blockquote>
        </div>

        <div className="relative">
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { label: t("login.stat_issues"),  value: "12+" },
              { label: t("login.stat_writers"), value: "80+" },
              { label: t("login.stat_readers"), value: "2K+" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/10 rounded-sm px-3 py-4 text-center">
                <div className="text-primary-foreground text-xl font-bold font-display">{value}</div>
                <div className="text-primary-foreground/60 text-xs tracking-widest uppercase mt-0.5 font-body">{label}</div>
              </div>
            ))}
          </div>
          <p className="text-primary-foreground/40 text-xs font-body">{t("login.footer")}</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Top controls */}
          <div className="flex items-center justify-end gap-1 mb-8">
            <LangToggle />
            <ThemeToggle />
          </div>

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-primary rounded-sm flex items-center justify-center">
              <BookOpen size={16} className="text-primary-foreground" />
            </div>
            <div>
              <div className="text-primary font-bold font-display" style={{ fontSize: "1.1rem" }}>Hindi Club</div>
              <div className="text-muted-foreground text-xs tracking-widest uppercase font-body">{t("login.tagline")}</div>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl text-foreground mb-1.5 font-display font-bold">{t("login.heading")}</h1>
            <p className="text-muted-foreground text-sm font-body">{t("login.subheading")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-body">
                {t("login.email")}
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-input-background border border-border pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm font-body"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs uppercase tracking-widest text-muted-foreground font-body">
                  {t("login.password")}
                </label>
                <a href="#" className="text-xs text-accent hover:underline underline-offset-2 font-body">
                  {t("login.forgot")}
                </a>
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-input-background border border-border pl-9 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm font-body"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && <p className="text-destructive text-xs font-body">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 rounded-sm font-body"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("login.loading")}
                </>
              ) : t("login.cta")}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground font-body">
              {t("login.no_account")}{" "}
              <Link to="/signup" className="text-accent hover:underline underline-offset-2">
                {t("login.signup_link")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
