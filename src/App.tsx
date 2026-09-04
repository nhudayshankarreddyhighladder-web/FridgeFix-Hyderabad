import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LeadPopup } from './components/LeadPopup';
import { FloatingActions } from './components/FloatingActions';

import { HomePage } from './pages/HomePage';
import { RefrigeratorRepairPage } from './pages/RefrigeratorRepairPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { ApplianceCategoryPage } from './pages/ApplianceCategoryPage';
import { AllServicesPage } from './pages/AllServicesPage';
import { WhyUsPage } from './pages/WhyUsPage';
import { BrandsPage } from './pages/BrandsPage';
import { ServiceAreasPage } from './pages/ServiceAreasPage';
import { FAQPage } from './pages/FAQPage';
import { BookServicePage } from './pages/BookServicePage';
import { ContactPage } from './pages/ContactPage';
import { AdminLeadsPage } from './pages/AdminLeadsPage';

import { otherApplianceServices } from './data/siteData';

// Scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default function App() {
  const acData = otherApplianceServices.find((s) => s.id === 'ac')!;
  const washingMachineData = otherApplianceServices.find((s) => s.id === 'washing-machine')!;
  const microwaveData = otherApplianceServices.find((s) => s.id === 'microwave')!;
  const roData = otherApplianceServices.find((s) => s.id === 'ro')!;
  const tvData = otherApplianceServices.find((s) => s.id === 'tv')!;

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-800 antialiased selection:bg-[#0788C9] selection:text-white">
        {/* Persistent Header */}
        <Header />

        {/* Main Routed Content */}
        <main className="grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/refrigerator-repair" element={<RefrigeratorRepairPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/ac-repair" element={<ApplianceCategoryPage category={acData} />} />
            <Route
              path="/washing-machine-repair"
              element={<ApplianceCategoryPage category={washingMachineData} />}
            />
            <Route
              path="/microwave-repair"
              element={<ApplianceCategoryPage category={microwaveData} />}
            />
            <Route path="/ro-repair" element={<ApplianceCategoryPage category={roData} />} />
            <Route path="/tv-repair" element={<ApplianceCategoryPage category={tvData} />} />
            <Route path="/services" element={<AllServicesPage />} />
            <Route path="/why-us" element={<WhyUsPage />} />
            <Route path="/about-us" element={<WhyUsPage />} />
            <Route path="/brands" element={<BrandsPage />} />
            <Route path="/areas" element={<ServiceAreasPage />} />
            <Route path="/faqs" element={<FAQPage />} />
            <Route path="/book-service" element={<BookServicePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminLeadsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Persistent Footer */}
        <Footer />

        {/* Floating Side Lead Popup (Live + Simulated Feed, Strict Privacy) */}
        <LeadPopup />

        {/* Floating Quick Action Buttons (WhatsApp + Call) */}
        <FloatingActions />
      </div>
    </Router>
  );
}
