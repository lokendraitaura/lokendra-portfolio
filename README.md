# Lokendra Kumar: Portfolio

A fully animated, 3D, SEO-optimised personal portfolio built with **Next.js 16 (App Router) + TypeScript**, Tailwind CSS v4, Three.js (React Three Fiber), Framer Motion and Lenis smooth scrolling.

## What's inside

| Section | Highlights |
| --- | --- |
| Global experience | Immediate content, normal cursor, scroll progress, smooth scrolling, theme-aware ambient lighting and reduced-motion preferences |
| Hero | **Your realistic 3D avatar** seated in an illuminated developer studio, live laptop and monitor, floating 3D technology objects, unrestricted horizontal orbit, zoom, pan, fullscreen, greeting and animation pause. Mobile places the world below your name |
| Google search showcase | Animated browser that types a Google search and reveals results + a knowledge panel (portfolio, LinkedIn, GitHub, GoChatPilot) |
| About | Story, animated counters, and **"A day in my life"** with the realistic avatar: architecting, coding, collaborating and shipping |
| Skills | Interactive **3D skill sphere** (drag to rotate) + explorer with **193 skills in 16 categories, each with its own description and level**, plus search |
| AI Engineering | Animated LLM pipeline + interactive streaming chat demo ("Ask about Lokendra") |
| Experience | Scroll-drawn timeline with every responsibility |
| Projects | **GoChatPilot running live in an iframe** inside laptop/phone mockups + animated project cards |
| Awards & Education | Original award images, full-screen viewer and education |
| Kinetic text | Giant text bands that speed up and flip direction with scroll velocity |
| Contact | Email form (delivery provider setup required), "Send on WhatsApp" and a site-wide WhatsApp shortcut |

Your real headshot is used in the navbar logo, the Google-search knowledge panel, the share (OG) image and Google structured data. The original award images live in `public/awards/` with a full-screen viewer.

SEO: full metadata, Open Graph/Twitter cards, auto-generated OG image, JSON-LD (`Person`, `WebSite`, `ProfilePage`), `sitemap.xml`, `robots.txt`, web manifest, icons, semantic HTML and Google Search Console verification support.

Studio-specific presentation styles live in `src/app/studio.css`; shared theme tokens remain in `src/app/globals.css`. Projects follow the hero and technology strip so visitors can quickly see shipped work.

All content lives in `src/data/` (`profile.ts`, `skills.ts`, `career.ts`). Edit those files to update the site.


## Make it *you*: realistic 3D avatar + real scene images

The site has two drop-in slots (see `src/data/media.ts`). They are detected at build time, so if a file is missing the site falls back to the built-in 3D workstation / illustrations with no errors.

### 1. Realistic animated 3D avatar → `public/models/avatar.glb`

✅ Already added: your Avaturn avatar (optimised from 4.1 MB to 1.3 MB with meshopt + WebP textures). It appears in the hero (seated coding, with a greeting on request) and in "A day in my life" (typing, pointing at an architecture diagram, presenting in a meeting, celebrating a deploy). To replace it later:

