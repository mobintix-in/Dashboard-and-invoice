'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface ClientLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
}

export function ClientLayout({ children, title, subtitle }: ClientLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen text-slate-800 font-sans selection:bg-sage/30">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Header
                title={title}
                subtitle={subtitle}
                onMenuClick={() => setSidebarOpen(true)}
            />
            <main className="md:ml-64 pt-32 px-4 md:px-8 pb-12 transition-all duration-300">
                {children}
            </main>
        </div>
    );
}
