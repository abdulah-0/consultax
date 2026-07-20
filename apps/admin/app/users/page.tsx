'use client';

import React, { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'CONSULTANT' | 'FRONT_DESK';
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(null);

  // Modal / Form States
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Partial<User> & { password?: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const meRes = await fetch('/api/auth/me');
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentUser(meData.user);
      }

      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to load user directory.');
      const data = await res.json();
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user: User) => {
    setSelectedUser({ ...user, password: '' });
    setIsEditing(true);
  };

  const handleCreateClick = () => {
    setSelectedUser({
      name: '',
      email: '',
      password: '',
      role: 'CONSULTANT',
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (currentUser?.id === id) {
      alert('Safety check: You cannot delete your own active logged-in account.');
      return;
    }
    if (!confirm('Are you sure you want to deactivate and delete this user? All leads assigned to them will be set to Unassigned.')) {
      return;
    }

    try {
      const res = await fetch(`/api/users/manage?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user.');

      setUsers(users.filter((u) => u.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSaving(true);

    try {
      const method = isCreating ? 'POST' : 'PUT';
      const res = await fetch('/api/users/manage', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedUser),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save staff details.');

      await fetchUsers();
      setIsEditing(false);
      setIsCreating(false);
      setSelectedUser(null);
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

  if (currentUser?.role !== 'SUPER_ADMIN') {
    return (
      <div className="rounded-xl bg-error/10 border border-error p-6 text-error font-body">
        <p className="font-semibold">Forbidden</p>
        <p className="text-sm mt-1">Only users with the role of Super Admin can access the user accounts directory.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-rule/50">
        <div>
          <h2 className="text-xl font-bold text-navy font-heading">Staff & Consultants Directory</h2>
          <p className="text-sm text-charcoal/70 font-body mt-1">
            Manage account logins and edit credentials permissions for firm consultants and desk staff.
          </p>
        </div>
        <button
          onClick={handleCreateClick}
          className="rounded-md bg-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange/90 cursor-pointer shadow-sm font-heading"
        >
          Add Staff Account
        </button>
      </div>

      {error && <div className="p-6 text-error font-body">Error loading directory: {error}</div>}

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-rule/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cloud/50 border-b border-rule/50 text-xs font-bold text-navy font-heading uppercase tracking-wider">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role Badge</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule/30">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-cloud/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-navy font-body">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-charcoal/80 font-body">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-bold ${
                      user.role === 'SUPER_ADMIN'
                        ? 'bg-orange/10 text-orange'
                        : user.role === 'CONSULTANT'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-body space-x-3">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="text-navy hover:text-orange font-semibold cursor-pointer"
                    >
                      Edit
                    </button>
                    {currentUser?.id !== user.id && (
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-error hover:text-error/80 font-semibold cursor-pointer"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {(isEditing || isCreating) && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-rule shadow-2xl">
            <h3 className="text-xl font-bold text-navy font-heading mb-6">
              {isCreating ? 'Add Staff Account' : `Edit Account: ${selectedUser.name}`}
            </h3>

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2 font-body">Full Name</label>
                <input
                  type="text"
                  required
                  value={selectedUser.name || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  className="w-full rounded-md border border-rule px-3 py-2 text-sm bg-white text-charcoal focus:outline-none focus:border-navy"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2 font-body">Email Address</label>
                <input
                  type="email"
                  required
                  value={selectedUser.email || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  className="w-full rounded-md border border-rule px-3 py-2 text-sm bg-white text-charcoal focus:outline-none focus:border-navy"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2 font-body">
                  Password {isEditing && <span className="text-xs text-charcoal/40 font-normal">(Leave blank to keep current)</span>}
                </label>
                <input
                  type="password"
                  required={isCreating}
                  value={selectedUser.password || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
                  placeholder={isEditing ? '••••••••' : 'Enter secure password'}
                  className="w-full rounded-md border border-rule px-3 py-2 text-sm bg-white text-charcoal focus:outline-none focus:border-navy"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2 font-body">Role Account</label>
                <select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value as any })}
                  className="w-full rounded-md border border-rule px-3 py-2 text-sm bg-white text-charcoal focus:outline-none focus:border-navy"
                >
                  <option value="CONSULTANT">Consultant</option>
                  <option value="FRONT_DESK">Front Desk</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
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
                  {saving ? 'Saving...' : 'Save Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
