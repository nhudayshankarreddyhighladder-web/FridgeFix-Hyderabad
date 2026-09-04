import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 flex-wrap" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-[#0788C9] flex items-center gap-1 transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          {item.path ? (
            <Link to={item.path} className="hover:text-[#0788C9] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-800 font-semibold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
