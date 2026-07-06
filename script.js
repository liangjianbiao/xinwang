// 导航栏功能
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // 初始化所有页面功能
    initTestPage();
    initNewsPage();
    initTreeholePage();
    initGamesPage();
});

// 心理测试页面功能
function initTestPage() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // 更新标签状态
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // 过滤测试项目
            const testItems = document.querySelectorAll('.test-item');
            testItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// 测试弹窗功能
let currentTest = null;
let currentQuestion = 0;
let answers = [];

const testQuestions = {
    mbti: {
        title: 'MBTI性格测试',
        questions: [
            { q: '你更倾向于？', options: ['独处充电', '社交获取能量'] },
            { q: '你做决定时更依赖？', options: ['逻辑分析', '情感感受'] },
            { q: '你更喜欢？', options: ['计划好的事情', '灵活变化'] },
            { q: '你关注的重点是？', options: ['具体事实', '抽象概念'] },
            { q: '你通常是？', options: ['有组织有条理', '随性而为'] },
            { q: '你如何处理压力？', options: ['独自思考', '与人倾诉'] },
            { q: '你学习新东西时？', options: ['注重细节', '把握整体'] },
            { q: '你更喜欢的工作方式是？', options: ['独立完成', '团队合作'] },
            { q: '你是？', options: ['早起的鸟', '夜猫子'] },
            { q: '你表达自己时？', options: ['直接坦率', '委婉含蓄'] }
        ],
        result: 'INTJ'
    },
    enneagram: {
        title: '九型人格测试',
        questions: [
            { q: '你最看重的是？', options: ['成就', '和谐', '自由'] },
            { q: '你害怕的是？', options: ['失败', '冲突', '约束'] },
            { q: '你通常是？', options: ['乐于助人', '追求完美', '自信果断'] },
            { q: '你面对问题时？', options: ['积极解决', '寻求帮助', '冷静分析'] },
            { q: '你更喜欢？', options: ['成为焦点', '默默奉献', '独立思考'] }
        ],
        result: '完美型'
    },
    love: {
        title: '爱情匹配度测试',
        questions: [
            { q: '你理想的约会是？', options: ['浪漫晚餐', '户外探险', '宅家看电影'] },
            { q: '你认为爱情最重要的是？', options: ['信任', '激情', '默契'] },
            { q: '你表达爱意的方式是？', options: ['言语表达', '实际行动', '默默关心'] },
            { q: '吵架后你会？', options: ['主动道歉', '等待对方', '冷静沟通'] },
            { q: '你喜欢的伴侣类型是？', options: ['成熟稳重', '活泼开朗', '温柔体贴'] }
        ],
        result: '灵魂伴侣型'
    },
    career: {
        title: '职业性格测试',
        questions: [
            { q: '你更喜欢的工作环境？', options: ['安静独立', '团队协作', '充满挑战'] },
            { q: '你追求的职业目标是？', options: ['稳定安逸', '成就事业', '自由创意'] },
            { q: '你擅长的是？', options: ['逻辑分析', '人际交往', '创意设计'] },
            { q: '你做决策时？', options: ['数据驱动', '直觉判断', '多方咨询'] },
            { q: '你喜欢的工作节奏？', options: ['规律稳定', '快速变化', '灵活自主'] }
        ],
        result: '创意型'
    },
    eq: {
        title: '情商测试',
        questions: [
            { q: '你能识别自己的情绪吗？', options: ['总是能', '大多数时候', '偶尔'] },
            { q: '别人难过时你会？', options: ['主动安慰', '默默陪伴', '不知所措'] },
            { q: '你处理负面情绪的方式是？', options: ['自我调节', '与人倾诉', '转移注意力'] },
            { q: '你能理解他人的感受吗？', options: ['很容易', '需要努力', '比较困难'] },
            { q: '你会表达自己的情绪吗？', options: ['坦诚表达', '选择性表达', '隐藏情绪'] }
        ],
        result: '高情商'
    },
    color: {
        title: '色彩心理测试',
        questions: [
            { q: '你最喜欢的颜色是？', options: ['红色', '蓝色', '绿色', '黄色'] },
            { q: '你觉得哪种颜色最能代表你？', options: ['热情的红色', '冷静的蓝色', '自然的绿色'] },
            { q: '你会用什么颜色装饰房间？', options: ['温暖的橙色', '清新的绿色', '宁静的蓝色'] }
        ],
        result: '蓝色性格'
    },
    dream: {
        title: '梦境解析测试',
        questions: [
            { q: '你最近常做的梦是？', options: ['飞翔', '坠落', '被追赶', '迷路'] },
            { q: '你的梦里通常是？', options: ['明亮的', '黑暗的', '模糊的'] },
            { q: '你记得梦里的细节吗？', options: ['非常清楚', '部分记得', '完全不记得'] }
        ],
        result: '自由飞翔型'
    },
    stress: {
        title: '压力水平测试',
        questions: [
            { q: '你最近睡眠质量如何？', options: ['很好', '一般', '很差'] },
            { q: '你感到焦虑的频率是？', options: ['很少', '有时', '经常'] },
            { q: '你能放松自己吗？', options: ['很容易', '需要努力', '很难'] },
            { q: '你觉得压力主要来自？', options: ['工作', '家庭', '人际关系'] },
            { q: '你有时间做喜欢的事吗？', options: ['经常', '偶尔', '几乎没有'] }
        ],
        result: '轻度压力'
    }
};

