
var rd = require('rd');
var fs = require('fs');
var webpackAssets = require('../../assets/webpack-assets.json');
var filenames = [];
var rootPath = __dirname + '/../..';

// 获取线上正在使用的文件
for (var key in webpackAssets) {
  webpackAssets[key].js && filenames.push(webpackAssets[key].js);
  webpackAssets[key].css && filenames.push(webpackAssets[key].css);
}

// 同步遍历目录下的所有文件，然后删除废弃文件
rd.eachFileFilterSync(rootPath + '/assets/static', /(\.js)|(\.css)$/, function (filename, stat) {
  let startIndex = filename.indexOf('/assets/static'),
    clipFilename = filename.slice(startIndex);

  if (filenames.indexOf(clipFilename) < 0) {
    fs.unlinkSync(filename);
  }
});