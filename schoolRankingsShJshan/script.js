const districtData = {
    dongcheng: {
        name: "东城区",
        intro: "东城区是北京市中心城区核心区域，教育资源优质，拥有多所百年名校和重点学区。",
        middle: [
            { name: "北京四中", rank: 1, score: 625, address: "北京市西城区西什库大街", features: ["百年名校", "市重点", "首批示范校"], tags: ["featured", "top-1"] },
            { name: "北京景山学校", rank: 2, score: 618, address: "北京市东城区灯市口大街", features: ["九年一贯制", "重点学校", "教育改革试点"], tags: ["featured", "top-2"] },
            { name: "北京市第二中学", rank: 3, score: 610, address: "北京市东城区内务部街", features: ["历史悠久", "市重点"], tags: ["featured", "top-3"] },
            { name: "北京市第二十四中学", rank: 4, score: null, address: "北京市东城区东四北大街", features: ["完全中学"], tags: [] },
            { name: "北京市第六十五中学", rank: 5, score: null, address: "北京市东城区光明路", features: ["区重点"], tags: [] }
        ],
        primary: [
            { name: "北京景山学校（小学部）", address: "北京市东城区灯市口大街", features: ["九年一贯制", "重点学校"], tags: ["featured"] },
            { name: "北京市东城区府学胡同小学", address: "北京市东城区府学胡同", features: ["百年名校", "重点小学"], tags: ["featured"] },
            { name: "北京市东城区分司厅小学", address: "北京市东城区分司厅胡同", features: ["老校名校"], tags: [] },
            { name: "北京市第一六六中学附属校尉胡同小学", address: "北京市东城区校尉胡同", features: ["附属小学"], tags: [] },
            { name: "北京市东城区新鲜胡同小学", address: "北京市东城区新鲜胡同", features: ["区重点"], tags: [] }
        ]
    },
    xicheng: {
        name: "西城区",
        intro: "西城区是北京市教育资源最密集的区域之一，名校云集，素有'教育强区'之称。",
        middle: [
            { name: "北京四中", rank: 1, score: 625, address: "北京市西城区西什库大街", features: ["百年名校", "市重点", "首批示范校"], tags: ["featured", "top-1"] },
            { name: "北京八中", rank: 2, score: 620, address: "北京市西城区西便门东街", features: ["市重点", "科技教育特色"], tags: ["featured", "top-2"] },
            { name: "北京师大附中", rank: 3, score: 615, address: "北京市西城区南新华街", features: ["师范附属", "百年名校"], tags: ["featured", "top-3"] },
            { name: "北京市第二中学分校", rank: 4, score: null, address: "北京市西城区新街口外大街", features: ["分校"], tags: [] },
            { name: "北京市实验中学", rank: 5, score: null, address: "北京市西城区二龙路", features: ["实验学校"], tags: ["new"] }
        ],
        primary: [
            { name: "北京第二实验小学", address: "北京市西城区新文化街", features: ["百年名校", "市重点"], tags: ["featured"] },
            { name: "北京市西城区育才学校（小学部）", address: "北京市西城区南礼士路", features: ["九年一贯制"], tags: ["featured"] },
            { name: "北京市西城区第一实验小学", address: "北京市西城区西直门外大街", features: ["重点小学"], tags: [] },
            { name: "北京市西城区中古友谊小学", address: "北京市西城区月坛北街", features: ["国际交流"], tags: [] },
            { name: "北京师范大学附属实验中学（小学部）", address: "北京市西城区南新华街", features: ["师范附属"], tags: ["featured"] }
        ]
    },
    haidian: {
        name: "海淀区",
        intro: "海淀区是北京市科技教育大区，高校科研院所云集，基础教育水平全市领先。",
        middle: [
            { name: "人大附中", rank: 1, score: 640, address: "北京市海淀区中关村大街", features: ["市重点", "科技特长生", "全国知名"], tags: ["featured", "top-1"] },
            { name: "清华附中", rank: 2, score: 632, address: "北京市海淀区清华园", features: ["大学附中", "百年名校"], tags: ["featured", "top-2"] },
            { name: "北大附中", rank: 3, score: 628, address: "北京市海淀区燕园", features: ["大学附中", "全国重点"], tags: ["featured", "top-3"] },
            { name: "十一学校", rank: 4, score: 620, address: "北京市海淀区玉泉路", features: ["市重点", "素质教育"], tags: ["featured"] },
            { name: "首师大附中", rank: 5, score: null, address: "北京市海淀区北洼路", features: ["师范附属"], tags: [] },
            { name: "北京市第二十中学", rank: 6, score: null, address: "北京市海淀区清河", features: ["区重点"], tags: [] }
        ],
        primary: [
            { name: "人大附中（小学部）", address: "北京市海淀区中关村大街", features: ["九年一贯制", "重点学校"], tags: ["featured"] },
            { name: "清华附中（小学部）", address: "北京市海淀区清华园", features: ["大学附中"], tags: ["featured"] },
            { name: "北大附中（小学部）", address: "北京市海淀区燕园", features: ["大学附中"], tags: ["featured"] },
            { name: "中关村第一小学", address: "北京市海淀区中关村大街", features: ["重点小学", "科技特色"], tags: ["featured"] },
            { name: "北京市海淀区外国语实验学校（小学部）", address: "北京市海淀区西二旗", features: ["外语特色"], tags: ["new"] },
            { name: "首师大附属小学", address: "北京市海淀区通慧苑", features: ["师范附属"], tags: [] }
        ]
    },
    chaoyang: {
        name: "朝阳区",
        intro: "朝阳区是北京市面积最大的城区，教育资源丰富多样，重点学校众多。",
        middle: [
            { name: "北京八十中", rank: 1, score: 618, address: "北京市朝阳区望京开发区", features: ["市重点", "首批示范校"], tags: ["featured", "top-1"] },
            { name: "陈经纶中学", rank: 2, score: 612, address: "北京市朝阳区朝外大街", features: ["市重点", "体育特色"], tags: ["featured", "top-2"] },
            { name: "日坛中学", rank: 3, score: 605, address: "北京市朝阳区光华路", features: ["市重点", "国际部"], tags: ["featured", "top-3"] },
            { name: "北京市第十七中学", rank: 4, score: null, address: "北京市朝阳区东大桥", features: ["区重点"], tags: [] },
            { name: "北京市第九十四中学", rank: 5, score: null, address: "北京市朝阳区酒仙桥", features: ["区重点"], tags: [] }
        ],
        primary: [
            { name: "陈经纶中学（小学部）", address: "北京市朝阳区朝外大街", features: ["九年一贯制"], tags: ["featured"] },
            { name: "北京市朝阳区芳草地国际学校（小学部）", address: "北京市朝阳区日坛北路", features: ["国际学校", "外语特色"], tags: ["featured"] },
            { name: "北京市朝阳区白家庄小学", address: "北京市朝阳区白家庄路", features: ["重点小学"], tags: [] },
            { name: "北京市朝阳区实验小学", address: "北京市朝阳区左家庄", features: ["区重点"], tags: [] },
            { name: "北京市朝阳区安慧里中心小学", address: "北京市朝阳区安慧里", features: ["体育特色"], tags: [] }
        ]
    },
    fengtai: {
        name: "丰台区",
        intro: "丰台区是北京市南部城区，教育资源稳步提升，多所学校跻身市重点行列。",
        middle: [
            { name: "北京十二中", rank: 1, score: 610, address: "北京市丰台区丽泽路", features: ["市重点", "首批示范校"], tags: ["featured", "top-1"] },
            { name: "丰台二中", rank: 2, score: 602, address: "北京市丰台区丰台南路", features: ["市重点"], tags: ["featured", "top-2"] },
            { name: "北京十八中", rank: 3, score: null, address: "北京市丰台区方庄地区", features: ["市重点"], tags: ["featured", "top-3"] },
            { name: "北京市第二十中学丰台分校", rank: 4, score: null, address: "北京市丰台区西局地区", features: ["分校资源"], tags: [] },
            { name: "北京市丰台区第二中学", rank: 5, score: null, address: "北京市丰台区卢沟桥地区", features: ["区重点"], tags: [] }
        ],
        primary: [
            { name: "北京十二中（小学部）", address: "北京市丰台区丽泽路", features: ["九年一贯制"], tags: ["featured"] },
            { name: "北京市丰台区第一小学", address: "北京市丰台区丰台镇", features: ["重点小学"], tags: [] },
            { name: "北京市丰台区实验小学", address: "北京市丰台区方庄地区", features: ["区重点"], tags: [] },
            { name: "北京市丰台区南苑小学", address: "北京市丰台区南苑地区", features: [] },
            { name: "北京市丰台区西局小学", address: "北京市丰台区西局地区", features: [] }
        ]
    },
    shijingshan: {
        name: "石景山区",
        intro: "石景山区是北京市西部城区，教育资源均衡发展，集团化办学成效显著。",
        middle: [
            { name: "北京市京源学校", rank: 1, score: 614, address: "北京市石景山区鲁谷大街", features: ["九年一贯制", "龙头学校"], tags: ["featured", "top-1"] },
            { name: "北京景山学校远洋分校", rank: 2, score: 608, address: "北京市石景山区远洋山水小区", features: ["合作办学", "教学质量优异"], tags: ["featured", "top-2"] },
            { name: "北京教育科学研究院附属石景山实验学校", rank: 3, score: null, address: "北京市石景山区八大处地区", features: ["教科院附属", "创新教育"], tags: ["featured", "top-3"] },
            { name: "北京大学附属中学石景山学校", rank: 4, score: 607, address: "北京市石景山区杨庄地区", features: ["北大附中", "优质资源"], tags: ["featured"] },
            { name: "人大附中石景山学校", rank: 5, score: null, address: "北京市石景山区西部", features: ["人大附中", "优质资源"], tags: ["featured"] }
        ],
        primary: [
            { name: "北京市京源学校（小学部）", address: "北京市石景山区鲁谷大街", features: ["九年一贯制", "龙头学校"], tags: ["featured"] },
            { name: "北京景山学校远洋分校（小学部）", address: "北京市石景山区远洋山水小区", features: ["九年一贯制"], tags: ["featured"] },
            { name: "北京市石景山区师范学校附属小学", address: "北京市石景山区永乐东区", features: ["历史悠久"], tags: [] },
            { name: "北京大学附属小学石景山学校", address: "北京市石景山区八大处", features: ["北大附小资源"], tags: ["featured"] },
            { name: "北京市黄城根小学石景山分校", address: "北京市石景山区金顶街地区", features: ["集团办学"], tags: ["featured"] }
        ]
    },
    tongzhou: {
        name: "通州区",
        intro: "通州区是北京市副中心所在地，教育资源快速提升，名校纷纷落户。",
        middle: [
            { name: "北京通州潞河中学", rank: 1, score: 605, address: "北京市通州区新华大街", features: ["百年名校", "市重点"], tags: ["featured", "top-1"] },
            { name: "人大附中通州分校", rank: 2, score: null, address: "北京市通州区运河核心区", features: ["分校资源", "新建校"], tags: ["featured", "top-2", "new"] },
            { name: "北京四中通州分校", rank: 3, score: null, address: "北京市通州区玉带河大街", features: ["分校资源"], tags: ["featured", "top-3"] },
            { name: "北京市第二中学通州分校", rank: 4, score: null, address: "北京市通州区梨园地区", features: ["分校"], tags: [] },
            { name: "北京市通州区第二中学", rank: 5, score: null, address: "北京市通州区张家湾镇", features: ["区重点"], tags: [] }
        ],
        primary: [
            { name: "北京通州潞河中学（小学部）", address: "北京市通州区新华大街", features: ["九年一贯制"], tags: ["featured"] },
            { name: "北京市通州区第一实验小学", address: "北京市通州区北苑地区", features: ["重点小学"], tags: [] },
            { name: "北京市通州区运河小学", address: "北京市通州区运河东大街", features: ["区重点"], tags: ["new"] },
            { name: "人大附中通州分校（小学部）", address: "北京市通州区运河核心区", features: ["分校资源"], tags: ["featured", "new"] },
            { name: "北京市通州区芙蓉小学", address: "北京市通州区芙蓉园", features: [] }
        ]
    },
    changping: {
        name: "昌平区",
        intro: "昌平区是北京市北部生态涵养区，教育资源不断完善，多所市级名校入驻。",
        middle: [
            { name: "北京昌平一中", rank: 1, score: 598, address: "北京市昌平区城北街道", features: ["市重点", "百年名校"], tags: ["featured", "top-1"] },
            { name: "北京师范大学昌平附属学校", rank: 2, score: null, address: "北京市昌平区沙河高教园", features: ["师范附属", "新建校"], tags: ["featured", "top-2", "new"] },
            { name: "北京昌平二中", rank: 3, score: null, address: "北京市昌平区回龙观地区", features: ["区重点"], tags: ["top-3"] },
            { name: "北京市海淀区教师进修学校附属实验学校昌平分校", rank: 4, score: null, address: "北京市昌平区回龙观龙泽苑", features: ["分校资源"], tags: [] },
            { name: "北京市昌平区第三中学", rank: 5, score: null, address: "北京市昌平区阳坊镇", features: [], tags: [] }
        ],
        primary: [
            { name: "北京昌平一中（小学部）", address: "北京市昌平区城北街道", features: ["九年一贯制"], tags: ["featured"] },
            { name: "北京市昌平区第一实验小学", address: "北京市昌平区城北街道", features: ["重点小学"], tags: [] },
            { name: "北京市昌平区回龙观中心小学", address: "北京市昌平区回龙观镇", features: ["区重点"], tags: [] },
            { name: "北京师范大学昌平附属学校（小学部）", address: "北京市昌平区沙河高教园", features: ["师范附属"], tags: ["featured", "new"] },
            { name: "北京市昌平区天通苑北中心小学", address: "北京市昌平区天通苑北", features: [] }
        ]
    }
};

