import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, ShieldCheck, Target, Award, Cpu, Users } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#071426] text-white selection:bg-blue-500 selection:text-white antialiased">
      {/* Header */}
      <nav className="border-b border-white/10 bg-[#071426]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#22D3EE]">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Revenue<span className="text-[#22D3EE]">Analytics</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white">Home</Link>
            <Link to="/features" className="text-sm font-medium text-slate-300 hover:text-white">Features</Link>
            <Link to="/about" className="text-sm font-medium text-white border-b-2 border-blue-500 pb-0.5">About</Link>
            <Link to="/contact" className="text-sm font-medium text-slate-300 hover:text-white">Contact</Link>
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white">Login</Link>
            <Link to="/app/dashboard" className="rounded-lg bg-[#2563EB] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700">
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="rounded-full border border-blue-500/30 bg-blue-950/60 px-3 py-1 text-xs font-semibold text-cyan-300">
            OUR MISSION & ARCHITECTURE
          </span>
          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">
            Bridging Business Data and Executive Clarity
          </h1>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            RevenueAnalytics was engineered to eliminate fragmented spreadsheets and opaque CRM calculations. We deliver single-source-of-truth business intelligence.
          </p>
        </div>

        {/* Pillars */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#0B1730] p-6">
            <ShieldCheck className="h-8 w-8 text-emerald-400 mb-3" />
            <h3 className="text-lg font-bold text-white">Strict Referential Integrity</h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Every quotation links to an identifiable lead; every deal associates with its won quotation; every invoice maps to valid payment receipts. No orphan data, no phantom revenues.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0B1730] p-6">
            <Cpu className="h-8 w-8 text-cyan-400 mb-3" />
            <h3 className="text-lg font-bold text-white">Zero Double-Counting</h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Realized collections are distinct from total contract pipeline. We guarantee mathematical parity between order ledgers, invoice settlements, and bank transaction references.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0B1730] p-6">
            <Target className="h-8 w-8 text-blue-400 mb-3" />
            <h3 className="text-lg font-bold text-white">Authentic Employee Attribution</h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Every consultant (including Aazam Afroz, Nancy Singh, Sneha Choudhary) owns their verified pipeline, ensuring performance rankings are derived from legitimate records.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0B1730] p-6">
            <Award className="h-8 w-8 text-amber-400 mb-3" />
            <h3 className="text-lg font-bold text-white">Sub-Millisecond Client Aggregation</h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              All multi-dimensional filters—period comparison, employee isolation, and department segregation—render instantly without server latency or loading spinners.
            </p>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} RevenueAnalytics Platform. Enterprise Business Intelligence.
      </footer>
    </div>
  );
};
