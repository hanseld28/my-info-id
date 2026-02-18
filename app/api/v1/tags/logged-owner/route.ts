import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

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
    return NextResponse.json({
      error: tagsError.message
    }, { status: 500 });
  }

  return NextResponse.json(tags.map(tag => ({
    ...tag,
    tag_data: tag.tag_data[0] || null
  })));
}