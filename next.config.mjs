/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/imsyp8wq/image/upload/**",
      },
    ],
  },
};

export default nextConfig;
