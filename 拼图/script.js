/* ===== 关卡配置：随关卡递增切割数（3×3 → 7×7），图片循环使用 ===== */
const BOARD_TARGET = 360; // 棋盘逻辑边长（px），网格越大每块越小
const defaultImages = [
    'image.png',
    'image1.png',
    'image3.png'
];
// 每档网格停留 2 关：3×3、4×4、5×5、6×6、7×7，共 10 关，难度逐级递增
const levelGrids = [3, 3, 4, 4, 5, 5, 6, 6, 7, 7];
const levels = levelGrids.map((g, i) => ({
    image: defaultImages[i % defaultImages.length],
    grid: g
}));

let currentLevel = 0;
let gridSize = levels[0].grid;
let pieces = gridSize * gridSize;
let pieceSize = Math.floor(BOARD_TARGET / gridSize);
let puzzlePieces = [];
let selectedPiece = null;
let steps = 0; 
let startTime = null;
let timerInterval = null;
let bestScores = {};
let canvas = null;
let ctx = null;
let previewImage = null;
let currentImage = new Image();
let isDragging = false;
let dragStartIndex = null;
let customImages = [];

function init() {
    loadBestScores();
    initHomeScreen();
}

function initHomeScreen() {
    const homeScreen = document.getElementById('home-screen');
    const gameContainer = document.getElementById('game-container');
    homeScreen.style.display = 'block';
    gameContainer.style.display = 'none';
    
    renderLevelGrid();
    updateHomeStats();
    
    document.getElementById('btn-start').addEventListener('click', startGame);
    document.getElementById('file-upload').addEventListener('change', handleHomeFileUpload);
}

function initGame() {
    canvas = document.getElementById('puzzle-canvas');
    ctx = canvas.getContext('2d');
    previewImage = document.getElementById('preview-image');

    setupEventListeners();
    loadLevel(currentLevel);
}

let listenersBound = false;
function setupEventListeners() {
    if (listenersBound) return;
    listenersBound = true;
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    document.getElementById('btn-shuffle').addEventListener('click', shufflePuzzle);
    document.getElementById('btn-hint').addEventListener('click', showHint);
    document.getElementById('btn-solve').addEventListener('click', solvePuzzle);
    document.getElementById('btn-restart').addEventListener('click', restartGame);
    document.getElementById('btn-next').addEventListener('click', nextLevel);
    document.getElementById('btn-back').addEventListener('click', goHome);
    document.getElementById('file-upload-game').addEventListener('change', handleGameFileUpload);

    // 原图预览弹窗
    document.getElementById('btn-preview').addEventListener('click', openPreview);
    document.getElementById('preview-close').addEventListener('click', closePreview);
    document.getElementById('preview-overlay').addEventListener('click', function(e) {
        if (e.target === this) closePreview();
    });

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closePreview();
    });
}

function openPreview() {
    document.getElementById('preview-overlay').classList.add('show');
}

function closePreview() {
    document.getElementById('preview-overlay').classList.remove('show');
}

function renderLevelGrid() {
    const levelGrid = document.getElementById('level-grid');
    levelGrid.innerHTML = '';
    
    levels.forEach((level, index) => {
        const levelItem = document.createElement('div');
        levelItem.className = 'level-item';
        levelItem.dataset.level = index;

        if (level.custom) {
            levelItem.classList.add('custom-level');
        }
        
        const placeholder = document.createElement('span');
        placeholder.className = 'level-placeholder';
        placeholder.textContent = `${index + 1}`;
        levelItem.appendChild(placeholder);
        
        const img = new Image();
        img.className = 'level-image';
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            img.classList.add('loaded');
            if (placeholder.parentNode) {
                placeholder.style.opacity = '0';
            }
        };
        img.onerror = () => {
            img.style.display = 'none';
        };
        levelItem.appendChild(img);
        
        const stars = getStarsForLevel(index);
        if (stars) {
            const starsSpan = document.createElement('span');
            starsSpan.className = 'level-stars';
            starsSpan.textContent = stars;
            levelItem.appendChild(starsSpan);
        }
        
        levelItem.addEventListener('click', () => {
            document.querySelectorAll('.level-item').forEach(item => item.classList.remove('selected'));
            levelItem.classList.add('selected');
            currentLevel = index;
        });
        
        levelGrid.appendChild(levelItem);
        
        setTimeout(() => {
            img.src = level.image;
        }, index * 100);
    });
    
    if (levels.length > 0) {
        document.querySelector('.level-item').classList.add('selected');
    }
}

