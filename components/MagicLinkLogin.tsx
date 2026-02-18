"use client";

import { useRef, useState } from "react";
import { Mail, Loader2, AlertCircle } from "lucide-react";
import { Turnstile } from "next-turnstile";

export default function MagicLinkLogin() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [turnstileStatus, setTurnstileStatus] = useState<"required" | "success" | "error" | "expired">("required");
  const [error, setError] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current) {
      return;
    }

    if (turnstileStatus !== "success") {
      setError("Por favor, verifique que você não é um robô.");
      return;
    }

    setLoading(true);

    const formData = new FormData(formRef.current);

    const token = formData.get("cf-turnstile-response");
    console.log("Turnstile token:", token);

    const response = await fetch("/api/v1/auth/magic-link", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, token }),
    });

    const result = await response.json();

    setLoading(false);

    if (response.ok) {
      setSent(true);
    } else {
      setError(result.error || "Erro ao enviar link de acesso.");
    }
    
  };

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
    <form
      onSubmit={handleMagicLink}
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
        disabled={loading || turnstileStatus !== "success"}
        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" /> : "ENVIAR LINK DE ACESSO"}
      </button>
    </form>
  );
}