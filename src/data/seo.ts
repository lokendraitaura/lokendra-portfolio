import { SITE_URL, profile } from "./profile";
import { allSkills } from "./skills";
import { awards, education, experiences, featuredProject, projects } from "./career";

/**
 * Single source of truth for search: titles, descriptions, name variants, FAQ and JSON-LD.
 * Google ranks what is visible on the page + structured data + links pointing here,
 * so every phrase people may search for is used naturally in visible copy too.
 */

export const SITE_NAME = "Lokendra Kumar Prajapati";

/** Every way people may type the name (used in JSON-LD alternateName + copy). */
export const NAME_VARIANTS = [
  "Lokendra",
  "Lokendra Kumar",
  "Lokendra Prajapati",
  "Lokendra Kumar Prajapati",
  "Lokendra K Prajapati",
  "lokendraitaura",
];

export const ROLES = [
  "Senior Software Developer",
  "Senior Frontend Engineer",
  "Frontend Architect",
  "AI Frontend Engineer",
  "React.js Developer",
  "Next.js Developer",
];

export const SEO_TITLE = "Lokendra Kumar Prajapati – Senior Software Developer & Frontend Architect";

export const SEO_DESCRIPTION =
  "Lokendra Kumar Prajapati (Lokendra) is a Senior Software Developer and Frontend Architect at Zindagi Technologies with 6+ years of experience in React.js, Next.js, TypeScript, design systems, AG Grid, React Flow, TanStack Query and AI interfaces. Creator of GoChatPilot. Based in Delhi NCR, India and open to opportunities.";

export const KEYWORDS = [
  ...NAME_VARIANTS,
  "Lokendra Senior Software Developer",
  "Lokendra Kumar Senior Software Developer",
  "Lokendra Kumar Prajapati Senior Software Developer",
  "Lokendra Senior Frontend Engineer",
  "Lokendra Kumar Frontend Architect",
  "Lokendra React developer",
  "Lokendra Zindagi Technologies",
  "Lokendra Kumar Zindagi Technologies",
  "Lokendra portfolio",
  "lokendra.work",
  ...ROLES,
  "Zindagi Technologies developer",
  "Frontend developer Delhi",
  "React developer Delhi NCR",
  "Next.js developer India",
  "TypeScript developer India",
  "Frontend developer Noida",
  "Frontend developer Uttar Pradesh",
  "Storybook design system developer",
  "AG Grid React developer",
  "React Flow developer",
  "TanStack Query developer",
  "LLM UI developer",
  "AI chat interface developer",
  "GoChatPilot",
  "hire senior frontend engineer India",
];

/** Visible FAQ (rendered on the page) – mirrors the queries people search for. */
export const FAQ: { q: string; a: string }[] = [
  {
    q: "Who is Lokendra Kumar Prajapati?",
    a: "Lokendra Kumar Prajapati (Lokendra Kumar) is a Senior Software Developer and Frontend Architect from Uttar Pradesh, India, with 6+ years of experience building enterprise web applications with React.js, Next.js and TypeScript. He leads frontend architecture at Zindagi Technologies in Delhi and created GoChatPilot, an AI-powered WhatsApp toolkit.",
  },
  {
    q: "What does Lokendra do at Zindagi Technologies?",
    a: "At Zindagi Technologies, Lokendra works as a Senior Software Developer leading the frontend architecture of an enterprise Cybersecurity Simulation Platform: live Capture The Flag events, real-time training labs, role-based access control, a Storybook + Material UI design system, TanStack Query server state, React Flow network diagrams and AG Grid data tables.",
  },
  {
    q: "What are Lokendra Kumar's main skills?",
    a: "React.js 18/19, Next.js (App Router, SSR, ISR, Server Actions), TypeScript, JavaScript, Redux Toolkit, Zustand, TanStack Query, Material UI, Tailwind CSS, Shadcn UI, Storybook design systems, AG Grid, React Flow, performance and Core Web Vitals, accessibility (WCAG/ARIA), PWAs, testing (Jest, React Testing Library, Playwright) and AI frontends with OpenAI, Gemini, Groq, RAG, LangChain.js, LangGraph.js and MCP.",
  },
  {
    q: "Is Lokendra available for hire?",
    a: "Yes. Lokendra is open to senior frontend, frontend architect and AI frontend engineering roles, as well as freelance and consulting projects. You can reach him through the contact form on lokendra.work, by email at lokendraitaura@gmail.com or on WhatsApp at +91 96968 52187.",
  },
  {
    q: "Where is Lokendra Kumar based?",
    a: "Lokendra is based in India: he works from Delhi NCR (Nehru Place, Delhi) and is from Jalaun, Uttar Pradesh. He works with teams across time zones.",
  },
  {
    q: "What is GoChatPilot?",
    a: "GoChatPilot (chat-pilot.in) is a live AI-powered WhatsApp marketing toolkit and Progressive Web App that Lokendra designed, built and launched end-to-end with Next.js, TypeScript, Groq AI, Shadcn UI and Radix UI.",
  },
];

