
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sage/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md bg-white/50 backdrop-blur-xl border border-sage/20 rounded-2xl p-8 relative z-10 shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-sage-dark mb-2">
                        Rrumi
                    </h1>
                    <p className="text-slate-500 text-sm">Sign in to your admin dashboard</p>
                </div>

                <form className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage/50 transition-all placeholder:text-slate-400"
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage/50 transition-all placeholder:text-slate-400"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center space-x-2 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 bg-white text-sage focus:ring-offset-white focus:ring-sage/20" />
                            <span className="text-slate-500 group-hover:text-slate-700 transition-colors">Remember me</span>
                        </label>
                        <Link href="#" className="text-sage-dark hover:text-sage transition-colors">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="button"
                        className="w-full bg-sage hover:bg-sage-dark text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-sage/20 focus:ring-2 focus:ring-sage focus:ring-offset-2 focus:ring-offset-white"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-500">
                    Don&apos;t have an account?{' '}
                    <Link href="#" className="text-sage-dark hover:text-sage transition-colors font-medium">
                        Contact Support
                    </Link>
                </p>
            </div>
        </div>
    );
}
