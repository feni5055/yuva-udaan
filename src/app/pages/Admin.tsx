import { Link } from "react-router";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../AppContext";

export default function Admin() {
  const { authReady, isLoggedIn, user, logout } = useAuth();

  if (!authReady) {
    return <main className="min-h-screen bg-background text-foreground flex items-center justify-center font-body">Checking your secure session…</main>;
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-5">
        <div className="max-w-sm text-center">
          <ShieldCheck size={32} className="mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-display font-bold mb-3">Admin access</h1>
          <p className="text-muted-foreground font-body mb-6">Sign in with an approved administrator account to continue.</p>
          <Link to="/login" className="inline-flex bg-primary text-primary-foreground px-4 py-2.5 text-sm font-body">Sign in</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-5">
      <div className="max-w-md text-center">
        <ShieldCheck size={36} className="mx-auto mb-4 text-primary" />
        <h1 className="text-3xl font-display font-bold mb-3">Secure admin setup</h1>
        <p className="text-muted-foreground font-body leading-relaxed mb-3">You are signed in as <strong className="text-foreground">{user?.email}</strong>.</p>
        <p className="text-muted-foreground font-body leading-relaxed mb-7">Run the supplied Supabase schema, then mark this account as an administrator. The review dashboard will use that database role instead of browser storage.</p>
        <div className="flex justify-center gap-3">
          <Link to="/" className="border border-border px-4 py-2.5 text-sm font-body">Back to magazine</Link>
          <button type="button" onClick={() => void logout()} className="bg-primary text-primary-foreground px-4 py-2.5 text-sm font-body">Sign out</button>
        </div>
      </div>
    </main>
  );
}
