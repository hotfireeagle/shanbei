import './index.less';
import 'app/common/js/common.js';

let baseOrigin = '/EnglishLearningPlatform';

$(document).ready(function() {
    $('#login').on('click', function() {
        let userId = $('#userId').val();
        let userPwd = $('#userPwd').val();

        $.ajax({
            url: `${baseOrigin}/userController/login`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ userId, userPwd }),
            success: function(data) {
                data = JSON.parse(data);
                if (data.RTNDESC == '成功') {               // 成功的话跳转到
                    window.location = '/';
                    document.cookie = `userId=${userId}`;
                } else {
                    $('.small.modal').modal('show');
                }
            }
        });
    });

    $('#closeButton').on('click', function() {
        $('.small.modal').modal('hide');
    });
});