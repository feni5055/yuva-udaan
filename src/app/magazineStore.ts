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

const ADMIN_EMAILS = ["fenilmuneer@gmail.com", "fenilmuneer@gamil.com"];
const ADMIN_PASSWORDS = ["vpm@2522", "vpm@2552"];

export function isAdminCredential(email: string, password: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase().trim()) && ADMIN_PASSWORDS.includes(password);
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
