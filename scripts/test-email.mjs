// Sends one test message using the SMTP settings in .env.local:  npm run email:test
import { readFileSync } from "node:fs";
import net from "node:net";
import dns from "node:dns";
import nodemailer from "nodemailer";

net.setDefaultAutoSelectFamily(false);
dns.setDefaultResultOrder("ipv4first");

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => /^[A-Z_]+=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()])
);
const user = env.SMTP_USER;
const pass = (env.SMTP_PASS || "").replace(/\s+/g, "");
const to = env.CONTACT_TO_EMAIL || user;
if (!user || !pass) {
  console.error("✗ SMTP_PASS is empty in .env.local. Create an App Password at https://myaccount.google.com/apppasswords and paste it there.");
  process.exit(1);
}
const port = Number(env.SMTP_PORT || 465);
const t = nodemailer.createTransport({ host: env.SMTP_HOST || "smtp.gmail.com", port, secure: port === 465, auth: { user, pass }, connectionTimeout: 15000 });
try {
  await t.verify();
  await t.sendMail({
    from: `"Portfolio · Test Client" <${user}>`,
    to,
    replyTo: "test-client@example.com",
    subject: "💼 Full-time opportunity: Test Client",
    text: "Name: Test Client\nEmail: test-client@example.com\nPhone: +91 90000 00000\nSubject: Full-time opportunity\n\nThis is a test message from your portfolio contact form. If you can read this, inbox delivery works. ✅",
  });
  console.log(`✓ Sent! Check ${to} (a test message from your own Gmail).`);
} catch (e) {
  const msg = String(e?.message || e);
  if (/Invalid login|BadCredentials|535/i.test(msg)) console.error("✗ Gmail rejected the login. Use an App Password (not your normal password) and make sure 2-Step Verification is on.");
  else console.error("✗ Failed:", msg);
  process.exit(1);
}
