/* ===== 签名随手写 ===== */

(() => {
    'use strict';

    /* ---------- 艺术签名配置 ---------- */
    const STYLES = [
        { key: 'shangwu1', name: '一笔商务签', font: '"Long Cang", cursive',
          hint: '稳重流畅，职场首选', sample: '签名' },
        { key: 'shangwu2', name: '连笔商务签', font: '"Liu Jian Shuang Cao", cursive',
          hint: '飘逸连笔，干练利落', sample: '签名' },
        { key: 'yunxiao',  name: '云霄体',    font: '"Liu Jian Mao Cao", cursive',
          hint: '洒脱豪放，气势磅礴', sample: '签名' },
        { key: 'liti',     name: '毛笔隶书',  font: '"Ma Shan Zheng", cursive',
          hint: '厚重大气，传统韵味', sample: '签名' },
        { key: 'shaonian', name: '少年和风',  font: '"ZCOOL KuaiLe", cursive',
          hint: '活泼圆润，青春洋溢', sample: '签名' },
        { key: 'yishu',    name: '一笔艺术签', font: '"Zhi Mang Xing", cursive',
          hint: '优雅灵动，艺术感强', sample: '签名' }
    ];

    const SIGN_COLORS = ['#333333', '#c0392b', '#2c3e50', '#8e44ad', '#2980b9', '#27ae60', '#d35400', '#1a1a2e'];

    /* ---------- 手动签名配置 ---------- */
    const MANUAL_COLORS = ['#222222', '#ff3b66', '#4d96ff', '#6bcf7f', '#a855f7', '#ff9f43'];
    let currentBrushSize = 4;
    let currentManualColor = '#222222';
    let historyStack = [];
    let redoStack = [];
    const MAX_HISTORY = 40;

    /* ---------- 艺术签名状态 ---------- */
    let currentColor = '#333333';
    let currentStyleFilter = 'all';

    /* ============ 初始化 ============ */
    document.addEventListener('DOMContentLoaded', () => {
        initTabs();
        initStyleChips();
        initColorDots();
        initGenerateBtn();
        initManualCanvas();
    });

    /* ============ Tab 切换 ============ */
    function initTabs() {
        document.querySelectorAll('.sign-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.sign-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.sign-panel').forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                const panel = document.getElementById('panel-' + tab.dataset.tab);
                panel.classList.add('active');
                // 手写面板刚显示时重新适配 canvas 尺寸
                if (tab.dataset.tab === 'manual') {
                    // 等一帧让 DOM 布局完成
                    requestAnimationFrame(() => {
                        fitCanvasDPR();
                        // 初始化后确保 history 里只有一张空白快照
                        if (historyStack.length === 0) pushHistory();
                    });
                }
            });
        });
    }

    /* ============ 艺术签名 ============ */

    function initStyleChips() {
        document.querySelectorAll('.style-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('.style-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                currentStyleFilter = chip.dataset.style;
                // 如果已经有名字，重新过滤显示
                if (document.getElementById('signName').value.trim()) {
                    renderArtSignatures(document.getElementById('signName').value.trim());
                }
            });
        });
    }

    function initColorDots() {
        const container = document.getElementById('colorDots');
        container.innerHTML = '';
        SIGN_COLORS.forEach((c, i) => {
            const dot = document.createElement('div');
            dot.className = 'color-dot' + (i === 0 ? ' active' : '');
            dot.style.background = c;
            dot.dataset.color = c;
            dot.addEventListener('click', () => {
                container.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                currentColor = c;
                if (document.getElementById('signName').value.trim()) {
                    renderArtSignatures(document.getElementById('signName').value.trim());
                }
            });
            container.appendChild(dot);
        });
        document.getElementById('customColor').addEventListener('input', e => {
            currentColor = e.target.value;
            container.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
            if (document.getElementById('signName').value.trim()) {
                renderArtSignatures(document.getElementById('signName').value.trim());
            }
        });

        // 手动签名颜色
        const mContainer = document.getElementById('manualColorDots');
        mContainer.innerHTML = '';
        MANUAL_COLORS.forEach((c, i) => {
            const dot = document.createElement('div');
            dot.className = 'color-dot' + (i === 0 ? ' active' : '');
            dot.style.background = c;
            dot.dataset.color = c;
            dot.addEventListener('click', () => {
                mContainer.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                currentManualColor = c;
            });
            mContainer.appendChild(dot);
        });
        document.getElementById('manualCustomColor').addEventListener('input', e => {
            currentManualColor = e.target.value;
            mContainer.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        });
    }

    function initGenerateBtn() {
        const btn = document.getElementById('btnGenerate');
        const input = document.getElementById('signName');
        const doGenerate = () => {
            const name = input.value.trim();
            if (!name) {
                input.focus();
                input.style.borderColor = '#ff6b9d';
                setTimeout(() => input.style.borderColor = '', 1200);
                return;
            }
            renderArtSignatures(name);
        };
        btn.addEventListener('click', doGenerate);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') doGenerate(); });
    }

    function renderArtSignatures(name) {
        const grid = document.getElementById('artGrid');
        const styles = currentStyleFilter === 'all'
            ? STYLES
            : STYLES.filter(s => s.key === currentStyleFilter);

        grid.innerHTML = '';

        // 先渲染卡片骨架（显示"加载中..."），再等字体加载完画到 canvas
        styles.forEach(style => {
            const card = document.createElement('div');
            card.className = 'art-card';
            card.innerHTML = `
                <div class="art-card-header">
                    <span class="art-style-name">${style.name}</span>
                    <button class="art-download" title="下载签名"><i class="fas fa-download"></i>保存</button>
                </div>
                <div class="art-canvas-wrap">
                    <canvas width="340" height="120"></canvas>
                </div>
            `;
            grid.appendChild(card);

            const canvas = card.querySelector('canvas');
            const draw = () => drawSignature(canvas, name, style.font, currentColor);

            // 中文字体按 unicode-range 拆成多个子集，必须传入实际文本
            // 浏览器才会下载覆盖这些汉字的子集；只传字体名只会加载拉丁样本子集
            if (document.fonts && document.fonts.load) {
                document.fonts.load(`78px ${style.font}`, name).then(draw).catch(draw);
            } else {
                draw();
            }

            card.querySelector('.art-download').addEventListener('click', () => {
                downloadCanvas(canvas, `签名_${name}_${style.name}.png`);
            });
        });
    }

    function drawSignature(canvas, text, font, color) {
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;

        // 清空白底
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, W, H);

        // 动态算字号：根据字符数
        const len = text.length;
        let fontSize = 78;
        if (len >= 7) fontSize = 44;
        else if (len >= 5) fontSize = 56;
        else if (len >= 3) fontSize = 66;

        ctx.font = `${fontSize}px ${font}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 微调纵向位置，让不同字体都居中
        const baselineY = H / 2;

        // 主签名
        ctx.fillStyle = color;
        ctx.fillText(text, W / 2, baselineY + 4);

        // 细一点的二次描边，增加质感
        ctx.globalAlpha = 0.25;
        ctx.lineWidth = 1;
        ctx.strokeStyle = color;
        ctx.strokeText(text, W / 2, baselineY + 4);
        ctx.globalAlpha = 1;
    }

    function downloadCanvas(canvas, filename) {
        // 创建白底临时 canvas，让签名下载后有白底
        const tmp = document.createElement('canvas');
        tmp.width = canvas.width;
        tmp.height = canvas.height;
        const tctx = tmp.getContext('2d');
        tctx.fillStyle = '#ffffff';
        tctx.fillRect(0, 0, tmp.width, tmp.height);
        tctx.drawImage(canvas, 0, 0);

        const link = document.createElement('a');
        link.download = filename;
        link.href = tmp.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /* ============ 手动签名 ============ */

    let manualCtx, manualCanvas;
    let drawing = false;
    let lastPoint = null;

    function initManualCanvas() {
        manualCanvas = document.getElementById('manualCanvas');
        manualCtx = manualCanvas.getContext('2d');

        // HiDPI 适配
        fitCanvasDPR();
        window.addEventListener('resize', fitCanvasDPR);

        // 笔刷按钮
        document.querySelectorAll('.brush-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.brush-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentBrushSize = parseInt(btn.dataset.size, 10);
            });
        });

        // 鼠标
        manualCanvas.addEventListener('mousedown', onDrawStart);
        manualCanvas.addEventListener('mousemove', onDrawMove);
        window.addEventListener('mouseup', onDrawEnd);

        // 触摸
        manualCanvas.addEventListener('touchstart', e => {
            e.preventDefault();
            const t = e.touches[0];
            onDrawStart({ clientX: t.clientX, clientY: t.clientY });
        }, { passive: false });
        manualCanvas.addEventListener('touchmove', e => {
            e.preventDefault();
            const t = e.touches[0];
            onDrawMove({ clientX: t.clientX, clientY: t.clientY });
        }, { passive: false });
        manualCanvas.addEventListener('touchend', onDrawEnd);

        // 撤销/重做/清除/保存
        document.getElementById('btnUndo').addEventListener('click', undo);
        document.getElementById('btnRedo').addEventListener('click', redo);
        document.getElementById('btnClear').addEventListener('click', clearCanvas);
        document.getElementById('btnManualSave').addEventListener('click', () => {
            const placeholder = document.getElementById('canvasPlaceholder');
            if (placeholder.classList.contains('hidden')) {
                downloadCanvas(manualCanvas, '我的签名.png');
            } else {
                alert('先在画布上签名哦～');
            }
        });

        pushHistory();
    }

    function fitCanvasDPR() {
        const wrap = manualCanvas.parentElement;
        const dpr = window.devicePixelRatio || 1;
        const cssW = Math.min(wrap.clientWidth, 700);
        if (cssW < 20) return; // 布局未就绪时跳过
        const cssH = Math.round(cssW * 0.5);
        // 只有尺寸真的变了才重置，避免每次切 tab 都丢历史
        const needResize =
            manualCanvas.width !== cssW * dpr ||
            manualCanvas.height !== cssH * dpr;
        manualCanvas.style.width = cssW + 'px';
        manualCanvas.style.height = cssH + 'px';
        manualCanvas.width = cssW * dpr;
        manualCanvas.height = cssH * dpr;
        manualCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        manualCtx.fillStyle = '#ffffff';
        manualCtx.fillRect(0, 0, cssW, cssH);
        if (needResize) {
            // 尺寸变了 → 旧快照尺寸不兼容，重置历史
            historyStack = [];
            redoStack = [];
            pushHistory();
            document.getElementById('canvasPlaceholder').classList.remove('hidden');
        }
    }

    function getCanvasPoint(e) {
        const rect = manualCanvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    function onDrawStart(e) {
        const placeholder = document.getElementById('canvasPlaceholder');
        if (placeholder) placeholder.classList.add('hidden');
        drawing = true;
        lastPoint = getCanvasPoint(e);
        // 点一个点，支持单击
        drawDot(lastPoint);
    }

    function onDrawMove(e) {
        if (!drawing) return;
        const p = getCanvasPoint(e);
        drawLine(lastPoint, p);
        lastPoint = p;
    }

    function onDrawEnd() {
        if (!drawing) return;
        drawing = false;
        lastPoint = null;
        pushHistory();
    }

    function drawDot(p) {
        manualCtx.beginPath();
        manualCtx.fillStyle = currentManualColor;
        manualCtx.arc(p.x, p.y, currentBrushSize / 2, 0, Math.PI * 2);
        manualCtx.fill();
    }

    function drawLine(from, to) {
        manualCtx.beginPath();
        manualCtx.strokeStyle = currentManualColor;
        manualCtx.lineWidth = currentBrushSize;
        manualCtx.lineCap = 'round';
        manualCtx.lineJoin = 'round';
        manualCtx.moveTo(from.x, from.y);
        manualCtx.lineTo(to.x, to.y);
        manualCtx.stroke();
    }

    function pushHistory() {
        if (manualCanvas.width < 10 || manualCanvas.height < 10) return;
        const snapshot = manualCtx.getImageData(0, 0, manualCanvas.width, manualCanvas.height);
        historyStack.push(snapshot);
        if (historyStack.length > MAX_HISTORY) historyStack.shift();
        redoStack = [];
    }

    function restoreHistory() {
        if (historyStack.length === 0) return;
        const snap = historyStack[historyStack.length - 1];
        manualCtx.putImageData(snap, 0, 0);
    }

    function undo() {
        if (historyStack.length <= 1) return;
        const current = historyStack.pop();
        redoStack.push(current);
        restoreHistory();
        updatePlaceholder();
    }

    function redo() {
        if (redoStack.length === 0) return;
        const snap = redoStack.pop();
        historyStack.push(snap);
        manualCtx.putImageData(snap, 0, 0);
        updatePlaceholder();
    }

    function clearCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const w = manualCanvas.width / dpr, h = manualCanvas.height / dpr;
        manualCtx.fillStyle = '#ffffff';
        manualCtx.fillRect(0, 0, w, h);
        historyStack = [];
        redoStack = [];
        pushHistory();
        document.getElementById('canvasPlaceholder').classList.remove('hidden');
    }

    function updatePlaceholder() {
        // 简单判断：历史栈>1 说明有绘制
        if (historyStack.length > 1) {
            document.getElementById('canvasPlaceholder').classList.add('hidden');
        } else {
            document.getElementById('canvasPlaceholder').classList.remove('hidden');
        }
    }

})();
