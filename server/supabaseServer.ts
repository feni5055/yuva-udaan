import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import type { VercelRequest } from "@vercel/node";

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

function bearerToken(request: VercelRequest): string {
  const authorization = request.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) {
    throw new HttpError(401, "Sign in is required.");
  }
  return authorization.slice("Bearer ".length).trim();
}

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function authenticatedSupabase(request: VercelRequest): Promise<{
  client: SupabaseClient;
  user: User;
  token: string;
}> {
  const token = bearerToken(request);
  const client = createClient(
    requiredEnv("VITE_SUPABASE_URL"),
    requiredEnv("VITE_SUPABASE_PUBLISHABLE_KEY"),
    {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );

  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) throw new HttpError(401, "Your session has expired. Please sign in again.");
  return { client, user: data.user, token };
}

export async function adminSupabase(request: VercelRequest): Promise<{
  client: SupabaseClient;
  user: User;
}> {
  const { client, user } = await authenticatedSupabase(request);
  const { data, error } = await client
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (error || !data?.is_admin) throw new HttpError(403, "Administrator access is required.");
  return { client, user };
}

export function sendApiError(response: { status: (code: number) => { json: (body: unknown) => void } }, error: unknown): void {
  const status = error instanceof HttpError ? error.status : 500;
  const message = error instanceof Error ? error.message : "The request failed.";
  response.status(status).json({ error: message });
}
