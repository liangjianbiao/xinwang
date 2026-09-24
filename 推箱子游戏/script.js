/* =========================================================
 * 音效系统（Web Audio API 程序化合成 —— 不依赖外部音频资源）
 * 触发事件：move / push / goal / wall / undo / click / hint / win / levelup
 * 所有音色软萌（chime / pop），与马卡龙卡通风格对齐
 * ========================================================= */
const SFX = (() => {
    let ctx = null;
    let masterGain = null;
    let muted = localStorage.getItem('sokoban_muted') === '1';
    const lastPlay = {};            // 事件冷却表（防止高频事件叠音失真）

    function ensureCtx() {
        if (!ctx) {
            try {
                ctx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) { return; }
            masterGain = ctx.createGain();
            masterGain.gain.value = muted ? 0 : 0.35;
            masterGain.connect(ctx.destination);
        }
        if (ctx && ctx.state === 'suspended') ctx.resume();
    }

    function play(type) {
        ensureCtx();
        if (!ctx || muted) return;
        // 节流：高频事件（move）70ms，其他 150ms
        const cool = type === 'move' || type === 'push' ? 70 : 150;
        const now = performance.now();
        if (lastPlay[type] && now - lastPlay[type] < cool) return;
        lastPlay[type] = now;

        const t = ctx.currentTime;

        function tone(freq, durMs, opts = {}) {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g); g.connect(masterGain);
            o.type = opts.type || 'triangle';
            if (opts.sweep) {
                o.frequency.setValueAtTime(freq, t);
                o.frequency.exponentialRampToValueAtTime(opts.sweep, t + durMs / 1000);
            } else {
                o.frequency.setValueAtTime(freq, t);
            }
            g.gain.setValueAtTime(0, t);
            g.gain.linearRampToValueAtTime(opts.peak || 0.5, t + 0.008);
            g.gain.exponentialRampToValueAtTime(0.001, t + durMs / 1000);
            o.start(t);
            o.stop(t + durMs / 1000 + 0.03);
        }

        function arp(notes, stepMs, opts = {}) {
            notes.forEach((f, i) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.connect(g); g.connect(masterGain);
                o.type = opts.type || 'triangle';
                const tt = t + (stepMs * i) / 1000;
                o.frequency.setValueAtTime(f, tt);
                g.gain.setValueAtTime(0, tt);
                g.gain.linearRampToValueAtTime(opts.peak || 0.45, tt + 0.008);
                g.gain.exponentialRampToValueAtTime(0.001, tt + stepMs / 1000);
                o.start(tt);
                o.stop(tt + stepMs / 1000 + 0.03);
            });
        }

        switch (type) {
            case 'move':    tone(440, 100, { type: 'square', sweep: 220, peak: 0.45 }); break;
            case 'push':    tone(260, 150, { type: 'triangle', sweep: 160, peak: 0.5 }); break;
            case 'goal':    arp([523, 659, 784], 70, { type: 'triangle' }); break;
            case 'wall':    tone(120, 80,  { type: 'sawtooth', peak: 0.3 }); break;
            case 'undo':    tone(600, 150, { type: 'sine', sweep: 400, peak: 0.35 }); break;
            case 'click':   tone(800, 70,  { type: 'sine', peak: 0.25 }); break;
            case 'hint':    tone(880, 220, { type: 'sine', sweep: 660, peak: 0.3 }); break;
            case 'win':     arp([523, 587, 659, 784, 1047], 100, { type: 'triangle' }); break;
            case 'levelup': arp([392, 523, 659, 784], 80, { type: 'sine' }); break;
        }
    }

    function toggleMute() {
        muted = !muted;
        localStorage.setItem('sokoban_muted', muted ? '1' : '0');
        if (masterGain) masterGain.gain.value = muted ? 0 : 0.35;
        return muted;
    }

    function isMuted() { return muted; }

    return { play, toggleMute, isMuted, ensureCtx };
})();

/* ========================================================= */

const TOTAL_LEVELS = 100;
const levelCache = new Array(TOTAL_LEVELS);

// 懒加载：仅在实际需要时生成关卡，避免页面加载时卡死
function getLevel(index) {
    if (index < 0 || index >= TOTAL_LEVELS) return null;
    if (!levelCache[index]) {
        levelCache[index] = generateLevel(index + 1);
    }
    return levelCache[index];
}

