export interface StoredMagazine {
  id: string;
  title: string;
  subtitle: string;
  volume: string;
  year: string;
  /** Category used for browsing the archive. `theme` is retained for older saved issues. */
  category?: string;
  theme?: string;
  editors: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  publishDate?: string; // e.g. "2025-03-15"
  coverUrl?: string; // base64 data URL of the cover image
}

// ── Magazine store ─────────────────────────────────────────────────────────

const KEY = "hc_magazines";

export function getMagazines(): StoredMagazine[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]").map((magazine: StoredMagazine) => ({
      ...magazine,
      category: magazine.category ?? magazine.theme ?? "",
    }));
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
