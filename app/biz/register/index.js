import './index.less';

let baseOrigin = '/EnglishLearningPlatform';

$(document).ready(function() {
    /** 关闭弹窗 */
    $('.message .close')
    .on('click', function() {
        $(this)
        .closest('.message')
        .transition('fade');
    });
    $('#submit').on('click', function() {
        let userId = $('#userId').val();
        let userPwd = $('#userPwd').val();
        let userName = $('#userN').val();

        let that = this;
        $(this).addClass('loading disabled');

        $.ajax({
            type: 'POST',
            url: `${baseOrigin}/userController/sign`,
            contentType: 'application/json',
            data: JSON.stringify({ userId, userPwd, userName }),
            success: function(data, textStatus) {
                data = JSON.parse(data);
                if (data.RTNDESC == '成功') {                   // 注册成功跳转到登录页面
                    $('.message').show();
                    setTimeout(function() {
                        $('.message').hide();                  // 显示2.5s后进行隐藏
                        window.location.href = '/';
                    }, 1500);
                }
                $(that).removeClass('loading disabled');
            }
        });
    });
});