// 星级阈值随拼块总数缩放：3 星 ≤ 0.7N 步，2 星 ≤ 1.3N 步，否则 1 星
function starCountFor(score, levelIndex) {
    const grid = (levels[levelIndex] && levels[levelIndex].grid) || 4;
    const n = grid * grid;
    if (score <= Math.round(n * 0.7)) return 3;
    if (score <= Math.round(n * 1.3)) return 2;
    return 1;
}

function getStarsForLevel(level) {
    const score = bestScores[level];
    if (!score) return '';
    return '⭐'.repeat(starCountFor(score, level));
}

function updateHomeStats() {
    let totalStars = 0;
    let completedLevels = 0;
    let bestStep = null;
    
    Object.keys(bestScores).forEach(level => {
        completedLevels++;
        const score = bestScores[level];
        totalStars += starCountFor(score, level);
        
        if (bestStep === null || score < bestStep) {
            bestStep = score;
        }
    });
    
    document.getElementById('total-stars').textContent = totalStars;
    document.getElementById('completed-levels').textContent = completedLevels;
    document.getElementById('best-step').textContent = bestStep ? `${bestStep}步` : '--';
}

function startGame() {
    const homeScreen = document.getElementById('home-screen');
    const gameContainer = document.getElementById('game-container');
    
    homeScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    
    initGame();
}

function goHome() {
    const homeScreen = document.getElementById('home-screen');
    const gameContainer = document.getElementById('game-container');
    
    stopTimer();
    gameContainer.style.display = 'none';
    homeScreen.style.display = 'block';
    
    renderLevelGrid();
    updateHomeStats();
}

function handleHomeFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const imageDataUrl = event.target.result;
        addCustomLevel(imageDataUrl);

        currentLevel = levels.length - 1;
        renderLevelGrid();

        document.getElementById('file-upload').value = '';

        alert('图片上传成功！请点击开始游戏。');
    };
    reader.readAsDataURL(file);
}

// 自定义图片按高难度追加：前 3 张 6×6，之后 7×7
function addCustomLevel(imageDataUrl) {
    customImages.push(imageDataUrl);
    const grid = Math.min(7, 6 + Math.floor((customImages.length - 1) / 3));
    levels.push({ image: imageDataUrl, grid: grid, custom: true });
}

function handleGameFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const imageDataUrl = event.target.result;
        addCustomLevel(imageDataUrl);

        currentLevel = levels.length - 1;
        loadLevel(currentLevel);

        document.getElementById('file-upload-game').value = '';

        alert('图片上传成功！开始新的拼图关卡。');
    };
    reader.readAsDataURL(file);
}

function handleMouseDown(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.floor((e.clientX - rect.left) * scaleX / pieceSize);
    const y = Math.floor((e.clientY - rect.top) * scaleY / pieceSize);
    
    const index = y * gridSize + x;
    
    if (index >= 0 && index < pieces) {
        isDragging = true;
        dragStartIndex = index;
        selectedPiece = index;
        drawPuzzle();
    }
}

function handleMouseMove(e) {
    if (!isDragging) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.floor((e.clientX - rect.left) * scaleX / pieceSize);
    const y = Math.floor((e.clientY - rect.top) * scaleY / pieceSize);
    
    const index = y * gridSize + x;
    
    if (index >= 0 && index < pieces && index !== dragStartIndex) {
        selectedPiece = index;
        drawPuzzle();
    }
}

