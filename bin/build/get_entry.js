
var glob = require('glob');
var path = require('path');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var Analytics = require('./analytics-dependency.js');
const prefix = './app/';

var entries = getEntry(prefix + 'biz/**/index.js', prefix + 'biz/');
var filter = argv.f || process.env.PART_FILE;
var re = new RegExp(filter, 'gim');

if (filter) {
    for (var item in entries) {
        if (entries.hasOwnProperty(item) && !item.match(re)) {
            delete entries[item];
        }
    }
}

if (process.env.NODE_ENV === 'production') {
    let dependencyEntries = new Analytics(entries).entries;
    // 如果没有任何文件需要打包，默认全量打包 
    if (Object.keys(dependencyEntries).length <= 0) {
        console.log('没有任何要打包的文件，走兜底逻辑，全量打包');
    } else {
        console.log('增量打包:\n');
        entries = dependencyEntries;
    }
    console.log('The etries are:\n', entries);
}

var chunks = Object.keys(entries);
var chunksObject = chunks.map(function (pathname) {
    var templatePath = '!!ejs-full-loader!app/default/index.html';
    try {
        var s = fs.statSync(__dirname + '/../../app/biz/' + pathname + '/index.html');
        if (s && s.isFile()) {
            templatePath = '!!ejs-full-loader!app/biz/' + pathname + '/index.html';
        }
    } catch (err) {
        if (err.code !== 'ENOENT') {
            throw err;
        }
    }
    return {
        pathname: pathname,
        templatePath: templatePath
    };
});

/**
 * 解析 entry 路径
 * */
function getEntry(globPath, pathDir) {
    var files = glob.sync(globPath);
    var entries = {},
        entry, dirname, pathname;
    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        pathname = dirname.replace(new RegExp('^' + pathDir), '');
        entries[pathname] = './' + entry;
    }
    return entries;
}

exports.chunksObject = chunksObject;
exports.entries = entries;
