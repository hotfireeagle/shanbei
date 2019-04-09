import './index.less';
import 'app/common/js/common.js';

/***********全局状态开始**********/
let globalConst = {
    wordNum: 0,                     // 已经添加单词的数量
};
/***********全局状态结束**********/

/** 渲染UI */
function renderUI () {
    let E = window.wangEditor
    let editor = new E('#editor')
    editor.create()
}

/** 监听点击按钮添加单词 */

$(document).ready(function () {
    renderUI();
});