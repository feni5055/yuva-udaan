import { useState } from "react";
import { ArrowLeft, CheckCircle, Mail } from "lucide-react";
import { Link } from "react-router";
import { LangToggle, ThemeToggle } from "../AppContext";
import { supabase } from "../supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const requestReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setSending(true);
    setError("");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSending(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setSent(true);
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

        {sent ? (
          <section className="text-center">
            <CheckCircle size={42} className="text-green-600 mx-auto mb-5" aria-hidden="true" />
            <h1 className="text-3xl font-display font-bold mb-3">Check your email</h1>
            <p className="text-sm text-muted-foreground font-body leading-relaxed mb-7">
              If an account exists for <strong className="text-foreground">{email}</strong>, a password-reset link has been sent.
            </p>
            <Link to="/login" className="inline-flex bg-primary text-primary-foreground px-5 py-3 text-sm font-body">
              Return to Sign In
            </Link>
          </section>
        ) : (
          <>
            <h1 className="text-3xl font-display font-bold mb-2">Reset your password</h1>
            <p className="text-sm text-muted-foreground font-body leading-relaxed mb-8">
              Enter your account email and we will send you a secure reset link.
            </p>
            <form onSubmit={requestReset} className="space-y-5">
              <div>
                <label htmlFor="reset-email" className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-body">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    id="reset-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-input-background border border-border pl-9 pr-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm font-body"
                  />
                </div>
              </div>
              {error && <p role="alert" className="text-sm text-destructive font-body">{error}</p>}
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-primary text-primary-foreground py-3 text-sm font-body disabled:opacity-60"
              >
                {sending ? "Sending…" : "Send Reset Link"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