function handleMouseUp(e) {
    if (!isDragging) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.floor((e.clientX - rect.left) * scaleX / pieceSize);
    const y = Math.floor((e.clientY - rect.top) * scaleY / pieceSize);
    
    const index = y * gridSize + x;
    
    if (index >= 0 && index < pieces && index !== dragStartIndex) {
        swapPieces(dragStartIndex, index);
        steps++;
        updateUI();
        checkCompletion();
    }
    
    isDragging = false;
    dragStartIndex = null;
    drawPuzzle();
}

function handleTouchStart(e) {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.floor((touch.clientX - rect.left) * scaleX / pieceSize);
    const y = Math.floor((touch.clientY - rect.top) * scaleY / pieceSize);
    
    const index = y * gridSize + x;
    
    if (index >= 0 && index < pieces) {
        isDragging = true;
        dragStartIndex = index;
        selectedPiece = index;
        drawPuzzle();
    }
}

function handleTouchMove(e) {
    e.preventDefault();
    
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.floor((touch.clientX - rect.left) * scaleX / pieceSize);
    const y = Math.floor((touch.clientY - rect.top) * scaleY / pieceSize);
    
    const index = y * gridSize + x;
    
    if (index >= 0 && index < pieces && index !== dragStartIndex) {
        selectedPiece = index;
        drawPuzzle();
    }
}

function handleTouchEnd(e) {
    if (!isDragging || dragStartIndex === null) {
        isDragging = false;
        dragStartIndex = null;
        drawPuzzle();
        return;
    }
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let touchX, touchY;
    if (e.changedTouches && e.changedTouches.length > 0) {
        touchX = e.changedTouches[0].clientX;
        touchY = e.changedTouches[0].clientY;
    } else {
        isDragging = false;
        dragStartIndex = null;
        drawPuzzle();
        return;
    }
    
    const x = Math.floor((touchX - rect.left) * scaleX / pieceSize);
    const y = Math.floor((touchY - rect.top) * scaleY / pieceSize);
    
    const index = y * gridSize + x;
    
    if (index >= 0 && index < pieces && index !== dragStartIndex) {
        swapPieces(dragStartIndex, index);
        steps++;
        updateUI();
        checkCompletion();
    }
    
    isDragging = false;
    dragStartIndex = null;
    selectedPiece = null;
    drawPuzzle();
}

function handleKeyDown(e) {
    if (!selectedPiece || selectedPiece < 0 || selectedPiece >= pieces) return;
    
    const selectedX = selectedPiece % gridSize;
    const selectedY = Math.floor(selectedPiece / gridSize);
    let targetIndex = -1;
    
    switch(e.key) {
        case 'ArrowUp':
            if (selectedY > 0) targetIndex = (selectedY - 1) * gridSize + selectedX;
            break;
        case 'ArrowDown':
            if (selectedY < gridSize - 1) targetIndex = (selectedY + 1) * gridSize + selectedX;
            break;
        case 'ArrowLeft':
            if (selectedX > 0) targetIndex = selectedY * gridSize + (selectedX - 1);
            break;
        case 'ArrowRight':
            if (selectedX < gridSize - 1) targetIndex = selectedY * gridSize + (selectedX + 1);
            break;
        case 'Enter':
        case ' ':
            e.preventDefault();
            selectedPiece = null;
            drawPuzzle();
            return;
    }
    
    if (targetIndex >= 0 && targetIndex < pieces) {
        swapPieces(selectedPiece, targetIndex);
        selectedPiece = targetIndex;
        steps++;
        updateUI();
        checkCompletion();
        drawPuzzle();
    }
}

