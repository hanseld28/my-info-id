// src/app/api/admin/generate-tags/route.ts
import { createClient } from '@supabase/supabase-js';
import { generateHash, generateActivationCode } from '@/lib/utils/generator-utils';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

  try {
    const { quantity } = await req.json();
    const newTags = [];

    for (let i = 0; i < quantity; i++) {
      newTags.push({
        hash_url: generateHash(),
        activation_code: generateActivationCode(),
        status: 'pending'
      });
    }

    const { data, error } = await supabase
      .from('tags')
      .insert(newTags)
      .select();

    if (error) throw error;
    return Response.json({ success: true, tags: data });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}