function startTest(testId) {
    currentTest = testId;
    currentQuestion = 0;
    answers = [];
    
    const test = testQuestions[testId];
    document.getElementById('testTitle').textContent = test.title;
    showQuestion();
    
    document.getElementById('testModal').style.display = 'flex';
}

function showQuestion() {
    const test = testQuestions[currentTest];
    const question = test.questions[currentQuestion];
    
    document.getElementById('questionNumber').textContent = `${currentQuestion + 1}/${test.questions.length}`;
    document.getElementById('questionText').textContent = question.q;
    
    const progress = ((currentQuestion + 1) / test.questions.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    
    // 清空选项
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    // 添加选项
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', function() {
            selectOption(index);
        });
        optionsContainer.appendChild(button);
    });
    
    // 更新按钮状态
    document.querySelector('.modal-footer .btn-secondary').disabled = currentQuestion === 0;
}

function selectOption(index) {
    // 移除所有选中状态
    document.querySelectorAll('.options-container button').forEach(btn => btn.classList.remove('selected'));
    
    // 添加选中状态
    document.querySelectorAll('.options-container button')[index].classList.add('selected');
    
    // 保存答案
    answers[currentQuestion] = index;
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
        
        // 恢复之前的选择
        if (answers[currentQuestion] !== undefined) {
            document.querySelectorAll('.options-container button')[answers[currentQuestion]].classList.add('selected');
        }
    }
}

function nextQuestion() {
    // 检查是否选择了答案
    if (answers[currentQuestion] === undefined) {
        alert('请选择一个答案');
        return;
    }
    
    if (currentQuestion < testQuestions[currentTest].questions.length - 1) {
        currentQuestion++;
        showQuestion();
        
        // 恢复之前的选择
        if (answers[currentQuestion] !== undefined) {
            document.querySelectorAll('.options-container button')[answers[currentQuestion]].classList.add('selected');
        }
    } else {
        // 显示结果
        showResult();
    }
}

