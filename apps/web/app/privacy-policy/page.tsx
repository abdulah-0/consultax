import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | CONSULTax Associates',
  description: 'Privacy Policy and data protection terms for CONSULTax Associates, including disclosures regarding cookies, Google AdSense, and personal information.',
};

export default function PrivacyPolicy() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'consultaxassociates@gmail.com';

  return (
    <div className="py-16 sm:py-24 bg-cloud">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-rule/50">
          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl font-heading mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-charcoal/60 font-body mb-8">
            Last Updated: September 18, 2026
          </p>

          <div className="space-y-8 text-charcoal/90 leading-relaxed font-body text-base">
            <section>
              <h2 className="text-xl font-bold text-navy font-heading mb-3">1. Introduction</h2>
              <p>
                Welcome to <strong>CONSULTax Associates</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), accessible at{' '}
                <a href="https://consultaxpk.com" className="text-orange underline hover:text-navy">
                  consultaxpk.com
                </a>
                . We respect your privacy and are committed to protecting personal data collected through our website,
                tax calculators, and consultation request forms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy font-heading mb-3">2. Information We Collect</h2>
              <p className="mb-2">We collect information directly from you when you interact with our website:</p>
              <ul className="list-disc pl-6 space-y-2 text-charcoal/80">
                <li>
                  <strong>Contact Inquiries:</strong> Your full name, email address, phone/WhatsApp number, service of interest,
                  and consultation details submitted via our contact forms.
                </li>
                <li>
                  <strong>Calculator Inputs:</strong> Numerical amounts (e.g. salary, rental income) entered into our interactive tax
                  calculators. Calculator computations are executed client-side in your browser and are not permanently stored on our servers.
                </li>
                <li>
                  <strong>Log Data:</strong> Internet Protocol (IP) addresses, browser type, Internet Service Provider (ISP), referring/exit pages,
                  and date/time stamps for analytics and security auditing.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy font-heading mb-3">
                3. Cookies, Advertising, and Google AdSense
              </h2>
              <p className="mb-3">
                We partner with third-party advertising platforms, specifically <strong>Google AdSense</strong>, to serve advertisements
                when you visit our website.
              </p>
              <div className="bg-cloud p-6 rounded-2xl border border-rule space-y-3 text-sm">
                <p>
                  • <strong>Google as a Third-Party Vendor:</strong> Google uses cookies to serve ads on our site based on users&apos; prior
                  visits to this website or other websites across the Internet.
                </p>
                <p>
                  • <strong>DoubleClick &amp; Advertising Cookies:</strong> Google&apos;s use of advertising cookies enables it and its
                  partners to serve advertisements tailored to users based on their browsing activity.
                </p>
                <p>
                  • <strong>Opting Out of Personalized Advertising:</strong> You may opt out of personalized advertising by visiting{' '}
                  <a
                    href="https://www.google.com/settings/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange underline hover:text-navy font-semibold"
                  >
                    Google Ads Settings
                  </a>
                  . Alternatively, you can opt out of third-party vendor cookies for personalized advertising by visiting{' '}
                  <a
                    href="https://www.aboutads.info/choices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange underline hover:text-navy font-semibold"
                  >
                    aboutads.info
                  </a>{' '}
                  or the{' '}
                  <a
                    href="https://www.networkadvertising.org/managing/opt_out.asp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange underline hover:text-navy font-semibold"
                  >
                    Network Advertising Initiative
                  </a>
                  .
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy font-heading mb-3">4. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-charcoal/80">
                <li>To provide tax advisory, corporate filing, accounting, and internal audit consultations.</li>
                <li>To respond to your inquiries, schedule meetings, and communicate advisory updates.</li>
                <li>To maintain, analyze, and optimize website performance, security, and user experience.</li>
                <li>To comply with regulatory obligations under applicable Pakistani corporate and tax laws.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy font-heading mb-3">5. Data Protection and Confidentiality</h2>
              <p>
                We enforce strict confidentiality for all client records, financial statements, and business documentation.
                We never sell, rent, or lease client personal information to third parties. Data is only accessible by authorized
                personnel bound by strict professional non-disclosure agreements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy font-heading mb-3">6. Third-Party Links</h2>
              <p>
                Our website includes links to external portals (such as the Federal Board of Revenue IRIS portal, SECP, and charitable
                organizations). We are not responsible for the privacy practices or content of third-party external websites.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy font-heading mb-3">7. Contact Us</h2>
              <p>
                If you have questions or concerns regarding this Privacy Policy or our data management practices, please contact us at:
              </p>
              <div className="mt-3 p-4 bg-cloud rounded-xl border border-rule text-sm space-y-1">
                <p><strong>CONSULTax Associates</strong></p>
                <p>Email: <a href={`mailto:${contactEmail}`} className="text-orange underline">{contactEmail}</a></p>
                <p>WhatsApp / Phone: <a href="https://wa.me/923345371105" className="text-orange underline">+92 334 5371105</a></p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-rule flex justify-between items-center text-sm">
            <Link href="/" className="text-navy font-semibold hover:text-orange transition-colors">
              &larr; Back to Home
            </Link>
            <Link href="/terms" className="text-navy font-semibold hover:text-orange transition-colors">
              Terms of Service &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
