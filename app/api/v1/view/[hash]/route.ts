import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: Request, { params }: { params: { hash: string } }) {
  const { hash } = await params;

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

  console.log(data.tag_data)

  return Response.json(data.tag_data);
}