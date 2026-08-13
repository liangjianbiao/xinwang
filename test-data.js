// 心理测试数据 - 供 test-taking.html 和 test-result.html 共享
// 包含所有题目和结果分析函数

const TEST_QUESTIONS = {
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

// 基础结果描述
const BASIC_DESCRIPTIONS = {
    'INTJ': '你是INTJ型人格，具有战略眼光和独立思考能力，善于分析和规划，是天生的领导者。',
    '完美型': '你是完美型人格，追求卓越，注重细节，有强烈的责任感和使命感。',
    '灵魂伴侣型': '你是灵魂伴侣型，重视情感连接，寻求深度关系，相信真爱。',
    '创意型': '你是创意型职业性格，富有想象力，喜欢创新，适合艺术、设计等领域。',
    '高情商': '你的情商很高，善于理解他人，能够很好地管理自己的情绪。',
    '蓝色性格': '你是蓝色性格，冷静、理性、善于思考，追求稳定和安全感。',
    '自由飞翔型': '你的梦境反映出你内心渴望自由和探索，具有冒险精神。',
    '轻度压力': '你目前处于轻度压力状态，适当放松和调整即可恢复平衡。'
};

const BASIC_TRAITS = {
    'INTJ': ['战略思维', '独立思考', '目标导向', '理性分析'],
    '完美型': ['追求完美', '责任心强', '注重细节', '自律严谨'],
    '灵魂伴侣型': ['情感丰富', '善解人意', '忠诚专一', '浪漫感性'],
    '创意型': ['富有创意', '想象力丰富', '不拘一格', '勇于尝试'],
    '高情商': ['善解人意', '情绪稳定', '沟通能力强', '同理心强'],
    '蓝色性格': ['冷静理性', '深思熟虑', '追求稳定', '善于分析'],
    '自由飞翔型': ['热爱自由', '勇于探索', '乐观积极', '富有梦想'],
    '轻度压力': ['状态良好', '压力适中', '需要放松', '保持平衡']
};

// 通用结果生成函数
function generateBasicResult(testId, answersArr) {
    var resultType = TEST_QUESTIONS[testId].result;
    return {
        type: resultType,
        description: BASIC_DESCRIPTIONS[resultType] || '测试完成！',
        traits: BASIC_TRAITS[resultType] || []
    };
}

// 大洋人格分析
function analyzeOcean(answersArr) {
    var O = 0, C = 0, E = 0, A = 0, N = 0;
    function score(opt) { return 3 - opt; }
    O += score(answersArr[0]) + score(answersArr[5]);
    C += score(answersArr[1]) + score(answersArr[6]);
    E += score(answersArr[2]) + score(answersArr[7]);
    A += score(answersArr[3]) + score(answersArr[8]);
    N += (answersArr[4]) + (answersArr[9]);

    var scores = [
        { name: '开放性', key: 'O', value: O },
        { name: '尽责性', key: 'C', value: C },
        { name: '外向性', key: 'E', value: E },
        { name: '宜人性', key: 'A', value: A },
        { name: '神经质', key: 'N', value: N }
    ];
    scores.sort(function(a, b) { return b.value - a.value; });
    var top = scores[0];
    var level = top.value >= 5 ? '高' : (top.value >= 3 ? '中' : '低');

    var typeLabels = {
        'O': { label: '探索者', desc: '你是"探索者"——充满好奇心和想象力的灵魂。你对艺术、美和新颖的想法有着天然的敏感度，内心世界丰富而多彩。' },
        'C': { label: '成就者', desc: '你是"成就者"——严谨自律的实干家。你做事有条不紊，目标清晰，一旦下定决心就会坚持到底。' },
        'E': { label: '社交者', desc: '你是"社交者"——活力四射的人群之星。你在社交中如鱼得水，享受与人交流的乐趣，总能给身边的人带来积极能量。' },
        'A': { label: '协调者', desc: '你是"协调者"——温暖包容的人际粘合剂。你善于倾听和理解他人，乐于帮助和付出，总能在冲突中找到平衡点。' },
        'N': { label: '敏感者', desc: '你是"敏感者"——细腻深邃的情绪感知者。你对自己和他人的情绪有着超乎常人的洞察力，内心世界丰富而深刻。' }
    };
    var info = typeLabels[top.key];
    var traitMap = {
        'O': ['富有创意', '求知欲强', '思维开放', '艺术敏感', '乐于尝试'],
        'C': ['自律严谨', '目标坚定', '有条有理', '责任心强', '追求卓越'],
        'E': ['热情外向', '善于社交', '精力充沛', '乐观积极', '表达力强'],
        'A': ['友善包容', '乐于助人', '善解人意', '信任他人', '合作精神'],
        'N': ['情感细腻', '直觉敏锐', '艺术天赋', '共情力强', '深度思考']
    };
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

// 16型人格分析
function analyze16Personality(answersArr) {
    var ei = 0, sn = 0, tf = 0, jp = 0;
    for (var i = 0; i < 2; i++) { ei += answersArr[i] === 0 ? 1 : -1; }
    for (var i = 2; i < 4; i++) { sn += answersArr[i] === 0 ? 1 : -1; }
    for (var i = 4; i < 6; i++) { tf += answersArr[i] === 0 ? 1 : -1; }
    for (var i = 6; i < 8; i++) { jp += answersArr[i] === 0 ? 1 : -1; }

    var type = (ei >= 0 ? 'E' : 'I') + (sn >= 0 ? 'S' : 'N') + (tf >= 0 ? 'T' : 'F') + (jp >= 0 ? 'J' : 'P');

    var data = {
        'INTJ': { type: 'INTJ 建筑师', description: '你是INTJ型人格——"建筑师"。你拥有深邃的战略眼光和独立思考能力，善于将抽象的愿景转化为可执行的计划。', traits: ['战略思维', '独立自主', '目标坚定', '理性决策', '追求卓越'] },
        'INTP': { type: 'INTP 逻辑学家', description: '你是INTP型人格——"逻辑学家"。你对知识有着近乎痴迷的渴求，喜欢探究事物的底层原理。', traits: ['逻辑严密', '好奇心强', '独立思考', '客观分析', '创新思维'] },
        'ENTJ': { type: 'ENTJ 指挥官', description: '你是ENTJ型人格——"指挥官"。天生的领导者，拥有强大的意志力和组织能力。', traits: ['领导力强', '果断高效', '战略视野', '组织能力', '目标导向'] },
        'ENTP': { type: 'ENTP 辩论家', description: '你是ENTP型人格——"辩论家"。聪明而富有创造力的思考者，喜欢挑战传统观念和既定规则。', traits: ['思维敏捷', '善于辩论', '创新精神', '适应力强', '充满好奇'] },
        'INFJ': { type: 'INFJ 提倡者', description: '你是INFJ型人格——"提倡者"。安静而神秘，拥有深刻的洞察力和同理心。', traits: ['洞察力强', '理想主义', '同理心深', '坚定信念', '静默奉献'] },
        'INFP': { type: 'INFP 调停者', description: '你是INFP型人格——"调停者"。温柔而理想主义的诗意灵魂，对美和真理有着执着的追求。', traits: ['理想主义', '富有创意', '善解人意', '忠于内心', '温柔包容'] },
        'ENFJ': { type: 'ENFJ 主人公', description: '你是ENFJ型人格——"主人公"。富有感染力的天生领袖和引导者，善于激发他人的潜能。', traits: ['感染力强', '善于引导', '关怀他人', '沟通高手', '使命感强'] },
        'ENFP': { type: 'ENFP 竞选者', description: '你是ENFP型人格——"竞选者"。热情洋溢的自由灵魂，对生活充满无限好奇和热爱。', traits: ['热情洋溢', '创意丰富', '善于社交', '乐观开朗', '自由随性'] },
        'ISTJ': { type: 'ISTJ 物流师', description: '你是ISTJ型人格——"物流师"。稳重而可靠的实干家，做事一丝不苟，重视事实和秩序。', traits: ['稳重可靠', '责任心强', '注重细节', '尊重秩序', '脚踏实地'] },
        'ISFJ': { type: 'ISFJ 守护者', description: '你是ISFJ型人格——"守护者"。温暖而体贴的守护者，默默关心身边每一个人。', traits: ['温暖体贴', '忠诚可靠', '注重细节', '耐心细致', '默默奉献'] },
        'ESTJ': { type: 'ESTJ 总经理', description: '你是ESTJ型人格——"总经理"。务实而高效的组织者，善于管理人员和资源。', traits: ['高效务实', '组织力强', '果断坚定', '重视秩序', '管理天赋'] },
        'ESFJ': { type: 'ESFJ 执政官', description: '你是ESFJ型人格——"执政官"。热心的社交达人，善于营造和谐的氛围。', traits: ['热心助人', '善于社交', '注重和谐', '责任心强', '体贴入微'] },
        'ISTP': { type: 'ISTP 鉴赏家', description: '你是ISTP型人格——"鉴赏家"。冷静而灵活的实践者，善于动手解决实际问题。', traits: ['冷静理性', '动手能力强', '灵活应变', '善于分析', '独立自主'] },
        'ISFP': { type: 'ISFP 探险家', description: '你是ISFP型人格——"探险家"。安静而敏感的艺术家，对美和和谐有着天然的感知力。', traits: ['艺术气质', '敏感细腻', '追求自由', '活在当下', '温和随性'] },
        'ESTP': { type: 'ESTP 企业家', description: '你是ESTP型人格——"企业家"。精力充沛的行动派，喜欢冒险和挑战。', traits: ['行动力强', '善于应变', '冒险精神', '思维敏捷', '务实灵活'] },
        'ESFP': { type: 'ESFP 表演者', description: '你是ESFP型人格——"表演者"。热情而迷人的活力源泉，善于活跃气氛和感染他人。', traits: ['热情迷人', '善于表演', '活力四射', '审美敏锐', '享受当下'] }
    };
    return data[type] || data['INTJ'];
}

// 塔罗牌分析
function analyzeTarot(answersArr) {
    var arcana = {
        0: { name: '愚者', meaning: '冒险、新的开始、纯真、无限可能', advice: '勇敢迈出第一步，保持天真和好奇心' },
        1: { name: '魔术师', meaning: '创造力、意志力、技能、行动', advice: '运用你的天赋和资源，将想法付诸行动' },
        2: { name: '女祭司', meaning: '直觉、潜意识、智慧、神秘', advice: '倾听内心的声音，相信你的直觉' },
        3: { name: '皇后', meaning: '丰饶、母性、创造力、滋养', advice: '照顾好自己和他人，让爱与美生长' },
        4: { name: '皇帝', meaning: '权威、稳定、结构、领导力', advice: '建立秩序和规则，用理性和坚定前进' },
        5: { name: '教皇', meaning: '传统、信仰、教导、指引', advice: '寻找智慧的指引，尊重传统但不盲从' },
        6: { name: '恋人', meaning: '爱、关系、选择、和谐', advice: '跟随内心做真实的选择，在关系中成长' },
        7: { name: '战车', meaning: '意志、胜利、掌控、前进', advice: '坚定目标，用意志力掌控局面' },
        8: { name: '力量', meaning: '勇气、耐心、柔软的力量', advice: '以柔克刚，用温柔和耐心面对挑战' },
        9: { name: '隐士', meaning: '内省、独处、智慧、指引', advice: '给自己独处的时间，在静心中找到答案' },
        10: { name: '命运之轮', meaning: '变化、循环、命运、转折点', advice: '顺应变化，把握机会，相信生命的节奏' },
        11: { name: '正义', meaning: '公正、真相、平衡、因果', advice: '用理性和公平做决定，为自己的选择负责' },
        12: { name: '倒吊人', meaning: '暂停、换个角度、牺牲、放下', advice: '放慢脚步，换个视角看待问题' },
        13: { name: '死神', meaning: '结束、转变、重生、蜕变', advice: '放下不再适合你的，迎接新的开始' },
        14: { name: '节制', meaning: '平衡、调和、耐心、适度', advice: '寻找平衡，循序渐进，保持内心和谐' },
        15: { name: '恶魔', meaning: '束缚、欲望、诱惑、阴影', advice: '觉察束缚你的模式，释放限制性信念' },
        16: { name: '高塔', meaning: '突变、崩塌、觉醒、解放', advice: '接受突如其来的变化，破后而立' },
        17: { name: '星星', meaning: '希望、灵感、治愈、指引', advice: '保持希望，相信光明就在前方' },
        18: { name: '月亮', meaning: '幻觉、潜意识、恐惧、直觉', advice: '面对内心的恐惧，看清真相而非幻象' },
        19: { name: '太阳', meaning: '喜悦、活力、成功、光明', advice: '享受当下的快乐，展现真实的自己' },
        20: { name: '审判', meaning: '觉醒、重生、召唤、宽恕', advice: '回应内心的召唤，放下过去重新出发' },
        21: { name: '世界', meaning: '完成、圆满、整合、成就', advice: '庆祝你的成就，你已完成一个重要的循环' }
    };
    var past = arcana[answersArr[0] + 1];
    var present = arcana[answersArr[1] + 8];
    var future = arcana[answersArr[2] + 15];

    return {
        type: '过去' + past.name + ' · 现在' + present.name + ' · 未来' + future.name,
        description: '【过去】「' + past.name + '」— ' + past.meaning + '。\n过去的你经历了「' + past.name + '」的课题：' + past.advice + '。\n\n【现在】「' + present.name + '」— ' + present.meaning + '。\n此刻你正处于「' + present.name + '」的能量中：' + present.advice + '。\n\n【未来】「' + future.name + '」— ' + future.meaning + '。\n未来的方向由「' + future.name + '」指引：' + future.advice + '。',
        traits: ['过去 · ' + past.name + ': ' + past.meaning, '现在 · ' + present.name + ': ' + present.meaning, '未来 · ' + future.name + ': ' + future.meaning]
    };
}

// 60日柱分析
function analyzeRiZhu(answersArr) {
    var metal = 0, water = 0, wood = 0, fire = 0, earth = 0, yang = 0, yin = 0;
    if (answersArr[0] === 0) { metal += 2; yang += 1; }
    else if (answersArr[0] === 1) { water += 2; yin += 1; } else { earth += 1; }
    if (answersArr[1] === 0) { metal += 2; }
    else if (answersArr[1] === 1) { wood += 2; } else { fire += 1; }
    if (answersArr[2] === 0) { fire += 2; yang += 2; }
    else if (answersArr[2] === 1) { water += 1; earth += 1; } else { metal += 1; }
    if (answersArr[3] === 0) { metal += 2; yang += 1; }
    else if (answersArr[3] === 1) { water += 2; yin += 1; } else { earth += 1; }
    if (answersArr[4] === 0) { fire += 2; yang += 1; }
    else if (answersArr[4] === 1) { water += 2; yin += 1; } else { wood += 1; }
    if (answersArr[5] === 0) { metal += 2; }
    else if (answersArr[5] === 1) { fire += 1; wood += 1; } else { earth += 1; water += 1; }
    if (answersArr[6] === 0) { metal += 1; fire += 1; }
    else if (answersArr[6] === 1) { water += 1; wood += 1; } else { earth += 1; }
    if (answersArr[7] === 0) { wood += 2; yang += 1; }
    else if (answersArr[7] === 1) { fire += 1; } else { earth += 2; yin += 1; }
    if (answersArr[8] === 0) { fire += 2; yang += 1; }
    else if (answersArr[8] === 1) { earth += 1; wood += 1; } else { water += 2; yin += 1; }
    if (answersArr[9] === 0) { metal += 2; yang += 1; }
    else if (answersArr[9] === 1) { water += 2; } else { wood += 1; fire += 1; }

    var elements = [
        { name: '金', score: metal }, { name: '水', score: water },
        { name: '木', score: wood }, { name: '火', score: fire }, { name: '土', score: earth }
    ];
    elements.sort(function(a, b) { return b.score - a.score; });
    var dom = elements[0].name;
    var isYang = yang >= yin;

    var map = {
        '金_阳': { type: '庚金日主', description: '你如庚金般刚毅果断，有着强烈的意志力和执行力。庚金是刀剑之金，代表勇敢、果决和领导力。', traits: ['刚毅果断', '领导力强', '不畏挑战', '意志坚定', '行事果决'] },
        '金_阴': { type: '辛金日主', description: '你如辛金般精致敏锐，有着细腻的感受力和追求完美的倾向。辛金是珠玉之金，代表精致、优雅和艺术气质。', traits: ['精致敏锐', '追求完美', '艺术气质', '注重细节', '优雅得体'] },
        '水_阳': { type: '壬水日主', description: '你如壬水般聪明灵动，有着广阔的思维和适应能力。壬水是江河之水，代表智慧、变通和胸怀。', traits: ['聪明灵动', '善于规划', '灵活应变', '胸怀宽广', '智慧过人'] },
        '水_阴': { type: '癸水日主', description: '你如癸水般细腻深沉，有着敏锐的直觉和深厚的情感。癸水是雨露之水，代表温柔、包容和感知力。', traits: ['细腻深沉', '直觉敏锐', '共情力强', '包容温柔', '感知丰富'] },
        '木_阳': { type: '甲木日主', description: '你如甲木般正直挺拔，有着坚定的信念和远大的志向。甲木是栋梁之木，代表正直、进取和领导力。', traits: ['正直挺拔', '信念坚定', '进取向上', '有原则性', '能担重任'] },
        '木_阴': { type: '乙木日主', description: '你如乙木般柔韧灵活，有着温和的性格和艺术的天赋。乙木是花草藤萝，代表柔韧、适应和美感。', traits: ['柔韧灵活', '温和友善', '艺术天赋', '适应力强', '富有美感'] },
        '火_阳': { type: '丙火日主', description: '你如丙火般热情开朗，有着充沛的能量和感染力。丙火是太阳之火，代表热情、光明和领导力。', traits: ['热情开朗', '能量充沛', '感染力强', '光明磊落', '富有号召力'] },
        '火_阴': { type: '丁火日主', description: '你如丁火般温柔细腻，有着丰富的情感和艺术的灵感。丁火是灯烛之火，代表温柔、灵感和文化气质。', traits: ['温柔细腻', '情感丰富', '富有灵感', '文化气质', '温暖人心'] },
        '土_阳': { type: '戊土日主', description: '你如戊土般稳重踏实，有着可靠的品质和坚定的信念。戊土是高山厚土，代表稳重、诚实和包容力。', traits: ['稳重踏实', '诚实可靠', '包容力强', '脚踏实地', '值得信赖'] },
        '土_阴': { type: '己土日主', description: '你如己土般包容含蓄，有着细腻的情感和服务的精神。己土是田园之土，代表包容、含蓄和奉献。', traits: ['包容含蓄', '善解人意', '服务精神', '耐心细致', '默默奉献'] }
    };
    return map[dom + '_' + (isYang ? '阳' : '阴')] || map['金_阳'];
}

// 统一分析入口
function analyzeTest(testId, answersArr) {
    switch (testId) {
        case 'ocean': return analyzeOcean(answersArr);
        case 'persona16': return analyze16Personality(answersArr);
        case 'tarot': return analyzeTarot(answersArr);
        case 'rizhu': return analyzeRiZhu(answersArr);
        default: return generateBasicResult(testId, answersArr);
    }
}
