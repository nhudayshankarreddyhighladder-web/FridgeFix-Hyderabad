import React, { useState } from 'react';
import { HelpCircle, Search, Phone, MessageSquare, ShieldCheck } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FAQAccordion } from '../components/FAQAccordion';
import { LeadForm } from '../components/LeadForm';
import { CTASection } from '../components/CTASection';
import { generalFaqs, businessInfo } from '../data/siteData';

export const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const extendedFaqs = [
    ...generalFaqs,
    {
      q: 'How does the ₹199 inspection fee adjustment work?',
      a: 'When our technician diagnoses your refrigerator or appliance on-site, they inspect the unit and provide an exact repair quotation. If you choose to proceed with the repair during that visit, the entire ₹199 inspection fee is deducted from the final repair invoice.',
    },
    {
      q: 'Are your technicians verified and background checked?',
      a: 'Yes, 100%. Every FridgeFix technician undergoes background verification, identity checks, and technical trade testing before joining our field fleet.',
    },
    {
      q: 'What if the problem reoccurs after the technician leaves?',
      a: 'All completed repairs carry a 90-day written service warranty. If the exact same issue reoccurs within 90 days, our technician visits your residence free of charge and resolves it under warranty.',
    },
    {
      q: 'Can I reschedule or cancel my service booking?',
      a: 'Yes. Simply call or WhatsApp our helpline at 7416 225 140 to update your preferred time slot or address with zero cancellation penalty.',
    },
    {
      q: 'What payment modes do you accept on-site?',
      a: 'We accept Google Pay, PhonePe, Paytm, UPI, Debit/Credit cards, Net Banking, and cash directly upon satisfactory job completion.',
    },
  ];

  const filteredFaqs = extendedFaqs.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-24 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-blue-50/70 to-[#F8FAFC] py-14 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <Breadcrumbs items={[{ label: 'Frequently Asked Questions' }]} />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-[#0788C9] text-xs font-bold uppercase tracking-wider mb-3">
            Help Center & Answers
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A192F] tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Everything you need to know about our inspection pricing, technician turnaround times, warranties, and doorstep appliance repairs across Hyderabad.
          </p>

          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions (e.g. warranty, fee, time)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:border-[#0788C9] focus:ring-4 focus:ring-blue-100 text-sm"
            />
          </div>
        </div>
      </div>

      {/* FAQs List */}
      <div className="py-12 bg-white">
        <FAQAccordion
          items={filteredFaqs}
          title={searchQuery ? `Search Results (${filteredFaqs.length})` : 'All Appliance & Repair Questions'}
          subtitle={searchQuery ? '' : 'Click any question to view the full answer.'}
        />
      </div>

      {/* Still Have Questions Box */}
      <section className="py-12 bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs">
            <h3 className="font-display text-2xl font-bold text-[#0A192F] mb-3">
              Still Have Questions? Talk To Us Directly
            </h3>
            <p className="text-slate-600 text-sm max-w-xl mx-auto mb-6">
              Our Hyderabad coordination center is on duty 24×7. Give us a call or send a WhatsApp message and an expert will advise you immediately.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`tel:${businessInfo.phoneRaw}`}
                className="btn-primary py-3 px-6 text-sm"
              >
                <Phone className="w-4 h-4" />
                Call Helpline: {businessInfo.phone}
              </a>
              <a
                href={`https://wa.me/${businessInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline py-3 px-6 text-sm flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366]" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};
