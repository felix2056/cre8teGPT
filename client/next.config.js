/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  images: {
    domains: ['ui-avatars.com', 'lh3.googleusercontent.com', 'res.cloudinary.com', 'cre8tegpt.com'],
  },
};

module.exports = nextConfig
