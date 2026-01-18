import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function PATCH(request: Request) {
  const { hash, security_code, updatedData } = await request.json();

  const supabase = await createSupabaseServerClient();

  const { data: tag, error } = await supabase
    .from('tags')
    .select('id')
    .eq('hash_url', hash)
    .eq('security_code', security_code)
    .single();

  if (error || !tag) {
    return Response.json({ error: "Acesso negado: Código de ativação incorreto." }, { status: 401 });
  }

  const { error: updateError } = await supabase
    .from('tag_data')
    .update({ 
      ...updatedData
    })
    .eq('tag_id', tag.id);
  
  if (updateError) {
    return Response.json({ error: "Erro ao salvar" }, { status: 500 });
  }

  return Response.json({ success: true });
}