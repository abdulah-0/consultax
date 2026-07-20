'use client';

import React from 'react';

export default function ServicesManagement() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-rule/50 space-y-4">
      <h3 className="text-xl font-bold text-navy font-heading">Services & Calculator Rates</h3>
      <p className="text-sm text-charcoal/70 font-body">
        Manage FBR tax slabs, service categories, and sub-services. Updates here immediately sync with the public website.
      </p>
      <div className="p-12 bg-cloud rounded-xl border border-dashed border-rule text-center text-charcoal/50 text-sm font-body">
        Service management and rates customizers are deferred to Phase 6. Read-only seeding configs are active.
      </div>
    </div>
  );
}
