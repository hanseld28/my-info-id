import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getBaseUrl } from '@/lib/utils/get-url';
import { NextRequest, NextResponse } from 'next/server';

export async function POST (request: NextRequest) {
  try {
    const { email, token, securityCode, next, action } = await request.json();

    console.log("Received magic link request for email:", email);
    console.log("Received Turnstile token:", token);
    
    const response = NextResponse.json(
      { message: 'O link de acesso foi enviado com sucesso!' },
      { status: 200 }
    );

    const supabase = await createSupabaseServerClient();
    
    const baseUrl = getBaseUrl();

    const nextPath = next ?? '/dashboard';

    const extraQueryParams = [
      ...(securityCode
        ? [`&security_code=${encodeURIComponent(securityCode)}`]
        : []
      ),
      ...(action
        ? [`action=${encodeURIComponent(action)}`]
        : []
      )
    ].join('&');

    const { error, data } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${baseUrl}/api/v1/auth/callback?next=${encodeURIComponent(nextPath)}${extraQueryParams}`,
      },
    });
    
    console.log(data);

    if (error) {
      console.error('Error on sending magic link:', error);

      if (error.status === 429) {
        return NextResponse.json(
          { error: 'Por questões de segurança, você deve aguardar pelo menos 1 minuto para realizar outro envio por e-mail.' },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    } else {
      return response;
    }
  } catch (err) {
    console.error('Unexpected error on magic link request:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }

}