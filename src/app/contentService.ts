import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export type PublicationStatus = "draft" | "review" | "published";
export type ContactStatus = "new" | "read" | "resolved";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Author {
  id: string;
  profileId: string | null;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
}

export interface Magazine {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  categoryId: string | null;
  volume: string;
  year: string;
  publicationDate: string | null;
  editors: string;
  status: PublicationStatus;
  coverUrl: string | null;
  pdfPath: string | null;
  createdBy: string;
  createdAt: string;
}

export interface Article {
  id: string;
  magazineId: string | null;
  categoryId: string | null;
  authorId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  language: "hi" | "en" | "bilingual";
  status: PublicationStatus;
  publishedAt: string | null;
  createdAt: string;
}

export interface Comment {
  id: string;
  articleId: string;
  profileId: string;
  body: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Profile {
  id: string;
  fullName: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

interface MagazineRow {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  category_id: string | null;
  volume: string;
  year: string;
  publication_date: string | null;
  editors: string;
  status: PublicationStatus;
  cover_url: string | null;
  pdf_url: string | null;
  created_by: string;
  created_at: string;
}

interface ArticleRow {
  id: string;
  magazine_id: string | null;
  category_id: string | null;
  author_id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  language: "hi" | "en" | "bilingual";
  status: PublicationStatus;
  published_at: string | null;
  created_at: string;
}

function mapMagazine(row: MagazineRow): Magazine {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    category: row.category,
    categoryId: row.category_id,
    volume: row.volume,
    year: row.year,
    publicationDate: row.publication_date,
    editors: row.editors,
    status: row.status,
    coverUrl: row.cover_url,
    pdfPath: row.pdf_url,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}

function mapArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    magazineId: row.magazine_id,
    categoryId: row.category_id,
    authorId: row.author_id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    language: row.language,
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
  };
}

function safeFileName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/-+/g, "-");
}

