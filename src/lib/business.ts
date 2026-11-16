import { supabase } from "@/lib/supabaseClient";

export async function ensureBusinessForUser(
  userId: string,
  businessName: unknown
): Promise<string | null> {
  const { data: business, error: lookupError } = await supabase
    .from("businesses")
    .select("id")
    .eq("created_by", userId)
    .limit(1)
    .maybeSingle();

  if (lookupError) {
    return `Gagal memeriksa data bisnis: ${lookupError.message}`;
  }
  if (business) return null;
  if (typeof businessName !== "string" || !businessName.trim()) return null;

  const { error: insertError } = await supabase.from("businesses").insert({
    created_by: userId,
    name: businessName.trim(),
  });

  return insertError
    ? `Gagal membuat data bisnis: ${insertError.message}`
    : null;
}

export async function getCurrentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function getCurrentBusinessId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("businesses")
    .select("id")
    .eq("created_by", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  return data?.id ?? null;
}