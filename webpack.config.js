const path = require('path');

module.exports = {
    target: "node",
    output: {
        path: process.cwd(),
        filename: "dist.js",
        library: "wstrade-api",
        libraryTarget: "umd"
    },
    devtool: 'inline-source-map',
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
        "source-map-support": {
            commonjs: 'source-map-support',
            commonjs2: 'source-map-support',
            amd: 'source-map-support',
            root: '_',
        }
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ["@babel/plugin-proposal-optional-chaining", "@babel/plugin-transform-runtime"],
                    }
                }
            }
        ],
    }
};