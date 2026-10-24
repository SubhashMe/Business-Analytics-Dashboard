'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Bell, 
  Command, 
  Menu, 
  X, 
  CheckCheck, 
  Briefcase, 
  Users, 
  User, 
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';
import { useUIStore } from '@/store/ui-store';
import { useAuthStore } from '@/store/auth-store';
import { mockDeals, mockLeads, mockSalesReps } from '@/data/mock-sales-data';
import { formatCurrency, cn } from '@/lib/utils';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  type: 'deal' | 'lead' | 'milestone';
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'High Value Deal Won!',
    desc: 'Michael Chang closed Hogwarts ERP for ₹12,00,000.',
    time: '5m ago',
    read: false,
    type: 'deal'
  },
  {
    id: 'n-2',
    title: 'Lead Converted to Opportunity',
    desc: 'Alice Walker from TechNova was marked Qualified.',
    time: '42m ago',
    read: false,
    type: 'lead'
  },
  {
    id: 'n-3',
    title: 'Q3 Quota Milestone Reached',
    desc: 'Team overall closed revenue exceeded ₹3.7 Crore.',
    time: '2h ago',
    read: false,
    type: 'milestone'
  },
  {
    id: 'n-4',
    title: 'New Deal In Pipeline',
    desc: 'Weyland-Yutani proposal submitted by Sarah Jenkins.',
    time: '1d ago',
    read: true,
    type: 'deal'
  }
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleSidebar } = useUIStore();
  const { user } = useAuthStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Page title mapping
  const getPageTitle = () => {
    if (pathname === '/') return 'Executive Overview';
    if (pathname === '/pipeline') return 'Sales Pipeline';
    if (pathname === '/deals') return 'Deals Management';
    if (pathname === '/deals/new') return 'Create New Deal';
    if (pathname === '/leads') return 'Leads Directory';
    if (pathname === '/team') return 'Team Leaderboard';
    if (pathname === '/settings') return 'Enterprise Settings';
    return 'Dashboard';
  };

  // Search Results Filtering
  const searchResults = (() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return null;

    const matchingDeals = mockDeals
      .filter(d => d.title.toLowerCase().includes(query) || d.company.toLowerCase().includes(query))
      .slice(0, 3);

    const matchingLeads = mockLeads
      .filter(l => l.name.toLowerCase().includes(query) || l.company.toLowerCase().includes(query))
      .slice(0, 3);

    const matchingReps = mockSalesReps
      .filter(r => r.name.toLowerCase().includes(query) || r.territory.toLowerCase().includes(query))
      .slice(0, 2);

    return {
      deals: matchingDeals,
      leads: matchingLeads,
      reps: matchingReps,
      total: matchingDeals.length + matchingLeads.length + matchingReps.length
    };
  })();

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className={cn(
      "sticky top-0 z-30 flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-200 border-b",
      isScrolled 
        ? "bg-white/95 backdrop-blur-md border-slate-200 shadow-sm" 
        : "bg-white border-slate-200/80"
    )}>
      {/* Left: Mobile Menu Toggle & Title / Breadcrumbs */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          type="button"
          onClick={toggleSidebar}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        {/* Brand on Mobile / Breadcrumb on Desktop */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="md:hidden flex items-center gap-2 mr-1">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
              D
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <span className="hidden sm:inline">DealFlow CRM</span>
              <span className="hidden sm:inline">/</span>
              <span className="text-slate-900 font-semibold truncate text-sm sm:text-base">
                {getPageTitle()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Live Interactive Search Box */}
      <div ref={searchRef} className="relative flex-1 max-w-md mx-4 hidden lg:block">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search deals, companies, leads, or team..."
            className="w-full pl-10 pr-10 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X size={15} />
            </button>
          ) : (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <kbd className="hidden xl:inline-flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 shadow-sm">
                <Command size={10} /> K
              </kbd>
            </div>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        {isSearchOpen && searchResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            {searchResults.total === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">
                No matching results found for &ldquo;<span className="font-semibold text-slate-800">{searchQuery}</span>&rdquo;
              </div>
            ) : (
              <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-slate-100">
                {searchResults.deals.length > 0 && (
                  <div className="p-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                      Deals
                    </span>
                    {searchResults.deals.map(deal => (
                      <button
                        key={deal.id}
                        type="button"
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push('/deals');
                        }}
                        className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                            <Briefcase size={14} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-600">{deal.title}</p>
                            <p className="text-[11px] text-slate-400">{deal.company} &bull; {formatCurrency(deal.value)}</p>
                          </div>
                        </div>
                        <ArrowRight size={13} className="text-slate-300 group-hover:text-blue-500" />
                      </button>
                    ))}
                  </div>
                )}

                {searchResults.leads.length > 0 && (
                  <div className="p-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                      Leads
                    </span>
                    {searchResults.leads.map(lead => (
                      <button
                        key={lead.id}
                        type="button"
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push('/leads');
                        }}
                        className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md">
                            <Users size={14} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800 group-hover:text-emerald-600">{lead.name}</p>
                            <p className="text-[11px] text-slate-400">{lead.company} &bull; {lead.status}</p>
                          </div>
                        </div>
                        <ArrowRight size={13} className="text-slate-300 group-hover:text-emerald-500" />
                      </button>
                    ))}
                  </div>
                )}

                {searchResults.reps.length > 0 && (
                  <div className="p-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                      Team Members
                    </span>
                    {searchResults.reps.map(rep => (
                      <button
                        key={rep.id}
                        type="button"
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push('/team');
                        }}
                        className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md">
                            <User size={14} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600">{rep.name}</p>
                            <p className="text-[11px] text-slate-400">{rep.territory} &bull; {formatCurrency(rep.achievedRevenue)}</p>
                          </div>
                        </div>
                        <ArrowRight size={13} className="text-slate-300 group-hover:text-indigo-500" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls: Notifications & User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        
        {/* Notification Bell */}
        <div ref={notificationRef} className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="View notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Popover Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[11px] font-bold rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                  >
                    <CheckCheck size={14} />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "p-4 transition-colors flex items-start gap-3.5 hover:bg-slate-50",
                      !item.read ? "bg-blue-50/40" : "bg-white"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-xl flex-shrink-0 mt-0.5",
                      item.type === 'deal' && "bg-blue-100 text-blue-700",
                      item.type === 'lead' && "bg-emerald-100 text-emerald-700",
                      item.type === 'milestone' && "bg-amber-100 text-amber-700"
                    )}>
                      {item.type === 'deal' && <Briefcase size={16} />}
                      {item.type === 'lead' && <Users size={16} />}
                      {item.type === 'milestone' && <TrendingUp size={16} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={cn("text-xs font-bold truncate", !item.read ? "text-slate-900" : "text-slate-700")}>
                          {item.title}
                        </p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2" />
                    )}
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
                <Link
                  href="/deals"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View all activity in pipeline &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Badge */}
        <Link 
          href="/settings"
          className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-xl transition-colors select-none"
        >
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center ring-2 ring-blue-500/20">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-900 leading-tight">
              {user?.name || 'Alex Admin'}
            </span>
            <span className="text-[10px] text-emerald-600 font-medium leading-tight">
              Enterprise Online
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
