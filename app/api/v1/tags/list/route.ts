import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter') || 'all';

  const supabase = await createSupabaseServerClient();
  let query = supabase.from('tags').select('*').order('created_at', { ascending: false });

  if (filter === 'pending') query = query.eq('status', 'pending');
  if (filter === 'active') query = query.eq('status', 'active');

  const { data, error } = await query;

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}