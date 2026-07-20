'use client';

import React from 'react';

export default function Reports() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-rule/50 space-y-4">
      <h3 className="text-xl font-bold text-navy font-heading">Consultation Reports</h3>
      <p className="text-sm text-charcoal/70 font-body">
        Export CSV records and audit response times across lead pipelines.
      </p>
      <div className="p-12 bg-cloud rounded-xl border border-dashed border-rule text-center text-charcoal/50 text-sm font-body">
        Export and audit sheets reports are deferred to Phase 6.
      </div>
    </div>
  );
}
