import { getLogger } from '@/lib/log/logger';
import { createSupabaseServerClient } from '@/lib/database/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const logger = getLogger();
  
  const supabase = await createSupabaseServerClient();

  logger.info('Processing request to list tags for logged-in owner');

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    logger.warn('Unauthorized attempt to list tags without valid session');

    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  logger.info({ userEmail: user.email }, 'Retrieving tags for logged-in owner');

  const { data: tags, error: tagsError } = await supabase
    .from('tags')
    .select(`
      hash_url, 
      status, 
      target_type, 
      security_code,
      tag_data ( full_name )
    `)
    .eq('owner_id', user.id);

  if (tagsError) {
    logger.error({ err: tagsError }, 'Error fetching tags for logged-in owner from database');

    return NextResponse.json({
      error: tagsError.message
    }, { status: 500 });
  }

  logger.info({ count: tags.length, userEmail: user.email }, 'Successfully retrieved tags for logged-in owner from database');

  return NextResponse.json(tags.map(tag => ({
    ...tag,
    tag_data: tag.tag_data[0] || null
  })));
}