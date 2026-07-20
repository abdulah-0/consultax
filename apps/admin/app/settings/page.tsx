'use client';

import React from 'react';

export default function Settings() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-rule/50 space-y-4">
      <h3 className="text-xl font-bold text-navy font-heading">Dashboard Settings</h3>
      <p className="text-sm text-charcoal/70 font-body">
        Configure fallback email alerts and dashboard notifications preferences.
      </p>
      <div className="p-12 bg-cloud rounded-xl border border-dashed border-rule text-center text-charcoal/50 text-sm font-body">
        Settings customization panel is deferred to Phase 6.
      </div>
    </div>
  );
}
