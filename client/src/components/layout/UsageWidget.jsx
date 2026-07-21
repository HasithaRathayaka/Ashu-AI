import React from 'react';
import { Sparkles, Infinity as InfinityIcon, ShieldCheck } from 'lucide-react';

export default function UsageWidget() {
  return (
    <div className="p-4 bg-zinc-900/90 border border-white/10 rounded-2xl shadow-xl space-y-3 relative overflow-hidden group">
      {/* Subtle background glow effect */}
      <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-indigo-600/10 rounded-full blur-xl pointer-events-none group-hover:bg-indigo-600/20 transition-all duration-300" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-zinc-200 tracking-tight">Free Access</span>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          Active
        </span>
      </div>

      {/* Unlimited Info Box */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/70 border border-white/5">
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
            <span>Unlimited Generations</span>
          </div>
          <p className="text-[11px] text-zinc-400">No restrictions or usage caps</p>
        </div>
        <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          <InfinityIcon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
