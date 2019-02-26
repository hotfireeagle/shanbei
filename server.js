var path = require('path');
var fs = require('fs');
var execSync = require('child_process').execSync;
var express = require('express');
var ejs = require('ejs');
var http = require('http');
var app = express();
var httpProxy = require('http-proxy');

var apiProxy = httpProxy.createProxyServer({});
apiProxy.on('error', function (err, req, res) {
    res.status(500).send('Something went wrong. And we are reporting a custom error message.');
});


var handleHtml = {
    // @note ejs编译
    compileEjs: function (filePath) {
        var content = fs.readFileSync(filePath);
        return ejs.render(content.toString(), {
            filename: filePath
        });
    },

    // @note 解析文件
    parsePath: function (filePath) {
        try {
            return this.compileEjs(filePath);
        } catch (e) {
            return e.message;
        }
    },

    // @note 处理html请求
    do: function (fixPath) {
        var self = this;
        return function (req, res) {
            var filePath = __dirname + (fixPath || '') + req.path;
            fs.stat(filePath, function (err, stats) {
                if (err || !stats.isFile()) {
                    // @note 没有文件
                    res.end('page is not found');
                } else {
                    // @note 读取该文件
                    res.end(self.parsePath(filePath));
                }
            });
        };
    }
};

if (process.argv[2] === 'online') {
    // node server online
    // html目录为根路径
    app.use(express.static(path.join(__dirname, 'html')));

    // @note 解析demo目录下html
    app.get('/demo/', function (req, res) {
        res.redirect('/demo/index.html');
    });
    app.get('/demo/*.html', handleHtml.do());
} else {
    // 下载依赖
    execSync('npm install');

    // 新build
    var webpackDevMiddleware = require('webpack-dev-middleware');
    var webpack = require('webpack');

    var webpackConfig = require('./bin/build/webpack.dev.conf');
    var webpackHotMiddleware = require('webpack-hot-middleware');

    console.log('监听的页面(监听的页面越少,性能越好)有:\n' + Object.keys(webpackConfig.entry).join('\n'));

    var compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        noInfo: true,
        stats: {
            colors: true,
            chunks: false,
            children: false,
            hash: false,
            assets: false,
            version: false,
            time: false
        }
    }));

    var hotMiddleware = webpackHotMiddleware(compiler);

    compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
            hotMiddleware.publish({ action: 'reload' });
            cb();
        });
    });

    app.use(hotMiddleware);

    // 新build end

    // @note 访问html目录
    app.use('/html', express.static('html'));

    // @note 解析demo目录下html
    app.get('/', function (req, res) {
        res.redirect('/index.html');
    });
    app.get('/*.html', handleHtml.do('/demo/'));
}

// 其他访问 作为静态资源反馈
app.use(express.static(__dirname));

app.all('/EnglishLearningPlatform/*', function(req, res) {
    apiProxy.web(req, res, {target: 'http://localhost:8080/'});
});

// http服务
http.createServer(app).listen(80, function () {
    console.log('gkInfomation http server listening on port 80');
});
