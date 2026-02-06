'use client';

import { ClientLayout } from "@/components/ClientLayout";
import { useState, useEffect, useCallback } from "react";
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

interface Invoice {
    id: string;
    client_name: string;
    email: string;
    date: string;
    status: string;
    total_amount: number;
    created_at: string;
}

export default function InvoicesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const fetchInvoices = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        console.log('DEBUG: Starting fetchInvoices...');

        try {
            const response = await supabase
                .from('invoices')
                .select('*')
                .order('created_at', { ascending: false });

            console.log('DEBUG: Supabase raw response:', response);

            const { data, error: sbError } = response;

            if (sbError) {
                console.error('Supabase Error Details Full:', sbError);
                throw new Error(sbError.message || `Database error: ${sbError.code || 'unknown'}`);
            }
            setInvoices(data || []);
        } catch (err: unknown) {
            console.error('Caught Exception:', err);
            setError((err as Error).message || 'An unexpected error occurred while fetching invoices.');
        } finally {
            setIsLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch = invoice.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            invoice.id.toString().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const deleteInvoice = async (id: string) => {
        if (confirm(`Are you sure you want to delete invoice?`)) {
            try {
                const { error } = await supabase
                    .from('invoices')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                setInvoices(invoices.filter(inv => inv.id !== id));
            } catch (error) {
                console.error('Error deleting invoice:', error);
                alert('Failed to delete invoice');
            }
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <ClientLayout title="Invoices" subtitle="All Invoices">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Action & Filter Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 max-w-2xl">
                        <div className="relative flex-1 group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-slate-400 group-focus-within:text-sage transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search by client or ID..."
                                className="block w-full pl-11 pr-4 py-3 bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all text-sm placeholder:text-slate-400 shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-3 bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all text-sm text-slate-600 shadow-sm cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                    </div>
                    <Link href="/invoices/create" className="bg-sage hover:bg-sage-dark text-white pl-4 pr-6 py-3 rounded-2xl font-semibold transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg shadow-sage/30 group">
                        <div className="bg-white/20 p-1 rounded-lg group-hover:bg-white/30 transition-colors">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        Create Invoice
                    </Link>
                </div>

                {/* Data Table Container */}
                <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2rem] overflow-hidden shadow-xl ring-1 ring-slate-900/5">
                    <div className="overflow-x-auto min-h-[400px]">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50/50 text-xs uppercase font-bold text-slate-400 border-b border-slate-200/60 tracking-widest">
                                <tr>
                                    <th className="px-8 py-6">ID</th>
                                    <th className="px-8 py-6">Client</th>
                                    <th className="px-8 py-6">Date</th>
                                    <th className="px-8 py-6 text-right">Amount</th>
                                    <th className="px-8 py-6 text-center">Status</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/60">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <svg className="animate-spin h-8 w-8 text-sage" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <p className="text-slate-400 font-medium">Loading invoices...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 max-w-md">
                                                    <div className="flex items-center gap-2 text-rose-600 font-semibold mb-1">
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Failed to load data
                                                    </div>
                                                    <p className="text-rose-500 text-sm">{error}</p>
                                                </div>
                                                <button
                                                    onClick={() => fetchInvoices()}
                                                    className="px-6 py-2 bg-sage hover:bg-sage-dark text-white rounded-xl font-semibold transition-all shadow-md"
                                                >
                                                    Try Again
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredInvoices.length > 0 ? (
                                    filteredInvoices.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-white/80 transition-colors group">
                                            <td className="px-8 py-5">
                                                <span className="font-mono font-semibold text-slate-900 bg-slate-100/50 px-2 py-1 rounded-md text-[10px]">#{invoice.id.toString().slice(-6)}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="font-semibold text-slate-900">{invoice.client_name}</div>
                                                <div className="text-[10px] text-slate-400">{invoice.email}</div>
                                            </td>
                                            <td className="px-8 py-5 text-slate-500">{new Date(invoice.date).toLocaleDateString()}</td>
                                            <td className="px-8 py-5 text-right font-bold text-slate-800 tracking-tight">{formatCurrency(invoice.total_amount)}</td>
                                            <td className="px-8 py-5 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider
                                                    ${invoice.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                        invoice.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                            'bg-rose-50 text-rose-700 border-rose-100'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${invoice.status === 'Paid' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : invoice.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`}></span>
                                                    {invoice.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/invoices/${invoice.id}`}
                                                        className="p-2 rounded-xl text-slate-400 hover:text-sage-dark hover:bg-sage/10 transition-all"
                                                        title="View Details"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteInvoice(invoice.id)}
                                                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-2 opacity-40">
                                                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <p className="text-lg font-medium">No results found</p>
                                                <button
                                                    onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
                                                    className="text-sage font-semibold hover:underline"
                                                >
                                                    Clear all filters
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/10 flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                            Showing {filteredInvoices.length} of {invoices.length} Invoices
                        </p>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-600 transition-all disabled:opacity-30" disabled>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => fetchInvoices()}
                                className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-600 transition-all shadow-sm"
                                title="Refresh"
                            >
                                <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </ClientLayout>
    );
}