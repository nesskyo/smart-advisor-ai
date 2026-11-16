export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !url ||
    !key ||
    url === "your-supabase-url" ||
    key.startsWith("your-supabase-")
  ) {
    return null;
  }

  return { url, key };
}
