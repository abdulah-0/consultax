'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  totalLeads: number;
  newLeadsToday: number;
  newLeadsThisWeek: number;
  openLeadsCount: number;
  convertedLeadsCount: number;
  newLeadsCount: number;
  leadsByService: { service: string; count: number }[];
  trend: { date: string; count: number }[];
  avgResponseTime: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/leads/stats');
        if (!res.ok) {
          throw new Error('Failed to load dashboard statistics.');
        }
        const data = await res.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-navy">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-navy border-t-transparent"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-xl bg-error/10 border border-error p-6 text-error">
        <p className="font-semibold">Error: {error || 'Failed to populate dashboard.'}</p>
      </div>
    );
  }

  // Find max count in trend for relative height calculations in pure CSS chart
  const maxTrendCount = Math.max(...stats.trend.map((t) => t.count), 1);

  return (
    <div className="space-y-8">
      {/* 1. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: 'Total Leads', value: stats.totalLeads, desc: 'All submissions to date' },
          { name: 'New Leads (Today / Week)', value: `${stats.newLeadsToday} / ${stats.newLeadsThisWeek}`, desc: 'Active influx', highlight: stats.newLeadsToday > 0 },
          { name: 'Open Pipeline', value: stats.openLeadsCount, desc: 'Leads requiring triage', highlight: stats.openLeadsCount > 0 },
          { name: 'Converted (Win Rate)', value: `${stats.convertedLeadsCount} (${stats.totalLeads > 0 ? Math.round((stats.convertedLeadsCount / stats.totalLeads) * 100) : 0}%)`, desc: 'Successfully onboarded clients' },
        ].map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-rule/50 flex flex-col justify-between">
            <div>
              <p className="text-sm font-semibold text-charcoal/60 uppercase tracking-wider font-heading">{card.name}</p>
              <p className={`mt-2 text-3xl font-extrabold font-body ${card.highlight ? 'text-orange' : 'text-navy'}`}>{card.value}</p>
            </div>
            <p className="mt-4 text-xs text-charcoal/50 font-body">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Trend Line Chart (Pure CSS Bar representation) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-rule/50 lg:col-span-8 space-y-6">
          <h3 className="text-lg font-bold text-navy font-heading">7-Day Lead Volume Trend</h3>
          <div className="h-64 flex items-end justify-between gap-4 pt-8">
            {stats.trend.map((item, idx) => {
              const heightPct = (item.count / maxTrendCount) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  {/* Tooltip */}
                  <span className="absolute -top-6 scale-0 transition-transform group-hover:scale-100 bg-navy text-white text-xs font-semibold px-2 py-0.5 rounded shadow">
                    {item.count} leads
                  </span>
                  
                  {/* Bar */}
                  <div
                    style={{ height: `${Math.max(heightPct, 5)}%` }}
                    className="w-full rounded-t-md bg-navy group-hover:bg-orange transition-all duration-300"
                  />
                  
                  {/* Label */}
                  <span className="mt-3 text-[10px] font-semibold text-charcoal/60 font-body truncate max-w-full text-center">
                    {item.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Breakdown By Service */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-rule/50 lg:col-span-4 space-y-6 flex flex-col">
          <h3 className="text-lg font-bold text-navy font-heading">Leads by Service</h3>
          <div className="flex-1 overflow-y-auto space-y-4">
            {stats.leadsByService.length === 0 ? (
              <p className="text-sm text-charcoal/50 text-center py-12">No lead distributions data.</p>
            ) : (
              stats.leadsByService.map((service, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-sm font-semibold font-body">
                    <span className="text-charcoal truncate pr-2">{service.service}</span>
                    <span className="text-navy">{service.count}</span>
                  </div>
                  <div className="w-full bg-cloud h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${(service.count / Math.max(stats.totalLeads, 1)) * 100}%` }}
                      className="bg-orange h-full"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 3. Short CTAs */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-rule/50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-navy font-heading">Need to triage incoming inquiries?</h3>
          <p className="text-sm text-charcoal/70 font-body mt-1">Review the queue of new registrations and assign them to your consulting staff.</p>
        </div>
        <Link
          href="/leads"
          className="rounded-md bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-dark transition-colors shrink-0"
        >
          View Leads Queue
        </Link>
      </div>

    </div>
  );
}
