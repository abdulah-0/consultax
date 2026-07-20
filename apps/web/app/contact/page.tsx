'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ContactForm() {
  const searchParams = useSearchParams();
  const emailContact = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'consultaxassociates@gmail.com';

  const servicesMap = [
    { slug: 'general', name: 'General Inquiry' },
    { slug: 'income-tax', name: 'Income Tax Services' },
    { slug: 'sales-tax', name: 'Sales Tax Services' },
    { slug: 'tax-planning', name: 'Tax Planning' },
    { slug: 'secp-compliance', name: 'SECP Compliance' },
    { slug: 'management-accounting', name: 'Management Accounting Services' },
    { slug: 'internal-audit', name: 'Internal Audit' },
    { slug: 'other-services', name: 'Other Services' },
  ];

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    serviceInterest: 'general',
    message: '',
  });

  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    const calculatorParam = searchParams.get('calculator');
    const estimateParam = searchParams.get('estimate');

    if (serviceParam) {
      const match = servicesMap.find((s) => s.slug === serviceParam);
      if (match) {
        setFormData((prev) => ({ ...prev, serviceInterest: match.slug }));
        setIsLocked(true);
      }
    } else if (calculatorParam) {
      // Calculators are part of Income Tax Services
      setFormData((prev) => ({
        ...prev,
        serviceInterest: 'income-tax',
        message: `Hello, I used the ${calculatorParam} calculator and got a monthly estimate of ${estimateParam || 'N/A'}. I would like to get an exact tax calculation from your consultants.`,
      }));
      setIsLocked(true);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Clientside basic checks
    if (formData.fullName.trim().length < 2) {
      setError('Full Name must be at least 2 characters long.');
      setLoading(false);
      return;
    }

    if (!formData.phone.trim()) {
      setError('Phone number is required.');
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Email address is required.');
      setLoading(false);
      return;
    }

    if (!formData.message.trim()) {
      setError('Message is required on the Contact page.');
      setLoading(false);
      return;
    }

    try {
      const selectedServiceName = servicesMap.find((s) => s.slug === formData.serviceInterest)?.name || 'General Inquiry';
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          serviceInterest: selectedServiceName,
          message: formData.message,
          sourcePage: isLocked ? `Services — ${selectedServiceName}` : 'Contact Page',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    const selectedServiceName = servicesMap.find((s) => s.slug === formData.serviceInterest)?.name || 'General Inquiry';
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-rule/50 text-center max-w-xl mx-auto my-12 animate-fade-in">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-6 text-2xl font-bold text-navy font-heading">Thank You!</h2>
        <p className="mt-4 text-base text-charcoal/80 leading-relaxed font-body">
          We&apos;ve received your request regarding <strong>{selectedServiceName}</strong>.
          Our team will review your inquiry and get back to you within 24 hours.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/923345371105"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#20ba59] transition-colors inline-flex items-center justify-center gap-2"
          >
            Fast-Track on WhatsApp
          </a>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                fullName: '',
                phone: '',
                email: '',
                serviceInterest: 'general',
                message: '',
              });
              setIsLocked(false);
            }}
            className="rounded-md border border-rule bg-white px-6 py-3 text-sm font-semibold text-charcoal hover:bg-cloud transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Contact Form block */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-rule/50 lg:col-span-7">
        <h2 className="text-2xl font-bold text-navy font-heading mb-6">Send an Inquiry</h2>
        
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-error/10 border border-error text-error text-sm font-medium font-body">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-charcoal mb-2 font-body">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Abdullah Khalid"
              className="w-full rounded-md border border-rule px-4 py-3 text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm font-body"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-charcoal mb-2 font-body">
                Phone Number *
              </label>
              <input
                type="text"
                name="phone"
                id="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 0334-5371105"
                className="w-full rounded-md border border-rule px-4 py-3 text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm font-body"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-charcoal mb-2 font-body">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. you@example.com"
                className="w-full rounded-md border border-rule px-4 py-3 text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm font-body"
              />
            </div>
          </div>

          <div>
            <label htmlFor="serviceInterest" className="block text-sm font-semibold text-charcoal mb-2 font-body">
              Service of Interest
            </label>
            <div className="relative">
              <select
                name="serviceInterest"
                id="serviceInterest"
                disabled={isLocked}
                value={formData.serviceInterest}
                onChange={handleChange}
                className="w-full rounded-md border border-rule px-4 py-3 text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm font-body appearance-none disabled:bg-cloud disabled:text-charcoal/50"
              >
                {servicesMap.map((service) => (
                  <option key={service.slug} value={service.slug}>
                    {service.name}
                  </option>
                ))}
              </select>
              {isLocked && (
                <button
                  type="button"
                  onClick={() => setIsLocked(false)}
                  className="absolute right-3 top-3.5 text-xs text-orange hover:underline font-semibold font-body"
                >
                  Unlock
                </button>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-charcoal mb-2 font-body">
              Message *
            </label>
            <textarea
              name="message"
              id="message"
              required
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us details about your tax, compliance, or bookkeeping inquiry..."
              className="w-full rounded-md border border-rule px-4 py-3 text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm font-body"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-orange py-3.5 text-base font-semibold text-white shadow-md hover:bg-orange/95 disabled:bg-orange/50 transition-colors cursor-pointer"
          >
            {loading ? 'Submitting...' : 'Submit Inquiry'}
          </button>
        </form>
      </div>

      {/* Info block */}
      <div className="lg:col-span-5 space-y-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-rule/50">
          <h3 className="text-xl font-bold text-navy font-heading mb-6">Contact Channels</h3>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cloud text-navy">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/60 font-heading">WhatsApp Direct</p>
                <a href="https://wa.me/923345371105" target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-navy font-body hover:text-orange transition-colors">
                  0334-5371105
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cloud text-navy">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8m-9 11h-3a2 2 0 01-2-2V7a2 2 0 012-2h3m6 0a2 2 0 00-2-2h-3m3 4h3" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/60 font-heading">Email Address</p>
                <a href={`mailto:${emailContact}`} className="text-lg font-bold text-navy font-body hover:text-orange transition-colors break-all">
                  {emailContact}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-rule/50">
          <h3 className="text-xl font-bold text-navy font-heading mb-4">Follow Us</h3>
          <p className="text-sm text-charcoal/80 mb-6 font-body">Connect with us on our verified social media channels for news and tax updates.</p>
          
          <div className="grid grid-cols-2 gap-4">
            <a href="https://facebook.com/consultax.pak" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl border border-rule hover:border-orange hover:bg-cloud/20 transition-all font-body text-sm font-semibold text-charcoal hover:text-navy">
              Facebook
            </a>
            <a href="https://instagram.com/consultax.pk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl border border-rule hover:border-orange hover:bg-cloud/20 transition-all font-body text-sm font-semibold text-charcoal hover:text-navy">
              Instagram
            </a>
            <a href="https://threads.net/@consultax.pk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl border border-rule hover:border-orange hover:bg-cloud/20 transition-all font-body text-sm font-semibold text-charcoal hover:text-navy">
              Threads
            </a>
            <a href="https://x.com/consul_tax" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl border border-rule hover:border-orange hover:bg-cloud/20 transition-all font-body text-sm font-semibold text-charcoal hover:text-navy">
              X (Twitter)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  return (
    <div className="py-16 sm:py-24 bg-cloud">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl font-heading">
            Contact Us
          </h1>
          <p className="mt-4 text-lg text-charcoal/80 font-body">
            Get in touch with CONSULTax Associates. Submit the form below, or reach out instantly via WhatsApp.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-12 font-body text-charcoal/70">Loading form parameters...</div>}>
          <ContactForm />
        </Suspense>

      </div>
    </div>
  );
}
