import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  isPendingR2Key,
  publicR2Key,
  publicR2Url,
  publishObject,
  removePublicObject,
} from "../../server/r2.js";
import { adminSupabase, HttpError, sendApiError } from "../../server/supabaseServer.js";

type PublicationStatus = "draft" | "review" | "published";
const statuses = new Set<PublicationStatus>(["draft", "review", "published"]);

async function publishValue(value: string | null): Promise<string | null> {
  if (!isPendingR2Key(value)) return value;
  await publishObject(value);
  return publicR2Url(value);
}

async function unpublishValue(value: string | null): Promise<string | null> {
  const key = publicR2Key(value);
  if (!key) return value;
  await removePublicObject(key);
  return key;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed." });
  }

  try {
    const { client } = await adminSupabase(request);
    const { magazineId, status } = request.body ?? {};
    if (typeof magazineId !== "string" || !statuses.has(status)) {
      throw new HttpError(400, "A valid magazine and status are required.");
    }

    const { data: magazine, error: readError } = await client
      .from("magazines")
      .select("id, status, cover_url, pdf_url")
      .eq("id", magazineId)
      .single();
    if (readError || !magazine) throw new HttpError(404, "Magazine not found.");

    let coverUrl = magazine.cover_url;
    let pdfUrl = magazine.pdf_url;
    if (status === "published") {
      [coverUrl, pdfUrl] = await Promise.all([
        publishValue(coverUrl),
        publishValue(pdfUrl),
      ]);
    } else if (magazine.status === "published") {
      [coverUrl, pdfUrl] = await Promise.all([
        unpublishValue(coverUrl),
        unpublishValue(pdfUrl),
      ]);
    }

    const { error: updateError } = await client
      .from("magazines")
      .update({
        status,
        cover_url: coverUrl,
        pdf_url: pdfUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", magazineId);
    if (updateError) throw updateError;

    return response.status(200).json({ ok: true });
  } catch (error) {
    return sendApiError(response, error);
  }
}
