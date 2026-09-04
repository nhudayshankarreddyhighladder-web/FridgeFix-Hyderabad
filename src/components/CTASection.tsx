import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Calendar, ArrowRight } from 'lucide-react';
import { businessInfo } from '../data/siteData';

interface CTASectionProps {
  title?: string;
  description?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({
  title = 'Is your refrigerator not cooling?',
  description = 'Book a verified technician now. Inspection starts at ₹199 with a 90-day service warranty — across all Hyderabad zones.',
}) => {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0788C9] to-[#065a96] px-6 py-14 sm:px-12 sm:py-16 text-center shadow-2xl shadow-blue-500/20">
          {/* Ambient light circles */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-16 w-72 h-72 bg-[#10B981]/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
              {title}
            </h2>

            <p className="mt-4 text-blue-50/90 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              {description}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                to="/book-service"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-[#0788C9] shadow-lg hover:scale-105 hover:bg-slate-50 transition-all duration-200"
              >
                <span>Book Service Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`tel:${businessInfo.phoneRaw}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-all duration-200"
              >
                <Phone className="w-4 h-4 text-white" />
                <span>CALL: {businessInfo.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
