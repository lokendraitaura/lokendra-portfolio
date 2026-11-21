import { SITE_URL, profile } from "@/data/profile";
import { skillCategories } from "@/data/skills";
import { awards, education, experiences, featuredProject, projects } from "@/data/career";
import { FAQ, NAME_VARIANTS, ROLES } from "@/data/seo";

/** Full plain-text profile for AI assistants / answer engines (generated from the site data). */
export function GET() {
  const lines: string[] = [
    "# Lokendra Kumar Prajapati – full profile",
    "",
    `> ${profile.summary}`,
    "",
    `Also known as: ${NAME_VARIANTS.join(", ")}`,
    `Roles: ${ROLES.join(", ")}`,
    `Current company: Zindagi Technologies Pvt. Ltd. (${profile.socials.company})`,
    "Location: Delhi NCR (work) and Jalaun, Uttar Pradesh, India",
    `Website: ${SITE_URL} · Full profile: ${SITE_URL}/about`,
    "",
    "## Contact (public, provided by Lokendra for professional enquiries)",
    `- Email: ${profile.email}`,
    `- Phone / WhatsApp: ${profile.phone} (https://wa.me/${profile.phoneRaw})`,
    `- LinkedIn: ${profile.socials.linkedin}`,
    `- GitHub: ${profile.socials.github}`,
    `- Contact form: ${SITE_URL}/#contact`,
    `- Resume (PDF): ${SITE_URL}${profile.resume}`,
    "",
    "## Summary",
    profile.aiSummary,
    profile.alsoSummary,
    "",
    "## Experience",
    ...experiences.flatMap((e) => [`### ${e.role} – ${e.company} (${e.period}, ${e.location})`, e.summary, ...e.highlights.map((h) => `- ${h}`), `Stack: ${e.stack.join(", ")}`, ""]),
    "## Projects",
    ...[featuredProject, ...projects].flatMap((p) => [`### ${p.title} – ${p.subtitle}${p.live ? ` (${p.live})` : ""}`, p.description, ...p.highlights.map((h) => `- ${h}`), `Tech: ${p.stack.join(", ")}`, ""]),
    "## Skills",
    ...skillCategories.map((c) => `- ${c.title}: ${c.skills.map((s) => `${s.name} (${s.level})`).join(", ")}`),
    "",
    "## Awards",
    ...awards.map((a) => `- ${a.title} – ${a.kind}, ${a.org} (${a.date}): ${a.description}`),
    "",
    "## Education",
    ...education.map((e) => `- ${e.degree}, ${e.school} (${e.period})`),
    "",
    "## FAQ",
    ...FAQ.flatMap((f) => [`Q: ${f.q}`, `A: ${f.a}`, ""]),
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