const PERSON_ID = `${SITE_URL}/#person`;
const ORG_ID = `${SITE_URL}/#zindagi-technologies`;
const SITE_ID = `${SITE_URL}/#website`;
const PAGE_ID = `${SITE_URL}/#profilepage`;
const UPDATED = "2026-11-21";

export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: profile.fullName,
      givenName: "Lokendra",
      additionalName: "Kumar",
      familyName: "Prajapati",
      alternateName: NAME_VARIANTS,
      jobTitle: "Senior Software Developer",
      description: SEO_DESCRIPTION,
      url: SITE_URL,
      mainEntityOfPage: { "@id": PAGE_ID },
      image: { "@type": "ImageObject", url: `${SITE_URL}/images/lokendra.jpg`, width: 579, height: 768, caption: "Lokendra Kumar Prajapati" },
      email: `mailto:${profile.email}`,
      telephone: profile.phone.replace(/\s/g, ""),
      gender: "Male",
      nationality: { "@type": "Country", name: "India" },
      knowsLanguage: ["English", "Hindi"],
      address: { "@type": "PostalAddress", addressLocality: "Jalaun", addressRegion: "Uttar Pradesh", addressCountry: "IN" },
      workLocation: { "@type": "Place", name: "Delhi NCR", address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressRegion: "Delhi", addressCountry: "IN" } },
      worksFor: { "@id": ORG_ID },
      hasOccupation: {
        "@type": "Occupation",
        name: "Senior Software Developer",
        alternateName: ROLES,
        occupationalCategory: "15-1254.00 Web Developers",
        skills: allSkills.slice(0, 60).map((s) => s.name).join(", "),
        occupationLocation: { "@type": "Country", name: "India" },
      },
      alumniOf: education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school.split(",")[0] })),
      award: awards.map((a) => `${a.title} – ${a.org} (${a.date})`),
      knowsAbout: allSkills.map((s) => s.name),
      sameAs: [profile.socials.linkedin, profile.socials.github, profile.socials.goChatPilot],
    },
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Zindagi Technologies Pvt. Ltd.",
      alternateName: "Zindagi Technologies",
      url: profile.socials.company,
      employee: { "@id": PERSON_ID },
    },
    {
      "@type": "WebSite",
      "@id": SITE_ID,
      url: SITE_URL,
      name: SITE_NAME,
      alternateName: ["Lokendra", "Lokendra Kumar", "lokendra.work"],
      description: SEO_DESCRIPTION,
      inLanguage: "en-IN",
      publisher: { "@id": PERSON_ID },
    },
    {
      "@type": "ProfilePage",
      "@id": PAGE_ID,
      url: SITE_URL,
      name: SEO_TITLE,
      description: SEO_DESCRIPTION,
      inLanguage: "en-IN",
      dateCreated: "2026-11-19",
      dateModified: UPDATED,
      mainEntity: { "@id": PERSON_ID },
      about: { "@id": PERSON_ID },
      isPartOf: { "@id": SITE_ID },
      primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}/images/lokendra.jpg` },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [{ "@type": "ListItem", position: 1, name: "Lokendra Kumar Prajapati", item: SITE_URL }],
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#gochatpilot`,
      name: featuredProject.title,
      url: featuredProject.live,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web, Android, iOS (PWA)",
      description: featuredProject.description,
      author: { "@id": PERSON_ID },
      creator: { "@id": PERSON_ID },
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/#projects`,
      name: "Projects by Lokendra Kumar Prajapati",
      itemListElement: [featuredProject, ...projects].map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "CreativeWork", name: p.title, description: p.description, creator: { "@id": PERSON_ID }, keywords: p.stack.join(", ") },
      })),
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/#experience`,
      name: "Work experience of Lokendra Kumar Prajapati",
      itemListElement: experiences.map((e, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "OrganizationRole", roleName: e.role, startDate: e.period.split("–")[0].trim(), description: `${e.role} at ${e.company} (${e.period}). ${e.summary}` },
      })),
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
};
