// ============================================================
//  App.jsx — MAAYA Enterprises
//  Main app with React Router routes
// ============================================================

import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import {AuthProvider} from "./context/AuthContext";
import ScrollToTop from "./Components/ScrollToTop";
import FloatingChatbot from "./Components/chatbot/FloatingChatbot";

// Layout components
import Navbar   from "./Components/navigations/NavBar";
import Footer         from "./Components/footer/Footer";
import WhatsappButton from "./Components/whatsapp/WhatsappButton";

// Pages
import Home  from "./pages/home/Home";
import Courses  from "./pages/courses/Courses";
import DiplomaDetail from "./pages/coursedetail/DiplomaDetail";
// TODO: Create these pages later
import About   from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import AdminPanel from "./pages/adminpanel/AdminPanel";
import Login    from "./pages/login/Login";
import Register from "./pages/register/Register";
import AdminAuthGate from "./pages/adminauthgate/AdminAuthGate";

export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
    <ScrollToTop />
    <Routes>
      {/* ── Sticky Navbar (always visible) ── */}
      {/* <Route path="/admin" element={<AdminPanel />} /> {/* Admin panel route */}
       <Route path="/register" element={<Register />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/admin"    element={<AdminAuthGate />} />

     
     
     

      {/* ── Page Routes ── */}
     <Route path="*" element={
       <>
      <Navbar />
      <Routes>   
       <Route path="/"           element={<Home/>} />
        <Route path="/courses"    element={<Courses/> }/>
        <Route path="/diploma/:id" element={<DiplomaDetail />} /> */

        {/* TODO: Uncomment when these pages are ready */}
        <Route path="/about"    element={<About/>} />
        <Route path="/contact"  element={<Contact/>} />
        {/* 404 fallback */}
        <Route path="*" element={
          <div style={{ textAlign: "center", padding: "100px 24px" }}>
            <h2 style={{ fontSize: 32, marginBottom: 12 }}>404 — Page Not Found</h2>
            <a href="/" style={{ color: "var(--primary)", fontWeight: 700 }}>Go Home</a>
          </div>
        } />
      </Routes>

      {/* ── Footer (always visible) ── */}
      <Footer />

      {/* ── Floating WhatsApp Button ── */}
      <WhatsappButton />
      <FloatingChatbot />
      </>
      }/>
    </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

