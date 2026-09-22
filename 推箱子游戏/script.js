const levels = generateLevels();

function generateLevels() {
    const allLevels = [];
    
    for (let levelNum = 1; levelNum <= 100; levelNum++) { 
        const boxes = Math.min(Math.floor(levelNum / 5) + 1, 8);
        const size = Math.max(6, Math.floor(levelNum / 10) + 5);
        
        let level;
        let attempts = 0;
        do {
            level = generateLevel(size, boxes);
            attempts++;
        } while (!isLevelSolvable(level) && attempts < 10);
        
        allLevels.push(level);
    }
    
    return allLevels;
}

function generateLevel(size, boxes) {
    const map = [];
    
    for (let y = 0; y < size; y++) {
        let row = '';
        for (let x = 0; x < size; x++) {
            if (y === 0 || y === size - 1 || x === 0 || x === size - 1) {
                row += '#';
            } else {
                row += '.';
            }
        }
        map.push(row);
    }
    
    const mapArray = map.map(r => r.split(''));
    const halfSize = Math.floor(size / 2);
    
    mapArray[size - 2][1] = '@';
    
    for (let i = 0; i < boxes; i++) {
        const tx = size - 2 - i;
        const ty = 1;
        if (tx > 1) {
            mapArray[ty][tx] = '+';
        }
    }
    
    for (let i = 0; i < boxes; i++) {
        const bx = 2 + i;
        const by = halfSize;
        if (bx < size - 2) {
            mapArray[by][bx] = '$';
        }
    }
    
    return {
        width: size,
        height: size,
        map: mapArray.map(r => r.join(''))
    };
}

function isLevelSolvable(level) {
    let playerX = 0, playerY = 0;
    const boxes = [];
    const targets = [];
    
    for (let y = 0; y < level.height; y++) {
        for (let x = 0; x < level.width; x++) {
            const c = level.map[y][x];
            if (c === '@') {
                playerX = x;
                playerY = y;
            } else if (c === '$') {
                boxes.push({ x, y });
            } else if (c === '+') {
                targets.push({ x, y });
            }
        }
    }
    
    if (boxes.length !== targets.length) return false;
    
    const reachable = getReachableCells(level, playerX, playerY, boxes);
    
    for (const box of boxes) {
        const boxKey = `${box.x},${box.y}`;
        if (!reachable.has(boxKey)) {
            return false;
        }
    }
    
    return true;
}

