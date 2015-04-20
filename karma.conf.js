var path = require('path');
var extend = require('util')._extend;
var webpack = require('webpack');

// TODO Make a function to produce different Webpack configs
var webpackConfig = require('./webpack.config');
extend(webpackConfig, {
    module: {
        loaders: [{
            test: /\.(js|jsx)?$/,
            exclude: /node_modules(?!.*(\/js-csp))/,
            loader: 'babel-loader?cacheDirectory=true&optional=runtime'
        }, {
            test: /.(css|less|png|jpeg|jpg|gif|woff|woff2|eot|ttf|svg)$/,
            loader: 'null-loader'
        }]
    },
    plugins: [webpackConfig.plugins[1]]
});

module.exports = function(config) {
    config.set({
        browsers: ['PhantomJS'],
        //singleRun: true
        frameworks: ['mocha', 'chai', 'sinon'],
        files: [
            'spec/index.js'
        ],
        preprocessors: {
            'spec/index.js': ['webpack', 'sourcemap'] //preprocess with webpack and our sourcemap loader
        },
        reporters: ['dots'], //report results in this format
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        }
    });
};
