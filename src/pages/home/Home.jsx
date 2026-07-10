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
import AIPopup from "../../Components/sections/AIPopup";

// Ad runs until this date (inclusive)
const AD_END_DATE = new Date("2026-07-30T23:59:59");

export default function Home() {
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showAIPopup,      setShowAIPopup]      = useState(false);


useEffect(() => {

  const popupShown = sessionStorage.getItem("contactPopupShown");
  const now        = new Date();
  const showAd     = now <= AD_END_DATE;
  let timer;

  if (!popupShown) {
    timer = setTimeout(() => {
      if (showAd){
        setShowAIPopup(true);
      }
      else{
        setShowContactPopup(true);
      }
      
      sessionStorage.setItem("contactPopupShown", "true");
    }, 1000);
  }

  // announcement bar click popup
    const openPopup = () => {
      if (showAd) setShowAIPopup(true);
      else setShowContactPopup(true);
    };
    window.addEventListener("openContactPopup", openPopup);

  return () => {
    if (timer) clearTimeout(timer);
    window.removeEventListener("openContactPopup", openPopup);
  };

}, []);


  return (
    <main>
      {/* AI Ad Popup — till 30 July 2026 */}
      {showAIPopup && (
        <AIPopup onClose={() => setShowAIPopup(false)} />
      )}

     

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