function createSchoolCard(school, isMiddle) {
    const rankClass = school.rank === 1 ? 'top-1' : school.rank === 2 ? 'top-2' : school.rank === 3 ? 'top-3' : '';
    const scoreHtml = school.score ? `<span class="school-score">中考录取分数线: ${school.score}分</span>` : '';
    
    let tagsHtml = '';
    if (school.tags && school.tags.length > 0) {
        const displayTags = school.tags.filter(t => t === 'featured' || t === 'new');
        if (displayTags.length > 0) {
            tagsHtml = '<div class="school-tags">';
            displayTags.forEach(tag => {
                const tagText = tag === 'featured' ? '重点学校' : tag === 'new' ? '新建学校' : '';
                const tagClass = tag === 'featured' ? 'featured' : tag === 'new' ? 'new' : '';
                if (tagText) {
                    tagsHtml += `<span class="tag ${tagClass}">${tagText}</span>`;
                }
            });
            tagsHtml += '</div>';
        }
    }

    let featuresHtml = '';
    if (school.features && school.features.length > 0) {
        featuresHtml = '<div class="school-features">' + school.features.map(f => `<span class="tag">${f}</span>`).join('') + '</div>';
    }

    return `
        <div class="school-card">
            <div class="school-header">
                <div class="school-name">${school.name}</div>
                ${isMiddle && school.rank ? `<span class="school-rank ${rankClass}">排名第${school.rank}</span>` : ''}
            </div>
            ${scoreHtml}
            <div class="school-info">
                <div class="info-item">
                    <strong>📍 地址:</strong>
                    <span>${school.address}</span>
                </div>
                ${featuresHtml}
            </div>
            ${tagsHtml}
        </div>
    `;
}

