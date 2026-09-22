import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Clearledger — Personal Finance & Expense Tracker",
    short_name: "Clearledger",
    description:
      "Track everyday spending, understand your habits, and make financial decisions with confidence.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f9fc",
    theme_color: "#2452eb",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
