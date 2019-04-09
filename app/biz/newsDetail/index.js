import './index.less';
import 'app/common/js/common.js';

/** 渲染UI */
function renderUI () {
    let newsContent = window.localStorage.getItem('activeNews');
    $('.container').html(newsContent);
}

$(document).ready(function () {
    renderUI();
});