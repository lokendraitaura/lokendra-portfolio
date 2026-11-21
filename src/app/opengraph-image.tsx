import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Lokendra Kumar Prajapati – Senior Software Developer & Frontend Architect at Zindagi Technologies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const photo = await readFile(join(process.cwd(), "public/images/lokendra.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #05060f 0%, #1b1446 55%, #062a3a 100%)",
          color: "white",
          fontFamily: "sans-serif",
          padding: 64,
          alignItems: "center",
          gap: 56,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", fontSize: 24, color: "#67e8f9", letterSpacing: 6, textTransform: "uppercase" }}>lokendra.work</div>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 800, marginTop: 16, lineHeight: 1.05 }}>Lokendra Kumar Prajapati</div>
          <div style={{ display: "flex", fontSize: 34, marginTop: 20, color: "#c4b5fd" }}>Senior Software Developer · Frontend Architect · AI Frontend Engineer</div>
          <div style={{ display: "flex", fontSize: 26, marginTop: 28, color: "#a8b0d6" }}>React.js · Next.js · TypeScript · LLM Apps · Design Systems</div>
          <div style={{ display: "flex", gap: 16, marginTop: 40 }}>
            {["6+ years", "5 production projects", "2 awards"].map((t) => (
              <div key={t} style={{ display: "flex", padding: "10px 22px", borderRadius: 999, border: "2px solid rgba(255,255,255,0.2)", fontSize: 24 }}>
                {t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", width: 340, height: 450, borderRadius: 36, overflow: "hidden", border: "4px solid #8b5cf6", boxShadow: "0 30px 80px rgba(139,92,246,0.5)" }}>
          <img src={src} width={340} height={450} style={{ objectFit: "cover" }} alt="" />
        </div>
      </div>
    ),
    size
  );
}
