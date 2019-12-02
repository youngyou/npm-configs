
const devMode = process.env.NODE_ENV === 'development';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const createAppendBaseLoaders = (loaders = [], useModule = false) => [
  devMode ? require.resolve('style-loader') : MiniCssExtractPlugin.loader,
  {
    loader: require.resolve('css-loader'),
    options: {
      importLoaders: loaders.length + 1,
      sourceMap: true,
      modules: useModule && {
        localIdentName: '[local]__[hash:base64:5]'
      },
    }
  },
  {
    loader: require.resolve('postcss-loader'),
    options: {
      ident: 'postcss',
      sourceMap: true,
      plugins: [
        require('postcss-flexbugs-fixes'),
        require('postcss-preset-env')({
          autoprefixer: {
            flexbox: 'no-2009'
          },
          stage: 3
        })
      ]
    }
  },
  ...loaders
];

module.exports.createAppendBaseLoaders = createAppendBaseLoaders;
module.exports = (loadersOptions) => {
  const loaders = [{
    test: /\.css$/,
    exclude: /\.(module|m)\.css$/,
    use: createAppendBaseLoaders(),
    // Don't consider CSS imports dead code even if the
    // containing package claims to have no side effects.
    // Remove this when webpack adds a warning or an error for this.
    // See https://github.com/webpack/webpack/issues/6571
    sideEffects: true
  },
  {
    test: /\.(module|m)\.css$/,
    use: createAppendBaseLoaders([], true)
  }];
  if (loadersOptions.scss) {
    loaders.push({
      test: /\.(scss|sass)$/,
      exclude: /\.(module|m)\.(scss|sass)$/,
      use: createAppendBaseLoaders(['sass-loader']),
      sideEffects: true,
    }, {
      test: /\.(module|m)\.(scss|sass)$/,
      use: createAppendBaseLoaders(['sass-loader'], true)
    });
  }
  if (loadersOptions.less) {
    loaders.push({
      test: /\.less$/,
      exclude: /\.(module|m)\.less$/,
      use: createAppendBaseLoaders([
        {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true
          }
        }
      ]),
      sideEffects: true
    }, {
      test: /\.(module|m)\.less$/,
      use: createAppendBaseLoaders(
        [
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true
            }
          }
        ],
        true
      )
    });
  }
  return loaders;
};
