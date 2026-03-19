import { getLogger } from '@/lib/log/logger';
import { createSupabaseServerClient } from "@/lib/database/supabase/server";
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const logger = getLogger(request);
  
  logger.info('Processing request to list tags'); 

  const filter = request.nextUrl.searchParams.get('filter') || 'all';

  logger.debug({ filter }, 'Received filter parameter for listing tags');

  const supabase = await createSupabaseServerClient();

  let query = supabase.from('tags')
    .select('*')
    .order('created_at', { ascending: false });

  if (filter === 'pending_activation') {
    query = query.eq('status', 'pending_activation');
  }

  if (filter === 'active') {
    query = query.eq('status', 'active');
  }

  const { data, error } = await query;

  if (error) {
    logger.error({ err: error }, 'Error fetching tags from database');
    return Response.json({ error: error.message }, { status: 500 });
  }

  logger.info({ count: data.length }, 'Successfully retrieved tags from database');

  return Response.json(data);
}