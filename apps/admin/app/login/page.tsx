'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cloud text-charcoal">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Image
          src="/logo.png"
          alt="CONSULTax Associates Logo"
          width={240}
          height={75}
          className="mx-auto h-16 w-auto object-contain"
          priority
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-navy font-heading">
          Admin Portal Login
        </h2>
        <p className="mt-2 text-center text-sm text-charcoal/70 font-body">
          Sign in to manage client leads and consultations.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-rule/50 sm:rounded-2xl sm:px-10">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-error/10 border border-error text-error text-sm font-medium font-body">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-charcoal font-body mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@consultax.com"
                className="w-full rounded-md border border-rule px-4 py-3 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm font-body"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-charcoal font-body mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-rule px-4 py-3 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm font-body"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-orange py-3 text-sm font-semibold text-white shadow-md hover:bg-orange/95 disabled:bg-orange/50 transition-colors cursor-pointer"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
