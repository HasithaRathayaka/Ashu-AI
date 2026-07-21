import React, { useState, useEffect } from 'react';
import { Globe, Heart, Sparkles, RefreshCw, ArrowUpRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { getCommunityCreationsApi, toggleLikeCreationApi } from '../services/api';

export default function Community() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunityFeed();
  }, []);

  const fetchCommunityFeed = async () => {
    try {
      setLoading(true);
      const data = await getCommunityCreationsApi();
      if (data.success) {
        setCreations(data.creations || []);
      }
    } catch (error) {
      console.error('Failed to load community feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async (id) => {
    try {
      const res = await toggleLikeCreationApi(id);
      if (res.success) {
        setCreations(prev => prev.map(c => {
          if (c._id === id) {
            return { ...c, likes: res.likes };
          }
          return c;
        }));
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const categories = ['All', 'Text', 'Image'];

  const filteredCreations = activeCategory === 'All'
    ? creations
    : creations.filter(c => activeCategory === 'Image' ? c.type === 'image' : c.type !== 'image');

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-950 p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            Community Prompt Gallery
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Discover and clone trending AI prompts curated by creators worldwide.
          </p>
        </div>

        <button 
          onClick={fetchCommunityFeed}
          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold shadow-md flex items-center gap-2 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Feed
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              activeCategory === cat
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                : 'bg-zinc-900 text-zinc-400 border-white/5 hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Prompts Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
          Fetching public community gallery...
        </div>
      ) : filteredCreations.length === 0 ? (
        <div className="p-12 text-center text-xs text-zinc-500">
          No public creations found yet. Generate public images to feature here!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCreations.map((item) => (
            <div 
              key={item._id} 
              className="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-indigo-400 border border-white/5 uppercase">
                    {item.type}
                  </span>
                  <button
                    onClick={() => handleToggleLike(item._id)}
                    className="flex items-center gap-1 text-xs text-rose-400 font-medium hover:scale-110 transition-transform"
                  >
                    <Heart className={`w-3.5 h-3.5 ${item.likes?.length ? 'fill-rose-500 text-rose-500' : ''}`} />
                    {item.likes?.length || 0}
                  </button>
                </div>

                <h3 className="text-sm font-bold text-zinc-100 line-clamp-1">{item.prompt}</h3>
                
                {item.type === 'image' && item.content?.startsWith('http') ? (
                  <img src={item.content} alt={item.prompt} className="w-full h-44 object-cover rounded-xl border border-white/10" />
                ) : (
                  <p className="text-xs text-zinc-400 line-clamp-4 leading-relaxed font-sans">
                    "{item.content}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-zinc-500">Community Post</span>
                <NavLink 
                  to={`/tools/${item.type === 'image' ? 'image-generator' : 'write-article'}`}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  Use Tool <ArrowUpRight className="w-3.5 h-3.5" />
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
