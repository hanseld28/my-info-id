import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getBaseUrl } from '@/lib/utils/get-url';
import { NextRequest } from 'next/server';

export async function POST (request: NextRequest) {
  try {
    const { email, token } = await request.json();

    console.log("Received magic link request for email:", email);
    console.log("Received Turnstile token:", token);
    
    const supabase = await createSupabaseServerClient();
    
    const baseUrl = getBaseUrl();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${baseUrl}/api/v1/auth/callback?next=/dashboard`,
      },
    });
    
    if (error) {
      console.error('Error on sending magic link:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    } else {
      return new Response(JSON.stringify({ message: 'O link de acesso foi enviado com sucesso!' }), { status: 200 });
    }
  } catch (err) {
    console.error('Unexpected error on magic link request:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }

}