"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { Download, MapPin, Sparkles } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { profile, whatsappLink } from "@/data/profile";
import Magnetic from "@/components/ui/Magnetic";
import Typewriter from "@/components/ui/Typewriter";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useState } from "react";
import { useConstrainedNetwork, useIdleReady, useLiteDevice } from "@/hooks/usePerf";
import HeroPoster from "@/components/three/HeroPoster";

// The 3D engine (~1 MB) only downloads once the page is idle; a pre-rendered still shows meanwhile.
const HeroScene = dynamic(() => import("@/components/three/HeroScenes").then(m => m.HeroScene), {
  ssr: false,
  loading: () => <HeroPoster />,
});

export default function Hero({ hasAvatar = false }: { hasAvatar?: boolean }) {
  const compact = useMediaQuery("(max-width: 767px)");
  const lite = useLiteDevice();
  // Phones: 3D starts on the first touch/scroll, or by itself a few seconds after load (keeps first paint fast).
  const idle = useIdleReady(lite ? 4500 : 0, { onInteraction: lite });
  const constrained = useConstrainedNetwork();
  const [forced, setForced] = useState(false);
  // Live 3D on every device once the page is idle (the identical still shows until then).
  // Only Data Saver / 2G connections wait for a tap, to save their data.
  const show3D = forced || (idle && !constrained);
  const reduced = useReducedMotion();
  const entrance = { initial: { opacity: 0, y: reduced ? 0 : 24 }, animate: { opacity: 1, y: 0 } };

  return (
    <section id="home" aria-labelledby="hero-title" className="hero-universe">
      <div className="universe-glow" aria-hidden />
      <div className="universe-word" aria-hidden>CREATIVE DEVELOPER</div>
      <div className="container-x relative">
        <div className="universe-intro"><span><span className="availability-dot" /> Open to opportunities</span><span><MapPin size={14} /> India · Working beyond boundaries</span></div>
        <div className="universe-composition">
          <div className="universe-copy">
            <motion.p {...entrance} transition={{ duration: 0.5 }} className="universe-hello"><span className="hello-line" /> Hey, I&apos;m</motion.p>
            <motion.h1 {...entrance} transition={{ duration: 0.8, delay: 0.08 }} id="hero-title" className="universe-name">Lokendra<br /> <span>Kumar.</span><span className="sr-only"> Prajapati – Senior Software Developer &amp; Frontend Architect at Zindagi Technologies</span></motion.h1>
            <motion.div {...entrance} transition={{ duration: 0.7, delay: 0.16 }} className="universe-role"><span aria-hidden>&lt;</span><span>{reduced ? profile.title : <Typewriter words={profile.roles.slice(0, 3)} />}</span><span aria-hidden>/&gt;</span></motion.div>
            <motion.p {...entrance} transition={{ duration: 0.7, delay: 0.24 }} className="universe-description">Engineering the complex.<br /><strong>Making it feel effortless.</strong><span>I build expressive web experiences, scalable platforms, and interfaces with a little intelligence.</span></motion.p>
            <motion.div {...entrance} transition={{ duration: 0.7, delay: 0.32 }} className="universe-ctas"><Magnetic><a href="#projects" className="universe-primary"><Sparkles size={17} /> Discover my work</a></Magnetic><a href="#contact" className="universe-secondary">Let&apos;s create something</a></motion.div>
            <motion.div {...entrance} transition={{ duration: 0.7, delay: 0.4 }} className="universe-socials">
              <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile"><FaGithub size={20} /></a>
              <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile"><FaLinkedinIn size={19} /></a>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"><FaWhatsapp size={21} /></a>
              <span />
              <a href={profile.resume} download className="universe-resume"><Download size={16} /> Get my resume</a>
            </motion.div>
          </div>
          <div className="universe-scene">
            {show3D ? <HeroScene compact={compact} hasAvatar={hasAvatar} /> : <HeroPoster />}
            {!show3D && constrained && (
              <button type="button" onClick={() => setForced(true)} className="hero-load-3d">
                <span aria-hidden>✦</span> Tap to explore in 3D
              </button>
            )}
          </div>
        </div>
        <div className="universe-footer">
          <p>Built with curiosity.<br /><span>Backed by experience.</span></p>
          <div className="universe-metrics">{[['6+', 'Years of craft'], ['5', 'Shipped platforms'], ['2', 'Company awards']].map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
          <a href="#projects" className="universe-scroll"><span className="scroll-track"><span /></span><span>Keep exploring</span></a>
        </div>
      </div>
    </section>
  );
}
