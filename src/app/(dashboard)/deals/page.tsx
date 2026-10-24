'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, Plus, Filter, ArrowUpDown } from 'lucide-react';
import { Deal, PipelineStage, SalesRep } from '@/types/sales';
import { fetchMockData, mockDeals, mockSalesReps } from '@/data/mock-sales-data';
import { StageBadge } from '@/components/sales/StageBadge';
import { formatCurrency } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [reps, setReps] = useState<SalesRep[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [stageFilter, setStageFilter] = useState<PipelineStage | 'All'>('All');
  const [repFilter, setRepFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<'value' | 'expectedCloseDate' | 'probability'>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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

  const getRepName = (id: string) => reps.find(r => r.id === id)?.name || 'Unassigned';

  const filteredDeals = useMemo(() => {
    return deals
      .filter(deal => {
        const matchesSearch =
          deal.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          deal.company.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesStage = stageFilter === 'All' || deal.stage === stageFilter;
        const matchesRep = repFilter === 'All' || deal.assignedRepId === repFilter;
        return matchesSearch && matchesStage && matchesRep;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortField === 'value') diff = a.value - b.value;
        else if (sortField === 'probability') diff = a.probability - b.probability;
        else if (sortField === 'expectedCloseDate') {
          diff = new Date(a.expectedCloseDate).getTime() - new Date(b.expectedCloseDate).getTime();
        }
        return sortOrder === 'asc' ? diff : -diff;
      });
  }, [deals, debouncedSearch, stageFilter, repFilter, sortField, sortOrder]);

  const totalValue = useMemo(() => {
    return filteredDeals.reduce((sum, d) => sum + d.value, 0);
  }, [filteredDeals]);

  const toggleSort = (field: 'value' | 'expectedCloseDate' | 'probability') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Deals Management</h1>
          <p className="text-slate-500 mt-1">Review, track, and manage all active sales deals.</p>
        </div>
        <Link
          href="/deals/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>New Deal</span>
        </Link>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Deals</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{filteredDeals.length}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Filtered Pipeline Value</p>
          <h3 className="text-2xl font-bold text-blue-600 mt-1">{formatCurrency(totalValue)}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Deal Size</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {filteredDeals.length ? formatCurrency(totalValue / filteredDeals.length) : '₹0'}
          </h3>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search deals or companies..."
            className="block w-full rounded-lg border-0 py-2 pl-10 pr-4 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm bg-slate-50"
          />
        </div>

        <div className="flex w-full md:w-auto flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
            <Filter size={16} className="text-slate-400 ml-2" />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value as any)}
              className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 py-1 pl-1 pr-6 cursor-pointer"
            >
              <option value="All">All Stages</option>
              <option value="Discovery">Discovery</option>
              <option value="Demo Scheduled">Demo Scheduled</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed-Won">Closed-Won</option>
              <option value="Closed-Lost">Closed-Lost</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
            <select
              value={repFilter}
              onChange={(e) => setRepFilter(e.target.value)}
              className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 py-1 pl-3 pr-6 cursor-pointer"
            >
              <option value="All">All Sales Reps</option>
              {reps.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto min-h-[400px] w-full">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-4 font-medium">Deal Title & Company</th>
                <th className="px-6 py-4 font-medium">Stage</th>
                <th className="px-6 py-4 font-medium cursor-pointer select-none" onClick={() => toggleSort('value')}>
                  <div className="flex items-center gap-1">
                    Value <ArrowUpDown size={14} className="text-slate-400" />
                  </div>
                </th>
                <th className="px-6 py-4 font-medium cursor-pointer select-none" onClick={() => toggleSort('probability')}>
                  <div className="flex items-center gap-1">
                    Probability <ArrowUpDown size={14} className="text-slate-400" />
                  </div>
                </th>
                <th className="px-6 py-4 font-medium cursor-pointer select-none" onClick={() => toggleSort('expectedCloseDate')}>
                  <div className="flex items-center gap-1">
                    Expected Close <ArrowUpDown size={14} className="text-slate-400" />
                  </div>
                </th>
                <th className="px-6 py-4 font-medium">Assigned Rep</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-40 mb-2" /><div className="h-3 bg-slate-100 rounded w-24" /></td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded-full w-24" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-20" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-28" /></td>
                  </tr>
                ))
              ) : filteredDeals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-500">
                    No deals match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredDeals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{deal.title}</div>
                      <div className="text-sm text-slate-500">{deal.company}</div>
                    </td>
                    <td className="px-6 py-4">
                      <StageBadge stage={deal.stage} />
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {formatCurrency(deal.value)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${deal.probability}%` }} />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{deal.probability}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(deal.expectedCloseDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                      {getRepName(deal.assignedRepId)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