function renderDistrictTab(areaId, name, isActive) {
    const activeClass = isActive ? ' active' : '';
    return `<button class="tab-btn${activeClass}" data-area="${areaId}">${name}</button>`;
}

function renderDistrictSection(areaId, district, isActive) {
    const activeClass = isActive ? ' active' : '';
    const middleHtml = district.middle.map(s => createSchoolCard(s, true)).join('');
    const primaryHtml = district.primary.map(s => createSchoolCard(s, false)).join('');
    
    return `
        <div id="${areaId}" class="school-section${activeClass}">
            <h2>📍 ${district.name}</h2>
            <div class="section-intro">
                <p>${district.intro}</p>
            </div>
            
            <h3>中学排名</h3>
            <div class="school-list middle-list">${middleHtml}</div>

            <h3>小学名单</h3>
            <div class="school-list primary-list">${primaryHtml}</div>
        </div>
    `;
}

function initPage() {
    const tabsContainer = document.getElementById('area-tabs');
    const contentContainer = document.getElementById('content-area');
    
    const areaIds = Object.keys(districtData);
    let firstArea = areaIds[0];
    
    tabsContainer.innerHTML = areaIds.map((id, index) => 
        renderDistrictTab(id, districtData[id].name, index === 0)
    ).join('');
    
    contentContainer.innerHTML = areaIds.map((id, index) => 
        renderDistrictSection(id, districtData[id], index === 0)
    ).join('');
    
    updateStatistics();
    initTabs();
}

function updateStatistics() {
    let totalMiddle = 0;
    let totalPrimary = 0;
    const districtCount = Object.keys(districtData).length;

    Object.keys(districtData).forEach(area => {
        totalMiddle += districtData[area].middle.length;
        totalPrimary += districtData[area].primary.length;
    });

    document.getElementById('total-schools').textContent = totalMiddle + totalPrimary;
    document.getElementById('total-middle').textContent = totalMiddle;
    document.getElementById('total-primary').textContent = totalPrimary;
    document.getElementById('total-districts').textContent = districtCount;
}

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.school-section');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const area = btn.getAttribute('data-area');

            tabBtns.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            btn.classList.add('active');
            const targetSection = document.getElementById(area);
            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initPage();
});
