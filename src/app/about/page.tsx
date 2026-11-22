import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, profile, whatsappLink } from "@/data/profile";
import { skillCategories } from "@/data/skills";
import { awards, education, experiences, featuredProject, projects } from "@/data/career";
import { FAQ, NAME_VARIANTS, ROLES } from "@/data/seo";

const TITLE = "About Lokendra Kumar Prajapati – Senior Software Developer at Zindagi Technologies";
const DESCRIPTION =
  "Full profile of Lokendra Kumar Prajapati (Lokendra Kumar): Senior Software Developer and Frontend Architect at Zindagi Technologies, Delhi. Experience, skills, projects, awards, education and contact details (email, phone, WhatsApp, LinkedIn, GitHub).";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: { type: "profile", url: `${SITE_URL}/about`, title: TITLE, description: DESCRIPTION, firstName: "Lokendra", lastName: "Prajapati", username: "lokendraitaura" },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${SITE_URL}/about#webpage`,
  url: `${SITE_URL}/about`,
  name: TITLE,
  description: DESCRIPTION,
  inLanguage: "en-IN",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  mainEntity: { "@id": `${SITE_URL}/#person` },
  about: { "@id": `${SITE_URL}/#person` },
  primaryImageOfPage: { "@id": `${SITE_URL}/#photo` },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "About Lokendra Kumar Prajapati", item: `${SITE_URL}/about` },
    ],
  },
};

