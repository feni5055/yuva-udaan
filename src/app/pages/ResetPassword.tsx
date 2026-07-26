import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, LoaderCircle, Lock } from "lucide-react";
import { Link } from "react-router";
import { LangToggle, ThemeToggle } from "../AppContext";
import { supabase } from "../supabase";

export default function ResetPassword() {
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setHasSession(Boolean(data.session));
      setChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setHasSession(Boolean(session));
        setChecking(false);
      }
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const savePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setSaving(false);
      setError(updateError.message);
      return;
    }
    await supabase.auth.signOut();
    setSaving(false);
    setDone(true);
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-10">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-body">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
          <div className="flex items-center gap-1">
            <LangToggle />
            <ThemeToggle />
          </div>
        </div>

        {checking ? (
          <div className="text-center">
            <LoaderCircle className="animate-spin text-primary mx-auto" aria-label="Checking password reset link" />
          </div>
        ) : done ? (
          <section className="text-center">
            <CheckCircle size={42} className="text-green-600 mx-auto mb-5" aria-hidden="true" />
            <h1 className="text-3xl font-display font-bold mb-3">Password updated</h1>
            <p className="text-sm text-muted-foreground font-body mb-7">You can now sign in using your new password.</p>
            <Link to="/login" className="inline-flex bg-primary text-primary-foreground px-5 py-3 text-sm font-body">
              Sign In
            </Link>
          </section>
        ) : !hasSession ? (
          <section className="text-center">
            <h1 className="text-3xl font-display font-bold mb-3">Reset link unavailable</h1>
            <p className="text-sm text-muted-foreground font-body leading-relaxed mb-7">
              This password-reset link is invalid or has expired. Request a new link to continue.
            </p>
            <Link to="/forgot-password" className="inline-flex bg-primary text-primary-foreground px-5 py-3 text-sm font-body">
              Request a New Link
            </Link>
          </section>
        ) : (
          <>
            <h1 className="text-3xl font-display font-bold mb-2">Choose a new password</h1>
            <p className="text-sm text-muted-foreground font-body mb-8">Use at least 8 characters.</p>
            <form onSubmit={savePassword} className="space-y-5">
              <div>
                <label htmlFor="new-password" className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-body">
                  New password
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    id="new-password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full bg-input-background border border-border pl-9 pr-3 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm font-body"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-body">
                  Confirm password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  className="w-full bg-input-background border border-border px-3 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm font-body"
                />
              </div>
              {error && <p role="alert" className="text-sm text-destructive font-body">{error}</p>}
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-primary text-primary-foreground py-3 text-sm font-body disabled:opacity-60"
              >
                {saving ? "Updating…" : "Update Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
