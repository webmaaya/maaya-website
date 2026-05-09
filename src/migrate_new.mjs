// ============================================================
//  migrate_new.mjs — MAAYA New Course Structure Migration
//  
//  Collections in Firebase:
//    1. diplomaCourses  — Diploma programs (Accounting, Programming etc)
//    2. freeCourses     — 9 Free courses
//    3. wfhCourses      — Work From Home courses
//
//  Usage:
//    node src/migrate_new.mjs diplomas   → only diploma courses
//    node src/migrate_new.mjs free       → only free courses
//    node src/migrate_new.mjs wfh        → only WFH courses
//    node src/migrate_new.mjs all        → everything
// ============================================================

import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, addDoc, serverTimestamp
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDv7qydF7odkXqJCXcCD7Ix-3qkJ0_L9zc",
  authDomain: "maaya-enterprises.firebaseapp.com",
  projectId: "maaya-enterprises",
  storageBucket: "maaya-enterprises.firebasestorage.app",
  messagingSenderId: "101570355014",
  appId: "1:101570355014:web:a52e046f0d31922f72cf47",
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ============================================================
//  1. DIPLOMA COURSES
// ============================================================
const DIPLOMA_COURSES = [

  // ── Diploma in Accounting ───────────────────────────────
  {
    title:       "Diploma in Accounting",
    track:       "Accounting",
    icon:        "📊",
    gradient:    "grad-green",
    badge:       "Most Popular",
    duration:    "10 Months",
    overview:    "A comprehensive accounting diploma covering modern accounting tools, data analysis, and artificial intelligence for finance professionals. This program prepares students for roles in accounting, finance, and data management sectors.",
    whoShouldJoin: [
      "Commerce students (11th, 12th, B.Com)",
      "Aspiring accountants and finance professionals",
      "Business owners who want to manage their own accounts",
      "Anyone interested in data analysis and AI in finance",
    ],
    whatYouLearn: [
      "Complete Tally Prime with GST filing",
      "Data Analysis using Excel and tools",
      "Advanced Excel formulas, pivot tables, dashboards",
      "Google Workspace for business productivity",
      "Artificial Intelligence basics for accounting",
    ],
    includes: [
      { name: "Tally Prime with GST",        duration: "2 Months", icon: "🧾" },
      { name: "Data Analysis & Visualization", duration: "2 Months", icon: "📈" },
      { name: "Advance Excel",               duration: "2 Months", icon: "📋" },
      { name: "Google Pro",                  duration: "2 Months", icon: "🔍" },
      { name: "Artificial Intelligence",     duration: "2 Months", icon: "🤖" },
    ],
    syllabus: [
      {
        moduleTitle: "Tally Prime with GST",
        chapters: [
          "Introduction to Tally Prime",
          "Company creation and configuration",
          "Ledger creation and management",
          "Voucher entry - Payment, Receipt, Journal",
          "GST setup and configuration",
          "GST invoicing and returns",
          "Bank reconciliation",
          "Financial statements - Balance Sheet, P&L",
          "Inventory management",
          "Payroll processing",
          "MIS reports",
          "Data backup and restore",
        ],
      },
      {
        moduleTitle: "Data Analysis & Visualization",
        chapters: [
          "Introduction to Data Analysis",
          "Data collection and cleaning",
          "Statistical concepts for analysis",
          "Data visualization principles",
          "Charts and graphs creation",
          "Dashboard design",
          "Introduction to Power BI",
          "Data storytelling",
          "Real-world data analysis projects",
        ],
      },
      {
        moduleTitle: "Advance Excel",
        chapters: [
          "Excel interface and shortcuts",
          "Advanced formulas - VLOOKUP, HLOOKUP, INDEX-MATCH",
          "IF, nested IF, SUMIF, COUNTIF functions",
          "Pivot Tables and Pivot Charts",
          "Data validation and conditional formatting",
          "Macros and basic VBA",
          "Excel dashboards",
          "What-if analysis and Goal Seek",
          "Data import/export",
          "Excel for accounting and finance",
        ],
      },
      {
        moduleTitle: "Google Pro (Google Workspace)",
        chapters: [
          "Google Drive - storage and sharing",
          "Google Docs - advanced features",
          "Google Sheets - formulas and charts",
          "Google Slides - presentations",
          "Google Forms - surveys and data collection",
          "Gmail - professional email management",
          "Google Meet - online meetings",
          "Google Calendar - scheduling",
          "Collaboration and team tools",
        ],
      },
      {
        moduleTitle: "Artificial Intelligence",
        chapters: [
          "What is Artificial Intelligence?",
          "AI in accounting and finance",
          "Introduction to ChatGPT and AI tools",
          "AI for data analysis",
          "Automating tasks with AI",
          "AI-powered Excel and Google Sheets",
          "Future of AI in accounting",
          "Practical AI mini projects",
        ],
      },
    ],
    features: [
      "MKCL Certified",
      "100% Job Oriented",
      "30+ Projects",
      "Resume Building",
      "Interview Skills",
      "Online & Offline",
    ],
    createdAt: null,
  },

  // ── Diploma in Programming ──────────────────────────────
  {
    title:       "Diploma in Programming",
    track:       "Programming",
    icon:        "💻",
    gradient:    "grad-blue",
    badge:       "Trending",
    duration:    "1 Year",
    overview:    "A complete 1-year programming diploma covering frontend development, backend programming, web designing and full stack development. Students will work on real-world projects and build a strong portfolio for software development careers.",
    whoShouldJoin: [
      "Students who want to become software developers",
      "Anyone interested in web development and programming",
      "IT students looking for practical coding skills",
      "Freshers who want a job in tech industry",
      "Entrepreneurs who want to build their own apps/websites",
    ],
    whatYouLearn: [
      "Frontend development with HTML, CSS, JavaScript, Bootstrap",
      "Backend programming with C, C++, Core Java, Python, SQL",
      "Professional web designing and UI/UX",
      "Full Stack Development — complete web applications",
      "Data structures and algorithms",
      "Database management with MySQL and PHP",
    ],
    includes: [
      {
        name:     "Frontend Development",
        duration: "3 Months",
        icon:     "🎨",
        topics:   ["HTML5", "CSS3", "JavaScript", "Bootstrap", "Responsive Design"],
      },
      {
        name:     "Backend Development",
        duration: "3 Months",
        icon:     "⚙️",
        topics:   ["C Programming", "C++", "Core Java", "Python Fundamentals", "SQL"],
      },
      {
        name:     "Web Designing",
        duration: "3 Months",
        icon:     "🖌️",
        topics:   ["UI/UX Design", "Figma", "CSS Animations", "Web Graphics"],
      },
      {
        name:     "Full Stack Development",
        duration: "3 Months",
        icon:     "🚀",
        topics:   ["React", "Node.js concepts", "PHP", "Database integration", "Final Project"],
      },
    ],
    syllabus: [
      {
        moduleTitle: "Frontend Development (3 Months)",
        chapters: [
          "HTML5 - Structure and Semantics",
          "HTML Forms, Tables, Media",
          "CSS3 - Selectors, Box Model, Flexbox",
          "CSS Grid and Responsive Design",
          "CSS Animations and Transitions",
          "JavaScript Basics - Variables, Data Types",
          "JavaScript Functions and Arrays",
          "JavaScript DOM Manipulation",
          "JavaScript Events and Forms",
          "Bootstrap - Grid System",
          "Bootstrap Components - Navbar, Cards, Modals",
          "Bootstrap Forms and Utilities",
          "Frontend Mini Projects",
        ],
      },
      {
        moduleTitle: "Backend Development (3 Months)",
        chapters: [
          "C Programming - Basics and Syntax",
          "C - Arrays, Pointers, Functions",
          "C - File handling and structures",
          "C++ - OOP Concepts",
          "C++ - Classes, Inheritance, Polymorphism",
          "Core Java - Basics and OOP",
          "Core Java - Collections and Exception Handling",
          "Python Fundamentals - Data Types, Loops",
          "Python - Functions, Modules, File handling",
          "SQL - Database basics and queries",
          "SQL - Joins, Views, Stored Procedures",
          "Algorithms and Data Structures",
          "Backend Mini Projects",
        ],
      },
      {
        moduleTitle: "Web Designing (3 Months)",
        chapters: [
          "Principles of UI/UX Design",
          "Color theory and Typography",
          "Wireframing and Prototyping",
          "Introduction to Figma",
          "Figma - Components and Auto Layout",
          "Advanced CSS - Variables, Animations",
          "CSS Frameworks overview",
          "Web Graphics and Image optimization",
          "Accessibility in web design",
          "Mobile-first design approach",
          "Web Designing Projects",
        ],
      },
      {
        moduleTitle: "Full Stack Development (3 Months)",
        chapters: [
          "React JS Fundamentals",
          "React - Components, Props, State",
          "React - Hooks and Context API",
          "React Router and Navigation",
          "PHP Basics and Syntax",
          "PHP - Forms, Sessions, Cookies",
          "PHP - MySQL Integration",
          "Database Design and Normalization",
          "REST API concepts",
          "Frontend-Backend Integration",
          "Deployment basics",
          "Final Full Stack Project",
        ],
      },
    ],
    features: [
      "MKCL Certified",
      "100% Job Oriented",
      "30+ Real Projects",
      "Resume Building",
      "Interview Skills",
      "Online & Offline",
    ],
    createdAt: null,
  },

  // ── Diploma in Designing ────────────────────────────────
  {
    title:       "Diploma in Designing",
    track:       "Designing",
    icon:        "🎨",
    gradient:    "grad-purple",
    badge:       "Creative",
    duration:    "10 Months",
    overview:    "A creative diploma covering graphic design, video editing, visual effects and artificial intelligence for designers. Students will master industry-standard tools and create professional portfolios for design careers.",
    whoShouldJoin: [
      "Creative students interested in visual arts and design",
      "Aspiring graphic designers and video editors",
      "Social media managers and content creators",
      "Students interested in animation and VFX",
      "Anyone who wants a career in creative industry",
    ],
    whatYouLearn: [
      "Professional DTP with Adobe and CorelDRAW",
      "Canva for social media and marketing design",
      "Video editing with professional tools",
      "CineMagic cinematic video editing",
      "VFX and Animation fundamentals",
      "AI tools for creative design",
    ],
    includes: [
      { name: "DTP (Adobe / CorelDRAW)", duration: "2 Months", icon: "🖨️" },
      { name: "Canva",                   duration: "2 Months", icon: "✏️" },
      { name: "Video Editing",           duration: "2 Months", icon: "🎬" },
      { name: "CineMagic Editing",       duration: "2 Months", icon: "🎥" },
      { name: "VFX and Animation",       duration: "1 Month",  icon: "✨" },
      { name: "Artificial Intelligence", duration: "1 Month",  icon: "🤖" },
    ],
    syllabus: [
      {
        moduleTitle: "DTP - Adobe & CorelDRAW",
        chapters: [
          "Introduction to Desktop Publishing",
          "Adobe Photoshop - Interface and tools",
          "Photo editing and retouching",
          "Adobe Illustrator - Vector graphics",
          "Logo design and branding",
          "CorelDRAW - Basics and layout",
          "Print design - Brochures, Flyers, Posters",
          "Typography and font management",
          "Color modes - RGB, CMYK",
          "Export for print and digital",
        ],
      },
      {
        moduleTitle: "Canva Design",
        chapters: [
          "Introduction to Canva",
          "Canva templates and customization",
          "Social media graphics design",
          "Instagram posts and stories",
          "Facebook and YouTube graphics",
          "Presentation design in Canva",
          "Logo and branding in Canva",
          "Canva for business - proposals, reports",
          "Canva Pro features",
          "Design projects",
        ],
      },
      {
        moduleTitle: "Video Editing",
        chapters: [
          "Introduction to video editing",
          "Video editing software overview",
          "Importing and organizing footage",
          "Cutting and trimming clips",
          "Transitions and effects",
          "Color grading basics",
          "Audio editing and mixing",
          "Text and titles in videos",
          "Exporting for different platforms",
          "YouTube and Reels editing",
        ],
      },
      {
        moduleTitle: "CineMagic Editing",
        chapters: [
          "Cinematic video techniques",
          "Advanced color grading",
          "Cinematic transitions",
          "Motion graphics",
          "Storytelling through video",
          "Wedding and event video editing",
          "Short film editing",
          "Music video editing",
          "Professional export settings",
        ],
      },
      {
        moduleTitle: "VFX and Animation",
        chapters: [
          "Introduction to VFX",
          "Green screen / Chroma key",
          "Motion tracking",
          "2D Animation basics",
          "3D Animation introduction",
          "Visual effects compositing",
          "VFX Mini Projects",
        ],
      },
      {
        moduleTitle: "AI for Designers",
        chapters: [
          "AI tools for graphic design",
          "AI image generation",
          "AI video editing tools",
          "Canva AI features",
          "Adobe AI (Firefly)",
          "Future of AI in design",
        ],
      },
    ],
    features: [
      "MKCL Certified",
      "100% Job Oriented",
      "Portfolio Building",
      "Resume Building",
      "Interview Skills",
      "Online & Offline",
    ],
    createdAt: null,
  },

  // ── Diploma in Hardware ─────────────────────────────────
  {
    title:       "Diploma in Hardware & Networking",
    track:       "IT Hardware",
    icon:        "🔧",
    gradient:    "grad-teal",
    badge:       "Job Ready",
    duration:    "10 Months",
    overview:    "A practical diploma in computer hardware, networking and cybersecurity. Students will get hands-on training in hardware repair, network setup, security systems and artificial intelligence for IT infrastructure.",
    whoShouldJoin: [
      "Students interested in computer hardware and repair",
      "Aspiring network engineers and IT support professionals",
      "Students who want to start their own hardware shop",
      "Anyone interested in cybersecurity",
      "ITI and Diploma students from technical backgrounds",
    ],
    whatYouLearn: [
      "Computer hardware assembly, repair and troubleshooting",
      "Desktop and laptop support",
      "Network setup, configuration and troubleshooting",
      "Security systems and implementation",
      "Cybersecurity fundamentals and ethical hacking basics",
      "AI in hardware and IT infrastructure",
    ],
    includes: [
      { name: "Hardware Support",    duration: "2 Months", icon: "🖥️" },
      { name: "Desktop Support",     duration: "2 Months", icon: "💻" },
      { name: "Network Support",     duration: "2 Months", icon: "🌐" },
      { name: "Security Support",    duration: "2 Months", icon: "🛡️" },
      { name: "Cyber Security",      duration: "1 Month",  icon: "🔐" },
      { name: "Artificial Intelligence", duration: "1 Month", icon: "🤖" },
    ],
    syllabus: [
      {
        moduleTitle: "Hardware Support",
        chapters: [
          "Computer components identification",
          "Motherboard, CPU, RAM installation",
          "Storage devices - HDD, SSD, NVMe",
          "Power supply and cooling systems",
          "BIOS/UEFI configuration",
          "Operating system installation - Windows",
          "Operating system installation - Linux basics",
          "Hardware troubleshooting methodology",
          "Printer and peripheral installation",
          "Hardware maintenance and cleaning",
        ],
      },
      {
        moduleTitle: "Desktop Support",
        chapters: [
          "Windows administration",
          "User account management",
          "Software installation and removal",
          "Driver management",
          "System performance optimization",
          "Backup and recovery",
          "Remote desktop support",
          "Ticketing and support documentation",
          "Customer service skills for IT",
        ],
      },
      {
        moduleTitle: "Network Support",
        chapters: [
          "Networking fundamentals - OSI model",
          "IP addressing and subnetting",
          "Router and switch configuration",
          "WiFi setup and troubleshooting",
          "LAN/WAN concepts",
          "Network troubleshooting tools",
          "VPN basics",
          "Network monitoring",
          "Practical network setup lab",
        ],
      },
      {
        moduleTitle: "Security Support",
        chapters: [
          "Information security fundamentals",
          "Security policies and compliance",
          "Antivirus and endpoint security",
          "Firewall configuration",
          "Data protection and encryption",
          "Physical security measures",
          "Security incident response",
          "Security audit basics",
        ],
      },
      {
        moduleTitle: "Cyber Security",
        chapters: [
          "Introduction to Cybersecurity",
          "Types of cyber attacks",
          "Social engineering and phishing",
          "Password security",
          "Ethical hacking introduction",
          "Vulnerability assessment basics",
          "Cybersecurity career paths",
        ],
      },
      {
        moduleTitle: "AI in Hardware & IT",
        chapters: [
          "AI for IT support automation",
          "Predictive maintenance with AI",
          "AI-powered network monitoring",
          "Chatbots for IT helpdesk",
          "Future of AI in hardware",
        ],
      },
    ],
    features: [
      "MKCL Certified",
      "100% Job Oriented",
      "Practical Lab Sessions",
      "Resume Building",
      "Interview Skills",
      "Online & Offline",
    ],
    createdAt: null,
  },

  // ── Work From Home Courses ──────────────────────────────
  {
    title:       "Work From Home Program",
    track:       "Work From Home",
    icon:        "🏠",
    gradient:    "grad-orange",
    badge:       "Flexible",
    duration:    "Flexible",
    overview:    "Flexible online courses designed for students and professionals who want to learn skills and earn from home. These courses focus on practical, market-ready skills that can generate income remotely.",
    whoShouldJoin: [
      "Homemakers who want to earn from home",
      "Students who want part-time income",
      "Professionals looking to add new income streams",
      "Anyone interested in remote work opportunities",
    ],
    whatYouLearn: [
      "Professional English communication",
      "Information Technology basics",
      "Smart teaching and educational technology",
      "AI and Machine Learning fundamentals",
      "Internet of Things (IoT)",
      "Social Media Marketing for business",
    ],
    includes: [
      { name: "English Communication",  duration: "Flexible", icon: "🗣️",  price: "₹6,000" },
      { name: "Information Technology", duration: "Flexible", icon: "💻",  price: "₹6,000" },
      { name: "Smart Teacher",          duration: "Flexible", icon: "👨‍🏫", price: "₹3,000" },
      { name: "AI-ML Basic",            duration: "Flexible", icon: "🤖",  price: "₹6,000" },
      { name: "IoT",                    duration: "Flexible", icon: "📡",  price: "FREE" },
      { name: "Social Media Marketing", duration: "Flexible", icon: "📱",  price: "₹2,500" },
    ],
    syllabus: [
      {
        moduleTitle: "English Communication",
        chapters: [
          "Grammar fundamentals",
          "Spoken English practice",
          "Professional writing - emails, reports",
          "Presentation skills",
          "Interview communication",
          "Business English",
        ],
      },
      {
        moduleTitle: "Information Technology",
        chapters: [
          "Computer basics",
          "MS Office - Word, Excel, PowerPoint",
          "Internet and email",
          "Online tools for work",
          "Digital payments and banking",
          "Cybersecurity basics",
        ],
      },
      {
        moduleTitle: "Smart Teacher",
        chapters: [
          "Digital classroom setup",
          "Online teaching tools",
          "Creating digital content",
          "Google Classroom",
          "Zoom and Meet for teaching",
          "Assessment tools online",
        ],
      },
      {
        moduleTitle: "AI-ML Basic",
        chapters: [
          "What is Artificial Intelligence",
          "Machine Learning concepts",
          "AI tools for daily use",
          "ChatGPT and Generative AI",
          "AI in various industries",
          "Career in AI",
        ],
      },
      {
        moduleTitle: "IoT (Internet of Things)",
        chapters: [
          "What is IoT",
          "IoT devices and sensors",
          "Smart home automation",
          "IoT applications in industry",
          "Getting started with Arduino",
        ],
      },
      {
        moduleTitle: "Social Media Marketing",
        chapters: [
          "Social media platforms overview",
          "Content creation for social media",
          "Instagram and Facebook marketing",
          "YouTube channel management",
          "Paid advertising basics",
          "Analytics and insights",
          "Building a brand online",
          "Earning through social media",
        ],
      },
    ],
    features: [
      "Learn from Home",
      "Flexible Timing",
      "Job Oriented",
      "Certificate Provided",
      "Online Support",
    ],
    createdAt: null,
  },

];

