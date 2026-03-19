import { createSupabaseServerClient } from "@/lib/database/supabase/server";
import { EmergencyContact } from '@/lib/types/emergency-contact';
import { ConsentLog } from '@/lib/types/consent-log';
import { CURRENT_TERMS_VERSION } from '@/lib/utils/constants';
import { WithLogger } from '../types/global';
import { DatabaseError, NotFoundError } from '../errors/custom-errors';

export interface ActivateTagParams extends WithLogger {
  data: {
    code: string;
    target_type: string;
    full_name: string;
    observations?: string;
    emergency_contacts?: EmergencyContact[];
  }
  user: { id?: string; email?: string } | null;
  metadata: {
    ipAddress?: string;
    userAgent?: string;
  }
}

export const TagService = {
  async activateTagTransaction(params: ActivateTagParams) {
    const {
      logger,
      data: {
        code,
        target_type,
        full_name,
        observations,
        emergency_contacts,
      },
      user,
      metadata: { ipAddress, userAgent }
    } = params;

    const supabase = await createSupabaseServerClient();

    logger.debug({ code }, 'Fetching tag for activation');

    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .select('id')
      .eq('security_code', code)
      .eq('status', 'pending_activation')
      .maybeSingle();

    if (tagError || !tag) {
      logger.error({ err: tagError, code }, 'Invalid or not found tag for activation');
      throw new NotFoundError("Código inválido ou tag já ativada.", "TAG_NOT_FOUND");
    }
    
    logger.info({ tagId: tag.id }, 'Tag found for activation, proceeding with data insertion');

    const { data: newTagData, error: insertError } = await supabase
      .from('tag_data')
      .insert({ tag_id: tag.id, full_name, observations: observations || null })
      .select('id')
      .maybeSingle();

    if (insertError || !newTagData) {
      logger.error({ err: insertError, code }, 'Error inserting tag data');
      throw new DatabaseError("Erro ao salvar os dados principais da tag.", "TAG_DATA_INSERT_ERROR")
    }

    logger.debug({ newTagData }, 'Tag data inserted successfully, processing emergency contacts if provided');

    if (emergency_contacts && emergency_contacts.length > 0) {
      const contactsToInsert = emergency_contacts.map(contact => ({
        tag_data_id: newTagData.id,
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relationship || null,
        is_primary: !!contact.is_primary
      }));

      const { error: contactsError } = await supabase.from('emergency_contacts').insert(contactsToInsert);

      if (contactsError) {
        logger.error({ err: contactsError, code }, 'Error inserting emergency contacts');
        throw new DatabaseError("Erro ao salvar os contatos de emergência.", "CONTACTS_INSERT_ERROR");
      }

      logger.info({ contactsCount: emergency_contacts.length }, 'Emergency contacts inserted successfully');
    }

    logger.debug({ tagId: tag.id, target_type, userEmail: user?.email }, 'Updating tag status to active');

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
      logger.error({ err: activationError, code }, 'Error activating tag');
      throw new DatabaseError("Erro ao ativar a tag.", "TAG_ACTIVATION_ERROR");
    }
    
    logger.info({ tagId: tag.id, userEmail: user?.email }, 'Tag activated successfully, logging consent');

    const consentLog: ConsentLog = {
      tag_id: tag.id,
      owner_id: user?.id || null,
      action: 'accepted',
      term_type: 'lgpd_health_data',
      version: CURRENT_TERMS_VERSION,
      ip_address: ipAddress || 'unknown',
      user_agent: userAgent || 'unknown',
    };

    const { error: consentError } = await supabase.from('consent_logs').insert(consentLog);

    if (consentError) {
      logger.error({ err: consentError, code }, 'Error logging consent');
      throw new DatabaseError("Erro ao registrar consentimento.", "CONSENT_LOG_ERROR");
    }

    logger.info({ data: consentLog }, 'Consent log inserted successfully');

    return activatedTag;
  }
};