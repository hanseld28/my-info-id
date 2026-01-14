import { createSupabaseServerClient } from "@/app/lib/supabase/server";

export async function GET(req: Request, { params }: { params: { hash: string } }) {
  console.log("API View Tag Called", params.hash);
  const { hash } = params;

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('tags')
    .select('status, tag_data(full_name, phone, observations)')
    .eq('hash_url', hash)
    .single();

  if (error || !data) {
    return Response.json({ error: "Tag não encontrada" }, { status: 404 });
  }

  if (data.status === 'pending') {
    return Response.json({ error: "Tag ainda não foi ativada pelo proprietário" }, { status: 403 });
  }

  return Response.json(data.tag_data);
}