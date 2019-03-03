import './index.less';
import 'app/common/js/common.js';

/*********************************全局状态开始********************************/
let globalConst = {
    wordType: 1,        // 可选值为1，2，3,分别代表高中,cet4,cet8
};
/*********************************全局状态结束********************************/

/** 将用户所选择的单词本和单词数量传递到下个页面 */
$(document).ready(function() {

    $('.book').on('click', function() {
        let that = this;
        let wordType = $(that).data('type');
        globalConst.wordType = wordType;
        $(that).addClass('activecard').siblings('.card').removeClass('activecard');
    });

    $('#start').on('click', function() {
        let that = this;
        // 获取用户所输入的单词数量
        let planNum = $('#planNum').val() || 20;
        let wordType = globalConst.wordType || 1;
        window.location.href = `/dailyWords.html?planNum=${planNum}&wordType=${wordType}`;
    });
});