function loadLevel(levelIndex) {
    currentLevel = levelIndex;
    const level = levels[currentLevel];
    const imageUrl = level.image;

    // 按关卡设置网格与棋盘（关卡越靠后，切块越多）
    gridSize = level.grid;
    pieces = gridSize * gridSize;
    pieceSize = Math.floor(BOARD_TARGET / gridSize);
    canvas.width = gridSize * pieceSize;
    canvas.height = gridSize * pieceSize;

    currentImage = new Image();
    currentImage.onload = function() {
        previewImage.src = imageUrl;
        initializePuzzle();
    };
    currentImage.onerror = function() {
        console.error('Failed to load image:', imageUrl);
    };
    currentImage.src = imageUrl;
    
    steps = 0;
    selectedPiece = null;
    updateUI();
}

function initializePuzzle() {
    puzzlePieces = [];
    for (let i = 0; i < pieces; i++) {
        puzzlePieces.push(i);
    }
    
    shufflePuzzlePieces();
    drawPuzzle();
    startTimer();
}

// 任意交换玩法：Fisher–Yates 打乱，保证非完成态且错位拼块 ≥ 60%
function shufflePuzzlePieces() {
    let attempts = 0;
    do {
        for (let i = puzzlePieces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [puzzlePieces[i], puzzlePieces[j]] = [puzzlePieces[j], puzzlePieces[i]];
        }
        attempts++;
    } while (misplacedCount() < Math.ceil(pieces * 0.6) && attempts < 100);
}

function misplacedCount() {
    let count = 0;
    for (let i = 0; i < pieces; i++) {
        if (puzzlePieces[i] !== i) count++;
    }
    return count;
}

function shufflePuzzle() {
    shufflePuzzlePieces();
    steps = 0;
    selectedPiece = null;
    updateUI();
    drawPuzzle();
    startTimer();
}

function handleCanvasClick(e) {
    if (isDragging) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.floor((e.clientX - rect.left) * scaleX / pieceSize);
    const y = Math.floor((e.clientY - rect.top) * scaleY / pieceSize);
    
    const index = y * gridSize + x;
    
    if (index < 0 || index >= pieces) return;
    
    if (selectedPiece === null) {
        selectedPiece = index;
        drawPuzzle();
    } else if (selectedPiece === index) {
        selectedPiece = null;
        drawPuzzle();
    } else {
        swapPieces(selectedPiece, index);
        selectedPiece = null;
        steps++;
        updateUI();
        drawPuzzle();
        checkCompletion();
    }
}

function swapPieces(index1, index2) {
    [puzzlePieces[index1], puzzlePieces[index2]] = [puzzlePieces[index2], puzzlePieces[index1]];
}

function checkCompletion() {
    if (isPuzzleComplete()) {
        stopTimer();
        saveBestScore();
        showWinMessage();
    }
}

function isPuzzleComplete() {
    for (let i = 0; i < pieces; i++) {
        if (puzzlePieces[i] !== i) {
            return false;
        }
    }
    return true;
}

function drawPuzzle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const imageSize = Math.min(currentImage.width, currentImage.height);
    const offsetX = (currentImage.width - imageSize) / 2;
    const offsetY = (currentImage.height - imageSize) / 2;
    
    const pieceSrcSize = imageSize / gridSize;
    const numFont = Math.max(10, Math.round(pieceSize * 0.22));
    
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const index = y * gridSize + x;
            const pieceIndex = puzzlePieces[index];
            
            const originalX = offsetX + (pieceIndex % gridSize) * pieceSrcSize;
            const originalY = offsetY + Math.floor(pieceIndex / gridSize) * pieceSrcSize;

            ctx.drawImage(
                currentImage,
                originalX, originalY, pieceSrcSize, pieceSrcSize,
                x * pieceSize, y * pieceSize, pieceSize, pieceSize
            );

            // 序号（字号随拼块大小缩放）
            ctx.fillStyle = 'rgba(91, 74, 122, 0.75)';
            ctx.font = 'bold ' + numFont + 'px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(pieceIndex + 1, x * pieceSize + pieceSize / 2, y * pieceSize + pieceSize * 0.86);
            
            ctx.strokeStyle = '#EBDCF7';
            ctx.lineWidth = 1;
            ctx.strokeRect(x * pieceSize, y * pieceSize, pieceSize, pieceSize);
            
            if (index === selectedPiece) {
                ctx.fillStyle = 'rgba(255, 107, 157, 0.35)';
                ctx.fillRect(x * pieceSize, y * pieceSize, pieceSize, pieceSize);
                ctx.strokeStyle = '#FF6B9D';
                ctx.lineWidth = 3;
                ctx.strokeRect(x * pieceSize + 2, y * pieceSize + 2, pieceSize - 4, pieceSize - 4);
            }
            
            if (pieceIndex === index) {
                ctx.strokeStyle = '#66CF9E';
                ctx.lineWidth = 2;
                ctx.strokeRect(x * pieceSize + 1, y * pieceSize + 1, pieceSize - 2, pieceSize - 2);
            }
        }
    }
    
    const progress = calculateProgress();
    document.getElementById('progress').style.width = `${progress}%`;
}

