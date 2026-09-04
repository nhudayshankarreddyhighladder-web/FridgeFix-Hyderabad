import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Clock, Phone, AlertCircle, Wrench, Check } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { LeadForm } from '../components/LeadForm';
import { FAQAccordion } from '../components/FAQAccordion';
import { CTASection } from '../components/CTASection';
import { ApplianceCategoryData } from '../types';
import { businessInfo } from '../data/siteData';

interface ApplianceCategoryPageProps {
  category: ApplianceCategoryData;
}

export const ApplianceCategoryPage: React.FC<ApplianceCategoryPageProps> = ({ category }) => {
  return (
    <div className="pt-24 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-blue-50/70 to-[#F8FAFC] py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Services', path: '/services' },
              { label: category.name },
            ]}
          />

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-[#0788C9] text-xs font-bold uppercase tracking-wider mb-3">
                Doorstep Service • Hyderabad
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A192F] tracking-tight">
                {category.name} In Hyderabad
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                {category.headline}. {category.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Inspection Fee</div>
                  <div className="text-xl font-bold text-[#0788C9]">{category.inspectionFee}</div>
                </div>

                <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Warranty</div>
                  <div className="text-xl font-bold text-emerald-600">{category.warranty} Coverage</div>
                </div>

                <a
                  href={`tel:${businessInfo.phoneRaw}`}
                  className="btn-outline py-2.5 px-4 text-xs sm:text-sm font-bold flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#0788C9]" />
                  <span>Call {businessInfo.phone}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <LeadForm
                compact
                defaultService={category.name}
                defaultAppliance={category.name}
                title={`Book ${category.name}`}
                subtitle={`Inspection starts at ${category.inspectionFee} • Adjusted in repair bill`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Services & Pricing */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-display text-3xl font-bold text-[#0A192F]">
              Popular {category.name} Packages
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Transparent upfront pricing with zero hidden charges. Inspection fee is fully waived when repair is undertaken.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {category.subServices.map((sub, idx) => (
              <div
                key={idx}
                className="bg-[#F8FAFC] rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  <div className="text-xs font-bold text-[#0788C9] uppercase tracking-wider mb-1">
                    Package {idx + 1}
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#0A192F] mb-2">
                    {sub.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {sub.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div className="text-base font-extrabold text-[#0A192F]">
                    {sub.price}
                  </div>
                  <Link
                    to="/book-service"
                    className="text-xs font-bold text-[#0788C9] hover:underline"
                  >
                    Book →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Problems Checklist */}
      <section className="py-16 bg-slate-50/70 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-[#0788C9]">
                Common Issues We Fix
              </div>
              <h2 className="font-display text-3xl font-bold text-[#0A192F]">
                Troubleshooting & On-Site Diagnostics
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our technicians are equipped with advanced multi-meters, pressure gauges, and brand-specific diagnostic tables to detect faults fast.
              </p>
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-[#0A192F]">Technician Visit Protocol:</div>
                <div>1. Thorough electrical and mechanical inspection</div>
                <div>2. Accurate cost estimation provided upfront</div>
                <div>3. Genuine spare part installation upon approval</div>
                <div>4. Performance testing and 90-day warranty slip</div>
              </div>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              {category.commonIssues.map((issue, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/70 p-4.5 flex items-start gap-3 shadow-xs"
                >
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">
                    {issue}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brands Serviced */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h3 className="font-display text-2xl font-bold text-[#0A192F]">
              Brands Serviced Under {category.name}
            </h3>
            <p className="mt-2 text-slate-600 text-sm">
              We service all popular residential models across Hyderabad.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {category.brands.map((b) => (
              <div
                key={b.name}
                className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-4 text-center hover:border-blue-300 transition-colors"
              >
                <div className="font-display font-bold text-base text-[#0A192F] mb-1">
                  {b.name}
                </div>
                <div className="text-[11px] text-slate-500 leading-tight">
                  {b.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FAQAccordion
        items={category.faqs}
        title={`${category.name} FAQs`}
        subtitle="Common questions about visit turnaround, parts replacement, and pricing."
      />

      <CTASection
        title={`Need your ${category.name.toLowerCase()} fixed today?`}
        description={`Technicians active across all Hyderabad localities. Inspection starts at ${category.inspectionFee} with a ${category.warranty} warranty.`}
      />
    </div>
  );
};
