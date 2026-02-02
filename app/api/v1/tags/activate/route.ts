import { createSupabaseServerClient } from "@/lib/supabase/server";
import { EmergencyContact } from '@/lib/types/emergency-contact';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { code, target_type, full_name, emergency_contacts, observations } = await request.json();
    const supabase = await createSupabaseServerClient();

    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .select('id')
      .eq('security_code', code)
      .eq('status', 'pending')
      .single();

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
      .single();

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
        activated_at: new Date().toISOString() 
      })
      .eq('id', tag.id)
      .select()
      .single();

    if (activationError) throw activationError;

    return NextResponse.json({ success: true, data: activatedTag });

  } catch (err: unknown) {
    console.error('Activation Error:', err);
    return NextResponse.json({ 
      error: "Erro ao processar ativação", 
      details: err instanceof Error ? err.message : "Erro desconhecido" 
    }, { status: 500 });
  }
}