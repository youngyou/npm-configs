const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devMode = process.env.NODE_ENV === 'development';
const appDirectory = fs.realpathSync(process.cwd());
const packageJson = require(path.resolve(appDirectory, 'package.json'));

module.exports = (options) => {
  let publicUrl = options.url || '';
  const config = {
    entry: options.entry,
    output: typeof options.output === 'object' ? options.output : {
      path: options.output,
      publicPath: `${publicUrl}/`,
      filename: devMode ? '[name].js' : '[name].[hash:6].js',
    },
    name: packageJson.name,
    mode: devMode ? 'development' : 'production',
    context: appDirectory,
    devtool: devMode ? 'inline-source-map' : 'source-map',
    bail: !devMode,
    target: options.target || 'web',
    resolveLoader: {
      modules: [path.join(__dirname, 'node_modules'), path.join(appDirectory, 'node_modules')],
      plugins: [
        PnpWebpackPlugin.moduleLoader(module),
      ],
    },
    resolve: {
      plugins: [PnpWebpackPlugin],
      extensions: ['.mjs', '.ts', '.tsx', '.js', '.jsx', '.json'],
      alias: {
        'react-dom': devMode ? '@hot-loader/react-dom' : 'react-dom'
      }
    },
    module: {
      strictExportPresence: true,
      rules: [{
        parser: {
          requireEnsure: false
        }
      },
      require('./rules/eslint')(options.loaders),
      require('./rules/babel')(options.loaders),
      ...require('./rules/style')(options.loaders),
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp|bmp)$/,
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/[name].[hash:8].[ext]',
        },
      }, {
        loader: require.resolve('file-loader'),
        // Exclude `js` files to keep "css" loader working as it injects
        // its runtime that would otherwise be processed through "file" loader.
        // Also exclude `html` and `json` extensions so they get processed
        // by webpacks internal loaders.
        exclude: [/\.(js|mjs|jsx|ts|tsx|css|less|scss)$/, /\.html$/, /\.json$/, /\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        options: {
          name: 'static/[name].[hash:8].[ext]',
        },
      },
      ],
    },
    plugins: [
      !devMode && new webpack.ProgressPlugin(),
      devMode && new CaseSensitivePathsPlugin(),
      // If you require a missing module and then `npm install` it, you still have
      // to restart the development server for Webpack to discover it. This plugin
      // makes the discovery automatic so you don't have to restart.
      // See https://github.com/facebook/create-react-app/issues/186
      devMode && new WatchMissingNodeModulesPlugin(path.resolve(appDirectory, 'node_modules')),
      !devMode && new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
      }),
      new ManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: publicUrl,
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // !devMode && new WorkboxWebpackPlugin.GenerateSW({
      //   clientsClaim: true,
      //   exclude: [/\.map$/, /asset-manifest\.json$/],
      //   importWorkboxFrom: 'cdn',
      //   navigateFallback: publicUrl + '/index.html',
      //   navigateFallbackBlacklist: [
      //     // Exclude URLs starting with /_, as they're likely an API call
      //     new RegExp('^/_'),
      //     // Exclude URLs containing a dot, as they're likely a resource in
      //     // public/ and not a SPA route
      //     new RegExp('/[^/]+\\.[^/]+$'),
      //   ],
      // }),
      new webpack.NamedModulesPlugin(),
      // new CleanWebpackPlugin(),
    ].filter(Boolean),
    devServer: {
      hot: true,
      disableHostCheck: true,
      contentBase: [
        // path.join(__dirname, 'static'),
        path.join(appDirectory, 'public'),
      ], // boolean | string | array, static file location
      publicPath: publicUrl,
      progress: true,
      compress: true, // enable gzip compression
      historyApiFallback: true,
      host: '0.0.0.0',
      // open: true,
      clientLogLevel: 'error',
    }
  };
  return config;
};
