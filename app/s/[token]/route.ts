import { createSupabaseServerClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { waitUntil } from '@vercel/functions';

export const runtime = 'edge' 

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  const { token } = (await params);
  const headerList = await headers();

  const safeToken = token.toLowerCase();

  if (!/^[a-z0-9]{14}$/.test(safeToken)) {
    return NextResponse.redirect(new URL('/404', request.url));
  }

  const supabase = await createSupabaseServerClient();

  const { data: tag, error } = await supabase
    .from('tags')
    .select('id, hash_url, status')
    .eq('scan_token', safeToken)
    .single();

  if (error || !tag) {
    return NextResponse.redirect(new URL('/404', request.url));
  }

  if (tag.status === 'active')  {
    waitUntil(
      Promise.resolve(
        supabase.from('scan_logs').insert({
          tag_id: tag.id,
          user_agent: headerList.get('user-agent'),
          referer: headerList.get('referer') || 'Direct/NFC',
          ip_address: headerList.get('x-forwarded-for')?.split(',')[0] || 'unknown'
        }).then(({ error }) => {
          if (error) console.error('Erro ao gravar log:', error);
        })
      )
    );
  }

  return NextResponse.redirect(new URL(`/${tag.hash_url}`, request.url));
}