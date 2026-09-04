import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Calendar, Menu, X, ChevronDown, ShieldCheck, Wrench, Snowflake, Wind, RotateCw, Zap, Droplet, Tv } from 'lucide-react';
import { businessInfo } from '../data/siteData';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Services', path: '/services' },
    { label: 'Why Us', path: '/why-us' },
    { label: 'Brands', path: '/brands' },
    { label: 'Areas', path: '/areas' },
    { label: 'FAQs', path: '/faqs' },
    { label: 'Contact', path: '/contact' },
  ];

  const serviceCategories = [
    { name: 'Refrigerator Repair', path: '/refrigerator-repair', icon: Snowflake },
    { name: 'AC Repair & Gas', path: '/ac-repair', icon: Wind },
    { name: 'Washing Machine Repair', path: '/washing-machine-repair', icon: RotateCw },
    { name: 'Microwave Oven Repair', path: '/microwave-repair', icon: Zap },
    { name: 'RO Water Purifier', path: '/ro-repair', icon: Droplet },
    { name: 'Smart TV Repair', path: '/tv-repair', icon: Tv },
  ];

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" onClick={closeMenus} className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0788C9] to-[#065a96] flex items-center justify-center shadow-md shadow-blue-500/25">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-[#0A192F] text-base sm:text-lg tracking-tight">
                FridgeFix Hyderabad
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-wide flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {businessInfo.tagline} • Hyderabad
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/services') ||
                  location.pathname.includes('repair')
                    ? 'text-[#0788C9] font-semibold'
                    : 'text-slate-600 hover:text-[#0788C9]'
                }`}
              >
                Services
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180 text-[#0788C9]' : ''}`} />
              </button>

              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-64 z-50">
                  <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 p-2.5 space-y-1">
                    <Link
                      to="/services"
                      onClick={closeMenus}
                      className="block px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-[#0788C9] bg-blue-50/70 hover:bg-blue-100/70 transition-colors"
                    >
                      All Appliance Services →
                    </Link>
                    <div className="border-t border-slate-100 my-1"></div>
                    {serviceCategories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <Link
                          key={cat.path}
                          to={cat.path}
                          onClick={closeMenus}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#0788C9] transition-colors"
                        >
                          <Icon className="w-4 h-4 text-[#0788C9] shrink-0" />
                          <span>{cat.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path ? 'text-[#0788C9] font-semibold' : 'text-slate-600 hover:text-[#0788C9]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={`tel:${businessInfo.phoneRaw}`}
              className="flex items-center gap-2 text-sm font-semibold text-[#0A192F] hover:text-[#0788C9] transition-colors"
            >
              <Phone className="w-4 h-4 text-[#0788C9]" />
              <span>{businessInfo.phone}</span>
            </a>

            <Link
              to="/book-service"
              className="btn-primary py-2.5 px-5 text-xs sm:text-sm font-semibold shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Service</span>
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={`tel:${businessInfo.phoneRaw}`}
              className="w-10 h-10 rounded-xl bg-[#0788C9] flex items-center justify-center text-white shadow-md shadow-blue-500/25"
              aria-label="Call now"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-100 shadow-xl px-4 pt-3 pb-6 max-h-[85vh] overflow-y-auto">
          <div className="space-y-1">
            <Link
              to="/"
              onClick={closeMenus}
              className="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-800 hover:bg-slate-50 hover:text-[#0788C9]"
            >
              Home
            </Link>

            <div className="pt-2 pb-1 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Services
            </div>
            {serviceCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.path}
                  to={cat.path}
                  onClick={closeMenus}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-[#0788C9]"
                >
                  <Icon className="w-4 h-4 text-[#0788C9]" />
                  <span>{cat.name}</span>
                </Link>
              );
            })}
            <Link
              to="/services"
              onClick={closeMenus}
              className="block px-3 py-2 text-xs font-semibold text-[#0788C9] hover:underline"
            >
              View All Services →
            </Link>

            <div className="border-t border-slate-100 my-2"></div>

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenus}
                className="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-800 hover:bg-slate-50 hover:text-[#0788C9]"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 space-y-2">
              <Link
                to="/book-service"
                onClick={closeMenus}
                className="btn-primary w-full py-3"
              >
                <Calendar className="w-4 h-4" />
                Book Doorstep Service
              </Link>
              <a
                href={`tel:${businessInfo.phoneRaw}`}
                className="btn-outline w-full py-3 flex items-center justify-center gap-2 text-slate-800"
              >
                <Phone className="w-4 h-4 text-[#0788C9]" />
                Call Helpline: {businessInfo.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
