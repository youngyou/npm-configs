const asyncRequire = require('../utils/check-modules');

module.exports = (vendor = []) => () => {
  return Promise.all([
    asyncRequire('autodll-webpack-plugin'),
  ]).then(([AutoDllPlugin]) => ({
    plugins: [
      new AutoDllPlugin({
        filename: '[name].[hash].dll.js',
        inject: true,
        entry: {
          vendor: vendor || ['react', 'react-dom']
        },
      })
    ]
  }));
};
