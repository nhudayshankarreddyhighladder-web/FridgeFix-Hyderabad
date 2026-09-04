import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, Clock, CheckCircle2, Phone, ShieldCheck } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { LeadForm } from '../components/LeadForm';
import { CTASection } from '../components/CTASection';
import { hyderabadAreas, businessInfo } from '../data/siteData';

export const ServiceAreasPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const zones = [
    {
      name: 'Western IT Corridor & Suburbs',
      areas: ['Hitech City', 'Madhapur', 'Gachibowli', 'Kondapur', 'Kukatpally', 'Miyapur', 'KPHB', 'Chandanagar', 'Nallagandla', 'Manikonda', 'Bachupally'],
      desc: 'Rapid 45–60 min dispatch for gated communities, high-rise apartments and IT colonies.',
    },
    {
      name: 'Central & Premium Hyderabad',
      areas: ['Banjara Hills', 'Jubilee Hills', 'Ameerpet', 'Begumpet', 'Mehdipatnam', 'Attapur', 'Tolichowki'],
      desc: 'Same-day doorstep service across central residential hubs and commercial zones.',
    },
    {
      name: 'Secunderabad & Northern Hubs',
      areas: ['Secunderabad', 'Kompally', 'Alwal', 'AS Rao Nagar'],
      desc: 'Prompt doorstep coverage for Secunderabad twin-city neighborhoods.',
    },
    {
      name: 'Eastern & Southern Hyderabad',
      areas: ['Dilsukhnagar', 'LB Nagar', 'Uppal', 'Tarnaka', 'Nagole', 'Shamshabad'],
      desc: 'Active service network serving residential layouts across the eastern belt.',
    },
  ];

  const filteredAreas = hyderabadAreas.filter((a) =>
    a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-50/70 to-[#F8FAFC] py-14 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <Breadcrumbs items={[{ label: 'Service Areas' }]} />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-[#0788C9] text-xs font-bold uppercase tracking-wider mb-3">
            Doorstep Coverage Across Hyderabad
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A192F] tracking-tight">
            Doorstep Support Across Hyderabad
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            We operate a distributed fleet of certified mobile technicians positioned throughout Greater Hyderabad. Wherever you reside, verified help is just a phone call away.
          </p>

          {/* Quick Search Area */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search your locality (e.g. Kukatpally, Madhapur)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:border-[#0788C9] focus:ring-4 focus:ring-blue-100 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Filtered Area Results or Zones */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {searchQuery ? (
            <div>
              <h2 className="text-xl font-bold text-[#0A192F] mb-6">
                Matching Localities ({filteredAreas.length})
              </h2>
              {filteredAreas.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredAreas.map((area) => (
                    <div
                      key={area}
                      className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 text-center"
                    >
                      <MapPin className="w-5 h-5 text-[#0788C9] mx-auto mb-2" />
                      <div className="font-bold text-sm text-[#0A192F]">{area}</div>
                      <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                        Active Technician On Duty
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-slate-600 text-sm">
                    Don't see your specific locality listed? We service all areas within Greater Hyderabad!
                  </p>
                  <a
                    href={`tel:${businessInfo.phoneRaw}`}
                    className="btn-primary mt-4 inline-flex items-center gap-2 text-xs"
                  >
                    <Phone className="w-4 h-4" />
                    Call Helpline ({businessInfo.phone}) To Confirm Coverage
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              {zones.map((zone) => (
                <div key={zone.name} className="bg-[#F8FAFC] border border-slate-200/80 rounded-3xl p-6 sm:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-200">
                    <div>
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0A192F]">
                        {zone.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        {zone.desc}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-700 text-xs font-bold shrink-0 self-start md:self-auto">
                      <Clock className="w-3.5 h-3.5" />
                      <span>60–90 Min Turnaround</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {zone.areas.map((area) => (
                      <div
                        key={area}
                        className="bg-white p-3.5 rounded-xl border border-slate-200/80 hover:border-[#0788C9] hover:shadow-xs transition-all text-center flex flex-col items-center justify-center"
                      >
                        <MapPin className="w-4 h-4 text-[#0788C9] mb-1.5" />
                        <span className="text-xs font-bold text-slate-800">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Booking Form Block */}
      <section className="py-16 bg-slate-50/60 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LeadForm
            title="Book In Your Hyderabad Locality"
            subtitle="Select your area — our nearest technician will be dispatched"
          />
        </div>
      </section>

      <CTASection />
    </div>
  );
};
