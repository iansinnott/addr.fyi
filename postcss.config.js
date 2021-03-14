// Use a funciton to gain access to the env at build-time.
// Unclear if this is necessary since you could just use
// process.env.NODE_ENV directly, but this is what some of their
// examples use so I'll go with it for now.
module.exports = (ctx) => {
  const plugins = {
    tailwindcss: {},      // Use the thing
    "postcss-nested": {}, // Allow nesting
  };

  // Optimize for prod
  if (ctx.env === "production") {
    plugins["autoprefixer"] = {};
    plugins["cssnano"] = {};
  }

  return {
    map: false,
    plugins,
  };
};
