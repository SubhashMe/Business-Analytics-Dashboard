'use client';

import { useState, useEffect } from 'react';
import { SalesRep } from '@/types/sales';
import { fetchMockData, mockSalesReps } from '@/data/mock-sales-data';
import { Trophy, Target, Phone, MonitorPlay, FileText, ArrowUpRight } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { QuotaProgressBar } from '@/components/sales/QuotaProgressBar';

export default function TeamLeaderboardPage() {
  const [reps, setReps] = useState<SalesRep[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const loadedReps = await fetchMockData(mockSalesReps);
      // Sort by highest revenue
      const sorted = [...loadedReps].sort((a, b) => b.achievedRevenue - a.achievedRevenue);
      setReps(sorted);
      setIsLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Team Leaderboard</h1>
        <p className="text-slate-500 mt-1">Track sales performance and quota attainment.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Rank & Rep</th>
                <th className="px-6 py-4 font-medium">Quota Attainment</th>
                <th className="px-6 py-4 font-medium">Deals Won</th>
                <th className="px-6 py-4 font-medium">Activity metrics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-10 bg-slate-200 rounded-full w-48" /></td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded w-full max-w-[200px]" /></td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded w-16" /></td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded w-32" /></td>
                  </tr>
                ))
              ) : (
                reps.map((rep, index) => {
                  const attainment = (rep.achievedRevenue / rep.targetQuota) * 100;
                  const isTopThree = index < 3;
                  
                  return (
                    <tr key={rep.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm",
                            index === 0 ? "bg-amber-100 text-amber-600" :
                            index === 1 ? "bg-slate-200 text-slate-600" :
                            index === 2 ? "bg-orange-100 text-orange-600" : "bg-slate-50 text-slate-400"
                          )}>
                            {index === 0 ? <Trophy size={16} /> : `#${index + 1}`}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-slate-200 text-slate-500 font-semibold">
                              {rep.avatarUrl ? <img src={rep.avatarUrl} alt={rep.name} className="w-full h-full object-cover" /> : rep.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{rep.name}</div>
                              <div className="text-xs text-slate-500">{rep.territory} Territory</div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full max-w-[250px] space-y-2">
                          <div className="flex justify-between text-sm font-medium">
                            <span className={cn(attainment >= 100 ? "text-emerald-600" : "text-slate-700")}>
                              {formatCurrency(rep.achievedRevenue)}
                            </span>
                            <span className="text-slate-400">{formatCurrency(rep.targetQuota)}</span>
                          </div>
                          <QuotaProgressBar achieved={rep.achievedRevenue} target={rep.targetQuota} />
                          <div className="text-xs text-slate-500 text-right">{attainment.toFixed(1)}%</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 text-lg">{rep.closedDeals}</span>
                          <span className="text-xs text-slate-500">Won</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1.5" title="Calls Logged">
                            <Phone size={14} className="text-slate-400" />
                            <span>{rep.callsLogged}</span>
                          </div>
                          <div className="flex items-center gap-1.5" title="Demos Presented">
                            <MonitorPlay size={14} className="text-slate-400" />
                            <span>{rep.demosPresented}</span>
                          </div>
                          <div className="flex items-center gap-1.5" title="Proposals Sent">
                            <FileText size={14} className="text-slate-400" />
                            <span>{rep.proposalsSent}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
