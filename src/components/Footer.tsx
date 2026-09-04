import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Wrench, ChevronRight } from 'lucide-react';
import { businessInfo, refrigeratorServices, hyderabadAreas } from '../data/siteData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A192F] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0788C9] to-[#065a96] flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <div className="font-display font-bold text-white text-lg tracking-tight">
                  FridgeFix Hyderabad
                </div>
                <div className="text-xs text-blue-400 font-medium">
                  {businessInfo.tagline} • All Hyderabad Zones
                </div>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed">
              Fast, reliable and affordable refrigerator & home appliance repair in Hyderabad. Verified technicians, ₹199 inspection fee, 90-day warranty, and doorstep same-day service.
            </p>

            <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-slate-300">
              <a href={`tel:${businessInfo.phoneRaw}`} className="flex items-center gap-3 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-[#0788C9] shrink-0" />
                <span>Helpline: <strong>{businessInfo.phone}</strong></span>
              </a>
              <a href={`mailto:${businessInfo.email}`} className="flex items-center gap-3 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-[#0788C9] shrink-0" />
                <span>{businessInfo.email}</span>
              </a>
              <div className="flex items-start gap-3 text-slate-400">
                <MapPin className="w-4 h-4 text-[#0788C9] shrink-0 mt-0.5" />
                <span>{businessInfo.address}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Clock className="w-4 h-4 text-[#0788C9] shrink-0" />
                <span>Operating Hours: 24 Hours / 7 Days</span>
              </div>
            </div>
          </div>

          {/* Column 2: Refrigerator Services */}
          <div>
            <h4 className="font-display text-base font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0788C9]"></span>
              Refrigerator Services
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {refrigeratorServices.map((svc) => (
                <li key={svc.slug}>
                  <Link
                    to={`/services/${svc.slug}`}
                    className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    {svc.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/refrigerator-repair"
                  className="text-blue-400 font-semibold hover:text-blue-300 inline-flex items-center gap-1 mt-1"
                >
                  All Refrigerator Services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: All Home Appliances */}
          <div>
            <h4 className="font-display text-base font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              Appliance Services
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/ac-repair" className="hover:text-white inline-flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  AC Repair & Gas Refill
                </Link>
              </li>
              <li>
                <Link to="/washing-machine-repair" className="hover:text-white inline-flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  Washing Machine Repair
                </Link>
              </li>
              <li>
                <Link to="/microwave-repair" className="hover:text-white inline-flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  Microwave Oven Repair
                </Link>
              </li>
              <li>
                <Link to="/ro-repair" className="hover:text-white inline-flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  RO / Water Purifier Service
                </Link>
              </li>
              <li>
                <Link to="/tv-repair" className="hover:text-white inline-flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  LED & Smart TV Repair
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-emerald-400 font-semibold hover:text-emerald-300 inline-flex items-center gap-1 mt-1">
                  Full Services Directory →
                </Link>
              </li>
            </ul>

            <h4 className="font-display text-base font-semibold text-white mt-6 mb-3 flex items-center gap-2">
              Quick Links
            </h4>
            <div className="flex flex-wrap gap-2 text-xs text-slate-400">
              <Link to="/why-us" className="hover:text-white">Why Choose Us</Link> •
              <Link to="/brands" className="hover:text-white">Brands</Link> •
              <Link to="/areas" className="hover:text-white">Service Areas</Link> •
              <Link to="/faqs" className="hover:text-white">FAQs</Link> •
              <Link to="/contact" className="hover:text-white">Contact Us</Link>
            </div>
          </div>

          {/* Column 4: Key Localities in Hyderabad */}
          <div>
            <h4 className="font-display text-base font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Popular Hyderabad Localities
            </h4>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {hyderabadAreas.slice(0, 18).map((area) => (
                <Link
                  key={area}
                  to="/areas"
                  className="px-2 py-1 bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md transition-colors"
                >
                  {area}
                </Link>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Same-day doorstep service across Western, Central, and Eastern Hyderabad zones.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} FridgeFix Hyderabad. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>₹199 Transparent Inspection</span>
            <span>•</span>
            <span>90-Day Warranty</span>
            <span>•</span>
            <Link to="/admin" className="text-slate-600 hover:text-slate-400">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
