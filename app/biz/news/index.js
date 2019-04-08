import './index.less';
import 'app/common/js/common.js';

/*********************************全局状态开始********************************/
let globalConst = {

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

    // TODO: 完善接口
    $.ajax({
        url: `${baseOrigin}/`,
        type: 'GET',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        success: function (data) {
            if () {

            } else if () {

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
    
}

$(document).ready(function() {

});