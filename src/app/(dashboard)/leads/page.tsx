'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, MoreHorizontal, UserPlus, X, Check, Building2, Mail, Briefcase, UserCheck } from 'lucide-react';
import { Lead, LeadScore, LeadStatus, SalesRep } from '@/types/sales';
import { fetchMockData, mockLeads, mockSalesReps } from '@/data/mock-sales-data';
import { useDebounce } from '@/hooks/use-debounce';
import { LeadScoreIndicator } from '@/components/sales/LeadScoreIndicator';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function LeadsDirectory() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [reps, setReps] = useState<SalesRep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'All'>('All');
  const [scoreFilter, setScoreFilter] = useState<LeadScore | 'All'>('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Lead Form State
  const [newName, setNewName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newScore, setNewScore] = useState<LeadScore>('Warm');
  const [newStatus, setNewStatus] = useState<LeadStatus>('New');
  const [newRepId, setNewRepId] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const loadedLeads = await fetchMockData(mockLeads);
      const loadedReps = await fetchMockData(mockSalesReps);
      setLeads(loadedLeads);
      setReps(loadedReps);
      if (loadedReps.length > 0) {
        setNewRepId(loadedReps[0].id);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        lead.company.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        lead.email.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
      const matchesScore = scoreFilter === 'All' || lead.score === scoreFilter;

      return matchesSearch && matchesStatus && matchesScore;
    });
  }, [leads, debouncedSearch, statusFilter, scoreFilter]);

  const getRepName = (id: string) => reps.find(r => r.id === id)?.name || 'Unassigned';

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setScoreFilter('All');
  };

  const statusColors: Record<LeadStatus, string> = {
    'New': 'bg-blue-100 text-blue-700',
    'Contacted': 'bg-indigo-100 text-indigo-700',
    'Qualified': 'bg-emerald-100 text-emerald-700',
    'Disqualified': 'bg-rose-100 text-rose-700'
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newName.trim() || !newCompany.trim() || !newEmail.trim()) {
      setFormError('Please enter Name, Company, and Email.');
      return;
    }

    const createdLead: Lead = {
      id: `lead-${Date.now()}`,
      name: newName.trim(),
      company: newCompany.trim(),
      title: newTitle.trim() || 'Sales Contact',
      email: newEmail.trim(),
      score: newScore,
      status: newStatus,
      source: 'Inbound',
      assignedRepId: newRepId || reps[0]?.id || 'rep-1',
      createdAt: new Date().toISOString()
    };

    setLeads(prev => [createdLead, ...prev]);
    setIsModalOpen(false);

    // Reset fields
    setNewName('');
    setNewCompany('');
    setNewTitle('');
    setNewEmail('');
    setNewScore('Warm');
    setNewStatus('New');

    // Show toast
    setToastMessage(`Lead "${createdLead.name}" successfully created!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Check size={14} className="text-white" />
          </div>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Leads Directory</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage, qualify, and convert your enterprise prospects.</p>
        </div>
        <button 
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
        >
          <UserPlus size={18} />
          <span>New Lead</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search size={17} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, company, or email..."
            className="block w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 transition-all hover:bg-white"
          />
        </div>
        
        <div className="flex w-full md:w-auto flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
            <Filter size={15} className="text-slate-400 ml-1" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent border-none text-xs sm:text-sm font-medium text-slate-700 focus:ring-0 py-1 pl-1 pr-6 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Disqualified">Disqualified</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
            <select 
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value as any)}
              className="bg-transparent border-none text-xs sm:text-sm font-medium text-slate-700 focus:ring-0 py-1 pl-2 pr-6 cursor-pointer"
            >
              <option value="All">All Scores</option>
              <option value="Hot">Hot</option>
              <option value="Warm">Warm</option>
              <option value="Cold">Cold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Grid with Full Responsive Support */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto min-h-[380px] w-full">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-4 font-semibold">Lead Info</th>
                <th className="px-6 py-4 font-semibold">Company / Title</th>
                <th className="px-6 py-4 font-semibold">Score</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Assigned Rep</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 rounded w-32 mb-2" />
                      <div className="h-3 bg-slate-100 rounded w-24" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 rounded w-28 mb-2" />
                      <div className="h-3 bg-slate-100 rounded w-20" />
                    </td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded-full w-16" /></td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded-full w-20" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24" /></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 bg-slate-200 rounded w-8 inline-block" /></td>
                  </tr>
                ))
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-3">
                        <Search size={22} />
                      </div>
                      <h3 className="text-base font-semibold text-slate-900">No leads found</h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        We couldn&apos;t find any leads matching your current search criteria.
                      </p>
                      <button 
                        type="button"
                        onClick={clearFilters}
                        className="mt-4 flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        <X size={14} />
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 text-sm">{lead.name}</div>
                      <div className="text-xs text-slate-500">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800 text-sm">{lead.company}</div>
                      <div className="text-xs text-slate-500">{lead.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <LeadScoreIndicator score={lead.score} />
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-flex px-2.5 py-1 rounded-full text-xs font-semibold", statusColors[lead.status])}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                      {getRepName(lead.assignedRepId)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {lead.status === 'Qualified' && (
                          <Link 
                            href={`/deals/new?leadId=${lead.id}`}
                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
                          >
                            Convert
                          </Link>
                        )}
                        <span className="text-xs text-slate-400">
                          {new Date(lead.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Lead Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Add New Prospect Lead</h3>
                  <p className="text-xs text-slate-500">Record customer contact and assign to sales executive.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Reliance Tech"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Job Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Head of Procurement"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. rahul@company.in"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Lead Score</label>
                  <select
                    value={newScore}
                    onChange={(e) => setNewScore(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Hot">Hot</option>
                    <option value="Warm">Warm</option>
                    <option value="Cold">Cold</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Disqualified">Disqualified</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Assigned Rep</label>
                  <select
                    value={newRepId}
                    onChange={(e) => setNewRepId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {reps.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
