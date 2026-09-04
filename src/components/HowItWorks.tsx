import React from 'react';
import { CalendarCheck, UserCheck, Search, Wrench, ShieldCheck, LucideIcon } from 'lucide-react';
import { howItWorksSteps } from '../data/siteData';

const iconMap: Record<string, LucideIcon> = {
  CalendarCheck,
  UserCheck,
  Search,
  Wrench,
  ShieldCheck,
};

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#F8FAFC] to-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-[#0788C9] uppercase tracking-wider mb-3">
            Simple 5-Step Process
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0A192F] tracking-tight">
            How Doorstep Service Works
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            From booking to completed repair, here is how we get your appliances running smoothly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative">
          {howItWorksSteps.map((step, idx) => {
            const Icon = iconMap[step.iconName] || CalendarCheck;
            return (
              <div
                key={step.step}
                className="relative bg-white rounded-2xl border border-slate-100 p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group"
              >
                {/* Step badge */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0788C9] to-[#065a96] text-white flex items-center justify-center font-display font-extrabold text-sm shadow-md shadow-blue-500/20 mb-4">
                  {step.step}
                </div>

                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0788C9] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="font-display text-base font-bold text-[#0A192F] mb-2">
                  {step.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
