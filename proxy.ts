import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({
        request: {
          headers: request.headers,
        },
      })
    
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
            getAll() {
                return request.cookies.getAll()
            },
            setAll(cookies) {
                cookies.forEach(({ name, value, options }) => {
                request.cookies.set({ name, value, ...options })
                })
                response = NextResponse.next({
                    request: { headers: request.headers },
                })
                cookies.forEach(({ name, value, options }) => {
                response.cookies.set({ name, value, ...options })
                })
            },
            },
        }
    );
    
    const { data: { user } } = await supabase.auth.getUser()

    if (request.nextUrl.pathname.startsWith('/backoffice')) {

        if (!user) {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }

        if (user.app_metadata?.role !== 'admin') {
            const url = request.nextUrl.clone();
            url.pathname = '/dashboard';
            return NextResponse.redirect(url);
        }
    }

    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!user) {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
    }

    if (request.nextUrl.pathname.startsWith('/login')) {    
        if (user) {
            const url = request.nextUrl.clone();
            url.pathname = '/dashboard';
            return NextResponse.redirect(url);
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/backoffice/:path*',
        '/dashboard/:path*',
        '/login/:path*',
    ],
};