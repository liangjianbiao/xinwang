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
    },
    rizhu: {
        title: '60日柱抽象人设测试',
        questions: [
            { q: '面对新的环境，你通常会？', options: ['主动探索', '谨慎观察', '等待被引导'] },
            { q: '你的思维方式更偏向？', options: ['逻辑分析', '直觉感受', '感性联想'] },
            { q: '在团队中你更愿意扮演？', options: ['领导者', '协调者', '执行者'] },
            { q: '面对压力时，你倾向于？', options: ['迎难而上', '冷静思考', '寻求支持'] },
            { q: '你的情绪表达通常是？', options: ['直接外露', '含蓄内敛', '随机应变'] },
            { q: '做决定时你更依赖？', options: ['理性判断', '内心感受', '他人建议'] },
            { q: '你最看重的是？', options: ['事业成就', '人际关系', '自我实现'] },
            { q: '面对变化你的态度是？', options: ['拥抱变化', '谨慎适应', '倾向稳定'] },
            { q: '你的社交风格是？', options: ['热情外向', '温和友善', '独立内向'] },
            { q: '遇到挑战时你会？', options: ['积极迎战', '从容应对', '寻找捷径'] }
        ],
        result: '庚金日主'
    },
    persona16: {
        title: '16型人格测试',
        questions: [
            { q: '在聚会中你更倾向于？', options: ['主动与多人交谈', '与少数熟人深入交流'] },
            { q: '忙碌一周后，你更想？', options: ['约朋友外出放松', '独自在家休息充电'] },
            { q: '你更关注信息中的？', options: ['具体的事实和细节', '整体的趋势和可能性'] },
            { q: '学习新技能时你更喜欢？', options: ['按步骤循序渐进', '自己摸索理解全貌'] },
            { q: '做决定时你更看重？', options: ['客观逻辑和公平', '个人价值观和他人感受'] },
            { q: '面对朋友倾诉烦恼时你会？', options: ['帮TA分析问题找方案', '先共情安慰再慢慢聊'] },
            { q: '你的生活方式更接近？', options: ['提前计划按部就班', '灵活随性见机行事'] },
            { q: '面对截止日期你通常？', options: ['尽早完成避免拖延', '临近时更有灵感动力'] }
        ],
        result: 'INTJ'
    },
    ocean: {
        title: '大洋人格测试',
        questions: [
            { q: '面对新事物和新想法，你的态度是？', options: ['非常好奇，乐于尝试', '有兴趣但会观望', '比较谨慎', '喜欢熟悉的事物'] },
            { q: '你觉得做计划和遵守规则？', options: ['非常重要，严格执行', '比较重要，基本遵守', '看情况而定', '不太喜欢被约束'] },
            { q: '在社交场合你通常？', options: ['非常活跃，主动交流', '比较轻松，愿意互动', '话不多，但随和', '喜欢独处或小范围'] },
            { q: '遇到他人需要帮助时你会？', options: ['主动伸出援手', '愿意帮忙', '看情况', '先保护好自己'] },
            { q: '面对压力和挫折时？', options: ['经常感到焦虑不安', '有时候会情绪低落', '比较平静', '非常稳定，很少波动'] },
            { q: '你对艺术、音乐、文学的感受？', options: ['非常敏感，富有想象力', '有一定的欣赏能力', '一般般', '不太感兴趣'] },
            { q: '做事情时你倾向于？', options: ['有条不紊，精益求精', '比较认真负责', '过得去就行', '随心所欲'] },
            { q: '参加聚会或活动时？', options: ['精力充沛，非常享受', '比较开心，投入其中', '有点疲惫，还能应付', '觉得消耗精力'] },
            { q: '和别人意见不同时？', options: ['尽量理解和妥协', '愿意沟通和让步', '坚持自己的观点', '直接表达不妥协'] },
            { q: '你对自己的情绪变化？', options: ['很敏感，波动较大', '有波动，但能调节', '比较稳定', '几乎不受影响'] }
        ],
        result: '高开放性'
    },
    tarot: {
        title: '塔罗牌抽牌占卜',
        questions: [
            { q: '请为「过去」选择一张牌的数字：', options: ['1 - 魔术师', '2 - 女祭司', '3 - 皇后', '4 - 皇帝', '5 - 教皇', '6 - 恋人', '7 - 战车'] },
            { q: '请为「现在」选择一张牌的数字：', options: ['8 - 力量', '9 - 隐士', '10 - 命运之轮', '11 - 正义', '12 - 倒吊人', '13 - 死神', '14 - 节制'] },
            { q: '请为「未来」选择一张牌的数字：', options: ['15 - 恶魔', '16 - 高塔', '17 - 星星', '18 - 月亮', '19 - 太阳', '20 - 审判', '21 - 世界'] }
        ],
        result: '三张牌阵'
    }
};

