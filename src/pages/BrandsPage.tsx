import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { BrandTabs } from '../components/BrandTabs';
import { LeadForm } from '../components/LeadForm';
import { CTASection } from '../components/CTASection';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export const BrandsPage: React.FC = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="bg-gradient-to-b from-blue-50/70 to-[#F8FAFC] py-14 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <Breadcrumbs items={[{ label: 'Brands & Models' }]} />
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A192F] tracking-tight">
            Appliance Brands We Repair In Hyderabad
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            From premier European multi-door refrigerators and Japanese inverter air conditioners to classic domestic single-door units. We stock authentic manufacturer-grade components for all major brands.
          </p>
        </div>
      </div>

      <BrandTabs />

      {/* Spare parts policy banner */}
      <section className="py-14 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50/70 border border-blue-100 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-[#0788C9] text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/25">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0A192F] mb-2">
                100% Genuine Spare Parts Guarantee
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We never compromise on system longevity. All replaced compressors, capacitors, PCB boards, fan motors, defrost bimetals, thermostats, and sensors carry warranty certification matching OEM standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LeadForm
            title="Book Repair for Your Specific Brand"
            subtitle="Technician carries brand-appropriate diagnostic gear"
          />
        </div>
      </section>

      <CTASection />
    </div>
  );
};
