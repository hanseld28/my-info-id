import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getLogger } from '@/lib/log/logger';

export async function GET(request: NextRequest) {
  const logger = getLogger(request);
  
  const hash = request.nextUrl.searchParams.get('hash');
  const code = request.nextUrl.searchParams.get('code')?.toUpperCase();

  if (!hash || !code || code.length !== 6) {
    logger.warn({ hash, code }, 'Invalid parameters provided');

    return NextResponse.json(
      { error: 'Dados insuficientes para verificação.' },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();

  logger.info({ hash, code }, 'Verifying tag for edit');

  const { data, error } = await supabase
    .from('tags')
    .select(`
      id,
      target_type, 
      status, 
      tag_data(
        full_name, 
        birth_date, 
        weight_kg, 
        height_cm, 
        blood_type, 
        medications, 
        allergies, 
        health_conditions, 
        quick_instructions,
        observations,
        updated_at,
        emergency_contacts(
          id,
          name,
          phone,
          relationship,
          is_primary
        )
      )
    `)
    .eq('hash_url', hash)
    .eq('security_code', code)
    .maybeSingle();

  if (error || !data) {
    logger.warn({ hash, code }, 'Tag not found or security code mismatch for verification');
    
    return NextResponse.json(
      { error: 'Código de segurança incorreto para esta tag.' },
      { status: 401 }
    );
  }

  if (data.status !== 'active') {
    logger.warn({ hash, code }, 'Tag is not active for editing');
    
    return NextResponse.json(
      { error: 'Esta tag ainda não foi ativada.' },
      { status: 403 }
    );
  }

  logger.info({ tagId: data.id, hash }, 'Tag verified successfully for edit');

  return NextResponse.json({
    success: true,
    data: {
      id: data.id,
      target_type: data.target_type,
      ...data.tag_data[0],
    }
  });
}