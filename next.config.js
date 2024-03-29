/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
  reactStrictMode: false,
  output: "export",
  // experimental: {
  //   appDir: true,
  // },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },

  async redirects() {
    return [
      {
        source: "/",
        destination: "/main",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
