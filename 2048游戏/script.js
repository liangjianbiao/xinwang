/* ===== 2048 果冻消消乐 — 游戏逻辑 ===== */

const SIZE = 4;
let board = [];          // 二维数组，0=空
let score = 0;
let steps = 0;
let best = parseInt(localStorage.getItem('best_2048') || '0');
let history = [];        // 撤销栈
let canMove = true;
let muted = localStorage.getItem('muted_2048') === '1';

// 音效系统（Web Audio API 程序化合成）
const SFX = (() => {
    let ctx = null, gain = null;
    function ensure() {
        if (!ctx) {
            try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) { return; }
            gain = ctx.createGain();
            gain.gain.value = muted ? 0 : 0.3;
            gain.connect(ctx.destination);
        }
        if (ctx && ctx.state === 'suspended') ctx.resume();
    }
    function tone(freq, dur, type='triangle', peak=0.4) {
        if (!ctx || muted) return;
        const t = ctx.currentTime;
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(gain);
        o.type = type; o.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(peak, t + 0.008);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        o.start(t); o.stop(t + dur + 0.03);
    }
    function play(type) {
        ensure();
        if (!ctx || muted) return;
        switch(type) {
            case 'move':  tone(300, 0.08, 'square', 0.25); break;
            case 'merge': tone(520, 0.12, 'triangle', 0.35); setTimeout(()=>tone(660,0.1,'triangle',0.3),60); break;
            case 'win':   [523,659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,0.15,'triangle',0.4),i*80)); break;
            case 'over':  tone(200,0.3,'sawtooth',0.3); break;
            case 'click': tone(800,0.05,'sine',0.2); break;
        }
    }
    function toggle() { muted = !muted; if(gain) gain.gain.value = muted?0:0.3; localStorage.setItem('muted_2048', muted?'1':'0'); return muted; }
    return { play, toggle, ensure };
})();

// 初始化
function init() {
    document.getElementById('best').textContent = best;
    document.getElementById('sound-icon').textContent = muted ? '🔇' : '🔊';
    newGame();
    bindEvents();
}

function newGame() {
    board = Array.from({length: SIZE}, () => Array(SIZE).fill(0));
    score = 0;
    steps = 0;
    history = [];
    canMove = true;
    addRandomTile();
    addRandomTile();
    updateUI();
    hideOverlay();
    SFX.play('click');
}

function addRandomTile() {
    const empty = [];
    for (let r = 0; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++)
            if (board[r][c] === 0) empty.push([r, c]);
    if (empty.length === 0) return null;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
    return { r, c, value: board[r][c] };
}

// 核心移动逻辑
function move(dir) {
    if (!canMove) return;
    saveState();

    const rotated = rotateBoard(board, dir);
    let moved = false;
    let mergedScore = 0;
    const newTiles = [];
    const mergedTiles = [];

    for (let r = 0; r < SIZE; r++) {
        const row = rotated[r].filter(v => v !== 0);
        const newRow = [];
        for (let i = 0; i < row.length; i++) {
            if (i + 1 < row.length && row[i] === row[i + 1]) {
                const merged = row[i] * 2;
                newRow.push(merged);
                mergedScore += merged;
                mergedTiles.push(merged);
                i++; // 跳过下一个
            } else {
                newRow.push(row[i]);
            }
        }
        while (newRow.length < SIZE) newRow.push(0);
        // 检测是否移动了
        for (let c = 0; c < SIZE; c++) {
            if (rotated[r][c] !== newRow[c]) moved = true;
        }
        rotated[r] = newRow;
    }

    if (!moved) {
        history.pop(); // 没移动，不保存
        return;
    }

    board = rotateBack(rotated, dir);
    score += mergedScore;
    steps++;

    // 新增方块
    const newTile = addRandomTile();
    if (newTile) newTiles.push(newTile);

    updateUI(newTiles, mergedTiles);

    if (mergedScore > 0) SFX.play('merge');
    else SFX.play('move');

    // 胜利检测
    if (!hasWon() && board.flat().includes(2048)) {
        canMove = false;
        setTimeout(() => showOverlay('win'), 300);
        SFX.play('win');
        return;
    }

    // 失败检测
    if (!canMoveAnywhere()) {
        canMove = false;
        setTimeout(() => showOverlay('over'), 300);
        SFX.play('over');
    }
}

