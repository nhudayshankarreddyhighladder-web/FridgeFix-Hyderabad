import React from 'react';
import { Link } from 'react-router-dom';
import {
  Snowflake,
  Package,
  Droplets,
  Gauge,
  CircuitBoard,
  Fan,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  LucideIcon,
  Wrench,
  LayoutGrid,
  Cpu,
  Wind,
  RotateCw,
  Zap,
  Droplet,
  Tv,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Snowflake,
  Package,
  Droplets,
  Gauge,
  CircuitBoard,
  Fan,
  ShieldAlert,
  Sparkles,
  Wrench,
  LayoutGrid,
  Cpu,
  Wind,
  RotateCw,
  Zap,
  Droplet,
  Tv,
  Refrigerator: Snowflake,
};

interface ServiceCardProps {
  service: {
    slug?: string;
    name: string;
    desc?: string;
    short?: string;
    price?: string;
    iconName?: string;
  };
  simple?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, simple = false }) => {
  const IconComponent = (service.iconName && iconMap[service.iconName]) || Snowflake;
  const description = service.short || service.desc;
  const targetLink = service.slug ? `/services/${service.slug}` : '/book-service';

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden hover:-translate-y-1 h-full flex flex-col">
      {/* Cool Glow Hover */}
      <div className="absolute inset-0 cool-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="relative p-6 sm:p-7 flex flex-col h-full z-10">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E0F2FE] to-[#BAE6FD] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200">
          <IconComponent className="w-7 h-7 text-[#0788C9]" />
        </div>

        {/* Title */}
        <h3 className="font-display text-lg font-bold text-[#0A192F] mb-2 group-hover:text-[#0788C9] transition-colors">
          {service.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed grow">
          {description}
        </p>

        {/* Pricing and Action */}
        {!simple && (
          <div className="pt-5 mt-4 border-t border-slate-100/80 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Inspection
              </div>
              <div className="text-base font-bold text-[#0A192F]">
                {service.price || 'From ₹199'}
              </div>
            </div>

            <Link
              to={targetLink}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0788C9] hover:text-[#065a96] transition-colors"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
