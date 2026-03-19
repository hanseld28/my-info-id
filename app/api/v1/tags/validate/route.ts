import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/database/supabase/server';
import { getLogger } from '@/lib/log/logger';

export async function GET(request: NextRequest) {
  const logger = getLogger(request);

  const code = request.nextUrl.searchParams.get('code')?.toUpperCase();

  if (!code || code.length !== 6) {
    logger.warn({ code }, 'Invalid code provided');
    return NextResponse.json(
      { error: 'Código inválido. Certifique-se de digitar os 6 caracteres.' },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();

  logger.info({ code }, 'Validating tag code');

  const { data: tag, error } = await supabase
    .from('tags')
    .select('id, status, security_code')
    .eq('security_code', code)
    .maybeSingle();

  if (error || !tag) {
    logger.warn({ code }, 'Tag not found for validation');
    return NextResponse.json(
      { error: 'Código de segurança inválido.' },
      { status: 404 }
    );
  }

  logger.info({ code, tagId: tag.id, status: tag.status }, 'Tag code validated successfully');

  return NextResponse.json({ 
    success: true,
    data: {
      code: tag.security_code,
      status: tag.status,
    },
    message: 'Código válido.'
  });
}