function startTest(testId) {
    localStorage.removeItem('test_draft_' + testId);
    window.location.href = 'test-taking.html?test=' + testId;
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
    
    let resultType, description, traitsList;
    
    if (currentTest === 'rizhu') {
        // 60日柱抽象人设测试 - 根据答案生成动态结果
        const personalityType = analyzeRiZhuPersonality();
        resultType = personalityType.type;
        description = personalityType.description;
        traitsList = personalityType.traits;
    } else if (currentTest === 'persona16') {
        // 16型人格测试 - 根据四维答案动态计算
        const persona = analyze16Personalities();
        resultType = persona.type;
        description = persona.description;
        traitsList = persona.traits;
    } else if (currentTest === 'ocean') {
        // 大洋人格（大五人格）测试 - 五维度分析
        const ocean = analyzeOceanPersonality();
        resultType = ocean.type;
        description = ocean.description;
        traitsList = ocean.traits;
    } else if (currentTest === 'tarot') {
        // 塔罗牌占卜 - 三张牌解读
        const tarot = analyzeTarotReading();
        resultType = tarot.type;
        description = tarot.description;
        traitsList = tarot.traits;
    } else {
        resultType = testQuestions[currentTest].result;
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
        
        description = descriptions[resultType] || '测试完成！';
        traitsList = traits[resultType] || [];
    }
    
    document.getElementById('resultType').textContent = resultType;
    document.getElementById('resultDescription').textContent = description;
    
    const traitsListEl = document.getElementById('traitsList');
    traitsListEl.innerHTML = '';
    traitsList.forEach(trait => {
        const li = document.createElement('li');
        li.textContent = trait;
        traitsListEl.appendChild(li);
    });
    
    document.getElementById('resultModal').style.display = 'flex';
}

// 大洋人格（大五人格OCEAN）分析函数
function analyzeOceanPersonality() {
    // 五维度: O开放性(问题0,5), C尽责性(问题1,6), E外向性(问题2,7), A宜人性(问题3,8), N神经质(问题4,9)
    // 选项0=高分, 选项3=低分 (除了神经质反向计算)
    var O = 0, C = 0, E = 0, A = 0, N = 0;
    function optionToScore(opt) { return 3 - opt; } // 选项0->3分, 1->2, 2->1, 3->0

    O += optionToScore(answers[0]);
    O += optionToScore(answers[5]);
    C += optionToScore(answers[1]);
    C += optionToScore(answers[6]);
    E += optionToScore(answers[2]);
    E += optionToScore(answers[7]);
    A += optionToScore(answers[3]);
    A += optionToScore(answers[8]);
    N += (answers[4]);     // 神经质: 选项0->0, 选项1->1...(反向)
    N += (answers[9]);

    var scores = [
        { name: '开放性', key: 'O', value: O, desc: '富有想象力、好奇心强、追求新体验' },
        { name: '尽责性', key: 'C', value: C, desc: '有条理、可靠、自律、追求成就' },
        { name: '外向性', key: 'E', value: E, desc: '社交活跃、精力充沛、乐观开朗' },
        { name: '宜人性', key: 'A', value: A, desc: '友善、合作、信任他人、乐于助人' },
        { name: '神经质', key: 'N', value: N, desc: '情绪稳定度低、容易焦虑、敏感' }
    ];

    scores.sort(function(a, b) { return b.value - a.value; });
    var top = scores[0];
    var level = top.value >= 5 ? '高' : (top.value >= 3 ? '中' : '低');

    var typeLabels = {
        'O': { label: '探索者', desc: '你是"探索者"——充满好奇心和想象力的灵魂。你对艺术、美和新颖的想法有着天然的敏感度，内心世界丰富而多彩。你不满足于现状，总是在寻找新的体验和可能性，是团队中的创意源泉和开拓者。' },
        'C': { label: '成就者', desc: '你是"成就者"——严谨自律的实干家。你做事有条不紊，目标清晰，一旦下定决心就会坚持到底。你对自己和他人都有较高的要求，是值得信赖的伙伴和团队的中坚力量。' },
        'E': { label: '社交者', desc: '你是"社交者"——活力四射的人群之星。你在社交中如鱼得水，享受与人交流的乐趣，总是能给身边的人带来积极的能量。你乐观开朗，敢于表达自己，是天生的组织者和氛围营造者。' },
        'A': { label: '协调者', desc: '你是"协调者"——温暖包容的人际粘合剂。你善于倾听和理解他人，乐于帮助和付出，总能在冲突中找到平衡点。你真诚而友善，是朋友眼中最可靠的倾诉对象和团队的和谐使者。' },
        'N': { label: '敏感者', desc: '你是"敏感者"——细腻深邃的情绪感知者。你对自己和他人的情绪有着超乎常人的洞察力，内心世界丰富而深刻。你的敏感让你能感知到别人忽略的细节，是充满同理心和艺术天赋的灵魂。' }
    };

    var info = typeLabels[top.key];
    var traitMap = {
        'O': ['富有创意', '求知欲强', '思维开放', '艺术敏感', '乐于尝试'],
        'C': ['自律严谨', '目标坚定', '有条有理', '责任心强', '追求卓越'],
        'E': ['热情外向', '善于社交', '精力充沛', '乐观积极', '表达力强'],
        'A': ['友善包容', '乐于助人', '善解人意', '信任他人', '合作精神'],
        'N': ['情感细腻', '直觉敏锐', '艺术天赋', '共情力强', '深度思考']
    };

    // 生成五维度得分概要
    var dimInfo = scores.map(function(s) {
        var lv = s.value >= 5 ? '高' : (s.value >= 3 ? '中' : '低');
        return s.name + ':' + lv;
    }).join(' · ');

    return {
        type: level + top.name + '型 · ' + info.label,
        description: info.desc + ' 【维度画像】' + dimInfo + '。',
        traits: traitMap[top.key]
    };
}

