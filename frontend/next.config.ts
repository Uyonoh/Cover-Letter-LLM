import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  nextConfig,
  images: {
    remotePatterns: [new URL('https://img.icons8.com/**')],
  },
}

// export default nextConfig;
