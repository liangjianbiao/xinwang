const levels = [
    {
        name: "初出陈塘关",
        gridSize: { rows: 6, cols: 6 },
        start: { row: 5, col: 1 },
        end: { row: 0, col: 4 },
        dots: [
            { row: 5, col: 1 },
            { row: 5, col: 2 },
            { row: 4, col: 2 },
            { row: 4, col: 1 },
            { row: 3, col: 1 },
            { row: 3, col: 3 },
            { row: 2, col: 3 },
            { row: 2, col: 4 },
            { row: 1, col: 4 },
            { row: 0, col: 4 }
        ],
        obstacles: [
            { row: 0, col: 1 },
            { row: 1, col: 2 },
            { row: 2, col: 1 },
            { row: 3, col: 4 },
            { row: 4, col: 4 },
            { row: 5, col: 4 }
        ],
        directions: ['→', '↑', '←', '↑', '→', '↑', '→', '↑', '↑']
    },
    {
        name: "迷雾山林",
        gridSize: { rows: 5, cols: 5 },
        start: { row: 1, col: 3 },
        end: { row: 4, col: 1 },
        dots: [
            { row: 1, col: 3 },
            { row: 1, col: 2 },
            { row: 1, col: 1 },
            { row: 2, col: 1 },
            { row: 3, col: 1 },
            { row: 4, col: 1 }
        ],
        obstacles: [
            { row: 0, col: 2 },
            { row: 2, col: 3 },
            { row: 3, col: 2 },
            { row: 4, col: 3 }
        ],
        directions: ['←', '←', '↓', '↓', '↓']
    },
    {
        name: "九曲黄河",
        gridSize: { rows: 6, cols: 6 },
        start: { row: 3, col: 1 },
        end: { row: 4, col: 4 },
        dots: [
            { row: 3, col: 1 },
            { row: 3, col: 2 },
            { row: 3, col: 3 },
            { row: 3, col: 4 },
            { row: 4, col: 4 }
        ],
        obstacles: [
            { row: 2, col: 2 },
            { row: 4, col: 2 },
            { row: 5, col: 3 },
            { row: 1, col: 3 }
        ],
        directions: ['→', '→', '→', '↓']
    },
    {
        name: "烽火台",
        gridSize: { rows: 5, cols: 6 },
        start: { row: 0, col: 3 },
        end: { row: 4, col: 0 },
        dots: [
            { row: 0, col: 3 },
            { row: 0, col: 2 },
            { row: 1, col: 2 },
            { row: 1, col: 1 },
            { row: 2, col: 1 },
            { row: 3, col: 1 },
            { row: 3, col: 0 },
            { row: 4, col: 0 }
        ],
        obstacles: [
            { row: 0, col: 1 },
            { row: 2, col: 2 },
            { row: 3, col: 2 },
            { row: 4, col: 2 }
        ],
        directions: ['←', '↓', '←', '↓', '↓', '←', '↓']
    },
    {
        name: "陈塘关城门",
        gridSize: { rows: 6, cols: 6 },
        start: { row: 5, col: 4 },
        end: { row: 0, col: 2 },
        dots: [
            { row: 5, col: 4 },
            { row: 4, col: 4 },
            { row: 4, col: 3 },
            { row: 4, col: 2 },
            { row: 3, col: 2 },
            { row: 2, col: 2 },
            { row: 1, col: 2 },
            { row: 0, col: 2 }
        ],
        obstacles: [
            { row: 5, col: 2 },
            { row: 3, col: 3 },
            { row: 2, col: 3 },
            { row: 1, col: 3 }
        ],
        directions: ['↑', '←', '←', '↑', '↑', '↑', '↑']
    },
    {
        name: "龙王庙",
        gridSize: { rows: 5, cols: 5 },
        start: { row: 2, col: 0 },
        end: { row: 3, col: 4 },
        dots: [
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
            { row: 3, col: 2 },
            { row: 3, col: 3 },
            { row: 3, col: 4 }
        ],
        obstacles: [
            { row: 1, col: 1 },
            { row: 2, col: 3 },
            { row: 4, col: 2 },
            { row: 0, col: 2 }
        ],
        directions: ['→', '→', '↓', '→', '→']
    },
    {
        name: "东海龙宫",
        gridSize: { rows: 6, cols: 7 },
        start: { row: 1, col: 5 },
        end: { row: 5, col: 3 },
        dots: [
            { row: 1, col: 5 },
            { row: 1, col: 4 },
            { row: 2, col: 4 },
            { row: 2, col: 3 },
            { row: 3, col: 3 },
            { row: 4, col: 3 },
            { row: 5, col: 3 }
        ],
        obstacles: [
            { row: 0, col: 4 },
            { row: 1, col: 3 },
            { row: 3, col: 4 },
            { row: 4, col: 4 }
        ],
        directions: ['←', '↓', '←', '↓', '↓', '↓']
    },
    {
        name: "南天门",
        gridSize: { rows: 6, cols: 6 },
        start: { row: 5, col: 0 },
        end: { row: 0, col: 5 },
        dots: [
            { row: 5, col: 0 },
            { row: 4, col: 0 },
            { row: 4, col: 1 },
            { row: 4, col: 2 },
            { row: 3, col: 2 },
            { row: 2, col: 2 },
            { row: 2, col: 3 },
            { row: 2, col: 4 },
            { row: 1, col: 4 },
            { row: 0, col: 4 },
            { row: 0, col: 5 }
        ],
        obstacles: [
            { row: 3, col: 1 },
            { row: 2, col: 1 },
            { row: 1, col: 2 },
            { row: 0, col: 3 }
        ],
        directions: ['↑', '→', '→', '↑', '↑', '→', '→', '↑', '↑', '→']
    },
    {
        name: "九曲回廊",
        gridSize: { rows: 7, cols: 5 },
        start: { row: 0, col: 1 },
        end: { row: 6, col: 3 },
        dots: [
            { row: 0, col: 1 },
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 2, col: 2 },
            { row: 3, col: 2 },
            { row: 3, col: 1 },
            { row: 4, col: 1 },
            { row: 4, col: 2 },
            { row: 4, col: 3 },
            { row: 5, col: 3 },
            { row: 6, col: 3 }
        ],
        obstacles: [
            { row: 0, col: 2 },
            { row: 2, col: 1 },
            { row: 3, col: 3 },
            { row: 5, col: 2 }
        ],
        directions: ['↓', '→', '↓', '↓', '←', '↓', '→', '→', '↓', '↓']
    },
    {
        name: "激战石矶",
        gridSize: { rows: 7, cols: 7 },
        start: { row: 6, col: 2 },
        end: { row: 1, col: 5 },
        dots: [
            { row: 6, col: 2 },
            { row: 6, col: 3 },
            { row: 5, col: 3 },
            { row: 5, col: 4 },
            { row: 4, col: 4 },
            { row: 4, col: 3 },
            { row: 3, col: 3 },
            { row: 3, col: 4 },
            { row: 3, col: 5 },
            { row: 2, col: 5 },
            { row: 1, col: 5 }
        ],
        obstacles: [
            { row: 6, col: 4 },
            { row: 5, col: 2 },
            { row: 4, col: 5 },
            { row: 3, col: 2 },
            { row: 2, col: 4 },
            { row: 1, col: 4 }
        ],
        directions: ['→', '↑', '→', '↑', '←', '↑', '→', '→', '↑', '↑']
    }
];

