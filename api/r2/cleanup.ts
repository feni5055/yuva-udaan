import type { VercelRequest, VercelResponse } from "@vercel/node";
import { removePendingObject } from "../../server/r2.js";
import { authenticatedSupabase, HttpError, sendApiError } from "../../server/supabaseServer.js";

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed." });
  }

  try {
    const { user } = await authenticatedSupabase(request);
    const keys: unknown[] = Array.isArray(request.body?.keys) ? request.body.keys : [];
    const prefix = `pending/${user.id}/`;
    if (keys.some((key) => typeof key !== "string" || !key.startsWith(prefix))) {
      throw new HttpError(403, "You can only remove your own pending uploads.");
    }
    await Promise.all((keys.slice(0, 2) as string[]).map((key) => removePendingObject(key)));
    return response.status(200).json({ ok: true });
  } catch (error) {
    return sendApiError(response, error);
  }
}
