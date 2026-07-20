'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Lead {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  serviceInterest: string | null;
  message: string | null;
  sourcePage: string;
  status: 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'CONVERTED' | 'CLOSED' | 'NOT_INTERESTED';
  assignedToId: string | null;
  assignedTo: { id: string; name: string } | null;
  createdAt: string;
  _count: { notes: number };
}

interface User {
  id: string;
  name: string;
  role: string;
}

export default function LeadsQueue() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [assignedFilter, setAssignedFilter] = useState('ALL');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Load active consultants
        const usersRes = await fetch('/api/users');
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData.users);
        }

        // Fetch leads matching filters
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (statusFilter !== 'ALL') params.set('status', statusFilter);
        if (serviceFilter !== 'ALL') params.set('service', serviceFilter);
        if (assignedFilter !== 'ALL') params.set('assigned', assignedFilter);

        const leadsRes = await fetch(`/api/leads?${params.toString()}`);
        if (!leadsRes.ok) {
          throw new Error('Failed to fetch leads records.');
        }
        const leadsData = await leadsRes.json();
        setLeads(leadsData.leads);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [search, statusFilter, serviceFilter, assignedFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <span className="inline-flex items-center rounded-md bg-orange/10 px-2 py-1 text-xs font-bold text-orange">NEW</span>;
      case 'CONTACTED':
        return <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">CONTACTED</span>;
      case 'IN_PROGRESS':
        return <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-700">IN PROGRESS</span>;
      case 'CONVERTED':
        return <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">CONVERTED</span>;
      case 'CLOSED':
        return <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-bold text-gray-700">CLOSED</span>;
      case 'NOT_INTERESTED':
        return <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-1 text-xs font-bold text-rose-700">NOT INTERESTED</span>;
      default:
        return <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600">{status}</span>;
    }
  };

  const isOverdue = (createdAt: string, status: string) => {
    if (status !== 'NEW') return false;
    const submittedTime = new Date(createdAt).getTime();
    const now = Date.now();
    return now - submittedTime > 24 * 60 * 60 * 1000; // > 24 hours
  };

  return (
    <div className="space-y-6">
      {/* Filters Dashboard Panel */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-rule/50 space-y-4">
        <h3 className="text-lg font-bold text-navy font-heading">Filter Queue</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search bar */}
          <div>
            <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2 font-heading">Search Client</label>
            <input
              type="text"
              placeholder="Search Name, Phone, Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-rule px-3 py-2 text-sm bg-white text-charcoal focus:outline-none focus:border-navy"
            />
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2 font-heading">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border border-rule px-3 py-2 text-sm bg-white text-charcoal focus:outline-none focus:border-navy"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CONVERTED">Converted</option>
              <option value="CLOSED">Closed</option>
              <option value="NOT_INTERESTED">Not Interested</option>
            </select>
          </div>

          {/* Service filter */}
          <div>
            <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2 font-heading">Service Category</label>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full rounded-md border border-rule px-3 py-2 text-sm bg-white text-charcoal focus:outline-none focus:border-navy"
            >
              <option value="ALL">All Services</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Income Tax Services">Income Tax Services</option>
              <option value="Sales Tax Services">Sales Tax Services</option>
              <option value="Tax Planning">Tax Planning</option>
              <option value="SECP Compliance">SECP Compliance</option>
              <option value="Management Accounting Services">Management Accounting Services</option>
              <option value="Internal Audit">Internal Audit</option>
              <option value="Other Services">Other Services</option>
            </select>
          </div>

          {/* Assignee filter */}
          <div>
            <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2 font-heading">Assigned To</label>
            <select
              value={assignedFilter}
              onChange={(e) => setAssignedFilter(e.target.value)}
              className="w-full rounded-md border border-rule px-3 py-2 text-sm bg-white text-charcoal focus:outline-none focus:border-navy"
            >
              <option value="ALL">All Staff</option>
              <option value="UNASSIGNED">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-rule/50 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-navy border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-error font-body">Error loading leads: {error}</div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-charcoal/50 font-body">No leads found matching current filter parameters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cloud/50 border-b border-rule/50 text-xs font-bold text-navy font-heading uppercase tracking-wider">
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">Service Requested</th>
                  <th className="px-6 py-4">Submitted Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Assigned Consultant</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule/30">
                {leads.map((lead) => {
                  const overdue = isOverdue(lead.createdAt, lead.status);
                  return (
                    <tr
                      key={lead.id}
                      className={`hover:bg-cloud/30 transition-colors ${overdue ? 'bg-error/[0.02]' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-navy font-body">{lead.fullName}</span>
                          {overdue && (
                            <span className="inline-flex items-center rounded-md bg-error/15 px-1.5 py-0.5 text-[10px] font-bold text-error animate-pulse">
                              OVERDUE (&gt;24h)
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-charcoal/60 font-body mt-0.5">{lead.email} · {lead.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-charcoal font-body">{lead.serviceInterest}</span>
                        <div className="text-[10px] text-charcoal/60 font-body">Source: {lead.sourcePage}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-charcoal/80 font-body">
                        {new Date(lead.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(lead.status)}</td>
                      <td className="px-6 py-4 text-sm text-charcoal/80 font-body">
                        {lead.assignedTo ? (
                          <span className="font-medium text-navy">{lead.assignedTo.name}</span>
                        ) : (
                          <span className="text-charcoal/40 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/leads/${lead.id}`}
                          className="inline-flex items-center gap-1 rounded-md border border-rule bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:bg-cloud transition-colors"
                        >
                          Triage
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