/* =========================================================
 * 第 11-30 关：种子程序化生成
 * 用固定种子 + 带回溯的 DFS 生成自避路径，保证：
 *   1) 每次进入同一关布局完全一致（可复现）
 *   2) dots 相邻必为上下左右一步，路径不重复经过格子
 *   3) 云朵障碍只落在路径之外的格子
 * 难度三维递增：网格 7×7 → 8×8、步数 10 → 22、云朵 5 → 12
 * ========================================================= */
const extraNames = [
    "翠屏山行宫", "乾元金光洞", "骷髅白骨洞", "东海之滨", "水晶宫阙",
    "汜水关隘", "界牌雄关", "穿云险关", "临潼关道", "潼关古道",
    "青龙关前", "佳梦迷关", "诛仙阵门", "万仙大阵", "南天门阙",
    "瑶池仙境", "凌霄宝殿", "九龙神火罩", "混元金斗阵", "封神大典"
];

// 每项：[行数, 列数, 路径步数, 云朵数]
const extraSpecs = [
    [7, 7, 10, 5], [7, 7, 11, 6], [7, 7, 12, 6], [7, 7, 12, 7], [7, 7, 13, 7],
    [7, 8, 13, 7], [7, 8, 14, 8], [8, 8, 14, 8], [8, 8, 15, 8], [8, 8, 15, 9],
    [8, 8, 16, 9], [8, 8, 16, 10], [8, 8, 17, 10], [8, 8, 18, 10], [8, 8, 18, 11],
    [8, 8, 19, 11], [8, 8, 20, 11], [8, 8, 20, 12], [8, 8, 21, 12], [8, 8, 22, 12]
];

