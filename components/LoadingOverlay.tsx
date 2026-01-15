export default function LoadingOverlay({ message = "Processando..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center">
        {/* Spinner animado com Tailwind */}
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-700 font-medium animate-pulse">{message}</p>
      </div>
    </div>
  );
}