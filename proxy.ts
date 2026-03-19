import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createSupabaseServerClient } from './lib/database/supabase/server';
import { getLogger } from './lib/log/logger';
import { headers } from 'next/headers';

export async function proxy(request: NextRequest) {
    const logger = getLogger(request);

    const traceId = request.headers.get('x-trace-id') || crypto.randomUUID()

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-trace-id', traceId);
    
    const response = NextResponse.next({
        request: {
           headers: requestHeaders,
        },
    });

    response.headers.set('x-trace-id', traceId);

    const supabase = await createSupabaseServerClient(); 
    
    const { data: { user } } = await supabase.auth.getUser()

    const requestSummary = {
        method: request.method,
        url: request.nextUrl
    };

    if (request.nextUrl.pathname.startsWith('/backoffice')) {
        logger.info({ action: 'proxy_interceptor', request: requestSummary }, 'Request summary');
        logger.info({ action: 'proxy_interceptor' }, 'Verifying user role to access backoffice');

        if (!user) {
            logger.info({ action: 'proxy_interceptor' }, 'User not authenticated');
            
            const url = request.nextUrl.clone();
            url.pathname = '/login';

            logger.info({ action: 'proxy_interceptor' }, 'Redirecting to /login');
            
            return NextResponse.redirect(url);
        }

        if (user.app_metadata?.role !== 'admin') {
            logger.info({ action: 'proxy_interceptor' }, 'User not allowed to access backoffice');
            
            const url = request.nextUrl.clone();
            url.pathname = '/dashboard';
            
            logger.info({ action: 'proxy_interceptor' }, 'Redirecting to /dashboard');

            return NextResponse.redirect(url);
        }
    }

    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        logger.info({ action: 'proxy_interceptor', requestSummary }, 'Request summary');

        if (!user) {
            logger.info({ action: 'proxy_interceptor' }, 'User not authenticated to access /dashboard');

            const url = request.nextUrl.clone();
            url.pathname = '/login';

            logger.info({ action: 'proxy_interceptor' }, 'Redirecting to /login');

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
        '/((?!_next/static|_next/image|favicon.ico).*)'
    ],
};