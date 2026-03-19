import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { TagService, ActivateTagParams } from '@/lib/services/tag.service';
import { createSupabaseServerClient } from '@/lib/database/supabase/server';
import { LoggerInstance } from '@/lib/types/global';
import { DatabaseError } from '@/lib/errors/custom-errors';

vi.mock('@/lib/database/supabase/server', () => ({
  createSupabaseServerClient: vi.fn(),
}));

const queryBuilderMock: { 
  select: Mock;
  insert: Mock;
  update: Mock;
  eq: Mock;
  maybeSingle: Mock;
  then: Mock;
} = {
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  maybeSingle: vi.fn(),
  then: vi.fn((resolve) => resolve({ data: null, error: null })), 
};

const mockSupabase = {
  from: vi.fn(() => queryBuilderMock),
};

const mockLogger = {
  info: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
  warn: vi.fn(),
} as unknown as LoggerInstance;

describe('TagService - activateTagTransaction', () => {
  
  beforeEach(() => {
    vi.clearAllMocks(); 
    (createSupabaseServerClient as Mock).mockResolvedValue(mockSupabase);
  });

  const baseParams: ActivateTagParams = {
    data: {
      code: 'CODIGO_SECRETO_123',
      target_type: 'person',
      full_name: 'Cliente Mota',
      observations: 'Alergia a dipirona',
      emergency_contacts: [],
    },
    user: { id: 'user-789', email: 'cliente@ateliemota.com' },
    metadata: {
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
    },
    logger: mockLogger,
  };

  it('Should activate the tag successfully when all data is correct', async () => {
    queryBuilderMock.maybeSingle
      .mockResolvedValueOnce({ data: { id: 'tag-001' }, error: null }) 
      .mockResolvedValueOnce({ data: { id: 'tag-data-001' }, error: null }) 
      .mockResolvedValueOnce({ data: { id: 'tag-001', status: 'active' }, error: null });

    const result = await TagService.activateTagTransaction(baseParams);

    expect(result).toEqual({ id: 'tag-001', status: 'active' });
    expect(mockSupabase.from).toHaveBeenCalledWith('tags');
    expect(mockSupabase.from).toHaveBeenCalledWith('tag_data');
    expect(mockSupabase.from).toHaveBeenCalledWith('consent_logs');
  });
  
  it('Should insert emergency contacts if they are provided', async () => {
    queryBuilderMock.maybeSingle
    .mockResolvedValueOnce({ data: { id: 'tag-001' }, error: null })
    .mockResolvedValueOnce({ data: { id: 'tag-data-001' }, error: null })
    .mockResolvedValueOnce({ data: { id: 'tag-001', status: 'active ' }, error: null });
    
    const paramsComContatos: ActivateTagParams = {
      ...baseParams,
      data: {
        ...baseParams.data,
        emergency_contacts: [{ name: 'Contato 1', phone: '11999999999', is_primary: true }] as ActivateTagParams['data']['emergency_contacts'],
      }
    };
    
    await TagService.activateTagTransaction(paramsComContatos);
    
    expect(mockSupabase.from).toHaveBeenCalledWith('emergency_contacts');
  });
  
  it('Should throw TAG_NOT_FOUND if the tag code is invalid', async () => {
    queryBuilderMock.maybeSingle.mockResolvedValueOnce({ data: null, error: null });
  
    await expect(TagService.activateTagTransaction(baseParams))
      .rejects
      .toMatchObject({ code: "TAG_NOT_FOUND", statusCode: 404 });
    
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it('Should throw TAG_DATA_INSERT_ERROR if it fails to save the tag data', async () => {
    queryBuilderMock.maybeSingle
      .mockResolvedValueOnce({ data: { id: 'tag-001' }, error: null })
      .mockResolvedValueOnce({ data: null, error: new Error('Erro no banco') });

    await expect(TagService.activateTagTransaction(baseParams))
      .rejects
      .toMatchObject({ code: "TAG_DATA_INSERT_ERROR", statusCode: 500 });
      
    expect(mockSupabase.from).toHaveBeenCalledTimes(2); 
  });

  it('Should throw CONTACTS_INSERT_ERROR if it fails to insert emergency contacts', async () => {
    queryBuilderMock.maybeSingle
      .mockResolvedValueOnce({ data: { id: 'tag-001' }, error: null })
      .mockResolvedValueOnce({ data: { id: 'tag-data-001' }, error: null });

    queryBuilderMock.then.mockImplementationOnce((resolve) => 
      resolve({ data: null, error: new Error('Erro ao salvar contato') })
    );

    const paramsComContatos: ActivateTagParams = {
      ...baseParams,
      data: {
        ...baseParams.data,
        emergency_contacts: [{ name: 'Contato 1', phone: '11999999999', is_primary: true }] as ActivateTagParams['data']['emergency_contacts'],
      }
    };

    await expect(TagService.activateTagTransaction(paramsComContatos))
      .rejects
      .toMatchObject({ code: "CONTACTS_INSERT_ERROR", statusCode: 500 });
  });

  it('Should throw TAG_ACTIVATION_ERROR if it fails to update the tag status', async () => {
    queryBuilderMock.maybeSingle
      .mockResolvedValueOnce({ data: { id: 'tag-001' }, error: null })
      .mockResolvedValueOnce({ data: { id: 'tag-data-001' }, error: null })
      .mockResolvedValueOnce({ data: null, error: new Error('Erro no update') });

    await expect(TagService.activateTagTransaction(baseParams))
      .rejects
      .toMatchObject({ code: "TAG_ACTIVATION_ERROR", statusCode: 500 });
  });

  it('Should throw CONSENT_LOG_ERROR if it fails to register the consent log', async () => {
    queryBuilderMock.maybeSingle
      .mockResolvedValueOnce({ data: { id: 'tag-001' }, error: null }) 
      .mockResolvedValueOnce({ data: { id: 'tag-data-001' }, error: null }) 
      .mockResolvedValueOnce({ data: { id: 'tag-001', status: 'active' }, error: null }); 

    queryBuilderMock.then.mockImplementationOnce((resolve) => 
      resolve({ data: null, error: new DatabaseError('Erro de log', 'CONSENT_LOG_ERROR') })
    );

    await expect(TagService.activateTagTransaction(baseParams))
      .rejects
      .toMatchObject({ code: "CONSENT_LOG_ERROR", statusCode: 500 });
  });
});