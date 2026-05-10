import React from "react";
import Groq from "groq-sdk";
import "./FloatingChatbot.css";

const groqClient = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const MAAYA_INFO = `
You are a helpful assistant for MAAYA Institute of Computer Research (माया प्रशिक्षण केंद्र).
Answer only institute and studies related questions. Be friendly, warm and professional.
Always reply in English only. Keep answers concise and helpful.

🏫 INSTITUTE INFO:
- Name: MAAYA Institute of Computer Research (माया प्रशिक्षण केंद्र)
- Also known as: MAAYA Enterprises
- Established: 2010
- Tagline: Maharashtra's leading IT education & skill development institute
- Mission: Empowering youth with career-ready skills since 2010
- Stats: 50,000+ Students Enrolled, 20+ Courses Available, 98% Satisfaction Rate, 500+ Placement Partners, 400+ Students Placed

📍 CONTACT DETAILS:
- Address: Panchami Heights, 204, College Rd, near Moti Talav, Sawantwadi, Maharashtra 416510
- Phone: 9420277373
- Email: education.maaya@gmail.com
- Timings: Mon-Sat 9AM - 7PM

👨‍🏫 FACULTY & STAFF:
- Harshad Chavan — Founder & Owner
- Harshada Chavan — Academic Head
- Shreya Shirsat — Assistant Manager
- Durva Narvekar — Programming Professor

📚 DIPLOMA COURSES (Paid):
1. Diploma in Programming (Duration: 1 Year)
   Subjects: Frontend Development, Backend Development, Web Designing, Full Stack Development
2. Diploma in Hardware & Networking (Duration: 10 Months)
   Subjects: Hardware Support, Desktop Support, Network Support, Security Support
3. Diploma in Accounting (Duration: 10 Months)
   Subjects: Tally Prime with GST, Data Analysis & Visualization, Advance Excel, Google Pro
4. Diploma in Designing (Duration: 10 Months)
   Subjects: DTP (Adobe/CorelDRAW), Canva, Video Editing, CineMagic Editing
5. Work From Home Program (Duration: Flexible)
   Subjects: English Communication, Information Technology, Smart Teacher, AI-ML Basic

🆓 FREE COURSES:
1. MKCL Soft Skill — For Students & Professionals
2. Digital Empowerment for Teachers — For School & College Teachers
3. Future Vedh (Career Inclination Test) — For Students (6th to 12th)
4. Digital Saheli — For Women, Homemakers
5. SSC Smart Tips (English Medium) — For SSC (10th) Students
6. HSC Exam Smart Tips (English) — For HSC (12th) Students
7. HSC Exam Smart Tips (Marathi) — For HSC (12th) Marathi Medium Students
8. MS-CIT Welcome — For Anyone interested in MS-CIT
9. Digital & AI Camp — For Students of all ages

🎓 PLACED STUDENTS (400+ successfully placed):
1. Vikrant Pednekar — Diploma in Accounting — Front Desk Officer
2. Swagat Gawde — Diploma in Hardware & Networking — Network Technician
3. Prachiti Varne — Diploma in Designing — Sales Marketing
4. Savita Narvekar — Diploma in Full Stack Development — Accountant
5. Aniket Masurkar — Diploma in Accounting — Accountant
6. Tejas Gawas — Diploma in Hardware & Networking — IT Support-L1
7. Ramchandra Madkholkar — Diploma in Designing — Auto Desk Operator
8. Esha Rane — Diploma in Full Stack Development — Call Center Executive
9. Lalita Naik — Diploma in Accounting — Data Entry Operator
10. Mahesh Malwade — Diploma in Hardware & Networking — IT Support-L2
11. Rani Sawant — Diploma in Designing — DTP Operator
12. Shraddha Bandekar — Diploma in Full Stack Development — Software Tester
13. Milan Sawant — Diploma in Hardware & Networking — Network Technician
14. Viraj Bondre — Diploma in Hardware & Networking — Network Technician
15. Harish Sawant — Diploma in DTP — DTP Operator

🚫 STRICT RULES:
- ONLY answer MAAYA Institute and education/studies/courses related questions
- Always reply in English only
- If someone asks anything unrelated say: "I can only help with MAAYA Institute and education related queries!"
- Always be warm, encouraging and supportive to students
- For fee details, suggest contacting institute at 9420277373
`;

