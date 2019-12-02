const devMode = process.env.NODE_ENV === 'development';
const fs = require('fs');
const path = require('path');
const appDirectory = fs.realpathSync(process.cwd());

module.paths.push(path.join(appDirectory, 'node_modules'));
 
module.exports = (loadersOption) => {
  return {
    test: loadersOption.typescript ? /\.(tsx|ts|mjs|jsx|js|)$/ : /\.(mjs|jsx|js|)$/,
    exclude: [/node_modules/, /@babel(?:\/|\\{1,2})runtime/],
    loader: 'babel-loader',
    options: {
      babelrc: true,
      configFile: false,
      cacheDirectory: true,
      cacheCompression: !devMode,
      compact: !devMode,
      ...loadersOption.babel,
      ...loadersOption.typescript
    },
  };
};