// 全国名校数据：知名大学 / 知名高中 / 知名初中
// 每个学校包含：名称、所在城市、特色标签、官网地址
const schoolData = {
    university: {
        name: "知名大学",
        intro: "国内综合实力与办学声誉顶尖的高等学府，涵盖985、211、双一流及C9联盟高校，点击卡片上的官网按钮可直达学校官方网站。",
        schools: [
            { name: "清华大学", city: "北京", features: ["C9联盟", "985工程", "211工程", "双一流"], url: "https://www.tsinghua.edu.cn" },
            { name: "北京大学", city: "北京", features: ["C9联盟", "985工程", "211工程", "双一流"], url: "https://www.pku.edu.cn" },
            { name: "复旦大学", city: "上海", features: ["C9联盟", "985工程", "211工程", "双一流"], url: "https://www.fudan.edu.cn" },
            { name: "上海交通大学", city: "上海", features: ["C9联盟", "985工程", "211工程", "双一流"], url: "https://www.sjtu.edu.cn" },
            { name: "浙江大学", city: "杭州", features: ["C9联盟", "985工程", "211工程", "双一流"], url: "https://www.zju.edu.cn" },
            { name: "南京大学", city: "南京", features: ["C9联盟", "985工程", "211工程", "双一流"], url: "https://www.nju.edu.cn" },
            { name: "中国科学技术大学", city: "合肥", features: ["C9联盟", "985工程", "211工程", "双一流"], url: "https://www.ustc.edu.cn" },
            { name: "中国人民大学", city: "北京", features: ["985工程", "211工程", "双一流", "人文社科强校"], url: "https://www.ruc.edu.cn" },
            { name: "北京师范大学", city: "北京", features: ["985工程", "211工程", "双一流", "师范类第一"], url: "https://www.bnu.edu.cn" },
            { name: "哈尔滨工业大学", city: "哈尔滨", features: ["C9联盟", "985工程", "211工程", "航天特色"], url: "https://www.hit.edu.cn" },
            { name: "西安交通大学", city: "西安", features: ["C9联盟", "985工程", "211工程", "双一流"], url: "https://www.xjtu.edu.cn" },
            { name: "武汉大学", city: "武汉", features: ["985工程", "211工程", "双一流", "百年名校"], url: "https://www.whu.edu.cn" },
            { name: "华中科技大学", city: "武汉", features: ["985工程", "211工程", "双一流", "工科强校"], url: "https://www.hust.edu.cn" },
            { name: "中山大学", city: "广州", features: ["985工程", "211工程", "双一流", "华南第一学府"], url: "https://www.sysu.edu.cn" },
            { name: "同济大学", city: "上海", features: ["985工程", "211工程", "双一流", "土木建筑强校"], url: "https://www.tongji.edu.cn" },
            { name: "四川大学", city: "成都", features: ["985工程", "211工程", "双一流", "西部名校"], url: "https://www.scu.edu.cn" },
            { name: "国防科技大学", city: "长沙", features: ["985工程", "双一流", "军校顶尖"], url: "https://www.nudt.edu.cn" },
            { name: "南开大学", city: "天津", features: ["985工程", "211工程", "双一流", "百年名校"], url: "https://www.nankai.edu.cn" },
            { name: "天津大学", city: "天津", features: ["985工程", "211工程", "双一流", "中国第一所现代大学"], url: "https://www.tju.edu.cn" },
            { name: "北京航空航天大学", city: "北京", features: ["985工程", "211工程", "双一流", "航空航天特色"], url: "https://www.buaa.edu.cn" }
        ]
    },
    high: {
        name: "知名高中",
        intro: "全国办学质量一流、高考与学科竞赛成绩突出的知名高级中学，是众多学子向往的求学殿堂，点击官网按钮可了解最新招生信息。",
        schools: [
            { name: "中国人民大学附属中学", city: "北京", features: ["全国知名", "北京市重点", "竞赛强校"], url: "https://www.rdfz.cn" },
            { name: "河北衡水中学", city: "衡水", features: ["全国知名", "超级中学", "高考名校"], url: "http://www.hbhszx.cn" },
            { name: "华中师范大学第一附属中学", city: "武汉", features: ["全国知名", "湖北省重点", "高考状元摇篮"], url: "http://www.hzsdyfz.com.cn" },
            { name: "长沙市长郡中学", city: "长沙", features: ["百年名校", "湖南省重点", "竞赛强校"], url: "http://www.changjun.com.cn" },
            { name: "长沙市雅礼中学", city: "长沙", features: ["百年名校", "湖南省重点", "竞赛强校"], url: "http://www.yali.hn.cn" },
            { name: "成都市第七中学", city: "成都", features: ["全国知名", "四川省重点", "林荫名校"], url: "http://www.cdqz.net" },
            { name: "上海中学", city: "上海", features: ["百年名校", "上海市实验性示范性高中"], url: "https://www.shs.sh.cn" },
            { name: "北京市第四中学", city: "北京", features: ["百年名校", "北京市重点", "首批示范校"], url: "https://www.bhsf.cn" },
            { name: "深圳中学", city: "深圳", features: ["广东省重点", "特区第一名校", "竞赛强校"], url: "https://www.shenzhong.net" },
            { name: "南京外国语学校", city: "南京", features: ["全国知名", "外语特色", "保送大户"], url: "https://www.nfls.com.cn" },
            { name: "华东师范大学第二附属中学", city: "上海", features: ["全国知名", "上海市实验性示范性高中", "竞赛强校"], url: "http://www.hsefz.cn" },
            { name: "杭州学军中学", city: "杭州", features: ["浙江省一级重点", "竞赛强校"], url: "http://www.hzxjhs.com" },
            { name: "宁波市镇海中学", city: "宁波", features: ["百年名校", "浙江省一级重点", "浙江高考名校"], url: "http://www.zhzx.net.cn" },
            { name: "东北师范大学附属中学", city: "长春", features: ["全国知名", "吉林省重点", "东北第一名校"], url: "http://www.msannu.cn" },
            { name: "华南师范大学附属中学", city: "广州", features: ["全国知名", "广东省重点", "奥校名校"], url: "http://www.hsfz.net.cn" },
            { name: "湖南师范大学附属中学", city: "长沙", features: ["百年名校", "湖南省重点", "竞赛强校"], url: "http://www.hnsdfz.org" },
            { name: "郑州外国语学校", city: "郑州", features: ["全国知名", "河南省重点", "外语特色"], url: "http://www.zzfls.com.cn" },
            { name: "重庆市巴蜀中学校", city: "重庆", features: ["全国知名", "重庆市重点", "竞赛强校"], url: "https://www.bashu.com.cn" },
            { name: "天津市南开中学", city: "天津", features: ["百年名校", "天津市重点", "周恩来母校"], url: "https://nkzx.tj.edu.cn" },
            { name: "武汉外国语学校", city: "武汉", features: ["全国知名", "湖北省重点", "外语特色"], url: "http://www.wfls.com.cn" }
        ]
    },
    middle: {
        name: "知名初中",
        intro: "各地办学口碑突出、中考成绩优异的知名初级中学（含名校初中部），以优良的校风与教学质量受到家长和学生的青睐。",
        schools: [
            { name: "上海华育中学", city: "上海", features: ["上海初中名校", "民办初中", "中考成绩优异"], url: "http://www.hyedu.sh.cn" },
            { name: "上海兰生复旦中学", city: "上海", features: ["上海初中名校", "复旦附系", "民办初中"], url: "http://www.lansheng.fudan.edu.cn" },
            { name: "杭州市文澜中学", city: "杭州", features: ["浙江初中名校", "民办初中", "中考成绩优异"], url: "http://www.wlzx.cn" },
            { name: "成都七中育才学校", city: "成都", features: ["四川初中名校", "七中教育集团", "公办初中"], url: "http://www.cdqzyc.com" },
            { name: "人大附中（初中部）", city: "北京", features: ["全国知名", "名校初中部"], url: "https://www.rdfz.cn" },
            { name: "北京市第四中学（初中部）", city: "北京", features: ["百年名校", "名校初中部"], url: "https://www.bhsf.cn" },
            { name: "南京外国语学校（初中部）", city: "南京", features: ["全国知名", "名校初中部", "外语特色"], url: "https://www.nfls.com.cn" },
            { name: "武汉外国语学校（初中部）", city: "武汉", features: ["全国知名", "名校初中部", "外语特色"], url: "http://www.wfls.com.cn" },
            { name: "华南师范大学附属中学（初中部）", city: "广州", features: ["全国知名", "名校初中部"], url: "http://www.hsfz.net.cn" },
            { name: "深圳中学（初中部）", city: "深圳", features: ["广东名校", "名校初中部"], url: "https://www.shenzhong.net" },
            { name: "北京市十一学校（初中部）", city: "北京", features: ["全国知名", "教改名校", "选课走班"], url: "https://www.bnds.cn" },
            { name: "北京大学附属中学（初中部）", city: "北京", features: ["全国知名", "名校初中部", "素质教育"], url: "https://www.pkuschool.edu.cn" }
        ]
    }
};

