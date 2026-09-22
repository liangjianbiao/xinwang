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
        name: "最终决战",
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
        const x = padding + obs.col * cellSize + 5;
        const y = padding + obs.row * cellSize + 5;
        ctx.fillStyle = '#D6ECFC';
        ctx.beginPath();
        ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2 - 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#7A6890';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('☁️', x + cellSize / 2, y + cellSize / 2);
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
        const radius = 12;

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
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(index + 1, x, y);
    });
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    const startX = padding + level.start.col * cellSize + cellSize / 2;
    const startY = padding + level.start.row * cellSize + cellSize / 2;
    ctx.font = '28px Arial';
    ctx.fillText('🧒', startX - 10, startY + 8);
    
    const endX = padding + level.end.col * cellSize + cellSize / 2;
    const endY = padding + level.end.row * cellSize + cellSize / 2;
    ctx.font = '28px Arial';
    ctx.fillText('🔪', endX - 10, endY + 8);
    
    drawLines();
}

function drawLines() {
    if (selectedDots.length < 2) return;
    
    ctx.strokeStyle = '#FF6B9D';
    ctx.lineWidth = 4;
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
    const clickRadius = 30;
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
        ctx.arc(x, y, 30, 0, Math.PI * 2);
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