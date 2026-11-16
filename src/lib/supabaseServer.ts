import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "@/lib/supabaseConfig";

export async function createSupabaseServerClient() {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error(
      "Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (atau NEXT_PUBLIC_SUPABASE_ANON_KEY) di file .env.local."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(
    config.url,
    config.key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component - safe to ignore when setting cookies.
          }
        },
      },
    }
  );
}