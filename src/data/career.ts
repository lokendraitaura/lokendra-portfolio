export interface Experience {
  role: string;
  company: string;
  companyUrl?: string;
  period: string;
  duration: string;
  location: string;
  type: string;
  summary: string;
  highlights: string[];
  stack: string[];
}

export const experiences: Experience[] = [
  {
    role: "Senior Software Developer",
    company: "Zindagi Technologies Pvt. Ltd.",
    companyUrl: "https://zindagitech.com/",
    period: "Feb 2024 – Present",
    duration: "Current role",
    location: "Nehru Place, Delhi, India",
    type: "On-site · Full-time",
    summary:
      "Leading frontend architecture for an enterprise-grade Cybersecurity Simulation Platform that runs live Capture The Flag events, real-time training labs and user/role management at scale.",
    highlights: [
      "Lead frontend architecture for an enterprise-grade Cybersecurity Simulation Platform supporting live CTF events, real-time training modules and user/role management at scale.",
      "Architected a feature-based Co-location folder structure (components, styles, hooks and tests grouped by feature), improving maintainability and onboarding speed.",
      "Designed and built a reusable component library and design system from scratch with Storybook and Material UI, following SOLID and component-driven development, improving team velocity and UI consistency.",
      "Implemented server-state management with TanStack Query (React Query), eliminating redundant API calls and keeping complex multi-tab workflows in sync.",
      "Built React Flow network topology and real-time workflow diagrams, and integrated AG Grid (virtual scrolling, inline editing, filtering, custom cell renderers, bulk selection) for live monitoring and large enterprise datasets.",
      "Optimized performance with code splitting, React.lazy/Suspense, memoization and virtualization while tracking Web Vitals; delivered WCAG/ARIA-compliant, keyboard-navigable interfaces.",
      "Implemented role-based access control (RBAC) with permission-driven rendering and protected routing for granular user, role and permission management.",
      "Partnered with UI/UX designers in Figma; shipped responsive, pixel-perfect interfaces validated across browsers and devices with BrowserStack.",
      "Accelerated delivery with AI tools (Cursor AI, ChatGPT, Claude, Codex) for code generation, debugging, refactoring and documentation, reducing average feature delivery time.",
      "Earned 2 company awards, 'Standout Performer' and 'Pat on the Back', for technical ownership and contribution to product quality.",
    ],
    stack: ["React", "TypeScript", "TanStack Query", "AG Grid", "React Flow", "Material UI", "Storybook", "RBAC", "Figma", "BrowserStack"],
  },
  {
    role: "Junior Software Developer",
    company: "Tiwari Tech Industries Pvt. Ltd.",
    period: "Jan 2021 – Jan 2024",
    duration: "3 yrs 1 mo",
    location: "Noida, Uttar Pradesh, India",
    type: "On-site · Full-time",
    summary:
      "Built and maintained multiple production-grade web applications (ERP, HR and investment platforms) serving thousands of end users.",
    highlights: [
      "Developed and maintained 3+ production-grade web applications with React.js, Next.js, Redux and TypeScript serving thousands of end users.",
      "Built an ERP platform (sales, purchasing, vendor management, quotations, product catalog) with Next.js, TypeScript and Ant Design; used SSR and CSR pages for better SEO and faster TTFB.",
      "Developed an HR management portal covering onboarding, attendance tracking, leave management and automated HR document generation.",
      "Integrated REST APIs with Axios; implemented JWT authentication, role-based access control (RBAC) and protected dynamic routing.",
      "Collaborated in agile sprints and code reviews; applied clean-code, functional-component and reusable-architecture practices across all projects.",
    ],
    stack: ["React", "Next.js", "Redux", "TypeScript", "Ant Design", "Core UI", "Axios", "JWT", "Bootstrap"],
  },
];

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  org: string;
  description: string;
  highlights: string[];
  stack: string[];
  live?: string;
  accent: string;
  emoji: string;
}

export const featuredProject: Project = {
  slug: "gochatpilot",
  title: "GoChatPilot",
  subtitle: "AI-Powered WhatsApp Toolkit · Progressive Web App",
  org: "Personal SaaS Product",
  description:
    "\"WhatsApp Marketing Made Simple.\" A live, AI-powered Progressive Web App I designed, built and launched end-to-end as an independent product: one dashboard for WhatsApp links, QR codes, click-to-chat buttons, catalogs and AI-generated messages. I own the architecture, UI/UX, AI integration and deployment.",
  highlights: [
    "Built and launched end-to-end on Next.js App Router and TypeScript as an independent product.",
    "Integrated the Groq LLM API for low-latency responses with system prompts, prompt design and real-time streaming of replies.",
    "AI features: message generator, message improver, emoji suggester, 50+ language converter, customer-reply and status-caption generators.",
    "11+ WhatsApp tools: link, QR code, button and catalog generators, voice-to-message, templates, link shortener with analytics, auto-replies and more.",
    "Designed an accessible, composable interface with Shadcn UI on Radix UI primitives.",
    "Installable, offline-capable PWA with Service Workers for caching on desktop and mobile.",
    "Deployed on Vercel with a custom domain and automatic CI/CD from Git, built with an AI-assisted workflow (Cursor AI, Claude, ChatGPT, Codex).",
  ],
  stack: ["Next.js (App Router)", "TypeScript", "Groq AI API", "Shadcn UI", "Radix UI", "Tailwind CSS", "Service Workers", "PWA", "Vercel"],
  live: "https://chat-pilot.in/",
  accent: "#e879f9",
  emoji: "🤖",
};

