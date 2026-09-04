import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, Phone, ArrowRight, CheckCircle2, MapPin, Wrench, Snowflake, Sparkles } from 'lucide-react';
import { Hero } from '../components/Hero';
import { ServiceCard } from '../components/ServiceCard';
import { BrandTabs } from '../components/BrandTabs';
import { TrustSection } from '../components/TrustSection';
import { HowItWorks } from '../components/HowItWorks';
import { Testimonials } from '../components/Testimonials';
import { FAQAccordion } from '../components/FAQAccordion';
import { CTASection } from '../components/CTASection';
import { LeadForm } from '../components/LeadForm';
import {
  businessInfo,
  refrigeratorServices,
  homeServiceCards,
  hyderabadAreas,
  otherApplianceServices,
} from '../data/siteData';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Urgent Booking Form & Quick Stats Strip */}
      <section className="py-12 bg-white relative z-20 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Quick Doorstep Dispatch
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0A192F] leading-snug">
                Need Fast Fridge or Appliance Service Today?
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Book in 60 seconds. A verified local engineer in your area will call to confirm your appointment. ₹199 inspection adjusted in final bill.
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span><strong>Same-day arrival:</strong> Within 60–90 mins across Hyderabad</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span><strong>90-Day warranty:</strong> Written guarantee on parts and service</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span><strong>Genuine spare parts:</strong> Direct OEM-compatible replacements</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Need immediate phone booking?</div>
                  <div className="text-base font-bold text-[#0788C9]">{businessInfo.phone}</div>
                </div>
                <a
                  href={`tel:${businessInfo.phoneRaw}`}
                  className="btn-primary py-2 px-4 text-xs font-bold"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call Now
                </a>
              </div>
            </div>

            {/* Quick Form */}
            <div className="lg:col-span-7">
              <LeadForm
                compact
                title="Book Doorstep Inspection (₹199)"
                subtitle="Select your issue and area — technician assigned instantly"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Specialized Refrigerator Categories (Single, Double, Side-by-Side, etc.) */}
      <section className="py-16 sm:py-24 bg-slate-50/70 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-[#0788C9] uppercase tracking-wider mb-3">
              Specialized Refrigerator Repairs
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0A192F] tracking-tight">
              Expert Repairs for Every Refrigerator Type
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              From single-door direct cool to high-end smart inverter and side-by-side units, our engineers diagnose and resolve faults precisely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {refrigeratorServices.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/refrigerator-repair"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0788C9] hover:text-[#065a96]"
            >
              <span>View full refrigerator repair troubleshooting and problem guide</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Common Refrigerator Problems & Diagnostics (8 Cards from reference site) */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-3">
              Fast Doorstep Solutions
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0A192F] tracking-tight">
              Common Refrigerator Issues We Fix Daily
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Whatever the symptom, our certified technicians carry diagnostic equipment and replacement parts on every visit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {homeServiceCards.map((card, idx) => (
              <ServiceCard key={idx} service={card} simple />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Other Home Appliance Repairs Banner */}
      <section className="py-16 bg-gradient-to-br from-[#0A192F] to-[#0f284d] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
                All Major Home Appliances
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Beyond Refrigerators — Full Appliance Repair in Hyderabad
              </h2>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>Explore all services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {otherApplianceServices.map((appliance) => (
              <Link
                key={appliance.id}
                to={`/${appliance.id}-repair`}
                className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-400/50 rounded-2xl p-5 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-blue-400 mb-1">Doorstep Service</div>
                  <h3 className="font-display text-base font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {appliance.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                    {appliance.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-semibold">{appliance.inspectionFee} Inspection</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Brands & Models Section (Interactive Category Tabs) */}
      <BrandTabs />

      {/* 7. Why Choose Us (Trust Benefits) */}
      <TrustSection />

      {/* 8. How Doorstep Service Works (5 Steps) */}
      <HowItWorks />

      {/* 9. Hyderabad Service Coverage Localities */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-[#0788C9] uppercase tracking-wider mb-3">
              Doorstep Coverage
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0A192F] tracking-tight">
              Serving All Localities Across Hyderabad
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Local technicians stationed in IT hubs, residential communities, and commercial districts for rapid 60–90 minute response.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {hyderabadAreas.map((area) => (
              <Link
                key={area}
                to="/areas"
                className="p-3.5 bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 rounded-xl text-center text-xs font-semibold text-slate-700 hover:text-[#0788C9] transition-all"
              >
                <MapPin className="w-3.5 h-3.5 mx-auto mb-1.5 text-[#0788C9]" />
                {area}
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/areas"
              className="btn-outline text-xs font-bold py-2.5 px-5"
            >
              Check All Service Locations in Hyderabad →
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Customer Testimonials */}
      <Testimonials />

      {/* 11. FAQ Accordion */}
      <FAQAccordion />

      {/* 12. Bottom CTA Banner */}
      <CTASection />
    </div>
  );
};
