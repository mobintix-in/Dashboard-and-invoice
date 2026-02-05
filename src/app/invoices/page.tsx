
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

            <main className="md:ml-64 pt-24 px-8 pb-12">
                <div className="max-w-7xl mx-auto space-y-8">

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h1 className="text-3xl font-bold text-slate-900">Recent Invoices</h1>
                        <Link href="/invoices/create" className="bg-sage hover:bg-sage-dark text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-sage/20">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Invoice
                        </Link>
                    </div>

                    <div className="bg-white border border-sage/10 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-sage/5 text-xs uppercase font-medium text-sage-dark/70 border-b border-sage/10">
                                    <tr>
                                        <th className="px-6 py-4">Invoice ID</th>
                                        <th className="px-6 py-4">Client</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4 text-right">Amount</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sage/10">
                                    {invoices.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-sage/5 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">{invoice.id}</td>
                                            <td className="px-6 py-4">{invoice.client}</td>
                                            <td className="px-6 py-4">{invoice.date}</td>
                                            <td className="px-6 py-4 text-right font-medium text-slate-900">{invoice.amount}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                                        invoice.status === 'Pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                                            'bg-rose-100 text-rose-700 border border-rose-200'}`}>
                                                    {invoice.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={`/invoices/${invoice.id}`} className="text-slate-400 hover:text-sage-dark transition-colors font-medium">View</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 border-t border-sage/10 flex justify-center">
                            <button className="text-sm text-slate-500 hover:text-sage-dark transition-colors">Load more...</button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
