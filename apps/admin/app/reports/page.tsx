'use client';

import React, { useState, useEffect } from 'react';

interface PreviewStats {
  count: number;
  byStatus: Record<string, number>;
}

export default function Reports() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');

  const [preview, setPreview] = useState<PreviewStats>({ count: 0, byStatus: {} });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPreview() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (statusFilter !== 'ALL') params.set('status', statusFilter);
        if (serviceFilter !== 'ALL') params.set('service', serviceFilter);
        if (startDate) params.set('startDate', startDate);
        if (endDate) params.set('endDate', endDate);

        // Fetch counts using our existing API with query params
        const res = await fetch(`/api/leads?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          
          // Aggregate status counts
          const statusCount: Record<string, number> = {};
          data.leads.forEach((l: any) => {
            statusCount[l.status] = (statusCount[l.status] || 0) + 1;
          });

          setPreview({
            count: data.leads.length,
            byStatus: statusCount,
          });
        }
      } catch (err) {
        console.error('Failed to load report preview:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPreview();
  }, [startDate, endDate, statusFilter, serviceFilter]);

  const handleDownload = () => {
    const params = new URLSearchParams();
    if (statusFilter !== 'ALL') params.set('status', statusFilter);
    if (serviceFilter !== 'ALL') params.set('service', serviceFilter);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);

    // Direct browser redirect download
    window.open(`/api/reports/export?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-rule/50 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-navy font-heading">Consultation Reports</h2>
          <p className="text-sm text-charcoal/70 font-body mt-1">
            Filter customer lead submissions by dates and export CSV spreadsheets for offline audits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Filters Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-rule/50 lg:col-span-6 space-y-6">
          <h3 className="text-lg font-bold text-navy font-heading">Configure Export</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2 font-heading">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-md border border-rule px-3 py-2 text-sm bg-white text-charcoal focus:outline-none focus:border-navy"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2 font-heading">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-md border border-rule px-3 py-2 text-sm bg-white text-charcoal focus:outline-none focus:border-navy"
                />
              </div>
            </div>

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
          </div>

          <button
            onClick={handleDownload}
            disabled={preview.count === 0}
            className="w-full rounded-md bg-orange py-3 text-sm font-semibold text-white shadow-md hover:bg-orange/95 disabled:bg-orange/50 transition-colors cursor-pointer font-heading"
          >
            Export to CSV
          </button>
        </div>

        {/* Preview Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-rule/50 lg:col-span-6 space-y-6">
          <h3 className="text-lg font-bold text-navy font-heading">Export Preview</h3>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-navy border-t-transparent"></div>
            </div>
          ) : (
            <div className="space-y-6 font-body text-sm">
              <div className="flex justify-between items-center p-4 bg-cloud rounded-xl">
                <span className="font-semibold text-charcoal">Matching Records:</span>
                <span className="text-2xl font-bold text-navy">{preview.count} leads</span>
              </div>

              {preview.count > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider font-heading">Pipeline Status Grouping</p>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(preview.byStatus).map(([status, count]) => (
                      <div key={status} className="flex justify-between items-center py-2 border-b border-rule/30">
                        <span className="text-charcoal/80 text-xs font-medium">{status}</span>
                        <span className="font-bold text-navy">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
