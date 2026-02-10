'use client';

import { ClientLayout } from "@/components/ClientLayout";
import { useState, useEffect } from 'react';

export default function PricesPage() {
    const [goldPrice, setGoldPrice] = useState(0);
    const [silverPrice, setSilverPrice] = useState(0);
    const [platinumPrice, setPlatinumPrice] = useState(0);
    const [diamondPrice, setDiamondPrice] = useState(0);
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
                    setDiamondPrice(item.diaPrice || 0);
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
        <ClientLayout title="Live Prices" subtitle="Market Monitor">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Status Bar */}
                <div className="flex items-center justify-between bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm">
                    <div className="flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <span className="text-sm text-slate-600 font-medium">Market is Open</span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                        Updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Syncing...'}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Gold Card */}
                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-white/60 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 transform scale-150 rotate-12 origin-top-right">
                            <svg className="w-48 h-48 text-yellow-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-yellow-100/50 rounded-2xl inline-block">
                                    <svg className="w-8 h-8 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <span className="px-3 py-1 bg-emerald-100/50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200/50">+0.45%</span>
                            </div>

                            <h2 className="text-slate-500 font-medium text-sm tracking-wider uppercase mb-1">Gold (XAU)</h2>
                            <div className="text-5xl font-bold text-slate-800 tracking-tight mb-8">
                                ${goldPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200/50">
                                <div>
                                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Bid Price</span>
                                    <span className="text-lg font-mono font-medium text-slate-600">${(goldPrice - 0.5).toFixed(2)}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Ask Price</span>
                                    <span className="text-lg font-mono font-medium text-slate-600">${(goldPrice + 0.5).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Silver Card */}
                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-white/60 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 transform scale-150 rotate-12 origin-top-right">
                            <svg className="w-48 h-48 text-slate-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-slate-100/50 rounded-2xl inline-block">
                                    <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <span className="px-3 py-1 bg-rose-100/50 text-rose-600 text-xs font-bold rounded-full border border-rose-200/50">-0.12%</span>
                            </div>

                            <h2 className="text-slate-500 font-medium text-sm tracking-wider uppercase mb-1">Silver (XAG)</h2>
                            <div className="text-5xl font-bold text-slate-800 tracking-tight mb-8">
                                ${silverPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200/50">
                                <div>
                                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Bid Price</span>
                                    <span className="text-lg font-mono font-medium text-slate-600">${(silverPrice - 0.05).toFixed(2)}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Ask Price</span>
                                    <span className="text-lg font-mono font-medium text-slate-600">${(silverPrice + 0.05).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Platinum Card */}
                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-white/60 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 transform scale-150 rotate-12 origin-top-right">
                            <svg className="w-48 h-48 text-indigo-900" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10zm-10 8c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" /></svg>
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-50/50 rounded-2xl inline-block">
                                    <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                </div>
                                <span className="px-3 py-1 bg-emerald-100/50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200/50">+1.24%</span>
                            </div>

                            <h2 className="text-slate-500 font-medium text-sm tracking-wider uppercase mb-1">Platinum (XPT)</h2>
                            <div className="text-5xl font-bold text-slate-800 tracking-tight mb-8">
                                ${platinumPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200/50">
                                <div>
                                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Bid Price</span>
                                    <span className="text-lg font-mono font-medium text-slate-600">${(platinumPrice - 2.00).toFixed(2)}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Ask Price</span>
                                    <span className="text-lg font-mono font-medium text-slate-600">${(platinumPrice + 2.00).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Diamond Card */}
                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-white/60 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 transform scale-150 rotate-12 origin-top-right">
                            <svg className="w-48 h-48 text-cyan-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 9h15L12 2zm0 13l7.5-6h-15L12 15zm0 7l-7.5-7h15L12 22z" /></svg>
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-cyan-50/50 rounded-2xl inline-block" style={{ backgroundColor: '#ecfeff' }}>
                                    <svg className="w-8 h-8 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                </div>
                                <span className="px-3 py-1 bg-emerald-100/50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200/50">+0.82%</span>
                            </div>

                            <h2 className="text-slate-500 font-medium text-sm tracking-wider uppercase mb-1">Diamond (XDX)</h2>
                            <div className="text-5xl font-bold text-slate-800 tracking-tight mb-8">
                                ${diamondPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200/50">
                                <div>
                                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Bid Price</span>
                                    <span className="text-lg font-mono font-medium text-slate-600">${(diamondPrice - 15.00).toFixed(2)}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Ask Price</span>
                                    <span className="text-lg font-mono font-medium text-slate-600">${(diamondPrice + 15.00).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </ClientLayout>
    );
}
