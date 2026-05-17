// ============================================================
//  add_basic_diploma.js
//  Run this ONCE to add Basic Diploma to Firebase
//  Command: node add_basic_diploma.js
//  (copy this to your project root and run)
// ============================================================

import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection } from "firebase/firestore";

// ── Paste your Firebase config here ──────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyDv7qydF7odkXqJCXcCD7Ix-3qkJ0_L9zc",
  authDomain:        "maaya-enterprises.firebaseapp.com",
  projectId:         "maaya-enterprises",
  storageBucket:     "maaya-enterprises.firebasestorage.app",
  messagingSenderId: "101570355014",
  appId:             "1:101570355014:web:a52e046f0d31922f72cf47",
  measurementId:     "G-4JXM1JS0JW",
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ── Basic Diploma Course Data ─────────────────────────────────
const basicDiploma = {
  title:        "Basic Diploma",
  subtitle:     "All-in-one beginner diploma covering 5 core IT domains",
  track:        "IT & Computer",
  icon:         "🎓",
  gradient:     "grad-purple",
  badge:        "Most Popular",
  isOnline:     true,
  duration:     "8 Months",
  price:        "9100",
  originalPrice:"10500",
  description:  "A complete beginner diploma covering Accounting, Programming, Designing, Hardware & AI — all in one course!",
  tags:         ["Accounting", "Programming", "Designing", "Hardware", "AI", "Beginner Friendly"],

  overview: `The Basic Diploma is a comprehensive 8-month online program designed for beginners who want to build strong foundations across 5 essential IT domains — Accounting, Programming, Graphic Design, IT Hardware, and Artificial Intelligence. This all-in-one course gives you the skills needed to start a career or freelance in today's digital world.`,

  whoShouldJoin: [
    "Students who have completed 10th or 12th standard",
    "Freshers looking to build IT skills for jobs",
    "Anyone who wants to start a career in computers",
    "Homemakers & working professionals looking to upskill",
    "Entrepreneurs who want to manage their own accounting & digital work",
  ],

  features: [
    "Online course — learn from anywhere",
    "5 domains covered in 1 course",
    "MKCL Certified Program",
    "Expert instructors for each subject",
    "Certificate after completion",
    "Lifetime access to recorded sessions",
    "Counsellor support throughout",
  ],

  whatYouLearn: [
    "Analyze data & create reports using Microsoft Excel",
    "Manage accounts, GST & invoicing using Tally Software",
    "Understand programming logic using C & C++",
    "Build Python programs & solve real-world problems",
    "Create professional graphics, logos & designs",
    "Understand computer hardware, networking & troubleshooting",
    "Learn Artificial Intelligence concepts & applications",
    "Work on real mini-projects in each domain",
  ],

  // ── 5 Main Subjects with Sub-courses ─────────────────────
  subjects: [
    {
      name:  "📊 Accounting",
      icon:  "📊",
      color: "grad-green",
      subCourses: [
        {
          name: "Data Analysis & Visualization Techniques using Excel",
          duration: "5 Weeks",
          description: "Master Excel for data analysis, charts, pivot tables and business reporting.",
        },
        {
          name: "Fundamentals of Accounting & Introduction to Tally Software",
          duration: "5 Weeks",
          description: "Learn bookkeeping, GST, vouchers, and complete accounting using Tally.",
        },
      ],
    },
    {
      name:  "💻 Programming",
      icon:  "💻",
      color: "grad-blue",
      subCourses: [
        {
          name: "Foundations of Data Structures with C & C++",
          duration: "5 Weeks",
          description: "Understand programming fundamentals, arrays, pointers & data structures.",
        },
        {
          name: "Python Fundamentals & Programming Basics",
          duration: "5 Weeks",
          description: "Learn Python from scratch — variables, loops, functions & mini-projects.",
        },
      ],
    },
    {
      name:  "🎨 Designing",
      icon:  "🎨",
      color: "grad-pink",
      subCourses: [
        {
          name: "Fundamentals of Graphic Design",
          duration: "4 Weeks",
          description: "Learn design principles, color theory, typography and tools like Canva & CorelDRAW.",
        },
      ],
    },
    {
      name:  "🖥️ Hardware",
      icon:  "🖥️",
      color: "grad-orange",
      subCourses: [
        {
          name: "Understanding IT Hardware & System Components",
          duration: "4 Weeks",
          description: "Learn computer components, assembly, networking basics & troubleshooting.",
        },
      ],
    },
    {
      name:  "🤖 Artificial Intelligence",
      icon:  "🤖",
      color: "grad-teal",
      subCourses: [], // AI is direct — no sub-courses
    },
  ],

  // ── Syllabus ──────────────────────────────────────────────
  syllabus: [
    {
      moduleTitle: "📊 Module 1 — Data Analysis using Excel",
      chapters: [
        "Introduction to Microsoft Excel & Spreadsheets",
        "Formulas, Functions & Named Ranges",
        "Data Sorting, Filtering & Validation",
        "Charts, Graphs & Data Visualization",
        "Pivot Tables & Pivot Charts",
        "Conditional Formatting & Data Insights",
        "Practical: Business Sales Report Project",
      ],
    },
    {
      moduleTitle: "📊 Module 2 — Accounting & Tally Software",
      chapters: [
        "Fundamentals of Accounting & Double Entry System",
        "Ledgers, Vouchers & Journal Entries",
        "GST Basics & Tax Configuration in Tally",
        "Purchase, Sales & Inventory Management",
        "Balance Sheet, P&L & Financial Reports",
        "Payroll Management in Tally",
        "Practical: Complete Company Account Setup",
      ],
    },
    {
      moduleTitle: "💻 Module 3 — Data Structures with C & C++",
      chapters: [
        "Introduction to Programming & C Language",
        "Variables, Data Types & Operators",
        "Control Structures — If/Else, Loops",
        "Functions, Recursion & Scope",
        "Arrays, Strings & Pointers",
        "Introduction to C++ & Object Oriented Programming",
        "Practical: Build a Student Record Management System",
      ],
    },
    {
      moduleTitle: "💻 Module 4 — Python Fundamentals",
      chapters: [
        "Introduction to Python & Setting up Environment",
        "Variables, Input/Output & Data Types",
        "Conditional Statements & Loops",
        "Functions, Modules & Libraries",
        "Lists, Tuples, Dictionaries & Sets",
        "File Handling & Exception Management",
        "Practical: Build a Simple Calculator & Quiz App",
      ],
    },
    {
      moduleTitle: "🎨 Module 5 — Graphic Design Fundamentals",
      chapters: [
        "Principles of Design — Balance, Contrast, Alignment",
        "Color Theory & Typography",
        "Introduction to Canva — Posters, Social Media Posts",
        "Introduction to CorelDRAW — Vector Design",
        "Logo Design & Brand Identity Basics",
        "Print vs Digital Design",
        "Practical: Create a Complete Brand Kit",
      ],
    },
    {
      moduleTitle: "🖥️ Module 6 — IT Hardware & System Components",
      chapters: [
        "Computer Architecture & Components Overview",
        "Motherboard, CPU, RAM & Storage Devices",
        "Input/Output Devices & Peripherals",
        "Computer Assembly & BIOS Configuration",
        "Operating System Installation (Windows)",
        "Networking Basics — LAN, WiFi, IP Address",
        "Practical: Assemble & Troubleshoot a Computer",
      ],
    },
    {
      moduleTitle: "🤖 Module 7 — Artificial Intelligence",
      chapters: [
        "What is Artificial Intelligence? History & Applications",
        "Types of AI — Narrow AI, General AI & Super AI",
        "Machine Learning Basics — Supervised & Unsupervised",
        "Introduction to Neural Networks & Deep Learning",
        "Natural Language Processing (NLP) & Chatbots",
        "Computer Vision — How AI Sees Images",
        "AI Tools in Real Life — ChatGPT, Midjourney, Copilot",
        "Ethics in AI — Bias, Privacy & Responsible AI",
        "Practical: Build a Simple AI Chatbot using Python",
      ],
    },
  ],

  createdAt: new Date(),
};

// ── Add to Firebase ───────────────────────────────────────────
const run = async () => {
  try {
    const ref = await addDoc(collection(db, "onlineCourses"), basicDiploma);
    console.log("✅ Basic Diploma added successfully!");
    console.log("📌 Course ID:", ref.id);
    console.log("🌐 It will now show in Online Courses section on your website!");
  } catch (e) {
    console.error("❌ Error:", e.message);
  }
};

run();
