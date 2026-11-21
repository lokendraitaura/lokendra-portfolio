import dns from "node:dns";
import net from "node:net";
import nodemailer from "nodemailer";
import { profile, SITE_URL, whatsappLink } from "@/data/profile";

/**
 * POST /api/contact
 * Delivers the portfolio contact form to Lokendra's inbox.
 *
 * Delivery channels, tried in order (see .env.example):
 *   1. SMTP_USER + SMTP_PASS (Gmail App Password)  -> instant, plus auto-reply to the visitor
 *   2. WEB3FORMS_ACCESS_KEY                          -> free hosted delivery
 *   3. FormSubmit.co                                 -> zero config, needs a one-time activation click
 * CONTACT_TO_EMAIL overrides the inbox (default: the email in src/data/profile.ts).
 */

// Node 22's "happy eyeballs" gives each address only 250 ms to connect; on slower networks every
// attempt times out (ETIMEDOUT) and outbound mail calls fail. Connect normally, IPv4 first.
net.setDefaultAutoSelectFamily(false);
dns.setDefaultResultOrder("ipv4first");

type Payload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  subject?: unknown;
  message?: unknown;
  company_website?: unknown; // honeypot
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Best-effort in-memory rate limit (per server instance): 5 messages / 10 min / IP.
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const list = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > 5;
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const json = (body: object, status = 200) => Response.json(body, { status });

export async function POST(request: Request) {
  let data: Payload;
  try {
    data = (await request.json()) as Payload;
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  // Bots fill the hidden field: pretend success, send nothing.
  if (str(data.company_website, 200)) return json({ ok: true });

  const name = str(data.name, 80);
  const email = str(data.email, 120);
  const phone = str(data.phone, 20);
  const subject = str(data.subject, 120) || "New message";
  const message = str(data.message, 4000);

  if (name.length < 2) return json({ error: "Please enter your name." }, 400);
  if (!EMAIL_RE.test(email)) return json({ error: "Please enter a valid email address." }, 400);
  if (message.length < 10) return json({ error: "Your message is a little short. Please add some details." }, 400);

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return json({ error: "Too many messages. Please try again later or use WhatsApp." }, 429);

  const to = process.env.CONTACT_TO_EMAIL || profile.email;
  const origin = request.headers.get("origin") || SITE_URL;
  const msg = { name, email, phone, subject, message, to, origin };

  // Try each configured channel in order until one delivers.
  const errors: string[] = [];
  for (const channel of [sendViaSmtp, sendViaWeb3Forms, sendViaFormSubmit]) {
    try {
      const result = await channel(msg);
      if (result === "skipped") continue;
      return json({ ok: true, via: result });
    } catch (err) {
      const m = err instanceof Error ? err.message : String(err);
      errors.push(m);
      console.error("[contact]", m);
      if (m.startsWith("ACTIVATION:")) {
        return json({ error: "Couldn't send right now. Please tap \"Send on WhatsApp\" instead.", code: "activation" }, 503);
      }
    }
  }
  return json({ error: "Couldn't send right now. Please try WhatsApp or email me directly.", detail: process.env.NODE_ENV === "development" ? errors : undefined }, 502);
}

type Msg = { name: string; email: string; phone: string; subject: string; message: string; to: string; origin: string };

/** 1. Gmail / any SMTP (best: instant, plus an auto-reply to the visitor). Needs SMTP_USER + SMTP_PASS. */
async function sendViaSmtp(m: Msg) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, "");
  if (!user || !pass) return "skipped" as const;
  const port = Number(process.env.SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });
  const cleanName = m.name.replace(/["\r\n]/g, "");
  await transporter.sendMail({
    from: `"Portfolio · ${cleanName}" <${user}>`,
    to: m.to,
    replyTo: `"${cleanName}" <${m.email}>`,
    subject: `💼 ${m.subject}: ${m.name}`,
    text: plainText(m),
    html: ownerHtml(m),
  });
  // Friendly confirmation to the visitor (best effort).
  transporter
    .sendMail({
      from: `"${profile.name}" <${user}>`,
      to: `"${cleanName}" <${m.email}>`,
      replyTo: m.to,
      subject: `Thanks for reaching out, ${cleanName.split(" ")[0]}! 👋`,
      html: visitorHtml(m),
      text: `Hi ${cleanName},\n\nThanks for your message. I've received it and will get back to you soon.\n\nYou can also reach me on WhatsApp: ${whatsappLink()}\n\n— ${profile.name}`,
    })
    .catch((e) => console.error("[contact] auto-reply failed:", e));
  return "smtp";
}

/** 2. Web3Forms (free; get a key at web3forms.com with your email). Needs WEB3FORMS_ACCESS_KEY. */
async function sendViaWeb3Forms(m: Msg) {
  const key = process.env.WEB3FORMS_ACCESS_KEY || process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
  if (!key) return "skipped" as const;
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    signal: AbortSignal.timeout(15000),
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: key,
      subject: `💼 ${m.subject}: ${m.name}`,
      from_name: "Portfolio contact form",
      replyto: m.email,
      name: m.name,
      email: m.email,
      phone: m.phone || "Not provided",
      message: m.message,
    }),
  });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
  if (!res.ok || !data.success) throw new Error(`web3forms: ${data.message || res.status}`);
  return "web3forms";
}