// ============================================================
//  2. FREE COURSES (9 courses)
// ============================================================
const FREE_COURSES = [
  {
    title:       "Digital Saheli",
    description: "A digital literacy program specially designed for women to help them use smartphones, internet and digital services confidently.",
    icon:        "👩‍💻",
    gradient:    "grad-pink",
    category:    "Free",
    isFree:      true,
    expiresOn:   "Dec 31, 2030",
    forWhom:     "Women, Homemakers",
  },
  {
    title:       "Future Vedh (Career Inclination Test)",
    description: "A career assessment test to help students identify their strengths, interests and the right career path for their future.",
    icon:        "🎯",
    gradient:    "grad-blue",
    category:    "Free",
    isFree:      true,
    expiresOn:   "Dec 31, 2030",
    forWhom:     "Students (8th to 12th)",
  },
  {
    title:       "MS-CIT Welcome",
    description: "An introductory course to MS-CIT that gives learners a preview of what they will learn in the full MS-CIT program.",
    icon:        "💻",
    gradient:    "grad-blue",
    category:    "Free",
    isFree:      true,
    expiresOn:   "Dec 31, 2030",
    forWhom:     "Anyone interested in MS-CIT",
  },
  {
    title:       "MKCL Soft Skill",
    description: "Develop essential soft skills like communication, teamwork, time management and problem solving for career success.",
    icon:        "🌟",
    gradient:    "grad-orange",
    category:    "Free",
    isFree:      true,
    expiresOn:   "Dec 31, 2050",
    forWhom:     "Students and Professionals",
  },
  {
    title:       "Digital Empowerment for Teachers",
    description: "Empowering teachers with digital tools and technology to enhance their teaching methods and classroom experience.",
    icon:        "👨‍🏫",
    gradient:    "grad-teal",
    category:    "Free",
    isFree:      true,
    expiresOn:   "Dec 31, 2030",
    forWhom:     "School and College Teachers",
  },
  {
    title:       "Digital & AI Camp",
    description: "An exciting digital and AI awareness camp introducing students to the world of artificial intelligence and future technologies.",
    icon:        "🤖",
    gradient:    "grad-purple",
    category:    "Free",
    isFree:      true,
    expiresOn:   "Dec 31, 2030",
    forWhom:     "Students of all ages",
  },
  {
    title:       "SSC Smart Tips (English Medium)",
    description: "Smart study tips and techniques for SSC (10th Board) students to score better marks in their board examinations.",
    icon:        "📚",
    gradient:    "grad-green",
    category:    "Free",
    isFree:      true,
    expiresOn:   "Dec 31, 2050",
    forWhom:     "SSC (10th) Students",
  },
  {
    title:       "HSC Exam Smart Tips (Marathi)",
    description: "मराठी माध्यमातून HSC (12वी) परीक्षेसाठी स्मार्ट टिप्स आणि अभ्यासाच्या पद्धती.",
    icon:        "📖",
    gradient:    "grad-orange",
    category:    "Free",
    isFree:      true,
    expiresOn:   "Dec 31, 2030",
    forWhom:     "HSC (12th) Students - Marathi Medium",
  },
  {
    title:       "HSC Exam Smart Tips (English)",
    description: "Smart tips and study techniques for HSC (12th Board) students to excel in their board examinations.",
    icon:        "📝",
    gradient:    "grad-teal",
    category:    "Free",
    isFree:      true,
    expiresOn:   "Dec 31, 2030",
    forWhom:     "HSC (12th) Students - English Medium",
  },
];

