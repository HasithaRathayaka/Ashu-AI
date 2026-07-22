import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { 
  Sparkles, 
  Home, 
  Wand2 
} from 'lucide-react';

export default function SidebarRail() {
  const location = useLocation();
  const { user } = useUser();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/tools', icon: Wand2, label: 'AI Tools' }
  ];

  return (
    <aside className="w-16 md:w-18 flex flex-col items-center justify-between py-4 bg-zinc-950 border-r border-white/10 shrink-0 select-none z-30">
      {/* Top Branding Icon */}
      <div className="flex flex-col items-center gap-6">
        <NavLink 
          to="/" 
          className="group relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all duration-200"
        >
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          
          {/* Tooltip */}
          <span className="absolute left-16 px-2.5 py-1 bg-zinc-900 text-zinc-200 text-xs font-medium rounded-lg border border-white/10 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-xl z-50">
            Ashu.ai Platform
          </span>
        </NavLink>

        <div className="w-8 h-[1px] bg-zinc-800/80" />

        {/* Navigation Rail Icons */}
        <nav className="flex flex-col items-center gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`group relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-inner'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/80'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : ''}`} />

                {/* Active Bar Indicator */}
                {isActive && (
                  <span className="absolute -left-3 w-1 h-5 bg-indigo-500 rounded-r-full shadow-sm shadow-indigo-500/50" />
                )}

                {/* Tooltip */}
                <span className="absolute left-16 px-2.5 py-1 bg-zinc-900 text-zinc-200 text-xs font-medium rounded-lg border border-white/10 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-xl z-50">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Live Clerk UserButton */}
      <div className="flex flex-col items-center gap-3">
        {/* Live Clerk User Profile Button */}
        <div className="relative group cursor-pointer flex items-center justify-center">
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'w-9 h-9 rounded-xl border border-white/20 shadow-md hover:scale-105 transition-transform'
              }
            }}
          />

          {/* User Email Tooltip */}
          <span className="absolute left-16 px-2.5 py-1 bg-zinc-900 text-zinc-200 text-xs font-medium rounded-lg border border-white/10 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-xl z-50">
            {user?.primaryEmailAddress?.emailAddress || 'User Workspace'}
          </span>
        </div>
      </div>
    </aside>
  );
}
