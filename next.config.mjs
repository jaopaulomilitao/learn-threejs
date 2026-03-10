/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**",
      },
    ],
  },
  eslint: {
    // ignora erros de eslint durante o build na vercel
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ignora erros de tipagem durante o build na vercel
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