function getReachableCells(level, startX, startY, boxes) {
    const reachable = new Set();
    const visited = new Set();
    const stack = [{ x: startX, y: startY }];
    
    while (stack.length > 0) {
        const { x, y } = stack.pop();
        const key = `${x},${y}`;
        
        if (visited.has(key)) continue;
        if (x < 0 || x >= level.width || y < 0 || y >= level.height) continue;
        
        const cell = level.map[y][x];
        if (cell === '#') continue;
        
        const isBox = boxes.some(b => b.x === x && b.y === y);
        if (isBox) continue;
        
        visited.add(key);
        reachable.add(key);
        
        stack.push({ x: x + 1, y });
        stack.push({ x: x - 1, y });
        stack.push({ x, y: y + 1 });
        stack.push({ x, y: y - 1 });
    }
    
    return reachable;
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
let playerImage = null;

function initGame() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    
    playerImage = new Image();
    playerImage.src = 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=asian%20toddler%20child%20wearing%20neon%20green%20oval%20sunglasses%20black%20hair%20beige%20collar%20shirt%20red%20outline%20border%20meme%20style%20cartoon&image_size=square';
    playerImage.onload = function() {
        loadLevel(currentLevel);
    };
    playerImage.onerror = function() {
        console.log('Failed to load player image, using emoji');
        loadLevel(currentLevel);
    };
    
    setupEventListeners();
    loadBestScores();
    
    if (playerImage.complete) {
        loadLevel(currentLevel);
    }
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
    const level = levels[currentLevel];
    
    gameMap = [];
    steps = 0;
    history = [];
    
    for (let y = 0; y < level.height; y++) {
        gameMap[y] = [];
        for (let x = 0; x < level.width; x++) {
            const char = level.map[y][x];
            if (char === '@' || char === '+') {
                playerPos = { x, y };
                gameMap[y][x] = char === '+' ? '+' : '.';
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
    
    if (targetCell === '#' || targetCell === '%') return;
    
    if (targetCell === '$' || targetCell === '*') {
        const boxNewX = newX + dx;
        const boxNewY = newY + dy;
        
        if (!isValidPosition(boxNewX, boxNewY)) return;
        
        const boxTargetCell = gameMap[boxNewY][boxNewX];
        if (boxTargetCell === '#' || boxTargetCell === '$' || boxTargetCell === '*' || boxTargetCell === '%') return;
        
        saveHistory();
        
        gameMap[boxNewY][boxNewX] = boxTargetCell === '+' ? '*' : '$';
        gameMap[newY][newX] = gameMap[newY][newX] === '*' ? '+' : '.';
    } else {
        saveHistory();
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
    
    const lastState = history.pop();
    gameMap = lastState.map;
    playerPos = lastState.playerPos;
    steps = lastState.steps;
    
    updateUI();
    drawBoard();
}

function resetLevel() {
    loadLevel(currentLevel);
}

function restartGame() {
    currentLevel = 0;
    loadLevel(currentLevel);
}

function nextLevel() {
    if (currentLevel < levels.length - 1) {
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

function drawBoard() {
    const level = levels[currentLevel];
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
                    ctx.fillStyle = '#F7F1FE';
                    ctx.fillRect(px, py, cellSize, cellSize);
                    
                    const boxGradient = ctx.createLinearGradient(px, py, px + cellSize, py + cellSize);
                    boxGradient.addColorStop(0, '#FFC987');
                    boxGradient.addColorStop(0.5, '#FFB061');
                    boxGradient.addColorStop(1, '#FF9540');
                    ctx.fillStyle = boxGradient;
                    ctx.fillRect(px + 4, py + 4, cellSize - 8, cellSize - 8);
                    
                    ctx.fillStyle = '#FFA45C';
                    ctx.fillRect(px + 6, py + 6, cellSize - 12, 6);
                    
                    ctx.fillStyle = '#FFD9A8';
                    ctx.fillRect(px + 8, py + 10, cellSize - 16, 4);
                    break;
                case '*':
                    ctx.fillStyle = '#FFF7D6';
                    ctx.fillRect(px, py, cellSize, cellSize);
                    
                    ctx.fillStyle = '#FFE066';
                    ctx.beginPath();
                    ctx.arc(px + cellSize/2, py + cellSize/2, cellSize/3, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.shadowColor = '#FFD76E';
                    ctx.shadowBlur = 10;
                    const doneBoxGradient = ctx.createLinearGradient(px, py, px + cellSize, py + cellSize);
                    doneBoxGradient.addColorStop(0, '#FFE066');
                    doneBoxGradient.addColorStop(0.5, '#FFC24D');
                    doneBoxGradient.addColorStop(1, '#FFA726');
                    ctx.fillStyle = doneBoxGradient;
                    ctx.fillRect(px + 4, py + 4, cellSize - 8, cellSize - 8);
                    ctx.shadowBlur = 0;
                    
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = 'bold 14px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('✓', px + cellSize/2, py + cellSize/2);
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
    
    if (playerImage && playerImage.complete) {
        ctx.drawImage(playerImage, 
            Math.round(px - cellSize/2), 
            Math.round(py - cellSize/2), 
            cellSize, 
            cellSize
        );
    } else {
        ctx.fillStyle = '#5BB8EE';
        ctx.beginPath();
        ctx.arc(px, py, cellSize/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = 'bold ' + Math.floor(cellSize * 0.5) + 'px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('😊', px, py);
    }
}

function showHint() {
    alert('提示：尝试将箱子推到目标位置！使用方向键或点击方向按钮移动。');
}

function showWinMessage() {
    const stars = steps <= (bestScores[currentLevel] || steps * 2) * 1.5 ? '⭐⭐⭐' : steps <= (bestScores[currentLevel] || steps * 2) * 2 ? '⭐⭐' : '⭐';
    document.getElementById('message-icon').textContent = '🎉';
    document.getElementById('message-title').textContent = '恭喜过关！';
    document.getElementById('message-text').textContent = `太棒了！用了 ${steps} 步完成！`;
    document.getElementById('message-stars').textContent = stars;
    document.getElementById('message-overlay').classList.add('show');
    
    if (currentLevel >= levels.length - 1) {
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