export const projects: Project[] = [
  {
    slug: "cyber-security-platform",
    title: "Cyber Security Platform",
    subtitle: "Enterprise CTF & Training Simulation",
    org: "Zindagi Technologies",
    description:
      "Frontend architecture for live Capture The Flag events, real-time training labs and granular user, role and permission management.",
    highlights: [
      "Architected the frontend with the Co-location pattern for live CTF events and real-time training labs.",
      "Built a custom Storybook component library, TanStack Query server state and React Flow topology visualisations for real-time monitoring.",
      "Delivered role-based dashboards, live event workflows and large-scale data management via AG Grid.",
    ],
    stack: ["TypeScript", "React", "TanStack Query", "AG Grid", "Material UI", "React Flow", "Storybook"],
    accent: "#22d3ee",
    emoji: "🛡️",
  },
  {
    slug: "erp-platform",
    title: "Enterprise Resource Planning",
    subtitle: "Sales · Purchasing · Vendors · Catalog",
    org: "Tiwari Tech Industries",
    description:
      "A full ERP platform covering sales, purchases, vendor management, quotations, product catalog and multi-role user access.",
    highlights: [
      "Built modules for sales, purchases, vendor management, quotations and product catalog with multi-role access.",
      "Implemented SSR and CSR pages with Next.js for better SEO and faster TTFB, with TypeScript throughout.",
    ],
    stack: ["TypeScript", "Next.js", "Redux", "Ant Design", "Core UI", "Axios", "Figma"],
    accent: "#a78bfa",
    emoji: "🏭",
  },
  {
    slug: "hr-portal",
    title: "HR Portal System",
    subtitle: "Onboarding · Attendance · Leave",
    org: "Tiwari Tech Industries",
    description:
      "An HR management portal that digitised onboarding, attendance, leave and HR paperwork for the whole organisation.",
    highlights: [
      "Built employee onboarding, real-time attendance check-in/check-out and automated leave management.",
      "Automated Offer, Experience and Relieving Letter generation with dynamic data via CK Editor.",
    ],
    stack: ["JavaScript", "React", "Redux", "Core UI", "CK Editor", "Semantic UI"],
    accent: "#34d399",
    emoji: "👥",
  },
  {
    slug: "investment-platform",
    title: "Investment Management",
    subtitle: "Portfolio tracking for investors",
    org: "Tiwari Tech Industries",
    description:
      "An investor platform with registration, dynamic investment forms and real-time portfolio performance tracking.",
    highlights: [
      "Built investor registration, dynamic investment forms and real-time portfolio performance tracking.",
      "Integrated REST APIs with Axios for live investment data and Redux for centralised state.",
    ],
    stack: ["JavaScript", "React", "Redux", "Axios", "Bootstrap"],
    accent: "#fbbf24",
    emoji: "📈",
  },
];

export const awards = [
  {
    title: "Standout Performer",
    kind: "Certificate of Achievement",
    org: "Zindagi Technologies",
    date: "2025",
    image: "/awards/standout-performer.webp",
    imageAlt: "Standout Performer Certificate of Achievement awarded to Lokendra Kumar by Zindagi Technologies, signed by the Directors",
    aspect: "1034/711",
    description:
      "Awarded by the company Directors for exceptional ownership, timely delivery of critical frontend modules and lasting impact on product quality.",
    quote:
      "For his valuable contributions to Zindagi Technologies. His dedication and excellence have made a lasting impact, and we celebrate his achievements. His hard work inspires us all.",
    by: "Abhjit Singh Anand & Aditi Abhijit Anand, Directors",
  },
  {
    title: "Pat on the Back",
    kind: "Rewards & Recognition",
    org: "Zindagi Technologies",
    date: "Nov 2024",
    image: "/awards/pat-on-the-back.webp",
    imageAlt: "Pat on the Back award, November 2024, Zindagi Technologies, appreciating Lokendra Kumar",
    aspect: "1/1",
    description:
      "Recognised as the backbone of frontend operations for expertise, dedication and a proactive approach.",
    quote:
      "Appreciating Lokendra for being the backbone of our frontend operations. His expertise, dedication, and proactive approach have been instrumental in driving success.",
    by: "Zindagi Technologies",
  },
];

export const education = [
  {
    degree: "Master of Computer Applications (MCA)",
    school: "Kurukshetra University, Kurukshetra, Haryana",
    period: "In Progress",
  },
  {
    degree: "Bachelor of Science (B.Sc.)",
    school: "Bundelkhand University, Jhansi, Uttar Pradesh",
    period: "2022",
  },
];