/**
 * 3. Zero-config fallback: FormSubmit.co. The very first message triggers a one-time
 * "Activate form" email to the inbox; after clicking it, every message is delivered.
 */
async function sendViaFormSubmit(m: Msg) {
  // Once a Web3Forms key exists, never touch FormSubmit (it keeps sending "Activate form" emails).
  if (process.env.CONTACT_DISABLE_FORMSUBMIT === "1" || process.env.WEB3FORMS_ACCESS_KEY || process.env.NEXT_PUBLIC_WEB3FORMS_KEY) return "skipped" as const;
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(m.to)}`, {
    method: "POST",
    signal: AbortSignal.timeout(15000),
    headers: { "Content-Type": "application/json", Accept: "application/json", Origin: m.origin, Referer: `${m.origin}/` },
    body: JSON.stringify({
      _subject: `💼 ${m.subject}: ${m.name}`,
      _replyto: m.email,
      _template: "table",
      _captcha: "false",
      Name: m.name,
      Email: m.email,
      Phone: m.phone || "Not provided",
      Subject: m.subject,
      Message: m.message,
    }),
  });
  const data = (await res.json().catch(() => ({}))) as { success?: string | boolean; message?: string };
  const ok = data.success === true || data.success === "true";
  if (!ok) {
    const text = data.message || `status ${res.status}`;
    if (/activat/i.test(text)) throw new Error(`ACTIVATION: ${text}`);
    throw new Error(`formsubmit: ${text}`);
  }
  return "formsubmit";
}

function plainText(m: Msg) {
  return `New portfolio message\n\nName: ${m.name}\nEmail: ${m.email}\nPhone: ${m.phone || "Not provided"}\nSubject: ${m.subject}\n\n${m.message}`;
}

function ownerHtml(m: Msg) {
  const safe = {
    name: escapeHtml(m.name),
    email: escapeHtml(m.email),
    phone: escapeHtml(m.phone || "Not provided"),
    subject: escapeHtml(m.subject),
    message: escapeHtml(m.message).replace(/\n/g, "<br/>"),
  };
  const waLink = m.phone ? `https://wa.me/${m.phone.replace(/[^\d]/g, "")}` : "";
  return `
  <div style="font-family:Inter,Segoe UI,Arial,sans-serif;background:#0b0d1d;padding:32px;color:#e7e9f7">
    <div style="max-width:600px;margin:auto;background:#12152b;border-radius:16px;overflow:hidden;border:1px solid #2a2f5a">
      <div style="padding:24px 28px;background:linear-gradient(120deg,#8b5cf6,#22d3ee)">
        <p style="margin:0;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#fff;opacity:.85">Portfolio contact</p>
        <h1 style="margin:6px 0 0;font-size:22px;color:#fff">${safe.subject}</h1>
      </div>
      <div style="padding:28px">
        <table style="width:100%;font-size:14px;border-collapse:collapse">
          <tr><td style="padding:6px 0;color:#9aa3c7;width:90px">Name</td><td style="padding:6px 0;color:#fff"><b>${safe.name}</b></td></tr>
          <tr><td style="padding:6px 0;color:#9aa3c7">Email</td><td style="padding:6px 0"><a style="color:#22d3ee" href="mailto:${safe.email}">${safe.email}</a></td></tr>
          <tr><td style="padding:6px 0;color:#9aa3c7">Phone</td><td style="padding:6px 0;color:#fff">${safe.phone}${waLink ? ` · <a style="color:#25D366" href="${waLink}">WhatsApp</a>` : ""}</td></tr>
        </table>
        <div style="margin-top:20px;padding:18px;border-radius:12px;background:#0b0d1d;border:1px solid #2a2f5a;line-height:1.6;font-size:15px;color:#e7e9f7">${safe.message}</div>
        <p style="margin-top:24px;font-size:12px;color:#9aa3c7">Hit "Reply" to answer ${safe.name} directly.</p>
      </div>
    </div>
  </div>`;
}

function visitorHtml(m: Msg) {
  const first = escapeHtml(m.name.split(" ")[0]);
  return `
  <div style="font-family:Inter,Segoe UI,Arial,sans-serif;background:#f5f3ff;padding:32px">
    <div style="max-width:560px;margin:auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e9e5ff">
      <div style="padding:24px 28px;background:linear-gradient(120deg,#8b5cf6,#22d3ee);color:#fff">
        <h1 style="margin:0;font-size:22px">Thanks, ${first}! 🙌</h1>
        <p style="margin:6px 0 0;opacity:.9">Your message reached my inbox.</p>
      </div>
      <div style="padding:24px 28px;color:#1f2340;line-height:1.6;font-size:15px">
        <p>I'll read it and get back to you as soon as possible, usually within a few hours (IST).</p>
        <p>Need a faster reply? <a href="${whatsappLink()}" style="color:#16a34a;font-weight:600">Message me on WhatsApp</a>.</p>
        <p style="margin-top:24px">— ${escapeHtml(profile.name)}<br/><span style="color:#6b7280">${escapeHtml(profile.title)}</span></p>
      </div>
    </div>
  </div>`;
}
