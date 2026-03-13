import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Ensure we have an authenticated user ID.
 * Tries session → getUser() → signInAnonymously() as fallback.
 * Temporary workaround until real auth (email/OAuth) is implemented.
 */
export async function ensureUserId(): Promise<string> {
  // 1. Try existing session
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.user?.id) return session.user.id;

  // 2. Try getUser (server-side check)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user?.id) return user.id;

  // 3. Fallback: sign in anonymously
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  if (!data.session?.user?.id) throw new Error("Not authenticated");
  return data.session.user.id;
}
