# Project context: Lokendra Kumar portfolio

You are picking up an existing, working project. This file explains what was built, why each decision was made, which bugs were already fixed (so you don't reintroduce them) and what is still open. Read it fully before changing code.

---

## 1. Who and what

- **Owner:** Lokendra Kumar (Lokendra Kumar Prajapati). Senior Frontend Engineer, Frontend Architect and AI Frontend Engineer, 6+ years of experience. Senior Software Developer at Zindagi Technologies, Delhi. Two company awards: "Standout Performer" (2025) and "Pat on the Back" (Nov 2024). Creator of GoChatPilot (https://chat-pilot.in, an AI-powered WhatsApp marketing toolkit / PWA).
- **Goal:** the best possible personal portfolio. It should be fully animated, 3D, fully responsive and SEO-ready (it will be deployed and should rank on Google for his name), every skill should be described, the contact form must deliver to his inbox, and visitors should be able to WhatsApp him directly.
- **Communication:** the owner writes in Hinglish (Hindi in Latin script mixed with English) and expects a very polished, "world-class" result. He reviews visually and reports problems with screenshots.
- **Location on disk:** `/home/zindagi/Downloads/Portfolio`
- **Content sources:** his resume PDF (LinkedIn blocks scraping, so all data came from the resume) and the live GoChatPilot site.

## 2. Tech stack

| Area | Choice |
| --- | --- |
| Framework | **Next.js 16.4.6** (App Router, Turbopack) with `cacheComponents: true` and `partialPrefetching: true`, React 19.3, TypeScript 5 |
| Styling | **Tailwind CSS v4** (CSS-first `@theme` in `src/app/globals.css`, no tailwind.config) |
| Animation | framer-motion 14, Lenis 1.3 smooth scroll |
| 3D | three 0.187, @react-three/fiber 9.8, @react-three/drei 10.7 |
| Email | nodemailer 10 (plus HTTP relays, see §8) |
| Icons | lucide-react, react-icons (si / fa / tb) |
| Fonts | `next/font/google`: **Plus Jakarta Sans** (body, CSS var `--font-inter`), **Sora** (display, `--font-grotesk`), JetBrains Mono |

**Important environment notes**
- Node is **only available via nvm**: run `. ~/.nvm/nvm.sh && nvm use 22` before any `npm`/`npx` command.
- Next 16 differs from older versions. `AGENTS.md` says to read `node_modules/next/dist/docs/` before writing Next-specific code. Under cacheComponents, `Math.random()`/`Date.now()` during prerender break the build, so keep them in client components or effects.
- The React Compiler ESLint rules are strict. They forbid `setState` synchronously inside effects, mutating values returned from hooks, and impure calls during render. Patterns used to satisfy them: `useSyncExternalStore` (`useMediaQuery`, `ThemeStore`), classes for mutable canvas painters, and `useEffect` for random values.
- `next.config.ts` sets `output: "standalone"` (for the Dockerfile / Google Cloud Run), `poweredByHeader: false`, AVIF/WebP images and basic security headers.
- Scripts: `npm run dev`, `npm run build`, `npm start`, `npm run lint`. `npx tsc --noEmit` and `npx eslint src` were kept at zero errors throughout.

## 3. File map

```
src/app/
  layout.tsx            fonts, full SEO metadata, JSON-LD (Person/WebSite/ProfilePage), inline theme boot script,
                        global UI (AuroraBackground, SmoothScroll, Preloader, ScrollProgress, SpotlightTracker,
                        FloatingActions, ThemeCustomizer). <html suppressHydrationWarning> because the boot script sets
                        a class and CSS vars before React hydrates.
  page.tsx              section order; checks at BUILD time (fs.existsSync) whether public/models/avatar.glb and
                        public/scenes/*.webp exist, so missing optional media never causes 404s
  api/contact/route.ts  contact form delivery (see §8)
  globals.css           theme tokens, palette remapping, light mode, utilities, keyframes, typography
  sitemap.ts robots.ts manifest.ts opengraph-image.tsx icon.png apple-icon.png
src/data/
  profile.ts   name, roles, email, phone, socials, summaries, stats, navLinks, whatsappLink(), SITE_URL
  skills.ts    193 skills in 16 categories; each has name, level (Expert/Advanced/Proficient/Working knowledge),
               description and icon. Also featuredTech for the marquee.
  career.ts    experiences, featuredProject (GoChatPilot), projects, awards (with original image + quote), education
  themes.ts    8 theme presets, storage keys, inline themeBootScript
  media.ts     drop-in media slots (avatar GLB, optional realistic scene images)
src/components/
  layout/   Navbar, Footer, AuroraBackground, SmoothScroll, Preloader, ScrollProgress, SpotlightTracker,
            FloatingActions (WhatsApp + back-to-top), ThemeCustomizer ("Theme studio" panel), ThemeStore (stores)
  sections/ Hero, TechMarquee, Bento ("At a glance"), SearchShowcase (animated Google search), About
            ("A day in my life"), VelocityText, Skills + SkillSphere, AIShowcase, Experience, Projects, Awards, Contact
  three/    RealAvatar (rigged avatar animation engine), SceneKit (canvas, lights, backdrop, speech bubble),
            HeroScenes (hero stage), DayScenes (About scenes), Workstation (desk, laptop, monitor, office chair),
            Workspace (fallback desk scene + CodeScreen live-typing canvas texture)
  illustrations/ old SVG scenes + cartoon head (only a fallback when no avatar.glb exists)
  ui/       Reveal, SectionHeading, TiltCard, Magnetic, Counter, Typewriter
public/
  models/avatar.glb        his Avaturn avatar, optimised (see §6)
  images/lokendra.webp|jpg his real headshot; lokendra-avatar.webp is a 256px face crop for the logo
  awards/*.webp            original award images
  Lokendra_Kumar_Resume.pdf
README.md  setup, deploy (Vercel / Cloud Run), Google Search Console steps
.env.example  all environment variables with instructions
Dockerfile, .dockerignore
```

## 4. Page sections (in order)

1. **Navbar:** full-width, **solid/opaque** (`bg-ink`, no glass, never hides on scroll). Contains his real photo in a spinning theme-gradient ring, scroll-spy links, a dark/light toggle, a Theme Studio button, Resume and Hire me. The mobile menu is a full-screen overlay.
2. **Hero:** headline, typewriter roles, CTAs (Let's work together / WhatsApp / Resume) and a **3D scene**: his avatar **seated on an office chair, coding** on a laptop, with a large monitor beside him showing live-typed code, floating tech chips and a "Track record" card.
3. **TechMarquee:** infinite logo strip.
4. **Bento "At a glance":** current role, live IST clock with online status, stats counters, toolkit grid, GoChatPilot live card, award thumbnails, quick contact.
5. **SearchShowcase:** an animated mock browser that types "Lokendra Kumar Senior Frontend Engineer" into Google, then shows results plus a knowledge panel with his **real photo** and award thumbnails, and a link to search Google for real. The results **always reserve their layout height** and the search screen overlays them; this prevents layout shift (CLS).
6. **About:** bio, counters, pillars, and **"A day in my life"** with 4 tabs in this order: **Architecting → Coding → Collaborating → Shipping**. One shared 3D canvas where the avatar changes pose per tab (points at an architecture diagram; sits at the desk coding; presents to a meeting; waves with confetti while shipping). HTML overlays sit on top of the canvas.
7. **VelocityText:** giant text bands whose speed follows scroll velocity. They only animate while in view.
8. **Skills:** 3D drag-able word sphere plus an explorer (categories sidebar, search, every skill card has a description and level bar). Hidden categories stay in the DOM for SEO.
9. **AIShowcase:** LLM pipeline animation, a streaming "Ask about Lokendra" chat demo with canned answers, and capability cards.
10. **Experience:** scroll-drawn timeline.
11. **Projects:** GoChatPilot **running live in an iframe** inside laptop/phone mockups, plus 4 project cards.
12. **Awards:** the **original award images** (Standout Performer certificate, Pat on the Back Nov 2024) in glowing frames with quotes and a full-screen lightbox (Esc or backdrop click closes it).
13. **Contact:** channel cards, a form ("Send to my inbox"), "Send on WhatsApp" which pre-fills a WhatsApp message, and a floating WhatsApp button site-wide.
14. **Footer.**

## 5. Theme system (do not break)

- **Three accent variables:** `--c1` (primary), `--c2` (secondary), `--c3` (accent), plus `--bg-tint`. In `globals.css` the Tailwind palettes **violet / purple / indigo / fuchsia → c1**, **cyan / sky → c2** and **pink → c3** are remapped with `color-mix()`. Every `bg-violet-500`, `text-cyan-300` and so on therefore follows the active theme automatically. Hardcoded purple/cyan `rgba()` values were also converted to `color-mix(in oklab, var(--c1) X%, transparent)`.
- **Theme Studio** (`ThemeCustomizer.tsx`): opened from the navbar palette button through `openThemeStudio()`, a window event. It has a Dark/Light switch, 8 presets (Aurora, Deep Ocean, Emerald, Sunset, Cyber Neon, Crimson, Royal Gold, Graphite), colour pickers for c1/c2/c3/bg, "Surprise me" and Reset. The choice persists in `localStorage` (`lk-theme`, `lk-mode`).
- **3D colours** read the theme via `useTheme()` (`useSyncExternalStore`).
- **No flash:** `themeBootScript` (inline in `<head>`) applies the saved colours and the `light` class before first paint.
- **Light mode** (`html.light`): instead of rewriting every component, the CSS remaps `--color-white` to ink, `--color-ink` to paper, deepens the light accent shades for contrast and fixes the text gradients. Elements that must stay dark (code panels, mock browser, chat demo, lightbox, Theme Studio, 3D overlays) carry the class **`dark-island`**, which restores the dark variables inside them. Solid gradient buttons keep white text. Default mode is **dark** and the default theme is **Sunset** (`#f97316 / #facc15 / #f43f5e`, bg `#2e130b`); keep `DEFAULT_THEME` in `themes.ts` and the `:root` vars in `globals.css` in sync.

## 6. The 3D avatar (most complex part)

- **Source:** the owner made an avatar on **Avaturn** and sent it as `model.glb.pdf`. It is really a GLB; the `.pdf` extension was just a renaming trick. The file includes a motion-capture idle clip "IdleV4.2(maya_head)" and **no face blendshapes**, so the avatar cannot blink or lip-sync. The code supports ARKit blendshapes if a future export includes them.
- **Pipeline:**
  1. The tie was removed. It is part of the outfit mesh (`avaturn_look_0`), so its 300 triangles were found by UV region plus 3D position (front centre of the chest, y 1.29–1.59 m) and painted in the outfit texture with the shirt's white. The work was done with Python and `@gltf-transform/core` in a scratch folder.
  2. The file was optimised with `npx @gltf-transform/cli@4 optimize in.glb out.glb --simplify false --compress meshopt --texture-compress webp --texture-size 2048`, taking it from 4.2 MB to 1.3 MB. **Use `--simplify false`**; simplifying can damage the rig.
  3. It is loaded with `useGLTF(url, false, true)`: Draco off, meshopt on. The meshopt decoder is bundled, so no CDN is involved.
- **`RealAvatar.tsx` engine** (rig-agnostic; finds bones by normalised name aliases):
  - Normalises the avatar to 1.75 m, then makes it **4 % taller** (`scale y ×1.04, x/z ×0.99`) at the owner's request. Hair colour is darkened to black.
  - Plays the mocap idle through `AnimationMixer`, and **squares the idle's average facing to the camera** so the avatar does not look turned.
  - Procedural layer on top: arm poses blended with `aimBoneBlend` (world-space aiming from bone to child), wave, head and neck follow, and the seated legs.
  - **Poses:** `relaxed` (idle drives the arms), `type` (standing typing), **`sit`** (seated typing: the body drops so the hip is about 10 cm above `SEAT_HEIGHT` = 0.48 m, thighs point forward, shins down, feet flat, slight spine lean and a small foot tap), `point` (right arm points at the diagram), `present` (both palms open).
  - **Modes:** `still` (never waves on its own), `wave` (keeps waving), `talk` (nods), `greet` (periodic wave).
  - **Behaviour rules from the owner:**
    - While coding (`type`/`sit`) the avatar is focused: eyes on the laptop, **no mouse-following**, no chatter, and both hands typing.
    - He says "hi" **only on click**. When waving he **stops typing and looks straight at the viewer**, waves with the right hand while the left stays on the keyboard, then returns to coding after about 3.4 s.
    - The head never tilts sideways, and mouse-follow is subtle (yaw 0.35, pitch 0.15) when not coding.
  - **Wave geometry** (anatomically correct; earlier versions looked "broken"): the upper arm points about 45° out, down and forward `(0.6, -0.5, 0.55)`, the forearm points up `(0.18+sway, 1, 0.28)`, and the swing amplitude is small (0.2). The swing reads as shoulder rotation, because an elbow never bends sideways.
  - The avatar starts in its target pose, so there is no stand-to-sit animation on first load.
- **Workstation.tsx:** `seated` gives a 0.74 m desk and an **office chair** (seat, backrest with theme stripe, armrests, gas lift, 5-star base with casters). The laptop's back faces the camera. The external monitor with `CodeScreen` is on the avatar's **left** (viewer's right), so it never hides the waving right hand. The hero camera is at `[-0.55, 1.45, 3.1]` looking at `[0.1, 0.9, 0.25]`.
- **Backdrop:** a **static** soft theme-coloured glow. The owner disliked the spinning rings behind him, so they were removed.

## 7. SEO and deployment

- Full `metadata` (title template, description, keywords, canonical, Open Graph profile, Twitter card, robots, optional `GOOGLE_SITE_VERIFICATION`), JSON-LD with `knowsAbout` (all skills), awards, `sameAs` socials and his photo, plus sitemap, robots, manifest, icons and a generated OG image with his real photo.
- The live domain is **`https://lokendra.work`** (`NEXT_PUBLIC_SITE_URL`, also the default in code).
- Deploy targets: Vercel, or Google Cloud Run through the included `Dockerfile` (standalone output, port 8080). The README has Search Console steps.

## 8. Contact form (important history)

- `POST /api/contact` validates input (name ≥ 2 characters, email regex, message ≥ 10 characters) and has a honeypot field (`company_website`) and a per-IP in-memory rate limit (5 per 10 min). It then tries the channels **in order**:
  1. **SMTP** (Gmail App Password: `SMTP_USER`, `SMTP_PASS`). This also sends the visitor a branded "Thanks" auto-reply.
  2. **Web3Forms** (`WEB3FORMS_ACCESS_KEY`).
  3. **FormSubmit.co**, which needs zero config, but **the first submission sends a one-time "Activate Form" email** to `CONTACT_TO_EMAIL`, default `lokendraitaura@gmail.com`. Nothing is delivered until that link is clicked.
- **Client fallback:** if the API returns 5xx, the browser posts directly to FormSubmit's AJAX endpoint (CORS-enabled). 4xx validation errors are shown as-is.
- **Network bug fixed:** on the owner's network Node 22's "happy eyeballs" gives each address only 250 ms, so outbound fetches failed with `ETIMEDOUT`. `route.ts` calls `net.setDefaultAutoSelectFamily(false)` and `dns.setDefaultResultOrder("ipv4first")`, and every outbound call has a 15 s timeout.
- An earlier bug where the UI showed "Message sent!" without sending anything (a mailto fallback) was **removed**. Never fake success.
- **Current status:** the owner has **no `.env.local`**, so delivery relies on FormSubmit. **FormSubmit still reported "This form needs Activation"** at the last test. He must click the activation email in `lokendraitaura@gmail.com` (check Spam), or set up `SMTP_PASS`.

## 9. Performance decisions

- Removed: the custom cursor (the owner wants the **normal OS cursor**; the custom one also hid behind panels), all `backdrop-filter` blurs except the lightbox, mobile menu and Theme Studio scrim, blur filters in reveal animations, the full-screen noise overlay, aurora `blur-3xl` layers and 70 → 28 twinkling stars.
- Canvases render only while on screen (`frameloop` toggled by IntersectionObserver). A `LoopKick` component calls `invalidate()` because R3F 9 does not restart the loop when `frameloop` flips from never to always.
- `dpr` is capped at 1.25, contact shadows/shadow maps were removed, the preloader runs 0.9 s once per session, Lenis duration is 0.85, the GoChatPilot iframe mounts only when near the viewport, and the contact section has no 3D.
- Measured locally: page `load` about 0.75 s; JS about 2 MB uncompressed (mostly three.js, dynamically imported).

## 10. Known gotchas (already solved; don't regress)

1. **three `AnimationMixer` only writes a bone when its sampled value changes.** Additive procedural rotations would accumulate and the head would slowly spin. `RealAvatar` keeps a `clean` map: restore the clean pose, then `mixer.update`, snapshot, then apply the procedural layer.
2. **drei `<Html>`** lost its content after parent re-renders in this stack, so all overlays (speech bubble, cards, chips) are **plain DOM layered over the canvas**.
3. **Soft-edge masks** must go on the canvas layer only (`SceneCanvas canvasClassName`), not on the wrapper, or they clip the speech bubble and overlays.
4. **Hydration:** inline style numbers must be identical on server and client (rounded values plus `suppressHydrationWarning` on the skill sphere).
5. **Mobile overflow:** wide decorative glows are clipped with `overflow-x: clip` on html, body and some sections; there is no horizontal scroll at 390 px.
6. **SearchShowcase CLS** (see §4).
7. **`framer-motion` cannot animate `color-mix()` strings**; animate opacity on a child instead.
8. The **navbar does not hide on scroll** and is opaque. This is the owner's explicit preference.

## 11. Owner preferences (collected feedback)

- He wants the **real headshot** in the navbar logo, the Google-search knowledge panel, the OG/share image and JSON-LD. He does **not** want his raw photo as the main hero visual; the hero uses the 3D avatar.
- No cartoon versions of him. The avatar should look realistic and **professional**: seated coding, explaining architecture, presenting, shipping. It should appear in only two places (hero and "A day in my life"), not everywhere.
- No necktie on the avatar. The avatar must look upright, not "tircha" (tilted).
- Order of the day scenes: **Architect before Coding**.
- Default **dark** mode, with light mode and a custom theme available.
- Professional typography (Plus Jakarta Sans + Sora), calm uppercase labels (tracking about 0.16em, not mono-wide).

## 12. Open items / next steps

1. **Contact email delivery:** click the FormSubmit activation email, or add a Gmail App Password as `SMTP_PASS` in `.env.local` and in the hosting provider's environment.
2. **Set the real domain** in `NEXT_PUBLIC_SITE_URL`, deploy, verify in Google Search Console and submit `sitemap.xml`.
3. Optional: re-export the Avaturn avatar **with ARKit blendshapes** to get blinking and lip-sync, which the code already supports. Choose an outfit without a tie; the current tie removal is a texture repaint.
4. Optional: realistic AI-generated scene images can be dropped into `public/scenes/{coding,architecting,meeting,shipping}.webp`; they automatically replace the 3D/illustrated scenes (prompts are in the README).
5. The certificate image shows the directors' names and signatures; confirm with the owner that publishing them is fine.
6. The skill "levels" were estimated from resume wording; the owner should review them in `src/data/skills.ts`.
7. Real-device performance has not been measured (the dev machine has no GPU). Run Google PageSpeed Insights after deploy.

## 13. How to verify changes

```bash
. ~/.nvm/nvm.sh && nvm use 22
npx tsc --noEmit && npx eslint src && npm run build
npm start -- -p 3311   # then open http://localhost:3311
```

During development, an automated Playwright check covered: nav links land on the right sections, resume download, WhatsApp links, skills category switch and search, the AI chat demo, the GoChatPilot iframe, the award lightbox, theme preset + persistence, light/dark toggle + persistence, form success, error and validation states (API mocked), the mobile menu, and no horizontal scroll at 390 px. All 19 checks passed at the end.
