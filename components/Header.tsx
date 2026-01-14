import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold tracking-tight text-slate-800">
            Meu Info <span className="text-blue-600">ID</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link 
            href="/activate-tag" 
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-blue-50"
          >
            Ativar Tag
          </Link>
        </nav>
      </div>
    </header>
  );
}