import Link from 'next/link';

export default function Home() {
  const trustItems = [
    '25+ Years of Experience',
    'Experienced Tax Consultants',
    'Complete Confidentiality',
    'Affordable Consultancy',
  ];

  const services = [
    {
      title: 'Income Tax Services',
      slug: 'income-tax',
      desc: 'FBR registrations (NTN), return filings, revisions, refunds, and replies to official notices.',
      icon: (
        <svg className="h-6 w-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: 'Sales Tax Services',
      slug: 'sales-tax',
      desc: 'Sales tax registration, monthly returns filings, general tax compliance, and hearing representations.',
      icon: (
        <svg className="h-6 w-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Tax Planning',
      slug: 'tax-planning',
      desc: 'Legally optimize your liabilities and structure transactions while remaining fully compliant with regulations.',
      icon: (
        <svg className="h-6 w-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      title: 'SECP Compliance',
      slug: 'secp-compliance',
      desc: 'New company incorporations, statutory annual filings, SECP returns, and secretarial compliance services.',
      icon: (
        <svg className="h-6 w-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      title: 'Management Accounting',
      slug: 'management-accounting',
      desc: 'Computerized bookkeeping, generation of financial statements, reporting, and business performance analysis.',
      icon: (
        <svg className="h-6 w-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: 'Internal Audit',
      slug: 'internal-audit',
      desc: 'Comprehensive risk assessments, controls verification, operational audits, and risk compliance logs.',
      icon: (
        <svg className="h-6 w-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-navy-dark py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(31,43,122,0.15),transparent)] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl font-heading leading-tight">
              CONSULTax Associates
            </h1>
            <p className="mt-6 text-xl text-white/80 leading-relaxed max-w-2xl font-body">
              Professional Tax Consultancy, Management Accounting & Corporate Compliance. Providing reliable, practical, and result-oriented financial solutions for individuals and businesses.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-md bg-orange px-6 py-3.5 text-base font-semibold text-white shadow-md hover:bg-orange/95 hover:scale-105 active:scale-95 transition-all"
              >
                Request a Consultation
              </Link>
              <Link
                href="/services"
                className="rounded-md border border-white/30 bg-white/5 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-white/10 hover:border-white/50 active:scale-95 transition-all"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Bar */}
      <section className="bg-navy border-y border-white/10 py-6 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 flex-wrap divide-y sm:divide-y-0 sm:divide-x divide-white/20 text-center">
            {trustItems.map((item, idx) => (
              <div key={idx} className="flex-1 w-full sm:w-auto py-2 sm:py-0 sm:px-4 text-base font-semibold font-heading tracking-wide">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Services Grid */}
      <section className="py-24 sm:py-32 bg-cloud">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl font-heading">
              Our Professional Areas of Expertise
            </h2>
            <p className="mt-4 text-lg text-charcoal/80 leading-relaxed font-body">
              We assist individuals, companies, and organizations in meeting their regulatory requirements through expert guidance.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services#${service.slug}`}
                className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-sm ring-1 ring-rule/50 hover:shadow-md hover:ring-orange/30 hover:scale-[1.02] active:scale-[0.99] transition-all group"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cloud group-hover:bg-orange/10 transition-colors">
                    {service.icon}
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-navy font-heading group-hover:text-orange transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-sm text-charcoal/80 leading-relaxed font-body">
                    {service.desc}
                  </p>
                </div>
                <div className="mt-8 flex items-center text-sm font-semibold text-navy group-hover:text-orange transition-colors">
                  Learn more
                  <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CTA Band */}
      <section className="bg-white py-16 sm:py-24 border-t border-rule">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-navy font-heading">
            Need Expert Financial or Tax Guidance?
          </h2>
          <p className="mt-4 text-lg text-charcoal max-w-2xl mx-auto font-body">
            Get connected with our qualified consultants to optimize your tax structure and ensure full regulatory compliance.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="rounded-md bg-orange px-8 py-4 text-base font-semibold text-white shadow-md hover:bg-orange/95 transition-colors"
            >
              Request a Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