// 旋转棋盘使所有方向统一为"向左滑"
function rotateBoard(b, dir) {
    if (dir === 'left') return b.map(r => [...r]);
    if (dir === 'right') return b.map(r => [...r].reverse());
    if (dir === 'up') return rotateLeft(b);
    if (dir === 'down') return rotateRight(b);
}
function rotateBack(b, dir) {
    if (dir === 'left') return b;
    if (dir === 'right') return b.map(r => [...r].reverse());
    if (dir === 'up') return rotateRight(b);
    if (dir === 'down') return rotateLeft(b);
}
function rotateLeft(b) {
    const n = b.length;
    const out = Array.from({length: n}, () => Array(n).fill(0));
    for (let r = 0; r < n; r++)
        for (let c = 0; c < n; c++)
            out[n - 1 - c][r] = b[r][c];
    return out;
}
function rotateRight(b) {
    const n = b.length;
    const out = Array.from({length: n}, () => Array(n).fill(0));
    for (let r = 0; r < n; r++)
        for (let c = 0; c < n; c++)
            out[c][n - 1 - r] = b[r][c];
    return out;
}

function canMoveAnywhere() {
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (board[r][c] === 0) return true;
            if (c + 1 < SIZE && board[r][c] === board[r][c + 1]) return true;
            if (r + 1 < SIZE && board[r][c] === board[r + 1][c]) return true;
        }
    }
    return false;
}

function hasWon() {
    return localStorage.getItem('won_2048') === '1';
}

// 撤销
function saveState() {
    history.push({
        board: board.map(r => [...r]),
        score: score,
        steps: steps
    });
    if (history.length > 10) history.shift();
}

function undo() {
    if (history.length === 0 || !canMove) return;
    const prev = history.pop();
    board = prev.board;
    score = prev.score;
    steps = prev.steps;
    canMove = true;
    updateUI();
    hideOverlay();
    SFX.play('click');
}

// 提示
function showHint() {
    // 找到最佳移动方向
    const dirs = ['up', 'down', 'left', 'right'];
    let bestDir = null;
    let bestScore = -1;
    for (const d of dirs) {
        const test = rotateBoard(board, d);
        let s = 0;
        for (let r = 0; r < SIZE; r++) {
            const row = test[r].filter(v => v !== 0);
            for (let i = 0; i < row.length - 1; i++) {
                if (row[i] === row[i + 1]) { s += row[i] * 2; i++; }
            }
        }
        if (s > bestScore) { bestScore = s; bestDir = d; }
    }
    const arrow = { up: '↑', down: '↓', left: '←', right: '→' };
    showToast('💡 建议：试试 ' + arrow[bestDir] + ' 方向');
    SFX.play('click');
}

// UI 更新
function updateUI(newTiles = [], mergedValues = []) {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            const v = board[r][c];
            if (v > 0) {
                const tile = document.createElement('div');
                tile.className = 'tile tile-' + (v <= 2048 ? v : 'super');
                tile.textContent = v;
                if (newTiles.some(t => t.r === r && t.c === c)) {
                    tile.classList.add('tile-new');
                }
                if (mergedValues.includes(v)) {
                    tile.classList.add('tile-merged');
                    mergedValues.splice(mergedValues.indexOf(v), 1);
                }
                cell.appendChild(tile);
            }
            boardEl.appendChild(cell);
        }
    }
    document.getElementById('score').textContent = score;
    document.getElementById('steps').textContent = steps;
    if (score > best) {
        best = score;
        localStorage.setItem('best_2048', best);
        document.getElementById('best').textContent = best;
    }
}