// 塔罗牌占卜分析函数
function analyzeTarotReading() {
    // 22张大阿卡纳牌数据
    var majorArcana = {
        0: { name: '愚者', nameEn: 'The Fool', meaning: '冒险、新的开始、纯真、无限可能', advice: '勇敢迈出第一步，保持天真和好奇心' },
        1: { name: '魔术师', nameEn: 'The Magician', meaning: '创造力、意志力、技能、行动', advice: '运用你的天赋和资源，将想法付诸行动' },
        2: { name: '女祭司', nameEn: 'The High Priestess', meaning: '直觉、潜意识、智慧、神秘', advice: '倾听内心的声音，相信你的直觉' },
        3: { name: '皇后', nameEn: 'The Empress', meaning: '丰饶、母性、创造力、滋养', advice: '照顾好自己和他人，让爱与美生长' },
        4: { name: '皇帝', nameEn: 'The Emperor', meaning: '权威、稳定、结构、领导力', advice: '建立秩序和规则，用理性和坚定前进' },
        5: { name: '教皇', nameEn: 'The Hierophant', meaning: '传统、信仰、教导、指引', advice: '寻找智慧的指引，尊重传统但不盲从' },
        6: { name: '恋人', nameEn: 'The Lovers', meaning: '爱、关系、选择、和谐', advice: '跟随内心做真实的选择，在关系中成长' },
        7: { name: '战车', nameEn: 'The Chariot', meaning: '意志、胜利、掌控、前进', advice: '坚定目标，用意志力掌控局面' },
        8: { name: '力量', nameEn: 'Strength', meaning: '勇气、耐心、柔软的力量、内在力量', advice: '以柔克刚，用温柔和耐心面对挑战' },
        9: { name: '隐士', nameEn: 'The Hermit', meaning: '内省、独处、智慧、指引', advice: '给自己独处的时间，在静心中找到答案' },
        10: { name: '命运之轮', nameEn: 'Wheel of Fortune', meaning: '变化、循环、命运、转折点', advice: '顺应变化，把握机会，相信生命的节奏' },
        11: { name: '正义', nameEn: 'Justice', meaning: '公正、真相、平衡、因果', advice: '用理性和公平做决定，为自己的选择负责' },
        12: { name: '倒吊人', nameEn: 'The Hanged Man', meaning: '暂停、换个角度、牺牲、放下', advice: '放慢脚步，换个视角看待问题' },
        13: { name: '死神', nameEn: 'Death', meaning: '结束、转变、重生、蜕变', advice: '放下不再适合你的，迎接新的开始' },
        14: { name: '节制', nameEn: 'Temperance', meaning: '平衡、调和、耐心、适度', advice: '寻找平衡，循序渐进，保持内心和谐' },
        15: { name: '恶魔', nameEn: 'The Devil', meaning: '束缚、欲望、诱惑、阴影', advice: '觉察束缚你的模式，释放限制性信念' },
        16: { name: '高塔', nameEn: 'The Tower', meaning: '突变、崩塌、觉醒、解放', advice: '接受突如其来的变化，破后而立' },
        17: { name: '星星', nameEn: 'The Star', meaning: '希望、灵感、治愈、指引', advice: '保持希望，相信光明就在前方' },
        18: { name: '月亮', nameEn: 'The Moon', meaning: '幻觉、潜意识、恐惧、直觉', advice: '面对内心的恐惧，看清真相而非幻象' },
        19: { name: '太阳', nameEn: 'The Sun', meaning: '喜悦、活力、成功、光明', advice: '享受当下的快乐，展现真实的自己' },
        20: { name: '审判', nameEn: 'Judgement', meaning: '觉醒、重生、召唤、宽恕', advice: '回应内心的召唤，放下过去重新出发' },
        21: { name: '世界', nameEn: 'The World', meaning: '完成、圆满、整合、成就', advice: '庆祝你的成就，你已完成一个重要的循环' }
    };

    // 答案索引对应问题1选项索引: 0->1牌, 1->2牌...6->7牌 (过去)
    // 问题2答案: 0->8牌, 1->9牌...6->14牌 (现在)
    // 问题3答案: 0->15牌, 1->16牌...6->21牌 (未来)
    var pastIdx = answers[0] + 1;      // 1~7
    var presentIdx = answers[1] + 8;   // 8~14
    var futureIdx = answers[2] + 15;   // 15~21

    var past = majorArcana[pastIdx];
    var present = majorArcana[presentIdx];
    var future = majorArcana[futureIdx];

    var description =
        '【过去】「' + past.name + '」 — ' + past.meaning + '。\n' +
        '过去的你经历了「' + past.name + '」所代表的课题：' + past.advice + '。这些经历塑造了现在的你。\n\n' +
        '【现在】「' + present.name + '」 — ' + present.meaning + '。\n' +
        '此刻你正处于「' + present.name + '」的能量中：' + present.advice + '。请正视当下的局面。\n\n' +
        '【未来】「' + future.name + '」 — ' + future.meaning + '。\n' +
        '未来的方向由「' + future.name + '」指引：' + future.advice + '。带着这份觉察前行吧。';

    return {
        type: '过去' + past.name + ' · 现在' + present.name + ' · 未来' + future.name,
        description: description,
        traits: [past.name + ': ' + past.meaning, present.name + ': ' + present.meaning, future.name + ': ' + future.meaning]
    };
}

