import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Rewrites proxy API requests to the backend.
  // NOTE: WebSocket rewrites using a "ws://" destination are not supported.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/v1/:path*", // Proxy API requests to backend
      },
    ];
  },
};

export default nextConfig;
