/* 移动端导航：汉堡菜单开关（供未引入全站 script.js 的子页面使用） */
(function () {
    'use strict';

    function init() {
        var hamburger = document.querySelector('.hamburger');
        var navMenu = document.querySelector('.nav-menu');
        if (!hamburger || !navMenu) return;

        hamburger.addEventListener('click', function (e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('open');
        });

        // 点击菜单项后自动收起
        navMenu.addEventListener('click', function (e) {
            if (e.target.closest('a')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('open');
            }
        });

        // 点击页面其他区域收起
        document.addEventListener('click', function (e) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('open');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
