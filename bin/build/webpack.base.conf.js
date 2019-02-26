var webpack = require('webpack');
var path = require('path');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var get_entry = require('./get_entry');
var cssLoaders = require('./css-loaders');
const publicPath = "/";

module.exports = {
    entry: get_entry.entries,
    output: {
        path: __dirname + '/../../', //输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
        publicPath: publicPath,	//模板、样式、脚本、图片等资源对应的server上的路径
        filename: 'assets/static/[name].js',
        chunkFilename: 'assets/static/[id].js'
    },
    resolve: {
        alias: {
            "app": path.resolve('./app')
        },
        extensions: ['.js']
    },
    module: {
        rules: [
            {
                test: /\.xtpl$/,
                loader: 'xtpl-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new LodashModuleReplacementPlugin({
            'collections': true
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function(){
                    return [
                        require("autoprefixer")({
                            browsers: ['android >= 4.0','ios_saf >= 7.0'],
                            remove: false
                        })
                    ]
                },
                vue: {
                    loaders: cssLoaders({
                      sourceMap: false,
                      extract: false
                    }),
                    postcss: [
                      require('autoprefixer')({
                        browsers: ['android >= 4.0', 'ios_saf >= 7.0'],
                        remove: false
                      })
                    ]
                }
            }
        })
    ]
};
