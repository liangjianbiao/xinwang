/* ===== 职业规划 · 本地分析引擎 ===== */
(() => {
    'use strict';

    /* ---------- 基础数据 ---------- */
    const INTERESTS = [
        { key: 'tech', label: '技术研发', icon: 'fa-code' },
        { key: 'product', label: '产品设计', icon: 'fa-lightbulb' },
        { key: 'data', label: '数据分析', icon: 'fa-chart-line' },
        { key: 'market', label: '市场运营', icon: 'fa-bullhorn' },
        { key: 'design', label: '创意设计', icon: 'fa-palette' },
        { key: 'edu', label: '教育培训', icon: 'fa-chalkboard-user' },
        { key: 'medical', label: '医疗健康', icon: 'fa-heart-pulse' },
        { key: 'finance', label: '金融财务', icon: 'fa-coins' },
        { key: 'public', label: '公共服务', icon: 'fa-landmark' },
        { key: 'content', label: '内容创作', icon: 'fa-pen-nib' }
    ];

    const SKILLS = [
        { key: 'programming', label: '编程开发', icon: 'fa-terminal' },
        { key: 'data', label: '数据分析', icon: 'fa-chart-simple' },
        { key: 'design', label: '视觉设计', icon: 'fa-palette' },
        { key: 'writing', label: '文案写作', icon: 'fa-pen' },
        { key: 'comm', label: '沟通协作', icon: 'fa-comments' },
        { key: 'proj', label: '项目管理', icon: 'fa-sitemap' },
        { key: 'client', label: '客户沟通', icon: 'fa-handshake' },
        { key: 'english', label: '外语能力', icon: 'fa-language' },
        { key: 'speak', label: '演讲表达', icon: 'fa-microphone' },
        { key: 'lead', label: '团队管理', icon: 'fa-users-gear' }
    ];

    const TRAITS = [
        { key: 'logic', label: '逻辑严谨' },
        { key: 'detail', label: '沉稳细致' },
        { key: 'outgoing', label: '外向沟通' },
        { key: 'creative', label: '创意发散' },
        { key: 'exec', label: '执行力强' },
        { key: 'empathy', label: '共情力强' },
        { key: 'stress', label: '抗压能力强' },
        { key: 'learn', label: '学习能力强' }
    ];

    const TRAIT_DESC = {
        logic: { title: '逻辑严谨', text: '善于拆解复杂问题，能把模糊目标转成清晰的执行步骤。' },
        detail: { title: '沉稳细致', text: '做事沉稳、对细节敏感，适合需要长期专注与高准确度的任务。' },
        outgoing: { title: '沟通主动', text: '乐于表达与连接他人，在团队协作和对外沟通中更容易推进事情。' },
        creative: { title: '创意发散', text: '想法多、联想快，适合需要持续产出新点子的工作。' },
        exec: { title: '执行有力', text: '定了目标就能推进落地，不容易被过程中的阻力卡住。' },
        empathy: { title: '共情力强', text: '能敏锐感知他人情绪，适合需要理解人、服务人的岗位。' },
        stress: { title: '抗压稳定', text: '在压力下仍能保持节奏，适合节奏快或责任重的岗位。' },
        learn: { title: '学习能力强', text: '上手新领域速度快，能在变化中持续补齐能力短板。' }
    };

    const CAREERS = [
        {
            name: '前端开发工程师', icon: 'fa-code', industry: '互联网 / 软件', salary: '12-25K',
            interests: ['tech', 'design'], traits: ['logic', 'learn', 'detail'],
            skills: ['programming', 'design'],
            keywords: ['前端', 'javascript', 'html', 'css', 'vue', 'react', '小程序', '页面', '交互'],
            desc: '把设计稿变成可交互的网页与应用，是技术与用户之间的桥梁。',
            growth: '可向全栈工程师、前端架构师或技术产品经理发展。'
        },
        {
            name: '后端开发工程师', icon: 'fa-server', industry: '互联网 / 软件', salary: '15-30K',
            interests: ['tech', 'data'], traits: ['logic', 'stress', 'detail'],
            skills: ['programming', 'data', 'proj'],
            keywords: ['后端', 'java', 'python', 'go', '数据库', '接口', '服务端', '架构', '并发'],
            desc: '负责业务逻辑、数据存储与服务稳定性，是产品的底座。',
            growth: '可向架构师、技术专家或研发管理者方向发展。'
        },
        {
            name: '数据分析师', icon: 'fa-chart-pie', industry: '互联网 / 金融 / 咨询', salary: '12-25K',
            interests: ['data', 'tech', 'finance'], traits: ['logic', 'detail', 'learn'],
            skills: ['data', 'programming', 'writing'],
            keywords: ['数据', 'sql', 'excel', 'python', '报表', '指标', '分析', '可视化', '统计'],
            desc: '用数据回答问题、发现机会，为业务决策提供依据。',
            growth: '可向数据科学家、商业分析负责人或业务策略岗发展。'
        },
        {
            name: '产品经理', icon: 'fa-lightbulb', industry: '互联网 / 软件', salary: '15-30K',
            interests: ['product', 'market', 'tech'], traits: ['logic', 'outgoing', 'exec'],
            skills: ['proj', 'comm', 'writing'],
            keywords: ['产品', '需求', '用户', '原型', 'prd', '竞品', '迭代', '方案'],
            desc: '连接用户、设计与研发，决定做什么以及为什么做。',
            growth: '可向高级产品经理、产品总监或创业方向延伸。'
        },
        {
            name: 'UI / UX 设计师', icon: 'fa-pen-ruler', industry: '互联网 / 设计', salary: '10-22K',
            interests: ['design', 'product'], traits: ['creative', 'detail', 'empathy'],
            skills: ['design', 'writing'],
            keywords: ['设计', 'ui', 'ux', 'figma', 'sketch', '视觉', '交互', '原型', '配色'],
            desc: '用视觉与交互设计提升产品的可用性与美感。',
            growth: '可向资深设计师、设计负责人或独立设计顾问发展。'
        },
        {
            name: '新媒体运营', icon: 'fa-bullhorn', industry: '互联网 / 传媒', salary: '8-18K',
            interests: ['content', 'market'], traits: ['creative', 'outgoing', 'exec'],
            skills: ['writing', 'comm', 'data'],
            keywords: ['运营', '公众号', '小红书', '抖音', '内容', '文案', '策划', '涨粉', '选题'],
            desc: '用内容和活动获取用户、提升活跃与转化。',
            growth: '可向内容负责人、品牌营销或用户增长方向进阶。'
        },
        {
            name: '市场营销专员', icon: 'fa-handshake', industry: '消费品 / 互联网', salary: '8-20K',
            interests: ['market', 'public'], traits: ['outgoing', 'exec', 'stress'],
            skills: ['client', 'comm', 'speak'],
            keywords: ['市场', '营销', '品牌', '活动', '渠道', '客户', '推广', '销售'],
            desc: '洞察市场与客户，把产品价值传递出去。',
            growth: '可向市场经理、品牌负责人或商务总监发展。'
        },
        {
            name: '人力资源专员', icon: 'fa-users', industry: '全行业', salary: '8-16K',
            interests: ['public', 'edu'], traits: ['empathy', 'outgoing', 'detail'],
            skills: ['comm', 'speak', 'proj'],
            keywords: ['人力', '招聘', '培训', '绩效', '员工', '组织', '面试'],
            desc: '负责选人、育人与组织氛围，是企业的人才中枢。',
            growth: '可向 HRBP、招聘负责人或人力资源总监发展。'
        },
        {
            name: '教师 / 培训师', icon: 'fa-chalkboard-user', industry: '教育 / 培训', salary: '7-18K',
            interests: ['edu', 'public'], traits: ['empathy', 'outgoing', 'learn'],
            skills: ['speak', 'writing', 'comm'],
            keywords: ['教学', '老师', '课程', '培训', '教研', '学生', '教案', '讲师'],
            desc: '把知识转化为他人可理解、可掌握的能力。',
            growth: '可向教研负责人、课程设计专家或独立讲师发展。'
        },
        {
            name: '心理咨询师', icon: 'fa-hand-holding-heart', industry: '心理健康 / 医疗', salary: '8-20K',
            interests: ['medical', 'edu'], traits: ['empathy', 'detail', 'learn'],
            skills: ['comm', 'speak'],
            keywords: ['心理', '咨询', '倾听', '辅导', '情绪', '陪伴', '个案'],
            desc: '陪伴来访者梳理情绪与困扰，找到自己的答案。',
            growth: '需要持续受训与督导，可向专项咨询或心理培训发展。'
        },
        {
            name: '财务 / 审计', icon: 'fa-coins', industry: '金融 / 企业财务', salary: '8-20K',
            interests: ['finance', 'data'], traits: ['logic', 'detail', 'stress'],
            skills: ['data', 'proj'],
            keywords: ['财务', '会计', '审计', '报表', '税务', '预算', '成本', 'cpa'],
            desc: '用严谨的数字语言记录与审视企业经营。',
            growth: '可向财务经理、财务分析或内审负责人发展。'
        },
        {
            name: '公务员 / 公共事业', icon: 'fa-landmark', industry: '公共管理 / 事业单位', salary: '6-15K',
            interests: ['public', 'edu'], traits: ['detail', 'exec', 'stress'],
            skills: ['writing', 'comm', 'proj'],
            keywords: ['公务员', '事业单位', '政策', '公文', '行政', '基层', '公共'],
            desc: '在公共体系中提供服务、执行政策与协调资源。',
            growth: '可沿专业技术岗或综合管理岗两条路径发展。'
        }
    ];

    /* ---------- 各方向推荐资源 ---------- */
    const RECOMMEND = {
        '前端开发工程师': {
            certs: ['Web 前端开发职业技能等级证书', '软考 · 软件设计师'],
            projects: ['从 0 到 1 做一个响应式个人作品集网站', '用 Vue / React 复刻一个常用 App 的核心页面'],
            resources: ['MDN Web Docs', '《JavaScript 高级程序设计》', 'freeCodeCamp 前端课程']
        },
        '后端开发工程师': {
            certs: ['软考 · 软件设计师', '阿里云 ACP 云计算认证'],
            projects: ['搭建一个带登录与权限的 RESTful API 服务', '做一个短链接系统并完成压测'],
            resources: ['《深入理解计算机系统》', 'LeetCode 算法题库', '慕课网后端实战课程']
        },
        '数据分析师': {
            certs: ['CDA 数据分析师', 'Google Data Analytics 证书'],
            projects: ['用公开数据集完成一份完整分析报告', '搭建一个自动化数据看板'],
            resources: ['《利用 Python 进行数据分析》', 'Kaggle 入门竞赛', '《SQL 必知必会》']
        },
        '产品经理': {
            certs: ['NPDP 产品经理国际资格认证', 'PMP 项目管理认证'],
            projects: ['写一份完整 PRD 并做一次可用性测试', '主导一次小型产品迭代并复盘数据'],
            resources: ['《人人都是产品经理》', '《启示录》', '人人都是产品经理社区']
        },
        'UI / UX 设计师': {
            certs: ['Adobe 认证设计师', 'UX 设计专项课程证书'],
            projects: ['完成一套完整的 App UI 设计规范', '改版一个真实产品的关键流程'],
            resources: ['《写给大家看的设计书》', 'Figma 官方教程', 'Dribbble / Behance 灵感库']
        },
        '新媒体运营': {
            certs: ['新媒体运营师', 'Google 数字营销证书'],
            projects: ['从 0 运营一个垂直账号并产出 20 篇内容', '策划一次完整话题活动并复盘数据'],
            resources: ['《运营之光》', '《爆款文案》', '新榜 / 小红书创作者学院']
        },
        '市场营销专员': {
            certs: ['市场营销师', 'Google 数字营销证书'],
            projects: ['为真实品牌做一份市场推广方案', '独立执行一次小型投放并复盘 ROI'],
            resources: ['《定位》', '《营销管理》', '巨量引擎学习中心']
        },
        '人力资源专员': {
            certs: ['企业人力资源管理师', '劳动关系协调员'],
            projects: ['参与一次完整的校园招聘流程', '设计一套岗位面试题库'],
            resources: ['《人力资源管理》', '三茅人力资源网', '《非暴力沟通》']
        },
        '教师 / 培训师': {
            certs: ['教师资格证', '普通话水平测试证书'],
            projects: ['独立设计并讲授一门 8 课时小课程', '录制一套知识点讲解视频'],
            resources: ['《教育心理学》', '国家中小学智慧教育平台', '《刻意练习》']
        },
        '心理咨询师': {
            certs: ['心理咨询师基础培训合格证书', '相关流派系统受训证明'],
            projects: ['完成 50 小时以上见习或热线倾听实践', '整理一份个人成长与个案反思手册'],
            resources: ['《心理咨询与治疗的理论及实践》', '《非暴力沟通》', '壹心理专业课程']
        },
        '财务 / 审计': {
            certs: ['初级会计职称', 'CPA 注册会计师（部分科目）'],
            projects: ['独立完成一套小企业账务处理', '做一份公司财务报表分析报告'],
            resources: ['《会计学原理》', '《财务报表分析》', '东奥 / 中华会计网校']
        },
        '公务员 / 公共事业': {
            certs: ['公务员考试（国考 / 省考）', '公共管理相关证书'],
            projects: ['参与一次基层调研并输出调研报告', '系统训练申论与结构化面试'],
            resources: ['《申论》真题', '《公共基础知识》', '半月谈']
        }
    };

    /* ---------- 关键词 → 技能映射 ---------- */
    const KEYWORD_SKILL_MAP = {
        programming: ['javascript', 'python', 'java', 'c++', 'go', 'sql', 'vue', 'react', '编程', '开发', '代码', '前端', '后端'],
        data: ['数据分析', '数据', 'excel', 'bi', '统计', '可视化', 'tableau', '报表'],
        design: ['设计', 'ui', 'ux', 'figma', 'sketch', '视觉', '海报', '配色'],
        writing: ['文案', '写作', '编辑', '内容', '公众号', '脚本', '策划'],
        comm: ['沟通', '协作', '团队', '对接', '协调'],
        proj: ['项目管理', '项目', '进度', '需求', '排期', '统筹'],
        client: ['客户', '销售', '商务', '谈判', '推广'],
        english: ['英语', 'english', '四级', '六级', '雅思', '托福', '外语'],
        speak: ['演讲', '主持', '培训', '讲解', '汇报', '授课'],
        lead: ['带领', '管理', 'leader', '负责人', '主管', '组织']
    };

    const EDU_SCORE = { '高中及以下': 0, '大专': 4, '本科': 8, '硕士': 14, '博士': 18 };

    const RADAR_DIMS = ['专业技术', '沟通表达', '逻辑分析', '创意创新', '执行落地', '学习成长'];

    const state = {
        lastResult: null,
        customSkills: []
    };

    /* ---------- DOM ---------- */
    const $ = id => document.getElementById(id);
    const form = $('careerForm');
    const profileCard = $('profileCard');
    const resultSection = $('resultSection');

    /* ---------- 初始化标签 ---------- */
    function buildChips(container, list, withIcon) {
        container.innerHTML = list.map(item => `
            <button type="button" class="chip" data-key="${item.key}">
                ${withIcon && item.icon ? `<i class="fas ${item.icon}"></i>` : ''}${item.label}
            </button>
        `).join('');
    }

    function initChips() {
        buildChips($('interestGroup'), INTERESTS, true);
        buildChips($('skillGroup'), SKILLS, true);
        buildChips($('traitGroup'), TRAITS, false);

        document.querySelectorAll('.chip-group').forEach(group => {
            group.addEventListener('click', e => {
                const chip = e.target.closest('.chip');
                if (!chip) return;
                chip.classList.toggle('active');
            });
        });
    }

    function selectedKeys(containerId) {
        return Array.from(document.querySelectorAll(`#${containerId} .chip.active`))
            .map(c => c.dataset.key);
    }

    /* ---------- 自定义技能 ---------- */
    function addCustomSkill() {
        const input = $('customSkill');
        const value = input.value.trim();
        if (!value) return;
        if (value.length > 14) {
            setStatus('技能名称请控制在 14 个字以内', true);
            return;
        }
        const key = 'custom-' + state.customSkills.length;
        state.customSkills.push(value);
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'chip active';
        chip.dataset.key = key;
        chip.dataset.custom = '1';
        chip.innerHTML = `<i class="fas fa-tag"></i>${value}`;
        $('skillGroup').appendChild(chip);
        input.value = '';
    }

    /* ---------- 简历解析 ---------- */
    function setStatus(text, isError) {
        const el = $('uploadStatus');
        el.textContent = text;
        el.classList.toggle('error', !!isError);
    }

    async function readResumeFile(file) {
        const ext = (file.name.split('.').pop() || '').toLowerCase();

        if (['txt', 'md', 'json', 'csv'].includes(ext)) {
            return await file.text();
        }

        if (ext === 'pdf') {
            if (!window.pdfjsLib) throw new Error('PDF 解析组件未加载，请检查网络或直接粘贴文本');
            const buffer = await file.arrayBuffer();
            const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
            let text = '';
            const maxPages = Math.min(pdf.numPages, 10);
            for (let i = 1; i <= maxPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                text += content.items.map(item => item.str).join(' ') + '\n';
            }
            return text;
        }

        if (ext === 'docx') {
            if (!window.mammoth) throw new Error('DOCX 解析组件未加载，请检查网络或直接粘贴文本');
            const buffer = await file.arrayBuffer();
            const result = await window.mammoth.extractRawText({ arrayBuffer: buffer });
            return result.value;
        }

        throw new Error('暂不支持该格式，请上传 txt / md / pdf / docx 文件');
    }

    async function handleFile(file) {
        if (!file) return;
        if (file.size > 8 * 1024 * 1024) {
            setStatus('文件超过 8MB，请上传更小的文件', true);
            return;
        }
        setStatus('正在读取 ' + file.name + ' …');
        try {
            const text = await readResumeFile(file);
            const clean = (text || '').replace(/\s+/g, ' ').trim();
            if (!clean) {
                setStatus('没有读取到文字内容，可能是扫描件，请手动粘贴', true);
                return;
            }
            $('resumeText').value = clean.slice(0, 6000);
            setStatus(`已读取「${file.name}」，共 ${clean.length} 字`);
        } catch (err) {
            setStatus(err.message || '文件读取失败，请手动粘贴文本', true);
        }
    }

    function initUpload() {
        const zone = $('uploadZone');
        const fileInput = $('resumeFile');

        zone.addEventListener('click', e => {
            if (e.target === fileInput) return;
            fileInput.click();
        });
        fileInput.addEventListener('change', e => {
            handleFile(e.target.files[0]);
            fileInput.value = '';
        });

        ['dragenter', 'dragover'].forEach(evt => {
            zone.addEventListener(evt, e => {
                e.preventDefault();
                zone.classList.add('dragover');
            });
        });
        ['dragleave', 'drop'].forEach(evt => {
            zone.addEventListener(evt, e => {
                e.preventDefault();
                zone.classList.remove('dragover');
            });
        });
        zone.addEventListener('drop', e => {
            const file = e.dataTransfer.files && e.dataTransfer.files[0];
            handleFile(file);
        });
    }

    /* ---------- 分析 ---------- */
    function detectSkillsFromText(text) {
        const lower = (text || '').toLowerCase();
        const found = new Set();
        Object.keys(KEYWORD_SKILL_MAP).forEach(skillKey => {
            if (KEYWORD_SKILL_MAP[skillKey].some(kw => lower.includes(kw.toLowerCase()))) {
                found.add(skillKey);
            }
        });
        return found;
    }

    function collectInput() {
        const text = $('resumeText').value || '';
        const interestKeys = selectedKeys('interestGroup');
        const skillKeys = selectedKeys('skillGroup');
        const traitKeys = selectedKeys('traitGroup');
        const detected = detectSkillsFromText(text);

        const allSkills = new Set(skillKeys);
        detected.forEach(k => allSkills.add(k));
        // 自定义技能计入技能数量，但不参与具体映射
        skillKeys.filter(k => k.startsWith('custom-')).forEach(k => allSkills.add(k));

        return {
            name: $('fName').value.trim(),
            age: $('fAge').value,
            edu: $('fEdu').value,
            major: $('fMajor').value.trim(),
            stage: $('fStage').value,
            industry: $('fIndustry').value.trim(),
            target: $('fTarget').value.trim(),
            salary: $('fSalary').value,
            interests: new Set(interestKeys),
            skills: allSkills,
            selectedSkillKeys: new Set(skillKeys),
            traits: new Set(traitKeys),
            text: text,
            hasFileText: text.length > 80
        };
    }

    function scoreCareer(career, input) {
        let score = 28;

        career.interests.forEach(k => {
            if (input.interests.has(k)) score += 12;
        });
        career.traits.forEach(k => {
            if (input.traits.has(k)) score += 8;
        });
        career.skills.forEach(k => {
            if (input.skills.has(k)) score += 9;
        });

        const lowerText = input.text.toLowerCase();
        let kwHits = 0;
        career.keywords.forEach(kw => {
            if (lowerText.includes(kw.toLowerCase())) kwHits++;
        });
        score += Math.min(kwHits * 5, 20);

        if (input.target) {
            if (career.name.includes(input.target) || input.target.includes(career.name.slice(0, 2))) {
                score += 15;
            }
        }
        if (input.industry && career.industry.includes(input.industry.slice(0, 2))) {
            score += 6;
        }

        return Math.max(35, Math.min(98, Math.round(score)));
    }

    function rankCareers(input) {
        return CAREERS
            .map(career => ({ career, score: scoreCareer(career, input) }))
            .sort((a, b) => b.score - a.score);
    }

    function computePreparationScore(input) {
        let score = 30;
        if (input.name) score += 5;
        score += Math.min(input.interests.size * 4, 16);
        score += Math.min(input.skills.size * 5, 25);
        score += Math.min(input.traits.size * 3, 12);
        if (input.major) score += 5;
        if (input.target) score += 8;
        if (input.industry) score += 4;
        if (input.hasFileText) score += 5;
        return Math.min(96, score);
    }

    function computeRadar(input) {
        const has = (set, arr) => arr.filter(k => set.has(k)).length;

        const tech = has(input.interests, ['tech', 'data', 'finance']) * 12 +
            has(input.skills, ['programming', 'data', 'proj']) * 10;
        const comm = has(input.interests, ['market', 'edu', 'public', 'content']) * 11 +
            has(input.traits, ['outgoing', 'empathy']) * 8 +
            has(input.skills, ['comm', 'client', 'english', 'speak']) * 8;
        const logic = has(input.traits, ['logic', 'detail']) * 11 +
            has(input.interests, ['data', 'finance', 'tech']) * 9 +
            has(input.skills, ['data', 'proj']) * 8;
        const creative = has(input.interests, ['design', 'content', 'product']) * 11 +
            has(input.traits, ['creative']) * 9 +
            has(input.skills, ['design', 'writing']) * 9;
        const exec = has(input.traits, ['exec', 'stress']) * 12 +
            has(input.skills, ['proj', 'lead']) * 10;
        const learn = has(input.traits, ['learn']) * 12 +
            (EDU_SCORE[input.edu] || 5) * 1.4 +
            Math.min(input.skills.size * 4, 24);

        return [
            clampScore(30 + tech),
            clampScore(30 + comm),
            clampScore(30 + logic),
            clampScore(30 + creative),
            clampScore(30 + exec),
            clampScore(30 + learn)
        ];
    }

    function clampScore(v) {
        return Math.max(28, Math.min(96, Math.round(v)));
    }

    function buildStrengths(input, topCareers) {
        const list = [];
        const top = topCareers[0].career;

        // 与目标岗位最相关的性格优势
        const orderedTraits = Array.from(input.traits).sort((a, b) => {
            const aHit = top.traits.includes(a) ? 1 : 0;
            const bHit = top.traits.includes(b) ? 1 : 0;
            return bHit - aHit;
        });

        orderedTraits.slice(0, 3).forEach(key => {
            const d = TRAIT_DESC[key];
            if (d) list.push({ title: d.title, text: d.text });
        });

        if (input.skills.size > 0) {
            const labels = Array.from(input.skills).map(key => {
                const found = SKILLS.find(s => s.key === key);
                if (found) return found.label;
                const idx = key.replace('custom-', '');
                return state.customSkills[Number(idx)] || '相关技能';
            });
            list.push({
                title: '技能基础已具备',
                text: `已具备 ${labels.slice(0, 4).join('、')} 等能力，可以直接切入「${top.name}」相关岗位的实践。`
            });
        }

        if (input.major || input.edu) {
            list.push({
                title: '教育背景可转化',
                text: `${input.edu}${input.major ? ' · ' + input.major : ''} 的学习经历，可以提炼为专业基础与系统性学习能力。`
            });
        }

        const lowerText = input.text.toLowerCase();
        const expSignals = [];
        if (/项目/.test(input.text)) expSignals.push('项目经历');
        if (/实习/.test(input.text)) expSignals.push('实习经历');
        if (/负责|带领|牵头|组织/.test(input.text)) expSignals.push('组织牵头能力');
        if (/奖|竞赛|荣誉/.test(input.text)) expSignals.push('竞赛获奖经历');
        if (/英语|四级|六级|cet/i.test(input.text)) expSignals.push('外语能力');
        if (expSignals.length) {
            list.push({
                title: '经历中已沉淀可迁移能力',
                text: `从你的描述中识别到：${expSignals.join('、')}，这些都可以转化为求职时的具体案例。`
            });
        }

        if (input.target) {
            list.push({
                title: '目标清晰',
                text: `已明确期望岗位为「${input.target}」，方向聚焦有助于更快积累对口经验。`
            });
        } else if (top) {
            list.push({
                title: '方向可聚焦',
                text: `结合你的兴趣与特质，「${top.name}」是目前匹配度最高的方向，可以作为主攻目标。`
            });
        }

        return list.slice(0, 6);
    }

    function buildTimeline(input, top) {
        const career = top.career;
        const industry = input.industry || career.industry;
        const target = input.target || career.name;
        const rec = RECOMMEND[career.name] || { certs: [], projects: [], resources: [] };

        return [
            {
                title: '短期 · 打基础',
                phase: '0-12 个月',
                goal: `完成从「了解」到「能上手」的转变，明确以${target}为主攻方向。`,
                tasks: [
                    `拆解 3 份${target}招聘 JD，整理必备技能清单，标出自己的差距项`,
                    '主攻 2 项核心技能，完成一次系统学习并做阶段自测',
                    rec.projects[0] ? `动手完成：${rec.projects[0]}` : '完成 1-2 个可展示的练习项目',
                    '把经历改写成"情境 - 行动 - 结果"的简历表述'
                ],
                output: '一份对口简历 + 1-2 个作品'
            },
            {
                title: '中期 · 立住脚',
                phase: '1-3 年',
                goal: `进入${industry}相关岗位，能独立承担完整模块并对结果负责。`,
                tasks: [
                    `在${target}岗位上独立负责至少 1 个完整项目或模块`,
                    '每季度沉淀 1 个可复用的方法、模板或案例',
                    rec.certs[0] ? `考取或准备：${rec.certs[0]}` : '考取 1 项与岗位直接相关的证书',
                    '参与 2 次以上行业交流或专业社群，建立人脉'
                ],
                output: '2-3 个能讲清楚的成果案例'
            },
            {
                title: '长期 · 建优势',
                phase: '3-5 年',
                goal: `在${career.name}方向形成个人标签，具备带项目或带人的能力。`,
                tasks: [
                    '在细分领域持续深耕，通过分享、写作或授课输出专业内容',
                    '承担跨团队项目或新人带教，验证自己的组织能力',
                    '关注行业趋势，判断是走专家路线还是管理路线'
                ],
                output: '可对外展示的专业影响力'
            }
        ];
    }

    function buildRecommendations(input, top) {
        const career = top.career;
        const rec = RECOMMEND[career.name] || { certs: [], projects: [], resources: [] };

        const skillTags = career.skills.map(key => {
            const item = SKILLS.find(s => s.key === key);
            return {
                label: item ? item.label : key,
                owned: input.skills.has(key)
            };
        });

        if (input.skills.size === 0) {
            skillTags.push({ label: '先选定 1 项核心技能', owned: false });
        }

        return {
            skills: skillTags,
            certs: rec.certs,
            projects: rec.projects,
            resources: rec.resources,
            target: input.target || career.name
        };
    }

    function buildActions(input, top) {
        const career = top.career;
        const actions = [];

        if (!input.target) {
            actions.push(`先确定一个主攻方向，例如「${career.name}」，避免同时准备多个不相关岗位。`);
        } else {
            actions.push(`拆解 3 个「${input.target}」招聘 JD，把高频要求逐条对应到自己的经历上。`);
        }

        if (input.skills.size === 0) {
            actions.push('从兴趣方向里挑 1 个核心技能，用 8 周做一次系统学习并产出可见成果。');
        } else {
            actions.push('把已有技能整理成作品或案例，每个技能至少配一个可验证的成果。');
        }

        actions.push(`每周投入 6-8 小时用于${career.name}相关的深度学习，优先补齐招聘要求中缺失的一到两项。`);
        actions.push('完善简历与自我介绍，用"情境 - 行动 - 结果"的方式描述每段经历。');
        actions.push(`关注${career.industry}的行业动态与岗位趋势，每季度复盘一次目标是否需要调整。`);

        return actions;
    }

    /* ---------- 渲染 ---------- */
    function render(input) {
        const ranked = rankCareers(input);
        const topCareers = ranked.slice(0, 4);
        const prepScore = computePreparationScore(input);
        const radar = computeRadar(input);

        // 概览
        $('rName').textContent = input.name || '同学';
        $('rSubtitle').textContent = [
            input.stage,
            input.edu + (input.major ? ' · ' + input.major : ''),
            input.industry ? '目标行业：' + input.industry : ''
        ].filter(Boolean).join('　·　');

        const tags = [];
        input.interests.forEach(k => {
            const item = INTERESTS.find(i => i.key === k);
            if (item) tags.push(item.label);
        });
        input.traits.forEach(k => {
            const item = TRAITS.find(t => t.key === k);
            if (item) tags.push(item.label);
        });
        if (input.target) tags.push('目标：' + input.target);
        if (input.age) tags.push(input.age);
        $('rTags').innerHTML = tags.map(t => `<span>${escapeHtml(t)}</span>`).join('');

        animateScore(prepScore);

        // 优势
        const strengths = buildStrengths(input, topCareers);
        $('strengthList').innerHTML = strengths.map(s => `
            <li>
                <span class="s-icon"><i class="fas fa-check"></i></span>
                <div>
                    <strong>${escapeHtml(s.title)}</strong>
                    <p>${escapeHtml(s.text)}</p>
                </div>
            </li>
        `).join('');

        // 雷达图
        drawRadar(radar);

        // 推荐方向
        $('careerMatches').innerHTML = topCareers.map((item, index) => `
            <div class="match-item">
                <div class="match-head">
                    <span class="match-title">
                        <span class="m-icon"><i class="fas ${item.career.icon}"></i></span>
                        ${index === 0 ? '最匹配 · ' : ''}${escapeHtml(item.career.name)}
                    </span>
                    <span class="match-score">${item.score}%</span>
                </div>
                <p class="match-desc">${escapeHtml(item.career.desc)}</p>
                <div class="match-bar"><i data-width="${item.score}"></i></div>
                <div class="match-meta">
                    <span>行业：<b>${escapeHtml(item.career.industry)}</b></span>
                    <span>参考薪资：<b>${escapeHtml(item.career.salary)}</b></span>
                    <span>成长路径：<b>${escapeHtml(item.career.growth)}</b></span>
                </div>
            </div>
        `).join('');

        // 推荐提升清单
        const recommendations = buildRecommendations(input, topCareers[0]);
        $('recGrid').innerHTML = `
            <div class="rec-item">
                <h4><span class="r-icon"><i class="fas fa-wrench"></i></span>建议补强的技能</h4>
                <div class="rec-tags">
                    ${recommendations.skills.map(s => `
                        <span class="${s.owned ? '' : 'miss'}">${escapeHtml(s.label)}${s.owned ? ' ✓' : ''}</span>
                    `).join('')}
                </div>
                <p class="rec-hint">✓ 为已具备，橙色为建议优先补齐</p>
            </div>
            <div class="rec-item">
                <h4><span class="r-icon"><i class="fas fa-certificate"></i></span>推荐证书</h4>
                <ul class="rec-list">
                    ${recommendations.certs.map(c => `<li>${escapeHtml(c)}</li>`).join('')}
                </ul>
            </div>
            <div class="rec-item">
                <h4><span class="r-icon"><i class="fas fa-diagram-project"></i></span>推荐实践项目</h4>
                <ul class="rec-list">
                    ${recommendations.projects.map(p => `<li>${escapeHtml(p)}</li>`).join('')}
                </ul>
            </div>
            <div class="rec-item">
                <h4><span class="r-icon"><i class="fas fa-book-open"></i></span>学习资源</h4>
                <ul class="rec-list">
                    ${recommendations.resources.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
                </ul>
            </div>
        `;

        // 短中长期规划
        const timeline = buildTimeline(input, topCareers[0]);
        $('timeline').innerHTML = timeline.map(t => `
            <div class="timeline-item">
                <h4>${escapeHtml(t.title)}<span>${escapeHtml(t.phase)}</span></h4>
                <p class="t-goal">🎯 ${escapeHtml(t.goal)}</p>
                <ul class="t-tasks">
                    ${t.tasks.map(task => `<li>${escapeHtml(task)}</li>`).join('')}
                </ul>
                <span class="t-output">阶段产出：${escapeHtml(t.output)}</span>
            </div>
        `).join('');

        // 行动建议
        const actions = buildActions(input, topCareers[0]);
        $('actionList').innerHTML = actions.map(a => `
            <li><i class="fas fa-circle-check"></i><span>${escapeHtml(a)}</span></li>
        `).join('');

        state.lastResult = { input, ranked: topCareers, prepScore, radar, strengths, timeline, actions, recommendations };

        resultSection.classList.remove('hidden');
        setTimeout(() => {
            document.querySelectorAll('.match-bar i').forEach(bar => {
                bar.style.width = (bar.dataset.width || 0) + '%';
            });
        }, 60);

        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function animateScore(target) {
        const numEl = $('scoreNum');
        const ring = $('scoreRing');
        const start = performance.now();
        const duration = 800;

        function frame(now) {
            const p = Math.min(1, (now - start) / duration);
            const value = Math.round(target * (1 - Math.pow(1 - p, 3)));
            numEl.textContent = value;
            const deg = Math.round(360 * (value / 100));
            ring.style.background = `conic-gradient(#FFC24D 0deg, #FFC24D ${deg}deg, rgba(255,255,255,0.22) ${deg}deg)`;
            if (p < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    function drawRadar(values) {
        const canvas = $('radarCanvas');
        const ctx = canvas.getContext('2d');
        const W = 340, H = 300;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width = '100%';
        canvas.style.maxWidth = W + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);

        const cx = W / 2;
        const cy = H / 2 + 4;
        const radius = 96;
        const count = RADAR_DIMS.length;
        const angleStep = (Math.PI * 2) / count;
        const startAngle = -Math.PI / 2;

        // 背景网格
        for (let level = 1; level <= 4; level++) {
            const r = radius * (level / 4);
            ctx.beginPath();
            for (let i = 0; i < count; i++) {
                const angle = startAngle + i * angleStep;
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = level === 4 ? '#D5DAEB' : '#E9ECF6';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // 轴线
        for (let i = 0; i < count; i++) {
            const angle = startAngle + i * angleStep;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
            ctx.strokeStyle = '#E9ECF6';
            ctx.stroke();
        }

        // 数据多边形
        const points = values.map((v, i) => {
            const angle = startAngle + i * angleStep;
            const r = radius * (v / 100);
            return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
        });

        ctx.beginPath();
        points.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();

        const gradient = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
        gradient.addColorStop(0, 'rgba(91, 91, 214, 0.34)');
        gradient.addColorStop(1, 'rgba(255, 194, 77, 0.30)');
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = '#5B5BD6';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 顶点
        points.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
            ctx.strokeStyle = '#5B5BD6';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // 标签
        ctx.font = '600 12px "PingFang SC", "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#4A5068';
        RADAR_DIMS.forEach((label, i) => {
            const angle = startAngle + i * angleStep;
            const x = cx + Math.cos(angle) * (radius + 26);
            const y = cy + Math.sin(angle) * (radius + 22);
            ctx.fillText(label, x, y);
        });
    }

    function escapeHtml(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /* ---------- 导出 ---------- */
    function exportReport() {
        const r = state.lastResult;
        if (!r) return;
        const i = r.input;

        const lines = [];
        lines.push('心灵驿站 · 职业规划报告');
        lines.push('生成时间：' + new Date().toLocaleString('zh-CN'));
        lines.push('');
        lines.push('一、基本信息');
        lines.push(`姓名：${i.name || '未填写'}`);
        lines.push(`年龄阶段：${i.age}`);
        lines.push(`学历：${i.edu}${i.major ? ' / ' + i.major : ''}`);
        lines.push(`当前状态：${i.stage}`);
        lines.push(`目标行业：${i.industry || '未填写'}`);
        lines.push(`期望岗位：${i.target || '未填写'}`);
        lines.push(`职业准备度：${r.prepScore} 分`);
        lines.push('');
        lines.push('二、职业优势');
        r.strengths.forEach((s, idx) => lines.push(`${idx + 1}. ${s.title}：${s.text}`));
        lines.push('');
        lines.push('三、推荐职业方向');
        r.ranked.forEach(({ career, score }, idx) => {
            lines.push(`${idx + 1}. ${career.name}（匹配度 ${score}%）`);
            lines.push(`   行业：${career.industry}　参考薪资：${career.salary}`);
            lines.push(`   说明：${career.desc}`);
            lines.push(`   成长：${career.growth}`);
        });
        lines.push('');
        lines.push('四、推荐提升清单');
        lines.push('建议补强的技能：' + r.recommendations.skills
            .map(s => s.label + (s.owned ? '（已具备）' : '（待补齐）')).join('、'));
        lines.push('推荐证书：' + r.recommendations.certs.join('；'));
        lines.push('推荐实践项目：' + r.recommendations.projects.join('；'));
        lines.push('学习资源：' + r.recommendations.resources.join('；'));
        lines.push('');
        lines.push('五、短中长期规划');
        r.timeline.forEach(t => {
            lines.push(`[${t.phase}] ${t.title}`);
            lines.push(`  目标：${t.goal}`);
            t.tasks.forEach((task, idx) => lines.push(`  任务${idx + 1}：${task}`));
            lines.push(`  阶段产出：${t.output}`);
        });
        lines.push('');
        lines.push('六、行动建议');
        r.actions.forEach((a, idx) => lines.push(`${idx + 1}. ${a}`));
        lines.push('');
        lines.push('（本报告由心灵驿站根据你填写的信息本地生成，仅供参考）');

        const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `职业规划报告_${i.name || '我的'}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /* ---------- 事件 ---------- */
    function initEvents() {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const input = collectInput();
            if (!input.name) {
                $('fName').focus();
                return;
            }
            if (input.interests.size === 0 && input.skills.size === 0 && input.traits.size === 0 && !input.text) {
                setStatus('至少选择一个方向、技能或填写简历内容，规划会更准确', true);
                return;
            }
            setStatus('');
            render(input);
        });

        $('btnAddSkill').addEventListener('click', addCustomSkill);
        $('customSkill').addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addCustomSkill();
            }
        });

        $('btnReset').addEventListener('click', resetForm);
        $('btnAgain').addEventListener('click', () => {
            profileCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        $('btnExport').addEventListener('click', exportReport);
        $('btnPrint').addEventListener('click', () => window.print());
    }

    function resetForm() {
        form.reset();
        document.querySelectorAll('.chip-group .chip').forEach(chip => {
            if (chip.dataset.custom === '1') chip.remove();
            else chip.classList.remove('active');
        });
        state.customSkills = [];
        $('resumeText').value = '';
        $('customSkill').value = '';
        setStatus('');
        resultSection.classList.add('hidden');
        state.lastResult = null;
        profileCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /* ---------- 启动 ---------- */
    function init() {
        if (!form) return;
        if (window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
        initChips();
        initUpload();
        initEvents();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
