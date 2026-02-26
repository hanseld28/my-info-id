import { createSupabaseServerClient } from '@/lib/supabase/server';
import { EmergencyContact } from '@/lib/types/emergency-contact';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
  try {
    const { hash, security_code, updatedData } = await request.json();
    const supabase = await createSupabaseServerClient();

    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .select('id')
      .eq('hash_url', hash)
      .eq('security_code', security_code)
      .single();

    if (tagError || !tag) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 401 });
    }

    const { emergency_contacts, ...healthData } = updatedData;

    const { data: tagDataRecord, error: healthError } = await supabase
      .from('tag_data')
      .update({ 
        ...healthData,
        updated_at: new Date().toISOString()
      })
      .eq('tag_id', tag.id)
      .select('id')
      .single();

    if (healthError || !tagDataRecord) throw healthError;

    const tagDataId = tagDataRecord.id;

    const { error: deleteError } = await supabase
      .from('emergency_contacts')
      .delete()
      .eq('tag_data_id', tagDataId);

    if (deleteError) throw deleteError;

    if (emergency_contacts?.length > 0) {
      const contactsToInsert = emergency_contacts.map((contact: EmergencyContact) => ({
        tag_data_id: tagDataId,
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relationship || null,
        is_primary: !!contact.is_primary
      }));

      const { error: insertError } = await supabase
        .from('emergency_contacts')
        .insert(contactsToInsert);

      if (insertError) throw insertError;
    }

    return NextResponse.json({ success: true });

  } catch (err: unknown) {
    console.error('Update Error:', err);
    return NextResponse.json({ error: "Erro ao salvar dados" }, { status: 500 });
  }
}