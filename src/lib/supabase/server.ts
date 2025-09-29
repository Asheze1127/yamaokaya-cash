import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  // Create a snapshot of the cookies.
  const cookieMap = new Map<string, string>();
  try {
    for (const cookie of cookieStore.getAll()) {
      cookieMap.set(cookie.name, cookie.value);
    }
  } catch (error) {
    // This may fail in some environments, but the `get` method will fall back.
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // First, try to get the cookie from the snapshot.
          if (cookieMap.has(name)) {
            return cookieMap.get(name);
          }
          // If it fails, fall back to the original method, which might still work in some cases.
          try {
            return cookieStore.get(name)?.value;
          } catch (error) {
            return undefined;
          }
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}
