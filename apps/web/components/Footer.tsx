'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'consultaxassociates@gmail.com';

  const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com/consultax.pak' },
    { name: 'Instagram', href: 'https://instagram.com/consultax.pk' },
    { name: 'Threads', href: 'https://threads.net/@consultax.pk' },
    { name: 'X', href: 'https://x.com/consul_tax' },
  ];

  return (
    <footer className="bg-navy-dark text-white pt-12 pb-8 border-t border-navy/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/10">
          {/* Brand Col */}
          <div>
            <h3 className="text-xl font-bold font-heading mb-3">CONSULTax Associates</h3>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Professional Tax Consultancy, Management Accounting & Corporate Compliance. Providing reliable, practical solutions since 2001.
            </p>
          </div>

          {/* Quick Links Col */}
          <div>
            <h4 className="text-sm font-semibold font-heading uppercase tracking-wider text-orange mb-3">Quick Navigation</h4>
            <div className="flex flex-col gap-2">
              <Link href="/about" className="text-sm text-white/70 hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/services" className="text-sm text-white/70 hover:text-white transition-colors">
                Our Services
              </Link>
              <Link href="/calculators" className="text-sm text-white/70 hover:text-white transition-colors">
                Tax Calculators
              </Link>
              <Link href="/contact" className="text-sm text-white/70 hover:text-white transition-colors">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-sm font-semibold font-heading uppercase tracking-wider text-orange mb-3">Get in Touch</h4>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-white/70">
                WhatsApp: <a href="https://wa.me/923345371105" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">0334-5371105</a>
              </p>
              <p className="text-sm text-white/70">
                Email: <a href={`mailto:${contactEmail}`} className="hover:text-white underline">{contactEmail}</a>
              </p>
              <div className="flex gap-4 mt-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white/50 hover:text-white transition-colors"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legal block */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 text-center sm:text-left gap-4">
          <p className="text-xs text-white/50 font-heading">
            CONSULTax Associates
            <span className="hidden sm:inline"> • </span>
            <br className="sm:hidden" />
            Professional Tax Consultancy • Management Accounting • Corporate Compliance
          </p>
          <p className="text-xs text-white/50">
            &copy; {currentYear} CONSULTax Associates. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
