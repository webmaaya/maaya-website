// ============================================================
//  ScrollToTop.jsx — Fixes scroll position on every route change
//  src/components/ScrollToTop.jsx
//
//  Problem: Jab user /courses se back aata hai toh page
//  niche se start hota hai. Yeh component ensure karta hai
//  ki har route change pe page top se start ho.
// ============================================================

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Har route change pe window top pe scroll karo
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null; // Kuch render nahi karta — sirf side effect
}
