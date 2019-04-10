import './index.less';
import 'app/common/js/common.js';
import Xtemplate from 'xtemplate/lib/runtime';
import wordsXtpl from './words.xtpl';

let baseOrigin = '/EnglishLearningPlatform';

/***********全局状态开始**********/
let globalConst = {
    editor: null,                   // 富文本编辑器实例
    wordNum: 0,                     // 已经添加单词的数量
    wordArr: [],                    // 添加单词的数组
};
/***********全局状态结束**********/

/** 渲染UI */
function renderUI () {
    let E = window.wangEditor;
    let editor = new E('#editor');
    editor.create();
    globalConst.editor = editor;
}

/** 监听点击按钮添加单词 */
function addWords () {
    $('#addWord').click(function () {

        if (globalConst.wordNum > 4) {
            $('#message').text('每篇文章只需要配置五个重点单词哦');
            $('.small.modal').modal('show');
            clearInput();
            return;
        }
        
        let english = $('.english').val();
        let chinese = $('.chinese').val();


        if (!checkisLegal(english, chinese)) return;

        globalConst.wordNum++;

        globalConst.wordArr.push({ english, chinese });

        clearInput();

        displayWords();

    });
}

/** 清空输入框中的单词 */
function clearInput () {
    $('.english').val('');
    $('.chinese').val('');
}

/** 单词回显 */
function displayWords () {
    let words = globalConst.wordArr;
    $('.wordList').html(new Xtemplate(wordsXtpl).render({
        words
    }));
}

/** 检测是否输入有效的英文单词以及中文释义 */
function checkisLegal (english, chinese) {
    if (!english || !chinese) {
        $('#message').text('请输入有效的英文单词以及中文释义');
        $('.small.modal').modal('show');
        return false;
    }
    return true;
}

/** 监听点击更新按钮 */
function clickUpdate () {
    $('#update').on('click', function () {
        if (globalConst.wordNum != 5) {
            $('#message').text('每篇文章必须配置5个重点单词哦');
            $('.small.modal').modal('show');
            return false;
        }

        let essayContext = globalConst.editor.txt.html();

        let wordList = [];
        globalConst.wordArr.map(obj => {
            wordList.push({
                wordChinese: obj.chinese,
                wordEnglish: obj.english,
                wordType: '0',
            });
        });

        let data = { essayContext, wordList };

        sendXHR(data)
    });
}

/** 发送xhr数据 */
function sendXHR (data) {
    $.ajax({
        url: `${baseOrigin}/essayController/addEssay`,
        type: "POST",
        data: JSON.stringify(data),
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        success: function(data, textStatus) {
            if (data.RTNDESC == '成功') {
                $('#message').text('更新成功');
                $('.small.modal').modal('show');
            } else if (typeof data == 'string' || data.RTNCODE == '000008') {
                window.location.href = '/login.html';
            } else {
                $('.small.modal').modal('show');
            }
        }
    });
}


$(document).ready(function () {
    renderUI();
    addWords();
    clickUpdate();

    /** 监听点击模态的关闭按钮 */
    $('#closeButton').click(function () {
        $('.small.modal').modal('hide');
    });
});