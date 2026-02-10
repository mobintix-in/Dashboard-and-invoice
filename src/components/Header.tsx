import Link from 'next/link';

interface HeaderProps {
    title?: string;
    subtitle?: string;
}

interface HeaderProps {
    title?: string;
    subtitle?: string;
    onMenuClick?: () => void;
}

export function Header({ title = 'Dashboard', subtitle = 'Overview', onMenuClick }: HeaderProps) {
    return (
        <header className="h-20 bg-cream/50 backdrop-blur-md fixed top-0 right-0 left-0 md:left-64 z-10 flex items-center justify-between px-8">
            <div className="flex flex-col">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-1">
                    <button
                        onClick={onMenuClick}
                        className="mr-2 p-1.5 -ml-1.5 rounded-lg text-slate-400 hover:text-sage-dark md:hidden transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <span>{title}</span>
                    <span className="text-sage-dark/30">/</span>
                    <span className="text-sage-dark">{subtitle}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
            </div>

            <div className="flex items-center gap-6">
                <Link href="/invoices/create" className="hidden sm:flex items-center gap-2 bg-sage hover:bg-sage-dark text-white px-5 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-sage/20 border border-sage/20">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                </Link>
            </div>
        </header>
    );
}