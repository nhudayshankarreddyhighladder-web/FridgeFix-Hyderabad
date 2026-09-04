import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, Award, Users, Check, X, Phone, Calendar, HeartHandshake } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { TrustSection } from '../components/TrustSection';
import { HowItWorks } from '../components/HowItWorks';
import { CTASection } from '../components/CTASection';
import { LeadForm } from '../components/LeadForm';
import { businessInfo } from '../data/siteData';

export const WhyUsPage: React.FC = () => {
  const comparisonItems = [
    { feature: 'Inspection Fee', local: 'Vague or quoted arbitrarily on arrival', fridgefix: 'Fixed at ₹199, adjusted in repair bill' },
    { feature: 'Technician Background', local: 'Unverified freelance mechanics', fridgefix: 'Verified, background-checked certified engineers' },
    { feature: 'Spare Parts Quality', local: 'Unbranded or used parts often fitted', fridgefix: '100% Brand-compatible genuine OEM spares' },
    { feature: 'Post-Service Warranty', local: 'No written guarantee; hard to reach again', fridgefix: 'Written 90-day comprehensive service warranty' },
    { feature: 'Response Turnaround', local: 'Uncertain schedules, delays', fridgefix: 'Rapid 60–90 minute arrival across Hyderabad' },
    { feature: 'Customer Helpline', local: 'Single phone often switched off', fridgefix: '24×7 Active helpline & WhatsApp support' },
  ];

  return (
    <div className="pt-24 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-blue-50/70 to-[#F8FAFC] py-14 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <Breadcrumbs items={[{ label: 'Why Us / About' }]} />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-[#0788C9] text-xs font-bold uppercase tracking-wider mb-3">
            About FridgeFix Hyderabad
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A192F] tracking-tight">
            Hyderabad’s Most Trusted Doorstep Refrigerator & Appliance Service
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Founded with a clear mission: to eliminate the frustration of unverified appliance mechanics, surprise bills, and recurrent breakdowns through absolute transparency, prompt response, and ironclad 90-day warranties.
          </p>
        </div>
      </div>

      {/* Trust Highlights */}
      <TrustSection />

      {/* Comparison Table */}
      <section className="py-16 bg-slate-50/70 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl font-bold text-[#0A192F]">
              The FridgeFix Difference
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              See how our organized, certified service compares to typical unregulated street mechanics.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-100/80 text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200">
                    <th className="p-4 sm:p-5">Service Standard</th>
                    <th className="p-4 sm:p-5 text-slate-500">Unverified Street Mechanics</th>
                    <th className="p-4 sm:p-5 bg-blue-50/80 text-[#0788C9]">FridgeFix Hyderabad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 sm:p-5 font-semibold text-slate-800">
                        {item.feature}
                      </td>
                      <td className="p-4 sm:p-5 text-slate-500 text-xs sm:text-sm">
                        <div className="flex items-start gap-2">
                          <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          <span>{item.local}</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 bg-blue-50/30 font-medium text-slate-900 text-xs sm:text-sm">
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item.fridgefix}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Block */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LeadForm
            title="Book Your Verified Technician Visit"
            subtitle="₹199 doorstep inspection adjusted into final repair bill"
          />
        </div>
      </section>

      <HowItWorks />
      <CTASection />
    </div>
  );
};
