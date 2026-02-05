
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import Link from 'next/link';

export default function InvoicesPage() {
    const invoices = [
        { id: 'INV-001', client: 'Acme Corp', date: 'Oct 24, 2023', amount: '$1,200.00', status: 'Paid' },
        { id: 'INV-002', client: 'Global Tech', date: 'Oct 22, 2023', amount: '$3,450.50', status: 'Pending' },
        { id: 'INV-003', client: 'Stark Industries', date: 'Oct 20, 2023', amount: '$8,000.00', status: 'Overdue' },
        { id: 'INV-004', client: 'Wayne Ent', date: 'Oct 18, 2023', amount: '$2,100.00', status: 'Paid' },
        { id: 'INV-005', client: 'Cyberdyne', date: 'Oct 15, 2023', amount: '$5,600.00', status: 'Pending' },
    ];

    return (
        <div className="min-h-screen text-slate-800 font-sans selection:bg-sage/30">
            <Sidebar />
            <Header title="Invoices" subtitle="All Invoices" />

            <main className="md:ml-64 pt-32 px-8 pb-12">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Action Bar */}
                    <div className="flex justify-end">
                        <Link href="/invoices/create" className="bg-sage hover:bg-sage-dark text-white pl-4 pr-6 py-3 rounded-xl font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg shadow-sage/30 group">
                            <div className="bg-white/20 p-1 rounded-lg">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            Create New Invoice
                        </Link>
                    </div>

                    <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2rem] overflow-hidden shadow-xl ring-1 ring-slate-900/5">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50/50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200/60 tracking-wider">
                                    <tr>
                                        <th className="px-8 py-6">Invoice ID</th>
                                        <th className="px-8 py-6">Client</th>
                                        <th className="px-8 py-6">Date</th>
                                        <th className="px-8 py-6 text-right">Amount</th>
                                        <th className="px-8 py-6 text-center">Status</th>
                                        <th className="px-8 py-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {invoices.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-white/80 transition-colors group">
                                            <td className="px-8 py-5 font-mono font-medium text-slate-900">{invoice.id}</td>
                                            <td className="px-8 py-5">
                                                <div className="font-medium text-slate-900">{invoice.client}</div>
                                            </td>
                                            <td className="px-8 py-5 text-slate-500">{invoice.date}</td>
                                            <td className="px-8 py-5 text-right font-bold text-slate-800 tracking-tight">{invoice.amount}</td>
                                            <td className="px-8 py-5 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border
                          ${invoice.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                        invoice.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                            'bg-rose-50 text-rose-700 border-rose-100'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${invoice.status === 'Paid' ? 'bg-emerald-500' : invoice.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                                                    {invoice.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <Link href={`/invoices/${invoice.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-sage/10 text-slate-400 hover:text-sage-dark transition-all">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-6 border-t border-white/50 bg-slate-50/30 flex justify-center">
                            <button className="text-sm font-medium text-sage-dark hover:text-sage transition-colors flex items-center gap-1">
                                Load more invoices
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
