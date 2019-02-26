var webpack = require('webpack')
var merge = require('webpack-merge')
var baseConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin');

var get_entry = require('./get_entry');
// 热更新
Object.keys(baseConfig.entry).forEach(function (name) {
    baseConfig.entry[name] = ['./bin/build/dev-client'].concat(baseConfig.entry[name])
});

var config = merge(baseConfig, {
    // eval-source-map is faster for development
    devtool: '#eval-source-map',
    output: {
        filename: 'assets/static/[name].js',
        chunkFilename: 'assets/static/[id].js'
    },
    module: {
        rules: [
            {
                test: /\.css/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
            },
        ]
    },
    plugins: [
        // http://vuejs.github.io/vue-loader/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ]
});


get_entry.chunksObject.forEach(function (item) {
    var conf = {
        filename: './' + item.pathname + '.html', //生成的html存放路径，相对于publicPath
        template: item.templatePath, //html模板路径
        inject: false   //js插入的位置，true/'head'/'body'/false
    };
    if (item.pathname in config.entry) {
        conf.inject = 'body';
        conf.chunks = [item.pathname];
    }
    config.plugins.push(new HtmlWebpackPlugin(conf));
});

module.exports = config;
