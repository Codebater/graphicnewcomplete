import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || '';
const key = process.env.SUPABASE_KEY || '';

// Single server-side client. Used only in server components / API routes —
// the key is never shipped to the browser.
export const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export function supabaseConfigured(): boolean {
  return Boolean(url && key);
}

type ProjectRow = {
  id: string;
  title: string;
  description?: string | null;
  client?: string | null;
  services?: string | null;
  industries?: string | null;
  date?: string | null;
  tags?: string[] | null;
  challenge?: Record<string, unknown> | null;
  solution?: Record<string, unknown> | null;
  featured_image?: string | null;
  featured_video?: string | null;
  gallery_images?: string[] | null;
  is_published?: boolean | null;
  sort_order?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

// Map a DB row (snake_case) to the shape the frontend expects (camelCase + _id),
// so none of the existing components need to change.
export function rowToProject(r: ProjectRow) {
  return {
    _id: r.id,
    id: r.id,
    title: r.title,
    description: r.description ?? '',
    client: r.client ?? '',
    services: r.services ?? '',
    industries: r.industries ?? '',
    date: r.date ?? '',
    tags: r.tags ?? [],
    challenge: r.challenge ?? {},
    solution: r.solution ?? {},
    featuredImage: r.featured_image ?? '',
    featuredVideo: r.featured_video ?? '',
    galleryImages: r.gallery_images ?? [],
    isPublished: !!r.is_published,
    sortOrder: r.sort_order ?? 0,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}
