const fs = require('fs');
const path = require('path');
const appDirectory = fs.realpathSync(process.cwd());

const chalk = require('chalk');
const webpackMerge = require('webpack-merge');
const base = require('./base');
const UseEnv = require('./plugins/env');
const resolveUse = require('./utils/plugin-resolve');


const packageJson = require(path.resolve(appDirectory, 'package.json'));

const WebpackWrapper = (options) => {
  return env => {
    const profile = typeof env === 'object' ? env.profile : env;
    let profileOptions = profile && options.profiles && options.profiles[profile];
    if (profileOptions) {
      console.log(chalk.green(`> using profile "${chalk.cyan(profile)}"`));
    } else {
      profileOptions = {};
    }
    const op = {
      target: profileOptions.target || options.target || 'web',
      url: profileOptions.url || options.url || packageJson.homepage || '',
      entry: profileOptions.entry || options.entry,
      output: profileOptions.output || options.output,
      uses: [UseEnv({})],
      loaders: {}
    };
    if (Array.isArray(profileOptions.uses)) {
      op.uses.push.apply(op.uses, profileOptions.uses);
    }
    if (Array.isArray(options.uses)) {
      op.uses.push.apply(op.uses, options.uses);
    }
    if (Array.isArray(profileOptions.loaders)) {
      for (const key of profileOptions.loaders) {
        op.loaders[key] = true;
      }
    } else if (typeof profileOptions.loaders === 'object') {
      op.loaders = { ...op.loaders, ...profileOptions.loaders };
    }
    if (Array.isArray(options.loaders)) {
      for (const key of options.loaders) {
        op.loaders[key] = true;
      }
    } else if (typeof options.loaders === 'object') {
      op.loaders = { ...op.loaders, ...options.loaders };
    }
    return Promise.all(op.uses.filter(Boolean).map(use => resolveUse(use)(options))).then(useConfigs => {
      return webpackMerge.smart(base(op), ...(useConfigs));
    });
  };
};

module.exports = WebpackWrapper;
