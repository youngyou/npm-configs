const webpackConfig = require('../index.js');

module.exports = webpackConfig({
    profiles: {
        test: {
            out: "test-output"
        }
    }
});