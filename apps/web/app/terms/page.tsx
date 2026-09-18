import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | CONSULTax Associates',
  description: 'Terms and Conditions for utilizing CONSULTax Associates website, tax calculators, and advisory services.',
};

export default function TermsOfService() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'consultaxassociates@gmail.com';

  return (
    <div className="py-16 sm:py-24 bg-cloud">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-rule/50">
          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl font-heading mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-charcoal/60 font-body mb-8">
            Last Updated: September 18, 2026
          </p>

          <div className="space-y-8 text-charcoal/90 leading-relaxed font-body text-base">
            <section>
              <h2 className="text-xl font-bold text-navy font-heading mb-3">1. Agreement to Terms</h2>
              <p>
                By accessing and using this website, you agree to be bound by these Terms of Service, applicable laws, and
                regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy font-heading mb-3">2. Advisory &amp; Calculator Disclaimer</h2>
              <p>
                The tax calculators, financial estimates, and articles provided on <strong>CONSULTax Associates</strong> are for
                general informational and illustrative purposes only. While our calculators are calibrated using current Federal
                Board of Revenue (FBR) tax schedules (FY 2026-27), they do not constitute formal legal or tax counsel until an
                engagement agreement is formally executed with our licensed consultants.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy font-heading mb-3">3. Professional Services Engagement</h2>
              <p>
                Submitting an inquiry through our contact forms or WhatsApp does not automatically create an attorney-client or
                accountant-client relationship. Formal representation commences only upon mutual agreement, identity verification,
                and execution of a service engagement contract.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy font-heading mb-3">4. Intellectual Property</h2>
              <p>
                All logos, branding, calculator code, texts, graphics, and layout elements on this site are the exclusive property
                of CONSULTax Associates and are protected under copyright, trademark, and intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy font-heading mb-3">5. Third-Party Advertisements</h2>
              <p>
                This website displays third-party advertisements via Google AdSense. We do not endorse or make representations
                concerning products or services advertised by third parties on our site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy font-heading mb-3">6. Governing Law</h2>
              <p>
                These terms are governed by and construed in accordance with the laws of the Islamic Republic of Pakistan,
                without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy font-heading mb-3">7. Inquiries</h2>
              <p>
                For questions regarding these terms, contact us at{' '}
                <a href={`mailto:${contactEmail}`} className="text-orange underline">
                  {contactEmail}
                </a>
                .
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-rule flex justify-between items-center text-sm">
            <Link href="/" className="text-navy font-semibold hover:text-orange transition-colors">
              &larr; Back to Home
            </Link>
            <Link href="/privacy-policy" className="text-navy font-semibold hover:text-orange transition-colors">
              Privacy Policy &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
