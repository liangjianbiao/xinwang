const EMOJIS = [
    '🐶', '🐱', '🐼', '🦊', '🐨', '🦁', '🐯', '🐻',
    '🐸', '🐵', '🐔', '🐧', '🦄', '🐝', '🦋', '🐢',
    '🌸', '🌺', '🌻', '🌹', '🌷', '🌼', '🌙', '⭐',
    '🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍒', '🍉'
];

const DIFFICULTY = {
    easy: { pairs: 4, rows: 2, cols: 4, name: '简单', scoreMultiplier: 1 },
    medium: { pairs: 12, rows: 4, cols: 6, name: '中等', scoreMultiplier: 1.5 },
    hard: { pairs: 18, rows: 6, cols: 6, name: '困难', scoreMultiplier: 2 }
};

let currentDifficulty = 'easy';
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timerInterval = null;
let seconds = 0;
let isLocked = false;
let hintsRemaining = 3;
let score = 0;
let audioContext = null;
let achievements = {
    speed: false,
    perfect: false,
    master: false
};

function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Web Audio API not supported');
    }
}

function playSound(type) {
    if (!audioContext) return;
    
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        const sounds = {
            flip: { type: 'sine', freq: [600, 800], duration: 0.1 },
            match: { type: 'sine', freq: [523, 659, 784], duration: 0.3 },
            mismatch: { type: 'sawtooth', freq: [300, 200], duration: 0.2 },
            win: { type: 'sine', freq: [523, 659, 784, 1047], duration: 0.2 },
            hint: { type: 'triangle', freq: [700, 900], duration: 0.15 },
            achievement: { type: 'sine', freq: [440, 554, 659, 880], duration: 0.4 }
        };
        
        const sound = sounds[type];
        if (!sound) return;
        
        oscillator.type = sound.type;
        
        sound.freq.forEach((freq, index) => {
            setTimeout(() => {
                if (sound.freq.length > 1) {
                    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                } else {
                    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                }
            }, index * (sound.duration / sound.freq.length * 1000));
        });
        
        oscillator.frequency.setValueAtTime(sound.freq[0], audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + sound.duration);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + sound.duration);
    } catch (e) {
        console.log('Sound play failed:', e);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function loadAchievements() {
    const saved = localStorage.getItem('memoryGameAchievements');
    if (saved) {
        achievements = JSON.parse(saved);
    }
}

function saveAchievements() {
    localStorage.setItem('memoryGameAchievements', JSON.stringify(achievements));
}

function updateAchievementsUI() {
    document.getElementById('achievement-speed').classList.toggle('unlocked', achievements.speed);
    document.getElementById('achievement-perfect').classList.toggle('unlocked', achievements.perfect);
    document.getElementById('achievement-master').classList.toggle('unlocked', achievements.master);
}

function checkAchievements() {
    const config = DIFFICULTY[currentDifficulty];
    
    if (!achievements.speed && seconds <= 30) {
        achievements.speed = true;
        playSound('achievement');
        showToast('🎉 解锁成就：闪电手！');
    }
    
    if (!achievements.perfect && moves <= config.pairs) {
        achievements.perfect = true;
        playSound('achievement');
        showToast('🎉 解锁成就：完美配对！');
    }
    
    const allCompleted = localStorage.getItem('memoryGameCompletedLevels');
    let completedLevels = allCompleted ? JSON.parse(allCompleted) : {};
    completedLevels[currentDifficulty] = true;
    
    const allDifficulties = Object.keys(DIFFICULTY);
    const allCompletedFlag = allDifficulties.every(d => completedLevels[d]);
    
    if (!achievements.master && allCompletedFlag) {
        achievements.master = true;
        playSound('achievement');
        showToast('🎉 解锁成就：记忆大师！');
    }
    
    localStorage.setItem('memoryGameCompletedLevels', JSON.stringify(completedLevels));
    saveAchievements();
    updateAchievementsUI();
}

function getBestRecord() {
    const saved = localStorage.getItem('memoryGameBestRecords');
    if (!saved) return {};
    return JSON.parse(saved);
}

function saveBestRecord(score) {
    const records = getBestRecord();
    if (!records[currentDifficulty] || score > records[currentDifficulty]) {
        records[currentDifficulty] = score;
        localStorage.setItem('memoryGameBestRecords', JSON.stringify(records));
        return true;
    }
    return false;
}

function calculateScore() {
    const config = DIFFICULTY[currentDifficulty];
    const baseScore = matchedPairs * 100;
    const timeBonus = Math.max(0, (120 - seconds) * 2);
    const movesPenalty = Math.max(0, (moves - config.pairs) * 5);
    const multiplier = config.scoreMultiplier;
    
    score = Math.floor((baseScore + timeBonus - movesPenalty) * multiplier);
    return score;
}

let isInitializing = false;

function initGame() {
    if (isInitializing) {
        console.log('[initGame] 正在初始化中，跳过');
        return;
    }
    isInitializing = true;
    
    try {
        stopTimer();
        
        const config = DIFFICULTY[currentDifficulty];
        console.log('[initGame] 配置:', config);
        
        const selectedEmojis = shuffleArray([...EMOJIS]).slice(0, config.pairs);
        const cardPairs = [...selectedEmojis, ...selectedEmojis];
        cards = shuffleArray(cardPairs).map((emoji, index) => ({
            id: index,
            emoji: emoji,
            isFlipped: false,
            isMatched: false
        }));
        
        console.log('[initGame] 生成卡片数:', cards.length);

        matchedPairs = 0;
        moves = 0;
        seconds = 0;
        score = 0;
        flippedCards = [];
        isLocked = false;
        hintsRemaining = 3;

        const totalMatchesEl = document.getElementById('total-matches');
        if (totalMatchesEl) totalMatchesEl.textContent = config.pairs;
        const hintCountEl = document.getElementById('hint-count');
        if (hintCountEl) hintCountEl.textContent = hintsRemaining;
        
        updateStats();
        updateProgress();
        
        renderCards();
        startTimer();
        hideModal();
        updateAchievementsUI();
        
        console.log('[initGame] 初始化完成');
    } catch (e) {
        console.error('[initGame] 初始化失败:', e);
    } finally {
        setTimeout(() => { isInitializing = false; }, 100);
    }
}

function renderCards() {
    const grid = document.getElementById('cards-grid');
    if (!grid) return;
    
    const config = DIFFICULTY[currentDifficulty];
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    
    console.log('[renderCards] 视口尺寸:', vw, 'x', vh);
    console.log('[renderCards] 配置:', config.cols, '列x', config.rows, '行');
    console.log('[renderCards] 卡片数组长度:', cards.length);
    
    const gap = 6;
    const sidePadding = 12;
    const topOffset = 280;
    const bottomReserve = 140;
    const availW = Math.min(vw - sidePadding * 2, 500);
    const availH = Math.max(vh - topOffset - bottomReserve, 180);
    const cardW = Math.floor((availW - gap * (config.cols - 1)) / config.cols);
    const cardH = Math.floor((availH - gap * (config.rows - 1)) / config.rows);
    const cardSize = Math.max(28, Math.min(cardW, cardH, 100));
    
    const emojiSize = Math.max(14, Math.floor(cardSize * 0.55));
    const iconSize = Math.max(12, Math.floor(cardSize * 0.45));
    const borderRadius = Math.max(6, Math.floor(cardSize * 0.15));
    
    console.log('[renderCards] 计算卡片尺寸:', cardSize, 'px, emoji:', emojiSize, 'px');
    
    grid.innerHTML = '';
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = `repeat(${config.cols}, ${cardSize}px)`;
    grid.style.gridTemplateRows = `repeat(${config.rows}, ${cardSize}px)`;
    grid.style.gap = gap + 'px';
    grid.style.padding = '0';
    grid.style.justifyContent = 'center';
    grid.style.setProperty('--emoji-size', emojiSize + 'px');
    grid.style.setProperty('--icon-size', iconSize + 'px');
    grid.style.setProperty('--border-radius', borderRadius + 'px');
    grid.style.setProperty('--inner-padding', Math.max(2, Math.floor(cardSize * 0.08)) + 'px');
    
    const frag = document.createDocumentFragment();
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const el = document.createElement('div');
        el.className = 'card';
        el.dataset.id = card.id;
        el.style.width = cardSize + 'px';
        el.style.height = cardSize + 'px';
        el.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-back"><i class="fas fa-question-circle"></i></div>
                <div class="card-face card-front"><span>${card.emoji}</span></div>
            </div>
        `;
        el.addEventListener('click', () => flipCard(card));
        frag.appendChild(el);
    }
    grid.appendChild(frag);
    
    console.log('[renderCards] 渲染完成, 实际DOM子元素数:', grid.children.length);
}

function flipCard(card) {
    if (isLocked || card.isFlipped || card.isMatched) return;

    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    playSound('flip');
    
    card.isFlipped = true;
    const cardElement = document.querySelector(`.card[data-id="${card.id}"]`);
    if (cardElement) {
        cardElement.classList.add('flipped');
    }

    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        updateStats();
        checkMatch();
    }
}

function checkMatch() {
    isLocked = true;
    const [card1, card2] = flippedCards;

    if (card1.emoji === card2.emoji) {
        playSound('match');
        card1.isMatched = true;
        card2.isMatched = true;
        matchedPairs++;
        calculateScore();

        const element1 = document.querySelector(`.card[data-id="${card1.id}"]`);
        const element2 = document.querySelector(`.card[data-id="${card2.id}"]`);
        if (element1) element1.classList.add('matched');
        if (element2) element2.classList.add('matched');

        flippedCards = [];
        isLocked = false;
        updateStats();
        updateProgress();

        if (matchedPairs === DIFFICULTY[currentDifficulty].pairs) {
            endGame();
        }
    } else {
        setTimeout(() => {
            playSound('mismatch');
            card1.isFlipped = false;
            card2.isFlipped = false;

            const element1 = document.querySelector(`.card[data-id="${card1.id}"]`);
            const element2 = document.querySelector(`.card[data-id="${card2.id}"]`);
            if (element1) element1.classList.remove('flipped');
            if (element2) element2.classList.remove('flipped');

            flippedCards = [];
            isLocked = false;
        }, 1000);
    }
}

function startTimer() {
    stopTimer();
    timerInterval = setInterval(() => {
        seconds++;
        updateStats();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function formatTime(sec) {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function getStars() {
    const config = DIFFICULTY[currentDifficulty];
    const minMoves = config.pairs;
    const maxMoves = config.pairs * 2;
    
    if (moves <= minMoves) return '⭐⭐⭐';
    if (moves <= maxMoves) return '⭐⭐';
    return '⭐';
}

function updateStats() {
    const config = DIFFICULTY[currentDifficulty];
    
    document.getElementById('timer').textContent = formatTime(seconds);
    document.getElementById('moves').textContent = moves;
    document.getElementById('matches').innerHTML = `${matchedPairs}/${config.pairs}`;
    document.getElementById('stars').textContent = getStars();
    document.getElementById('score').textContent = score;
    document.getElementById('hint-count').textContent = hintsRemaining;
    
    const hintBtn = document.getElementById('btn-hint');
    hintBtn.disabled = hintsRemaining <= 0;
}

function updateProgress() {
    const config = DIFFICULTY[currentDifficulty];
    const progress = Math.round((matchedPairs / config.pairs) * 100);
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('progress-text').textContent = `${progress}%`;
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

function endGame() {
    stopTimer();
    playSound('win');
    calculateScore();
    
    checkAchievements();
    
    const isNewRecord = saveBestRecord(score);
    const bestRecords = getBestRecord();
    const bestScore = bestRecords[currentDifficulty] || score;
    
    document.getElementById('result-time').textContent = formatTime(seconds);
    document.getElementById('result-moves').textContent = moves;
    document.getElementById('result-stars').textContent = getStars();
    document.getElementById('result-score').textContent = score;
    document.getElementById('best-record').textContent = bestScore;
    
    document.getElementById('new-record-badge').style.display = isNewRecord ? 'block' : 'none';
    
    showModal();
}

function showModal() {
    const modal = document.getElementById('modal-overlay');
    modal.style.display = 'flex';
}

function hideModal() {
    const modal = document.getElementById('modal-overlay');
    modal.style.display = 'none';
}

function useHint() {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    if (hintsRemaining <= 0 || isLocked) {
        if (hintsRemaining <= 0) {
            showToast('提示次数已用完！');
        }
        return;
    }

    const unmatchedCards = cards.filter(c => !c.isMatched && !c.isFlipped);
    if (unmatchedCards.length < 2) {
        showToast('没有可提示的卡片了！');
        return;
    }

    const pairs = {};
    unmatchedCards.forEach(card => {
        if (!pairs[card.emoji]) pairs[card.emoji] = [];
        pairs[card.emoji].push(card);
    });

    let hintPair = null;
    for (const emoji in pairs) {
        if (pairs[emoji].length >= 2) {
            hintPair = pairs[emoji].slice(0, 2);
            break;
        }
    }

    if (hintPair) {
        hintsRemaining--;
        playSound('hint');
        updateStats();

        hintPair.forEach(card => {
            const element = document.querySelector(`.card[data-id="${card.id}"]`);
            if (element) {
                element.classList.add('hinted');
                setTimeout(() => {
                    element.classList.remove('hinted');
                }, 2000);
            }
        });
    } else {
        showToast('没有可配对的卡片了！');
    }
}

function safeRedirect(url) {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
    window.location.href = url;
}

function handleBtnRestart(e) {
    try {
        if (e && e.preventDefault) e.preventDefault();
        if (e && e.stopPropagation) e.stopPropagation();
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
        console.log('[重开] 开始重新初始化游戏');
        initGame();
    } catch (err) {
        console.error('[重开] 出错:', err);
    }
}

function handleBtnHint(e) {
    try {
        if (e && e.preventDefault) e.preventDefault();
        if (e && e.stopPropagation) e.stopPropagation();
        useHint();
    } catch (err) {
        console.error('[提示] 出错:', err);
    }
}

function handleDifficultyChange(e) {
    try {
        if (e && e.preventDefault) e.preventDefault();
        if (e && e.stopPropagation) e.stopPropagation();
        
        let btn = null;
        if (e && e.currentTarget && e.currentTarget.classList && e.currentTarget.classList.contains('difficulty-btn')) {
            btn = e.currentTarget;
        } else if (e && e.target && e.target.closest) {
            btn = e.target.closest('.difficulty-btn');
        }
        
        if (!btn) {
            console.log('[难度切换] 未找到按钮');
            return;
        }
        
        const level = btn.dataset.level;
        if (!level) {
            console.log('[难度切换] 无效难度');
            return;
        }
        
        console.log('[难度切换] 点击难度:', level, '当前难度:', currentDifficulty);
        
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentDifficulty = level;
        
        console.log('[难度切换] 开始初始化游戏，配置:', DIFFICULTY[level]);
        initGame();
        console.log('[难度切换] 初始化完成, 卡片数:', cards.length);
    } catch (err) {
        console.error('[难度切换] 出错:', err);
    }
}

let lastTouchTime = 0;

function attachButtonEvents() {
    const preventDoubleClick = (handler) => {
        return function(e) {
            const now = Date.now();
            if (now - lastTouchTime < 500) {
                console.log('[事件] 防止重复触发');
                return;
            }
            lastTouchTime = now;
            handler(e);
        };
    };
    
    const handleTouch = (handler) => {
        return function(e) {
            e.preventDefault();
            lastTouchTime = Date.now();
            handler(e);
        };
    };
    
    const btnBack = document.getElementById('btn-back');
    const btnRestart = document.getElementById('btn-restart');
    const btnHint = document.getElementById('btn-hint');
    const btnPlayAgain = document.getElementById('btn-play-again');
    const btnHome = document.getElementById('btn-home');
    
    if (btnBack) {
        btnBack.addEventListener('click', preventDoubleClick(() => safeRedirect('../games.html')));
        btnBack.addEventListener('touchstart', handleTouch(() => safeRedirect('../games.html')), { passive: false });
    }
    
    if (btnRestart) {
        btnRestart.addEventListener('click', preventDoubleClick(handleBtnRestart));
        btnRestart.addEventListener('touchstart', handleTouch(handleBtnRestart), { passive: false });
    }
    
    if (btnHint) {
        btnHint.addEventListener('click', preventDoubleClick(handleBtnHint));
        btnHint.addEventListener('touchstart', handleTouch(handleBtnHint), { passive: false });
    }
    
    if (btnPlayAgain) {
        btnPlayAgain.addEventListener('click', preventDoubleClick(handleBtnRestart));
        btnPlayAgain.addEventListener('touchstart', handleTouch(handleBtnRestart), { passive: false });
    }
    
    if (btnHome) {
        btnHome.addEventListener('click', preventDoubleClick(() => safeRedirect('../games.html')));
        btnHome.addEventListener('touchstart', handleTouch(() => safeRedirect('../games.html')), { passive: false });
    }
    
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', preventDoubleClick(handleDifficultyChange));
        btn.addEventListener('touchstart', handleTouch(handleDifficultyChange), { passive: false });
    });
}

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (cards.length > 0) {
            renderCards();
        }
    }, 200);
});

document.addEventListener('DOMContentLoaded', () => {
    initAudio();
    loadAchievements();
    updateAchievementsUI();
    attachButtonEvents();
    
    setTimeout(() => {
        initGame();
    }, 300);
});