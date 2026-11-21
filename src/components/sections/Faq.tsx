import { ChevronDown } from "lucide-react";
import { FAQ } from "@/data/seo";

/**
 * Visible Q&A (also emitted as FAQPage JSON-LD). Plain <details> keeps it fully in the
 * server HTML, keyboard accessible and zero-JS.
 */
export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-pad relative">
      <div className="container-x">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-center text-[12px] font-semibold uppercase tracking-[0.16em] text-cyan-300">FAQ</p>
          <h2 id="faq-title" className="text-center font-display text-[2rem] font-semibold leading-tight text-white sm:text-5xl">
            About Lokendra Kumar Prajapati
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted">
            Quick answers about my work as a Senior Software Developer and Frontend Architect, my skills and how to hire me.{" "}
            <a href="/about" className="text-cyan-300 underline underline-offset-4">Read my full profile →</a>
          </p>
          <div className="mt-10 space-y-3">
            {FAQ.map((f, i) => (
              <details
                key={f.q}
                open={i === 0}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 transition-colors open:bg-white/[0.05] sm:px-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-semibold text-white sm:text-lg [&::-webkit-details-marker]:hidden">
                  <h3>{f.q}</h3>
                  <ChevronDown className="h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