function createSchoolCard(school, index) {
    const rankClass = index === 0 ? 'top-1' : index === 1 ? 'top-2' : index === 2 ? 'top-3' : '';

    const featuresHtml = school.features && school.features.length > 0
        ? '<div class="school-features">' + school.features.map(function(f) {
            return '<span class="tag">' + f + '</span>';
          }).join('') + '</div>'
        : '';

    return '' +
        '<div class="school-card">' +
            '<div class="school-header">' +
                '<div class="school-name">' + school.name + '</div>' +
                (index < 3 ? '<span class="school-rank ' + rankClass + '">TOP ' + (index + 1) + '</span>' : '<span class="school-order">No.' + (index + 1) + '</span>') +
            '</div>' +
            '<div class="school-info">' +
                '<div class="info-item">' +
                    '<strong>📍 城市:</strong>' +
                    '<span class="school-city">' + school.city + '</span>' +
                '</div>' +
                featuresHtml +
            '</div>' +
            '<a class="school-website" href="' + school.url + '" target="_blank" rel="noopener noreferrer">' +
                '<i class="fas fa-globe"></i> 访问学校官网' +
            '</a>' +
        '</div>';
}

function renderTab(id, group, isActive) {
    return '<button class="tab-btn' + (isActive ? ' active' : '') + '" data-area="' + id + '">' + group.name + '</button>';
}

