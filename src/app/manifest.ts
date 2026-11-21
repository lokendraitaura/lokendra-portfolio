import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lokendra Kumar Prajapati – Senior Software Developer",
    short_name: "Lokendra",
    description: "Portfolio of Lokendra Kumar Prajapati: Senior Software Developer, Frontend Architect & AI Frontend Engineer at Zindagi Technologies.",
    start_url: "/",
    display: "standalone",
    background_color: "#05060f",
    theme_color: "#05060f",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
