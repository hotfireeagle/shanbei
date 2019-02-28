import './index.less';
import { getCookie } from 'app/common/js/common.js';

// TODO: 1.一进入该页面便获取用户信息 ✅
// TODO: 2.完成修改用户信息 ✅
// TODO: 3.成功修改用户信息应该做一个提示
let baseOrigin = '/EnglishLearningPlatform';

$(document).ready(function() {
    let userId = getCookie('userId');

    // 1.首先获取用户信息
    $.ajax({
        url: `${baseOrigin}/userController/getUserInfo`,
        type: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        data: JSON.stringify({ userId }),
        success: function(data, textStatus) {
            if (data.RTNDESC == '成功') {
                let res = data.DATA;
                let { phoneNum, userId, userName, userType, email } = res;
                // 将后端返回的数据填充到表单上面
                $('#userId').val(userId);
                $('#phoneNum').val(phoneNum);
                $('#userN').val(userName);
                $('#email').val(email);
                $('#admin').text(( userType == 1 ? '是' : '否'))
            } else {
                $('.small.modal').modal('show');
            }
        },
        complete: function() {                                          // 请求完成后隐藏加载框
            $('.loader').parent('.active').removeClass('active');
        }
    });

    /** 监听关闭错误模态 */
    $('#closeButton').on('click', function() {
        $('.small.modal').modal('hide');
    });

    /** 监听点击修改用户信息按钮 */
    $('#edit').on('click', function() {
        let email = $('#email').val();
        let phoneNum = $('#phoneNum').val();
        let userName = $('#userN').val();
        
        let userId = $('#userId').val();

        if (!email || !phoneNum || !userName) {                 // 没有填必传字段的话，那么做个提示
            $('#message').text('邮箱，电话号码，用户昵称都是必填字段');
            $('.small.modal').modal('show');
            return;
        }

        $(this).addClass('loading disabled');
        let that = this;

        let data = { email, phoneNum, userName };
        if (userId) { data.userId = userId; }

        $.ajax({
            url: `${baseOrigin}/userController/updateUserInfo`,
            type: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            data: JSON.stringify(data),
            success: function(data, textStatus) {                   // 成功修改后应该刷新页面的
                console.log('data', data);
                if (data.RTNDESC == '成功') {
                    window.location.reload();
                } else {
                    $('#message').text('抱歉，修改用户信息接口发生错误');
                    $('.small.modal').modal('show');
                }
            },
            complete: function() {
                $(that).removeClass('loading disabled');
            }
        });
    });
});