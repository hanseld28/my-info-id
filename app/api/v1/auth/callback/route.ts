import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const securityCode = searchParams.get('security_code');
  const action = searchParams.get('action');

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

      return NextResponse.redirect(finalUrl);
    }
    
    console.error('Auth callback error:', error.message);
  }

  return NextResponse.redirect(`${origin}/login?error=pkce_verification_failed`);
}