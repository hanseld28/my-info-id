import { createSupabaseServerClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { waitUntil } from '@vercel/functions';
import { getLogger } from '@/lib/log/logger';

export const runtime = 'edge' 

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  const logger = getLogger(request);

  const { token } = await context.params;
  
  logger.info({ token }, 'Received request to view tag details');

  const safeToken = token.toLowerCase();
  
  const headerList = await headers();

  if (!/^[a-z0-9]{14}$/.test(safeToken)) {
    logger.warn({ token }, 'Invalid token format provided');
    
    return NextResponse.redirect(new URL('/404', request.url));
  }

  const supabase = await createSupabaseServerClient();

  const { data: tag, error } = await supabase
    .from('tags')
    .select('id, hash_url, status')
    .eq('scan_token', safeToken)
    .maybeSingle();

  if (error || !tag) {
    logger.error({ token }, 'Tag not found');
    return NextResponse.redirect(new URL('/404', request.url));
  }

  if (tag.status === 'active') {
    logger.info({ token, tagId: tag.id }, 'Tag is active, preparing to log scan and redirect');

    waitUntil(
      Promise.resolve(
        supabase.from('scan_logs')
          .insert({
            tag_id: tag.id,
            user_agent: headerList.get('user-agent'),
            referer: headerList.get('referer') || 'Direct/NFC',
            ip_address: headerList.get('x-forwarded-for')?.split(',')[0] || 'unknown'
          })
          .then(({ error, data }) => {
            if (error) {
              logger.error({ token }, 'Error occurred while saving log');
              return;
            }
            logger.info({ token, data: JSON.stringify(data) }, 'Scan log saved successfully');
          })
      )
    );
  }

  logger.info({ token, hash: tag.hash_url }, 'Redirecting to tag details page');

  return NextResponse.redirect(new URL(`/${tag.hash_url}`, request.url));
}