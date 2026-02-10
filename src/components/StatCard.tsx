interface StatCardProps {
    title: string;
    value: string;
    trend: string;
    isPositive?: boolean;
}

export function StatCard({ title, value, trend, isPositive = true }: StatCardProps) {
    return (
        <div className="p-6 rounded-2xl bg-white border border-sage/10 hover:border-sage/30 transition-all duration-300 group hover:-translate-y-1 shadow-sm">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {trend}
                </span>
            </div>
            <p className="text-3xl font-bold text-sage-dark group-hover:text-sage transition-colors">{value}</p>
        </div>
    );
}
