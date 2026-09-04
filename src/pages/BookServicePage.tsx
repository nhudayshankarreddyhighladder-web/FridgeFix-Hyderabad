import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { LeadForm } from '../components/LeadForm';
import { CTASection } from '../components/CTASection';
import { ShieldCheck, Clock, Phone, CheckCircle2, Star, Wrench } from 'lucide-react';
import { businessInfo } from '../data/siteData';

export const BookServicePage: React.FC = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="bg-gradient-to-b from-blue-50/70 to-[#F8FAFC] py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Book a Service' }]} />

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-[#0788C9] text-xs font-bold uppercase tracking-wider mb-3">
              Doorstep Service Booking
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A192F] tracking-tight">
              Book A Service Technician In Hyderabad
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Schedule your doorstep inspection in under 2 minutes. Verified technicians arrive equipped with spare parts and diagnostic equipment across all Hyderabad areas.
            </p>
          </div>
        </div>
      </div>

      <div className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Left: Lead Form */}
            <div className="lg:col-span-8">
              <LeadForm
                title="Book Doorstep Inspection"
                subtitle="Inspection starts at ₹199 • 90-Day Warranty"
              />
            </div>

            {/* Right: Guarantee & Information Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Pricing breakdown box */}
              <div className="bg-[#F8FAFC] rounded-3xl border border-slate-200/80 p-6 space-y-4">
                <h3 className="font-display text-lg font-bold text-[#0A192F]">
                  Service Transparency
                </h3>

                <div className="space-y-3 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span>Doorstep Inspection Fee</span>
                    <strong className="text-slate-900 font-extrabold">₹199</strong>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span>Fee Adjustment</span>
                    <span className="text-emerald-600 font-bold">100% In Repair Bill</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span>Post-Repair Warranty</span>
                    <strong className="text-slate-900 font-extrabold">90 Days Written</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Technician Arrival</span>
                    <span className="text-[#0788C9] font-bold">60–90 Mins</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-[#0788C9] leading-relaxed">
                  💡 <strong>No surprises:</strong> You will receive a complete, itemized cost estimate before any repair work begins.
                </div>
              </div>

              {/* Instant Call Box */}
              <div className="bg-gradient-to-br from-[#0788C9] to-[#065a96] text-white rounded-3xl p-6 shadow-xl shadow-blue-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-blue-100 font-medium uppercase tracking-wider">
                      Need Emergency Fix?
                    </div>
                    <div className="text-lg font-bold">Call 24×7 Directly</div>
                  </div>
                </div>

                <p className="text-xs text-blue-50/90 leading-relaxed mb-4">
                  Prefer speaking with a human coordinator right now? Call our direct Hyderabad dispatcher line.
                </p>

                <a
                  href={`tel:${businessInfo.phoneRaw}`}
                  className="w-full bg-white text-[#0788C9] hover:bg-slate-50 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>{businessInfo.phone}</span>
                </a>
              </div>

              {/* Rating Trust Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 flex items-center gap-4 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                  <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#0A192F]">
                    4.9 / 5.0 Star Rating
                  </div>
                  <div className="text-xs text-slate-500">
                    Trusted by 12,500+ households across Hyderabad
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
