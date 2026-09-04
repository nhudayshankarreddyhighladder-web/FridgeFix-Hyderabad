import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Calendar, CheckCircle2, Clock, Filter, RefreshCw, AlertCircle, Search, ExternalLink } from 'lucide-react';
import { Lead } from '../types';

export const AdminLeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [healthInfo, setHealthInfo] = useState<any>(null);

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const [leadsRes, healthRes] = await Promise.all([
        fetch('/api/admin/leads'),
        fetch('/api/health'),
      ]);

      if (leadsRes.ok) {
        const data = await leadsRes.json();
        if (data.success && Array.isArray(data.leads)) {
          setLeads(data.leads);
        }
      } else {
        throw new Error('Could not load leads from backend API');
      }

      if (healthRes.ok) {
        const hData = await healthRes.json();
        setHealthInfo(hData);
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (leadId: string, newStatus: Lead['status']) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead({ ...selectedLead, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const filteredLeads = leads.filter((l) => {
    const matchesStatus = filterStatus === 'All' || l.status === filterStatus;
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery) ||
      l.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const newCount = leads.filter((l) => l.status === 'New').length;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0A192F]">
              FridgeFix Lead Management System
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Live customer service enquiries & email delivery monitor
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchLeads}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Email delivery & System health panel */}
        <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0788C9] flex items-center justify-center font-bold">
              ✉
            </div>
            <div>
              <div className="text-slate-500 font-medium">Lead Notification Target Email</div>
              <div className="font-bold text-slate-800 text-sm">
                {healthInfo?.recipientEmail || 'Coolcomfortsolutions13@gmail.com'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${healthInfo?.hasEmailKey ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
              <span className="text-slate-600">
                Email API:{' '}
                <strong>{healthInfo?.hasEmailKey ? 'Active (Live SMTP/Resend)' : 'Ready (Logged to server console)'}</strong>
              </span>
            </div>
            <div className="px-3 py-1 bg-slate-100 rounded-lg text-slate-600 font-medium">
              Total Leads: <strong>{leads.length}</strong>
            </div>
            <div className="px-3 py-1 bg-rose-50 text-rose-700 rounded-lg font-medium">
              New: <strong>{newCount}</strong>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {['All', 'New', 'Contacted', 'In Progress', 'Completed', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  filterStatus === st
                    ? 'bg-[#0788C9] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-64 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-[#0788C9]"
            />
          </div>
        </div>

        {/* Leads Table or Empty State */}
        {loading && leads.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-sm">
            Loading leads...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <div className="font-bold text-slate-700 text-base">No Leads Found</div>
            <p className="text-xs text-slate-500 mt-1">
              Submit a service enquiry from the home page or any service page to generate real customer leads.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="p-3.5">ID / Date</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Service / Appliance</th>
                    <th className="p-3.5">Area</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((lead) => {
                    const statusColors: Record<string, string> = {
                      New: 'bg-rose-50 text-rose-700 border-rose-200',
                      Contacted: 'bg-blue-50 text-blue-700 border-blue-200',
                      'In Progress': 'bg-amber-50 text-amber-700 border-amber-200',
                      Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                      Cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
                    };

                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 font-mono text-[11px] text-slate-500">
                          <div className="font-bold text-[#0788C9]">{lead.id}</div>
                          <div>{new Date(lead.createdAt).toLocaleDateString('en-IN')}</div>
                        </td>

                        <td className="p-3.5">
                          <div className="font-bold text-slate-900 text-sm">{lead.name}</div>
                          <a
                            href={`tel:${lead.phone}`}
                            className="text-[#0788C9] font-medium flex items-center gap-1 hover:underline"
                          >
                            <Phone className="w-3 h-3" />
                            {lead.phone}
                          </a>
                        </td>

                        <td className="p-3.5">
                          <div className="font-semibold text-slate-800">{lead.service}</div>
                          <div className="text-slate-500 text-[11px]">
                            {lead.brand ? `${lead.brand} • ` : ''}
                            {lead.problem || 'No description'}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-1 font-medium text-slate-700">
                            <MapPin className="w-3 h-3 text-[#0788C9]" />
                            {lead.location}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                              statusColors[lead.status] || 'bg-slate-100'
                            }`}
                          >
                            {lead.status}
                          </span>
                        </td>

                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                          >
                            View
                          </button>
                          <select
                            value={lead.status}
                            onChange={(e) => updateStatus(lead.id, e.target.value as any)}
                            className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] bg-white cursor-pointer"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal for Full Lead Details */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-display font-bold text-lg text-[#0A192F]">
                    Lead Details • {selectedLead.id}
                  </h3>
                  <div className="text-xs text-slate-500">
                    Source: {selectedLead.sourcePage} • Received:{' '}
                    {new Date(selectedLead.createdAt).toLocaleString('en-IN')}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Customer Name:</span>
                  <strong className="text-slate-800 text-sm">{selectedLead.name}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Phone:</span>
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="font-bold text-[#0788C9] text-sm hover:underline"
                  >
                    {selectedLead.phone}
                  </a>
                </div>
                {selectedLead.email && (
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-slate-700">{selectedLead.email}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Service:</span>
                  <strong className="text-slate-800">{selectedLead.service}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Appliance / Brand:</span>
                  <span className="text-slate-700">
                    {selectedLead.appliance || 'N/A'} • {selectedLead.brand || 'Any'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Location:</span>
                  <strong className="text-slate-800">{selectedLead.location}, Hyderabad</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Preferred Visit Date:</span>
                  <span className="text-slate-700">{selectedLead.preferredDate || 'Earliest available'}</span>
                </div>
                <div className="py-1">
                  <span className="text-slate-400 block mb-1">Issue Description:</span>
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-800">
                    {selectedLead.problem || 'No description provided'}
                  </div>
                </div>
                {selectedLead.message && (
                  <div className="py-1">
                    <span className="text-slate-400 block mb-1">Customer Note:</span>
                    <div className="p-3 bg-blue-50 rounded-xl text-slate-800">
                      {selectedLead.message}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="btn-primary py-2.5 px-4 text-xs font-bold grow flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call Customer ({selectedLead.phone})
                </a>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="btn-outline py-2.5 px-4 text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
