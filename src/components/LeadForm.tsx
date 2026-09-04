import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, Phone, CheckCircle2, AlertCircle, Loader2, ShieldCheck, ArrowRight, Wrench } from 'lucide-react';
import { businessInfo, hyderabadAreas, refrigeratorServices } from '../data/siteData';

interface LeadFormProps {
  defaultService?: string;
  defaultAppliance?: string;
  compact?: boolean;
  title?: string;
  subtitle?: string;
  onSuccess?: (leadId: string) => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  defaultService = 'General Refrigerator Repair',
  defaultAppliance = 'Refrigerator',
  compact = false,
  title,
  subtitle,
  onSuccess,
}) => {
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: defaultService,
    appliance: defaultAppliance,
    brand: '',
    location: '',
    preferredDate: '',
    problem: '',
    message: '',
    botField: '', // Honeypot
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createdLeadId, setCreatedLeadId] = useState<string>('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const allServiceOptions = [
    { category: 'Refrigerator Repair', options: [
      'Single Door Refrigerator Repair',
      'Double Door Refrigerator Repair',
      'Side-by-Side Refrigerator Repair',
      'Frost-Free Refrigerator Repair',
      'Inverter Refrigerator Repair',
      'General Refrigerator Repair',
    ]},
    { category: 'Other Home Appliances', options: [
      'AC Repair & Gas Refill',
      'Washing Machine Repair',
      'Microwave Oven Repair',
      'RO / Water Purifier Service',
      'Smart TV Repair',
    ]},
  ];

  const brandOptions = [
    'LG',
    'Samsung',
    'Whirlpool',
    'Godrej',
    'Haier',
    'Bosch',
    'Panasonic',
    'IFB',
    'Voltas',
    'Hitachi',
    'Daikin',
    'Blue Star',
    'Kent',
    'Sony',
    'Other / Unlisted',
  ];

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please enter your full name';
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.service) {
      errs.service = 'Please select a service';
    }

    if (!formData.location.trim()) {
      errs.location = 'Please select or enter your area in Hyderabad';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sourcePage: location.pathname,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit service booking. Please try again.');
      }

      setSubmitSuccess(true);
      setCreatedLeadId(data.leadId || '');

      // Broadcast lead event for immediate side popup notification!
      if (data.publicLead && typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('ff:newlead', {
            detail: data.publicLead,
          })
        );
      }

      if (onSuccess && data.leadId) {
        onSuccess(data.leadId);
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please call our 24×7 helpline.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitSuccess(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      service: defaultService,
      appliance: defaultAppliance,
      brand: '',
      location: '',
      preferredDate: '',
      problem: '',
      message: '',
      botField: '',
    });
    setErrors({});
  };

  if (submitSuccess) {
    return (
      <div className="bg-white rounded-3xl border border-emerald-100 p-8 sm:p-10 shadow-xl shadow-emerald-500/5 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h3 className="font-display text-2xl font-bold text-[#0A192F] mb-2">
          Service Request Confirmed!
        </h3>

        <div className="inline-block bg-slate-100 rounded-full px-4 py-1 text-xs font-mono text-slate-700 font-semibold mb-4">
          Booking Ref: {createdLeadId}
        </div>

        <p className="text-slate-600 text-sm max-w-md mx-auto mb-6 leading-relaxed">
          Thank you, <strong className="text-slate-800">{formData.name}</strong>. A verified technician in{' '}
          <strong className="text-[#0788C9]">{formData.location}</strong> has been notified and will call your phone{' '}
          <strong className="text-slate-800">{formData.phone}</strong> within 15–30 minutes to confirm the visit time.
        </p>

        <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 text-left max-w-md mx-auto mb-6 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-[#0788C9]">
            <ShieldCheck className="w-4 h-4" />
            FridgeFix Service Commitment
          </div>
          <div>• ₹199 doorstep inspection fee (adjusted into repair)</div>
          <div>• 90-day comprehensive service warranty</div>
          <div>• Genuine manufacturer-compatible spare parts</div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`tel:${businessInfo.phoneRaw}`}
            className="btn-primary w-full sm:w-auto py-3 px-6 text-sm"
          >
            <Phone className="w-4 h-4" />
            Speak With Coordinator Now
          </a>
          <button
            onClick={handleReset}
            className="btn-outline w-full sm:w-auto py-3 px-6 text-sm"
          >
            Book Another Appliance
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xl shadow-blue-500/5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0788C9] to-[#065a96] flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
          <Wrench className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0A192F]">
            {title || 'Book Doorstep Repair'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            {subtitle || `Inspection starts at ${businessInfo.inspectionPrice} • ${businessInfo.warranty} Warranty`}
          </p>
        </div>
      </div>

      {submitError && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Anti-spam honeypot (hidden) */}
        <input
          type="text"
          name="botField"
          value={formData.botField}
          onChange={(e) => setFormData({ ...formData, botField: e.target.value })}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <div className={compact ? 'grid gap-4' : 'grid sm:grid-cols-2 gap-4'}>
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Ramesh Kumar"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full rounded-xl border ${
                errors.name ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-[#0788C9] focus:ring-blue-100'
              } px-3.5 py-2.5 text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-4 transition-all`}
            />
            {errors.name && <p className="text-rose-500 text-[11px] mt-1">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mobile Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-semibold text-slate-400">
                +91
              </span>
              <input
                type="tel"
                placeholder="98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full rounded-xl border pl-12 ${
                  errors.phone ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-[#0788C9] focus:ring-blue-100'
                } px-3.5 py-2.5 text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-4 transition-all`}
              />
            </div>
            {errors.phone && <p className="text-rose-500 text-[11px] mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div className={compact ? 'grid gap-4' : 'grid sm:grid-cols-2 gap-4'}>
          {/* Service */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Service Required <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className={`w-full rounded-xl border ${
                errors.service ? 'border-rose-400' : 'border-slate-200 focus:border-[#0788C9] focus:ring-blue-100'
              } px-3 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-4 transition-all`}
            >
              {allServiceOptions.map((group) => (
                <optgroup key={group.category} label={group.category}>
                  {group.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Appliance Brand
            </label>
            <select
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full rounded-xl border border-slate-200 focus:border-[#0788C9] focus:ring-blue-100 px-3 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-4 transition-all"
            >
              <option value="">Select Brand</option>
              {brandOptions.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={compact ? 'grid gap-4' : 'grid sm:grid-cols-2 gap-4'}>
          {/* Location / Area in Hyderabad */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Hyderabad Area / Locality <span className="text-rose-500">*</span>
            </label>
            <input
              list="hyderabad-area-list"
              placeholder="e.g. Kukatpally, Madhapur, etc."
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={`w-full rounded-xl border ${
                errors.location ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-[#0788C9] focus:ring-blue-100'
              } px-3.5 py-2.5 text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-4 transition-all`}
            />
            <datalist id="hyderabad-area-list">
              {hyderabadAreas.map((area) => (
                <option key={area} value={area} />
              ))}
            </datalist>
            {errors.location && <p className="text-rose-500 text-[11px] mt-1">{errors.location}</p>}
          </div>

          {/* Preferred Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Preferred Date / Time Slot
            </label>
            <input
              type="text"
              placeholder="e.g. Today / Tomorrow morning"
              value={formData.preferredDate}
              onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              className="w-full rounded-xl border border-slate-200 focus:border-[#0788C9] focus:ring-blue-100 px-3.5 py-2.5 text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-4 transition-all"
            />
          </div>
        </div>

        {/* Problem description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Describe the Issue (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Not cooling, loud vibrating noise, water leakage from base..."
            value={formData.problem}
            onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
            className="w-full rounded-xl border border-slate-200 focus:border-[#0788C9] focus:ring-blue-100 px-3.5 py-2.5 text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-4 transition-all"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-orange py-3.5 text-sm sm:text-base font-bold shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Confirming Booking...</span>
            </>
          ) : (
            <>
              <span>Book Doorstep Service (₹199)</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-slate-400 pt-1">
          🔒 Your contact info is strictly confidential. No spam guaranteed.
        </p>
      </form>
    </div>
  );
};
