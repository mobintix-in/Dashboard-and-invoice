
'use client';

import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import Link from 'next/link';
import { use } from 'react';

// Mock data lookup - in a real app this would be an API call
const getInvoice = (id: string) => {
    const invoices = [
        {
            id: 'INV-001',
            client: 'Acme Corp',
            email: 'billing@acme.com',
            date: 'Oct 24, 2023',
            amount: '$1,200.00',
            status: 'Paid',
            items: [
                { desc: 'Web Development Services', qty: 1, price: 1200.00 }
            ]
        },
        {
            id: 'INV-002',
            client: 'Global Tech',
            email: 'accounts@globaltech.io',
            date: 'Oct 22, 2023',
            amount: '$3,450.50',
            status: 'Pending',
            items: [
                { desc: 'Server Migration', qty: 1, price: 2500.00 },
                { desc: 'Cloud Storage (Yearly)', qty: 1, price: 950.50 }
            ]
        },
        {
            id: 'INV-003',
            client: 'Global Tech',
            email: 'accounts@globaltech.io',
            date: 'Oct 22, 2023',
            amount: '$3,450.50',
            status: 'Pending',
            items: [
                { desc: 'Server Migration', qty: 1, price: 2500.00 },
                { desc: 'Cloud Storage (Yearly)', qty: 1, price: 950.50 }
            ]
        },
        {
            id: 'INV-004',
            client: 'Acme Corp',
            email: 'billing@acme.com',
            date: 'Oct 24, 2023',
            amount: '$1,200.00',
            status: 'Paid',
            items: [
                { desc: 'Web Development Services', qty: 1, price: 1200.00 }
            ]
        },
        {
            id: 'INV-005',
            client: 'Global Tech',
            email: 'accounts@globaltech.io',
            date: 'Oct 22, 2023',
            amount: '$3,450.50',
            status: 'Pending',
            items: [
                { desc: 'Server Migration', qty: 1, price: 2500.00 },
                { desc: 'Cloud Storage (Yearly)', qty: 1, price: 950.50 }
            ]
        },
    ];
    return invoices.find(inv => inv.id === id) || {
        id,
        client: 'Unknown Client',
        email: 'unknown@example.com',
        date: 'Unknown Date',
        amount: '$0.00',
        status: 'Unknown',
        items: []
    };
};

export default function InvoiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const invoice = getInvoice(id);

    return (
        <div className="min-h-screen text-slate-800 font-sans selection:bg-sage/30">
            <Sidebar />
            <Header title="Invoice Details" subtitle={id} />

            <main className="md:ml-64 pt-24 px-8 pb-12">
                <div className="max-w-4xl mx-auto space-y-8">

                    <div className="flex items-center justify-between mb-2">
                        <Link href="/invoices" className="flex items-center text-slate-500 hover:text-sage-dark transition-colors gap-2 group">
                            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Invoices
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
                                        doc.text('ZENITH', 14, 20);

                                        doc.setFontSize(12);
                                        doc.setTextColor(100);
                                        doc.text('Invoice Details', 14, 30);

                                        // Invoice Info
                                        doc.setFontSize(10);
                                        doc.text(`Invoice ID: ${invoice.id}`, 14, 45);
                                        doc.text(`Date: ${invoice.date}`, 14, 50);
                                        doc.text(`Status: ${invoice.status}`, 14, 55);

                                        // Bill To
                                        doc.text('Bill To:', 120, 45);
                                        doc.setFont('helvetica', 'bold');
                                        doc.text(invoice.client, 120, 50);
                                        doc.setFont('helvetica', 'normal');
                                        doc.text(invoice.email, 120, 55);

                                        // Items Table
                                        autoTable(doc, {
                                            startY: 65,
                                            head: [['Description', 'Qty', 'Price', 'Total']],
                                            body: invoice.items.map(item => [
                                                item.desc,
                                                item.qty,
                                                `$${item.price.toFixed(2)}`,
                                                `$${(item.price * item.qty).toFixed(2)}`
                                            ]),
                                            headStyles: { fillColor: [137, 152, 109] }, // Sage
                                            theme: 'grid'
                                        });

                                        // Total
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        const finalY = (doc as any).lastAutoTable.finalY + 10;
                                        doc.setFontSize(14);
                                        doc.setTextColor(0);
                                        doc.text(`Total Amount: ${invoice.amount}`, 120, finalY);

                                        doc.save(`invoice-${invoice.id}.pdf`);
                                    } catch (error) {
                                        console.error('Error generating PDF:', error);
                                        alert('Failed to generate PDF. Please try again.');
                                    }
                                }}
                                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium">
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
                                className="px-4 py-2 bg-sage text-white rounded-lg hover:bg-sage-dark transition-colors font-medium shadow-lg shadow-sage/20 disabled:opacity-70 disabled:cursor-not-allowed">
                                Send Reminder
                            </button>
                        </div>
                    </div>

                    <div className="bg-white border border-sage/10 rounded-2xl p-8 shadow-sm">
                        {/* Header */}
                        <div className="flex justify-between items-start border-b border-sage/10 pb-8 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">Invoice {invoice.id}</h1>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold
                        ${invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                        invoice.status === 'Pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                            'bg-rose-100 text-rose-700 border border-rose-200'}`}>
                                    {invoice.status}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-500 font-medium">Amount Due</p>
                                <p className="text-3xl font-bold text-sage-dark">{invoice.amount}</p>
                            </div>
                        </div>

                        {/* Client Info */}
                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Bill To</h3>
                                <p className="text-lg font-medium text-slate-900">{invoice.client}</p>
                                <p className="text-slate-500">{invoice.email}</p>
                            </div>
                            <div className="text-right">
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Invoice Date</h3>
                                <p className="text-lg font-medium text-slate-900">{invoice.date}</p>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden mb-8">
                            <table className="w-full text-left">
                                <thead className="bg-slate-100 border-b border-slate-200 text-xs uppercase text-slate-500">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Description</th>
                                        <th className="px-6 py-4 font-medium text-center">Qty</th>
                                        <th className="px-6 py-4 font-medium text-right">Price</th>
                                        <th className="px-6 py-4 font-medium text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {invoice.items.map((item, i) => (
                                        <tr key={i}>
                                            <td className="px-6 py-4 text-slate-700">{item.desc}</td>
                                            <td className="px-6 py-4 text-center text-slate-600">{item.qty}</td>
                                            <td className="px-6 py-4 text-right text-slate-600">${item.price.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-right font-semibold text-slate-900">${(item.price * item.qty).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Note */}
                        <div className="text-sm text-slate-500 italic">
                            Note: This is a system generated invoice.
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
