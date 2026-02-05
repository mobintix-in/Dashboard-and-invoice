
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
        status: 'Pending',
        items: [
            { id: '1', itemType: 'Custom', quantity: 1, unitPrice: 0 }
        ]
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});


    // Live price simulation state
    const [livePrices, setLivePrices] = useState({
        Gold: 0,
        Silver: 0,
        Platinum: 0
    });

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

        fetchPrices();
        const interval = setInterval(fetchPrices, 10000);
        return () => clearInterval(interval);
    }, []);

    // Sync form items with live prices
    useEffect(() => {
        let hasUpdates = false;
        const newItems = formData.items.map(item => {
            if (['Gold', 'Silver', 'Platinum'].includes(item.itemType)) {
                const newPrice = parseFloat(livePrices[item.itemType as keyof typeof livePrices].toFixed(2));
                if (item.unitPrice !== newPrice && newPrice > 0) {
                    hasUpdates = true;
                    return { ...item, unitPrice: newPrice };
                }
            }
            return item;
        });

        if (hasUpdates) {
            // Only update if actual changes to avoid loops, though strict equality check on objects might trigger rerenders, 
            // but checking specific fields prevents infinite loops if values are same.
            setFormData(prev => ({ ...prev, items: newItems }));
        }
    }, [livePrices, formData.items]); // Note: adding formData.items here requires careful handling to avoid infinite loops. 
    // Actually, to avoid infinite loops, we should probably ONLY run this when livePrices change OR when an item type changes to a live type.
    // simpler approach: The updateItem handler handles the "Type chnage -> Set Price" logic. This effect handles "Live Price Change -> Update Price" logic.

    // Let's refine the Effect to ONLY run on livePrices change, or we risking fighting the user?
    // Actually the previous implementation watched variables. 
    // Let's rely on livePrices changes to update existing items.
    // And when user changes type, we pull the CURRENT live price immediately.

    const calculateTotal = () => {
        return formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toFixed(2);
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { id: Date.now().toString(), itemType: 'Custom', quantity: 1, unitPrice: 0 }]
        }));
    };

    const removeItem = (id: string) => {
        if (formData.items.length === 1) return; // Prevent removing last item
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter(item => item.id !== id)
        }));
    };

    const updateItem = (id: string, field: string, value: string | number) => {
        setFormData(prev => {
            const newItems = prev.items.map(item => {
                if (item.id === id) {
                    const updatedItem = { ...item, [field]: value };
                    // If type changed to a live asset, update price immediately
                    if (field === 'itemType' && ['Gold', 'Silver', 'Platinum'].includes(value as string)) {
                        updatedItem.unitPrice = parseFloat(livePrices[value as keyof typeof livePrices].toFixed(2));
                    }
                    return updatedItem;
                }
                return item;
            });
            return { ...prev, items: newItems };
        });

        // Clear errors for this field if exists (simplified)
        if (errors[`${id}_${field}`]) {
            const newErrors = { ...errors };
            delete newErrors[`${id}_${field}`];
            setErrors(newErrors);
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.clientName.trim()) {
            newErrors.clientName = 'Client name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.date) {
            newErrors.date = 'Date is required';
        }

        formData.items.forEach(item => {
            if (item.quantity <= 0) {
                newErrors[`${item.id}_quantity`] = 'Qty > 0';
            }
            if (item.unitPrice < 0) {
                newErrors[`${item.id}_unitPrice`] = 'Price >= 0';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            alert("Invoice created successfully (Simulated)");
        }
    };

    const InputError = ({ message }: { message?: string }) => {
        if (!message) return null;
        return (
            <div className="flex items-center gap-1.5 mt-1.5 text-rose-500 text-xs font-medium animate-in slide-in-from-top-1 fade-in duration-200">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {message}
            </div>
        );
    };

    return (
        <div className="min-h-screen text-slate-800 font-sans selection:bg-sage/30">
            <Sidebar />
            <Header title="Create Invoice" subtitle="New Transaction" />

            <main className="md:ml-64 pt-32 px-8 pb-12">
                <div className="max-w-4xl mx-auto space-y-8">

                    <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2rem] p-8 shadow-xl relative overflow-hidden ring-1 ring-slate-900/5">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-sage/5 rounded-full -translate-y-32 translate-x-32 blur-3xl pointer-events-none"></div>
                        <form onSubmit={handleSubmit} className="space-y-8" noValidate>

                            {/* Client Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Client Name</label>
                                    <input
                                        type="text"
                                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400
                                            ${errors.clientName
                                                ? 'border-rose-300 ring-rose-100 focus:border-rose-500 focus:ring-rose-200'
                                                : 'border-slate-200 focus:ring-sage/50 focus:border-sage/50'}`}
                                        placeholder="e.g. Acme Corp"
                                        value={formData.clientName}
                                        onChange={e => {
                                            setFormData({ ...formData, clientName: e.target.value });
                                            if (errors.clientName) setErrors({ ...errors, clientName: '' });
                                        }}
                                    />
                                    <InputError message={errors.clientName} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Client Email</label>
                                    <input
                                        type="email"
                                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400
                                            ${errors.email
                                                ? 'border-rose-300 ring-rose-100 focus:border-rose-500 focus:ring-rose-200'
                                                : 'border-slate-200 focus:ring-sage/50 focus:border-sage/50'}`}
                                        placeholder="client@company.com"
                                        value={formData.email}
                                        onChange={e => {
                                            setFormData({ ...formData, email: e.target.value });
                                            if (errors.email) setErrors({ ...errors, email: '' });
                                        }}
                                    />
                                    <InputError message={errors.email} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Date</label>
                                <input
                                    type="date"
                                    className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 transition-all
                                        ${errors.date
                                            ? 'border-rose-300 ring-rose-100 focus:border-rose-500 focus:ring-rose-200'
                                            : 'border-slate-200 focus:ring-sage/50 focus:border-sage/50'}`}
                                    value={formData.date}
                                    onChange={e => {
                                        setFormData({ ...formData, date: e.target.value });
                                        if (errors.date) setErrors({ ...errors, date: '' });
                                    }}
                                />
                                <InputError message={errors.date} />
                            </div>

                            {/* Items List */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-slate-700">Items</label>
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="text-xs font-semibold text-sage hover:text-sage-dark transition-colors flex items-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Item
                                    </button>
                                </div>

                                {formData.items.map((item) => (
                                    <div key={item.id} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200 relative group transition-all hover:bg-slate-50 hover:shadow-sm">
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
                                                disabled={formData.items.length === 1}
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                                            {/* Type Selector */}
                                            <div className="md:col-span-6 space-y-2">
                                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Item Type</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {['Custom', 'Gold', 'Silver', 'Platinum'].map((type) => (
                                                        <button
                                                            key={type}
                                                            type="button"
                                                            onClick={() => updateItem(item.id, 'itemType', type)}
                                                            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all
                                                                ${item.itemType === type
                                                                    ? 'bg-sage text-white border-sage'
                                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-sage/50'}`}
                                                        >
                                                            {type}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Quantity */}
                                            <div className="md:col-span-3 space-y-2">
                                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quantity (oz)</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    className={`w-full bg-white border rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all
                                                        ${errors[`${item.id}_quantity`]
                                                            ? 'border-rose-300 ring-rose-100 focus:border-rose-500'
                                                            : 'border-slate-200 focus:ring-sage/50 focus:border-sage/50'}`}
                                                    value={item.quantity}
                                                    onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                                />
                                                <InputError message={errors[`${item.id}_quantity`]} />
                                            </div>

                                            {/* Unit Price */}
                                            <div className="md:col-span-3 space-y-2">
                                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
                                                    Price ($)
                                                    {['Gold', 'Silver', 'Platinum'].includes(item.itemType) && (
                                                        <span className="text-[10px] text-sage font-normal">Live</span>
                                                    )}
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    readOnly={['Gold', 'Silver', 'Platinum'].includes(item.itemType)}
                                                    className={`w-full border rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all
                                                        ${['Gold', 'Silver', 'Platinum'].includes(item.itemType)
                                                            ? 'bg-sage/5 border-sage/20 cursor-default font-semibold text-sage-dark'
                                                            : errors[`${item.id}_unitPrice`]
                                                                ? 'bg-white border-rose-300 ring-rose-100 focus:border-rose-500'
                                                                : 'bg-white border-slate-200 focus:ring-sage/50 focus:border-sage/50'}`}
                                                    value={item.unitPrice}
                                                    onChange={e => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                />
                                                <InputError message={errors[`${item.id}_unitPrice`]} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total Calculation */}
                            <div className="p-6 bg-cream/50 rounded-xl border border-sage/10 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-slate-500">Total Amount</h3>
                                    <p className="text-xs text-slate-400">Sum of all items</p>
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
                                            const jsPDF = (await import('jspdf')).default;
                                            const autoTableModule = await import('jspdf-autotable');
                                            const autoTable = autoTableModule.default || autoTableModule;

                                            const doc = new jsPDF();
                                            const total = calculateTotal();

                                            // -- Header --
                                            // Brand / Logo
                                            doc.setFontSize(26);
                                            doc.setTextColor(137, 152, 109); // Sage
                                            doc.setFont('helvetica', 'bold');
                                            doc.text('ZENITH', 14, 22);

                                            doc.setFontSize(10);
                                            doc.setTextColor(100);
                                            doc.setFont('helvetica', 'normal');
                                            doc.text('Premium Assets & Services', 14, 28);

                                            // Shop Details (Right Aligned)
                                            doc.setFontSize(10);
                                            doc.setTextColor(60);
                                            doc.text('ZENITH Gold & Silver', 196, 20, { align: 'right' });
                                            doc.text('123 Financial District', 196, 25, { align: 'right' });
                                            doc.text('New York, NY 10005', 196, 30, { align: 'right' });
                                            doc.text('support@zenith.com', 196, 35, { align: 'right' });
                                            doc.text('+1 (555) 123-4567', 196, 40, { align: 'right' });

                                            // -- Divider --
                                            doc.setDrawColor(230);
                                            doc.line(14, 45, 196, 45);

                                            // -- Info Section --
                                            const infoTop = 55;

                                            // Left: Invoice Info
                                            doc.setFontSize(10);
                                            doc.setTextColor(137, 152, 109); // Sage color for labels
                                            doc.setFont('helvetica', 'bold');
                                            doc.text('INVOICE DETAILS', 14, infoTop);

                                            doc.setTextColor(80);
                                            doc.setFont('helvetica', 'normal');
                                            doc.text(`Date:`, 14, infoTop + 8);
                                            doc.text(`Status:`, 14, infoTop + 14);

                                            doc.setTextColor(0);
                                            doc.text(`${formData.date}`, 40, infoTop + 8);
                                            doc.text(`Pending`, 40, infoTop + 14);

                                            // Right: Bill To
                                            doc.setTextColor(137, 152, 109);
                                            doc.setFont('helvetica', 'bold');
                                            doc.text('BILL TO', 120, infoTop);

                                            doc.setTextColor(0);
                                            doc.setFont('helvetica', 'bold');
                                            doc.text(formData.clientName || 'Client Name', 120, infoTop + 8);

                                            doc.setFont('helvetica', 'normal');
                                            doc.setTextColor(80);
                                            doc.text(formData.email || 'email@example.com', 120, infoTop + 14);

                                            // -- Table --
                                            autoTable(doc, {
                                                startY: 85,
                                                head: [['Description', 'Qty', 'Unit Price', 'Total']],
                                                body: formData.items.map(item => [
                                                    item.itemType,
                                                    item.quantity,
                                                    `$${item.unitPrice.toFixed(2)}`,
                                                    `$${(item.quantity * item.unitPrice).toFixed(2)}`
                                                ]),
                                                headStyles: {
                                                    fillColor: [137, 152, 109], // Sage
                                                    textColor: 255,
                                                    fontStyle: 'bold',
                                                    halign: 'left'
                                                },
                                                bodyStyles: {
                                                    textColor: 60,
                                                    cellPadding: 4
                                                },
                                                alternateRowStyles: {
                                                    fillColor: [250, 250, 250]
                                                },
                                                theme: 'grid',
                                                columnStyles: {
                                                    0: { cellWidth: 'auto' },
                                                    1: { cellWidth: 20, halign: 'center' },
                                                    2: { cellWidth: 30, halign: 'right' },
                                                    3: { cellWidth: 30, halign: 'right', fontStyle: 'bold' }
                                                }
                                            });

                                            // -- Total --
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            const finalY = (doc as any).lastAutoTable.finalY + 15;

                                            // Line
                                            doc.setDrawColor(137, 152, 109);
                                            doc.setLineWidth(0.5);
                                            doc.line(120, finalY - 5, 196, finalY - 5);

                                            doc.setFontSize(14);
                                            doc.setTextColor(60);
                                            doc.text('Total Amount:', 120, finalY + 5);

                                            doc.setFontSize(18);
                                            doc.setTextColor(137, 152, 109); // Sage
                                            doc.setFont('helvetica', 'bold');
                                            doc.text(`$${total}`, 196, finalY + 5, { align: 'right' });

                                            // Footer
                                            doc.setFontSize(8);
                                            doc.setTextColor(150);
                                            doc.text('Thank you for your business!', 105, 280, { align: 'center' });
                                            doc.text('zenith-app.com', 105, 285, { align: 'center' });

                                            doc.save(`invoice-${formData.clientName.replace(/\s+/g, '-').toLowerCase() || 'new'}.pdf`);
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
