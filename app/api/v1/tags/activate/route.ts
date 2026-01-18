import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { code, target_type, name, phone, obs } = await request.json();
  
  const supabase = await createSupabaseServerClient();    

  const { data: tag, error } = await supabase
    .from('tags')
    .select('id')
    .eq('security_code', code)
    .eq('status', 'pending')
    .single();

  if (error || !tag) {
    return Response.json({ error: "Código inválido ou tag já ativada" }, { status: 400 });
  }

  const { error: insertError } = await supabase
    .from('tag_data')
    .insert({
      tag_id: tag.id,
      full_name: name,
      phone: phone,
      observations: obs
    });

  if (insertError) {
    return Response.json({
      error: "Erro ao salvar os dados da tag"
    }, { status: 500 });
  }

  const { data: activatedTag, error: activatedTagError } = await supabase.from('tags')
    .update({ target_type, status: 'active' })
    .eq('id', tag.id)
    .select()
    .single();

  if (activatedTagError) {
    return Response.json({ error: "Erro ao ativar a tag" }, { status: 500 });
  }

  return Response.json({ success: true, data: activatedTag });
}