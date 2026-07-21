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
              <div className="flex gap-4 mt-4">
                {socialLinks.map((social) => {
                  let icon = null;
                  if (social.name === 'Facebook') {
                    icon = (
                      <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                      </svg>
                    );
                  } else if (social.name === 'Instagram') {
                    icon = (
                      <svg className="h-5 w-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    );
                  } else if (social.name === 'Threads') {
                    icon = (
                      <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.66 13.79c-.58.33-1.22.46-1.84.37-.58-.08-1.07-.37-1.39-.81-.33-.45-.44-1.04-.33-1.63.15-.84.66-1.56 1.39-1.99.5-.29 1.05-.41 1.58-.35v1.27c-.24-.04-.51.02-.74.15-.31.18-.51.48-.57.84-.05.25 0 .5.09.69.1.18.28.3.52.34.25.04.51-.01.76-.16.27-.16.48-.42.59-.72h1.34c-.14.73-.55 1.38-1.16 1.74zm2.14-2.88c-.08-.18-.21-.34-.37-.46-.2-.15-.45-.25-.72-.28v-1.31c.64.08 1.22.37 1.66.83.47.49.71 1.15.69 1.83-.02.77-.35 1.48-.91 1.99-.59.54-1.39.81-2.22.77-.96-.05-1.84-.53-2.39-1.28-.52-.71-.7-1.62-.51-2.52.26-1.26 1.08-2.31 2.21-2.83.74-.34 1.55-.45 2.34-.31v1.3c-.48-.09-.98-.02-1.44.19-.71.33-1.22.98-1.38 1.77-.12.59-.01 1.18.31 1.63.35.48.91.77 1.52.8 1.18.06 2.06-.82 2.08-1.95.01-.41-.12-.8-.36-1.18z" />
                      </svg>
                    );
                  } else if (social.name === 'X') {
                    icon = (
                      <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    );
                  }
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/50 hover:text-orange transition-colors"
                      title={social.name}
                    >
                      {icon}
                    </a>
                  );
                })}
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
