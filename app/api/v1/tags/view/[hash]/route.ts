import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('tags')
    .select('target_type, status, tag_data(full_name, phone, observations, phone_secondary, quick_instructions, blood_type)')
    .eq('hash_url', hash)
    .single();

  if (error || !data) {
    return Response.json({ error: "Tag não encontrada" }, { status: 404 });
  }

  if (data.status === 'pending') {
    return Response.json({ error: "Tag ainda não foi ativada pelo proprietário" }, { status: 403 });
  }

  const [tagData] = data.tag_data;
  
  return NextResponse.json({
      success: true,
      data: {
        ...tagData,
        target_type: data.target_type
      }
    });
}