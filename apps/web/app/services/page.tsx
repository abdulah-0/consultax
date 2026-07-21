import Link from 'next/link';

export default function Services() {
  const serviceCategories = [
    {
      id: 'income-tax',
      title: '1. Income Tax Services',
      description: null,
      subServices: [
        'FBR Registration (NTN)',
        'Income Tax Return Filing',
        'Revision of Income Tax Returns',
        'Reply to Tax Notices',
        'Tax Refund Processing',
      ],
    },
    {
      id: 'sales-tax',
      title: '2. Sales Tax Services',
      description: null,
      subServices: [
        'Sales Tax Registration',
        'Monthly Sales Tax Returns',
        'Sales Tax Compliance',
        'Reply to Sales Tax Notices',
      ],
    },
    {
      id: 'tax-planning',
      title: '3. Tax Planning',
      description: 'Our experts provide tax planning solutions to help individuals and businesses legally optimize their tax liabilities while ensuring full compliance with tax regulations.',
      subServices: [],
    },
    {
      id: 'secp-compliance',
      title: '4. SECP Compliance',
      description: null,
      subServices: [
        'Company Incorporation',
        'Submission of Annual Returns',
        'Corporate Compliance',
        'Statutory Filings',
      ],
    },
    {
      id: 'management-accounting',
      title: '5. Management Accounting Services',
      description: null,
      subServices: [
        'Accounts Management',
        'Computerized Accounting',
        'Bookkeeping',
        'Preparation of Financial Statements',
        'Financial Reporting',
        'Business Performance Analysis',
      ],
    },
    {
      id: 'internal-audit',
      title: '6. Internal Audit',
      description: 'We conduct comprehensive internal audits to strengthen internal controls, improve operational efficiency, identify financial risks, and ensure regulatory compliance.',
      subServices: [],
    },
    {
      id: 'other-services',
      title: 'Other Services',
      description: null,
      subServices: [
        'PSEB Registration',
      ],
    },
  ];

  return (
    <div className="py-16 sm:py-24 bg-cloud">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl font-heading">
            Our Services
          </h1>
          <p className="mt-4 text-lg text-charcoal/80 font-body">
            Explore our comprehensive suite of tax consultancy, corporate compliance, and auditing services designed to legally optimize and protect your financial operations.
          </p>
        </div>

        {/* Services Stack */}
        <div className="space-y-12">
          {serviceCategories.map((service) => (
            <section
              key={service.id}
              id={service.id !== 'other-services' ? service.id : undefined}
              className="scroll-mt-24 bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-rule/50 flex flex-col lg:flex-row justify-between gap-8 hover:border-orange/20 hover:shadow-md transition-all"
            >
              {/* Category details */}
              <div className="max-w-2xl flex-1">
                <h2 className="text-2xl font-bold text-navy font-heading mb-4">
                  {service.title}
                </h2>
                
                {service.description && (
                  <p className="text-base text-charcoal/80 leading-relaxed font-body mb-6">
                    {service.description}
                  </p>
                )}

                {service.subServices.length > 0 && (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.subServices.map((sub, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <svg className="h-5 w-5 text-orange shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-sm font-medium text-charcoal font-body leading-relaxed">{sub}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Action band */}
              <div className="lg:w-64 shrink-0 flex items-center lg:justify-end">
                <Link
                  href={`/contact?service=${service.id}`}
                  className="w-full lg:w-auto text-center rounded-md bg-orange px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange/95 hover:scale-[1.03] active:scale-[0.98] transition-all"
                >
                  Request This Service
                </Link>
              </div>
            </section>
          ))}
        </div>

      </div>
    </div>
  );
}
