import { generateHashURL, generateSecurityCode } from '@/lib/utils/generator-utils';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

  try {
    const { quantity } = await req.json();
    
    const { data: existingTags } = await supabase
      .from('tags')
      .select('hash_url, security_code');

    const existingHashes = new Set(existingTags?.map(t => t.hash_url) || []);
    const existingSecCodes = new Set(existingTags?.map(t => t.security_code) || []);

    const newTags = [];
    const usedHashesInThisBatch = new Set();
    const usedSecCodesInThisBatch = new Set();

    while (newTags.length < quantity) {
      const hash = generateHashURL();
      const secCode = generateSecurityCode();

      const isHashUsed = existingHashes.has(hash) || usedHashesInThisBatch.has(hash);
      const isSecCodeUsed = existingSecCodes.has(secCode) || usedSecCodesInThisBatch.has(secCode);

      if (!isHashUsed && !isSecCodeUsed) {
        newTags.push({
          hash_url: hash,
          security_code: secCode,
          status: 'pending'
        });
        
        usedHashesInThisBatch.add(hash);
        usedSecCodesInThisBatch.add(secCode);
      }
    }

    const { data, error } = await supabase
      .from('tags')
      .insert(newTags)
      .select();

    if (error) throw error;

    return Response.json({ 
      success: true, 
      count: data.length,
      tags: data 
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return Response.json({ error: message }, { status: 500 });
  }
}