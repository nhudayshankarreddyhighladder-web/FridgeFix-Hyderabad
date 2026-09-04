import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { testimonials } from '../data/siteData';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-3">
            Real Hyderabad Reviews
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0A192F] tracking-tight">
            What Hyderabad Residents Say About Us
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Over 12,000 satisfied households across Hyderabad rely on FridgeFix for quick, honest appliance troubleshooting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((review, i) => (
            <div
              key={i}
              className="bg-[#F8FAFC] rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(review.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-slate-700 leading-relaxed italic mb-4">
                  "{review.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/70">
                <div className="font-display font-bold text-sm text-[#0A192F]">
                  {review.name}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {review.area}
                </div>
                <div className="text-[11px] text-[#0788C9] font-medium mt-1">
                  {review.service}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
