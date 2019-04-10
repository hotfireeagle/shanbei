import './index.less';
import 'app/common/js/common.js';
import Xtemplate from 'xtemplate/lib/runtime';
import newsXtpl from './news.xtpl';

/*********************************全局状态开始********************************/
let globalConst = {
    xhrResponse: [],                            // 文章列表数据
};
/*********************************全局状态结束********************************/

let baseOrigin = '/EnglishLearningPlatform';

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

/** 获取数据 */
function loadData() {

    $.ajax({
        url: `${baseOrigin}/essayController/getNews`,
        type: 'POST',
        data: JSON.stringify({}),
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        success: function (data) {
            if (data.RTNDESC == '成功' && data.DATA.length > 0) {
                globalConst.xhrResponse = data.DATA;
                renderUI();
            } else if (data.RTNDESC == '成功' && data.DATA.length == 0) {
                renderEmpty();
                $('#message').text('抱歉，文章列表为空，管理人员会尽快进行更新哦');
                $('.small.modal').modal('show');
            } else if (typeof data == 'string' || data.RTNCODE == '000008') {
                window.location.href = '/login.html';
            } else {
                $('.small.modal').modal('show');
            }
        },
        complete: function () {
            $('.loader').parent('.active').removeClass('active');
        }
    });

}

/** 渲染UI */
function renderUI() {
    $('.container').html(new Xtemplate(newsXtpl).render({
        news: globalConst.xhrResponse
    }));

    /** 监听点击文章详情 */
    $('.seeDetail').on('click', function() {
        let newsContent = $(this).data('content');
        window.localStorage.setItem('activeNews', newsContent);
    });
}

$(document).ready(function() {
    loadData();
});