import './index.less';
import Xtemplate from 'xtemplate/lib/runtime';
import 'app/common/js/common.js';
import optionXtpl from './option.xtpl';

let baseOrigin = '/EnglishLearningPlatform';

/**********************全局状态*********************/
let globalConst = {
    xhrResponse: {},                    // 返回的响应
    wordArr: [],                        // 单词数组
    index: 0,                           // 索引
    isTrue: false,                      // 是否正确
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
            if (data.RTNDESC == '成功' && data.DATA.length > 0) {
                globalConst.xhrResponse = data.DATA;
                globalConst.wordArr = parseOption();   // 调用方法进行解析
                renderUI();
            } else if (data.RTNDESC == '成功' && data.DATA.length == 0) {
                $('#message').text('真棒，您已经完成了所有的单词啦！');
                $('.small.modal').modal('show');
            } else if (typeof data == 'string') {
                window.location.href = '/login.html';
            } else {
                $('.small.modal').modal('show');
            }
        },
        complete: function() {                        // 加载数据成功后隐藏加载的loading
            $('.loader').parent('.active').removeClass('active');
        }
    });
    
}

/** 渲染题目 */
function renderQuestion() {
    let index = globalConst.index;
    let currentWord = globalConst.wordArr[index];

    $('#wordEnglish').text(currentWord.wordChinese);
    $('.option-container').html(new Xtemplate(optionXtpl).render({
        options: currentWord.options
    }));

    /** 选项被悬浮的时候设置背景色 */
    $('.option-item').hover(
        function() {$(this).addClass('hoverItem');},
        function() {$(this).removeClass('hoverItem');}
    );

    /** 选项被点击的时候判断是否正确 */
    $('.option-item').on('click', function() {
        let isTrue = $(this).data('id');
        globalConst.isTrue = isTrue;
        $(this).siblings('.option-item').children().removeClass('rightKey rightValue wrongKey wrongValue');
        if (isTrue) {
            $(this).children('.key').addClass('rightKey');
            $(this).children('.value').addClass('rightValue');
        } else {        // 选择的那题设置为false样式，同时正确的需要标注出来
            $(this).children('.key').addClass('wrongKey');
            $(this).children('.value').addClass('wrongValue');

            /** 标注出正确的题目 */
            $(this).siblings(".option-item[data-id=true]").children('.key').addClass('rightKey');
        }
    });
}

/** 渲染UI的方法 */
function renderUI() {
    $('#label').text(`第${globalConst.index+1}题-总共${globalConst.wordArr.length}题`);
    $('#progress').data('total', globalConst.wordArr.length-1);

    renderQuestion();

    /** 监听点击下一题按钮，同时发送ajax请求 */
    $('#next').on('click', function() {
        if (globalConst.index < globalConst.wordArr.length-1) {
            let current = globalConst.wordArr[globalConst.index];
            let istrue = globalConst.isTrue+'';
            let wordId = current.wordId;
            globalConst.index += 1;
            $('#label').text(`第${globalConst.index+1}题-总共${globalConst.wordArr.length}题`);
            $('#progress').progress({
                value: globalConst.index,
            });
            renderQuestion();

            sendXhr({ wordId, istrue });
            
        } else {                    // 提示已经到了最后一题
            $('#label').text('大功告成，明天再来背单词吧~');
            $('#message').text('已经到达最后一题啦~，明天再来练习吧');
            $('.small.modal').modal('show');
        }
    });
}

loadData();

/** 无伤回调，不给用户提示 */
function sendXhr(data) {
    let url = `${baseOrigin}/wordController/reciteWord`;
    $.ajax({
        url,
        type: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        data: JSON.stringify(data)
    });
}

$(document).ready(function() {
    /** 监听点击关闭提示信息的模态 */
    $('#closeButton').on('click', function() {
        $('.small.modal').modal('hide');
    });
});