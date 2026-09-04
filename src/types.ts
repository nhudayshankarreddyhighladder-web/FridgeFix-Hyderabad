export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  appliance?: string;
  brand?: string;
  problem?: string;
  location: string;
  preferredDate?: string;
  message?: string;
  sourcePage: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface PublicLeadNotification {
  id: string;
  name: string;
  service: string;
  area: string;
  mins: number;
  isReal?: boolean;
}

export interface ServiceDetail {
  slug: string;
  name: string;
  short: string;
  price: string;
  iconName: string;
  description: string;
  problems: string[];
  symptoms: string[];
  solutions: string[];
  faqs: Array<{ q: string; a: string }>;
}

export interface ApplianceBrand {
  name: string;
  desc: string;
  popularModels?: string[];
}

export interface ApplianceCategoryData {
  id: string;
  name: string;
  iconName: string;
  headline: string;
  description: string;
  inspectionFee: string;
  warranty: string;
  brands: ApplianceBrand[];
  commonIssues: string[];
  subServices: Array<{ title: string; desc: string; price: string }>;
  faqs: Array<{ q: string; a: string }>;
}

export interface BusinessConfig {
  name: string;
  tagline: string;
  phone: string;
  phoneRaw: string;
  whatsapp: string;
  inspectionPrice: string;
  warranty: string;
  email: string;
  hours: string;
  city: string;
  state: string;
  address: string;
}
