import React from 'react';
import Link from 'next/link';

export default function About() {
  const whyChooseUs = [
    '25+ Years Professional Experience',
    'Experienced Tax Consultants',
    'Reliable & Timely Services',
    'Affordable Consultancy',
    'Complete Confidentiality',
    'Personalized Client Support',
  ];

  const serviceApproach = [
    {
      step: '01',
      title: 'Analyzing',
      desc: "We begin by thoroughly assessing client's requirements, objectives, and current situation to identify opportunities, challenges, and the most effective course of action."
    },
    {
      step: '02',
      title: 'Developing',
      desc: 'Based on our analysis, we develop a customized strategy and practical solutions tailored to your specific business and compliance needs.'
    },
    {
      step: '03',
      title: 'Execution',
      desc: 'Our team implements the approved plan efficiently, ensuring every task is completed accurately, on time, and in accordance with applicable laws and regulations.'
    },
    {
      step: '04',
      title: 'Monitoring',
      desc: 'We continuously monitor progress, evaluate outcomes, and provide ongoing support to ensure sustained compliance, improved performance, and timely adjustments whenever required.'
    }
  ];

  return (
    <div className="py-16 sm:py-24 bg-cloud">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section 1: Firm Narrative */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-rule/50">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl font-heading mb-6">
              About Us
            </h1>
            
            <div className="space-y-6 text-lg text-charcoal/90 leading-relaxed font-body">
              <p className="font-semibold text-navy">
                CONSULTax Associates is a professional tax consultancy and management accounting firm committed to providing reliable, practical, and result-oriented financial solutions.
              </p>
              <p>
                With over 25 years of combined professional experience, our team of qualified tax consultants and accounting professionals assists individuals, businesses, companies, and organizations in meeting their taxation and regulatory compliance requirements.
              </p>
              <p>
                We believe in professionalism, integrity, confidentiality, and timely service delivery. Our objective is to help clients remain fully compliant with applicable tax laws while minimizing tax risks through proper planning and expert guidance.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Why Choose Us */}
        <div className="mt-16 bg-navy text-white rounded-3xl p-8 sm:p-12 shadow-md">
          <h2 className="text-2xl font-bold font-heading mb-8 text-center sm:text-left">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange text-white">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-base font-semibold font-body text-white/90">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Our Service Approach */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold font-heading text-navy mb-8 text-center sm:text-left">
            OUR SERVICE APPROACH
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {serviceApproach.map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-rule/50 flex flex-col justify-between space-y-4 hover:border-orange hover:shadow-md transition-all duration-300">
                <div className="space-y-3">
                  <span className="text-3xl font-extrabold text-orange/30 font-body">{item.step}</span>
                  <h4 className="text-lg font-bold text-navy font-heading">{item.title}</h4>
                  <p className="text-sm text-charcoal/80 leading-relaxed font-body">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Block */}
        <div className="mt-20 text-center">
          <p className="text-base text-charcoal/80 font-body mb-4">
            Connect with our team to discuss your tax or accounting requirements.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-md bg-orange px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange/90 transition-colors"
          >
            Get in Touch
          </Link>
        </div>

      </div>
    </div>
  );
}
