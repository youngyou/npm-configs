const asyncRequire = require('../utils/check-modules');
const { DefinePlugin } = require('webpack');

module.exports = (envs = {}) => options => {
  return Promise.all([
    asyncRequire('interpolate-html-plugin'),
    asyncRequire('html-webpack-plugin'),
  ]).then(([InterpolateHtmlPlugin, HtmlWebpackPlugin]) => {
    const raw = Object.keys(process.env).reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        // Useful for determining whether we’re running in production mode.
        // Most importantly, it switches React into the correct mode.
        NODE_ENV: process.env.NODE_ENV || 'production',
        // Useful for resolving the correct path to static assets in `public`.
        // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
        // This should only be used as an escape hatch. Normally you would put
        // images into the `src` and `import` them in code to get their paths.
        PUBLIC_URL: options.url || '',
        ...envs,
      }
    );
    const stringified = {
      'process.env': Object.keys(raw).reduce((env, key) => {
        env[key] = JSON.stringify(raw[key]);
        return env;
      }, {}),
    };
    return {
      plugins: [new InterpolateHtmlPlugin(HtmlWebpackPlugin, raw), new DefinePlugin(stringified)],
    };
  });
};
