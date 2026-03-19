import { getLogger } from '@/lib/log/logger';
import { createSupabaseServerClient } from '@/lib/database/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const logger = getLogger(request);

  const { searchParams, origin } = new URL(request.url);
  
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const securityCode = searchParams.get('security_code');
  const action = searchParams.get('action');

  logger.info({ code, next, securityCode, action }, 'Received auth callback request');

  if (code) {
    const supabase = await createSupabaseServerClient();
    
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const queryParams = [
        ...(securityCode
          ? [`code=${encodeURIComponent(securityCode)}`]
          : []
        ),
        ...(action
          ? [`action=${encodeURIComponent(action)}`]
          : []
        )
      ];

      const finalUrl = queryParams.length > 0
        ? `${origin}${next}?${queryParams.join('&')}`
        : `${origin}${next}`;

      logger.info({ finalUrl }, 'Auth callback successful, redirecting user');

      return NextResponse.redirect(finalUrl);
    }
    
    logger.error({ err: error }, 'Auth callback error');
  }

  logger.error('PKCE verification failed during auth callback');

  return NextResponse.redirect(`${origin}/login?error=pkce_verification_failed`);
}