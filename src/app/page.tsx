import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import TechMarquee from "@/components/sections/TechMarquee";
import SearchShowcase from "@/components/sections/SearchShowcase";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import AIShowcase from "@/components/sections/AIShowcase";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Awards from "@/components/sections/Awards";
import Contact from "@/components/sections/Contact";
import VelocityText from "@/components/sections/VelocityText";
import Bento from "@/components/sections/Bento";
import Faq from "@/components/sections/Faq";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { media } from "@/data/media";

/** Media slots are resolved at build time, so missing optional files never cause 404s. */
const inPublic = (url: string) => existsSync(join(process.cwd(), "public", url));

export default function Home() {
  const hasAvatar = inPublic(media.avatar);
  const sceneImages = Object.fromEntries(
    Object.entries(media.scenes).map(([k, url]) => [k, inPublic(url) ? url : null])
  ) as Record<keyof typeof media.scenes, string | null>;
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero hasAvatar={hasAvatar} />
        <TechMarquee />
        <Projects />
        <About sceneImages={sceneImages} hasAvatar={hasAvatar} />
        <Bento />
        <VelocityText top="React · Next.js · TypeScript ·" bottom="Design Systems · AI Interfaces ·" />
        <Skills />
        <AIShowcase />
        <Experience />
        <VelocityText top="Build · Ship · Scale ·" bottom="Fast · Accessible · Beautiful ·" />
        <Awards />
        <SearchShowcase />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
