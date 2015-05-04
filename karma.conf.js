var path = require('path');
var extend = require('util')._extend;
var webpack = require('webpack');

// TODO Make a function to produce different Webpack configs
var webpackConfig = require('./webpack.config');
extend(webpackConfig, {
    devtool: 'inline-source-map',
    module: {
        loaders: [{
            test: /\.(js|jsx)?$/,
            exclude: /node_modules(?!.*(\/js-csp))/,
            loader: 'babel-loader?cacheDirectory=true'
        }, {
            test: /.(css|less|png|jpeg|jpg|gif|woff|woff2|eot|ttf|svg)$/,
            loader: 'null-loader'
        }]
    },
    plugins: [webpackConfig.plugins[1]]
});

module.exports = function(config) {
    config.set({
        //browsers: ['PhantomJS'],
        frameworks: ['mocha', 'chai-as-promised', 'chai', 'sinon', 'sinon-chai'],
        files: [
            {pattern: 'src/**/*.js', included: false},
            {pattern: 'src/**/*.jsx', included: false},
            'spec/index.js'
        ],
        preprocessors: {
            'spec/index.js': ['webpack', 'sourcemap']
        },
        reporters: ['dots'],
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        }
    });
};
