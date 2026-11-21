/**
 * Drop-in media slots. Put the files in /public and they're picked up automatically;
 * if a file is missing the site falls back to a built-in animation.
 */
export const media = {
  /** Realistic rigged 3D avatar of Lokendra (GLB from Avaturn / MetaPerson / Mixamo). */
  avatar: "/models/avatar.glb",
  /** Optional realistic images for the "A day in my life" section (16:11 ratio works best). */
  scenes: {
    code: "/scenes/coding.webp",
    architect: "/scenes/architecting.webp",
    meet: "/scenes/meeting.webp",
    ship: "/scenes/shipping.webp",
  },
};
