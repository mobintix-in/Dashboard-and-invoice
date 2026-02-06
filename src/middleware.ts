import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Define paths that are public
    const publicPaths = ['/login'];
    const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

    // If user is not signed in and the path is not public, redirect to /login
    if (!user && !isPublicPath) {
        // Exclude static files, API routes, and Next.js internals to prevent loops
        if (
            !request.nextUrl.pathname.startsWith('/_next') &&
            !request.nextUrl.pathname.startsWith('/api') &&
            !request.nextUrl.pathname.startsWith('/static') &&
            request.nextUrl.pathname !== '/favicon.ico'
        ) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // If user is signed in and visits /login, redirect to /prices (dashboard)
    if (user && request.nextUrl.pathname === '/login') {
        return NextResponse.redirect(new URL('/prices', request.url));
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
