import './index.less';
import 'app/common/js/common.js';

let baseOrigin = '/EnglishLearningPlatform';

let globalConst = {
    wordType: '1',
};


/** 监听点击按钮添加单词 */
function addWords () {
    $('#addWord').click(function () {
        
        let wordEnglish = $('.english').val();
        let wordChinese = $('.chinese').val();
        let wordType = globalConst.wordType;

        if (!checkisLegal(wordEnglish, wordChinese)) return;

        let data = { wordChinese, wordEnglish, wordType };
        sendXHR(data);

    });
}

/** 清空输入框中的单词 */
function clearInput () {
    $('.english').val('');
    $('.chinese').val('');
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

/** 发送xhr数据 */
function sendXHR (data) {
    $.ajax({
        url: `${baseOrigin}/wordController/addWord`,
        type: "POST",
        data: JSON.stringify(data),
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        success: function(data, textStatus) {
            if (data.RTNDESC == '成功') {
                clearInput();
                $('#message').text('更新成功');
                $('.small.modal').modal('show');
            } else if (data.RTNCODE == '000008') {
                window.location.href = '/login.html';
            } else {
                $('.small.modal').modal('show');
            }
        }
    });
}


$(document).ready(function () {
    addWords();

    /** 监听点击模态的关闭按钮 */
    $('#closeButton').click(function () {
        $('.small.modal').modal('hide');
    });

    $('.ui.dropdown')
    .dropdown({
        onChange: function (value) {
            globalConst.wordType = ''+value;
        }
    });
});