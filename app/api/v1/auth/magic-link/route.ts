import { getLogger } from '@/lib/log/logger';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getBaseUrl } from '@/lib/utils/get-url';
import { NextRequest, NextResponse } from 'next/server';

export async function POST (request: NextRequest) {
  const logger = getLogger(request);

  try {
    const { email, token, securityCode, next, action } = await request.json();

    logger.info({ email, token, securityCode, next, action }, 'Received magic link request');
    
    const response = NextResponse.json(
      { message: 'O link de acesso foi enviado com sucesso!' },
      { status: 200 }
    );

    const supabase = await createSupabaseServerClient();
    
    const baseUrl = getBaseUrl();
    const nextPath = next ?? '/dashboard';

    const params = new URLSearchParams();
    params.append('next', nextPath);

    if (securityCode) {
      params.append('security_code', securityCode);
    }
    
    if (action) {
      params.append('action', action);
    }

    const redirectTo = `${baseUrl}/api/v1/auth/callback?${params.toString()}`;

    logger.info({ redirectTo }, 'Constructed redirect URL for magic link');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });    

    if (error) {
      logger.error({ err: error }, 'Error on sending magic link');

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
      logger.info({ email }, 'Magic link sent successfully');
      return response;
    }
  } catch (err) {
    logger.error({ err }, 'Unexpected error on magic link request');
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }

}