// 反向拉动算法（reverse-pull）：从"已解状态"出发，玩家随机走动并拉动箱子，
// 所得局面必然可解（逆向操作即可还原），无需 BFS 验证，生成极快。
function generateLevel(levelNum) {
    const boxes = Math.min(Math.floor(levelNum / 5) + 1, 8);
    const size = Math.max(6, Math.floor(levelNum / 10) + 5);
    const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];

    // 最多重试 20 次，确保至少有一个箱子被拉离目标点
    for (let attempt = 0; attempt < 20; attempt++) {
        const result = tryGenerateLevel(levelNum, boxes, size, dirs);
        if (result) return result;
    }
    // 极端兜底：返回一个最简单的有效关卡
    return tryGenerateLevel(levelNum, 1, size, dirs) || tryGenerateLevel(1, 1, 6, dirs);
}

function tryGenerateLevel(levelNum, boxes, size, dirs) {
    // 建图：外墙
    const grid = [];
    for (let y = 0; y < size; y++) {
        grid[y] = [];
        for (let x = 0; x < size; x++) {
            grid[y][x] = (y === 0 || y === size - 1 || x === 0 || x === size - 1) ? '#' : '.';
        }
    }

    // 内部格子洗牌
    const interior = [];
    for (let y = 1; y < size - 1; y++)
        for (let x = 1; x < size - 1; x++)
            interior.push({ x, y });
    shuffle(interior);

    // 放目标点，箱子初始放在目标点上（已解状态）
    const targets = [];
    const boxPos = [];
    for (let i = 0; i < boxes; i++) {
        targets.push({ x: interior[i].x, y: interior[i].y });
        boxPos.push({ x: interior[i].x, y: interior[i].y });
    }

    // 玩家初始放在第一个箱子旁边，且反方向也有空地（确保能拉动箱子）
    const firstBox = boxPos[0];
    let player = null;
    for (const [dx, dy] of dirs) {
        const px = firstBox.x + dx, py = firstBox.y + dy;
        const fx = firstBox.x + 2 * dx, fy = firstBox.y + 2 * dy; // 玩家拉动后所在格
        if (px >= 1 && px < size - 1 && py >= 1 && py < size - 1 &&
            fx >= 1 && fx < size - 1 && fy >= 1 && fy < size - 1 &&
            !boxPos.some(b => b.x === px && b.y === py) &&
            !boxPos.some(b => b.x === fx && b.y === fy)) {
            player = { x: px, y: py };
            break;
        }
    }
    if (!player) return null; // 无法放置玩家

    // 第一步：强制拉动第一个箱子（玩家远离箱子方向，拉动箱子到玩家旧位置）
    const pullDir = { dx: player.x - firstBox.x, dy: player.y - firstBox.y };
    // 玩家向远离箱子方向走一步
    const step1x = player.x + pullDir.dx, step1y = player.y + pullDir.dy;
    if (step1x >= 1 && step1x < size - 1 && step1y >= 1 && step1y < size - 1 &&
        grid[step1y][step1x] !== '#' &&
        !boxPos.some(b => b.x === step1x && b.y === step1y)) {
        // 拉动箱子
        boxPos[0] = { x: player.x, y: player.y };
        player = { x: step1x, y: step1y };
    }

    // 后续随机反向拉动
    const reverseMoves = 15 + levelNum * 2;
    for (let step = 0; step < reverseMoves; step++) {
        const [dx, dy] = dirs[Math.floor(Math.random() * 4)];
        const nx = player.x + dx, ny = player.y + dy;

        if (nx < 1 || nx >= size - 1 || ny < 1 || ny >= size - 1) continue;
        if (grid[ny][nx] === '#') continue;
        if (boxPos.some(b => b.x === nx && b.y === ny)) continue;

        // 身后（反方向）有箱子时，概率拉动
        const bx = player.x - dx, by = player.y - dy;
        const bi = boxPos.findIndex(b => b.x === bx && b.y === by);
        if (bi >= 0 && Math.random() < 0.6) {
            boxPos[bi] = { x: player.x, y: player.y };
        }
        player = { x: nx, y: ny };
    }

    // 验证：至少一个箱子不在目标点上（否则关卡无意义/已解）
    const hasUnsolved = boxPos.some(b => !targets.some(t => t.x === b.x && t.y === b.y));
    if (!hasUnsolved) return null; // 重试

    // 确保玩家不在目标点上（loadLevel 仅识别 @，会丢失目标信息）
    if (targets.some(t => t.x === player.x && t.y === player.y)) {
        for (const p of interior) {
            const occupied = boxPos.some(b => b.x === p.x && b.y === p.y) ||
                             targets.some(t => t.x === p.x && t.y === p.y);
            if (!occupied) {
                player = { x: p.x, y: p.y };
                break;
            }
        }
    }

    // 输出地图字符串
    const out = grid.map(r => r.slice());
    for (const t of targets) out[t.y][t.x] = '+';
    for (const b of boxPos) {
        out[b.y][b.x] = (out[b.y][b.x] === '+') ? '*' : '$';
    }
    out[player.y][player.x] = '@';

    return { width: size, height: size, map: out.map(r => r.join('')) };
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

let currentLevel = 0;
let gameMap = [];
let playerPos = { x: 0, y: 0 };
let steps = 0;
let history = [];
let bestScores = {};
let canvas;
let ctx;
let cellSize = 40;

function initGame() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');

    // 静音按钮初始化（用户记忆 + AudioContext 解锁）
    const soundBtn = document.getElementById('btn-sound');
    if (SFX.isMuted()) soundBtn.textContent = '🔇';
    soundBtn.addEventListener('click', () => {
        const m = SFX.toggleMute();
        soundBtn.textContent = m ? '🔇' : '🔊';
        SFX.play('click');
    });
    // 任何用户手势都确保 AudioContext 进入 running（解决浏览器自动播放策略限制）
    document.addEventListener('pointerdown', () => SFX.ensureCtx(), { once: true });

    setupEventListeners();
    loadBestScores();
    loadLevel(currentLevel);
}

