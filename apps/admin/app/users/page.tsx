'use client';

import React from 'react';

export default function UsersManagement() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-rule/50 space-y-4">
      <h3 className="text-xl font-bold text-navy font-heading">Staff & Consultants Directory</h3>
      <p className="text-sm text-charcoal/70 font-body">
        Add, remove, or edit user permissions for consulting and front-desk staff.
      </p>
      <div className="p-12 bg-cloud rounded-xl border border-dashed border-rule text-center text-charcoal/50 text-sm font-body">
        User account administration interfaces are deferred to Phase 6. Default seed users are active.
      </div>
    </div>
  );
}
