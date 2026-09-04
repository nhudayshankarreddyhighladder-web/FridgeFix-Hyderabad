import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { initialDummyLeads } from '../data/siteData';
import { PublicLeadNotification } from '../types';

export const LeadPopup: React.FC = () => {
  const [currentLead, setCurrentLead] = useState<PublicLeadNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissedPermanently, setIsDismissedPermanently] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const leadQueueRef = useRef<PublicLeadNotification[]>([]);
  const shownIdsRef = useRef<Set<string>>(new Set());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize leads from storage & initial dummy leads
  useEffect(() => {
    try {
      const storedShown = sessionStorage.getItem('ff_shown_leads');
      if (storedShown) {
        const parsed = JSON.parse(storedShown);
        if (Array.isArray(parsed)) {
          parsed.forEach((id) => shownIdsRef.current.add(id));
        }
      }
    } catch {
      // Ignore sessionStorage access errors
    }

    // Initialize queue with dummy leads
    leadQueueRef.current = [...initialDummyLeads];

    // Fetch any real recent leads from backend
    const fetchRecentLeads = async () => {
      try {
        const res = await fetch('/api/leads/recent');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.leads)) {
            data.leads.forEach((realLead: PublicLeadNotification) => {
              // Add real lead to front of queue
              if (!leadQueueRef.current.some((l) => l.id === realLead.id)) {
                leadQueueRef.current.unshift({ ...realLead, isReal: true });
              }
            });
          }
        }
      } catch (err) {
        console.error('Could not fetch recent leads:', err);
      }
    };

    fetchRecentLeads();
    const pollInterval = setInterval(fetchRecentLeads, 15000);

    // Listen to local new lead events
    const handleNewLeadEvent = (e: CustomEvent<PublicLeadNotification>) => {
      if (e.detail) {
        const newLead = { ...e.detail, isReal: true };
        leadQueueRef.current.unshift(newLead);
        // Show immediately
        displayLead(newLead);
      }
    };

    window.addEventListener('ff:newlead' as any, handleNewLeadEvent);

    // Initial trigger after 3.5 seconds
    const initialTimeout = setTimeout(() => {
      showNextLead();
    }, 3500);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(initialTimeout);
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener('ff:newlead' as any, handleNewLeadEvent);
    };
  }, []);

  const displayLead = (lead: PublicLeadNotification) => {
    if (isDismissedPermanently) return;
    setCurrentLead(lead);
    setIsVisible(true);
    shownIdsRef.current.add(lead.id);

    try {
      sessionStorage.setItem('ff_shown_leads', JSON.stringify(Array.from(shownIdsRef.current)));
    } catch {
      // Ignore
    }

    // Auto hide after 6 seconds
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!isHovered) {
        setIsVisible(false);
        // Schedule next lead in 7 to 12 seconds
        scheduleNextLead();
      }
    }, 6000);
  };

  const showNextLead = () => {
    if (isDismissedPermanently || isHovered) return;

    if (leadQueueRef.current.length === 0) {
      // Refill queue
      leadQueueRef.current = [...initialDummyLeads];
    }

    const next = leadQueueRef.current.shift();
    if (next) {
      displayLead(next);
      // Recycle dummy leads
      if (!next.isReal) {
        leadQueueRef.current.push(next);
      }
    }
  };

  const scheduleNextLead = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const delay = Math.floor(Math.random() * 5000) + 7000; // 7-12 seconds
    timerRef.current = setTimeout(() => {
      showNextLead();
    }, delay);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    // Snooze for 45 seconds or permanently for this session
    scheduleNextLead();
  };

  if (!currentLead || !isVisible) {
    return null;
  }

  const timeDisplay =
    currentLead.mins === 0
      ? 'Just now'
      : currentLead.mins < 60
      ? `${currentLead.mins}m ago`
      : `${Math.floor(currentLead.mins / 60)}h ago`;

  return (
    <div
      id="side-lead-popup"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (isVisible) {
          timerRef.current = setTimeout(() => {
            setIsVisible(false);
            scheduleNextLead();
          }, 4000);
        }
      }}
      className={`fixed z-40 transition-all duration-500 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
      } bottom-20 sm:bottom-6 right-3 sm:right-6 left-3 sm:left-auto sm:max-w-sm`}
    >
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl border border-blue-100 p-4 shadow-xl shadow-slate-900/10 overflow-hidden ring-1 ring-blue-500/10">
        {/* Subtle top indicator line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#0788C9] via-emerald-400 to-[#0788C9]"></div>

        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold tracking-wide uppercase text-slate-500 flex items-center gap-1">
              {currentLead.isReal ? 'Verified New Booking' : 'Recent Booking'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-400">{timeDisplay}</span>
            <button
              onClick={handleDismiss}
              className="text-slate-400 hover:text-slate-600 rounded-full p-0.5 hover:bg-slate-100 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-2 text-sm text-slate-800">
          <p className="leading-snug">
            <strong className="font-semibold text-[#0A192F]">{currentLead.name}</strong> from{' '}
            <span className="text-[#0788C9] font-medium">{currentLead.area}</span> requested{' '}
            <strong className="font-medium text-slate-900">{currentLead.service}</strong>
          </p>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Technician Assigned
          </span>
          <span className="text-slate-400">Hyderabad</span>
        </div>
      </div>
    </div>
  );
};
