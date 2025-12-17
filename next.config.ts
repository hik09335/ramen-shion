import type { NextConfig } from "next";
import { isDevelopment } from "./libs/utils";
import { URL } from "url";

const nextConfig: NextConfig = {
  /* config options here */
  // output: 'export',
  // basePath: '/2921/ramen-shion',
  // assetPrefix: '/2921/ramen-shion',
  // trailingSlash: true,
  images: {
    // unoptimized: true,
    remotePatterns: [
      new URL('https://images.microcms-assets.io/**'),
    ]
  }
};

export default nextConfig;
