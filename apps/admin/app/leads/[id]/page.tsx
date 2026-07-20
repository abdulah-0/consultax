'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LeadNote {
  id: string;
  body: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    role: string;
  };
}

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
  notes: LeadNote[];
}

interface User {
  id: string;
  name: string;
  role: string;
}

export default function LeadDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: leadId } = use(params);

  const [lead, setLead] = useState<Lead | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Notes Form State
  const [newNoteBody, setNewNoteBody] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  // Update Status/Assignment Loading States
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingAssignment, setUpdatingAssignment] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Load staff list
        const usersRes = await fetch('/api/users');
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData.users);
        }

        // Load lead details
        const leadRes = await fetch(`/api/leads/${leadId}`);
        if (!leadRes.ok) {
          throw new Error('Failed to load lead details.');
        }
        const leadData = await leadRes.json();
        setLead(leadData.lead);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [leadId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!lead) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status.');
      
      // Reload lead detail
      const leadData = await res.json();
      
      // Re-fetch lead detail to pull audit log notes cleanly
      const refreshRes = await fetch(`/api/leads/${leadId}`);
      const refreshData = await refreshRes.json();
      setLead(refreshData.lead);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAssignmentChange = async (newAssigneeId: string) => {
    if (!lead) return;
    setUpdatingAssignment(true);
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedToId: newAssigneeId }),
      });
      if (!res.ok) throw new Error('Failed to update assignment.');
      
      // Re-fetch lead detail to pull audit log notes cleanly
      const refreshRes = await fetch(`/api/leads/${leadId}`);
      const refreshData = await refreshRes.json();
      setLead(refreshData.lead);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdatingAssignment(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteBody.trim()) return;
    setSubmittingNote(true);

    try {
      const res = await fetch(`/api/leads/${leadId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: newNoteBody }),
      });
      if (!res.ok) throw new Error('Failed to add note.');
      
      // Reset form and re-fetch details
      setNewNoteBody('');
      const refreshRes = await fetch(`/api/leads/${leadId}`);
      const refreshData = await refreshRes.json();
      setLead(refreshData.lead);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmittingNote(false);
    }
  };

  // Helper to format WhatsApp link for Pakistani phone numbers
  const getWhatsAppLink = (phone: string, clientName: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    let waPhone = cleanPhone;
    if (cleanPhone.startsWith('03')) {
      waPhone = '923' + cleanPhone.substring(2);
    } else if (cleanPhone.startsWith('3')) {
      waPhone = '92' + cleanPhone;
    }
    const message = encodeURIComponent(`Hello ${clientName}, this is CONSULTax Associates. We received your request regarding tax services.`);
    return `https://wa.me/${waPhone}?text=${message}`;
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-navy">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-navy border-t-transparent"></div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="rounded-xl bg-error/10 border border-error p-6 text-error">
        <p className="font-semibold">Error: {error || 'Lead not found.'}</p>
        <Link href="/leads" className="mt-4 inline-block text-sm font-semibold underline">Back to Leads Queue</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link href="/leads" className="inline-flex items-center gap-2 text-sm font-bold text-navy hover:text-orange transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Leads Queue
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col: Lead Card and Triaging Controls */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Info Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-rule/50 space-y-6">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <h2 className="text-2xl font-bold text-navy font-heading">{lead.fullName}</h2>
                <p className="text-sm text-charcoal/60 font-body mt-1">Submitted on: {new Date(lead.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <a
                  href={`tel:${lead.phone}`}
                  className="rounded-md border border-rule bg-white p-2.5 text-navy hover:bg-cloud transition-colors"
                  title="Call Phone Number"
                >
                  Call
                </a>
                <a
                  href={`mailto:${lead.email}`}
                  className="rounded-md border border-rule bg-white p-2.5 text-navy hover:bg-cloud transition-colors"
                  title="Email Client"
                >
                  Email
                </a>
                <a
                  href={getWhatsAppLink(lead.phone, lead.fullName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-[#25D366] bg-[#25D366]/10 p-2.5 text-[#2E7D32] hover:bg-[#25D366]/20 transition-colors"
                  title="Chat on WhatsApp"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-rule/50 text-sm font-body">
              <div>
                <p className="text-xs font-semibold text-charcoal/50 uppercase tracking-wider mb-1 font-heading">Service Requested</p>
                <p className="font-bold text-navy">{lead.serviceInterest}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-charcoal/50 uppercase tracking-wider mb-1 font-heading">Source Reference</p>
                <p className="font-medium text-charcoal">{lead.sourcePage}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-charcoal/50 uppercase tracking-wider mb-1 font-heading">Phone</p>
                <p className="font-medium text-charcoal">{lead.phone}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-charcoal/50 uppercase tracking-wider mb-1 font-heading">Email</p>
                <p className="font-medium text-charcoal">{lead.email}</p>
              </div>
            </div>

            {lead.message && (
              <div className="pt-6 border-t border-rule/50 font-body text-sm space-y-2">
                <p className="text-xs font-semibold text-charcoal/50 uppercase tracking-wider font-heading">Client Message</p>
                <div className="bg-cloud/50 rounded-xl p-4 border border-rule/30 text-charcoal leading-relaxed whitespace-pre-line">
                  {lead.message}
                </div>
              </div>
            )}
          </div>

          {/* Timeline Notes Log */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-rule/50 space-y-6">
            <h3 className="text-lg font-bold text-navy font-heading">Timeline & Progress Notes</h3>
            
            {/* Note Composer */}
            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                value={newNoteBody}
                onChange={(e) => setNewNoteBody(e.target.value)}
                placeholder="Write a progress comment or triage update log..."
                rows={3}
                required
                className="w-full rounded-md border border-rule px-4 py-3 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm font-body"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingNote || !newNoteBody.trim()}
                  className="rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-navy-dark disabled:bg-navy/50 transition-colors cursor-pointer font-heading"
                >
                  {submittingNote ? 'Saving...' : 'Add Note'}
                </button>
              </div>
            </form>

            {/* Note Logs Timeline */}
            <div className="space-y-4 pt-4 border-t border-rule/50">
              {lead.notes.length === 0 ? (
                <p className="text-sm text-charcoal/50 text-center py-6">No progress logs on this lead yet.</p>
              ) : (
                <div className="space-y-4">
                  {lead.notes.map((note) => {
                    const isSystem = note.body.startsWith('[SYSTEM]');
                    return (
                      <div
                        key={note.id}
                        className={`rounded-xl p-4 border text-sm font-body ${
                          isSystem
                            ? 'bg-cloud/30 border-rule/30 text-charcoal/70 italic'
                            : 'bg-white border-rule/50 text-charcoal shadow-sm'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-navy">{note.author.name}</span>
                          <span className="text-[10px] text-charcoal/50">
                            {new Date(note.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-line">{note.body}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Triage Control Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-rule/50 space-y-6">
            <h3 className="text-lg font-bold text-navy font-heading">Triage Controls</h3>
            
            {/* Status Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2 font-heading">Lead Status</label>
              <select
                disabled={updatingStatus}
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full rounded-md border border-rule px-3 py-2.5 text-sm bg-white text-charcoal focus:outline-none focus:border-navy font-body font-semibold"
              >
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="CONVERTED">Converted</option>
                <option value="CLOSED">Closed</option>
                <option value="NOT_INTERESTED">Not Interested</option>
              </select>
            </div>

            {/* Assignment Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2 font-heading">Assigned Consultant</label>
              <select
                disabled={updatingAssignment}
                value={lead.assignedToId || ''}
                onChange={(e) => handleAssignmentChange(e.target.value)}
                className="w-full rounded-md border border-rule px-3 py-2.5 text-sm bg-white text-charcoal focus:outline-none focus:border-navy font-body"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
