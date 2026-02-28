import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const WHITELIST_IPS = process.env.WHITELIST_IPS?.split(',').map(ip => ip.trim()) || [];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isProduction = process.env.NODE_ENV === 'production';

    const isPublicAsset = (
        pathname.startsWith('/_next') 
        || pathname.startsWith('/static') 
        || pathname.startsWith('/api')
        || pathname === '/manifest.json'
        || pathname === '/legal'
        || pathname === '/coming-soon'
        || /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf)$/i.test(pathname)
    );

    const clientIp = (
        request.headers.get('cf-connecting-ip')
        || (request.headers.get('x-forwarded-for')?.split(',')[0].trim())
        || '127.0.0.1'
    );

    console.log(`Detected IP (CF): ${request.headers.get('cf-connecting-ip')}`);
    console.log(`Final Detected IP: ${clientIp}`);

    const isIpAuthorized = WHITELIST_IPS.includes(clientIp || '');
    
    if (isProduction && !isIpAuthorized) {
        console.log(`Acesso bloqueado para o IP: ${clientIp}`);
    }

    if (isProduction && !isIpAuthorized) {
        if (!isPublicAsset && pathname !== '/') {
        return NextResponse.redirect(new URL('/coming-soon', request.url));
        }
    }

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
        '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|legal|coming-soon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf|txt|css|js)$).*)',
    ],
};