module.exports = loadersOption => ({
  test: /\.(js|mjs|jsx|ts|tsx)$/,
  enforce: 'pre',
  use: [
    {
      options: {
        eslintPath: require.resolve('eslint'),
        // baseConfig: eslint,
        ignore: true,
        useEslintrc: true,
        emitWarning: true,
        emitError: false,
        ...loadersOption.eslint
      },
      loader: require.resolve('eslint-loader')
    }
  ],
  exclude: /node_modules/
});