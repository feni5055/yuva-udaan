export interface StoredMagazine {
  id: string;
  title: string;
  subtitle: string;
  volume: string;
  year: string;
  theme: string;
  editors: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  publishDate?: string; // e.g. "2025-03-15"
  coverUrl?: string; // base64 data URL of the cover image
}

// ── Member store ───────────────────────────────────────────────────────────

export interface Member {
  name: string;
  email: string;
  password: string;
}

const MEMBERS_KEY = "hc_members";

export function getMembers(): Member[] {
  try { return JSON.parse(localStorage.getItem(MEMBERS_KEY) ?? "[]"); }
  catch { return []; }
}

export function registerMember(m: Member): void {
  const list = getMembers().filter((x) => x.email !== m.email);
  localStorage.setItem(MEMBERS_KEY, JSON.stringify([...list, m]));
}

// Load admin credentials from Vite env variables (comma-separated). Keep demo fallback for local dev only.
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS ?? "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
const ADMIN_PASSWORDS = (import.meta.env.VITE_ADMIN_PASSWORDS ?? "").split(",").map(s => s.trim()).filter(Boolean);

export function isAdminCredential(email: string, password: string): boolean {
  const e = email.toLowerCase().trim();
  // If no admin creds are configured, allow the original demo maintainer creds for local development only.
  if (ADMIN_EMAILS.length === 0 || ADMIN_PASSWORDS.length === 0) {
    const demoEmails = ["fenilmuneer@gmail.com"];
    const demoPasswords = ["vpm@2522"];
    return demoEmails.includes(e) && demoPasswords.includes(password);
  }
  return ADMIN_EMAILS.includes(e) && ADMIN_PASSWORDS.includes(password);
}

export function findMember(email: string, password: string): Member | null {
  if (isAdminCredential(email, password)) {
    return { name: "Fenil Muneer", email: email.trim(), password };
  }
  return getMembers().find(
    (m) => m.email.toLowerCase() === email.toLowerCase().trim() && m.password === password
  ) ?? null;
}

// ── Magazine store ─────────────────────────────────────────────────────────

const KEY = "hc_magazines";

export function getMagazines(): StoredMagazine[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveMagazine(m: StoredMagazine): void {
  const list = getMagazines();
  localStorage.setItem(KEY, JSON.stringify([m, ...list]));
}

export function deleteMagazine(id: string): void {
  const list = getMagazines().filter((m) => m.id !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
}
