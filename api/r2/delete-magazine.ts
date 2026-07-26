import type { SupabaseClient } from "@supabase/supabase-js";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  isPendingR2Key,
  publicR2Key,
  removePendingObject,
  removePublicObject,
} from "../../server/r2.js";
import { authenticatedSupabase, HttpError, sendApiError } from "../../server/supabaseServer.js";

async function removeStoredFile(
  client: SupabaseClient,
  value: string | null,
  legacyBucket: "magazine-covers" | "magazine-pdfs",
): Promise<void> {
  if (!value) return;

  if (isPendingR2Key(value)) {
    await removePendingObject(value);
    return;
  }

  const publicKey = publicR2Key(value);
  if (publicKey) {
    await Promise.all([
      removePublicObject(publicKey),
      removePendingObject(publicKey),
    ]);
    return;
  }

  if (!/^https?:\/\//i.test(value)) {
    const { error } = await client.storage.from(legacyBucket).remove([value]);
    if (error) throw error;
  }
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed." });
  }

  try {
    const { client, user } = await authenticatedSupabase(request);
    const magazineId = request.body?.magazineId;
    if (typeof magazineId !== "string") throw new HttpError(400, "A magazine ID is required.");

    const [{ data: magazine, error: magazineError }, { data: profile, error: profileError }] = await Promise.all([
      client
        .from("magazines")
        .select("id, title, status, created_by, cover_url, pdf_url")
        .eq("id", magazineId)
        .single(),
      client
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single(),
    ]);

    if (magazineError || !magazine) throw new HttpError(404, "Magazine not found.");
    if (profileError || !profile) throw new HttpError(403, "Your profile could not be verified.");

    const isAdmin = Boolean(profile.is_admin);
    const isOwner = magazine.created_by === user.id;
    if (!isAdmin && !isOwner) throw new HttpError(403, "You can only delete magazines you uploaded.");
    if (!isAdmin && magazine.status !== "draft") {
      throw new HttpError(403, "Magazines already under editorial control can only be deleted by an administrator.");
    }

    await Promise.all([
      removeStoredFile(client, magazine.pdf_url, "magazine-pdfs"),
      removeStoredFile(client, magazine.cover_url, "magazine-covers"),
    ]);

    const { data: deleted, error: deleteError } = await client
      .from("magazines")
      .delete()
      .eq("id", magazine.id)
      .select("id")
      .maybeSingle();
    if (deleteError) throw deleteError;
    if (!deleted) throw new HttpError(403, "This magazine could not be deleted.");

    return response.status(200).json({ ok: true });
  } catch (error) {
    return sendApiError(response, error);
  }
}
