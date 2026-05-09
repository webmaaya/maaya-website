// ============================================================
//  Home.jsx — MAAYA Enterprises Homepage
//  Sections: Hero → Featured Courses → Features → Testimonials
// ============================================================

import Hero from "../../Components/hero/Hero";
import CoursesSection from "../../Components/sections/CoursesSection";
import PlacedStudents from "../../Components/sections/PlacedStudents";
import Features from "../../Components/features/Features";

export default function Home() {
  return (
    <main>
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
