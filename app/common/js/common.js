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
    let userName = getCookie('name');
    if (userName) {
        $('.rl').hide();
        $('#userName').text(userName);
        $('#userName').show();
    } else {
        $('.rl').show();
        $('#userName').hide();
    }
}

displayNameOrLogin();

/** 设置cookie */
function setCookie(key, value) {
    document.cookie = `${key}=${value}`
}