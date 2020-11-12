const path = require('path');

module.exports = {
    target: 'node',
    output: {
        filename: "wstrade.js",
        library: "wstrade-api",
        libraryTarget: "umd"
    },
    resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    externals: {
        "node-fetch": {
            commonjs: 'node-fetch',
            commonjs2: 'node-fetch',
            amd: 'node-fetch',
            root: '_',
        },
        "http-status": {
            commonjs: 'http-status',
            commonjs2: 'http-status',
            amd: 'http-status',
            root: '_',
        }
    }
};