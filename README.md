## 运行项目前的软件安装
1.安装node.js，配置好相应的环境变量；当node安装好后，默认也已经安装好了配套的npm包管理工具，如果npm
下载依赖包的时候，网速较慢，可以选择下载源为淘宝源。推荐下载最新的稳定node版本。
      

参考链接：
     

[node下载链接](https://nodejs.org/zh-cn/download/)
     

[npm下载源设置为国内，这步也可不做](http://npm.taobao.org/)

## 搭环境
当安装好node后，到项目根目录下面执行如下命令，下载项目所需要依赖。如果遇到某个包下载失败，能翻墙最好翻墙，不能的话就配置下载源为国内淘宝源。
```bash
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

## 轮播插件
用的是开源组件 jquery.hiSlider.js


## 待办功能点
+ 注册页面UI ✅
+ 注册功能   ✅
+ 登录页面   ✅
+ 登录页面UI ✅
+ 注册页面如果在注册过程中发生错误的话，那么作出提示 ✅
+ 登录成功的时候，顶部栏不再显示注册，登录按钮，而是显示用户名 ✅
+ 点击用户 到达用户信息页面 ✅
+ 用户修改功能 ✅
+ 修改用户信息成功做一个提示 ✅
+ 注销功能      ✅
+ 修改密码功能  ✅
+ 记住密码功能
+ 丰富首页UI
+ 完成今日词表功能首页功能 ✅


## 改进点
+ 管理员用户最好有个标识
+ cookie过期时间最好长一些
+ cookie过期的时候返回的 内容是 <script type="text/javascript">alert('please login!');window.top.location.href='index.jsp';</script>