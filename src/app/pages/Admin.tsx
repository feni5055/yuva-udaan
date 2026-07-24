import { useEffect, useState } from "react";
import { getMagazines, deleteMagazine, getMembers, registerMember, type StoredMagazine } from "../magazineStore";
import { isAdminCredential } from "../magazineStore";

export default function Admin() {
  const [authenticated, setAuthenticated] = useState<boolean>(() => Boolean(sessionStorage.getItem("hc_admin_auth")));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [magazines, setMagazines] = useState<StoredMagazine[]>(() => getMagazines());
  const [members, setMembers] = useState(() => getMembers());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authenticated) {
      setMagazines(getMagazines());
      setMembers(getMembers());
    }
  }, [authenticated]);

  async function doLogin(e?: React.FormEvent) {
    e?.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        sessionStorage.setItem('hc_admin_auth', '1');
        setAuthenticated(true);
        setError(null);
        setMagazines(getMagazines());
        setMembers(getMembers());
      } else {
        const data = await res.json();
        setError(data?.message || 'Invalid admin credentials');
      }
    } catch (err) {
      setError('Network error');
    }
  }

  async function doLogout() {
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {
      // ignore
    }
    sessionStorage.removeItem('hc_admin_auth');
    setAuthenticated(false);
    setEmail('');
    setPassword('');
  }

  function handleDeleteMagazine(id: string) {
    deleteMagazine(id);
    setMagazines(getMagazines());
  }

  // Members management: reuse existing public API where available. The magazineStore doesn't expose deleteMember,
  // so manipulate localStorage directly using the same key the app uses (hc_members).
  const MEMBERS_KEY = "hc_members";

  function removeMember(emailToRemove: string) {
    const list = getMembers().filter((m: any) => m.email.toLowerCase() !== emailToRemove.toLowerCase());
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(list));
    setMembers(getMembers());
  }

  function addMember(name: string, emailVal: string, pwd: string) {
    if (!name || !emailVal || !pwd) return;
    registerMember({ name, email: emailVal, password: pwd });
    setMembers(getMembers());
  }

  if (!authenticated) {
    return (
      <main className="max-w-4xl mx-auto px-5 py-12">
        <h1 className="text-2xl font-bold mb-4">Admin login</h1>
        <form onSubmit={doLogin} className="max-w-md">
          <label className="block mb-2">
            <div className="text-sm mb-1">Email</div>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full p-2 border rounded-sm" required />
          </label>
          <label className="block mb-2">
            <div className="text-sm mb-1">Password</div>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full p-2 border rounded-sm" required />
          </label>
          {error && <div className="text-destructive text-sm mb-2">{error}</div>}
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-sm">Sign in</button>
            <button type="button" onClick={() => { setEmail(""); setPassword(""); }} className="px-4 py-2 border rounded-sm">Clear</button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">Admin credentials are read from VITE_ADMIN_EMAILS and VITE_ADMIN_PASSWORDS. Do not commit secrets.</p>
        </form>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-5 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin dashboard</h1>
        <div className="flex items-center gap-2">
          <button onClick={doLogout} className="px-3 py-1 border rounded-sm">Sign out</button>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Magazines</h2>
        {magazines.length === 0 ? (
          <p className="text-muted-foreground">No magazines uploaded</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {magazines.map((m) => (
              <article key={m.id} className="border border-border rounded-sm p-3 bg-card">
                <div className="mb-2 font-display font-bold text-primary">{m.title}</div>
                <div className="text-xs text-muted-foreground mb-2">{m.fileName} · {Math.round(m.fileSize / 1024)} KB</div>
                <div className="flex gap-2">
                  <a href={m.coverUrl} target="_blank" rel="noreferrer" className="px-3 py-1 border rounded-sm text-sm">Cover</a>
                  <button onClick={() => handleDeleteMagazine(m.id)} className="px-3 py-1 bg-destructive text-white rounded-sm text-sm">Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Members</h2>
        <MembersManager members={members} onRemove={removeMember} onAdd={addMember} />
      </section>
    </main>
  );
}

function MembersManager({ members, onRemove, onAdd }: { members: any[]; onRemove: (email: string) => void; onAdd: (name: string, email: string, pwd: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  return (
    <div>
      <div className="mb-4">
        <form onSubmit={(e) => { e.preventDefault(); onAdd(name, email, pwd); setName(""); setEmail(""); setPwd(""); }} className="flex gap-2 flex-wrap">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="p-2 border rounded-sm" required />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="p-2 border rounded-sm" required />
          <input value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Password" type="password" className="p-2 border rounded-sm" required />
          <button className="px-3 py-2 bg-primary text-primary-foreground rounded-sm">Add member</button>
        </form>
      </div>

      <div className="grid gap-2">
        {members.length === 0 && <div className="text-muted-foreground">No members</div>}
        {members.map((m) => (
          <div key={m.email} className="flex items-center justify-between border border-border rounded-sm p-2">
            <div>
              <div className="font-medium">{m.name}</div>
              <div className="text-xs text-muted-foreground">{m.email}</div>
            </div>
            <div>
              <button onClick={() => onRemove(m.email)} className="px-2 py-1 border rounded-sm text-sm">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
