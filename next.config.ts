import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Expose API_URL to the browser without the NEXT_PUBLIC_ prefix.
  env: {
    API_URL: process.env.API_URL || "http://localhost:5000/api",
  },
  // Auth admin console is fully client-driven (session in localStorage +
  // usePathname/useRouter). cacheComponents/PPR prerender fails on those hooks.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