function showResult() {
    document.getElementById('testModal').style.display = 'none';
    
    const resultType = testQuestions[currentTest].result;
    document.getElementById('resultType').textContent = resultType;
    
    const descriptions = {
        'INTJ': '你是INTJ型人格，具有战略眼光和独立思考能力，善于分析和规划，是天生的领导者。',
        '完美型': '你是完美型人格，追求卓越，注重细节，有强烈的责任感和使命感。',
        '灵魂伴侣型': '你是灵魂伴侣型，重视情感连接，寻求深度关系，相信真爱。',
        '创意型': '你是创意型职业性格，富有想象力，喜欢创新，适合艺术、设计等领域。',
        '高情商': '你的情商很高，善于理解他人，能够很好地管理自己的情绪。',
        '蓝色性格': '你是蓝色性格，冷静、理性、善于思考，追求稳定和安全感。',
        '自由飞翔型': '你的梦境反映出你内心渴望自由和探索，具有冒险精神。',
        '轻度压力': '你目前处于轻度压力状态，适当放松和调整即可恢复平衡。'
    };
    
    const traits = {
        'INTJ': ['战略思维', '独立思考', '目标导向', '理性分析'],
        '完美型': ['追求完美', '责任心强', '注重细节', '自律严谨'],
        '灵魂伴侣型': ['情感丰富', '善解人意', '忠诚专一', '浪漫感性'],
        '创意型': ['富有创意', '想象力丰富', '不拘一格', '勇于尝试'],
        '高情商': ['善解人意', '情绪稳定', '沟通能力强', '同理心强'],
        '蓝色性格': ['冷静理性', '深思熟虑', '追求稳定', '善于分析'],
        '自由飞翔型': ['热爱自由', '勇于探索', '乐观积极', '富有梦想'],
        '轻度压力': ['状态良好', '压力适中', '需要放松', '保持平衡']
    };
    
    document.getElementById('resultDescription').textContent = descriptions[resultType] || '测试完成！';
    
    const traitsList = document.getElementById('traitsList');
    traitsList.innerHTML = '';
    (traits[resultType] || []).forEach(trait => {
        const li = document.createElement('li');
        li.textContent = trait;
        traitsList.appendChild(li);
    });
    
    document.getElementById('resultModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('testModal').style.display = 'none';
}

function closeResultModal() {
    document.getElementById('resultModal').style.display = 'none';
}

// 资讯页面功能
function initNewsPage() {
    const newsCategories = document.querySelectorAll('.news-category');
    
    newsCategories.forEach(category => {
        category.addEventListener('click', function() {
            const cat = this.getAttribute('data-category');
            
            // 更新标签状态
            newsCategories.forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            // 过滤资讯
            const newsItems = document.querySelectorAll('.news-item');
            newsItems.forEach(item => {
                if (cat === 'all' || item.getAttribute('data-category') === cat) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // 同时过滤热点资讯卡片
            const hotCards = document.querySelectorAll('.hot-news-card');
            hotCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (cat === 'all' || cardCategory === cat) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // 搜索功能
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.getElementById('newsSearch');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            performSearch();
        });
    }
    
    // 添加回车键搜索
    if (searchInput) {
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // 热点资讯卡片点击查看详情
    const hotNewsCards = document.querySelectorAll('.hot-news-card');
    hotNewsCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            showNewsDetail(title);
        });
    });
    
    // 资讯列表点击查看详情
    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            showNewsDetail(title);
        });
    });
}

function performSearch() {
    const searchText = document.getElementById('newsSearch').value.toLowerCase().trim();
    
    if (!searchText) {
        // 如果搜索框为空，显示所有内容
        document.querySelectorAll('.news-item').forEach(item => {
            item.style.display = 'block';
        });
        document.querySelectorAll('.hot-news-card').forEach(card => {
            card.style.display = 'block';
        });
        return;
    }
    
    // 搜索资讯列表
    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach(item => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        const desc = item.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchText) || desc.includes(searchText)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    
    // 搜索热点资讯
    const hotCards = document.querySelectorAll('.hot-news-card');
    hotCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const desc = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchText) || desc.includes(searchText)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// 资讯详情数据