function formatMessage(text) {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return null;
    const html = line
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
    return (
      <p key={i} dangerouslySetInnerHTML={{ __html: html }} />
    );
  }).filter(Boolean);
}

const quickQuestions = [
  "📚 Courses?",
  "🆓 Free courses?",
  "📞 Contact?",
  "🎓 Placements?",
];

function FloatingChatbot() {
  const [isOpen,    setIsOpen]    = React.useState(false);
  const [messages,  setMessages]  = React.useState([
    {
      id: "1",
      message: "Hello! 👋 Welcome to MAAYA Institute!\n\nI can help you with:\n📚 Course information\n💰 Fee details\n📞 Contact info\n🎓 Placement records\n\nWhat would you like to know?",
      sender: "robot",
    }
  ]);
  const [inputText, setInputText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showNotif, setShowNotif] = React.useState(true);
  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowNotif(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  async function sendMessage(text) {
    const msgText = text || inputText;
    if (!msgText.trim() || isLoading) return;

    const newMessages = [
      ...messages,
      { id: crypto.randomUUID(), message: msgText, sender: "user" }
    ];

    setMessages(newMessages);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await groqClient.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1024,
        messages: [
          { role: "system", content: MAAYA_INFO },
          ...newMessages.map(m => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.message,
          }))
        ],
      });

      const botReply = response.choices[0].message.content;
      setMessages([...newMessages, {
        id: crypto.randomUUID(),
        message: botReply,
        sender: "robot"
      }]);

    } catch (error) {
      console.error("Groq error:", error);
      setMessages([...newMessages, {
        id: crypto.randomUUID(),
        message: "Sorry, something went wrong. Please try again!",
        sender: "robot"
      }]);
    }

    setIsLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") sendMessage();
  }

  function handleOpen() {
    setIsOpen(o => !o);
    setShowNotif(false);
  }

  return (
    <>
      {/* ── Chat Window ── */}
      {isOpen && (
        <div className="maaya-chat-window">

          {/* Header */}
          <div className="maaya-header">
            <div className="maaya-header-logo">M</div>
            <div className="maaya-header-info">
              <div className="maaya-header-title">MAAYA Assistant</div>
              <div className="maaya-header-status">● Online | माया प्रशिक्षण केंद्र</div>
            </div>
            <button className="maaya-header-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="maaya-messages">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`maaya-msg-row ${m.sender === "user" ? "maaya-msg-row-user" : "maaya-msg-row-bot"}`}
              >
                {m.sender === "robot" && (
                  <div className="maaya-m-logo-sm">M</div>
                )}
                <div className={m.sender === "user" ? "maaya-bubble-user" : "maaya-bubble-bot"}>
                  {m.sender === "robot" ? formatMessage(m.message) : m.message}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="maaya-msg-row maaya-msg-row-bot">
                <div className="maaya-m-logo-sm">M</div>
                <div className="maaya-typing">
                  <span className="maaya-dot"></span>
                  <span className="maaya-dot"></span>
                  <span className="maaya-dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="maaya-quick">
            {quickQuestions.map(q => (
              <button key={q} className="maaya-quick-btn" onClick={() => sendMessage(q)}>
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="maaya-input-area">
            <input
              className="maaya-input"
              placeholder="Ask about MAAYA Institute..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="maaya-send-btn" onClick={() => sendMessage()} disabled={isLoading}>
              ➤
            </button>
          </div>
        </div>
      )}

      {/* ── Notification ── */}
      {showNotif && !isOpen && (
        <div className="maaya-notif">
          🎓 Ask Education related questions!
          <div className="maaya-notif-arrow" />
        </div>
      )}

      {/* ── Floating Button — "Ask MAAYA" pill ── */}
      <button className="maaya-float-btn" onClick={handleOpen} title="Chat with MAAYA Assistant">
        {isOpen ? (
          <>
            <div className="maaya-m-logo">M</div>
            <span className="maaya-float-label">Close</span>
          </>
        ) : (
          <>
            <div className="maaya-m-logo">M</div>
            <span className="maaya-float-label">Ask MAAYA</span>
          </>
        )}
      </button>
    </>
  );
}

export default FloatingChatbot;
