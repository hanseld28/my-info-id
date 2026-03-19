import { getLogger } from '@/lib/log/logger';
import { createSupabaseServerClient } from "@/lib/database/supabase/server";
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from "next/server";
import { TagService } from '@/lib/services/tag.service';
import { ActivateTagValidator } from '@/lib/validators/tag.validator';
import { ValidationError } from '@/lib/errors/custom-errors';

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

    try {
      ActivateTagValidator.validateAll({
        code,
        target_type,
        full_name,
        emergency_contacts,
        observations
      });
    } catch (validationError) {
      if (validationError instanceof ValidationError) {
        logger.warn({ err: validationError.message, details: validationError.details }, 'Validation error during tag activation');
        
        return NextResponse.json({
          error: "Dados inválidos",
          details: validationError.details
        }, { status: 400 });
      }

      logger.error({ err: validationError }, 'Unexpected error during validation');
      
      return NextResponse.json({ error: "Erro inesperado durante a validação dos dados." }, { status: 500 });
    }

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

    const activatedTag = await TagService.activateTagTransaction({
      data: {
        code,
        target_type,
        full_name,
        observations,
        emergency_contacts,
      },
      user: user,
      metadata: {
        ipAddress: headerList.get('x-forwarded-for')?.split(',')[0] || 'unknown',
        userAgent: headerList.get('user-agent') || 'unknown',
      },
      logger
    });

    logger.info({ tagId: activatedTag.id }, 'Tag activated successfully');
    return NextResponse.json({ success: true, data: activatedTag });

  } catch (err: unknown) {
    logger.error({ err }, 'Error during tag activation');
 
    if (err instanceof Error) {
      if (err.message === "TAG_NOT_FOUND") {
        return NextResponse.json({ error: "Código inválido ou tag já ativada" }, { status: 400 });
      }
      if (err.message === "TAG_DATA_INSERT_ERROR") {
        return NextResponse.json({ error: "Erro ao processar os dados da tag. Tente novamente." }, { status: 500 });
      }
      if (err.message === "CONTACTS_INSERT_ERROR") {
        return NextResponse.json({ error: "Erro ao processar os contatos de emergência. Tente novamente." }, { status: 500 });
      }
      if (err.message === "TAG_ACTIVATION_ERROR") {
        return NextResponse.json({ error: "Erro ao ativar a tag. Tente novamente." }, { status: 500 });
      }
      if (err.message === "CONSENT_LOG_ERROR") {
        return NextResponse.json({ error: "Erro ao registrar consentimento. Tente novamente." }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      error: "Erro ao processar ativação", 
      details: err instanceof Error ? err.message : "Erro desconhecido" 
    }, { status: 500 });
  }
}