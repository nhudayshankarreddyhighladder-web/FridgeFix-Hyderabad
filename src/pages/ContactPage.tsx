import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { LeadForm } from '../components/LeadForm';
import { CTASection } from '../components/CTASection';
import { businessInfo } from '../data/siteData';

export const ContactPage: React.FC = () => {
  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-50/70 to-[#F8FAFC] py-14 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <Breadcrumbs items={[{ label: 'Contact Us' }]} />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-[#0788C9] text-xs font-bold uppercase tracking-wider mb-3">
            Get In Touch
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A192F] tracking-tight">
            Contact FridgeFix Hyderabad
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Need urgent refrigerator or home appliance repair? Our Hyderabad central dispatch helpline is operational 24 hours a day, 7 days a week.
          </p>
        </div>
      </div>

      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Contact Details Column */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#0A192F] mb-4">
                  Hyderabad Service Headquarters
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  While our regional mobile technicians are stationed across Kukatpally, Madhapur, Banjara Hills, Secunderabad, and Dilsukhnagar, our primary dispatch center coordinates all field operations.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                <a
                  href={`tel:${businessInfo.phoneRaw}`}
                  className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200/80 hover:border-[#0788C9] hover:shadow-md transition-all bg-[#F8FAFC]"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-100/70 text-[#0788C9] flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      24×7 Emergency Helpline
                    </div>
                    <div className="font-display font-bold text-lg text-[#0A192F]">
                      {businessInfo.phone}
                    </div>
                    <div className="text-xs text-emerald-600 font-medium mt-0.5">
                      Immediate response
                    </div>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${businessInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200/80 hover:border-emerald-500 hover:shadow-md transition-all bg-[#F8FAFC]"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100/70 text-[#25D366] flex items-center justify-center shrink-0">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      WhatsApp Quick Booking
                    </div>
                    <div className="font-display font-bold text-lg text-[#0A192F]">
                      +91 {businessInfo.phoneRaw}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Share photo/video of appliance issue
                    </div>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200/80 bg-[#F8FAFC]">
                  <div className="w-12 h-12 rounded-xl bg-slate-200/70 text-slate-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Head Office Address
                    </div>
                    <div className="text-sm font-semibold text-[#0A192F] mt-0.5 leading-snug">
                      {businessInfo.address}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      (Field technicians dispatched directly to your doorstep)
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200/80 bg-[#F8FAFC]">
                  <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Operating Hours
                    </div>
                    <div className="text-sm font-bold text-[#0A192F] mt-0.5">
                      24 Hours / 7 Days • Including Sundays & Holidays
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lead Booking Form Column */}
            <div className="lg:col-span-7">
              <LeadForm
                title="Send A Direct Service Enquiry"
                subtitle="A coordinator will call you back within 15 minutes"
              />
            </div>
          </div>
        </div>
      </div>

      <CTASection />
    </div>
  );
};
