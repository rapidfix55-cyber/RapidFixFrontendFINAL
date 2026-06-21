import type { NextConfig } from "next";

const SERVICE_PATTERN =
  "bike-service|car-service|mechanic-near-me|car-ac-repair|battery-replacement|tyre-wheel|engine-repair|denting-painting|ev-service";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        // :city matches any lowercase slug (delhi, greater-noida, mumbai, bangalore, etc.)
        source: `/:service(${SERVICE_PATTERN})-in-:city([a-z][a-z0-9-]*)`,
        destination: "/svc/:service/:city",
      },
    ];
  },
};

export default nextConfig;
