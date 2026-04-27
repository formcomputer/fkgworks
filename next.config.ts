import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This is required to bundle the server-side logic into your app
  output: 'standalone', 
  
  // If you are using images, you might need to adjust this depending on your hosting
  images: {
    unoptimized: true, 
  },
};

export default nextConfig;