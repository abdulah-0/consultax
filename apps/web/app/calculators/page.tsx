'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { calculateSalaryTax } from '../../lib/calculators/salary';
import { calculateBusinessTax } from '../../lib/calculators/business';
import { calculateRentalIndividualTax } from '../../lib/calculators/rentalIndividual';
import { calculateRentalCompanyTax } from '../../lib/calculators/rentalCompany';
import { formatPKR } from '../../lib/calculators/format';

export default function Calculators() {
  const [activeTab, setActiveTab] = useState<'salary' | 'business' | 'rental-ind' | 'rental-comp'>('salary');

  // 1. Salary Inputs
  const [salaryInputs, setSalaryInputs] = useState({
    monthlyBasicPay: '',
    monthlyMedicalAllowance: '',
    monthlyGrossPay: '',
  });

  // 2. Business Inputs
  const [businessInput, setBusinessInput] = useState('');

  // 3. Rental Individual Inputs
  const [rentalIndInput, setRentalIndInput] = useState('');

  // 4. Rental Company Inputs
  const [rentalCompInput, setRentalCompInput] = useState('');

  const disclaimer = "This is an estimate for informational purposes only and does not constitute tax advice. Actual liability may vary. Consult our team for an exact calculation.";

  // Calculate Salary Results
  const parseNum = (val: string) => {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  };

  const salaryResult = calculateSalaryTax({
    monthlyBasicPay: parseNum(salaryInputs.monthlyBasicPay),
    monthlyMedicalAllowance: parseNum(salaryInputs.monthlyMedicalAllowance),
    monthlyGrossPay: parseNum(salaryInputs.monthlyGrossPay),
  });

  // Calculate Business Results
  const businessResult = calculateBusinessTax(parseNum(businessInput));

  // Calculate Rental Individual Results
  const rentalIndResult = calculateRentalIndividualTax(parseNum(rentalIndInput));

  // Calculate Rental Company Results
  const rentalCompResult = calculateRentalCompanyTax(parseNum(rentalCompInput));

  return (
    <div className="py-16 sm:py-24 bg-cloud">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl font-heading">
            FBR Tax Calculators
          </h1>
          <p className="mt-4 text-lg text-charcoal/80 font-body">
            Estimate your tax liability instantly using our calculators configured with current Federal Board of Revenue (FBR) tax rates (FY 2026-27).
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center border-b border-rule mb-12 gap-2">
          {[
            { id: 'salary', name: 'Tax on Salary Income' },
            { id: 'business', name: 'Tax on Non-Salary (Business Income)' },
            { id: 'rental-ind', name: 'Tax on Rental Income' },
            { id: 'rental-comp', name: 'Tax on Rental Income (Company)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 font-heading cursor-pointer ${
                activeTab === tab.id
                  ? 'border-orange text-orange font-bold bg-white/50 rounded-t-lg'
                  : 'border-transparent text-charcoal/70 hover:text-navy hover:border-rule'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Calculator Cards */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'salary' && (
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-rule/50 grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Inputs */}
              <div className="md:col-span-6 space-y-6">
                <h3 className="text-xl font-bold text-navy font-heading">Salaried Tax Parameters</h3>
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2 font-body">Monthly Basic Pay (PKR)</label>
                  <input
                    type="number"
                    value={salaryInputs.monthlyBasicPay}
                    onChange={(e) => setSalaryInputs({ ...salaryInputs, monthlyBasicPay: e.target.value })}
                    placeholder="e.g. 65000"
                    className="w-full rounded-md border border-rule px-4 py-3 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm font-body"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2 font-body">Monthly Medical Allowance (PKR)</label>
                  <input
                    type="number"
                    value={salaryInputs.monthlyMedicalAllowance}
                    onChange={(e) => setSalaryInputs({ ...salaryInputs, monthlyMedicalAllowance: e.target.value })}
                    placeholder="e.g. 6000"
                    className="w-full rounded-md border border-rule px-4 py-3 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm font-body"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2 font-body">Monthly Gross Pay (PKR)</label>
                  <input
                    type="number"
                    value={salaryInputs.monthlyGrossPay}
                    onChange={(e) => setSalaryInputs({ ...salaryInputs, monthlyGrossPay: e.target.value })}
                    placeholder="e.g. 150000"
                    className="w-full rounded-md border border-rule px-4 py-3 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm font-body"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="md:col-span-6 flex flex-col justify-between bg-cloud/50 rounded-2xl p-6 border border-rule/50">
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-charcoal/60 uppercase tracking-wider font-heading">Calculated Estimates</h4>
                  <div>
                    <p className="text-xs text-charcoal/60 font-body">Annual Taxable Income</p>
                    <p className="text-lg font-bold text-navy font-mono tabular-nums">{formatPKR(salaryResult.taxableIncomeAnnual)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-charcoal/60 font-body">Annual Tax Liability</p>
                    <p className="text-lg font-bold text-navy font-mono tabular-nums">{formatPKR(salaryResult.taxAnnual)}</p>
                  </div>
                  <div className="pt-4 border-t border-rule">
                    <p className="text-sm font-semibold text-orange font-body">Estimated Monthly Tax</p>
                    <p className="text-3xl font-extrabold text-navy font-mono tabular-nums">{formatPKR(salaryResult.taxMonthly, true)}</p>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <p className="text-xs text-charcoal/50 leading-relaxed italic font-body">{disclaimer}</p>
                  <Link
                    href={`/contact?calculator=Salary+Tax&estimate=${encodeURIComponent(formatPKR(salaryResult.taxMonthly, true))}`}
                    className="block text-center rounded-md bg-orange py-3.5 text-sm font-semibold text-white hover:bg-orange/95 transition-colors cursor-pointer"
                  >
                    Get an Exact Calculation
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'business' && (
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-rule/50 grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Inputs */}
              <div className="md:col-span-6 space-y-6">
                <h3 className="text-xl font-bold text-navy font-heading">Business Tax Parameters</h3>
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2 font-body">Monthly Business Income / Net Profits (PKR)</label>
                  <input
                    type="number"
                    value={businessInput}
                    onChange={(e) => setBusinessInput(e.target.value)}
                    placeholder="e.g. 150000"
                    className="w-full rounded-md border border-rule px-4 py-3 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm font-body"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="md:col-span-6 flex flex-col justify-between bg-cloud/50 rounded-2xl p-6 border border-rule/50">
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-charcoal/60 uppercase tracking-wider font-heading">Calculated Estimates</h4>
                  <div>
                    <p className="text-xs text-charcoal/60 font-body">Annual taxable Income</p>
                    <p className="text-lg font-bold text-navy font-mono tabular-nums">{formatPKR(businessResult.incomeAnnual)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-charcoal/60 font-body">Annual Tax Liability</p>
                    <p className="text-lg font-bold text-navy font-mono tabular-nums">{formatPKR(businessResult.taxAnnual)}</p>
                  </div>
                  <div className="pt-4 border-t border-rule">
                    <p className="text-sm font-semibold text-orange font-body">Estimated Monthly Tax</p>
                    <p className="text-3xl font-extrabold text-navy font-mono tabular-nums">{formatPKR(businessResult.taxMonthly, true)}</p>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <p className="text-xs text-charcoal/50 leading-relaxed italic font-body">{disclaimer}</p>
                  <Link
                    href={`/contact?calculator=Non-Salary+Business+Tax&estimate=${encodeURIComponent(formatPKR(businessResult.taxMonthly, true))}`}
                    className="block text-center rounded-md bg-orange py-3.5 text-sm font-semibold text-white hover:bg-orange/95 transition-colors cursor-pointer"
                  >
                    Get an Exact Calculation
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rental-ind' && (
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-rule/50 grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Inputs */}
              <div className="md:col-span-6 space-y-6">
                <h3 className="text-xl font-bold text-navy font-heading">Individual Rental parameters</h3>
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2 font-body">Monthly Rental Income (PKR)</label>
                  <input
                    type="number"
                    value={rentalIndInput}
                    onChange={(e) => setRentalIndInput(e.target.value)}
                    placeholder="e.g. 150000"
                    className="w-full rounded-md border border-rule px-4 py-3 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm font-body"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="md:col-span-6 flex flex-col justify-between bg-cloud/50 rounded-2xl p-6 border border-rule/50">
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-charcoal/60 uppercase tracking-wider font-heading">Calculated Estimates</h4>
                  <div>
                    <p className="text-xs text-charcoal/60 font-body">Annual Rental Income</p>
                    <p className="text-lg font-bold text-navy font-mono tabular-nums">{formatPKR(rentalIndResult.rentalIncomeAnnual)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-charcoal/60 font-body">Annual Tax Liability</p>
                    <p className="text-lg font-bold text-navy font-mono tabular-nums">{formatPKR(rentalIndResult.taxAnnual)}</p>
                  </div>
                  <div className="pt-4 border-t border-rule">
                    <p className="text-sm font-semibold text-orange font-body">Estimated Monthly Tax</p>
                    <p className="text-3xl font-extrabold text-navy font-mono tabular-nums">{formatPKR(rentalIndResult.taxMonthly, true)}</p>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <p className="text-xs text-charcoal/50 leading-relaxed italic font-body">{disclaimer}</p>
                  <Link
                    href={`/contact?calculator=Individual+Rental+Tax&estimate=${encodeURIComponent(formatPKR(rentalIndResult.taxMonthly, true))}`}
                    className="block text-center rounded-md bg-orange py-3.5 text-sm font-semibold text-white hover:bg-orange/95 transition-colors cursor-pointer"
                  >
                    Get an Exact Calculation
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rental-comp' && (
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-rule/50 grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Inputs */}
              <div className="md:col-span-6 space-y-6">
                <h3 className="text-xl font-bold text-navy font-heading">Company Rental parameters</h3>
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2 font-body">Monthly Corporate Rental Income (PKR)</label>
                  <input
                    type="number"
                    value={rentalCompInput}
                    onChange={(e) => setRentalCompInput(e.target.value)}
                    placeholder="e.g. 150000"
                    className="w-full rounded-md border border-rule px-4 py-3 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm font-body"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="md:col-span-6 flex flex-col justify-between bg-cloud/50 rounded-2xl p-6 border border-rule/50">
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-charcoal/60 uppercase tracking-wider font-heading">Calculated Estimates</h4>
                  <div>
                    <p className="text-xs text-charcoal/60 font-body">Annual Corporate Rental Income</p>
                    <p className="text-lg font-bold text-navy font-mono tabular-nums">{formatPKR(rentalCompResult.rentalIncomeAnnual)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-charcoal/60 font-body">Annual Tax Liability</p>
                    <p className="text-lg font-bold text-navy font-mono tabular-nums">{formatPKR(rentalCompResult.taxAnnual)}</p>
                  </div>
                  <div className="pt-4 border-t border-rule">
                    <p className="text-sm font-semibold text-orange font-body">Estimated Monthly Tax</p>
                    <p className="text-3xl font-extrabold text-navy font-mono tabular-nums">{formatPKR(rentalCompResult.taxMonthly, true)}</p>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <p className="text-xs text-charcoal/50 leading-relaxed italic font-body">{disclaimer}</p>
                  <Link
                    href={`/contact?calculator=Company+Rental+Tax&estimate=${encodeURIComponent(formatPKR(rentalCompResult.taxMonthly, true))}`}
                    className="block text-center rounded-md bg-orange py-3.5 text-sm font-semibold text-white hover:bg-orange/95 transition-colors cursor-pointer"
                  >
                    Get an Exact Calculation
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
