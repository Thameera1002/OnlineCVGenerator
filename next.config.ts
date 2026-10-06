import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Browser-only app: everything is exported as static files (no server needed).
  output: "export",
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
