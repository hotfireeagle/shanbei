## 搭环境

// 包下载
npm install

```

## 起服务
```js
// 监听所有页面
(sudo) node server

// 监听部分页面
(sudo) node server -f "(index)|(dirName)"
```

访问[http://127.0.0.1](http://127.0.0.1)，显示正常则配置成功了

## 线上部署

在服务器上更新代码后直接执行 bash ./build.sh 部署脚本。

## 本地跑线上环境
```js
(sudo) node server online
```

## 目录/文件简介

|目录/文件|介绍|备注|
|----|---------|----|
|.babelrc|babel打包配置文案| |
|.eslintignore/.eslintrc.js|eslint配置文件| |
|.gitignore|git配置文件| |
|build.sh|发布脚本|在服务器上更新代码后直接执行代码编译打包|
|package.json|包配置| |
|server.js|起node服务|用于本地开发|
|app|开发环境代码|只需要提交该文件夹代码|
|html|线上HTML文件|请勿手动提交|
|assets|线上JS/CSS文件|请勿手动提交|
|bin/build|webpack打包配置||