import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createPrivateDownloadUrl, isPendingR2Key } from "../../server/r2.js";
import { authenticatedSupabase, HttpError, sendApiError } from "../../server/supabaseServer.js";

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed." });
  }

  try {
    const { client } = await authenticatedSupabase(request);
    const magazineId = request.body?.magazineId;
    if (typeof magazineId !== "string") throw new HttpError(400, "A magazine ID is required.");

    const { data, error } = await client
      .from("magazines")
      .select("pdf_url")
      .eq("id", magazineId)
      .single();
    if (error || !data) throw new HttpError(404, "Magazine not found.");
    if (!isPendingR2Key(data.pdf_url)) throw new HttpError(400, "This magazine does not use a private R2 file.");

    const url = await createPrivateDownloadUrl(data.pdf_url);
    return response.status(200).json({ url });
  } catch (error) {
    return sendApiError(response, error);
  }
}