// 弹窗
function showOverlay(type) {
    const overlay = document.getElementById('overlay');
    const title = document.getElementById('overlay-title');
    const msg = document.getElementById('overlay-msg');
    const stars = document.getElementById('overlay-stars');
    const scoreEl = document.getElementById('overlay-score');

    scoreEl.textContent = score;

    if (type === 'win') {
        title.textContent = '🎉 恭喜通关！';
        msg.innerHTML = '你合成了 <span style="font-weight:800;color:#FF6B9D">2048</span> 果冻！';
        localStorage.setItem('won_2048', '1');
    } else {
        title.textContent = '😅 再来一次！';
        msg.innerHTML = '没有可移动的果冻了';
    }

    // 星级评定
    let starCount = 1;
    if (score >= 5000) starCount = 3;
    else if (score >= 2000) starCount = 2;
    stars.textContent = '⭐'.repeat(starCount) + '☆'.repeat(3 - starCount);

    overlay.classList.add('show');
}

function hideOverlay() {
    document.getElementById('overlay').classList.remove('show');
}

// Toast
function showToast(msg) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(91,74,122,0.9);color:#fff;padding:12px 24px;border-radius:18px;font-size:15px;z-index:200;opacity:0;transition:opacity 0.3s;pointer-events:none;';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.style.opacity = '0', 1500);
}

// 事件绑定
function bindEvents() {
    // 键盘
    document.addEventListener('keydown', e => {
        const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
                      w: 'up', s: 'down', a: 'left', d: 'right',
                      W: 'up', S: 'down', A: 'left', D: 'right' };
        if (map[e.key]) { e.preventDefault(); move(map[e.key]); }
        if (e.key === 'z' || e.key === 'Z') undo();
    });

    // 触摸滑动
    const boardEl = document.getElementById('board');
    let startX = 0, startY = 0, startT = 0;
    boardEl.addEventListener('touchstart', e => {
        const t = e.touches[0];
        startX = t.clientX; startY = t.clientY; startT = Date.now();
    }, { passive: true });
    boardEl.addEventListener('touchend', e => {
        const t = e.changedTouches[0];
        const dx = t.clientX - startX;
        const dy = t.clientY - startY;
        const dt = Date.now() - startT;
        if (dt > 800) return;
        const absX = Math.abs(dx), absY = Math.abs(dy);
        if (Math.max(absX, absY) < 25) return;
        if (absX > absY) move(dx > 0 ? 'right' : 'left');
        else move(dy > 0 ? 'down' : 'up');
    }, { passive: true });

    // 鼠标拖拽（桌面端）
    let mStartX = 0, mStartY = 0, mDown = false;
    boardEl.addEventListener('mousedown', e => { mDown = true; mStartX = e.clientX; mStartY = e.clientY; });
    boardEl.addEventListener('mouseup', e => {
        if (!mDown) return; mDown = false;
        const dx = e.clientX - mStartX, dy = e.clientY - mStartY;
        const absX = Math.abs(dx), absY = Math.abs(dy);
        if (Math.max(absX, absY) < 25) return;
        if (absX > absY) move(dx > 0 ? 'right' : 'left');
        else move(dy > 0 ? 'down' : 'up');
    });

    // 按钮
    document.getElementById('btn-new').addEventListener('click', () => { newGame(); });
    document.getElementById('btn-undo').addEventListener('click', undo);
    document.getElementById('btn-hint').addEventListener('click', showHint);
    document.getElementById('overlay-btn').addEventListener('click', () => { newGame(); });
    document.getElementById('sound-btn').addEventListener('click', () => {
        const m = SFX.toggle();
        document.getElementById('sound-icon').textContent = m ? '🔇' : '🔊';
    });

    // 返回顶部
    const backBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) backBtn.classList.add('show');
        else backBtn.classList.remove('show');
    });
    backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // 阻止页面滚动
    document.addEventListener('touchmove', e => {
        if (e.target.closest('.board')) e.preventDefault();
    }, { passive: false });
}

// 启动
window.addEventListener('DOMContentLoaded', init);
