import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Query-string aliases, so links that lose their path still land correctly.
      // /?m=2  ->  /en/b      (the second music link)
      { source: "/", has: [{ type: "query", key: "m", value: "2" }], destination: "/en/b", permanent: false },
      { source: "/", destination: "/en", permanent: false },
    ];
  },
};

export default nextConfig;
