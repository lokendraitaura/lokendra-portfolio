export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://lokendra.work").replace(/\/$/, "");

export const profile = {
  name: "Lokendra Kumar",
  fullName: "Lokendra Kumar Prajapati",
  firstName: "Lokendra",
  title: "Senior Frontend Engineer",
  roles: [
    "Senior Frontend Engineer",
    "Frontend Architect",
    "AI Frontend Engineer",
    "React.js & Next.js Specialist",
    "Design System Builder",
  ],
  tagline: "React.js · Next.js · TypeScript · LLM Applications · Design Systems",
  location: "Akbarpur Itaura, Jalaun, Uttar Pradesh – 285202, India",
  shortLocation: "Delhi NCR · Uttar Pradesh, India",
  email: "lokendraitaura@gmail.com",
  phone: "+91 96968 52187",
  phoneRaw: "919696852187",
  whatsappMessage:
    "Hi Lokendra! I just visited your portfolio and would love to connect with you about an opportunity.",
  resume: "/Lokendra_Kumar_Resume.pdf",
  socials: {
    linkedin: "https://www.linkedin.com/in/lokendra-kumar-prajapati-9942072b8",
    github: "https://github.com/lokendraitaura",
    goChatPilot: "https://chat-pilot.in/",
    company: "https://zindagitech.com/",
  },
  summary:
    "Senior Frontend Engineer and Frontend Architect with 6+ years of experience building and scaling enterprise-grade web applications with React.js, Next.js and TypeScript. I have delivered 5 production projects across cybersecurity, ERP, HR, investment and AI domains, with deep strength in frontend architecture, design systems (Storybook), data-heavy UIs (React Flow, AG Grid), TanStack Query, performance, accessibility and Core Web Vitals.",
  aiSummary:
    "I build AI-powered interfaces with LLM APIs (OpenAI, Gemini, Groq), streaming chat UIs and prompt design, with working knowledge of the Vercel AI SDK, tool calling, RAG, LangChain.js, LangGraph.js, AI agents and MCP. I shipped GoChatPilot, a live AI-powered WhatsApp toolkit and Progressive Web App built on Next.js, Groq AI, Shadcn UI and Radix UI.",
  alsoSummary:
    "Beyond the browser I work with React Native, Node.js / Express.js / MongoDB, and DevOps and cloud basics (Docker, CI/CD, AWS). I earned 2 company awards at Zindagi Technologies for technical ownership and frontend excellence.",
};

export const whatsappLink = (message: string = profile.whatsappMessage) =>
  `https://wa.me/${profile.phoneRaw}?text=${encodeURIComponent(message)}`;

export const stats = [
  { value: 6, suffix: "+", label: "Years of experience" },
  { value: 5, suffix: "", label: "Production projects" },
  { value: 190, suffix: "+", label: "Skills & concepts" },
  { value: 2, suffix: "", label: "Company awards" },
];

export const navLinks = [
  { id: "projects", label: "Work" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "ai", label: "AI" },
  { id: "experience", label: "Experience" },
  { id: "awards", label: "Awards" },
  { id: "contact", label: "Contact" },
];
