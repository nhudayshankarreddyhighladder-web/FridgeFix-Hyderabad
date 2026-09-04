import React from 'react';
import { ShieldCheck, Clock, PhoneCall, Receipt, PackageCheck, BadgeCheck, LucideIcon } from 'lucide-react';
import { trustBenefits } from '../data/siteData';

const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  Clock,
  PhoneCall,
  Receipt,
  PackageCheck,
  BadgeCheck,
};

export const TrustSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-3">
            Why Hyderabad Trusts FridgeFix
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0A192F] tracking-tight">
            Reliable Refrigerator & Appliance Repair You Can Count On
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            No guesswork, no hidden charges. Just experienced local technicians arriving on time with transparent pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {trustBenefits.map((benefit) => {
            const Icon = iconMap[benefit.iconName] || ShieldCheck;
            return (
              <div
                key={benefit.title}
                className="bg-white rounded-2xl border border-slate-100 p-7 shadow-xs hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0788C9] group-hover:bg-[#0788C9] group-hover:text-white transition-colors flex items-center justify-center mb-5 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#0A192F] mb-2 group-hover:text-[#0788C9] transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
