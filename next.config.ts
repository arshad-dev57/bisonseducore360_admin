import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
