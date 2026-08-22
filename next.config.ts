import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/meal-deals",
  assetPrefix: "/meal-deals",
  images: { unoptimized: true },
};

export default nextConfig;
