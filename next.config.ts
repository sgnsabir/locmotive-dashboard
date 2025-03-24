// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Use rewrites so that API calls from the frontend use a relative URL.
  // In production the API_BASE_URL should be set to a relative URL (e.g. "/api/v1")
  // and Next.js will proxy these calls to the backend at http://localhost:8080/api/v1.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/v1/:path*", // Proxy to backend WebFlux R2DBC service
      },
    ];
  },
};

export default nextConfig;
