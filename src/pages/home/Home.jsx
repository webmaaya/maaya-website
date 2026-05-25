// ============================================================
//  Home.jsx — MAAYA Enterprises Homepage
//  Sections: Hero → Featured Courses → Features → Testimonials
// ============================================================

import { useState, useEffect } from "react";
import Hero from "../../Components/hero/Hero";
import CoursesSection from "../../Components/sections/CoursesSection";
import PlacedStudents from "../../Components/sections/PlacedStudents";
import Features from "../../Components/features/Features";
import ContactPopup from "../../Components/sections/ContactPopup";

export default function Home() {
  const [showContactPopup, setShowContactPopup] = useState(false);

  useEffect(() => {
    // Show popup only once per session
    const popupShown = sessionStorage.getItem("contactPopupShown");
    
    if (!popupShown) {
      const timer = setTimeout(() => {
        setShowContactPopup(true);
        sessionStorage.setItem("contactPopupShown", "true");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <main>
      {/* Contact Popup on Landing */}
      {showContactPopup && (
        <ContactPopup onClose={() => setShowContactPopup(false)} />
      )}

      {/* 1. Placed Students */}
       <PlacedStudents />

      {/* 2. Hero banner with headline + stats */}
      <Hero/>

      {/* 3. Featured courses grid (shows first 6) */}
      <CoursesSection/>

      {/* 4. Why MAAYA — 6 feature cards */}
      <Features />

      
     

      {/* TODO: Add Testimonials section here when ready */}
      {/* <Testimonials /> */}

      {/* TODO: Add CTA Banner section here if needed */}
    </main>
  );
}