function mulberry32(seed) {
    return function () {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function shuffleArr(arr, rand) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// 随机起点 + 带回溯 DFS，生成恰好 stepCount 步的自避路径；失败换起点重试
function genPath(rows, cols, stepCount, rand) {
    for (let attempt = 0; attempt < 80; attempt++) {
        const sr = Math.floor(rand() * rows);
        const sc = Math.floor(rand() * cols);
        const used = new Set([sr + ',' + sc]);
        const path = [{ row: sr, col: sc }];

        (function dfs(r, c) {
            if (path.length === stepCount + 1) return true;
            const dirs = shuffleArr([[0, 1], [0, -1], [1, 0], [-1, 0]], rand);
            for (const [dr, dc] of dirs) {
                const nr = r + dr, nc = c + dc;
                if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
                const key = nr + ',' + nc;
                if (used.has(key)) continue;
                used.add(key);
                path.push({ row: nr, col: nc });
                if (dfs(nr, nc)) return true;
                used.delete(key);
                path.pop();
            }
            return false;
        })(sr, sc);

        if (path.length === stepCount + 1) return path;
    }
    return null;
}

function buildExtraLevel(index) {
    const [rows, cols, steps, obstacleCount] = extraSpecs[index];
    const rand = mulberry32(20260924 + index * 7919);
    const path = genPath(rows, cols, steps, rand);

    // 云朵只放在路径之外的格子上
    const used = new Set(path.map(p => p.row + ',' + p.col));
    const free = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!used.has(r + ',' + c)) free.push({ row: r, col: c });
        }
    }
    shuffleArr(free, rand);
    const obstacles = free.slice(0, obstacleCount);

    const arrowOf = (a, b) => {
        if (b.row < a.row) return '↑';
        if (b.row > a.row) return '↓';
        return b.col > a.col ? '→' : '←';
    };
    const directions = [];
    for (let i = 1; i < path.length; i++) directions.push(arrowOf(path[i - 1], path[i]));

    return {
        name: extraNames[index],
        gridSize: { rows, cols },
        start: path[0],
        end: path[path.length - 1],
        dots: path,
        obstacles,
        directions
    };
}

for (let i = 0; i < extraSpecs.length; i++) {
    levels.push(buildExtraLevel(i));
}

let currentLevel = 0;
let selectedDots = [];
let canvas;
let ctx;
let cellSize = 60;
let padding = 20;

function initGame() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    setupEventListeners();
    loadLevel(currentLevel);
}

function setupEventListeners() {
    canvas.addEventListener('click', handleCanvasClick);
    document.getElementById('btn-restart').addEventListener('click', () => {
        currentLevel = 0;
        loadLevel(currentLevel);
    });
    document.getElementById('btn-undo').addEventListener('click', undoStep);
    document.getElementById('btn-reset').addEventListener('click', resetLevel);
    document.getElementById('btn-hint').addEventListener('click', showHint);
    document.getElementById('btn-next').addEventListener('click', nextLevel);
}

function loadLevel(levelIndex) {
    currentLevel = levelIndex;
    selectedDots = [];
    
    const level = levels[levelIndex];
    updateLevelInfo();
    updateHintsGrid();
    resizeCanvas();
    drawBoard();
    
    document.getElementById('message-overlay').classList.remove('show');
}

function updateLevelInfo() {
    document.getElementById('current-level').textContent = currentLevel + 1;
}

function updateHintsGrid() {
    const level = levels[currentLevel];
    const grid = document.getElementById('hints-grid');
    grid.innerHTML = '';
    
    level.directions.forEach((dir, index) => {
        const item = document.createElement('div');
        item.className = 'hint-item';
        item.innerHTML = `
            <span class="hint-number">${index + 1}</span>
            <span class="hint-direction">${dir}</span>
        `;
        grid.appendChild(item);
    });
}

function resizeCanvas() {
    const level = levels[currentLevel];
    // 网格越大单元格越小，棋盘逻辑宽度保持 ~440px
    cellSize = Math.floor((440 - padding * 2) / Math.max(level.gridSize.rows, level.gridSize.cols));
    const width = level.gridSize.cols * cellSize + padding * 2;
    const height = level.gridSize.rows * cellSize + padding * 2;
    canvas.width = width;
    canvas.height = height;
}

