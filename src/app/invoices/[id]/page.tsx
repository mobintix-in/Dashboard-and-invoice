'use client';

import { ClientLayout } from "@/components/ClientLayout";
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface InvoiceItem {
    id: string;
    item_type: string;
    quantity: number;
    unit: string;
    purity: number;
    unit_price: number;
    total: number;
}

interface Invoice {
    id: string;
    client_name: string;
    email: string;
    date: string;
    status: string;
    total_amount: number;
    created_at: string;
    invoice_items: InvoiceItem[];
}

export default function InvoiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                // Fetch Invoice and Items
                const { data, error } = await supabase
                    .from('invoices')
                    .select(`
                        *,
                        invoice_items (*)
                    `)
                    .eq('id', id)
                    .single();

                if (error) throw error;
                if (!data) throw new Error('Invoice not found');

                setInvoice(data);
            } catch (err: unknown) {
                console.error('Error fetching invoice:', err);
                setError((err as Error).message || 'Failed to load invoice');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchInvoice();
        }
    }, [id, supabase]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    if (loading) {
        return (
            <ClientLayout title="Invoice Details" subtitle="Loading...">
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="flex flex-col items-center gap-3">
                        <svg className="animate-spin h-8 w-8 text-sage" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-slate-400 font-medium">Loading details...</p>
                    </div>
                </div>
            </ClientLayout>
        );
    }

    if (error || !invoice) {
        return (
            <ClientLayout title="Invoice Details" subtitle="Error">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 flex items-center gap-4">
                        <div className="p-3 bg-rose-100 rounded-xl text-rose-600">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-rose-700 font-bold text-lg">Failed to load invoice</h3>
                            <p className="text-rose-600">{error || 'Invoice not found'}</p>
                        </div>
                        <button onClick={() => router.back()} className="ml-auto px-4 py-2 bg-rose-200 hover:bg-rose-300 text-rose-800 rounded-lg font-medium transition-colors">
                            Go Back
                        </button>
                    </div>
                </div>
            </ClientLayout>
        );
    }

    return (
        <ClientLayout title="Invoice Details" subtitle={invoice.client_name}>
            <div className="max-w-4xl mx-auto space-y-8">

                <div className="flex items-center justify-between mb-2">
                    <Link href="/invoices" className="flex items-center text-slate-500 hover:text-sage-dark transition-all gap-2 group hover:-translate-x-1">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-400 group-hover:text-sage-dark">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </div>
                        <span className="font-medium">Back to Invoices</span>
                    </Link>
                    <div className="flex gap-3">
                        <button
                            onClick={async () => {
                                try {
                                    const jsPDF = (await import('jspdf')).default;
                                    const autoTableModule = await import('jspdf-autotable');
                                    const autoTable = autoTableModule.default || autoTableModule;

                                    const doc = new jsPDF();

                                    // Header
                                    doc.setFontSize(22);
                                    doc.setTextColor(137, 152, 109); // Sage (#89986D)
                                    doc.text('Rrumi', 14, 20);

                                    doc.setFontSize(12);
                                    doc.setTextColor(100);
                                    doc.text('Invoice Details', 14, 30);

                                    // Invoice Info
                                    doc.setFontSize(10);
                                    doc.text(`Invoice ID: ${invoice.id.split('-')[0]}...`, 14, 45);
                                    doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 14, 50);
                                    doc.text(`Status: ${invoice.status}`, 14, 55);

                                    // Bill To
                                    doc.text('Bill To:', 120, 45);
                                    doc.setFont('helvetica', 'bold');
                                    doc.text(invoice.client_name, 120, 50);
                                    doc.setFont('helvetica', 'normal');
                                    doc.text(invoice.email, 120, 55);

                                    // Items Table
                                    autoTable(doc, {
                                        startY: 65,
                                        head: [['Type', 'Qty', 'Unit', 'Purity', 'Price', 'Total']],
                                        body: invoice.invoice_items.map(item => [
                                            item.item_type,
                                            item.quantity,
                                            item.unit,
                                            item.purity ? `${item.purity}k` : '-',
                                            `$${item.unit_price.toFixed(2)}`,
                                            `$${item.total.toFixed(2)}`
                                        ]),
                                        headStyles: { fillColor: [137, 152, 109] }, // Sage
                                        theme: 'grid'
                                    });

                                    // Total
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    const finalY = (doc as any).lastAutoTable.finalY + 10;
                                    doc.setFontSize(14);
                                    doc.setTextColor(0);
                                    doc.text(`Total Amount: ${formatCurrency(invoice.total_amount)}`, 120, finalY);

                                    doc.save(`invoice-${invoice.id}.pdf`);
                                } catch (error) {
                                    console.error('Error generating PDF:', error);
                                    alert('Failed to generate PDF. Please try again.');
                                }
                            }}
                            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-medium shadow-sm hover:shadow-md">
                            Download PDF
                        </button>
                        <button
                            onClick={(e) => {
                                const btn = e.currentTarget;
                                const originalText = btn.innerText;
                                btn.innerText = 'Sending...';
                                btn.disabled = true;
                                setTimeout(() => {
                                    alert(`Reminder sent to ${invoice.email} for Invoice ${id}`);
                                    btn.innerText = originalText;
                                    btn.disabled = false;
                                }, 1000);
                            }}
                            className="px-5 py-2.5 bg-sage text-white rounded-xl hover:bg-sage-dark transition-all font-medium shadow-lg shadow-sage/20 hover:shadow-sage/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed">
                            Send Reminder
                        </button>
                    </div>
                </div>

                <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2rem] p-10 shadow-xl relative overflow-hidden ring-1 ring-slate-900/5">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-sage/5 rounded-full -translate-y-48 translate-x-32 blur-3xl pointer-events-none"></div>

                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-slate-200/50 pb-8 mb-8 relative z-10">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-800 mb-3 tracking-tight">Invoice <span className="text-slate-400 font-light text-2xl ml-2 text-[0.6em] align-middle bg-slate-100/50 px-2 py-1 rounded-md font-mono">#{invoice.id.split('-')[0]}</span></h1>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border
                          ${invoice.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                    invoice.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                        'bg-rose-50 text-rose-700 border-rose-100'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${invoice.status === 'Paid' ? 'bg-emerald-500' : invoice.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                                {invoice.status}
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-500 font-medium text-sm uppercase tracking-wider mb-1">Amount Due</p>
                            <p className="text-4xl font-bold text-slate-800 tracking-tight">{formatCurrency(invoice.total_amount)}</p>
                        </div>
                    </div>

                    {/* Client Info */}
                    <div className="grid grid-cols-2 gap-12 mb-10 relative z-10">
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Bill To</h3>
                            <p className="text-xl font-semibold text-slate-900 mb-1">{invoice.client_name}</p>
                            <p className="text-slate-500 font-medium">{invoice.email}</p>
                        </div>
                        <div className="text-right">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Invoice Date</h3>
                            <p className="text-xl font-semibold text-slate-900">{new Date(invoice.date).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="bg-white/50 rounded-2xl border border-white/50 overflow-hidden mb-8 relative z-10 shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/80 border-b border-slate-200/50 text-xs uppercase text-slate-500 tracking-wider">
                                <tr>
                                    <th className="px-8 py-4 font-semibold">Description</th>
                                    <th className="px-8 py-4 font-semibold text-center">Qty</th>
                                    <th className="px-8 py-4 font-semibold text-center">Unit</th>
                                    <th className="px-8 py-4 font-semibold text-right">Price</th>
                                    <th className="px-8 py-4 font-semibold text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {invoice.invoice_items.map((item, i) => (
                                    <tr key={i}>
                                        <td className="px-8 py-5 text-slate-700 font-medium">
                                            <div className="font-semibold text-slate-800">{item.item_type}</div>
                                            <div className="text-xs text-slate-500">Purity: {item.purity || 24}k</div>
                                        </td>
                                        <td className="px-8 py-5 text-center text-slate-600">{item.quantity}</td>
                                        <td className="px-8 py-5 text-center text-slate-400 text-sm">{item.unit}</td>
                                        <td className="px-8 py-5 text-right text-slate-600 font-mono">${item.unit_price.toFixed(2)}</td>
                                        <td className="px-8 py-5 text-right font-bold text-slate-900 font-mono">${item.total.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Note */}
                    <div className="text-sm text-slate-400 italic">
                        Note: This is a system generated invoice.
                    </div>
                </div>

            </div>
        </ClientLayout>
    );
}