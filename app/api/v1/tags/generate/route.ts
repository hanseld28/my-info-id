import { generateHashURL, generateScanToken, generateSecurityCode } from '@/lib/utils/generator-utils';
import { createSupabaseServerClient } from '@/lib/database/supabase/server';
import { NextRequest } from 'next/server';
import { getLogger } from '@/lib/log/logger';

export async function POST(req: NextRequest) {
  const logger = getLogger(req);

  try {
    const supabase = await createSupabaseServerClient();
    
    const { quantity } = await req.json();
    
    logger.info({ quantity }, 'Processing tag generation request');
    
    const { data: existingTags } = await supabase
      .from('tags')
      .select('hash_url, security_code, scan_token');

    const existingScanTokens = new Set(existingTags?.map(t => t.scan_token) || []);
    const existingHashes = new Set(existingTags?.map(t => t.hash_url) || []);
    const existingSecCodes = new Set(existingTags?.map(t => t.security_code) || []);

    const newTags = [];
    const usedScanTokensInThisBatch = new Set();
    const usedHashesInThisBatch = new Set();
    const usedSecCodesInThisBatch = new Set();

    while (newTags.length < quantity) {
      const scanToken = generateScanToken();
      const hash = generateHashURL();
      const secCode = generateSecurityCode();

      const isScanTokenUsed = existingScanTokens.has(scanToken) || usedScanTokensInThisBatch.has(scanToken);
      const isHashUsed = existingHashes.has(hash) || usedHashesInThisBatch.has(hash);
      const isSecCodeUsed = existingSecCodes.has(secCode) || usedSecCodesInThisBatch.has(secCode);

      if (!isScanTokenUsed && !isHashUsed && !isSecCodeUsed) {
        newTags.push({
          scan_token: scanToken,
          hash_url: hash,
          security_code: secCode,
          status: 'generated'
        });
        
        logger.debug(
          { scanToken, hash, secCode },
          `Preparing new unique tag identifiers for insertion: ${newTags.length}/${quantity}`
        );

        usedScanTokensInThisBatch.add(scanToken);
        usedHashesInThisBatch.add(hash);
        usedSecCodesInThisBatch.add(secCode);
      }
    }

    logger.info({ count: newTags.length }, 'Generated unique identifiers for new tags, proceeding to insert into database');

    const { data, error } = await supabase
      .from('tags')
      .insert(newTags)
      .select();

    if (error) {
      logger.error({ err: error }, 'Error inserting new tags into database');
      throw error
    };
    
    logger.info({ insertedCount: data.length }, 'Successfully inserted new tags into database');

    return Response.json({ 
      success: true, 
      count: data.length,
      tags: data 
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    
    logger.error({ err: error }, 'Error during tag generation process');

    return Response.json({ error: message }, { status: 500 });
  }
}