function setupEventListeners() {
    document.getElementById('btn-up').addEventListener('click', () => move(0, -1));
    document.getElementById('btn-down').addEventListener('click', () => move(0, 1));
    document.getElementById('btn-left').addEventListener('click', () => move(-1, 0));
    document.getElementById('btn-right').addEventListener('click', () => move(1, 0));
    document.getElementById('btn-undo').addEventListener('click', undoStep);
    document.getElementById('btn-reset').addEventListener('click', resetLevel);
    document.getElementById('btn-hint').addEventListener('click', showHint);
    document.getElementById('btn-restart').addEventListener('click', restartGame);
    document.getElementById('btn-next').addEventListener('click', nextLevel);
    
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                e.preventDefault();
                move(0, -1);
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                e.preventDefault();
                move(0, 1);
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                e.preventDefault();
                move(-1, 0);
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                e.preventDefault();
                move(1, 0);
                break;
            case 'z':
            case 'Z':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    undoStep();
                }
                break;
            case 'r':
            case 'R':
                e.preventDefault();
                resetLevel();
                break;
        }
    });
}

function loadLevel(levelIndex) {
    currentLevel = levelIndex;
    const level = getLevel(currentLevel);
    
    gameMap = [];
    steps = 0;
    history = [];
    
    for (let y = 0; y < level.height; y++) {
        gameMap[y] = [];
        for (let x = 0; x < level.width; x++) {
            const char = level.map[y][x];
            if (char === '@') {
                playerPos = { x, y };
                gameMap[y][x] = '.';
            } else {
                gameMap[y][x] = char;
            }
        }
    }
    
    updateUI();
    drawBoard();
}

function move(dx, dy) {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (!isValidPosition(newX, newY)) return;

    const targetCell = gameMap[newY][newX];

    // 撞墙
    if (targetCell === '#' || targetCell === '%') { SFX.play('wall'); return; }

    if (targetCell === '$' || targetCell === '*') {
        const boxNewX = newX + dx;
        const boxNewY = newY + dy;

        // 箱子后面没空间 —— 算撞墙
        if (!isValidPosition(boxNewX, boxNewY)) { SFX.play('wall'); return; }

        const boxTargetCell = gameMap[boxNewY][boxNewX];
        if (boxTargetCell === '#' || boxTargetCell === '$' || boxTargetCell === '*' || boxTargetCell === '%') { SFX.play('wall'); return; }

        saveHistory();

        const boxLanded = boxTargetCell === '+';      // 箱子是否落到目标点
        gameMap[boxNewY][boxNewX] = boxLanded ? '*' : '$';
        gameMap[newY][newX] = gameMap[newY][newX] === '*' ? '+' : '.';

        SFX.play('push');                              // 推箱基础音
        if (boxLanded) {
            setTimeout(() => SFX.play('goal'), 80);    // 落点星声（叠加）
        }
    } else {
        saveHistory();
        SFX.play('move');                              // 空地走
    }

    const currentCell = gameMap[playerPos.y][playerPos.x];
    gameMap[playerPos.y][playerPos.x] = currentCell === '+' ? '+' : '.';

    playerPos = { x: newX, y: newY };
    const newCell = gameMap[newY][newX];
    gameMap[newY][newX] = newCell === '+' ? '+' : '.';

    steps++;
    updateUI();
    drawBoard();

    checkWin();
}

