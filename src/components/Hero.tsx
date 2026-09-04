import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Calendar, ShieldCheck, Clock, Truck, Star, CheckCircle, Wrench } from 'lucide-react';
import { businessInfo } from '../data/siteData';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-24 bg-gradient-to-b from-[#E0F2FE]/50 via-[#F8FAFC] to-[#F8FAFC]">
      {/* Background glow effects */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-blue-300/20 via-sky-200/30 to-blue-200/20 blur-3xl -z-10 rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Location & Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-200 shadow-xs text-xs font-semibold text-slate-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Hyderabad • 24 × 7 On Duty</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0A192F] tracking-tight leading-[1.12]">
              Refrigerator Repair In{' '}
              <span className="text-[#0788C9] relative inline-block">
                Hyderabad
                <svg
                  className="absolute -bottom-1.5 left-0 w-full h-2 text-[#0788C9]/30"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Fast, reliable and affordable refrigerator repair at your doorstep. Verified technicians, upfront pricing from{' '}
              <strong className="text-[#0A192F]">₹199</strong>, and a{' '}
              <strong className="text-[#0A192F]">90-day service warranty</strong> across all Hyderabad areas.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/book-service"
                className="btn-orange w-full sm:w-auto py-3.5 px-8 text-base font-bold shadow-lg shadow-orange-500/25"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Service Now</span>
              </Link>

              <a
                href={`tel:${businessInfo.phoneRaw}`}
                className="btn-outline w-full sm:w-auto py-3.5 px-7 text-base font-bold shadow-xs hover:border-[#0788C9]"
              >
                <Phone className="w-5 h-5 text-[#0788C9]" />
                <span>CALL: {businessInfo.phone}</span>
              </a>
            </div>

            {/* Trust Bullet Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-200/80 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#0788C9] shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800">Doorstep</div>
                  <div className="text-[11px] text-slate-500">Fast arrival</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#0788C9] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800">Same-Day</div>
                  <div className="text-[11px] text-slate-500">Quick fix</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#0788C9] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800">90-Day</div>
                  <div className="text-[11px] text-slate-500">Warranty</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual & Floating Cards */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md">
              {/* Decorative Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/15 border-4 border-white bg-slate-100">
                <img
                  src="https://media.base44.com/images/public/6a99206d11fd25695dc5e1ec/8ddb111f3_generated_a95b13ba.jpg"
                  alt="Expert refrigerator repair technician working on fridge in Hyderabad"
                  className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-xs font-semibold uppercase tracking-wider text-blue-300">Certified Engineers</div>
                  <div className="text-sm font-bold">Doorstep Diagnosis Across All Hyderabad Localities</div>
                </div>
              </div>

              {/* Floating Price Pill */}
              <div className="absolute -top-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl shadow-slate-900/10 border border-blue-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
                  ₹
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Inspection Fee</div>
                  <div className="text-base font-extrabold text-[#0A192F]">Starts at ₹199</div>
                  <div className="text-[10px] text-emerald-600 font-medium">Adjusted in bill</div>
                </div>
              </div>

              {/* Floating Review Badge */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl shadow-slate-900/10 border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#0A192F]">
                    <span>4.9 / 5.0 Rating</span>
                  </div>
                  <div className="text-[11px] text-slate-500">12,500+ Hyderabad Repairs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
