'use client';

import { useState, useEffect } from 'react';
import { LayoutGrid, List, Search, AlertCircle, Calendar } from 'lucide-react';
import { Deal, SalesRep } from '@/types/sales';
import { fetchMockData, mockDeals, mockSalesReps } from '@/data/mock-sales-data';
import { PipelineKanban } from '@/components/sales/PipelineKanban';
import { StageBadge } from '@/components/sales/StageBadge';
import { formatCurrency, cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';

type ViewMode = 'kanban' | 'table';
type SortField = 'value' | 'expectedCloseDate' | 'probability';
type SortOrder = 'asc' | 'desc';

export default function PipelinePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [reps, setReps] = useState<SalesRep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const [sortField, setSortField] = useState<SortField>('value');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const loadedDeals = await fetchMockData(mockDeals);
      const loadedReps = await fetchMockData(mockSalesReps);
      setDeals(loadedDeals);
      setReps(loadedReps);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const filteredAndSortedDeals = deals.filter(deal => {
    return deal.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
           deal.company.toLowerCase().includes(debouncedSearch.toLowerCase());
  }).sort((a, b) => {
    let comparison = 0;
    if (sortField === 'value') comparison = a.value - b.value;
    else if (sortField === 'probability') comparison = a.probability - b.probability;
    else if (sortField === 'expectedCloseDate') {
      comparison = new Date(a.expectedCloseDate).getTime() - new Date(b.expectedCloseDate).getTime();
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return <span className="ml-1 inline-block">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="space-y-6 pb-10 flex flex-col h-[calc(100vh-100px)]">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Deals Pipeline</h1>
          <p className="text-slate-500 mt-1">Track and manage active opportunities.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search deals..."
              className="block w-full rounded-lg border-0 py-2 pl-9 pr-4 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm bg-white"
            />
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={cn(
                "p-1.5 rounded-md flex items-center justify-center transition-colors focus:outline-none",
                viewMode === 'kanban' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              )}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                "p-1.5 rounded-md flex items-center justify-center transition-colors focus:outline-none",
                viewMode === 'table' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              )}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden min-h-0">
        {viewMode === 'kanban' ? (
          <PipelineKanban deals={filteredAndSortedDeals} reps={reps} isLoading={isLoading} />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 h-full overflow-hidden flex flex-col">
            <div className="overflow-x-auto overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                  <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                    <th className="px-6 py-4 font-medium">Deal Details</th>
                    <th className="px-6 py-4 font-medium">Stage</th>
                    <th 
                      className="px-6 py-4 font-medium cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('value')}
                    >
                      Deal Size <SortIcon field="value" />
                    </th>
                    <th 
                      className="px-6 py-4 font-medium cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('probability')}
                    >
                      Probability <SortIcon field="probability" />
                    </th>
                    <th 
                      className="px-6 py-4 font-medium cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('expectedCloseDate')}
                    >
                      Close Date <SortIcon field="expectedCloseDate" />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-48 mb-2" /><div className="h-3 bg-slate-100 rounded w-32" /></td>
                        <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded-full w-24" /></td>
                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-20" /></td>
                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16" /></td>
                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24" /></td>
                      </tr>
                    ))
                  ) : filteredAndSortedDeals.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        No deals match your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedDeals.map(deal => (
                      <tr key={deal.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{deal.title}</div>
                          <div className="text-sm text-slate-500">{deal.company}</div>
                        </td>
                        <td className="px-6 py-4">
                          <StageBadge stage={deal.stage} />
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          {formatCurrency(deal.value)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={cn("h-full rounded-full transition-all duration-500", deal.probability >= 80 ? 'bg-emerald-500' : deal.probability >= 40 ? 'bg-amber-400' : 'bg-rose-400')}
                                style={{ width: `${deal.probability}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-slate-600">{deal.probability}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={cn(
                            "inline-flex items-center gap-1.5 text-sm font-medium",
                            new Date(deal.expectedCloseDate) < new Date() && deal.stage !== 'Closed-Won' ? "text-rose-600 bg-rose-50 px-2 py-1 rounded" : "text-slate-600"
                          )}>
                            {new Date(deal.expectedCloseDate) < new Date() && deal.stage !== 'Closed-Won' ? <AlertCircle size={14} /> : <Calendar size={14} className="text-slate-400" />}
                            {new Date(deal.expectedCloseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
