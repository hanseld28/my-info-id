import { getLogger } from '@/lib/log/logger';
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ hash: string }> }) {
  const logger = getLogger(req);

  const { hash } = await params;

  const supabase = await createSupabaseServerClient();
  
  logger.info({ hash }, 'Received request to view tag details');

  const { data, error } = await supabase
    .from('tags')
    .select(`
      target_type, 
      status, 
      tag_data(
        full_name, 
        birth_date, 
        weight_kg, 
        height_cm, 
        blood_type, 
        medications, 
        allergies, 
        health_conditions, 
        quick_instructions,
        observations,
        updated_at,
        emergency_contacts(
          id,
          name,
          phone,
          relationship,
          is_primary
        )
      )
    `)
    .eq('hash_url', hash)
    .maybeSingle();

  if (error || !data) {
    logger.error({ hash }, 'Tag not found');

    return Response.json({ error: "Tag não encontrada" }, { status: 404 });
  }

  if (data.status === 'pending_activation') {
    logger.warn({ hash }, 'Tag is pending activation');

    return Response.json({ error: "Tag ainda não foi ativada pelo proprietário" }, { status: 403 });
  } 

  const [tagData] = data.tag_data;
  
  logger.info({ tagData: JSON.stringify(tagData) }, 'Successfully retrieved tag details');

  return NextResponse.json({
      success: true,
      data: {
        ...tagData,
        status: data.status,
        target_type: data.target_type,
        emergency_contacts: tagData.emergency_contacts || []
      }
    });
}