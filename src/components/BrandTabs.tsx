import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Snowflake, Wind, RotateCw, Zap, Droplet, Tv, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { otherApplianceServices } from '../data/siteData';

export const BrandTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('refrigerator');

  const refrigeratorBrands = [
    { name: 'LG', desc: 'Inverter linear, door-in-door and French-door models.' },
    { name: 'Samsung', desc: 'Inverter, French-door and side-by-side models.' },
    { name: 'Whirlpool', desc: 'Intellisense, Protton and frost-free ranges.' },
    { name: 'Godrej', desc: 'Classic direct-cool and frost-free units.' },
    { name: 'Haier', desc: 'Double-door and side-by-side inverter models.' },
    { name: 'Bosch', desc: 'Premium German inverter and multi-door units.' },
    { name: 'Panasonic', desc: 'Prime+ and inverter refrigerator series.' },
    { name: 'Videocon', desc: 'Affordable direct-cool and double-door units.' },
    { name: 'Hitachi', desc: 'High-end multi-door and inverter refrigerators.' },
    { name: 'IFB', desc: 'Direct-cool and frost-free refrigerators.' },
    { name: 'Voltas Beko', desc: 'Affordable inverter and double-door models.' },
    { name: 'Electrolux', desc: 'Premium frost-free and inverter units.' },
    { name: 'Kelvinator', desc: 'Classic direct-cool refrigerators.' },
    { name: 'Siemens', desc: 'Premium European inverter refrigerators.' },
  ];

  const categories = [
    { id: 'refrigerator', label: 'Refrigerator', icon: Snowflake, brands: refrigeratorBrands, link: '/refrigerator-repair' },
    ...otherApplianceServices.map((cat) => ({
      id: cat.id,
      label: cat.id === 'washing-machine' ? 'Washing Machine' : cat.id === 'ro' ? 'RO Purifier' : cat.id.toUpperCase(),
      icon: cat.id === 'ac' ? Wind : cat.id === 'washing-machine' ? RotateCw : cat.id === 'microwave' ? Zap : cat.id === 'ro' ? Droplet : Tv,
      brands: cat.brands,
      link: `/${cat.id}-repair`,
    })),
  ];

  const currentCategory = categories.find((c) => c.id === activeTab) || categories[0];

  return (
    <section className="py-16 sm:py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-[#0788C9] uppercase tracking-wider mb-3">
            Multi-Brand Expertise
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0A192F] tracking-tight">
            Brands & Models We Service In Hyderabad
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Trained technicians equipped with genuine OEM-compatible parts for all leading Indian and international appliance manufacturers.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#0788C9] text-white shadow-md shadow-blue-500/25 scale-102'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-[#0788C9] hover:text-[#0788C9]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {currentCategory.brands.map((brand) => (
            <div
              key={brand.name}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display text-lg font-bold text-[#0A192F]">
                    {brand.name}
                  </span>
                  <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {brand.desc}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-[#0788C9] font-medium">
                <span>Genuine Parts Used</span>
                <Link to="/book-service" className="hover:underline flex items-center gap-1">
                  Book Now →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Footer Link */}
        <div className="mt-10 text-center">
          <Link
            to={currentCategory.link}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0788C9] hover:text-[#065a96] hover:underline"
          >
            <span>Explore all {currentCategory.label} repair options & troubleshooting</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
