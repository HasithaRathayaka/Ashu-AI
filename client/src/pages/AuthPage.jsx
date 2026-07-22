import React from 'react';
import { SignInButton, SignUpButton } from '@clerk/clerk-react';
import { 
  Sparkles, 
  Wand2, 
  ShieldCheck, 
  Zap, 
  FileText, 
  Image as ImageIcon, 
  Scissors, 
  UserCheck, 
  ArrowRight 
} from 'lucide-react';

export default function AuthPage() {
  const tools = [
    { title: 'SEO Article Writer', desc: 'Generate long-form articles in seconds', icon: FileText },
    { title: 'AI Image Generator', desc: 'Photorealistic AI art & visuals', icon: ImageIcon },
    { title: 'Background Remover', desc: 'Instant transparent PNG isolation', icon: Scissors },
  ];

  return (
    <div className="min-h-screen w-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between p-6 md:p-12 relative overflow-hidden font-sans select-none antialiased">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header Navbar */}
      <header className="flex items-center justify-between relative z-10 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-lg font-extrabold text-zinc-100 tracking-tight">Ashu.ai</span>
        </div>

        <div className="flex items-center gap-3">
          <SignInButton mode="modal">
            <button className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-white/10 transition-all">
              Sign In
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all">
              Get Started Free
            </button>
          </SignUpButton>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto text-center space-y-8 my-auto relative z-10 py-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Authentication Required • Sign in to Access Studio
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-zinc-100 tracking-tight leading-tight">
          Create Multi-Modal AI Content <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Without Limits or Restraints
          </span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Sign in with your email or Google account to access our complete suite of generative tools: Article Writing, AI Artwork, Resume Analysis, and Media Utilities.
        </p>

        {/* Auth CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <SignInButton mode="modal">
            <button className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
              <Wand2 className="w-4 h-4" />
              Sign In to Ashu.ai Studio
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/10 text-sm font-semibold transition-all">
              Create New Account
            </button>
          </SignUpButton>
        </div>

        {/* Feature Grid Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-8 text-left">
          {tools.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-2 shadow-md">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 w-fit">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-zinc-200">{item.title}</h3>
                <p className="text-[11px] text-zinc-400">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-zinc-500 relative z-10 max-w-6xl mx-auto w-full pt-6 border-t border-white/5">
        &copy; {new Date().getFullYear()} Ashu.ai Studio • Unlimited Free Access
      </footer>
    </div>
  );
}
