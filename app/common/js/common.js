/** 监听顶部菜单栏的菜单的hover事件 */
$('.mi').on('mouseover', function() {
    $(this).addClass('ahover').siblings().removeClass('ahover');
    setTimeout(function() {
        $('.mi').removeClass('ahover');
    }, 1200);
});

/** 监听顶部菜单栏的菜单的点击事件 */
$('.mi').on('click', function() {
    $(this).addClass('aclick').siblings().removeClass('aclick');
});

/** 取本地的cookie，用户名以及登录信息都存在本地cookie中 */
var cacheobj = {};                      // 缓存保存，避免每次都进行遍历
function getCookie(keyName) {
    let result = '';
    let cookies = document.cookie || '';
    if (keyName in cacheobj) {
        return cacheobj[keyName];
    }
    cookies = cookies.split(';') || [];
    for (let i = 0, len = cookies.length; i < len; i++) {
        let keyValue = cookies[i];
        let arr = keyValue && keyValue.split('=') || [];
        let key = (arr[0] && arr[0].trim()) || '';
        let value = arr[1] || '';
        if (!cacheobj[key] || cacheobj[key] != value) {
            cacheobj[key] = value;
        }
        if (keyName === key) {
            result = value;
            break;
        }
    }
    return result;
}

/** 控制在顶部菜单是显示名字还是注册登录 */
function displayNameOrLogin() {
    let userName = getCookie('userId');
    if (userName) {
        $('.rl').hide();
        $('#userName').text(`您好，${userName}`);
        $('#userName').show();
        $('#loginOut').show();
    } else {
        $('.rl').show();
        $('#userName').hide();
        $('#loginOut').hide();
    }
}

displayNameOrLogin();

/** 设置cookie */
function setCookie(key, value) {
    document.cookie = `${key}=${value}`
}

/** 监听点击注销按钮 */
$('#loginOut').on('click', function() {
    let url = `/EnglishLearningPlatform/userController/loginOut`;
    $.ajax({
        url,
        type: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        data: JSON.stringify({}),
        success: function(data, textStatus) {
            if (data.RTNDESC == '成功') {           // 注销登录成功的话跳转到登录页面
                setCookie('userId', '');
                window.location.href = '/login.html';
            } else {
                console.error('注销失败');
            }
        }
    });
});


export {
    getCookie
};