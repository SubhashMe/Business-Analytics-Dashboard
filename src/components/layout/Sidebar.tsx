'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  KanbanSquare, 
  PlusCircle, 
  BarChart3,
  Settings,
  X,
  Briefcase,
  LogOut
} from 'lucide-react';
import { useUIStore } from '@/store/ui-store';
import { useAuthStore } from '@/store/auth-store';

const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/pipeline', label: 'Pipeline', icon: KanbanSquare },
  { href: '/deals', label: 'Deals', icon: Briefcase },
  { href: '/deals/new', label: 'New Deal', icon: PlusCircle },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/team', label: 'Team', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    router.replace('/login');
  };

  const handleNavClick = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 text-slate-700 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex-shrink-0 flex flex-col shadow-xl md:shadow-none",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Brand Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <Link 
            href="/" 
            onClick={handleNavClick}
            className="flex items-center gap-3.5 group"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <span className="text-white font-bold text-lg tracking-tight">D</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                DealFlow
              </span>
              <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest mt-1">
                Analytics CRM
              </span>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button 
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Main Navigation
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && item.href !== '/deals' && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={cn(
                  "flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                  isActive 
                    ? "bg-blue-50 text-blue-700 font-semibold shadow-sm border border-blue-100" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon size={19} className={cn(
                  "transition-colors flex-shrink-0",
                  isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                )} />
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-5 bg-blue-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer & User Profile */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 space-y-3">
          <Link
            href="/settings"
            onClick={handleNavClick}
            className={cn(
              "flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
              pathname === '/settings'
                ? "bg-white text-blue-700 shadow-sm border border-slate-200 font-semibold"
                : "text-slate-600 hover:bg-white hover:text-slate-900"
            )}
          >
            <Settings size={19} className={pathname === '/settings' ? "text-blue-600" : "text-slate-400"} />
            <span className="font-medium truncate">Settings</span>
          </Link>
          
          {/* User Card */}
          <div className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl shadow-sm border border-slate-200/80">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-800 to-slate-600 text-white font-semibold flex items-center justify-center text-xs flex-shrink-0 ring-2 ring-blue-500/20">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 truncate block">
                  {user?.name || 'Alex Admin'}
                </span>
                <span className="text-[11px] text-slate-500 truncate block">
                  {user?.role || 'VP of Sales'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
