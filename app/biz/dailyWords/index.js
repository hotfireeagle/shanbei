import './index.less';
import 'app/common/js/common.js';

let baseOrigin = '/EnglishLearningPlatform';

/**********************全局状态*********************/
let globalConst = {
    xhrResponse: {},                    // 返回的响应
    wordArr: [],                        // 单词数组
    index: 0,                           // 索引
};
/********************全局状态结束********************/

/** 将query解析成object */
function parseQuery() {
    let query = location.search;
    if (Object.prototype.toString.call(query) != "[object String]") {
        return {};
    }
    let result = {};
    if (query[0] == '?') { query = query.substr(1); }

    query.split('&').map(keyValue => {
        let arr = (keyValue && keyValue.split('=')) || [];
        result[arr[0]] = arr[1];
    });

    return result;
}

/** 将数据转换为可用数据 */
function parseOption() {
    let response = [...globalConst.xhrResponse];
    let result = [];
    response.map(wordObj => {
        // 增加一个选项字段
        let options = [];                               // 选项数组
        let indexArr = ['A', 'B', 'C', 'D'];
        let optionAnswer = {};
        optionAnswer.key = generateIndex(indexArr);
        optionAnswer.wordChinese = wordObj.wordChinese;
        optionAnswer.wordEnglish = wordObj.wordEnglish;
        optionAnswer.isTrue = true;
        options.push(optionAnswer);
        for (let i = 1; i < 4; i++) {
            let option = {};                            // 一个选项
            option.key = generateIndex(indexArr);
            option.wordChinese = wordObj.selectList[i-1].wordChinese;
            option.wordEnglish = wordObj.selectList[i-1].wordEnglish;
            option.isTrue = false;
            options.push(option);
        }
        wordObj.options = sortOptions(options);
        result.push(wordObj);
    });
    return result;
}

/** 对options数组进行排序 */
function sortOptions(options) {
    // Array.prototype.sort不是一个纯方法
    let result = [...options];
    result.sort((n1, n2) => n1.key.charCodeAt(0) - n2.key.charCodeAt(0));
    return result;
}

/** 获取一个索引 */
function generateIndex(arr) {
    // 需要从外面提供一个arr的数组，值为['A', 'B', 'C', 'D']
    let result;
    let randomNum = getRandomNum(0, arr.length-1);
    result = arr[randomNum];
    arr.splice(randomNum, 1);                           // splice不是一个纯方法
    return result;
}

// 生成一个随机数
function getRandomNum(min, max) {
    let range = max - min;
    let rand = Math.random();
    return (min + Math.round(rand * range));
}

// TODO: 1.一进入这个页面便获取单词数量
function loadData() {
    let queryObj = parseQuery();
    let planNum = queryObj['planNum'];
    let wordType = queryObj['wordType'];

    $.ajax({
        url: `${baseOrigin}/wordController/getNewWord`,
        type: 'POST',
        data: JSON.stringify({
            planNum,
            wordType
        }),
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        success: function(data, textStatus) {
            if (data.RTNDESC == '成功') {
                globalConst.xhrResponse = data.DATA;
                globalConst.wordArr = parseOption();   // 调用方法进行解析
                console.log('globalConst.wordArr is', globalConst.wordArr);     // 获取分页数组
                renderUI();
            } else {
                $('.small.modal').modal('show');
            }
        },
        complete: function() {                        // 加载数据成功后隐藏加载的loading
            $('.loader').parent('.active').removeClass('active');
        }
    });
    
}

/** 渲染UI的方法 */
function renderUI() {
    let index = globalConst.index;
    let currentWord = globalConst.wordArr[index];
    console.log('currentWord', currentWord);

    $('#wordEnglish').text(currentWord.wordEnglish);
}

loadData();

$(document).ready(function() {
    /** 监听点击关闭提示信息的模态 */
    $('#closeButton').on('click', function() {
        $('.small.modal').modal('hide');
    });
});