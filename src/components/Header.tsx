import Link from 'next/link';

interface HeaderProps {
    title?: string;
    subtitle?: string;
}

export function Header({ title = 'Dashboard', subtitle = 'Overview' }: HeaderProps) {
    return (
        <header className="h-20 bg-cream/50 backdrop-blur-md fixed top-0 right-0 left-0 md:left-64 z-10 flex items-center justify-between px-8">
            <div className="flex flex-col">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-1">
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
                    <span>Create New Invoice</span>
                </Link>

                <div className="flex items-center gap-3">
                    <button className="p-2.5 rounded-xl hover:bg-white text-slate-400 hover:text-sage-dark transition-all border border-transparent hover:border-sage/10 hover:shadow-sm">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 shadow-sm sm:hidden"></div>
                </div>
            </div>
        </header>
    );
}