function calculateProgress() {
    let correct = 0;
    for (let i = 0; i < pieces; i++) {
        if (puzzlePieces[i] === i) correct++;
    }
    return Math.round((correct / pieces) * 100);
}

function showHint() {
    for (let i = 0; i < pieces; i++) {
        if (puzzlePieces[i] !== i) {
            const correctIndex = puzzlePieces[i];
            const currentX = i % gridSize;
            const currentY = Math.floor(i / gridSize);
            const correctX = correctIndex % gridSize;
            const correctY = Math.floor(correctIndex / gridSize);
            
            alert(`提示：将位置 (${currentX + 1}, ${currentY + 1}) 的拼图块移动到 (${correctX + 1}, ${correctY + 1})`);
            return;
        }
    }
    alert('拼图已经完成！');
}

function solvePuzzle() {
    puzzlePieces = [];
    for (let i = 0; i < pieces; i++) {
        puzzlePieces.push(i);
    }
    selectedPiece = null;
    drawPuzzle();
    stopTimer();
    showWinMessage();
}

function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');
    document.getElementById('time').textContent = `${minutes}:${seconds}`;
}

function getElapsedTime() {
    return Math.floor((Date.now() - startTime) / 1000);
}

function updateUI() {
    document.getElementById('current-level').textContent = currentLevel + 1;
    document.getElementById('total-levels').textContent = levels.length;
    document.getElementById('steps').textContent = steps;
    document.getElementById('best').textContent = bestScores[currentLevel] ? `${bestScores[currentLevel]}步` : '--';
}

function saveBestScore() {
    if (!bestScores[currentLevel] || steps < bestScores[currentLevel]) {
        bestScores[currentLevel] = steps;
        localStorage.setItem('puzzle_best', JSON.stringify(bestScores));
    }
}

function loadBestScores() {
    const saved = localStorage.getItem('puzzle_best');
    if (saved) {
        bestScores = JSON.parse(saved);
    }
}

function showWinMessage() {
    const elapsed = getElapsedTime();
    const stars = '⭐'.repeat(starCountFor(steps, currentLevel));
    document.getElementById('message-icon').textContent = '🎉';
    document.getElementById('message-title').textContent = '恭喜完成！';
    document.getElementById('message-text').textContent = `太棒了！用了 ${steps} 步，用时 ${formatTime(elapsed)}！`;
    document.getElementById('message-stars').textContent = stars;
    document.getElementById('message-overlay').classList.add('show');
    
    if (currentLevel >= levels.length - 1) {
        document.getElementById('btn-next').textContent = '返回首页';
        document.getElementById('btn-next').onclick = goHome;
    } else {
        document.getElementById('btn-next').textContent = '下一关 →';
        document.getElementById('btn-next').onclick = nextLevel;
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

function hideMessage() {
    document.getElementById('message-overlay').classList.remove('show');
}

function nextLevel() {
    if (currentLevel < levels.length - 1) {
        currentLevel++;
        loadLevel(currentLevel);
        hideMessage();
    }
}

function restartGame() {
    loadLevel(currentLevel);
    hideMessage();
}

window.addEventListener('load', init);