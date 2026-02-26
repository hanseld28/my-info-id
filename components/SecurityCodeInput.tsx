'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { StatusType } from '@/lib/types/tag';

interface SecurityCodeInputProps {
  showTitle?: boolean;
  onSuccess: (data: { valid: boolean, code: string, status: StatusType }) => void;
}

export default function SecurityCodeInput({ onSuccess, showTitle = true }: SecurityCodeInputProps) {
  const [codeDigits, setCodeDigits] = useState<string[]>(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleCodeChange = (value: string, index: number) => {
    const val = value.toUpperCase().slice(-1);
    const newCode = [...codeDigits];
    newCode[index] = val;
    setCodeDigits(newCode);
    setError(null);

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (pastedData.length >= 1) {
      const newCode = [...codeDigits];
      for (let i = 0; i < 6; i++) {
        if (pastedData[i]) newCode[i] = pastedData[i];
      }
      setCodeDigits(newCode);
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const verifyCode = useCallback(async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/tags/validate?code=${code}`);
      if (res.ok) {
        const result = await res.json() as {
          success: boolean,
          data: { code: string, status: StatusType },
          message: string
        };

        onSuccess({
          valid: result.success,
          code: result.data.code,
          status: result.data.status
        });
      } else {
        const err = await res.json();
        setError(err.error || "Código inválido ou já utilizado.");
        resetInputs();
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
      resetInputs();
    } finally {
      setLoading(false);
    }
  }, [onSuccess]);

  useEffect(() => {
    const fullCode = codeDigits.join("");
    if (fullCode.length === 6) {
      verifyCode(fullCode);
    }
  }, [codeDigits, verifyCode]);


  const resetInputs = () => {
    setCodeDigits(new Array(6).fill(""));
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-sm mx-auto">
      <div className="text-center mb-8">
        {showTitle && (
          <h1 className="text-2xl font-black text-slate-800 mt-4 mb-2">Validar Tag</h1>
        )}
        <p className="text-slate-500 text-sm leading-relaxed">
          Digite os 6 caracteres do código de segurança presente na embalagem da sua tag física.
        </p>
      </div>

      <div className="relative">
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {codeDigits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              maxLength={1}
              disabled={loading}
              value={digit}
              onChange={(e) => handleCodeChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`w-full h-14 text-center text-xl font-black border-2 rounded-xl outline-none transition-all
                ${error ? 'border-red-200 bg-red-50 text-red-600' : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50'}
                ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}
              `}
            />
          ))}
        </div>

        {loading && (
          <div className="absolute -bottom-10 left-0 right-0 flex justify-center">
            <Loader2 className="animate-spin text-blue-600" size={20} />
          </div>
        )}

        {error && (
          <p className="text-red-500 text-xs font-bold text-center mt-4 animate-shake">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}