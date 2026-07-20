'use client';

import React, { useEffect, useState } from 'react';

interface SubService {
  id: string;
  name: string;
  order: number;
}

interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  order: number;
  active: boolean;
  subServices: SubService[];
}

export default function ServicesManagement() {
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Edit / Create Modals State
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<ServiceCategory> | null>(null);
  const [subServicesInput, setSubServicesInput] = useState<string>('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Load User role
        const meRes = await fetch('/api/auth/me');
        if (meRes.ok) {
          const meData = await meRes.json();
          setUserRole(meData.user.role);
        }

        // Load services list
        const res = await fetch('/api/services');
        if (!res.ok) throw new Error('Failed to load services.');
        const data = await res.json();
        setServices(data.services);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleEditClick = (service: ServiceCategory) => {
    setCurrentService(service);
    // Join subservices by comma + newline
    const subsText = service.subServices.map((s) => s.name).join('\n');
    setSubServicesInput(subsText);
    setIsEditing(true);
  };

  const handleCreateClick = () => {
    setCurrentService({
      name: '',
      slug: '',
      description: '',
      order: services.length + 1,
      active: true,
    });
    setSubServicesInput('');
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service category? This action is permanent and will delete all subservices.')) {
      return;
    }
    try {
      const res = await fetch(`/api/services?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete service category.');
      }
      setServices(services.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentService) return;
    setSaving(true);

    try {
      const subServicesArray = subServicesInput
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const payload = {
        ...currentService,
        subServices: subServicesArray,
      };

      const method = isCreating ? 'POST' : 'PUT';
      const res = await fetch('/api/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save service category.');
      }

      // Reload all services
      const reloadRes = await fetch('/api/services');
      const reloadData = await reloadRes.json();
      setServices(reloadData.services);

      setIsEditing(false);
      setIsCreating(false);
      setCurrentService(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-navy">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-navy border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-error font-body">Error loading services: {error}</div>;
  }

  const isAdmin = userRole === 'SUPER_ADMIN';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-rule/50">
        <div>
          <h2 className="text-xl font-bold text-navy font-heading">Service Categories & Sub-Services</h2>
          <p className="text-sm text-charcoal/70 font-body mt-1">
            Configure the services rendered by CONSULTax. Updates here automatically sync on the public marketing site.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleCreateClick}
            className="rounded-md bg-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange/90 cursor-pointer shadow-sm font-heading"
          >
            Create Category
          </button>
        )}
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-rule/50 flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-navy font-heading">{service.name}</h3>
                <span className="text-xs text-charcoal/50 font-mono">slug: {service.slug}</span>
                {!service.active && (
                  <span className="rounded bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700 font-body">INACTIVE</span>
                )}
              </div>

              {service.description && (
                <p className="text-sm text-charcoal/80 leading-relaxed font-body max-w-3xl">{service.description}</p>
              )}

              {service.subServices.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-charcoal/50 uppercase tracking-wider font-heading">Sub-Services</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {service.subServices.map((sub) => (
                      <li key={sub.id} className="flex items-center gap-2 text-sm text-charcoal font-body">
                        <svg className="h-4 w-4 text-orange shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                        {sub.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {isAdmin && (
              <div className="flex md:flex-col justify-end gap-2 shrink-0">
                <button
                  onClick={() => handleEditClick(service)}
                  className="rounded-md border border-rule bg-white px-4 py-2 text-sm font-semibold text-navy hover:bg-cloud cursor-pointer font-heading"
                >
                  Edit Category
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="rounded-md border border-error bg-white px-4 py-2 text-sm font-semibold text-error hover:bg-error/10 cursor-pointer font-heading"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit / Create Modal Overlay */}
      {(isEditing || isCreating) && currentService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-rule shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-navy font-heading mb-6">
              {isCreating ? 'Create Service Category' : `Edit: ${currentService.name}`}
            </h3>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2 font-body">Category Name</label>
                  <input
                    type="text"
                    required
                    value={currentService.name || ''}
                    onChange={(e) => setCurrentService({ ...currentService, name: e.target.value })}
                    className="w-full rounded-md border border-rule px-3 py-2 text-sm bg-white text-charcoal focus:outline-none focus:border-navy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2 font-body">Category Slug</label>
                  <input
                    type="text"
                    required
                    disabled={!isCreating}
                    value={currentService.slug || ''}
                    onChange={(e) => setCurrentService({ ...currentService, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full rounded-md border border-rule px-3 py-2 text-sm bg-white text-charcoal focus:outline-none focus:border-navy disabled:bg-cloud disabled:text-charcoal/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2 font-body">Description</label>
                <textarea
                  value={currentService.description || ''}
                  onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-md border border-rule px-3 py-2 text-sm bg-white text-charcoal focus:outline-none focus:border-navy"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2 font-body">Display Order</label>
                  <input
                    type="number"
                    value={currentService.order || 0}
                    onChange={(e) => setCurrentService({ ...currentService, order: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-md border border-rule px-3 py-2 text-sm bg-white text-charcoal focus:outline-none focus:border-navy"
                  />
                </div>
                <div className="flex items-center gap-3 h-full pt-6">
                  <input
                    type="checkbox"
                    id="active"
                    checked={currentService.active}
                    onChange={(e) => setCurrentService({ ...currentService, active: e.target.checked })}
                    className="h-4 w-4 text-orange border-rule rounded focus:ring-orange/20"
                  />
                  <label htmlFor="active" className="text-sm font-semibold text-charcoal font-body">Active Status</label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2 font-body">
                  Sub-Services list (One subservice name per line)
                </label>
                <textarea
                  value={subServicesInput}
                  onChange={(e) => setSubServicesInput(e.target.value)}
                  rows={5}
                  placeholder="e.g. FBR Registration (NTN)&#10;Income Tax Return Filing"
                  className="w-full rounded-md border border-rule px-3 py-2 text-sm bg-white text-charcoal focus:outline-none focus:border-navy font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-rule/50">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setIsCreating(false);
                  }}
                  className="rounded-md border border-rule bg-white px-5 py-2.5 text-sm font-semibold text-charcoal hover:bg-cloud cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-orange px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-orange/95 disabled:bg-orange/50 transition-colors cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
