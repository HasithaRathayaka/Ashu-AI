import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Search, 
  FileText, 
  Heading1, 
  Image as ImageIcon, 
  Scissors, 
  Eraser,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';
import UsageWidget from './UsageWidget';

export const AI_TOOLS = [
  {
    id: 'write-article',
    name: 'Write Article',
    description: 'Generate SEO-optimized articles',
    category: 'Writing',
    icon: FileText,
    badge: 'Popular',
    path: '/tools/write-article'
  },
  {
    id: 'blog-titles',
    name: 'Blog Titles',
    description: 'Catchy headlines & title ideas',
    category: 'Writing',
    icon: Heading1,
    path: '/tools/blog-titles'
  },
  {
    id: 'image-generator',
    name: 'Image Generator',
    description: 'AI visual art & photorealism',
    category: 'Media',
    icon: ImageIcon,
    badge: 'Hot',
    path: '/tools/image-generator'
  },
  {
    id: 'remove-background',
    name: 'Remove Background',
    description: 'Transparent PNG isolation',
    category: 'Media',
    icon: Scissors,
    path: '/tools/remove-background'
  },
  {
    id: 'remove-object',
    name: 'Remove Object',
    description: 'Smart object inpainting & eraser',
    category: 'Media',
    icon: Eraser,
    path: '/tools/remove-object'
  }
];

export default function InnerSidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const filteredTools = AI_TOOLS.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group tools by category
  const categories = Array.from(new Set(AI_TOOLS.map(t => t.category)));

  return (
    <div className="w-72 bg-zinc-900 border-r border-white/10 flex flex-col h-full shrink-0 select-none overflow-hidden">
      {/* Header & Search */}
      <div className="p-4 border-b border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            AI Studio Tools
          </h2>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-white/5">
            {AI_TOOLS.length} Tools
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI tools..."
            className="w-full pl-9 pr-8 py-2 bg-zinc-950/80 border border-white/10 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tool Navigation List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {filteredTools.length === 0 ? (
          <div className="p-6 text-center text-zinc-500 text-xs">
            No tools matching "{searchQuery}"
          </div>
        ) : (
          categories.map(category => {
            const categoryTools = filteredTools.filter(t => t.category === category);
            if (categoryTools.length === 0) return null;

            return (
              <div key={category} className="space-y-1.5">
                <div className="px-2 text-[11px] font-semibold text-zinc-400 tracking-wider uppercase">
                  {category}
                </div>

                <div className="space-y-1">
                  {categoryTools.map(tool => {
                    const ToolIcon = tool.icon;
                    const isActive = location.pathname === tool.path;

                    return (
                      <NavLink
                        key={tool.id}
                        to={tool.path}
                        className={`group flex items-center justify-between p-2.5 rounded-xl transition-all duration-150 ${
                          isActive
                            ? 'bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 shadow-sm'
                            : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`p-2 rounded-lg transition-colors ${
                            isActive 
                              ? 'bg-indigo-500/20 text-indigo-400' 
                              : 'bg-zinc-800/80 text-zinc-400 group-hover:text-zinc-200 group-hover:bg-zinc-800'
                          }`}>
                            <ToolIcon className="w-4 h-4 shrink-0" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold truncate flex items-center gap-1.5">
                              {tool.name}
                              {tool.badge && (
                                <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider ${
                                  tool.badge === 'Hot'
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                }`}>
                                  {tool.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-zinc-400 truncate">
                              {tool.description}
                            </div>
                          </div>
                        </div>

                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                          isActive ? 'text-indigo-400 opacity-100' : 'text-zinc-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'
                        }`} />
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Usage Widget Container (Bottom) */}
      <div className="p-3 border-t border-white/10 bg-zinc-950/40">
        <UsageWidget used={7} total={10} />
      </div>
    </div>
  );
}