function objectPath(userId: string, file: File): string {
  return `${userId}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
}

export async function getCurrentProfile(user: User): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, is_admin, created_at")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id,
    fullName: data.full_name,
    isAdmin: data.is_admin,
    createdAt: data.created_at,
  };
}

export async function listCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .order("name");
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
  }));
}

export async function listAuthors(): Promise<Author[]> {
  const { data, error } = await supabase
    .from("authors")
    .select("id, profile_id, display_name, bio, avatar_url")
    .order("display_name");
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    profileId: row.profile_id,
    displayName: row.display_name,
    bio: row.bio,
    avatarUrl: row.avatar_url,
  }));
}

export async function listPublishedMagazines(): Promise<Magazine[]> {
  const { data, error } = await supabase
    .from("magazines")
    .select("*")
    .eq("status", "published")
    .order("publication_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as MagazineRow[]).map(mapMagazine);
}

export async function getMagazine(id: string): Promise<Magazine | null> {
  const { data, error } = await supabase
    .from("magazines")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapMagazine(data as MagazineRow) : null;
}

export async function getMagazinePdfLink(pdfPath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from("magazine-pdfs")
    .createSignedUrl(pdfPath, 600);
  if (error) throw error;
  return data.signedUrl;
}

export interface CreateMagazineInput {
  title: string;
  subtitle: string;
  category: string;
  volume: string;
  year: string;
  publicationDate?: string;
  editors: string;
  pdf: File;
  cover?: File | null;
  userId: string;
}

export async function createMagazineDraft(input: CreateMagazineInput): Promise<Magazine> {
  const pdfPath = objectPath(input.userId, input.pdf);
  const uploadedObjects: Array<{ bucket: string; path: string }> = [];

  const { error: pdfError } = await supabase.storage
    .from("magazine-pdfs")
    .upload(pdfPath, input.pdf, { contentType: "application/pdf", upsert: false });
  if (pdfError) throw pdfError;
  uploadedObjects.push({ bucket: "magazine-pdfs", path: pdfPath });

  let coverUrl: string | null = null;
  if (input.cover) {
    const coverPath = objectPath(input.userId, input.cover);
    const { error: coverError } = await supabase.storage
      .from("magazine-covers")
      .upload(coverPath, input.cover, { contentType: input.cover.type, upsert: false });
    if (coverError) {
      await supabase.storage.from("magazine-pdfs").remove([pdfPath]);
      throw coverError;
    }
    uploadedObjects.push({ bucket: "magazine-covers", path: coverPath });
    coverUrl = supabase.storage.from("magazine-covers").getPublicUrl(coverPath).data.publicUrl;
  }

  const { data: categoryRow } = await supabase
    .from("categories")
    .select("id")
    .eq("name", input.category)
    .maybeSingle();

  const { data, error } = await supabase
    .from("magazines")
    .insert({
      title: input.title.trim(),
      subtitle: input.subtitle.trim(),
      category: input.category,
      category_id: categoryRow?.id ?? null,
      volume: input.volume.trim(),
      year: input.year.trim(),
      publication_date: input.publicationDate || null,
      editors: input.editors.trim(),
      status: "draft",
      cover_url: coverUrl,
      pdf_url: pdfPath,
      created_by: input.userId,
    })
    .select("*")
    .single();

  if (error) {
    await Promise.all(uploadedObjects.map(({ bucket, path }) => supabase.storage.from(bucket).remove([path])));
    throw error;
  }
  return mapMagazine(data as MagazineRow);
}

export async function listPublishedArticles(magazineId?: string): Promise<Article[]> {
  let query = supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });
  if (magazineId) query = query.eq("magazine_id", magazineId);
  const { data, error } = await query;
  if (error) throw error;
  return ((data ?? []) as ArticleRow[]).map(mapArticle);
}

export async function getArticle(id: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapArticle(data as ArticleRow) : null;
}

export async function listComments(articleId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("id, article_id, profile_id, body, is_approved, created_at")
    .eq("article_id", articleId)
    .order("created_at");
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    articleId: row.article_id,
    profileId: row.profile_id,
    body: row.body,
    isApproved: row.is_approved,
    createdAt: row.created_at,
  }));
}

export async function submitComment(articleId: string, profileId: string, body: string): Promise<void> {
  const { error } = await supabase.from("comments").insert({
    article_id: articleId,
    profile_id: profileId,
    body: body.trim(),
    is_approved: false,
  });
  if (error) throw error;
}

export async function submitContactMessage(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  const { error } = await supabase.from("contact_messages").insert({
    name: input.name.trim(),
    email: input.email.trim(),
    subject: input.subject.trim(),
    message: input.message.trim(),
  });
  if (error) throw error;
}

export interface AdminData {
  profiles: Profile[];
  authors: Author[];
  categories: Category[];
  magazines: Magazine[];
  articles: Article[];
  comments: Comment[];
  messages: ContactMessage[];
}

export async function getAdminData(): Promise<AdminData> {
  const [profiles, authors, categories, magazines, articles, comments, messages] = await Promise.all([
    supabase.from("profiles").select("id, full_name, is_admin, created_at").order("created_at", { ascending: false }),
    supabase.from("authors").select("id, profile_id, display_name, bio, avatar_url").order("display_name"),
    supabase.from("categories").select("id, name, slug, description").order("name"),
    supabase.from("magazines").select("*").order("created_at", { ascending: false }),
    supabase.from("articles").select("*").order("created_at", { ascending: false }),
    supabase.from("comments").select("id, article_id, profile_id, body, is_approved, created_at").order("created_at", { ascending: false }),
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
  ]);

  const firstError = [profiles, authors, categories, magazines, articles, comments, messages]
    .find((result) => result.error)?.error;
  if (firstError) throw firstError;

  return {
    profiles: (profiles.data ?? []).map((row) => ({
      id: row.id,
      fullName: row.full_name,
      isAdmin: row.is_admin,
      createdAt: row.created_at,
    })),
    authors: (authors.data ?? []).map((row) => ({
      id: row.id,
      profileId: row.profile_id,
      displayName: row.display_name,
      bio: row.bio,
      avatarUrl: row.avatar_url,
    })),
    categories: (categories.data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
    })),
    magazines: ((magazines.data ?? []) as MagazineRow[]).map(mapMagazine),
    articles: ((articles.data ?? []) as ArticleRow[]).map(mapArticle),
    comments: (comments.data ?? []).map((row) => ({
      id: row.id,
      articleId: row.article_id,
      profileId: row.profile_id,
      body: row.body,
      isApproved: row.is_approved,
      createdAt: row.created_at,
    })),
    messages: (messages.data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      subject: row.subject,
      message: row.message,
      status: row.status as ContactStatus,
      createdAt: row.created_at,
    })),
  };
}

export async function updateMagazineStatus(id: string, status: PublicationStatus): Promise<void> {
  const { error } = await supabase.from("magazines").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw error;
}

export async function updateArticleStatus(id: string, status: PublicationStatus): Promise<void> {
  const { error } = await supabase
    .from("articles")
    .update({ status, published_at: status === "published" ? new Date().toISOString() : null, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function updateCommentApproval(id: string, isApproved: boolean): Promise<void> {
  const { error } = await supabase.from("comments").update({ is_approved: isApproved }).eq("id", id);
  if (error) throw error;
}

export async function updateContactStatus(id: string, status: ContactStatus): Promise<void> {
  const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
  if (error) throw error;
}