// 16型人格分析函数
function analyze16Personalities() {
    // 四个维度：E/I, S/N, T/F, J/P
    // 问题1-2: E/I, 问题3-4: S/N, 问题5-6: T/F, 问题7-8: J/P
    // 选项0 = 第一个字母, 选项1 = 第二个字母
    var eiScore = 0, snScore = 0, tfScore = 0, jpScore = 0;

    if (answers[0] === 0) eiScore++; else eiScore--;
    if (answers[1] === 0) eiScore++; else eiScore--;
    if (answers[2] === 0) snScore++; else snScore--;
    if (answers[3] === 0) snScore++; else snScore--;
    if (answers[4] === 0) tfScore++; else tfScore--;
    if (answers[5] === 0) tfScore++; else tfScore--;
    if (answers[6] === 0) jpScore++; else jpScore--;
    if (answers[7] === 0) jpScore++; else jpScore--;

    var type = '';
    type += eiScore >= 0 ? 'E' : 'I';
    type += snScore >= 0 ? 'S' : 'N';
    type += tfScore >= 0 ? 'T' : 'F';
    type += jpScore >= 0 ? 'J' : 'P';

    var personaData = {
        'INTJ': {
            type: 'INTJ 建筑师',
            description: '你是INTJ型人格——"建筑师"。你拥有深邃的战略眼光和独立思考能力，善于将抽象的愿景转化为可执行的计划。你追求效率和完美，对自己和他人都有极高的标准。内心世界丰富而独立，是天生的战略家。',
            traits: ['战略思维', '独立自主', '目标坚定', '理性决策', '追求卓越']
        },
        'INTP': {
            type: 'INTP 逻辑学家',
            description: '你是INTP型人格——"逻辑学家"。你对知识有着近乎痴迷的渴求，喜欢探究事物的底层原理。思维敏捷而灵活，擅长发现别人忽略的逻辑漏洞。你享受独立思考的过程，追求思想的深度和精确性。',
            traits: ['逻辑严密', '好奇心强', '独立思考', '客观分析', '创新思维']
        },
        'ENTJ': {
            type: 'ENTJ 指挥官',
            description: '你是ENTJ型人格——"指挥官"。天生的领导者，拥有强大的意志力和组织能力。你善于发现机会并迅速行动，能够将混乱转化为秩序。你的目标清晰、执行力强，天生适合带领团队冲锋陷阵。',
            traits: ['领导力强', '果断高效', '战略视野', '组织能力', '目标导向']
        },
        'ENTP': {
            type: 'ENTP 辩论家',
            description: '你是ENTP型人格——"辩论家"。聪明而富有创造力的思考者，喜欢挑战传统观念和既定规则。你思维跳跃，善于从多角度分析问题，享受智力交锋的乐趣。对新想法充满热情，是天生的创新者。',
            traits: ['思维敏捷', '善于辩论', '创新精神', '适应力强', '充满好奇']
        },
        'INFJ': {
            type: 'INFJ 提倡者',
            description: '你是INFJ型人格——"提倡者"。安静而神秘，拥有深刻的洞察力和同理心。你能够感知他人的情感和需求，对人性有着独特的理解。内心有坚定的理想和价值观，默默地为改变世界而努力。',
            traits: ['洞察力强', '理想主义', '同理心深', '坚定信念', '静默奉献']
        },
        'INFP': {
            type: 'INFP 调停者',
            description: '你是INFP型人格——"调停者"。温柔而理想主义的诗意灵魂，对美和真理有着执着的追求。你拥有丰富的内心世界和创造力，对他人充满关爱和包容。始终忠于自己的价值观，渴望让世界变得更美好。',
            traits: ['理想主义', '富有创意', '善解人意', '忠于内心', '温柔包容']
        },
        'ENFJ': {
            type: 'ENFJ 主人公',
            description: '你是ENFJ型人格——"主人公"。富有感染力的天生的领袖和引导者，善于激发他人的潜能。你拥有强烈的使命感，关心他人的成长和幸福。善于沟通和协调，能够让团队凝聚在一起朝共同目标前进。',
            traits: ['感染力强', '善于引导', '关怀他人', '沟通高手', '使命感强']
        },
        'ENFP': {
            type: 'ENFP 竞选者',
            description: '你是ENFP型人格——"竞选者"。热情洋溢的自由灵魂，对生活充满无限好奇和热爱。你富有创造力和想象力，善于发现事物之间的联系。你的热情和乐观能够感染身边的每一个人，是人群中的阳光。',
            traits: ['热情洋溢', '创意丰富', '善于社交', '乐观开朗', '自由随性']
        },
        'ISTJ': {
            type: 'ISTJ 物流师',
            description: '你是ISTJ型人格——"物流师"。稳重而可靠的实干家，做事一丝不苟，重视事实和秩序。你拥有强烈的责任感和使命感，是值得信赖的伙伴。尊重传统和规则，用实际行动证明自己的价值。',
            traits: ['稳重可靠', '责任心强', '注重细节', '尊重秩序', '脚踏实地']
        },
        'ISFJ': {
            type: 'ISFJ 守护者',
            description: '你是ISFJ型人格——"守护者"。温暖而体贴的守护者，默默关心身边每一个人。你拥有出色的记忆力和观察力，能够注意到别人忽略的细节。忠诚而有耐心，是家人和朋友最可靠的依靠。',
            traits: ['温暖体贴', '忠诚可靠', '注重细节', '耐心细致', '默默奉献']
        },
        'ESTJ': {
            type: 'ESTJ 总经理',
            description: '你是ESTJ型人格——"总经理"。务实而高效的组织者，善于管理人员和资源。你重视秩序和传统，做事有条理有计划。天生的管理者，能够将复杂的事务安排得井井有条，确保目标按时达成。',
            traits: ['高效务实', '组织力强', '果断坚定', '重视秩序', '管理天赋']
        },
        'ESFJ': {
            type: 'ESFJ 执政官',
            description: '你是ESFJ型人格——"执政官"。热心的社交达人，善于营造和谐的氛围。你极其关注他人的需求，乐于提供帮助和支持。重视传统和社会规范，是群体中的粘合剂，让每个人都感到被重视和关爱。',
            traits: ['热心助人', '善于社交', '注重和谐', '责任心强', '体贴入微']
        },
        'ISTP': {
            type: 'ISTP 鉴赏家',
            description: '你是ISTP型人格——"鉴赏家"。冷静而灵活的实践者，善于动手解决实际问题。你对工具和机械有天然的亲和力，喜欢拆解和探索事物的运作方式。思维敏捷，在紧急情况下能保持冷静并迅速应对。',
            traits: ['冷静理性', '动手能力强', '灵活应变', '善于分析', '独立自主']
        },
        'ISFP': {
            type: 'ISFP 探险家',
            description: '你是ISFP型人格——"探险家"。安静而敏感的艺术家，对美和和谐有着天然的感知力。你活在当下，享受生活中的每一刻。不喜欢冲突和压力，追求自由和真实，用自己的方式表达内心的丰富世界。',
            traits: ['艺术气质', '敏感细腻', '追求自由', '活在当下', '温和随性']
        },
        'ESTP': {
            type: 'ESTP 企业家',
            description: '你是ESTP型人格——"企业家"。精力充沛的行动派，喜欢冒险和挑战。你思维敏捷，善于在现实中快速做出判断。不喜欢空谈理论，更愿意通过行动来解决问题。天生的谈判高手和风险承担者。',
            traits: ['行动力强', '善于应变', '冒险精神', '思维敏捷', '务实灵活']
        },
        'ESFP': {
            type: 'ESFP 表演者',
            description: '你是ESFP型人格——"表演者"。热情而迷人的活力源泉，善于活跃气氛和感染他人。你享受聚光灯下的感觉，热爱社交和娱乐。对美和时尚有敏锐的感知，追求快乐和刺激，让身边的人也感到生活的美好。',
            traits: ['热情迷人', '善于表演', '活力四射', '审美敏锐', '享受当下']
        }
    };

    return personaData[type] || personaData['INTJ'];
}

