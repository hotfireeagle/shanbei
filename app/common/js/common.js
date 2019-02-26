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
function getCookie(key) {
    let cacheobj = {};                      // 缓存保存，避免每次都进行遍历
    let result = '';
    let cookies = document.cookie || '';
    cookies = cookies.split(';') || [];
    cookies.map(keyValue => {
        let arr = keyValue && keyValue.split('=') || [];
        let key = arr[0] || '';
        let value = arr[1] || '';
        
    });
}


/** 设置cookie */
function setCookie(key, value) {
    document.cookie = `${key}=${value}`
}