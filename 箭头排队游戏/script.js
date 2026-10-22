/* ===== 箭头排队游戏 - 核心逻辑 ===== */

(() => {
    'use strict';

    /* ---------- 卡通色彩 ---------- */
    const COLORS = {
        pink:    { main: '#ff6b9d', light: '#ffd6e4', dark: '#d84a7a' },
        orange:  { main: '#ff9f43', light: '#ffe0c0', dark: '#d87a20' },
        yellow:  { main: '#ffd93d', light: '#fff0a8', dark: '#d8b620' },
        green:   { main: '#6bcf7f', light: '#d0f0d8', dark: '#4aa05a' },
        blue:    { main: '#4d96ff', light: '#c6deff', dark: '#2060cc' },
        purple:  { main: '#a855f7', light: '#e3d0ff', dark: '#8030cc' }
    };

    const DIRS = {
        up:    { dr: -1, dc:  0 },
        down:  { dr:  1, dc:  0 },
        left:  { dr:  0, dc: -1 },
        right: { dr:  0, dc:  1 }
    };
    const DIR_KEYS = Object.keys(DIRS);

    /* ---------- 关卡 ---------- */
    const LEVELS = [
        {
            name: '💖 爱心',
            size: 5, time: 75,
            pattern: [
                '. P . P .',
                'P Y P Y .',
                '. P Y P .',
                '. . P . .',
                '. . . . .'
            ]
        },
        {
            name: '⭐ 星星',
            size: 5, time: 85,
            pattern: [
                '. . Y . .',
                '. P Y P .',
                'P Y G Y P',
                '. P . P .',
                '. . P . .'
            ]
        },
        {
            name: '🏠 小屋',
            size: 6, time: 110,
            pattern: [
                '. . P P . .',
                '. P . . P .',
                '. . P P . .',
                'G G . G G .',
                'G . . . G .',
                '. . . . . .'
            ]
        },
        {
            name: '🐟 小鱼',
            size: 6, time: 120,
            pattern: [
                '. . . . . .',
                '. . B B . .',
                '. B Y B . .',
                'B Y Y B . .',
                '. B B . . .',
                '. . . . . .'
            ]
        },
        {
            name: '🚀 火箭',
            size: 7, time: 140,
            pattern: [
                '. . . Y . . .',
                '. . P P . . .',
                '. P G P . . .',
                '. . P . . . .',
                '. B B B . . .',
                'B . . . B . .',
                '. . O O . . .'
            ]
        },
        {
            name: '🌈 彩虹',
            size: 7, time: 150,
            pattern: [
                '. . P P . . .',
                '. P O O P . .',
                'P O Y Y O P .',
                '. . G G . . .',
                '. . B B . . .',
                '. . U U . . .',
                '. . . . . . .'
            ]
        }
    ];

    const CHAR_TO_COLOR = {
        P: 'pink', O: 'orange', Y: 'yellow',
        G: 'green', B: 'blue',  U: 'purple'
    };

    function parsePattern(pattern) {
        const cells = [];
        pattern.forEach((rowStr, r) => {
            const cols = rowStr.split(/\s+/);
            cols.forEach((ch, c) => {
                if (ch === '.' || ch === '') return;
                const color = CHAR_TO_COLOR[ch.toUpperCase()];
                if (color) cells.push({ row: r, col: c, color });
            });
        });
        return cells;
    }

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    /* ---------- 状态 ---------- */
    const state = {
        levelIndex: 0,
        gridSize: 0,
        arrows: [],
        targets: [],
        moves: 0,
        timeLeft: 0,
        timerId: null,
        playing: false,
        selectedArrowId: null,
        cellSize: 0,
        boardPx: 0,
        animating: false
    };

    const boardCanvas = document.getElementById('boardCanvas');
    const targetCanvas = document.getElementById('targetCanvas');
    const boardCtx = boardCanvas.getContext('2d');
    const targetCtx = targetCanvas.getContext('2d');

    function resizeCanvas() {
        const wrap = boardCanvas.parentElement;
        const size = wrap.clientWidth - 28;
        const dpr = window.devicePixelRatio || 1;
        boardCanvas.width = size * dpr;
        boardCanvas.height = size * dpr;
        boardCanvas.style.width = size + 'px';
        boardCanvas.style.height = size + 'px';
        boardCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        state.boardPx = size;
        state.cellSize = size / state.gridSize;

        const tdpr = window.devicePixelRatio || 1;
        targetCanvas.width = 180 * tdpr;
        targetCanvas.height = 180 * tdpr;
        targetCtx.setTransform(tdpr, 0, 0, tdpr, 0, 0);
    }

    /* ---------- 关卡加载 ---------- */
    function loadLevel(idx) {
        state.levelIndex = idx;
        const lv = LEVELS[idx];
        state.gridSize = lv.size;
        state.moves = 0;
        state.timeLeft = lv.time;
        state.playing = false;
        state.selectedArrowId = null;
        state.animating = false;

        const cells = parsePattern(lv.pattern);
        state.targets = cells.map(c => ({ ...c }));

        const positions = [];
        for (let r = 0; r < lv.size; r++)
            for (let c = 0; c < lv.size; c++)
                positions.push({ row: r, col: c });
        shuffle(positions);

        const targetSet = new Set(cells.map(c => c.row + ',' + c.col));
        const freePos = positions.filter(p => !targetSet.has(p.row + ',' + p.col));

        state.arrows = cells.map((t, i) => {
            const pos = freePos[i] || freePos[0] || { row: 0, col: 0 };
            return {
                id: i,
                row: pos.row,
                col: pos.col,
                color: t.color,
                dir: pick(DIR_KEYS)
            };
        });

        updateHUD();
        resizeCanvas();
        draw();
        drawTarget();
        showLevelModal();
    }

    function startLevel() {
        state.playing = true;
        state.timerId = setInterval(tick, 1000);
    }

    function tick() {
        state.timeLeft--;
        if (state.timeLeft <= 0) {
            state.timeLeft = 0;
            stopTimer();
            showModal('modalLose');
        }
        updateHUD();
    }

    function stopTimer() {
        if (state.timerId) clearInterval(state.timerId);
        state.timerId = null;
    }

    function updateHUD() {
        document.getElementById('hudLevel').textContent = state.levelIndex + 1;
        document.getElementById('hudTime').textContent = state.timeLeft;
        document.getElementById('hudMoves').textContent = state.moves;

        const done = countMatched();
        const total = state.targets.length;
        document.getElementById('hudTodo').textContent = done + ' / ' + total;

        const timeEl = document.querySelector('.hud-time');
        if (state.timeLeft <= 10 && state.playing) timeEl.classList.add('warning');
        else timeEl.classList.remove('warning');
    }

    function countMatched() {
        let count = 0;
        for (const t of state.targets) {
            const arr = state.arrows.find(a => a.row === t.row && a.col === t.col && a.color === t.color);
            if (arr) count++;
        }
        return count;
    }

    function isWin() {
        for (const t of state.targets) {
            const arr = state.arrows.find(a => a.row === t.row && a.col === t.col && a.color === t.color);
            if (!arr) return false;
        }
        return true;
    }

    function arrowAt(row, col) {
        return state.arrows.find(a => a.row === row && a.col === col);
    }
    function targetAt(row, col) {
        return state.targets.find(t => t.row === row && t.col === col);
    }

    /* ---------- 排队推动 ---------- */
    function computePushMoves(arrowId, dirKey) {
        const d = DIRS[dirKey];
        const snapshot = state.arrows.map(a => ({ ...a }));
        const grid = {};
        snapshot.forEach(a => { grid[a.row + ',' + a.col] = a; });

        function occupantAt(r, c) {
            if (r < 0 || r >= state.gridSize || c < 0 || c >= state.gridSize) return null;
            return grid[r + ',' + c] || null;
        }

        function tryPushOne(a) {
            const nr = a.row + d.dr, nc = a.col + d.dc;
            if (nr < 0 || nr >= state.gridSize || nc < 0 || nc >= state.gridSize) return false;
            const ahead = occupantAt(nr, nc);
            if (ahead && ahead.id !== a.id) {
                if (!tryPushOne(ahead)) return false;
            }
            delete grid[a.row + ',' + a.col];
            a.row = nr; a.col = nc;
            grid[a.row + ',' + a.col] = a;
            return true;
        }

        const head = snapshot.find(a => a.id === arrowId);
        if (!head) return [];
        const fromMap = new Map(snapshot.map(a => [a.id, { row: a.row, col: a.col }]));

        let steps = 0;
        while (tryPushOne(head)) {
            steps++;
            if (steps > state.gridSize * state.gridSize * 2) break;
        }

        const moves = [];
        for (const a of snapshot) {
            const from = fromMap.get(a.id);
            if (a.row !== from.row || a.col !== from.col) {
                moves.push({
                    id: a.id,
                    fromRow: from.row, fromCol: from.col,
                    toRow: a.row, toCol: a.col
                });
            }
        }
        return moves;
    }

    /* ---------- 绘制 ---------- */
    function draw() {
        const ctx = boardCtx;
        const S = state.boardPx;
        const N = state.gridSize;
        const cs = state.cellSize;
        ctx.clearRect(0, 0, S, S);

        ctx.fillStyle = '#faf7ff';
        ctx.fillRect(0, 0, S, S);

        for (const t of state.targets) {
            const x = t.col * cs, y = t.row * cs;
            const col = COLORS[t.color];
            ctx.beginPath();
            ctx.arc(x + cs/2, y + cs/2, cs * 0.35, 0, Math.PI * 2);
            ctx.fillStyle = col.light;
            ctx.fill();
            ctx.strokeStyle = col.main;
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 3]);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        ctx.strokeStyle = 'rgba(120,100,180,0.18)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= N; i++) {
            ctx.beginPath(); ctx.moveTo(i * cs, 0); ctx.lineTo(i * cs, S); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i * cs); ctx.lineTo(S, i * cs); ctx.stroke();
        }

        for (const a of state.arrows) {
            if (a.row < 0) continue;
            const x = a.col * cs + cs/2;
            const y = a.row * cs + cs/2;
            const onTarget = !!targetAt(a.row, a.col);
            drawArrow(ctx, x, y, cs * 0.42, a.dir, a.color, onTarget);
        }

        if (state.selectedArrowId !== null) {
            const a = state.arrows.find(a => a.id === state.selectedArrowId);
            if (a && a.row >= 0) {
                ctx.strokeStyle = '#ff6f91';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.roundRect(a.col * cs + 3, a.row * cs + 3, cs - 6, cs - 6, 10);
                ctx.stroke();
            }
        }
    }

    function drawArrow(ctx, cx, cy, size, dirKey, colorKey, onTarget) {
        const col = COLORS[colorKey];
        const angleMap = { right: 0, down: Math.PI/2, left: Math.PI, up: -Math.PI/2 };

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angleMap[dirKey]);

        ctx.shadowColor = 'rgba(0,0,0,0.18)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 2;

        const w = size * 0.75;
        const h = size * 0.55;
        const tipLen = size * 0.55;
        const tipW = size * 0.35;
        const r = h/2;

        ctx.beginPath();
        ctx.moveTo(-w/2 + r, -h/2);
        ctx.lineTo(w/2 - r, -h/2);
        ctx.quadraticCurveTo(w/2, -h/2, w/2, -h/2 + r);
        ctx.lineTo(w/2, h/2 - r);
        ctx.quadraticCurveTo(w/2, h/2, w/2 - r, h/2);
        ctx.lineTo(-w/2 + r, h/2);
        ctx.quadraticCurveTo(-w/2, h/2, -w/2, h/2 - r);
        ctx.lineTo(-w/2, -h/2 + r);
        ctx.quadraticCurveTo(-w/2, -h/2, -w/2 + r, -h/2);
        ctx.lineTo(w/2, -tipW/2);
        ctx.lineTo(w/2 + tipLen, 0);
        ctx.lineTo(w/2, tipW/2);
        ctx.lineTo(w/2, h/2);
        ctx.closePath();

        ctx.shadowColor = 'transparent';

        const grad = ctx.createLinearGradient(0, -h, 0, h);
        grad.addColorStop(0, col.light);
        grad.addColorStop(1, col.main);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.lineJoin = 'miter';
        ctx.lineCap = 'butt';
        ctx.miterLimit = 10;
        ctx.strokeStyle = col.dark;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-w/2 + r*0.5, -h/2 + 2);
        ctx.lineTo(w/4, -h/2 + 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.stroke();

        if (onTarget) {
            ctx.restore();
            ctx.save();
            ctx.translate(cx, cy - size * 0.7);
            ctx.font = (size * 0.35) + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('✨', 0, 0);
        } else {
            ctx.restore();
        }
    }

    function drawArrowAt(ctx, cx, cy, size, dirKey, colorKey) {
        const col = COLORS[colorKey];
        const angleMap = { right: 0, down: Math.PI/2, left: Math.PI, up: -Math.PI/2 };
        const angle = angleMap[dirKey];

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        ctx.shadowColor = 'rgba(0,0,0,0.18)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 2;

        const w = size * 0.75;
        const h = size * 0.55;
        const tipLen = size * 0.55;
        const tipW = size * 0.35;
        const r = h/2;

        ctx.beginPath();
        ctx.moveTo(-w/2 + r, -h/2);
        ctx.lineTo(w/2 - r, -h/2);
        ctx.quadraticCurveTo(w/2, -h/2, w/2, -h/2 + r);
        ctx.lineTo(w/2, h/2 - r);
        ctx.quadraticCurveTo(w/2, h/2, w/2 - r, h/2);
        ctx.lineTo(-w/2 + r, h/2);
        ctx.quadraticCurveTo(-w/2, h/2, -w/2, h/2 - r);
        ctx.lineTo(-w/2, -h/2 + r);
        ctx.quadraticCurveTo(-w/2, -h/2, -w/2 + r, -h/2);
        ctx.lineTo(w/2, -tipW/2);
        ctx.lineTo(w/2 + tipLen, 0);
        ctx.lineTo(w/2, tipW/2);
        ctx.lineTo(w/2, h/2);
        ctx.closePath();

        ctx.shadowColor = 'transparent';

        const grad = ctx.createLinearGradient(0, -h, 0, h);
        grad.addColorStop(0, col.light);
        grad.addColorStop(1, col.main);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.lineJoin = 'miter';
        ctx.lineCap = 'butt';
        ctx.miterLimit = 10;
        ctx.strokeStyle = col.dark;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }

    function drawTarget() {
        const ctx = targetCtx;
        const W = 180, H = 180;
        ctx.clearRect(0, 0, W, H);
        const N = state.gridSize;
        const cs = Math.min(W, H) / (N + 1);
        const offX = (W - N * cs) / 2;
        const offY = (H - N * cs) / 2;

        ctx.fillStyle = '#f5f6ff';
        ctx.fillRect(0, 0, W, H);

        for (const t of state.targets) {
            const cx = offX + t.col * cs + cs/2;
            const cy = offY + t.row * cs + cs/2;
            const col = COLORS[t.color];
            ctx.beginPath();
            ctx.arc(cx, cy, cs * 0.42, 0, Math.PI * 2);
            ctx.fillStyle = col.main;
            ctx.fill();
            ctx.strokeStyle = col.dark;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        ctx.strokeStyle = '#b8b8e0';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(0, 0, W, H);
        ctx.setLineDash([]);
    }

    /* ---------- 交互 ---------- */
    function eventPos(ev) {
        const rect = boardCanvas.getBoundingClientRect();
        const p = ev.touches ? ev.touches[0] : ev;
        return { x: p.clientX - rect.left, y: p.clientY - rect.top };
    }

    function cellFromPos(x, y) {
        const col = Math.floor(x / state.cellSize);
        const row = Math.floor(y / state.cellSize);
        if (row < 0 || row >= state.gridSize || col < 0 || col >= state.gridSize) return null;
        return { row, col };
    }

    let dragArrowId = null;
    let dragStartCell = null;

    boardCanvas.addEventListener('mousedown', onDown);
    boardCanvas.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    boardCanvas.addEventListener('touchstart', onDown, { passive: true });
    boardCanvas.addEventListener('touchmove', onMove, { passive: true });
    boardCanvas.addEventListener('touchend', onUp);

    function onDown(ev) {
        if (!state.playing || state.animating) return;
        ev.preventDefault && ev.preventDefault();
        const { x, y } = eventPos(ev);
        const cell = cellFromPos(x, y);
        if (!cell) return;
        const a = arrowAt(cell.row, cell.col);
        if (!a) {
            state.selectedArrowId = null;
            draw();
            return;
        }
        dragArrowId = a.id;
        dragStartCell = { row: a.row, col: a.col };
        state.selectedArrowId = a.id;
        draw();
    }

    function onMove(ev) {
        if (dragArrowId === null || state.animating) return;
        ev.preventDefault && ev.preventDefault();
    }

    function onUp(ev) {
        if (dragArrowId === null) return;
        if (state.animating) { dragArrowId = null; return; }

        const a = state.arrows.find(a => a.id === dragArrowId);
        if (!a) { dragArrowId = null; return; }

        const { x, y } = eventPos(ev);
        const dx = x - (dragStartCell.col * state.cellSize + state.cellSize/2);
        const dy = y - (dragStartCell.row * state.cellSize + state.cellSize/2);
        const dist = Math.sqrt(dx*dx + dy*dy);

        let dirKey;
        if (dist > 10) {
            if (Math.abs(dx) > Math.abs(dy)) dirKey = dx > 0 ? 'right' : 'left';
            else dirKey = dy > 0 ? 'down' : 'up';
        } else {
            dirKey = a.dir;
        }

        const moves = computePushMoves(a.id, dirKey);
        if (moves.length === 0) { dragArrowId = null; return; }

        state.animating = true;
        animateMoves(moves, dirKey, () => {
            for (const m of moves) {
                const target = state.arrows.find(x => x.id === m.id);
                if (target) {
                    target.row = m.toRow;
                    target.col = m.toCol;
                    if (m.id === a.id) target.dir = dirKey;
                }
            }
            state.moves++;
            state.animating = false;
            updateHUD();
            draw();

            if (isWin()) {
                stopTimer();
                document.getElementById('winStats').textContent =
                    `用时 ${LEVELS[state.levelIndex].time - state.timeLeft} 秒 · ${state.moves} 步`;
                showModal('modalWin');
            }
        });

        dragArrowId = null;
    }

    function animateMoves(moves, dirKey, onDone) {
        const duration = 260;
        const cs = state.cellSize;
        const t0 = performance.now();

        const anims = moves.map(m => ({
            id: m.id,
            color: state.arrows.find(x => x.id === m.id)?.color || 'pink',
            fromRow: m.fromRow, fromCol: m.fromCol,
            toRow: m.toRow, toCol: m.toCol
        }));

        anims.forEach(an => {
            const real = state.arrows.find(x => x.id === an.id);
            if (real) real.row = -999; // 动画期内隐藏
        });

        function step(now) {
            const t = Math.min(1, (now - t0) / duration);
            const e = 1 - Math.pow(1 - t, 3);

            draw();

            for (const an of anims) {
                const cx = (an.fromCol + (an.toCol - an.fromCol) * e) * cs + cs/2;
                const cy = (an.fromRow + (an.toRow - an.fromRow) * e) * cs + cs/2;
                drawArrowAt(boardCtx, cx, cy, cs * 0.42, dirKey, an.color);
            }

            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                for (const an of anims) {
                    const real = state.arrows.find(x => x.id === an.id);
                    if (real) { real.row = an.toRow; real.col = an.toCol; }
                }
                draw();
                onDone();
            }
        }

        requestAnimationFrame(step);
    }

    /* ---------- 弹窗 ---------- */
    function showModal(id) { document.getElementById(id).classList.remove('hidden'); }
    function hideModal(id) { document.getElementById(id).classList.add('hidden'); }

    function showLevelModal() {
        const lv = LEVELS[state.levelIndex];
        document.getElementById('levelEmoji').textContent = lv.name.split(' ')[0];
        document.getElementById('levelTitle').textContent = '第 ' + (state.levelIndex + 1) + ' 关';
        document.getElementById('levelDesc').textContent =
            '把所有箭头挪到目标格，拼出 ' + lv.name.split(' ')[1] + '！';
        document.getElementById('levelTime').textContent = lv.time;
        const cells = parsePattern(lv.pattern);
        const uniqColors = new Set(cells.map(c => c.color));
        document.getElementById('levelColors').textContent = uniqColors.size;
        document.getElementById('levelCount').textContent = cells.length;
        showModal('modalLevel');
    }

    /* ---------- 按钮 ---------- */
    document.getElementById('btnStartLevel').addEventListener('click', () => {
        hideModal('modalLevel');
        startLevel();
    });
    document.getElementById('btnNextLevel').addEventListener('click', () => {
        hideModal('modalWin');
        const next = (state.levelIndex + 1) % LEVELS.length;
        loadLevel(next);
    });
    document.getElementById('btnRetryLevel').addEventListener('click', () => {
        hideModal('modalLose');
        loadLevel(state.levelIndex);
    });
    document.getElementById('btnReset').addEventListener('click', () => {
        if (!state.playing) return;
        loadLevel(state.levelIndex);
    });
    document.getElementById('btnHint').addEventListener('click', () => {
        const wrongTargets = state.targets.filter(t => {
            const arr = state.arrows.find(a => a.row === t.row && a.col === t.col && a.color === t.color);
            return !arr;
        });
        if (wrongTargets.length === 0) return;
        const t = pick(wrongTargets);
        const arr = state.arrows.find(a => a.color === t.color && !(a.row === t.row && a.col === t.col));
        if (arr) {
            state.selectedArrowId = arr.id;
            draw();
        }
    });

    window.addEventListener('resize', () => {
        if (state.gridSize > 0) { resizeCanvas(); draw(); drawTarget(); }
    });

    loadLevel(0);
})();
