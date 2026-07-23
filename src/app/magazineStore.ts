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
}

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
