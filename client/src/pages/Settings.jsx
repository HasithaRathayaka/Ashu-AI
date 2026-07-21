import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Settings as SettingsIcon, User, Moon, Zap, Save, Check } from 'lucide-react';
import UsageWidget from '../components/layout/UsageWidget';

export default function Settings() {
  const { user } = useUser();
  const [defaultTone, setDefaultTone] = useState('Professional');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-950 p-6 lg:p-8 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b border-white/10">
        <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-indigo-400" />
          Workspace Settings
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Manage your account profile, AI preferences, and authentication status.
        </p>
      </div>

      {/* Profile Card */}
      <div className="p-6 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center gap-4">
          {user?.imageUrl ? (
            <img src={user.imageUrl} alt={user.fullName || 'User'} className="w-14 h-14 rounded-2xl border border-white/20 shadow-md object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg">
              {user?.firstName?.[0] || 'U'}
            </div>
          )}
          <div>
            <h2 className="text-base font-bold text-zinc-100">{user?.fullName || 'Authenticated User'}</h2>
            <p className="text-xs text-zinc-400">{user?.primaryEmailAddress?.emailAddress || 'email@clerk.user'}</p>
            <span className="inline-block text-[10px] font-semibold px-2 py-0.5 mt-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Verified Clerk Account
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div className="space-y-1">
            <label className="text-zinc-400">Account Name</label>
            <input
              type="text"
              readOnly
              value={user?.fullName || user?.firstName || 'User Account'}
              className="w-full p-2.5 bg-zinc-950 border border-white/10 rounded-xl text-zinc-200 cursor-not-allowed font-medium"
            />
          </div>
          <div className="space-y-1">
            <label className="text-zinc-400">Primary Email Address</label>
            <input
              type="email"
              readOnly
              value={user?.primaryEmailAddress?.emailAddress || ''}
              className="w-full p-2.5 bg-zinc-950 border border-white/10 rounded-xl text-zinc-200 cursor-not-allowed font-medium"
            />
          </div>
        </div>

        {/* Quota overview */}
        <div className="pt-2">
          <UsageWidget />
        </div>
      </div>

      {/* AI Preferences Card */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-400" />
          Default Generation Preferences
        </h2>

        <div className="space-y-3">
          <label className="text-xs font-semibold text-zinc-300 block">Default Tone of Voice</label>
          <div className="grid grid-cols-3 gap-3 max-w-md">
            {['Professional', 'Creative', 'Casual'].map((tone) => (
              <button
                key={tone}
                type="button"
                onClick={() => setDefaultTone(tone)}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                  defaultTone === tone
                    ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                    : 'bg-zinc-950 text-zinc-400 border-white/5'
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Moon className="w-4 h-4 text-indigo-400" />
            <span>Appearance: Ashu.ai Dark Theme</span>
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md flex items-center gap-2 transition-colors"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