const newsDetails = {
    '如何缓解职场压力：专家给出5个实用建议': {
        title: '如何缓解职场压力：专家给出5个实用建议',
        category: '心理健康',
        views: '12,345',
        date: '2026-06-23',
        content: `职场压力已成为现代人普遍面临的问题，长期处于高压状态会对身心健康造成严重影响。为此，我们采访了心理学专家张明教授，他给出了以下5个实用建议：

1. **时间管理**：合理规划工作时间，避免过度加班。学会说"不"，拒绝超出能力范围的任务。

2. **运动放松**：每天保持30分钟的有氧运动，可以有效释放压力激素，改善情绪。

3. **正念冥想**：每天花10-15分钟进行冥想练习，帮助大脑放松，提高专注力。

4. **社交支持**：与家人朋友保持良好沟通，寻求情感支持，不要独自承受压力。

5. **兴趣爱好**：培养工作之外的兴趣爱好，让身心得到真正的放松。

张教授强调，职场压力管理是一项长期的能力，需要持续练习和自我觉察。当压力影响到日常生活时，应及时寻求专业心理咨询帮助。`
    },
    '正念冥想的科学益处：改变大脑结构': {
        title: '正念冥想的科学益处：改变大脑结构',
        category: '心理学',
        views: '8,765',
        date: '2026-06-22',
        content: `越来越多的研究证明冥想对身心健康有益。最新的神经科学研究发现，长期坚持正念冥想可以改变大脑结构。

研究表明，持续8周的正念冥想训练可以：
- 增加海马体体积，改善记忆力
- 减少杏仁核活动，降低焦虑水平
- 增强前额叶皮层功能，提升专注力

这项研究由哈佛大学医学院主导，对200名参与者进行了为期三个月的跟踪调查。结果显示，坚持冥想的参与者在情绪调节、压力应对和认知能力方面都有显著提升。

专家建议，初学者可以从每天5分钟开始，逐渐增加到15-20分钟。关键在于坚持，而不是追求完美的冥想体验。`
    },
    '建立健康的人际关系：沟通是关键': {
        title: '建立健康的人际关系：沟通是关键',
        category: '情感关系',
        views: '6,543',
        date: '2026-06-21',
        content: `人际关系是影响幸福感的重要因素。良好的人际关系可以提供情感支持，促进个人成长。

建立健康人际关系的关键在于有效沟通：

1. **积极倾听**：真正倾听对方的需求和感受，而不仅仅是等待说话的机会。

2. **表达感受**：用"我"语句表达自己的感受，避免指责对方。

3. **尊重边界**：尊重他人的个人空间和界限，同时也要清晰表达自己的边界。

4. **非暴力沟通**：采用观察、感受、需要、请求的模式进行沟通。

5. **学会道歉和原谅**：关系中难免会有冲突，学会真诚道歉和宽容原谅是维系关系的重要能力。

心理咨询师建议，定期与伴侣、朋友进行深度沟通，可以有效预防关系问题的发生。`
    },
    '数字时代的心理健康：如何保护自己': {
        title: '数字时代的心理健康：如何保护自己',
        category: '生活方式',
        views: '9,876',
        date: '2026-06-20',
        content: `在数字时代，我们每天都被海量信息包围。社交媒体、短视频、新闻推送等无时无刻不在影响着我们的心理状态。

以下是保护数字心理健康的几个建议：

1. **设定屏幕时间限制**：使用手机设置功能，限制每天使用社交媒体的时间。

2. **关注积极内容**：减少关注引发焦虑的新闻和负面内容，关注积极向上的信息源。

3. **数字排毒**：定期进行数字排毒，比如每周选择一天不使用社交媒体。

4. **保持现实连接**：不要让线上社交取代现实中的人际关系，定期与朋友面对面交流。

5. **保护隐私**：注意个人信息安全，避免过度分享个人生活。

心理健康专家提醒，数字工具是为我们服务的，不要让自己成为技术的奴隶。保持适度和平衡是关键。`
    },
    '青少年心理健康：家长应该知道的事': {
        title: '青少年心理健康：家长应该知道的事',
        category: '心理健康',
        views: '15,234',
        date: '2026-06-19',
        content: `青少年时期是心理发展的关键阶段，家长的正确引导对孩子的心理健康至关重要。

家长需要关注的几个方面：

1. **情绪变化**：注意孩子的情绪波动，及时发现异常行为。

2. **沟通方式**：建立开放的沟通渠道，让孩子愿意分享自己的感受。

3. **学业压力**：关注孩子的学习压力，帮助他们建立合理的期望。

4. **社交关系**：了解孩子的交友情况，引导他们建立健康的同伴关系。

5. **网络安全**：教育孩子正确使用网络，防范网络欺凌和不良信息。

专家建议，家长应定期与孩子进行深度交流，关注他们的心理需求，而不仅仅是学业成绩。当发现孩子出现持续的情绪问题时，应及时寻求专业帮助。`
    },
    '心理学研究：积极心态的力量': {
        title: '心理学研究：积极心态的力量',
        category: '心理学',
        views: '7,654',
        date: '2026-06-18',
        content: `积极心理学研究发现，拥有积极心态的人更容易获得成功和幸福感。

积极心态的好处包括：
- 增强免疫力，减少疾病
- 提高抗压能力
- 改善人际关系
- 提升创造力和生产力

培养积极心态的方法：
1. **感恩练习**：每天记录3件值得感恩的事情
2. **正向思考**：遇到困难时寻找积极的一面
3. **自我肯定**：用积极的语言鼓励自己
4. **帮助他人**：通过帮助他人获得成就感

研究表明，通过简单的日常练习，每个人都可以培养更积极的心态，从而改善生活质量。`
    },
    '如何处理负面情绪：实用技巧分享': {
        title: '如何处理负面情绪：实用技巧分享',
        category: '心理健康',
        views: '11,234',
        date: '2026-06-17',
        content: `每个人都会遇到负面情绪，关键是如何健康地处理它们。以下是一些实用技巧：

1. **情绪识别**：首先要识别自己的情绪，给情绪命名。

2. **情绪表达**：找信任的朋友倾诉，或者通过写日记来表达。

3. **深呼吸练习**：通过深呼吸来平复情绪，激活副交感神经系统。

4. **转移注意力**：做一些能让自己专注的事情，比如听音乐、画画、运动等。

5. **认知重构**：挑战负面思维，用更客观的角度看待问题。

6. **寻求专业帮助**：当负面情绪持续影响生活时，不要犹豫寻求心理咨询。

记住，情绪没有好坏之分，重要的是如何健康地管理它们。`
    },
    '亲密关系中的心理需求：你了解多少': {
        title: '亲密关系中的心理需求：你了解多少',
        category: '情感关系',
        views: '8,234',
        date: '2026-06-16',
        content: `在亲密关系中，了解彼此的心理需求是维系关系的基础。

每个人都有以下基本心理需求：

1. **安全感**：感到被爱、被接纳、被珍视
2. **被理解**：希望自己的感受被伴侣理解
3. **尊重**：希望自己的意见和边界得到尊重
4. **陪伴**：需要高质量的相处时间
5. **成长**：希望在关系中共同成长

当这些需求得到满足时，关系会更加健康和稳定。反之，需求得不到满足可能导致关系问题。

专家建议，定期与伴侣沟通彼此的需求，是保持关系健康的关键。`
    }
};