function isValidPosition(x, y) {
    return y >= 0 && y < gameMap.length && x >= 0 && x < gameMap[0].length;
}

function saveHistory() {
    history.push({
        map: gameMap.map(row => [...row]),
        playerPos: { ...playerPos },
        steps
    });
    
    if (history.length > 100) {
        history.shift();
    }
}

function undoStep() {
    if (history.length === 0) return;

    SFX.play('undo');
    const lastState = history.pop();
    gameMap = lastState.map;
    playerPos = lastState.playerPos;
    steps = lastState.steps;

    updateUI();
    drawBoard();
}

function resetLevel() {
    SFX.play('click');
    loadLevel(currentLevel);
}

function restartGame() {
    SFX.play('click');
    currentLevel = 0;
    loadLevel(currentLevel);
}

function nextLevel() {
    if (currentLevel < TOTAL_LEVELS - 1) {
        SFX.play('levelup');
        currentLevel++;
        loadLevel(currentLevel);
        hideMessage();
    }
}

function checkWin() {
    for (let y = 0; y < gameMap.length; y++) {
        for (let x = 0; x < gameMap[y].length; x++) {
            if (gameMap[y][x] === '$') return;
        }
    }

    saveBestScore();
    SFX.play('win');
    showWinMessage();
}

function saveBestScore() {
    if (!bestScores[currentLevel] || steps < bestScores[currentLevel]) {
        bestScores[currentLevel] = steps;
        localStorage.setItem('sokoban_best', JSON.stringify(bestScores));
    }
}

function loadBestScores() {
    const saved = localStorage.getItem('sokoban_best');
    if (saved) {
        bestScores = JSON.parse(saved);
    }
}

function updateUI() {
    document.getElementById('current-level').textContent = currentLevel + 1;
    document.getElementById('steps').textContent = steps;
    
    let boxes = 0;
    let targets = 0;
    let completed = 0;
    
    for (let y = 0; y < gameMap.length; y++) {
        for (let x = 0; x < gameMap[y].length; x++) {
            const cell = gameMap[y][x];
            if (cell === '$') boxes++;
            if (cell === '+') targets++;
            if (cell === '*') {
                completed++;
                targets++;
            }
        }
    }
    
    document.getElementById('boxes').textContent = completed + '/' + targets;
    document.getElementById('best').textContent = bestScores[currentLevel] || '--';
}