function renderSection(id, group, isActive) {
    const cards = group.schools.map(function(s, i) { return createSchoolCard(s, i); }).join('');
    return '' +
        '<div id="' + id + '" class="school-section' + (isActive ? ' active' : '') + '">' +
            '<h2>🏆 ' + group.name + '</h2>' +
            '<div class="section-intro"><p>' + group.intro + '</p></div>' +
            '<div class="school-list">' + cards + '</div>' +
        '</div>';
}

function initPage() {
    const tabsContainer = document.getElementById('area-tabs');
    const contentContainer = document.getElementById('content-area');

    const ids = Object.keys(schoolData);

    tabsContainer.innerHTML = ids.map(function(id, i) {
        return renderTab(id, schoolData[id], i === 0);
    }).join('');

    contentContainer.innerHTML = ids.map(function(id, i) {
        return renderSection(id, schoolData[id], i === 0);
    }).join('');

    updateStatistics();
    initTabs();
}

function updateStatistics() {
    let total = 0;
    const counts = {};

    Object.keys(schoolData).forEach(function(id) {
        const list = schoolData[id].schools;
        counts[id] = list.length;
        total += list.length;
    });

    document.getElementById('total-schools').textContent = total;
    document.getElementById('total-university').textContent = counts.university;
    document.getElementById('total-high').textContent = counts.high;
    document.getElementById('total-middle').textContent = counts.middle;
}

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.school-section');

    tabBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const area = btn.getAttribute('data-area');

            tabBtns.forEach(function(b) { b.classList.remove('active'); });
            sections.forEach(function(s) { s.classList.remove('active'); });

            btn.classList.add('active');
            const target = document.getElementById(area);
            if (target) {
                target.classList.add('active');
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initPage();
});
