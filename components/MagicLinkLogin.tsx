"use client";

import { useCallback, useRef, useState } from "react";
import { Mail, Loader2, AlertCircle } from "lucide-react";
import { Turnstile } from "next-turnstile";
import SecurityCodeModal from './SecurityCodeModal';
import { StatusType } from '@/lib/types/tag';

const StatusTagToActionPathMap: Record<StatusType, string> = {
  generated: '',
  pending_activation: '/activate',
  active: '/dashboard',
  blocked: '/dashboard',
  inactive: '/dashboard',
};

export default function MagicLinkLogin() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [turnstileStatus, setTurnstileStatus] = useState<'none' | 'required' | 'success' | 'error' | 'expired'>('none');
  const [isSecurityCodeModalOpen, setIsSecurityCodeModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationBypass, setValidationBypass] = useState<{ valid: boolean, code?: string, status: StatusType } | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const sendMagicLink = useCallback(async (
    data: {
      email: string,
      token?: string,
      securityCode?: string,
      next?: string,
      action?: string,
    }) => {
    
    const response = await fetch("/api/v1/auth/magic-link", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      setSent(true);
    } else {
      setError(result.error || "Erro ao enviar link de acesso.");
    }
  }, []);

  const handleSendMagicLink = useCallback(async (securityValidation?: { valid: boolean, code?: string, status: StatusType }) => {
    if (!formRef.current) {
      return;
    }

    if (turnstileStatus !== "success") {
      setError("Por favor, verifique que você não é um robô.");
      return;
    }

    setLoading(true);

    const formData = new FormData(formRef.current);

    const token = formData.get("cf-turnstile-response")?.toString();

    try {

      const finalSecuritValidationResult = {
        ...(validationBypass ?? {}),
        ...(securityValidation ?? {})
      } 

      if (finalSecuritValidationResult && finalSecuritValidationResult.valid) {
        sendMagicLink({
          email,
          token,
          securityCode: finalSecuritValidationResult.code,
          ...(finalSecuritValidationResult.status
            ? { next: StatusTagToActionPathMap[finalSecuritValidationResult.status] }
            : {}
          ),
          ...(finalSecuritValidationResult.status === 'active'
            ? { action: 'bind_tag' }
            : {}
          )  
        });
        setLoading(false);
        return;
      }

      const res = await fetch('/api/v1/auth/validate-access', {
        method: 'POST',
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      
      if (res.status === 403 && data.action === 'REQUIRE_SECURITY_CODE') {
        setIsSecurityCodeModalOpen(true);
        setError(data.message);
      }

      if (res.ok && data.action === 'SEND_MAGIC_LINK') {
        sendMagicLink({
          email,
          token,
        });
      } 
    } catch {
      setError("Erro inesperado. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [email, sendMagicLink, turnstileStatus, validationBypass]);
  
  const handleLoginAttempt = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMagicLink();
  }, [handleSendMagicLink]);

  const handleSecurityCodeValidationSuccess = useCallback((securityValidation: { valid: boolean, code: string, status: StatusType }) => {
    setLoading(true);
    setError(null);
    setValidationBypass(securityValidation);
    setIsSecurityCodeModalOpen(false);
    handleSendMagicLink(securityValidation);
  }, [handleSendMagicLink]);

  if (sent) {
    return (
      <div className="text-center p-8 bg-blue-50 rounded-4xl border border-blue-100 animate-in fade-in zoom-in-95">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
          <Mail size={32} />
        </div>
        <h2 className="text-xl font-black text-slate-800">Verifique seu e-mail</h2>
        <p className="text-slate-600 mt-2 text-sm leading-relaxed">
          Enviamos um link de acesso para <strong>{email}</strong>. 
          Clique no link para entrar automaticamente.
        </p>
      </div>
    );
  }

  return (
    <>
      <SecurityCodeModal
        isOpen={isSecurityCodeModalOpen} 
        onClose={() => setIsSecurityCodeModalOpen(false)} 
        onSuccess={handleSecurityCodeValidationSuccess} 
      />
      <form
        onSubmit={handleLoginAttempt}
        ref={formRef}
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">Seu E-mail</label>
          <input
            required
            type="email"
            placeholder="exemplo@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
          />
        </div>
        
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          retry="auto"
          refreshExpired="auto"
          sandbox={process.env.NODE_ENV === "development"}
          onError={() => {
            setTurnstileStatus("error");
            setError("Security check failed. Please try again.");
          }}
          onExpire={() => {
            setTurnstileStatus("expired");
            setError("Security check expired. Please verify again.");
          }}
          onLoad={() => {
            setTurnstileStatus("required");
            setError(null);
          }}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          onVerify={(_token) => {
            setTurnstileStatus("success");
            setError(null);
          }}
        />

        {error && (
          <div
            className="flex items-center gap-2 text-red-500 text-sm mb-2"
            aria-live="polite"
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <button
          disabled={loading || !['none', 'success'].includes(turnstileStatus)}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : "ENVIAR LINK DE ACESSO"}
        </button>
      </form>
    </>
  );
}