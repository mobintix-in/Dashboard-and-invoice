
'use client';

import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { useState, useEffect } from 'react';

export default function PricesPage() {
    const [goldPrice, setGoldPrice] = useState(0);
    const [silverPrice, setSilverPrice] = useState(0);
    const [platinumPrice, setPlatinumPrice] = useState(0);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    // Simulate live price updates
    // Fetch live prices
    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const res = await fetch('/api/prices');
                const data = await res.json();
                if (data.items && data.items.length > 0) {
                    const item = data.items[0];
                    setGoldPrice(item.xauPrice);
                    setSilverPrice(item.xagPrice);
                    setPlatinumPrice(item.xptPrice || 0);
                    setLastUpdated(new Date());
                }
            } catch (error) {
                console.error('Failed to fetch prices:', error);
            }
        };

        // Initial fetch
        fetchPrices();

        // Poll every 10 seconds
        const interval = setInterval(fetchPrices, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen text-slate-800 font-sans selection:bg-sage/30">
            <Sidebar />
            <Header title="Live Prices" subtitle="Market Monitor" />

            <main className="md:ml-64 pt-24 px-8 pb-12">
                <div className="max-w-7xl mx-auto space-y-8">

                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-slate-900">Market Overview</h1>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <span className="text-sm text-emerald-600 font-medium tracking-wide uppercase">Live Market</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Gold Card */}
                        <div className="p-8 rounded-3xl bg-white border border-yellow-500/30 relative overflow-hidden group shadow-md hover:shadow-xl transition-all">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <svg className="w-32 h-32 text-yellow-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                            </div>

                            <h2 className="text-yellow-700 font-medium text-lg tracking-wider uppercase mb-2">Gold (XAU/USD)</h2>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-bold text-slate-900">${goldPrice.toFixed(2)}</span>
                                <span className="text-sm font-medium text-emerald-600">+0.45%</span>
                            </div>
                            <div className="mt-8 pt-6 border-t border-yellow-500/10 flex justify-between items-end">
                                <div>
                                    <span className="text-xs text-slate-500 block mb-1">Bid</span>
                                    <span className="text-lg font-mono text-slate-700">{(goldPrice - 0.5).toFixed(2)}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-slate-500 block mb-1">Ask</span>
                                    <span className="text-lg font-mono text-slate-700">{(goldPrice + 0.5).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Silver Card */}
                        <div className="p-8 rounded-3xl bg-white border border-slate-300 relative overflow-hidden group shadow-md hover:shadow-xl transition-all">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <svg className="w-32 h-32 text-slate-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
                            </div>

                            <h2 className="text-slate-500 font-medium text-lg tracking-wider uppercase mb-2">Silver (XAG/USD)</h2>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-bold text-slate-900">${silverPrice.toFixed(2)}</span>
                                <span className="text-sm font-medium text-rose-500">-0.12%</span>
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-end">
                                <div>
                                    <span className="text-xs text-slate-500 block mb-1">Bid</span>
                                    <span className="text-lg font-mono text-slate-700">{(silverPrice - 0.05).toFixed(2)}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-slate-500 block mb-1">Ask</span>
                                    <span className="text-lg font-mono text-slate-700">{(silverPrice + 0.05).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Platinum Card */}
                        <div className="p-8 rounded-3xl bg-white border border-indigo-200 relative overflow-hidden group shadow-md hover:shadow-xl transition-all">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <svg className="w-32 h-32 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10zm-10 8c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" /></svg>
                            </div>

                            <h2 className="text-indigo-600 font-medium text-lg tracking-wider uppercase mb-2">Platinum (XPT/USD)</h2>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-bold text-slate-900">${platinumPrice.toFixed(2)}</span>
                                <span className="text-sm font-medium text-emerald-600">+1.24%</span>
                            </div>
                            <div className="mt-8 pt-6 border-t border-indigo-100 flex justify-between items-end">
                                <div>
                                    <span className="text-xs text-slate-500 block mb-1">Bid</span>
                                    <span className="text-lg font-mono text-slate-700">{(platinumPrice - 2.00).toFixed(2)}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-slate-500 block mb-1">Ask</span>
                                    <span className="text-lg font-mono text-slate-700">{(platinumPrice + 2.00).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center text-xs text-slate-500 mt-4">
                        Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Connecting...'} via WebSocket (Mock)
                    </div>

                </div>
            </main>
        </div>
    );
}
