var webpack = require('webpack')
var merge = require('webpack-merge')
var baseConfig = require('./webpack.base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var WebpackMd5Hash = require('webpack-md5-hash')
var get_entry = require('./get_entry');
var AssetsPlugin = require('assets-webpack-plugin');
var UglifyJsParallelPlugin = require('webpack-uglify-parallel');
var os = require('os');

// whether to generate source map for production files.
// disabling this can speed up the build.
const hashLen = 8;

var config = merge(baseConfig, {
    devtool: false,
    bail: true,
    output: {
        filename: 'assets/static/[name]-[chunkhash:' + hashLen + '].js',
        chunkFilename: 'assets/static/[id]-[chunkhash:' + hashLen + '].js'
    },
    module: {
        rules: [
            {
                test: /\.css/,
                loader: ExtractTextPlugin.extract(["css-loader!postcss-loader"])
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract(['css-loader?minimize&-autoprefixer!postcss-loader', 'less-loader'])
            }
        ]
    },
    plugins: [
        // http://vuejs.github.io/vue-loader/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.ProgressPlugin(function handler(percentage, msg) {
            var _perInt = parseInt(percentage * 100);
            if (_perInt % 10 === 0) {
                console.log('当前进度: ' + parseInt(percentage * 100) + "%", msg);
            }
        }),
        //单独使用link标签加载css并设置路径，相对于output配置中的publickPath
        new ExtractTextPlugin({
            filename: 'assets/static/[name]-[contenthash:' + hashLen + '].css'
        }),
        new UglifyJsParallelPlugin({
            workers: os.cpus().length, // usually having as many workers as cpu cores gives good results
            // other uglify options
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        }),
        new WebpackMd5Hash(),
        new AssetsPlugin({
            path: __dirname + '/../../assets',
            prettyPrint: true,
            update: true
        })
    ]
});

get_entry.chunksObject.forEach(function (item) {
    var conf = {
        filename: './html/' + item.pathname + '.html', //生成的html存放路径，相对于path
        template: item.templatePath, //html模板路径
        inject: false,  // js插入的位置，true/'head'/'body'/false
        minify: { // 压缩HTML文件
            removeComments: true, // 移除HTML中的注释
            collapseWhitespace: true, // 删除空白符与换行符
            minifyJS: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
        },
    };
    if (item.pathname in config.entry) {
        conf.inject = 'body';
        conf.chunks = [item.pathname];
    }
    config.plugins.push(new HtmlWebpackPlugin(conf));
});

module.exports = config;
