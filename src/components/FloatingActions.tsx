import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Calendar, MessageCircle } from 'lucide-react';
import { businessInfo } from '../data/siteData';

export const FloatingActions: React.FC = () => {
  const location = useLocation();

  // WhatsApp link with friendly preset message
  const whatsappUrl = `https://wa.me/${businessInfo.whatsapp}?text=${encodeURIComponent(
    'Hi FridgeFix Hyderabad, I would like to book a doorstep appliance repair inspection in Hyderabad.'
  )}`;

  return (
    <>
      {/* Floating WhatsApp Action Button (bottom left on mobile, bottom right on desktop above popup) */}
      <div className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-40">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-lg shadow-emerald-600/30 hover:scale-105 transition-all duration-200 group"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          <span className="hidden sm:inline font-semibold text-sm">WhatsApp 24×7</span>
        </a>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2.5 flex items-center gap-2 shadow-2xl">
        <a
          href={`tel:${businessInfo.phoneRaw}`}
          className="flex-1 flex items-center justify-center gap-2 bg-[#0788C9] text-white py-3 px-3 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all"
        >
          <Phone className="w-4 h-4" />
          <span>Call: {businessInfo.phone}</span>
        </a>

        {location.pathname !== '/book-service' && (
          <Link
            to="/book-service"
            className="flex-1 flex items-center justify-center gap-2 bg-[#EA580C] text-white py-3 px-3 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Book ₹199</span>
          </Link>
        )}
      </div>
    </>
  );
};
