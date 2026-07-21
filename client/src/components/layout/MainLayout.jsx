import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SidebarRail from './SidebarRail';
import InnerSidebar from './InnerSidebar';
import { Menu, X, Sparkles } from 'lucide-react';

export default function MainLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const showInnerSidebar = location.pathname.startsWith('/tools') || location.pathname === '/';

  return (
    <div className="flex h-screen w-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans select-none antialiased">
      {/* 1. Far-Left Rail (Global Nav Icons & Live Clerk UserButton) */}
      <SidebarRail />

      {/* 2. Inner Sidebar (Tool Navigation & Usage Widget) */}
      <div className={`hidden md:block h-full transition-all duration-300 ${showInnerSidebar ? 'w-72' : 'w-0 overflow-hidden border-none'}`}>
        {showInnerSidebar && <InnerSidebar />}
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-md flex">
          <div className="w-72 h-full bg-zinc-900 border-r border-white/10 relative">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
            <InnerSidebar />
          </div>
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* 3. Main Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Top Mobile Bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-zinc-800 text-zinc-200 border border-white/10 hover:bg-zinc-700"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Ashu.ai Studio
            </span>
          </div>

          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
            Unlimited Free
          </span>
        </div>

        {/* Dynamic Route Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
