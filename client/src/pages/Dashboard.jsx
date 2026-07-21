import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Sparkles, 
  Wand2, 
  Zap, 
  ArrowRight, 
  Clock, 
  Layers, 
  RefreshCw,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { AI_TOOLS } from '../components/layout/InnerSidebar';
import { getUserCreationsApi } from '../services/api';

export default function Dashboard() {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserHistory();
  }, []);

  const fetchUserHistory = async () => {
    try {
      setLoading(true);
      const data = await getUserCreationsApi();
      if (data.success) {
        setCreations(data.creations || []);
      }
    } catch (error) {
      console.error('Failed to load user creations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-950 p-6 lg:p-8 space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-indigo-950/60 via-zinc-900 to-purple-950/50 border border-white/10 overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Ashu.ai Platform • Unlimited Free Access
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
            Create multi-modal content in seconds with AI
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Select an AI creation tool below to craft articles, generate hyper-realistic artwork, analyze resumes, or edit images with precision.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <NavLink
              to="/tools/write-article"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <Wand2 className="w-4 h-4" />
              Launch Studio Workspace
            </NavLink>
          </div>
        </div>
      </div>

      {/* Quick AI Tool Launcher Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            Featured AI Studio Tools
          </h2>
          <NavLink to="/tools" className="text-xs text-indigo-400 hover:underline flex items-center gap-1">
            Explore All Tools <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_TOOLS.map((tool) => {
            const ToolIcon = tool.icon;
            return (
              <NavLink
                key={tool.id}
                to={tool.path}
                className="group p-5 rounded-2xl bg-zinc-900/90 border border-white/10 hover:border-indigo-500/40 hover:bg-zinc-900 transition-all duration-200 shadow-md flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                      <ToolIcon className="w-5 h-5" />
                    </div>
                    {tool.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                  <span>Category: {tool.category}</span>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Feed (Connected to MongoDB /api/user/creations) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            Recent Activity & Output History
          </h2>
          <button 
            onClick={fetchUserHistory}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="rounded-2xl bg-zinc-900/90 border border-white/10 divide-y divide-white/5 overflow-hidden shadow-md">
          {loading ? (
            <div className="p-8 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
              Loading your AI creation history...
            </div>
          ) : creations.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500 space-y-1">
              <Layers className="w-8 h-8 mx-auto stroke-1 text-zinc-600 mb-2" />
              <p className="font-semibold text-zinc-400">No creations saved yet</p>
              <p>Generate content in any AI tool above to start building your collection.</p>
            </div>
          ) : (
            creations.slice(0, 10).map((item) => (
              <div key={item._id} className="p-4 flex items-center justify-between hover:bg-zinc-800/40 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-zinc-800 text-indigo-400 shrink-0">
                    {item.type === 'image' || item.type.includes('bg') ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-zinc-200 truncate">{item.prompt}</h4>
                    <span className="text-[11px] text-zinc-500 uppercase font-mono">{item.type} • {new Date(item.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>

                <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-zinc-950 border border-white/5 text-emerald-400 font-semibold shrink-0">
                  Free
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
