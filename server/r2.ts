import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

const accountId = requiredEnv("R2_ACCOUNT_ID");
const accessKeyId = requiredEnv("R2_ACCESS_KEY_ID");
const secretAccessKey = requiredEnv("R2_SECRET_ACCESS_KEY");

export const uploadsBucket = requiredEnv("R2_UPLOADS_BUCKET");
export const publicBucket = requiredEnv("R2_PUBLIC_BUCKET");
export const publicBaseUrl = requiredEnv("R2_PUBLIC_URL").replace(/\/+$/, "");

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

function encodedCopySource(bucket: string, key: string): string {
  const encodedKey = key.split("/").map(encodeURIComponent).join("/");
  return `${bucket}/${encodedKey}`;
}

export function isPendingR2Key(value: string | null): value is string {
  return Boolean(value?.startsWith("pending/"));
}

export function publicR2Key(value: string | null): string | null {
  if (!value?.startsWith(`${publicBaseUrl}/`)) return null;
  return decodeURIComponent(value.slice(publicBaseUrl.length + 1));
}

export function publicR2Url(key: string): string {
  return `${publicBaseUrl}/${key.split("/").map(encodeURIComponent).join("/")}`;
}

export async function createUploadUrl(key: string, contentType: string): Promise<string> {
  return getSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: uploadsBucket,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 10 * 60 },
  );
}

export async function createPrivateDownloadUrl(key: string): Promise<string> {
  return getSignedUrl(
    r2,
    new GetObjectCommand({ Bucket: uploadsBucket, Key: key }),
    { expiresIn: 10 * 60 },
  );
}

export async function publishObject(key: string): Promise<void> {
  await r2.send(new CopyObjectCommand({
    Bucket: publicBucket,
    Key: key,
    CopySource: encodedCopySource(uploadsBucket, key),
  }));
}

export async function removePublicObject(key: string): Promise<void> {
  await r2.send(new DeleteObjectCommand({ Bucket: publicBucket, Key: key }));
}

export async function removePendingObject(key: string): Promise<void> {
  await r2.send(new DeleteObjectCommand({ Bucket: uploadsBucket, Key: key }));
}
