import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { generalFaqs } from '../data/siteData';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQAccordionProps {
  items?: FAQItem[];
  title?: string;
  subtitle?: string;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
  items = generalFaqs,
  title = 'Frequently Asked Questions',
  subtitle = 'Find answers to common questions regarding our inspection charges, turnaround time, warranty, and technician visits.',
}) => {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggleItem = (idx: number) => {
    if (openIndices.includes(idx)) {
      setOpenIndices(openIndices.filter((i) => i !== idx));
    } else {
      setOpenIndices([...openIndices, idx]);
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-[#0788C9] uppercase tracking-wider mb-3">
            Got Questions?
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0A192F] tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              {subtitle}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => {
            const isOpen = openIndices.includes(idx);
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-display font-semibold text-[#0A192F] text-base hover:text-[#0788C9] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#0788C9] shrink-0" />
                    <span>{item.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#0788C9]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-50">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