// 60日柱抽象人设分析函数
function analyzeRiZhuPersonality() {
    // 计算各维度得分
    let metalScore = 0, waterScore = 0, woodScore = 0, fireScore = 0, earthScore = 0;
    let yangScore = 0, yinScore = 0;
    
    // 问题1: 面对新环境
    if (answers[0] === 0) { metalScore += 2; yangScore += 1; } // 主动探索
    else if (answers[0] === 1) { waterScore += 2; yinScore += 1; } // 谨慎观察
    else { earthScore += 1; } // 等待被引导
    
    // 问题2: 思维方式
    if (answers[1] === 0) { metalScore += 2; } // 逻辑分析
    else if (answers[1] === 1) { woodScore += 2; } // 直觉感受
    else { fireScore += 1; } // 感性联想
    
    // 问题3: 团队角色
    if (answers[2] === 0) { fireScore += 2; yangScore += 2; } // 领导者
    else if (answers[2] === 1) { waterScore += 1; earthScore += 1; } // 协调者
    else { metalScore += 1; } // 执行者
    
    // 问题4: 面对压力
    if (answers[3] === 0) { metalScore += 2; yangScore += 1; } // 迎难而上
    else if (answers[3] === 1) { waterScore += 2; yinScore += 1; } // 冷静思考
    else { earthScore += 1; } // 寻求支持
    
    // 问题5: 情绪表达
    if (answers[4] === 0) { fireScore += 2; yangScore += 1; } // 直接外露
    else if (answers[4] === 1) { waterScore += 2; yinScore += 1; } // 含蓄内敛
    else { woodScore += 1; } // 随机应变
    
    // 问题6: 做决定
    if (answers[5] === 0) { metalScore += 2; } // 理性判断
    else if (answers[5] === 1) { fireScore += 1; woodScore += 1; } // 内心感受
    else { earthScore += 1; waterScore += 1; } // 他人建议
    
    // 问题7: 最看重
    if (answers[6] === 0) { metalScore += 1; fireScore += 1; } // 事业成就
    else if (answers[6] === 1) { waterScore += 1; woodScore += 1; } // 人际关系
    else { earthScore += 1; } // 自我实现
    
    // 问题8: 面对变化
    if (answers[7] === 0) { woodScore += 2; yangScore += 1; } // 拥抱变化
    else if (answers[7] === 1) { fireScore += 1; } // 谨慎适应
    else { earthScore += 2; yinScore += 1; } // 倾向稳定
    
    // 问题9: 社交风格
    if (answers[8] === 0) { fireScore += 2; yangScore += 1; } // 热情外向
    else if (answers[8] === 1) { earthScore += 1; woodScore += 1; } // 温和友善
    else { waterScore += 2; yinScore += 1; } // 独立内向
    
    // 问题10: 遇到挑战
    if (answers[9] === 0) { metalScore += 2; yangScore += 1; } // 积极迎战
    else if (answers[9] === 1) { waterScore += 2; } // 从容应对
    else { woodScore += 1; fireScore += 1; } // 寻找捷径
    
    // 找出五行最高分
    const elements = [
        { name: '金', score: metalScore },
        { name: '水', score: waterScore },
        { name: '木', score: woodScore },
        { name: '火', score: fireScore },
        { name: '土', score: earthScore }
    ];
    elements.sort((a, b) => b.score - a.score);
    const dominantElement = elements[0].name;
    
    // 确定阴阳属性
    const isYang = yangScore >= yinScore;
    
    // 映射到日柱
    const rizhuMap = {
        '金_阳': { type: '庚金日主', stem: '庚金', description: '你如庚金般刚毅果断，有着强烈的意志力和执行力。庚金是刀剑之金，代表勇敢、果决和领导力。你做事干脆利落，不惧挑战，在困难面前反而更加坚强。你的抽象人格像是一座坚固的金属堡垒，外表冷硬，内心却有炙热的情感。', traits: ['刚毅果断', '领导力强', '不畏挑战', '意志坚定', '行事果决'] },
        '金_阴': { type: '辛金日主', stem: '辛金', description: '你如辛金般精致敏锐，有着细腻的感受力和追求完美的倾向。辛金是珠玉之金，代表精致、优雅和艺术气质。你对细节有着超乎常人的敏感度，追求品质和美感。你的抽象人格像是一件精心雕琢的艺术品，外表温婉，内心有着对完美的执着。', traits: ['精致敏锐', '追求完美', '艺术气质', '注重细节', '优雅得体'] },
        '水_阳': { type: '壬水日主', stem: '壬水', description: '你如壬水般聪明灵动，有着广阔的思维和适应能力。壬水是江河之水，代表智慧、变通和胸怀。你善于思考和规划，能够灵活应对各种情况。你的抽象人格像是奔涌的江河，充满活力和智慧，能包容万物。', traits: ['聪明灵动', '善于规划', '灵活应变', '胸怀宽广', '智慧过人'] },
        '水_阴': { type: '癸水日主', stem: '癸水', description: '你如癸水般细腻深沉，有着敏锐的直觉和深厚的情感。癸水是雨露之水，代表温柔、包容和感知力。你能够感知他人的情绪，具有极强的共情能力。你的抽象人格像是深邃的湖泊，表面平静，内心蕴含无尽的智慧和情感。', traits: ['细腻深沉', '直觉敏锐', '共情力强', '包容温柔', '感知丰富'] },
        '木_阳': { type: '甲木日主', stem: '甲木', description: '你如甲木般正直挺拔，有着坚定的信念和远大的志向。甲木是栋梁之木，代表正直、进取和领导力。你有着清晰的价值观，做事有原则，能够承担责任。你的抽象人格像是参天大树，根深叶茂，能够庇护他人。', traits: ['正直挺拔', '信念坚定', '进取向上', '有原则性', '能担重任'] },
        '木_阴': { type: '乙木日主', stem: '乙木', description: '你如乙木般柔韧灵活，有着温和的性格和艺术的天赋。乙木是花草藤萝，代表柔韧、适应和美感。你能够在各种环境中生长，具有艺术气质和审美能力。你的抽象人格像是优美的藤蔓，柔韧而富有生命力，能够攀附任何支撑。', traits: ['柔韧灵活', '温和友善', '艺术天赋', '适应力强', '富有美感'] },
        '火_阳': { type: '丙火日主', stem: '丙火', description: '你如丙火般热情开朗，有着充沛的能量和感染力。丙火是太阳之火，代表热情、光明和领导力。你能够温暖他人，具有强大的感染力和号召力。你的抽象人格像是灿烂的太阳，光芒四射，能够照亮周围的世界。', traits: ['热情开朗', '能量充沛', '感染力强', '光明磊落', '富有号召力'] },
        '火_阴': { type: '丁火日主', stem: '丁火', description: '你如丁火般温柔细腻，有着丰富的情感和艺术的灵感。丁火是灯烛之火，代表温柔、灵感和文化气质。你善于表达情感，具有丰富的想象力和创造力。你的抽象人格像是温暖的烛光，虽不耀眼，却能温暖人心，具有独特的魅力。', traits: ['温柔细腻', '情感丰富', '富有灵感', '文化气质', '温暖人心'] },
        '土_阳': { type: '戊土日主', stem: '戊土', description: '你如戊土般稳重踏实，有着可靠的品质和坚定的信念。戊土是高山厚土，代表稳重、诚实和包容力。你做事脚踏实地，值得信赖，能够承担重任。你的抽象人格像是巍峨的山岳，稳固可靠，能够承受任何压力。', traits: ['稳重踏实', '诚实可靠', '包容力强', '脚踏实地', '值得信赖'] },
        '土_阴': { type: '己土日主', stem: '己土', description: '你如己土般包容含蓄，有着细腻的情感和服务的精神。己土是田园之土，代表包容、含蓄和奉献。你善于照顾他人，具有服务精神和耐心。你的抽象人格像是肥沃的土壤，能够孕育万物，默默付出而不求回报。', traits: ['包容含蓄', '善解人意', '服务精神', '耐心细致', '默默奉献'] }
    };
    
    const key = `${dominantElement}_${isYang ? '阳' : '阴'}`;
    return rizhuMap[key] || rizhuMap['金_阳'];
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
        item.addEventListener('click', function(e) {
            const link = this.querySelector('a');
            if (link && link.getAttribute('href')) {
                e.preventDefault();
                window.open(link.getAttribute('href'), '_blank');
                return;
            }
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
    },
    '焦虑症的常见症状及应对方法': {
        title: '焦虑症的常见症状及应对方法',
        category: '心理健康',
        views: '5,432',
        date: '2026-06-20',
        content: `焦虑症是一种常见的心理障碍，了解其症状和应对方法对于及时干预至关重要。

**焦虑症的常见症状：**

1. **持续的担忧**：过度担心日常生活中的各种事情，无法控制。

2. **身体症状**：心跳加速、呼吸急促、出汗、发抖、头晕、胃部不适等。

3. **注意力困难**：难以集中注意力，思维总是被焦虑占据。

4. **睡眠问题**：难以入睡、易醒或做噩梦。

5. **回避行为**：避免触发焦虑的场景或活动。

**应对方法：**

1. **寻求专业帮助**：心理咨询师可以帮助识别焦虑的根源，并提供有效的应对策略。

2. **认知行为疗法**：学习识别和改变导致焦虑的思维模式。

3. **放松技巧**：深呼吸、冥想、渐进式肌肉放松等。

4. **规律运动**：有氧运动可以有效减轻焦虑症状。

5. **健康生活方式**：保证充足睡眠、均衡饮食、减少咖啡因和酒精摄入。

如果您或您身边的人出现上述症状，建议及时寻求专业心理帮助。`
    },
    '认知行为疗法：改变思维模式的有效工具': {
        title: '认知行为疗法：改变思维模式的有效工具',
        category: '心理学',
        views: '4,321',
        date: '2026-06-19',
        content: `认知行为疗法（CBT）是一种经过验证的心理治疗方法，帮助人们识别和改变负面思维模式。

**CBT的核心原理：**

我们的情绪和行为不是由事件本身引起的，而是由我们对事件的看法和解释引起的。

**CBT的主要技术：**

1. **认知重构**：识别并挑战不合理的思维模式，用更客观、理性的思维替代。

2. **暴露疗法**：逐渐面对恐惧的事物或场景，减少回避行为。

3. **行为激活**：通过积极的行为改变来改善情绪状态。

4. **正念训练**：培养对当下的觉察，减少焦虑和抑郁。

**CBT的应用范围：**

- 焦虑症、抑郁症
- 社交恐惧症、强迫症
- 创伤后应激障碍
- 饮食障碍、成瘾问题

大量研究表明，CBT是治疗多种心理障碍的有效方法，具有短期见效、疗效持久的特点。`
    },
    '如何处理恋爱中的矛盾与冲突': {
        title: '如何处理恋爱中的矛盾与冲突',
        category: '情感关系',
        views: '3,210',
        date: '2026-06-18',
        content: `恋爱关系中难免会出现矛盾，学会正确处理冲突是维持健康关系的关键。

**处理冲突的原则：**

1. **保持冷静**：避免在情绪激动时争吵，给自己和对方一些时间冷静。

2. **倾听对方**：真正倾听对方的感受和需求，不要急于反驳。

3. **表达自己**：用"我"语句表达自己的感受，避免指责对方。

4. **寻找共同点**：关注双方的共同目标，而不是分歧。

5. **寻求妥协**：双方都做出一些让步，找到双方都能接受的解决方案。

**常见冲突类型及应对：**

- **沟通问题**：定期进行深度沟通，建立良好的沟通习惯。
- **家务分工**：明确责任分工，公平分配家务。
- **金钱观念**：坦诚讨论财务状况，制定共同的理财计划。
- **家庭关系**：设定边界，平衡伴侣和家庭的关系。

**记住：** 冲突不是坏事，它是关系成长的机会。关键在于如何建设性地处理冲突。`
    },
    '打造心理健康的生活习惯': {
        title: '打造心理健康的生活习惯',
        category: '生活方式',
        views: '2,109',
        date: '2026-06-17',
        content: `良好的生活习惯对心理健康至关重要，从日常小事做起，培养积极健康的生活方式。

**心理健康的生活习惯：**

1. **规律作息**：保证充足的睡眠，建立规律的作息时间。

2. **均衡饮食**：多吃蔬菜水果、全谷物，减少加工食品和糖的摄入。

3. **适度运动**：每周进行150分钟的中等强度有氧运动。

4. **保持社交**：与家人朋友保持良好的联系，定期见面交流。

5. **培养兴趣**：发展工作之外的兴趣爱好，丰富生活。

6. **学习放松**：每天花10-15分钟进行冥想或深呼吸练习。

7. **设定边界**：学会拒绝，保护自己的时间和精力。

8. **自我关怀**：定期做一些让自己快乐的事情，善待自己。

**小技巧：**

- 每天早上起床后做5分钟拉伸运动
- 每天睡前写3件值得感恩的事情
- 每周安排一次与朋友的聚会

从今天开始，培养一个新的健康习惯吧！`
    },
    '抑郁症的早期识别与预防': {
        title: '抑郁症的早期识别与预防',
        category: '心理健康',
        views: '7,890',
        date: '2026-06-16',
        content: `抑郁症是一种严重的心理疾病，但早期识别和干预可以显著提高康复率。

**抑郁症的早期症状：**

1. **情绪低落**：持续的悲伤、空虚感，对任何事情提不起兴趣。

2. **精力下降**：感到疲惫不堪，即使休息后也无法恢复。

3. **睡眠改变**：失眠或过度睡眠。

4. **食欲改变**：食欲减退或暴饮暴食。

5. **注意力不集中**：难以集中注意力，记忆力下降。

6. **自责自罪**：过度自责，觉得自己毫无价值。

7. **自杀念头**：出现死亡或自杀的想法。

**预防措施：**

1. **保持社交联系**：不要孤立自己，与他人保持良好的关系。

2. **规律运动**：运动可以有效改善情绪。

3. **健康生活方式**：保证充足睡眠、均衡饮食。

4. **学会应对压力**：培养有效的压力管理技巧。

5. **关注情绪变化**：及时发现情绪异常，寻求帮助。

**重要提示：** 如果您或您身边的人出现以上症状，特别是持续超过两周，请及时寻求专业心理帮助。`
    },
    '积极心理学：培养乐观心态的技巧': {
        title: '积极心理学：培养乐观心态的技巧',
        category: '心理学',
        views: '6,789',
        date: '2026-06-15',
        content: `积极心理学研究如何培养积极情绪和乐观心态，帮助人们更好地应对生活挑战。

**乐观心态的好处：**

- 增强心理韧性，更好地应对挫折
- 改善身体健康，延长寿命
- 提升人际关系质量
- 提高工作效率和创造力

**培养乐观心态的技巧：**

1. **感恩日记**：每天记录3件值得感恩的事情，培养感恩之心。

2. **正向思考**：遇到困难时，寻找积极的一面和成长的机会。

3. **自我肯定**：用积极的语言鼓励自己，关注自己的优点和成就。

4. **帮助他人**：通过帮助他人获得成就感和幸福感。

5. **享受当下**：学会欣赏生活中的小美好，活在当下。

6. **设定目标**：设定合理的目标，逐步实现，增强自信心。

7. **保持学习**：不断学习新知识，保持好奇心和新鲜感。

**练习建议：**

每天早上起床后，对着镜子说一句积极的话；每天晚上睡前，回想今天发生的一件开心的事情。

记住，乐观不是天生的，而是可以通过练习培养的！`
    }
};

function showNewsDetail(title) {
    const detail = newsDetails[title];
    if (!detail) {
        const newWindow = window.open('', '_blank');
        newWindow.document.write(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: 'Microsoft YaHei', sans-serif; background: #f5f7fa; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        .container { text-align: center; padding: 40px; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); max-width: 600px; }
        h1 { color: #333; margin-bottom: 20px; }
        p { color: #666; font-size: 16px; line-height: 1.8; }
        .back-btn { display: inline-block; margin-top: 30px; padding: 12px 30px; background: #e91e63; color: white; text-decoration: none; border-radius: 25px; transition: background 0.3s; }
        .back-btn:hover { background: #c2185b; }
        .icon { font-size: 64px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">📝</div>
        <h1>${title}</h1>
        <p>该资讯详情正在更新中...</p>
        <p>感谢您的关注，我们正在努力完善相关内容，敬请期待！</p>
        <a href="${window.location.href}" class="back-btn">返回资讯列表</a>
    </div>
</body>
</html>`);
        newWindow.document.close();
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
        '连线小游戏': '连线小游戏/line-connect.html',
        '拼图': '拼图/jigsaw-puzzle.html',
        '推箱子游戏': '推箱子游戏/push-box.html',
        '九格人格': '九格人格/enneagram-test.html',
        '星屿微光': 'https://www.kanjl.com',
        '动感小球游戏': '动感小球游戏/maze-ball.html',
        '记忆翻牌游戏': '记忆翻牌游戏/memory-cards.html',
        '魔塔游戏': '魔塔游戏/magic-tower.html'
    };
    
    if (gamePaths[gameName]) {
        window.open(gamePaths[gameName], '_blank');
    } else {
        alert('该游戏即将上线，敬请期待！');
    }
}

function toggleBGM() {
    const bgmPlayer = document.getElementById('bgm-player');
    const bgmBtn = document.getElementById('bgm-toggle');
    const icon = bgmBtn.querySelector('i');
    
    if (!bgmPlayer) return;
    
    if (bgmPlayer.paused) {
        bgmPlayer.volume = 0.3;
        bgmPlayer.play().then(() => {
            icon.className = 'fas fa-volume-up';
            bgmBtn.classList.add('playing');
        }).catch(e => {
            console.log('BGM play failed:', e);
        });
    } else {
        bgmPlayer.pause();
        icon.className = 'fas fa-music';
        bgmBtn.classList.remove('playing');
    }
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
