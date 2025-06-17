const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'node_modules/swagger-ui-dist/', to: '.' }
            ],
        }),
    ],
};