function showNewsDetail(title) {
    const detail = newsDetails[title];
    if (!detail) {
        alert('该资讯详情正在更新中...');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'news-detail-modal';
    modal.innerHTML = `
        <div class="modal-content news-detail-content">
            <div class="modal-header">
                <span class="news-tag">${detail.category}</span>
                <span class="close-modal" onclick="closeNewsDetailModal()">&times;</span>
            </div>
            <div class="modal-body">
                <h2>${detail.title}</h2>
                <div class="news-detail-meta">
                    <span><i class="fas fa-eye"></i> ${detail.views}</span>
                    <span>${detail.date}</span>
                </div>
                <div class="news-detail-content">
                    ${detail.content.replace(/\n/g, '<br><br>')}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeNewsDetailModal()">关闭</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function closeNewsDetailModal() {
    const modal = document.querySelector('.news-detail-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// 情绪树洞页面功能
function initTreeholePage() {
    const moodFilters = document.querySelectorAll('.mood-filter');
    
    moodFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const mood = this.getAttribute('data-mood');
            
            // 更新标签状态
            moodFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');

            // 过滤帖子
            const posts = document.querySelectorAll('.treehole-post');
            posts.forEach(post => {
                if (mood === 'all' || post.getAttribute('data-mood') === mood) {
                    post.style.display = 'block';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    });
}

function showWriteModal() {
    document.getElementById('writeModal').style.display = 'flex';
    // 重置选择状态
    document.querySelectorAll('.mood-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelector('.write-content textarea').value = '';
}

function closeWriteModal() {
    document.getElementById('writeModal').style.display = 'none';
}

// 心情选择功能
document.addEventListener('DOMContentLoaded', function() {
    const moodOptions = document.querySelectorAll('.mood-option');
    moodOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 移除所有选择状态
            moodOptions.forEach(opt => opt.classList.remove('selected'));
            // 添加当前选择状态
            this.classList.add('selected');
        });
    });
});

function submitPost() {
    // 获取选择的心情
    const selectedMood = document.querySelector('.mood-option.selected');
    // 获取心事内容
    const content = document.querySelector('.write-content textarea').value.trim();
    
    // 验证输入
    if (!selectedMood) {
        alert('请选择你的心情');
        return;
    }
    
    if (!content) {
        alert('请写下你的心事');
        return;
    }
    
    const mood = selectedMood.getAttribute('data-mood');
    const moodEmojis = {
        happy: '😊',
        sad: '😢',
        angry: '😤',
        confused: '😕',
        lonely: '🥺'
    };
    
    const avatarEmojis = ['🌙', '⭐', '🌈', '🌊', '🔥', '🌸', '🍀', '❄️'];
    const randomAvatar = avatarEmojis[Math.floor(Math.random() * avatarEmojis.length)];
    
    // 创建新帖子
    const newPost = document.createElement('div');
    newPost.className = 'treehole-post';
    newPost.setAttribute('data-mood', mood);
    newPost.innerHTML = `
        <div class="post-header">
            <div class="post-avatar">${randomAvatar}</div>
            <div class="post-meta">
                <span class="post-author">匿名用户</span>
                <span class="post-time">刚刚</span>
                <span class="post-mood-tag">${moodEmojis[mood]} ${getMoodText(mood)}</span>
            </div>
        </div>
        <div class="post-content">
            <p>${content}</p>
        </div>
        <div class="post-actions">
            <button class="action-btn like-btn" onclick="toggleLike(this)">
                <i class="fas fa-heart"></i> <span>0</span>
            </button>
            <button class="action-btn comment-btn" onclick="toggleComments(this)">
                <i class="fas fa-comment"></i> <span>0</span>
            </button>
            <button class="action-btn share-btn">
                <i class="fas fa-share"></i>
            </button>
        </div>
        <div class="comments-section">
            <div class="comment-input">
                <input type="text" placeholder="写下你的安慰...">
                <button>发送</button>
            </div>
        </div>
    `;
    
    // 添加到页面顶部
    const postsContainer = document.getElementById('treeholePosts');
    postsContainer.insertBefore(newPost, postsContainer.firstChild);
    
    // 显示成功提示
    alert('心事已发布！感谢你的分享，这里是安全的树洞。');
    closeWriteModal();
}

function getMoodText(mood) {
    const moodTexts = {
        happy: '开心',
        sad: '难过',
        angry: '生气',
        confused: '迷茫',
        lonely: '孤独'
    };
    return moodTexts[mood] || '';
}

function toggleLike(btn) {
    btn.classList.toggle('liked');
    const count = parseInt(btn.querySelector('span').textContent);
    btn.querySelector('span').textContent = btn.classList.contains('liked') ? count + 1 : count - 1;
}

function toggleComments(btn) {
    const post = btn.closest('.treehole-post');
    const commentsSection = post.querySelector('.comments-section');
    commentsSection.classList.toggle('active');
}

// 小游戏页面功能
function initGamesPage() {
    const gameCategories = document.querySelectorAll('.category-tab');
    
    gameCategories.forEach(category => {
        category.addEventListener('click', function() {
            const cat = this.getAttribute('data-category');
            
            // 更新标签状态
            gameCategories.forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            // 过滤游戏
            const gameCards = document.querySelectorAll('.game-card');
            gameCards.forEach(card => {
                if (cat === 'all' || card.getAttribute('data-category') === cat) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function openGame(gameName) {
    const gamePaths = {
        '连线小游戏': '连线小游戏/index.html',
        '拼图': '拼图/index.html',
        '推箱子游戏': '推箱子游戏/index.html',
        '九格人格': '九格人格/index.html',
        '星屿微光': 'https://www.kanjl.com',
        '动感小球游戏': '动感小球游戏/maze-ball.html'
    };
    
    if (gamePaths[gameName]) {
        window.open(gamePaths[gameName], '_blank');
    } else {
        alert('该游戏即将上线，敬请期待！');
    }
}

function openMemoryGame() {
    alert('记忆翻牌游戏即将上线，敬请期待！');
}

// 咨询功能
function openConsultation() {
    const modal = document.createElement('div');
    modal.className = 'consultation-modal';
    modal.innerHTML = `
        <div class="modal-content consultation-content">
            <div class="modal-header">
                <h3>💬 在线咨询</h3>
                <span class="close-modal" onclick="closeConsultationModal()">&times;</span>
            </div>
            <div class="modal-body">
                <p>我们提供专业的心理咨询服务，点击下方选项查看详情：</p>
                <div class="consultation-options">
                    <div class="option-card" onclick="showConsultDetail('phone')">
                        <i class="fas fa-phone"></i>
                        <div>
                            <h4>电话咨询</h4>
                            <p>点击查看详情</p>
                            <span class="arrow">→</span>
                        </div>
                    </div>
                    <div class="option-card" onclick="showConsultDetail('online')">
                        <i class="fas fa-message-circle"></i>
                        <div>
                            <h4>在线客服</h4>
                            <p>点击查看详情</p>
                            <span class="arrow">→</span>
                        </div>
                    </div>
                    <div class="option-card" onclick="showConsultDetail('booking')">
                        <i class="fas fa-calendar"></i>
                        <div>
                            <h4>预约咨询</h4>
                            <p>点击查看详情</p>
                            <span class="arrow">→</span>
                        </div>
                    </div>
                </div>
                <div class="consult-detail" id="consultDetail">
                    <!-- 详情内容将动态插入这里 -->
                </div>
                <form class="consultation-form">
                    <h4>快速留言</h4>
                    <input type="text" placeholder="您的姓名" id="consultName">
                    <input type="text" placeholder="联系电话" id="consultPhone">
                    <textarea placeholder="您的问题或需求..." rows="3" id="consultMessage"></textarea>
                    <button type="button" class="btn btn-primary" onclick="submitConsultation()">提交咨询</button>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function showConsultDetail(type) {
    const detailDiv = document.getElementById('consultDetail');
    
    const details = {
        phone: `
            <div class="detail-header">
                <h4>📞 电话咨询</h4>
                <button class="close-detail" onclick="hideConsultDetail()">×</button>
            </div>
            <div class="detail-content">
                <p><strong>服务热线：</strong>400-123-4567</p>
                <p><strong>服务时间：</strong>每日 9:00-21:00</p>
                <p><strong>服务范围：</strong>情绪困扰、压力管理、人际关系、职业困惑等</p>
                <p><strong>咨询时长：</strong>每次约30分钟</p>
                <p><strong>服务特色：</strong>专业心理咨询师一对一服务，隐私保护</p>
                <button class="btn btn-primary mt-2" onclick="makeCall()">立即拨打</button>
            </div>
        `,
        online: `
            <div class="detail-header">
                <h4>💬 在线客服</h4>
                <button class="close-detail" onclick="hideConsultDetail()">×</button>
            </div>
            <div class="detail-content">
                <p><strong>服务方式：</strong>即时在线聊天</p>
                <p><strong>服务时间：</strong>每日 9:00-23:00</p>
                <p><strong>响应时间：</strong>平均5分钟内回复</p>
                <p><strong>服务范围：</strong>情感问题、心理困惑、压力疏导</p>
                <p><strong>服务特色：</strong>随时随地，隐私安全</p>
                <button class="btn btn-primary mt-2" onclick="startChat()">开始聊天</button>
            </div>
        `,
        booking: `
            <div class="detail-header">
                <h4>📅 预约咨询</h4>
                <button class="close-detail" onclick="hideConsultDetail()">×</button>
            </div>
            <div class="detail-content">
                <p><strong>服务方式：</strong>一对一视频/面对面咨询</p>
                <p><strong>预约时长：</strong>提前1-3天预约</p>
                <p><strong>咨询时长：</strong>每次60分钟</p>
                <p><strong>专家团队：</strong>资深心理咨询师，持证上岗</p>
                <p><strong>服务特色：</strong>深度沟通，个性化方案</p>
                <button class="btn btn-primary mt-2" onclick="bookConsult()">立即预约</button>
            </div>
        `
    };
    
    detailDiv.innerHTML = details[type];
    detailDiv.style.display = 'block';
}

function hideConsultDetail() {
    const detailDiv = document.getElementById('consultDetail');
    detailDiv.style.display = 'none';
}

function makeCall() {
    alert('正在拨打咨询热线：400-123-4567\n（实际应用中会调用手机拨号功能）');
}

function startChat() {
    alert('正在连接在线客服...\n（实际应用中会打开在线聊天窗口）');
}

function bookConsult() {
    alert('已跳转到预约页面...\n（实际应用中会打开预约表单）');
}

function closeConsultationModal() {
    const modal = document.querySelector('.consultation-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

function submitConsultation() {
    const name = document.getElementById('consultName').value;
    const phone = document.getElementById('consultPhone').value;
    const message = document.getElementById('consultMessage').value;
    
    if (!name || !phone) {
        alert('请填写姓名和联系电话');
        return;
    }
    
    alert('感谢您的咨询！我们会尽快与您联系。');
    closeConsultationModal();
}
