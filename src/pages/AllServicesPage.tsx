import React from 'react';
import { Link } from 'react-router-dom';
import { Snowflake, Wind, RotateCw, Zap, Droplet, Tv, ArrowRight, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ServiceCard } from '../components/ServiceCard';
import { CTASection } from '../components/CTASection';
import { refrigeratorServices, otherApplianceServices } from '../data/siteData';

export const AllServicesPage: React.FC = () => {
  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-50/70 to-[#F8FAFC] py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <Breadcrumbs items={[{ label: 'All Services' }]} />
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A192F] tracking-tight">
            Comprehensive Appliance Repair Services In Hyderabad
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            From single-door and smart inverter refrigerators to air conditioners, washing machines, microwaves, RO systems, and televisions. Doorstep doorstep inspection from ₹199 with a 90-day warranty.
          </p>
        </div>
      </div>

      {/* Refrigerator Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mb-10 pb-4 border-b border-slate-100">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#0788C9] mb-1">
                Primary Specialty
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A192F]">
                Refrigerator & Freezer Repairs
              </h2>
            </div>
            <Link
              to="/refrigerator-repair"
              className="text-xs sm:text-sm font-bold text-[#0788C9] hover:underline"
            >
              View Detailed Guide →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {refrigeratorServices.map((svc) => (
              <ServiceCard key={svc.slug} service={svc} />
            ))}
          </div>
        </div>
      </section>

      {/* Other Appliances Section */}
      <section className="py-16 bg-slate-50/70 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
              Multi-Appliance Division
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A192F]">
              Other Major Home Appliances
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              Same-day service with verified technicians and genuine spare parts across Hyderabad.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherApplianceServices.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-xl transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0788C9] bg-blue-50 px-2.5 py-1 rounded-lg">
                      Doorstep Fix
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      {cat.inspectionFee} Inspection
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-[#0A192F] mb-2 group-hover:text-[#0788C9] transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  <div className="space-y-1.5 mb-5 text-xs text-slate-500">
                    {cat.commonIssues.slice(0, 3).map((issue, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">90-Day Warranty</span>
                  <Link
                    to={`/${cat.id}-repair`}
                    className="btn-primary py-2 px-4 text-xs font-bold"
                  >
                    <span>View Pricing</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};
