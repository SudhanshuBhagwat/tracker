const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

module.exports = withPWA({
  pwa: {
    dest: "public",
    runtimeCaching,
    buildExcludes: [
      /middleware-build-manifest.json$/,
      /middleware-build-manifest.js$/,
    ],
  },
  images: {
    domains: ["lh3.googleusercontent.com", "avatars.dicebear.com"],
  },
});
