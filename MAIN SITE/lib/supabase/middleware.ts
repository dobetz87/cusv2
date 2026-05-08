import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — DO NOT remove
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname.startsWith("/auth");
  const isAdminRoute = pathname.startsWith("/admin");
  const isUserProtected =
    pathname.startsWith("/home") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/order") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/merchant") ||
    pathname.startsWith("/search") ||
    pathname.startsWith("/order-cepat");

  if (!user && (isUserProtected || isAdminRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
