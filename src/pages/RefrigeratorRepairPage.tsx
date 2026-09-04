import React from 'react';
import { Link } from 'react-router-dom';
import { Snowflake, ShieldCheck, Clock, CheckCircle2, Phone, ArrowRight, AlertTriangle, Wrench, HelpCircle } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { LeadForm } from '../components/LeadForm';
import { ServiceCard } from '../components/ServiceCard';
import { FAQAccordion } from '../components/FAQAccordion';
import { CTASection } from '../components/CTASection';
import { refrigeratorServices, businessInfo } from '../data/siteData';

export const RefrigeratorRepairPage: React.FC = () => {
  const commonSymptoms = [
    {
      title: 'Fridge Not Cooling But Light is On',
      cause: 'Compressor relay failure, low refrigerant gas, or faulty thermostat.',
      action: 'Technician tests compressor start components and gas pressure on-site.',
    },
    {
      title: 'Freezer Works, But Lower Fridge is Warm',
      cause: 'Defrost heater/sensor failure, iced evaporator coil, or dead fan motor.',
      action: 'Defrost cycle diagnostics and fan motor replacement within 60 mins.',
    },
    {
      title: 'Excessive Ice Accumulation in Freezer',
      cause: 'Damaged magnetic door gasket, bimetal thermostat failure, or defrost timer fault.',
      action: 'Door seal reseal or bimetal replacement with original OEM parts.',
    },
    {
      title: 'Water Leaking on the Kitchen Floor',
      cause: 'Blocked drain hole, cracked drain pan, or defrost drain tube clogged with ice.',
      action: 'High-pressure drain flush and pan inspection.',
    },
    {
      title: 'Loud Humming, Clicking or Vibrating Noise',
      cause: 'Compressor overload protector tripping, fan blade obstruction, or failing motor bearing.',
      action: 'Capacitor/relay replacement and fan clearance check.',
    },
    {
      title: 'Fridge Tripping MCB / Power Supply',
      cause: 'Compressor motor winding short circuit, earthing fault, or PCB surge damage.',
      action: 'Electrical insulation test and inverter board diagnostics.',
    },
  ];

  return (
    <div className="pt-24 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-blue-50/70 to-[#F8FAFC] py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Refrigerator Repair' }]} />

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-[#0788C9] text-xs font-bold uppercase tracking-wider mb-3">
                <Snowflake className="w-3.5 h-3.5" />
                Specialist Refrigerator Care
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A192F] tracking-tight">
                Refrigerator Repair In Hyderabad
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                Expert doorstep service for all single-door, double-door, side-by-side, frost-free, and inverter refrigerators. Verified technicians with ₹199 inspection and 90-day warranty.
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200">
                  <Clock className="w-4 h-4 text-[#0788C9]" />
                  <span>60–90 Min Arrival</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>90-Day Guarantee</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200">
                  <Wrench className="w-4 h-4 text-amber-500" />
                  <span>Genuine Spare Parts</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <LeadForm
                compact
                defaultService="General Refrigerator Repair"
                defaultAppliance="Refrigerator"
                title="Book Refrigerator Service"
                subtitle="Inspection ₹199 adjusted in final invoice"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Refrigerator Types Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-display text-3xl font-bold text-[#0A192F]">
              Select Your Refrigerator Model For Tailored Repair
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Each cooling design requires specialized diagnostics. Click any model to view common faults and pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {refrigeratorServices.map((svc) => (
              <ServiceCard key={svc.slug} service={svc} />
            ))}
          </div>
        </div>
      </section>

      {/* Problem Diagnosis Guide */}
      <section className="py-16 bg-slate-50/70 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-[#0788C9] mb-1">
              Diagnostic Guide
            </div>
            <h2 className="font-display text-3xl font-bold text-[#0A192F]">
              Common Refrigerator Symptoms & What They Mean
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              Use our quick diagnostic breakdown to understand what is causing your refrigerator fault before the technician arrives.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {commonSymptoms.map((symptom, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-2.5 text-rose-600 font-bold text-sm mb-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{symptom.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-3">
                    <strong className="text-slate-800">Probable Cause:</strong> {symptom.cause}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-xs text-[#0788C9] font-medium">
                  <strong>Our Fix:</strong> {symptom.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Supported */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-display text-2xl font-bold text-[#0A192F] mb-4">
            Brands We Repair Across Hyderabad
          </h3>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto mb-8">
            LG, Samsung, Whirlpool, Godrej, Haier, Bosch, Panasonic, Videocon, Hitachi, IFB, Voltas Beko, Electrolux, Kelvinator, Siemens, and all local & imported refrigerator brands.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {['LG', 'Samsung', 'Whirlpool', 'Godrej', 'Haier', 'Bosch', 'Panasonic', 'Hitachi', 'IFB', 'Voltas Beko', 'Siemens', 'Electrolux'].map((b) => (
              <span
                key={b}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                {b} Refrigerator
              </span>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Fridge warming up? Don't let your food spoil."
        description="Book immediate doorstep refrigerator repair across Hyderabad. Inspection fee starts at ₹199 and is adjusted into your final repair bill."
      />
    </div>
  );
};