const h2 = "mt-14 font-display text-2xl font-semibold text-white sm:text-3xl";
const card = "rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6";

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd).replace(/</g, "\\u003c") }} />
      <header className="border-b border-white/10 bg-ink">
        <nav aria-label="Breadcrumb" className="container-x flex h-16 items-center justify-between text-sm">
          <ol className="flex items-center gap-2 text-muted">
            <li>
              <Link href="/" className="font-semibold text-white hover:underline">
                Lokendra Kumar Prajapati
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page">About</li>
          </ol>
          <Link href="/#contact" className="rounded-full bg-violet-700 px-4 py-2 font-semibold text-white">
            Hire me
          </Link>
        </nav>
      </header>

      <main id="main" className="container-x max-w-5xl pb-24 pt-12 text-[15px] leading-relaxed text-muted sm:text-base">
        <article>
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/lokendra-kumar-prajapati.jpg"
              width={1089}
              height={1444}
              alt="Lokendra Kumar Prajapati – Senior Software Developer and Frontend Architect, Zindagi Technologies, Delhi"
              className="h-72 w-56 shrink-0 rounded-3xl object-cover object-top ring-1 ring-white/15"
             
              fetchPriority="high"
            />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">About</p>
              <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Lokendra Kumar Prajapati
              </h1>
              <p className="mt-3 text-lg text-white/90">
                <span>Senior Software Developer</span> · Frontend Architect · AI Frontend Engineer at{" "}
                <a href={profile.socials.company} className="text-cyan-300 underline underline-offset-4">
                  Zindagi Technologies
                </a>
              </p>
              <p className="mt-2">Delhi NCR · Jalaun, Uttar Pradesh, India · 6+ years of experience · Open to opportunities</p>
              <p className="mt-2 text-sm">Also known as: {NAME_VARIANTS.join(", ")}</p>
            </div>
          </div>

          <h2 className={h2}>Summary</h2>
          <p className="mt-4">{profile.summary}</p>
          <p className="mt-4">{profile.aiSummary}</p>
          <p className="mt-4">{profile.alsoSummary}</p>

          <h2 className={h2} id="contact">Contact Lokendra Kumar Prajapati</h2>
          <dl className={`${card} mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-[max-content_1fr]`}>
            <dt className="font-semibold text-white">Email</dt>
            <dd><a href={`mailto:${profile.email}`} className="text-cyan-300 hover:underline">{profile.email}</a></dd>
            <dt className="font-semibold text-white">Phone</dt>
            <dd><a href={`tel:+${profile.phoneRaw}`} className="text-cyan-300 hover:underline">{profile.phone}</a></dd>
            <dt className="font-semibold text-white">WhatsApp</dt>
            <dd><a href={whatsappLink()} className="text-cyan-300 hover:underline">wa.me/{profile.phoneRaw}</a></dd>
            <dt className="font-semibold text-white">Website</dt>
            <dd><a href={SITE_URL} className="text-cyan-300 hover:underline">{SITE_URL.replace(/^https?:\/\//, "")}</a></dd>
            <dt className="font-semibold text-white">LinkedIn</dt>
            <dd><a href={profile.socials.linkedin} className="break-all text-cyan-300 hover:underline">{profile.socials.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</a></dd>
            <dt className="font-semibold text-white">GitHub</dt>
            <dd><a href={profile.socials.github} className="text-cyan-300 hover:underline">github.com/lokendraitaura</a></dd>
            <dt className="font-semibold text-white">Resume</dt>
            <dd><a href={profile.resume} className="text-cyan-300 hover:underline">Download resume (PDF)</a></dd>
            <dt className="font-semibold text-white">Location</dt>
            <dd>Delhi NCR (work) · Jalaun, Uttar Pradesh, India</dd>
          </dl>

          <h2 className={h2}>Roles</h2>
          <p className="mt-4">{ROLES.join(" · ")}</p>

          <h2 className={h2}>Work experience</h2>
          <div className="mt-4 space-y-4">
            {experiences.map((e) => (
              <section key={e.company} className={card}>
                <h3 className="font-display text-xl font-semibold text-white">
                  {e.role} · {e.company}
                </h3>
                <p className="text-sm">{e.period} · {e.location} · {e.type}</p>
                <p className="mt-3">{e.summary}</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-5">
                  {e.highlights.map((h) => <li key={h}>{h}</li>)}
                </ul>
                <p className="mt-3 text-sm"><span className="font-semibold text-white">Stack:</span> {e.stack.join(", ")}</p>
              </section>
            ))}
          </div>

          <h2 className={h2}>Projects</h2>
          <div className="mt-4 space-y-4">
            {[featuredProject, ...projects].map((p) => (
              <section key={p.slug} className={card}>
                <h3 className="font-display text-xl font-semibold text-white">
                  {p.live ? <a href={p.live} className="hover:underline">{p.title}</a> : p.title} – {p.subtitle}
                </h3>
                <p className="text-sm">{p.org}</p>
                <p className="mt-2">{p.description}</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-5">
                  {p.highlights.map((h) => <li key={h}>{h}</li>)}
                </ul>
                <p className="mt-3 text-sm"><span className="font-semibold text-white">Tech:</span> {p.stack.join(", ")}</p>
              </section>
            ))}
          </div>

          <h2 className={h2}>Skills</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {skillCategories.map((c) => (
              <section key={c.id} className={card}>
                <h3 className="font-display text-lg font-semibold text-white">{c.title}</h3>
                <p className="mt-2 text-sm">{c.skills.map((s) => `${s.name} (${s.level})`).join(" · ")}</p>
              </section>
            ))}
          </div>

          <h2 className={h2}>Awards</h2>
          <ul className="mt-4 space-y-3">
            {awards.map((a) => (
              <li key={a.title} className={card}>
                <span className="font-semibold text-white">{a.title}</span> – {a.kind}, {a.org} ({a.date}). {a.description}
              </li>
            ))}
          </ul>

          <h2 className={h2}>Education</h2>
          <ul className="mt-4 space-y-2">
            {education.map((e) => (
              <li key={e.degree}>
                <span className="font-semibold text-white">{e.degree}</span>, {e.school} ({e.period})
              </li>
            ))}
          </ul>

          <h2 className={h2}>Frequently asked questions</h2>
          <div className="mt-4 space-y-4">
            {FAQ.map((f) => (
              <section key={f.q}>
                <h3 className="font-semibold text-white">{f.q}</h3>
                <p className="mt-1">{f.a}</p>
              </section>
            ))}
          </div>

          <h2 className={h2} id="photo-license">Photo usage</h2>
          <p className="mt-4">
            Photos of Lokendra Kumar Prajapati on this site are © Lokendra Kumar Prajapati. They may be used to refer to him (for example in articles,
            event listings or recruiting profiles) with credit &quot;Lokendra Kumar Prajapati&quot; and a link to lokendra.work. For other uses, email{" "}
            <a href={`mailto:${profile.email}`} className="text-cyan-300 underline underline-offset-4">{profile.email}</a>.
          </p>

          <p className="mt-14">
            <Link href="/" className="font-semibold text-cyan-300 hover:underline">← Back to the interactive portfolio</Link>
          </p>
        </article>
      </main>
    </>
  );
}
