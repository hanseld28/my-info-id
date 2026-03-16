import { getLogger } from '@/lib/log/logger';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { EmergencyContact } from '@/lib/types/emergency-contact';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
  const logger = getLogger(request);
  
  try {
    const { hash, security_code, updatedData } = await request.json();

    logger.info({ hash, security_code, updatedData }, 'Received request to update tag data');

    const supabase = await createSupabaseServerClient();

    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .select('id')
      .eq('hash_url', hash)
      .eq('security_code', security_code)
      .maybeSingle();

    if (tagError || !tag) {
      logger.warn({ hash, security_code }, 'Unauthorized attempt to update tag data');
      return NextResponse.json({ error: "Acesso negado." }, { status: 401 });
    }

    logger.info({ tagId: tag.id }, 'Updating tag data for tag');

    const { emergency_contacts, ...healthData } = updatedData;

    const { data: tagDataRecord, error: healthError } = await supabase
      .from('tag_data')
      .update({ 
        ...healthData,
        updated_at: new Date().toISOString()
      })
      .eq('tag_id', tag.id)
      .select('id')
      .maybeSingle();

    if (healthError || !tagDataRecord) {
      logger.error({ err: healthError }, 'Error updating tag data');
      throw healthError;
    }

    const tagDataId = tagDataRecord.id;

    logger.info({ tagDataId }, 'Updating emergency contacts for tag');

    const { error: deleteError } = await supabase
      .from('emergency_contacts')
      .delete()
      .eq('tag_data_id', tagDataId);

    if (deleteError) {
      logger.error({ err: deleteError }, 'Error deleting emergency contacts');
      throw deleteError;
    }

    if (emergency_contacts?.length > 0) {
      const contactsToInsert = emergency_contacts.map((contact: EmergencyContact) => ({
        tag_data_id: tagDataId,
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relationship || null,
        is_primary: !!contact.is_primary
      }));

      logger.debug({ contactsToInsert }, 'Inserting updated emergency contacts for tag');

      const { error: insertError } = await supabase
        .from('emergency_contacts')
        .insert(contactsToInsert);

      if (insertError) {
        logger.error({ err: insertError }, 'Error inserting emergency contacts');
        throw insertError;
      }
    }

    logger.info({ tagId: tag.id }, 'Tag data and emergency contacts updated successfully');

    return NextResponse.json({ success: true });

  } catch (err: unknown) {
    logger.error({ err }, 'Unexpected error occurred');
    return NextResponse.json({ error: "Erro ao salvar dados" }, { status: 500 });
  }
}