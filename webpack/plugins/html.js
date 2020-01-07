const asyncRequire = require('../utils/check-modules');
const devMode = process.env.NODE_ENV === 'development';

module.exports = (options = {}) => () => {
  return Promise.all([
    asyncRequire('html-webpack-plugin'),
  ]).then(([HtmlWebpackPlugin]) => ({
    plugins: [
      new HtmlWebpackPlugin(Object.assign({}, {
        inject: false,
        minify: !devMode ?
          undefined : {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          },
        ...options
      })),
    ],
  }));
};
