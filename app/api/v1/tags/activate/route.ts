import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { code, name, phone, obs } = await request.json();
  
  const supabase = await createSupabaseServerClient();    

  // 1. Verificar se a tag existe e está pendente
  const { data: tag, error } = await supabase
    .from('tags')
    .select('id')
    .eq('activation_code', code)
    .eq('status', 'pending')
    .single();

  if (error || !tag) {
    return Response.json({ error: "Código inválido ou tag já ativada" }, { status: 400 });
  }

  // 2. Inserir os dados e atualizar o status da tag (Transaction)
  const { error: insertError } = await supabase
    .from('tag_data')
    .insert({ tag_id: tag.id, full_name: name, phone: phone, observations: obs });

  if (!insertError) {
    await supabase.from('tags').update({ status: 'active' }).eq('id', tag.id);
  }

  return Response.json({ success: true });
}