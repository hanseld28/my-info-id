import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ConsentLog } from '@/lib/types/consent-log';
import { EmergencyContact } from '@/lib/types/emergency-contact';
import { CURRENT_TERMS_VERSION } from '@/lib/utils/constants';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      code,
      target_type,
      full_name,
      emergency_contacts,
      observations,
      terms_accepted
    } = await request.json();

    if (!terms_accepted) {
      return NextResponse.json({
        error: "Você precisa aceitar os termos para ativar a tag e utilizar nossos serviços."
      }, { status: 400 });
    }

    const headerList = await headers();

    const supabase = await createSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();

    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .select('id')
      .eq('security_code', code)
      .eq('status', 'pending_activation')
      .maybeSingle();

    if (tagError || !tag) {
      return NextResponse.json({ error: "Código inválido ou tag já ativada" }, { status: 400 });
    }

    const { data: newTagData, error: insertError } = await supabase
      .from('tag_data')
      .insert({
        tag_id: tag.id,
        full_name: full_name,
        observations: observations || null,
      })
      .select('id')
      .maybeSingle();

    if (insertError || !newTagData) {
      console.error('Insert Tag Data Error:', insertError);
      throw new Error("Erro ao salvar os dados da tag");
    }

    if (emergency_contacts && emergency_contacts.length > 0) {
      const contactsToInsert = emergency_contacts.map((contact: EmergencyContact) => ({
        tag_data_id: newTagData.id,
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relationship || null,
        is_primary: !!contact.is_primary
      }));

      const { error: contactsError } = await supabase
        .from('emergency_contacts')
        .insert(contactsToInsert);

      if (contactsError) throw contactsError;
    }

    const { data: activatedTag, error: activationError } = await supabase
      .from('tags')
      .update({ 
        target_type, 
        status: 'active',
        activated_at: new Date().toISOString(),
        owner_id: user?.id || null
      })
      .eq('id', tag.id)
      .select()
      .maybeSingle();

    if (activationError) {
      throw activationError;
    }

    await supabase.from('consent_logs')
      .insert({
        tag_id: tag.id,
        owner_id: user?.id,
        action: 'accepted',
        term_type: 'lgpd_health_data',
        version: CURRENT_TERMS_VERSION,
        ip_address: headerList.get('x-forwarded-for')?.split(',')[0] || 'unknown',
        user_agent: headerList.get('user-agent'),
      } as ConsentLog);

    return NextResponse.json({ success: true, data: activatedTag });

  } catch (err: unknown) {
    console.error('Activation Error:', err);
    return NextResponse.json({ 
      error: "Erro ao processar ativação", 
      details: err instanceof Error ? err.message : "Erro desconhecido" 
    }, { status: 500 });
  }
}