// ============================================================
//  MIGRATION FUNCTIONS
// ============================================================

async function migrateDiplomas() {
  console.log("\n🎓 Migrating Diploma Courses...\n");
  for (const course of DIPLOMA_COURSES) {
    try {
      const ref = await addDoc(collection(db, "diplomaCourses"), {
        ...course,
        createdAt: serverTimestamp(),
      });
      console.log(`✅ "${course.title}" → ${ref.id}`);
    } catch (e) {
      console.error(`❌ Failed: ${course.title} — ${e.message}`);
    }
  }
}

async function migrateFree() {
  console.log("\n🆓 Migrating Free Courses...\n");
  for (const course of FREE_COURSES) {
    try {
      const ref = await addDoc(collection(db, "freeCourses"), {
        ...course,
        createdAt: serverTimestamp(),
      });
      console.log(`✅ "${course.title}" → ${ref.id}`);
    } catch (e) {
      console.error(`❌ Failed: ${course.title} — ${e.message}`);
    }
  }
}

// ── Main ──────────────────────────────────────────────────────
const arg = process.argv[2] || "all";

(async () => {
  if (arg === "diplomas" || arg === "all") await migrateDiplomas();
  if (arg === "free"     || arg === "all") await migrateFree();
  console.log("\n✅ Done! Check Firebase console.\n");
  process.exit(0);
})();
