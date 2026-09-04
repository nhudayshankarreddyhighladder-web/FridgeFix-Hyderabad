import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Wrench, ShieldCheck, Clock, Phone, ArrowRight, HelpCircle } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { LeadForm } from '../components/LeadForm';
import { FAQAccordion } from '../components/FAQAccordion';
import { CTASection } from '../components/CTASection';
import { refrigeratorServices, businessInfo } from '../data/siteData';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const service = refrigeratorServices.find((s) => s.slug === slug);

  if (!service) {
    return <Navigate to="/refrigerator-repair" replace />;
  }

  const otherServices = refrigeratorServices.filter((s) => s.slug !== slug);

  return (
    <div className="pt-24 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-blue-50/70 to-[#F8FAFC] py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Refrigerator Repair', path: '/refrigerator-repair' },
              { label: service.name },
            ]}
          />

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-[#0788C9] text-xs font-bold uppercase tracking-wider mb-3">
                Doorstep Repair • Hyderabad
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A192F] tracking-tight">
                {service.name} In Hyderabad
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                {service.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Inspection Starts At</div>
                  <div className="text-xl font-bold text-[#0788C9]">{service.price}</div>
                </div>

                <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Warranty Included</div>
                  <div className="text-xl font-bold text-emerald-600">90-Day Guarantee</div>
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
                defaultService={service.name}
                defaultAppliance="Refrigerator"
                title={`Book ${service.name}`}
                subtitle={`Starts at ${service.price} • Doorstep visit across Hyderabad`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Column 1: Problems */}
            <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200/70 p-6 sm:p-7">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#0A192F] mb-3">
                Common Problems We Fix
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-600">
                {service.problems.map((problem, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0"></span>
                    <span>{problem}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Symptoms */}
            <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200/70 p-6 sm:p-7">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#0A192F] mb-3">
                Warning Symptoms
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-600">
                {service.symptoms.map((symptom, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></span>
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Solutions */}
            <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200/70 p-6 sm:p-7">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#0A192F] mb-3">
                Our Doorstep Solutions
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-600">
                {service.solutions.map((solution, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                    <span>{solution}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs for this Service */}
      {service.faqs && service.faqs.length > 0 && (
        <FAQAccordion
          items={service.faqs}
          title={`${service.name} FAQs`}
          subtitle="Specific answers about turnaround time, repair procedures, and warranties."
        />
      )}

      {/* Explore Other Refrigerator Models */}
      <section className="py-14 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-display text-2xl font-bold text-[#0A192F] mb-6 text-center">
            Other Refrigerator Services
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherServices.slice(0, 3).map((s) => (
              <div
                key={s.slug}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-display font-bold text-base text-[#0A192F] mb-1.5">
                    {s.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    {s.short}
                  </p>
                </div>
                <Link
                  to={`/services/${s.slug}`}
                  className="text-xs font-bold text-[#0788C9] hover:underline flex items-center gap-1"
                >
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={`Need your ${service.name.toLowerCase()} fixed today?`}
        description="Technicians available across all Hyderabad zones. Inspection starts at ₹199 with a 90-day warranty."
      />
    </div>
  );
};
