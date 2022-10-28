const runtimeCaching = require("next-pwa/cache");

const withPWA = require("next-pwa")({
  dest: "public",
  runtimeCaching,
  buildExcludes: [/middleware-*-manifest.js*$/],
});

module.exports = withPWA({
  images: {
    domains: ["lh3.googleusercontent.com", "avatars.dicebear.com"],
  },
});
