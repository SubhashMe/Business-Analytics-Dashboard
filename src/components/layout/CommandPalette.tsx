'use client';

import { useState, useEffect } from 'react';
import { Search, PlusCircle, Settings, Users, KanbanSquare, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (path: string) => {
    router.push(path);
    setIsOpen(false);
    setQuery('');
  };

  const actions = [
    { id: 'all-deals', label: 'View All Deals', icon: KanbanSquare, path: '/deals' },
    { id: 'new-deal', label: 'Create New Deal', icon: PlusCircle, path: '/deals/new' },
    { id: 'pipeline', label: 'View Pipeline', icon: KanbanSquare, path: '/pipeline' },
    { id: 'leads', label: 'Search Leads', icon: Users, path: '/leads' },
    { id: 'settings', label: 'System Settings', icon: Settings, path: '/settings' },
  ];

  const filteredActions = actions.filter(action => 
    action.label.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 px-4">
      <div 
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-md transition-opacity" 
        onClick={() => setIsOpen(false)}
      />
      
      <div className="relative w-full max-w-xl bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center px-4 py-4 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            autoFocus
            className="flex-1 bg-transparent border-0 outline-none text-slate-900 placeholder:text-slate-400 text-lg"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-100 rounded-md">ESC</kbd>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto p-2">
          {filteredActions.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No results found for "{query}"
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Quick Actions
              </div>
              {filteredActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleSelect(action.path)}
                    className="w-full flex items-center justify-between px-3 py-3 text-left rounded-xl hover:bg-blue-50/80 group transition-colors focus:bg-blue-50/80 focus:outline-none"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">
                        <Icon size={18} />
                      </div>
                      <span className="font-medium text-slate-700 group-hover:text-slate-900">{action.label}</span>
                    </div>
                    <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
