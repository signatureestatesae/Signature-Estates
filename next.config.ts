import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    deviceSizes: [640, 828, 1200, 1920, 3840],
    qualities: [75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // TODO: replace with the new Supabase project's storage hostname
      // (Project Settings > API > Project URL) once it's created.
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
