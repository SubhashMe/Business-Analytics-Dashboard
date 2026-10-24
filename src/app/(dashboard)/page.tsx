'use client';

import { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, Briefcase, Clock, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { SalesKPIs, Deal } from '@/types/sales';
import { fetchMockData, mockSalesKPIs, mockDeals } from '@/data/mock-sales-data';
import { formatCurrency, cn } from '@/lib/utils';
import { StageBadge } from '@/components/sales/StageBadge';
import Link from 'next/link';

// Mock data for charts
const revenueData = [
  { month: 'Jan', actual: 400000, target: 500000 },
  { month: 'Feb', actual: 600000, target: 550000 },
  { month: 'Mar', actual: 800000, target: 650000 },
  { month: 'Apr', actual: 750000, target: 700000 },
  { month: 'May', actual: 1150000, target: 800000 },
  { month: 'Jun', actual: 1300000, target: 1000000 },
];

const funnelData = [
  { stage: 'Discovery', count: 120, fill: '#3b82f6' },
  { stage: 'Demo', count: 85, fill: '#6366f1' },
  { stage: 'Proposal', count: 45, fill: '#f59e0b' },
  { stage: 'Negotiation', count: 25, fill: '#f97316' },
  { stage: 'Closed-Won', count: 15, fill: '#10b981' },
];

const insightSlides = [
  {
    category: "MARKET TRENDS",
    title: "Q3 SaaS Market Analysis & Growth Projections",
    time: "2 hours ago",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&q=80"
  },
  {
    category: "SALES STRATEGY",
    title: "Mastering B2B Enterprise Negotiations in 2026",
    time: "5 hours ago",
    img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&q=80"
  },
  {
    category: "LEADERSHIP",
    title: "Building High-Performing Sales Teams Globally",
    time: "1 day ago",
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000&q=80"
  },
  {
    category: "ANALYTICS",
    title: "Using Predictive Analytics to Close Deals Faster",
    time: "2 days ago",
    img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1000&q=80"
  }
];

export default function ExecutiveOverview() {
  const [kpis, setKpis] = useState<SalesKPIs | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % insightSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + insightSlides.length) % insightSlides.length);

  useEffect(() => {
    async function loadData() {
      const loadedKpis = await fetchMockData(mockSalesKPIs);
      const loadedDeals = await fetchMockData(mockDeals.slice(0, 5)); // Just get top 5
      setKpis(loadedKpis);
      setDeals(loadedDeals);
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % insightSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleExportReport = () => {
    if (!kpis) return;
    const csvRows = [
      ["Metric", "Value (INR)"],
      ["Closed Revenue Actual", kpis.closedRevenueActual],
      ["Closed Revenue Target", kpis.closedRevenueTarget],
      ["Pipeline Value", kpis.pipelineValue],
      ["Win Rate (%)", `${kpis.winRate}%`],
      ["Deal Velocity", `${kpis.dealVelocityDays} days`],
      [],
      ["Deal Title", "Company", "Stage", "Value", "Expected Close"],
      ...deals.map(d => [d.title, d.company, d.stage, d.value, d.expectedCloseDate])
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.map(val => `"${val}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dealflow_executive_sales_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-96 bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!kpis) return null;

  return (
    <div className="space-y-8 pb-10">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Executive Overview</h1>
          <p className="text-slate-500 mt-1 text-sm">Your sales performance and revenue intelligence at a glance.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            type="button"
            onClick={handleExportReport}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm rounded-xl font-semibold hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>Export Report</span>
          </button>
          <Link 
            href="/deals/new"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl font-semibold transition-all shadow-md shadow-blue-500/20"
          >
            <Plus size={18} />
            <span>Add Deal</span>
          </Link>
        </div>
      </div>

      {/* Latest Insights & News Slider */}
      <div className="w-full animate-in fade-in slide-in-from-bottom-2">
        <h3 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">Latest Insights & Market News</h3>
        
        <div className="relative w-full h-[320px] bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden group">
          {/* Images */}
          {insightSlides.map((slide, idx) => (
            <div 
              key={idx}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000",
                idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none"></div>
              <img src={slide.img} alt={slide.title} className="w-full h-full object-cover transition-transform duration-[10s] ease-out scale-105 group-hover:scale-110" />
              
              <div className="absolute bottom-0 left-0 p-8 z-20 w-full md:w-3/4">
                <span className="inline-block px-3 py-1 bg-[var(--theme-accent,#3b82f6)] text-[#ffffff] text-xs font-bold rounded-full mb-3 tracking-wider uppercase">
                  {slide.category}
                </span>
                <h4 className="text-2xl md:text-3xl font-bold text-[#ffffff] leading-tight mb-2 shadow-sm drop-shadow-md">{slide.title}</h4>
                <span className="text-sm font-medium text-[#e2e8f0] drop-shadow-sm">{slide.time}</span>
              </div>
            </div>
          ))}

          {/* Navigation Controls */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-[#ffffff]/10 hover:bg-[#ffffff]/30 text-[#ffffff] backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-[#ffffff]/20"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-[#ffffff]/10 hover:bg-[#ffffff]/30 text-[#ffffff] backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-[#ffffff]/20"
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-6 right-8 z-30 flex gap-2">
            {insightSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  idx === currentSlide ? "bg-[#ffffff] w-8" : "bg-[#ffffff]/50 w-2 hover:bg-[#ffffff]/80"
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bento Box Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
        
        {/* Closed Revenue - Large Bento Box */}
        <div className="md:col-span-2 lg:col-span-3 bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-white/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 group relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-[var(--theme-accent,blue)]/5 rounded-full blur-3xl group-hover:bg-[var(--theme-accent,blue)]/10 transition-colors"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Closed Revenue</p>
              <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-600 mt-2 tracking-tight">
                {formatCurrency(kpis.closedRevenueActual)}
              </h3>
            </div>
            <div className="p-3 bg-[var(--theme-accent,blue)]/10 text-[var(--theme-accent,#3b82f6)] rounded-2xl">
              <DollarSign size={24} />
            </div>
          </div>
          <div className="mt-8 flex items-center gap-2 text-sm relative z-10">
            <span className="text-emerald-600 font-bold flex items-center bg-emerald-50 px-2 py-1 rounded-md">
              <TrendingUp size={16} className="mr-1" /> 12%
            </span>
            <span className="text-slate-500 font-medium">vs last month</span>
          </div>
        </div>

        {/* Win Rate - Medium Bento Box */}
        <div className="md:col-span-2 lg:col-span-3 bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-white/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 group relative overflow-hidden" style={{ animationDelay: '100ms' }}>
           <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Avg Win Rate</p>
              <h3 className="text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">{kpis.winRate}%</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Briefcase size={24} />
            </div>
          </div>
          <div className="mt-8 flex items-center gap-2 text-sm relative z-10">
            <span className={cn(
              "font-bold flex items-center px-2 py-1 rounded-md",
              kpis.winRateTrend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            )}>
              {kpis.winRateTrend > 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
              {Math.abs(kpis.winRateTrend)}%
            </span>
            <span className="text-slate-500 font-medium">vs target</span>
          </div>
        </div>

        {/* Charts & Funnel - Bento Grid */}
        <div className="md:col-span-4 lg:col-span-4 bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-white/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '200ms' }}>
          <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Revenue Forecast</h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--theme-accent, #3b82f6)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--theme-accent, #3b82f6)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip 
                  formatter={(value: any) => [formatCurrency(Number(value) || 0), 'Revenue']}
                  contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
                />
                <Area type="monotone" dataKey="target" stroke="#cbd5e1" strokeDasharray="5 5" fill="none" strokeWidth={2} name="Target" />
                <Area type="monotone" dataKey="actual" stroke="var(--theme-accent, #3b82f6)" fillOpacity={1} fill="url(#colorActual)" strokeWidth={3} name="Actual" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Small Bento Cards Stack */}
        <div className="md:col-span-2 lg:col-span-2 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '300ms' }}>
          <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 flex-1 flex flex-col justify-center">
             <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pipeline Value</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">{formatCurrency(kpis.pipelineValue)}</h3>
              </div>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Target size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 flex-1 flex flex-col justify-center">
             <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Velocity</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">{kpis.dealVelocityDays} days</h3>
              </div>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <Clock size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Deals List */}
      <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-sm border border-white/80 overflow-hidden animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '400ms' }}>
        <div className="p-6 md:px-8 flex justify-between items-center bg-white/50 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">High Priority Deals</h3>
          <Link href="/pipeline" className="text-sm font-semibold text-[var(--theme-accent,#3b82f6)] hover:opacity-80 transition-opacity flex items-center gap-1 group">
            View Pipeline <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-widest font-semibold">
                <th className="px-6 py-4">Deal Name</th>
                <th className="px-6 py-4">Stage</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4 hidden sm:table-cell">Close Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {deals.map((deal, idx) => (
                <tr key={deal.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 group-hover:text-[var(--theme-accent,#3b82f6)] transition-colors">{deal.title}</div>
                    <div className="text-sm text-slate-500 font-medium mt-0.5">{deal.company}</div>
                  </td>
                  <td className="px-6 py-4">
                    <StageBadge stage={deal.stage} />
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">
                    {formatCurrency(deal.value)}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm font-medium hidden sm:table-cell">
                    {new Date(deal.expectedCloseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
