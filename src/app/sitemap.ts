import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/profile";

const UPDATED = "2026-11-21";
const photos = [
  `${SITE_URL}/images/lokendra-kumar-prajapati.jpg`,
  `${SITE_URL}/images/lokendra-kumar-prajapati-square.jpg`,
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: UPDATED,
      changeFrequency: "weekly",
      priority: 1,
      images: [...photos, `${SITE_URL}/awards/standout-performer.webp`, `${SITE_URL}/awards/pat-on-the-back.webp`],
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: UPDATED,
      changeFrequency: "monthly",
      priority: 0.9,
      images: photos,
    },
    {
      url: `${SITE_URL}/Lokendra_Kumar_Resume.pdf`,
      lastModified: UPDATED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