1. Open **Avaturn** (https://avaturn.me) or **MetaPerson Creator** (https://avatarsdk.com/metaperson-creator/).
2. Take the guided selfies (front + left + right, good light, neutral face).
3. Tune the look: short black swept-up hair, full trimmed beard, navy blazer + white shirt if available.
4. Export as **GLB** (enable "ARKit blendshapes" / face morphs if offered; that powers blinking, smiling and lip movement).
5. Optional (smaller file, faster load): `npx @gltf-transform/cli optimize source-avatar.glb avatar.glb --simplify false --compress meshopt --texture-compress webp`
6. Save it as `public/models/avatar.glb`, then restart `npm run dev` (or rebuild). Done.

The hero avatar stays focused on the laptop, with both hands typing. **Say hello** makes it pause typing, face the viewer and wave, then return to work. Drag to orbit freely through 360 degrees, scroll to zoom, and right-drag to pan. On touch screens, use one finger to orbit and two fingers to pinch or pan. Camera movement never snaps back to a preset. Fullscreen offers a larger view; Escape closes it. Keyboard users can focus the scene and use arrow keys, plus/minus and Home. Reset restores the opening view. The pause control freezes the avatar and code while camera exploration stays available; reduced-motion visitors start paused. Rendering pauses when the scene leaves the viewport. A fallback message keeps the page usable if WebGL or the asset fails.

The supplied model has no face blendshapes, so it does not blink or lip-sync. The animation engine supports those features if a future model includes them. The existing optimized model and its rig are preserved. The About scene also supports direct orbit, zoom and pan.

No animation files are needed. It works with any Mixamo-style humanoid rig. Check the avatar service's licence terms for commercial use.

### 2. Realistic "A day in my life" images → `public/scenes/*.webp`

Generate them from your own photo with an image model (for example Gemini or ChatGPT image generation), export at about 1600×1100, and save as:

| File | Prompt idea |
| --- | --- |
| `coding.webp` | "Photorealistic image of this man (same face, beard and hairstyle) sitting at a modern desk at night, typing on a laptop with code on two monitors, purple and cyan neon accent light, shallow depth of field, cinematic" |
| `architecting.webp` | "Same man standing at a large glass whiteboard drawing a software architecture diagram with boxes and arrows, modern office, purple/cyan lighting, photorealistic" |
| `meeting.webp` | "Same man leading a friendly team meeting in a modern conference room, laptop open, colleagues around the table, natural daylight, photorealistic" |
| `shipping.webp` | "Same man celebrating with a smile in front of a laptop showing a successful deployment dashboard, confetti-free, modern startup office, photorealistic" |

Each image gets a slow Ken Burns zoom and colour grading; missing ones keep the 3D avatar (or the illustration when no avatar is supplied).

---

## 1. Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev                  # http://localhost:3000
```

## Theme studio

Visitors (and you) can open the palette button on the left edge to pick one of 8 presets (Aurora, Deep Ocean, Emerald, Sunset, Cyber Neon, Crimson, Royal Gold, Graphite), set custom primary / secondary / accent / background colours, or hit "Surprise me". Every violet/cyan/pink Tailwind utility, gradient, glow and the 3D lighting follow the theme. The choice is saved per browser and applied before first paint (no flash). Presets live in `src/data/themes.ts`.

## 2. Make the contact form deliver to your Gmail

The form tries three channels in order: **Gmail SMTP → Web3Forms → FormSubmit**. With nothing configured it uses FormSubmit: the first message sends an **"Activate form"** email to `CONTACT_TO_EMAIL`. Click it once and every later message lands in your inbox. For instant delivery plus an automatic thank-you reply to the visitor, set up Gmail SMTP:

1. Turn on **2-Step Verification** on your Google account.
2. Open https://myaccount.google.com/apppasswords and create an app password (name it "Portfolio").
3. Put it in `.env.local` (and later in your hosting provider's environment variables):

```env
SMTP_USER=lokendraitaura@gmail.com
SMTP_PASS=abcdefghijklmnop      # the 16-char app password, no spaces
CONTACT_TO_EMAIL=lokendraitaura@gmail.com
```

Every message arrives in your inbox; pressing **Reply** answers the visitor directly. The WhatsApp buttons open `wa.me/919696852187` with a pre-filled message, so no setup is needed for those.

## 3. Deploy

### Option A: Vercel (easiest, free)
1. Push this folder to a GitHub repo.
2. Import it on https://vercel.com/new.
3. Add the environment variables from `.env.example` (`NEXT_PUBLIC_SITE_URL`, `SMTP_*`, `CONTACT_TO_EMAIL`, `GOOGLE_SITE_VERIFICATION`).
4. Deploy, then add your custom domain under *Settings → Domains*.

### Option B: Google Cloud Run
```bash
gcloud run deploy lokendra-portfolio \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_SITE_URL=https://lokendra.work,SMTP_USER=...,SMTP_PASS=...,CONTACT_TO_EMAIL=...
```
The included `Dockerfile` builds a small standalone Next.js server on port 8080. Because `NEXT_PUBLIC_SITE_URL` is baked in at build time, also pass it as a build arg if you build the image yourself.

## 4. Get found on Google (lokendra.work)

On-page SEO is done: title/description with every name variant (Lokendra, Lokendra Kumar, Lokendra Prajapati, Lokendra Kumar Prajapati), role (Senior Software Developer / Frontend Architect), company (Zindagi Technologies) and skills; a visible FAQ; rich JSON-LD (Person, Organization, WebSite, ProfilePage, FAQPage, projects, experience, GoChatPilot); sitemap, robots, canonical, Open Graph image, `llms.txt` for AI search. All SEO copy lives in `src/data/seo.ts`.

After deploying to **https://lokendra.work**:
1. **Google Search Console** → Add property → *Domain* `lokendra.work` (verify with the DNS TXT record at your domain registrar), or *URL prefix* with the HTML tag in `GOOGLE_SITE_VERIFICATION`.
2. Search Console → **Sitemaps** → submit `https://lokendra.work/sitemap.xml`.
3. **URL Inspection** → `https://lokendra.work` → *Request indexing*.
4. Check structured data: https://search.google.com/test/rich-results with `https://lokendra.work`.
5. **Backlinks (the biggest ranking factor for your name):**
   - LinkedIn → Edit intro → *Website* = `https://lokendra.work`; also mention it in your About section and Featured.
   - GitHub → profile *Website* = `https://lokendra.work`, plus a profile README linking to it.
   - GoChatPilot footer: "Built by Lokendra Kumar Prajapati" linking to `https://lokendra.work`.
   - Resume PDF, email signature, WhatsApp business profile, Naukri/Indeed profiles, any blog posts (dev.to / Medium / Hashnode) → link to the site.
6. Optionally add the site to **Bing Webmaster Tools** (it can import from Google Search Console).

Name searches usually start showing within days to a few weeks after indexing. Broad terms like "senior software developer" alone are extremely competitive; you rank for them combined with your name, company or location.

## Scripts
- `npm run dev`: development server
- `npm run build`: production build
- `npm start`: serve the production build
- `npm run lint`: ESLint
