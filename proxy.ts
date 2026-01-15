import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createSupabaseServerClient } from './lib/supabase/server';

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({
        request: {
        headers: request.headers,
        },
    });

    const supabase = await createSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser()

    if (request.nextUrl.pathname.startsWith('/backoffice') && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (request.nextUrl.pathname.startsWith('/login') && user) {
        return NextResponse.redirect(new URL('/backoffice', request.url))
    }

    return response;
}

export const config = {
  matcher: ['/backoffice/panel/:path*'],
};