function drawBoard() {
    const level = levels[currentLevel];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#F7F1FE';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < level.gridSize.rows; row++) {
        for (let col = 0; col < level.gridSize.cols; col++) {
            const x = padding + col * cellSize;
            const y = padding + row * cellSize;

            ctx.strokeStyle = '#E4D5FA';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, cellSize, cellSize);
        }
    }

    ctx.shadowColor = 'rgba(150, 180, 230, 0.35)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;
    level.obstacles.forEach(obs => {
        const cx = padding + (obs.col + 0.5) * cellSize;
        const cy = padding + (obs.row + 0.5) * cellSize;
        ctx.fillStyle = '#D6ECFC';
        ctx.beginPath();
        ctx.arc(cx, cy, cellSize * 0.32, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = Math.floor(cellSize * 0.5) + 'px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('☁️', cx, cy);
    });
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    ctx.shadowColor = 'rgba(180, 140, 220, 0.35)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;
    level.dots.forEach((dot, index) => {
        const x = padding + dot.col * cellSize + cellSize / 2;
        const y = padding + dot.row * cellSize + cellSize / 2;
        const radius = cellSize * 0.23;

        const isSelected = selectedDots.includes(index);
        const isCurrentTarget = selectedDots.length === index;

        if (isSelected) {
            ctx.fillStyle = '#FF6B9D';
        } else if (isCurrentTarget) {
            ctx.fillStyle = '#FFB061';
        } else {
            ctx.fillStyle = '#B9A3E3';
        }
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold ' + Math.floor(cellSize * 0.33) + 'px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(index + 1, x, y);
    });
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    const startX = padding + level.start.col * cellSize + cellSize / 2;
    const startY = padding + level.start.row * cellSize + cellSize / 2;
    ctx.font = Math.floor(cellSize * 0.55) + 'px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🧒', startX - cellSize * 0.17, startY + cellSize * 0.12);

    const endX = padding + level.end.col * cellSize + cellSize / 2;
    const endY = padding + level.end.row * cellSize + cellSize / 2;
    ctx.fillText('🔪', endX - cellSize * 0.17, endY + cellSize * 0.12);
    
    drawLines();
}

function drawLines() {
    if (selectedDots.length < 2) return;
    
    ctx.strokeStyle = '#FF6B9D';
    ctx.lineWidth = Math.max(3, cellSize * 0.08);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(255, 107, 157, 0.45)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;

    ctx.beginPath();
    selectedDots.forEach((dotIndex, index) => {
        const dot = levels[currentLevel].dots[dotIndex];
        const x = padding + dot.col * cellSize + cellSize / 2;
        const y = padding + dot.row * cellSize + cellSize / 2;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
}

function handleCanvasClick(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    const level = levels[currentLevel];
    const dotIndex = findClickedDot(x, y, level);
    
    if (dotIndex !== -1) {
        if (dotIndex === selectedDots.length) {
            selectedDots.push(dotIndex);
            drawBoard();
            
            if (selectedDots.length === level.dots.length) {
                showSuccess();
            }
        } else if (selectedDots.includes(dotIndex)) {
            selectedDots = selectedDots.slice(0, selectedDots.indexOf(dotIndex));
            drawBoard();
        }
    }
}

function findClickedDot(x, y, level) {
    const clickRadius = cellSize * 0.5;
    for (let i = 0; i < level.dots.length; i++) {
        const dot = level.dots[i];
        const dotX = padding + dot.col * cellSize + cellSize / 2;
        const dotY = padding + dot.row * cellSize + cellSize / 2;
        
        const distance = Math.sqrt(Math.pow(x - dotX, 2) + Math.pow(y - dotY, 2));
        if (distance <= clickRadius) {
            return i;
        }
    }
    return -1;
}

function undoStep() {
    if (selectedDots.length > 0) {
        selectedDots.pop();
        drawBoard();
    }
}

function resetLevel() {
    selectedDots = [];
    drawBoard();
}

function showHint() {
    const level = levels[currentLevel];
    const nextIndex = selectedDots.length;
    
    if (nextIndex < level.dots.length) {
        const hintDot = level.dots[nextIndex];
        const x = padding + hintDot.col * cellSize + cellSize / 2;
        const y = padding + hintDot.row * cellSize + cellSize / 2;
        
        ctx.fillStyle = 'rgba(255, 194, 77, 0.35)';
        ctx.beginPath();
        ctx.arc(x, y, cellSize * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        setTimeout(() => {
            drawBoard();
        }, 1000);
    }
}

function showSuccess() {
    document.getElementById('message-icon').textContent = '🎉';
    document.getElementById('message-title').textContent = '恭喜过关！';
    document.getElementById('message-text').textContent = `第 ${currentLevel + 1} 关完成！${levels[currentLevel].name}`;
    document.getElementById('message-overlay').classList.add('show');
}

function nextLevel() {
    if (currentLevel < levels.length - 1) {
        currentLevel++;
        loadLevel(currentLevel);
    } else {
        document.getElementById('message-icon').textContent = '🏆';
        document.getElementById('message-title').textContent = '全部通关！';
        document.getElementById('message-text').textContent = '太厉害了！哪吒成功找到了所有兵器！';
        document.getElementById('btn-next').style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', initGame);