// 绘制木箱风格箱子（圆角主体 + 十字加固带 + 四角铆钉 + 顶部高光）
// onTarget=false 普通箱子（暖棕橙），onTarget=true 已到位（金黄庆祝）
function drawWoodCrate(ctx, px, py, cellSize, onTarget) {
    const pad = 4;
    const x = px + pad, y = py + pad;
    const w = cellSize - pad * 2, h = cellSize - pad * 2;
    const r = 6; // 圆角半径
    ctx.save();

    // 底格
    ctx.fillStyle = onTarget ? '#FFF7D6' : '#F7F1FE';
    ctx.fillRect(px, py, cellSize, cellSize);

    // 圆角矩形路径辅助
    function roundRectPath(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    // 已到位时柔光
    if (onTarget) {
        ctx.shadowColor = '#FFD76E';
        ctx.shadowBlur = 10;
    }

    // 主体渐变
    const grad = ctx.createLinearGradient(x, y, x + w, y + h);
    if (onTarget) {
        grad.addColorStop(0, '#FFE066');
        grad.addColorStop(0.5, '#FFC24D');
        grad.addColorStop(1, '#E8941E');
    } else {
        grad.addColorStop(0, '#E8A55C');
        grad.addColorStop(0.5, '#C97A3A');
        grad.addColorStop(1, '#9E5A24');
    }
    ctx.fillStyle = grad;
    roundRectPath(x, y, w, h, r);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 木纹细节（两条横向浅纹）
    ctx.strokeStyle = onTarget ? 'rgba(232,148,30,0.28)' : 'rgba(80,40,10,0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 3, y + h * 0.38);
    ctx.lineTo(x + w - 3, y + h * 0.38);
    ctx.moveTo(x + 3, y + h * 0.66);
    ctx.lineTo(x + w - 3, y + h * 0.66);
    ctx.stroke();

    // 十字加固带
    ctx.strokeStyle = onTarget ? '#C77E1B' : '#6E3D14';
    ctx.lineWidth = 2.5;
    // 横带
    ctx.beginPath();
    ctx.moveTo(x + 2, y + h / 2);
    ctx.lineTo(x + w - 2, y + h / 2);
    ctx.stroke();
    // 竖带
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y + 2);
    ctx.lineTo(x + w / 2, y + h - 2);
    ctx.stroke();

    // 四角铆钉
    const rivetR = 2.2;
    const rivetOff = 5;
    ctx.fillStyle = onTarget ? '#FFF3C4' : '#FFD9A8';
    const rivets = [
        [x + rivetOff, y + rivetOff],
        [x + w - rivetOff, y + rivetOff],
        [x + rivetOff, y + h - rivetOff],
        [x + w - rivetOff, y + h - rivetOff]
    ];
    for (const [rx, ry] of rivets) {
        ctx.beginPath();
        ctx.arc(rx, ry, rivetR, 0, Math.PI * 2);
        ctx.fill();
    }

    // 顶部高光条
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    roundRectPath(x + 3, y + 2.5, w - 6, 3, 1.5);
    ctx.fill();

    // 已到位：白色对勾
    if (onTarget) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        const cx = x + w / 2, cy = y + h / 2;
        ctx.beginPath();
        ctx.moveTo(cx - 5, cy);
        ctx.lineTo(cx - 1, cy + 4);
        ctx.lineTo(cx + 6, cy - 4);
        ctx.stroke();
    }
    ctx.restore();
}

