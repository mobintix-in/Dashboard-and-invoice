
'use client';

import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { useState, useEffect } from "react";
import Link from 'next/link';

export default function CreateInvoicePage() {
    const [formData, setFormData] = useState({
        clientName: '',
        email: '',
        date: new Date().toISOString().split('T')[0],
        itemType: 'Custom',
        quantity: 1,
        unitPrice: 0,
        status: 'Pending'
    });

    const [isLoadingPrice, setIsLoadingPrice] = useState(false);

    // Live price simulation state
    const [livePrices, setLivePrices] = useState({
        Gold: 0,
        Silver: 0,
        Platinum: 0
    });

    // Simulate ticking live prices
    // Fetch live prices
    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const res = await fetch('/api/prices');
                const data = await res.json();
                if (data.items && data.items.length > 0) {
                    const item = data.items[0];
                    setLivePrices(prev => ({
                        ...prev,
                        Gold: item.xauPrice,
                        Silver: item.xagPrice,
                        Platinum: item.xptPrice || 0
                    }));
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

    // Sync form price with live price when asset is selected
    useEffect(() => {
        if (['Gold', 'Silver', 'Platinum'].includes(formData.itemType)) {
            // If checking for the first time, show loading briefly
            if (formData.unitPrice === 0) setIsLoadingPrice(true);

            const timer = setTimeout(() => {
                setFormData(prev => ({
                    ...prev,
                    unitPrice: livePrices[formData.itemType as keyof typeof livePrices]
                }));
                setIsLoadingPrice(false);
            }, 300); // Shorter delay for smoother updates

            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.itemType, livePrices]);

    const calculateTotal = () => {
        return (formData.quantity * formData.unitPrice).toFixed(2);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Invoice created successfully (Simulated)");
        // In a real app, router.push('/invoices');
    };

    return (
        <div className="min-h-screen text-slate-800 font-sans selection:bg-sage/30">
            <Sidebar />
            <Header title="Create Invoice" subtitle="New Transaction" />

            <main className="md:ml-64 pt-24 px-8 pb-12">
                <div className="max-w-3xl mx-auto space-y-8">

                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/invoices" className="p-2 rounded-full hover:bg-sage/10 text-slate-500 hover:text-sage-dark transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900">New Invoice</h1>
                    </div>

                    <div className="bg-white border border-sage/10 rounded-2xl p-8 shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Client Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Client Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage/50 transition-all placeholder:text-slate-400"
                                        placeholder="e.g. Acme Corp"
                                        value={formData.clientName}
                                        onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Client Email</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage/50 transition-all placeholder:text-slate-400"
                                        placeholder="client@company.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Transaction Details */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Item Type</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {['Custom', 'Gold', 'Silver', 'Platinum'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, itemType: type })}
                                            className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all
                        ${formData.itemType === type
                                                    ? 'bg-sage text-white border-sage'
                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-sage/50 hover:bg-sage/5'}`}
                                        >
                                            {type}
                                            {['Gold', 'Silver', 'Platinum'].includes(type) && type === formData.itemType && (
                                                <span className="block text-[10px] opacity-80 font-normal mt-1">Live Price Active</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage/50 transition-all"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Quantity (oz)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage/50 transition-all"
                                        value={formData.quantity}
                                        onChange={e => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 flex justify-between">
                                        Unit Price ($)
                                        {isLoadingPrice && <span className="text-sage text-xs animate-pulse">Fetching live price...</span>}
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        required
                                        readOnly={['Gold', 'Silver', 'Platinum'].includes(formData.itemType)}
                                        className={`w-full border rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage/50 transition-all
                      ${['Gold', 'Silver', 'Platinum'].includes(formData.itemType)
                                                ? 'bg-sage/5 border-sage/20 cursor-not-allowed text-sage-dark font-semibold'
                                                : 'bg-slate-50 border-slate-200'}`}
                                        value={formData.unitPrice}
                                        onChange={e => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            {/* Total Calculation */}
                            <div className="p-6 bg-cream/50 rounded-xl border border-sage/10 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-slate-500">Total Amount</h3>
                                    <p className="text-xs text-slate-400">Calculated based on quantity and unit price</p>
                                </div>
                                <div className="text-3xl font-bold text-sage-dark">
                                    ${calculateTotal()}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Link
                                    href="/invoices"
                                    className="w-full py-3.5 text-center text-slate-600 font-medium hover:text-slate-800 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        try {
                                            // Load jsPDF and AutoTable dynamically
                                            const jsPDF = (await import('jspdf')).default;
                                            const autoTableModule = await import('jspdf-autotable');
                                            const autoTable = autoTableModule.default || autoTableModule;

                                            const doc = new jsPDF();

                                            // Header
                                            doc.setFontSize(22);
                                            doc.setTextColor(137, 152, 109); // Sage
                                            doc.text('ZENITH', 14, 20);

                                            doc.setFontSize(12);
                                            doc.setTextColor(100);
                                            doc.text('Invoice Details', 14, 30);

                                            // Invoice Info
                                            doc.setFontSize(10);
                                            doc.text(`Date: ${formData.date}`, 14, 45);
                                            doc.text(`Status: Pending`, 14, 50);

                                            // Bill To
                                            doc.text('Bill To:', 120, 45);
                                            doc.setFont('helvetica', 'bold');
                                            doc.text(formData.clientName || 'Client Name', 120, 50);
                                            doc.setFont('helvetica', 'normal');
                                            doc.text(formData.email || 'email@example.com', 120, 55);

                                            // Items Table
                                            autoTable(doc, {
                                                startY: 65,
                                                head: [['Description', 'Qty', 'Unit Price', 'Total']],
                                                body: [[
                                                    formData.itemType,
                                                    formData.quantity,
                                                    `$${formData.unitPrice.toFixed(2)}`,
                                                    `$${(formData.quantity * formData.unitPrice).toFixed(2)}`
                                                ]],
                                                headStyles: { fillColor: [137, 152, 109] }, // Sage
                                                theme: 'grid'
                                            });

                                            // Total
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            const finalY = (doc as any).lastAutoTable.finalY + 10;
                                            doc.setFontSize(14);
                                            doc.setTextColor(0);
                                            doc.text(`Total Amount: $${(formData.quantity * formData.unitPrice).toFixed(2)}`, 120, finalY);

                                            doc.save(`new-invoice.pdf`);
                                        } catch (error) {
                                            console.error('Error generating PDF:', error);
                                            alert('Failed to generate PDF. Please try again.');
                                        }
                                    }}
                                    className="w-full bg-white border border-sage/50 text-sage-dark font-semibold py-3.5 rounded-xl hover:bg-sage/5 transition-all"
                                >
                                    Download PDF
                                </button>
                                <button
                                    type="submit"
                                    className="w-full bg-sage hover:bg-sage-dark text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-sage/20 focus:ring-2 focus:ring-sage focus:ring-offset-2 focus:ring-offset-white"
                                >
                                    Create Invoice
                                </button>
                            </div>

                        </form>
                    </div>

                </div>
            </main>
        </div>
    );
}
