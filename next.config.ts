import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io", pathname: "/f/**" },
      { protocol: "https", hostname: "ufs.sh", pathname: "/f/**" },
      { protocol: "https", hostname: "**.ufs.sh", pathname: "/f/**" },
      { protocol: "https", hostname: "uploadthing.com", pathname: "/f/**" },
    ],
  },
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
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