function drawBoard() {
    const level = getLevel(currentLevel);
    const width = level.width * cellSize;
    const height = level.height * cellSize;
    
    canvas.width = width;
    canvas.height = height;
    
    ctx.fillStyle = '#F7F1FE';
    ctx.fillRect(0, 0, width, height);
    
    for (let y = 0; y < level.height; y++) {
        for (let x = 0; x < level.width; x++) {
            const cell = gameMap[y][x];
            const px = x * cellSize;
            const py = y * cellSize;
            
            switch(cell) {
                case '#':
                    const gradient = ctx.createLinearGradient(px, py, px + cellSize, py + cellSize);
                    gradient.addColorStop(0, '#C0A8F2');
                    gradient.addColorStop(0.5, '#A98CE8');
                    gradient.addColorStop(1, '#8B6FD8');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(px, py, cellSize, cellSize);
                    
                    ctx.fillStyle = '#D9CCF7';
                    ctx.fillRect(px + 2, py + 2, cellSize - 4, 4);
                    ctx.fillRect(px + 2, py + 2, 4, cellSize - 4);
                    
                    ctx.fillStyle = '#7A5FC8';
                    ctx.fillRect(px + cellSize - 6, py + 6, 4, cellSize - 8);
                    ctx.fillRect(px + 6, py + cellSize - 6, cellSize - 12, 4);
                    
                    ctx.fillStyle = '#B79EF0';
                    ctx.fillRect(px + 4, py + 4, cellSize - 8, cellSize - 8);
                    break;
                case '+':
                    ctx.fillStyle = '#FFE9F3';
                    ctx.fillRect(px, py, cellSize, cellSize);
                    
                    if (!(x === playerPos.x && y === playerPos.y)) {
                        ctx.fillStyle = '#FF8FB3';
                        ctx.beginPath();
                        ctx.arc(px + cellSize/2, py + cellSize/2, cellSize/3, 0, Math.PI * 2);
                        ctx.fill();
                        
                        ctx.fillStyle = '#FFD0E1';
                        ctx.beginPath();
                        ctx.arc(px + cellSize/2, py + cellSize/2, cellSize/5, 0, Math.PI * 2);
                        ctx.fill();
                        
                        ctx.shadowColor = '#FF8FB3';
                        ctx.shadowBlur = 8;
                        ctx.fillStyle = '#F06292';
                        ctx.font = 'bold 16px Arial';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText('★', px + cellSize/2, py + cellSize/2);
                        ctx.shadowBlur = 0;
                    }
                    break;
                case '$':
                    drawWoodCrate(ctx, px, py, cellSize, false);
                    break;
                case '*':
                    drawWoodCrate(ctx, px, py, cellSize, true);
                    break;
                default:
                    ctx.fillStyle = '#F7F1FE';
                    ctx.fillRect(px, py, cellSize, cellSize);
            }
            
            ctx.strokeStyle = '#E4D5FA';
            ctx.lineWidth = 1;
            ctx.strokeRect(px, py, cellSize, cellSize);
        }
    }
    
    const px = playerPos.x * cellSize + cellSize / 2;
    const py = playerPos.y * cellSize + cellSize / 2;
    
    // === 马卡龙卡通小人（纯 Canvas 绘制） ===
    const headR = cellSize * 0.35;            // 脑袋半径 ≈ 14px
    const eyeR = headR * 0.18;                 // 瞳孔半径
    const eyeOffX = headR * 0.38;              // 眼睛水平偏移
    const eyeOffY = headR * 0.12;              // 眼睛垂直偏移
    const cheekR = headR * 0.18;               // 腮红半径

    ctx.save();
    // 柔阴影
    ctx.shadowColor = 'rgba(91, 184, 238, 0.45)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;

    // 天蓝渐变圆头
    const headGrad = ctx.createRadialGradient(px - headR * 0.3, py - headR * 0.35, headR * 0.1, px, py, headR);
    headGrad.addColorStop(0, '#7ED8F8');
    headGrad.addColorStop(1, '#4AA7D8');
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.arc(px, py, headR, 0, Math.PI * 2);
    ctx.fill();

    // 白色描边
    ctx.shadowColor = 'transparent';
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    // 高光小月牙
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath();
    ctx.arc(px - headR * 0.35, py - headR * 0.4, headR * 0.28, Math.PI * 1.1, Math.PI * 1.7);
    ctx.lineWidth = headR * 0.14;
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.stroke();

    // 粉色腮红
    ctx.fillStyle = 'rgba(255,143,179,0.55)';
    ctx.beginPath();
    ctx.arc(px - headR * 0.55, py + headR * 0.12, cheekR, 0, Math.PI * 2);
    ctx.arc(px + headR * 0.55, py + headR * 0.12, cheekR, 0, Math.PI * 2);
    ctx.fill();

    // 白眼球
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(px - eyeOffX, py - eyeOffY, eyeR * 1.5, 0, Math.PI * 2);
    ctx.arc(px + eyeOffX, py - eyeOffY, eyeR * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // 黑色瞳孔（带高光）
    ctx.fillStyle = '#2A3C5A';
    ctx.beginPath();
    ctx.arc(px - eyeOffX + 1, py - eyeOffY, eyeR, 0, Math.PI * 2);
    ctx.arc(px + eyeOffX + 1, py - eyeOffY, eyeR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(px - eyeOffX + 1 - eyeR * 0.35, py - eyeOffY - eyeR * 0.3, eyeR * 0.35, 0, Math.PI * 2);
    ctx.arc(px + eyeOffX + 1 - eyeR * 0.35, py - eyeOffY - eyeR * 0.3, eyeR * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // 弯弯笑嘴
    ctx.strokeStyle = '#2A3C5A';
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(px, py + headR * 0.05, headR * 0.4, Math.PI * 0.15, Math.PI * 0.85);
    ctx.stroke();

    ctx.restore();
}

function showHint() {
    SFX.play('hint');
    alert('提示：尝试将箱子推到目标位置！使用方向键或点击方向按钮移动。');
}

function showWinMessage() {
    const stars = steps <= (bestScores[currentLevel] || steps * 2) * 1.5 ? '⭐⭐⭐' : steps <= (bestScores[currentLevel] || steps * 2) * 2 ? '⭐⭐' : '⭐';
    document.getElementById('message-icon').textContent = '🎉';
    document.getElementById('message-title').textContent = '恭喜过关！';
    document.getElementById('message-text').textContent = `太棒了！用了 ${steps} 步完成！`;
    document.getElementById('message-stars').textContent = stars;
    document.getElementById('message-overlay').classList.add('show');
    
    if (currentLevel >= TOTAL_LEVELS - 1) {
        document.getElementById('btn-next').textContent = '重新开始';
        document.getElementById('btn-next').onclick = restartGame;
    } else {
        document.getElementById('btn-next').textContent = '下一关 →';
        document.getElementById('btn-next').onclick = nextLevel;
    }
}

function hideMessage() {
    document.getElementById('message-overlay').classList.remove('show');
}

window.addEventListener('load', initGame);