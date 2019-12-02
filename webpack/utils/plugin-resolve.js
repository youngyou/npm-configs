const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

module.exports = function resolve(use) {
  if (typeof use === 'string' || (Array.isArray(use) && typeof use[0] === 'string')) {
    let usePath = Array.isArray(use) ? use[0] : use;
    if (!path.isAbsolute(usePath)) {
      if (usePath[0] === '.') {
        usePath = path.join(process.cwd(), usePath);
      } else {
        usePath = path.join(__dirname, '../plugins', usePath);
      }
    }
    usePath = require.resolve(usePath);
    if (!fs.existsSync(usePath)) {
      console.log(chalk.red(`Plugin ${use} dosn't exist`));
      process.exit(-1);
    }
    return (require(usePath))(use[1]);
  } else {
    return () => use;
  }
};
