import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createUploadUrl } from "../../server/r2.js";
import { authenticatedSupabase, HttpError, sendApiError } from "../../server/supabaseServer.js";

const allowedCoverTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function safeFileName(name: string): string {
  return name
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(-140) || "file";
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed." });
  }

  try {
    const { user } = await authenticatedSupabase(request);
    const { fileName, contentType, size, kind } = request.body ?? {};
    if (typeof fileName !== "string" || typeof contentType !== "string" || typeof size !== "number") {
      throw new HttpError(400, "Invalid file details.");
    }

    const isPdf = kind === "pdf" && contentType === "application/pdf" && size > 0 && size <= 50 * 1024 * 1024;
    const isCover = kind === "cover" && allowedCoverTypes.has(contentType) && size > 0 && size <= 10 * 1024 * 1024;
    if (!isPdf && !isCover) {
      throw new HttpError(400, kind === "pdf"
        ? "Choose a PDF smaller than 50 MB."
        : "Choose a JPG, PNG or WEBP image smaller than 10 MB.");
    }

    const key = `pending/${user.id}/${kind}/${crypto.randomUUID()}-${safeFileName(fileName)}`;
    const uploadUrl = await createUploadUrl(key, contentType);
    return response.status(200).json({ key, uploadUrl });
  } catch (error) {
    return sendApiError(response, error);
  }
}
