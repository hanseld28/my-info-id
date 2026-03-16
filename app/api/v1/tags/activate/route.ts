import { getLogger } from '@/lib/log/logger';
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ConsentLog } from '@/lib/types/consent-log';
import { EmergencyContact } from '@/lib/types/emergency-contact';
import { CURRENT_TERMS_VERSION } from '@/lib/utils/constants';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const logger = getLogger(request);
  
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
      logger.warn('Terms not accepted during tag activation');
      return NextResponse.json({
        error: "Você precisa aceitar os termos para ativar a tag e utilizar nossos serviços."
      }, { status: 400 });
    }

    const headerList = await headers();

    const supabase = await createSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();

    logger.info({
      type: user?.id ? 'authenticated' : 'anonymous',
      userEmail: user?.email
    }, 'Retrieved user for tag activation');

    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .select('id')
      .eq('security_code', code)
      .eq('status', 'pending_activation')
      .maybeSingle();

    if (tagError || !tag) {
      logger.error({ err: tagError, code }, 'Invalid or not found tag for activation');
      return NextResponse.json({ error: "Código inválido ou tag já ativada" }, { status: 400 });
    }

    logger.info({ tagId: tag.id, userEmail: user?.email }, 'Saving tag data');

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
      logger.error({ err: insertError, code, userEmail: user?.email }, 'Error inserting tag data');
      throw new Error("Erro ao salvar os dados da tag");
    }                                   

    logger.debug({
      newTagData,
      emergencyContactsCount: emergency_contacts?.length || 0
    }, 'Tag data saved, processing emergency contacts if any');

    if (emergency_contacts && emergency_contacts.length > 0) {
      logger.info({ contactsCount: emergency_contacts.length }, 'Inserting emergency contacts for tag');

      const contactsToInsert = emergency_contacts.map((contact: EmergencyContact) => ({
        tag_data_id: newTagData.id,
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relationship || null,
        is_primary: !!contact.is_primary
      }));

      logger.debug({ contactsToInsert }, 'Emergency contacts to insert');

      const { error: contactsError } = await supabase
        .from('emergency_contacts')
        .insert(contactsToInsert);

      if (contactsError) {
        logger.error({ err: contactsError, code }, 'Error inserting emergency contacts');
        throw contactsError;
      }
    }

    logger.info({ tagId: tag.id, userEmail: user?.email }, 'Activating tag with valid code');

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
      logger.error({ err: activationError, tagId: tag.id }, 'Error activating tag');
      throw activationError;
    }

    logger.info({ tagId: tag.id }, 'Tag activated successfully, logging consent');

    const consentLog: ConsentLog = {
      tag_id: tag.id,
      owner_id: user?.id || null,
      action: 'accepted',
      term_type: 'lgpd_health_data',
      version: CURRENT_TERMS_VERSION,
      ip_address: headerList.get('x-forwarded-for')?.split(',')[0] || 'unknown',
      user_agent: headerList.get('user-agent'),
    };

    logger.debug({ consentLog }, 'Inserting consent log for activated tag');

    await supabase.from('consent_logs')
      .insert(consentLog);

    logger.info({ tagId: tag.id }, 'Consent log inserted successfully');

    return NextResponse.json({ success: true, data: activatedTag });

  } catch (err: unknown) {
    logger.error({ err }, 'Error during tag activation');
    return NextResponse.json({ 
      error: "Erro ao processar ativação", 
      details: err instanceof Error ? err.message : "Erro desconhecido" 
    }, { status: 500 });
  }
}