import './index.less';
// import Xtemplate from 'xtemplate/lib/runtime';
import 'app/common/js/common.js';

let baseOrigin = '/EnglishLearningPlatform';

/**********************全局数据开始******************/
let globalConst = {
    xhrResponse: {}
};
/**********************全局数据结束******************/

/** 获取一篇文章进行背诵 */
function loadData() {
    
    $.ajax({
        url: `${baseOrigin}/essayController/getEssay`,
        type: 'POST',
        data: JSON.stringify({}),
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        success: function(data, textStatus) {
            if (data.RTNDESC == '成功' && (data.DATA && data.DATA.essayId)) {
                globalConst.xhrResponse = data.DATA;
                // globalConst.wordArr = parseOption();   // 调用方法进行解析
                renderUI();
            } else if (data.RTNDESC != '成功' || data.RTNCODE == '000008') {
                window.location.href = '/login.html';
            } else if (typeof data == 'string') {
                $('.small.modal').modal('show');
            } else {
                $('#message').text('真棒，一道错题都没有！');
                $('.small.modal').modal('show');
            }
        },
        complete: function() {                        // 加载数据成功后隐藏加载的loading
            $('.loader').parent('.active').removeClass('active');
        }
    });

}

/** 拿到数据之后进行UI渲染 */
// 1.首先渲染文章
// 2.渲染单词
// 3.渲染单词所对应的中文解释，不过默认隐藏
// 4.点击对应单词显示中文解释，并且将该单词加入到错题本里面
function renderUI() {
    let res = globalConst.xhrResponse;
    $('#essayContext').html(res.essayContext);
    $('#english1').text(res.wordFirstEnglish).data('id', res.wordIdFirst);
    $('#english2').text(res.wordSecondEnglish).data('id', res.wordIdSecond);
    $('#english3').text(res.wordThirdEnglish).data('id', res.wordIdThird);
    $('#english4').text(res.wordFourthEnglish).data('id', res.wordIdFourth);
    $('#english5').text(res.wordFifthEnglish).data('id', res.wordIdFifth)

    $('#chinese1').text(res.wordFirstChinese).hide();
    $('#chinese2').text(res.wordSecondChinese).hide();
    $('#chinese3').text(res.wordThirdChinese).hide();
    $('#chinese4').text(res.wordFourthChinese).hide();
    $('#chinese5').text(res.wordFifthChinese).hide();

    $('.english').on('click', function() {
        $(this).siblings('.chinese').show();

        let id = $(this).data('id');

        collectWord(id);
    });
}

/** 将单词加入到错题本的方法(无感知) */
function collectWord(id) {
    let url = `${baseOrigin}/wordController/reciteWord`;
    let data = JSON.stringify({
        wordId: id,
        istrue: "false"
    });
    $.ajax({
        url,
        data,
        type: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

$(document).ready(function() {
    loadData();

    /** 监听点击下一篇文章 */
    $('#next').on('click', function() {
        loadData();
    });
});