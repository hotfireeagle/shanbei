
let fs = require('fs'),
    path = require('path'),
    { execSync } = require('child_process');
// 过滤类的默认配置，不同平台路径分段分配符不同
let defaultOptions = {
    impReg : /import\s.*?['|"](.*?)['|"]|require\(['|"](.*?)['|"]\)/g, // 匹配引入文件的正则表达式
    blackList: [
        '^package.json$',
        'app(\\\\|/)common(\\\\|/)layout(\\\\|/)header.html',
        '^bin'], // 黑名单，在黑名单内的文件会全量打包
    makeStandardEnteies (entries) {
        let formatEntries = {};
        for (let i=entries.length; i--;) {
            formatEntries[entries[i].replace(/^app(\\|\/)biz(\\|\/)|(\\|\/)index\.js$/g, '')] = './' + entries[i];
        }
        return formatEntries;
    }
}

let hadCycle = [];
/**
 * 判断依赖类别，node_moudles依赖返回0， app公用库返回2， 相对引用返回1
 * @method isLegal
 * @param  {[String]}  relyPath [需要分析的依赖文件的路径]
 * @return {Number}      [文件的类别]
 */
function getRelyType (relyPath) {
    let regResult = relyPath.match(/^\.+\/|^~?app/);
    return !!regResult ? (regResult[0] === 'app' ? 2 : 1) : 0;
}

// 避免不带后缀或者package.json方式引入的文件无法识别, 可识别的后缀为js,less
function completingPath (filePath, defaultPrefix = false) {
    if (filePath.match(/\..*$/)) {
        return filePath;
    } else {
        if (defaultPrefix && fs.existsSync(filePath + '.' + defaultPrefix)) {
            return filePath + '.' +defaultPrefix;
        }
        if (fs.existsSync(filePath + '.js')) {
            return filePath + '.js';
        }
        if (fs.existsSync(filePath + '.less')) {
            return filePath + '.less';
        }
        if (fs.existsSync(filePath + '/package.json')) {
            let data = fs.readFileSync(filePath + '/package.json', {encoding: 'utf8'});
            if (data) {
                return path.normalize(filePath + '/' + (JSON.parse(data).main || '/index.js'));
            }
        } else {
            return path.normalize(filePath +'/index.js');
        }
    }
    return path.normalize(filePath);
}

/**
* [打包入口过滤类构造函数]
* @method analytics
* @param  {[Object]}  options [description]
* @return {[Class]}          [description]
*/
class Analytics {
    constructor(allEntries, options = {}) {
        if (!allEntries) {
            console.error('entries is necessary! Please provide a entries when new Class!');
            return false;
        }
        this.options = Object.assign(defaultOptions, options);
        this.allEntries = allEntries;
        this.allEntriesPaths = undefined;
        this.relyTree = undefined;  // 默认undefined来判断有没有构造过依赖树
        this.diffFile = undefined;
        this.entries = allEntries;
        this.init();
    }

    // 获取所有需要分析的入口文件的路径
    getAllEntries(allEntries = {}) {
        let allEntriesPaths = [];
        for (let key in allEntries) {
            allEntriesPaths.push(path.normalize(allEntries[key]));
        }
        this.allEntriesPaths = allEntriesPaths;
        return this;
    }

    // 分析单个文件
    analyticsSingleFile (filePath, parentPath = false) {
        let relyTree = this.relyTree,
            impReg = this.options.impReg || /import\s.*?['|"](.*?)['|"]|reqire\(['|"](.*?)['|"]\)/g;
        // 防止反复分析某个依赖
        if (relyTree[filePath]) {
            relyTree[filePath].parents ? parentPath && relyTree[filePath].parents.push(parentPath) : relyTree[filePath].parents = [parentPath];
            return;
        }
        // 构建一个节点
        relyTree[filePath] = {
            parents: parentPath ? [parentPath] : false,
            children: []
        }
        // 分析文件
        let data = fs.readFileSync(filePath, {encoding: 'utf8'});
        // 删除注释，防止import在注释内
        data = data.replace(/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg, '');
        let prefix = filePath.replace(/.+\./,"");
        let results = undefined;
        while((results = impReg.exec(data)) !== null) {
            let result = results[1] || results[2];
            // 防止less文件用~方式引入
            let relyPath = result.match(/^~/) ? result.replace(/^~/, '') : result;
            let relyType = getRelyType(relyPath);
            if (relyType) {
                // 默认使用父文件的后缀
                let childPath = completingPath(path.normalize(relyType === 2 ? relyPath : path.join(filePath, `../${relyPath}`)), prefix);
                relyTree[filePath].children.push(childPath);
            }
        }
        relyTree[filePath].children.forEach(childPath => this.analyticsSingleFile(childPath, filePath));
        return relyTree;
    }

    // 生成依赖树
    getRelyTree() {
        this.allEntriesPaths || this.getAllEntries(this.allEntries);
        this.relyTree = {};
        this.allEntriesPaths.forEach(filePath => {
            this.relyTree[filePath.replace(/js$/,'html')] = {parents: [filePath]};
            this.analyticsSingleFile(filePath);
        });
        return this;
    }

    // 获取修改过的文件的路径
    getDiffFile() {
        if (fs.existsSync('.git')) {
            this.diffFile = execSync('git add -N . && git diff origin/master --name-only', {encoding: 'utf8'}).split('\n').filter(item => item).map(filePath => path.normalize(filePath));
            return this;
        } else {
            let printFunc = 'if($3){print $3}else{print $2}';
            this.diffFile = execSync(`svn st -u -r HEAD | awk \'{${printFunc}}\'`, {encoding: 'utf8'}).split('\n').filter(item => item && item != 'revision:').map(filePath => path.normalize(filePath.replace(/\r/g, '')));
            return this;
        }
    }

    // 向上遍历父节点获取对应的index.js
    findParents (parents = []) {
        let topParnetsCache = [];  // 没有父节点的文件缓存
        for (let i = parents.length; i--;) {
            let childPath = parents[i] ? path.normalize(parents[i]) : false; // 当前分析的文件
            if (childPath && hadCycle.indexOf(childPath) < 0 && this.relyTree[childPath]) {
                hadCycle.push(childPath);
                // 防止false并排除不在依赖树的文件，如：打包后的静态页面
                let localParents = this.relyTree[childPath].parents;
                localParents ? Array.prototype.push.apply(topParnetsCache,this.findParents(localParents)) : topParnetsCache.push(childPath);
            }
        }
        return topParnetsCache;
    }

    makeEntries(standard = true) {
        this.diffFile || this.getDiffFile();
        let blackList = this.options.blackList.length ? new RegExp(this.options.blackList.join('|')) : '//';
        for (let i in this.diffFile) {
            if (this.diffFile[i].match(blackList)) {
                return this;
            }
        }
        this.relyTree || this.getRelyTree();
        let entries = this.findParents(this.diffFile);
        hadCycle = [];
        this.entries = standard ? this.options.makeStandardEnteies(entries) : entries;
        return this;
    }

    init() {
        this.getAllEntries(this.allEntries).getRelyTree().getDiffFile().makeEntries();
        console.log('Your diff files are: ', this.diffFile);
    }

}

module.exports = Analytics;
