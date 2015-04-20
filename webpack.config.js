var config = require('./config.json');
var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'eval-source-map',
    cache: true,

    entry: {
        app: ['webpack/hot/dev-server', path.resolve(__dirname, config.entry)]
    },
    output: {
        path: path.resolve(__dirname, config.dest),
        filename: '[name].js'
    },
    resolve: {
        root: [
            path.resolve(__dirname, './node_modules'),
            path.resolve(__dirname, './src/app')
        ],
        extensions: ['', '.js', '.jsx']
    },

    module: {
        loaders: [{
            test: /\.(js|jsx)?$/,
            exclude: /node_modules(?!.*(\/js-csp))/,
            loader: 'babel-loader?cacheDirectory=true'
        }, {
            test: /\.json$/,
            loader: "json-loader"
        }, {
            test: /\.css$/,
            loader: "style-loader!css-loader"
        }, {
            test: /\.less$/,
            loader: "style-loader!css-loader?importLoaders=1!less-loader"
        }, {
            test: /\.(png|jpg|jpeg|gif)$/,
            loader: "url-loader?name=img/[name].[ext]&limit=10000"
        }, {
            test: /\.(woff|woff2)$/,
            loader: "url-loader?name=font/[name].[ext]&limit=10000"
        }, {
            test: /\.eot$/,
            loader: "file-loader?prefix=font/"
        }, {
            test: /\.ttf$/,
            loader: "file-loader?prefix=font/"
        }, {
            test: /\.svg$/,
            loader: "file-loader?prefix=font/"
        }]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function(module, count) {
                return module.resource && module.resource.indexOf(
                    config.src) === -1;
            }
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ]
};
