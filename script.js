const EMOJIS = [
    '🐶', '🐱', '🐼', '🦊', '🐨', '🦁', '🐯', '🐻',
    '🐸', '🐵', '🐔', '🐧', '🦄', '🐝', '🦋', '🐢',
    '🌸', '🌺', '🌻', '🌹', '🌷', '🌼', '🌙', '⭐',
    '🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍒', '🍉'
];

const DIFFICULTY = {
    easy: { pairs: 8, rows: 4, cols: 4, name: '简单', scoreMultiplier: 1 },
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

function initGame() {
    const config = DIFFICULTY[currentDifficulty];
    const selectedEmojis = shuffleArray([...EMOJIS]).slice(0, config.pairs);
    const cardPairs = [...selectedEmojis, ...selectedEmojis];
    cards = shuffleArray(cardPairs).map((emoji, index) => ({
        id: index,
        emoji: emoji,
        isFlipped: false,
        isMatched: false
    }));

    matchedPairs = 0;
    moves = 0;
    seconds = 0;
    score = 0;
    flippedCards = [];
    isLocked = false;
    hintsRemaining = 3;

    document.getElementById('total-matches').textContent = config.pairs;
    updateStats();
    updateProgress();
    renderCards();
    startTimer();
    hideModal();
    updateAchievementsUI();
    
    setTimeout(() => {
        document.getElementById('loading-overlay').style.display = 'none';
    }, 300);
}

function renderCards() {
    const grid = document.getElementById('cards-grid');
    const config = DIFFICULTY[currentDifficulty];
    
    grid.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;
    grid.innerHTML = '';

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`;
        cardElement.dataset.id = card.id;
        
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-back">
                    <i class="fas fa-question-circle"></i>
                </div>
                <div class="card-face card-front">
                    <span>${card.emoji}</span>
                </div>
            </div>
        `;

        cardElement.addEventListener('click', () => flipCard(card));
        grid.appendChild(cardElement);
    });
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
    if (hintsRemaining <= 0 || isLocked) return;

    const unmatchedCards = cards.filter(c => !c.isMatched && !c.isFlipped);
    if (unmatchedCards.length < 2) return;

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
    }
}

document.getElementById('btn-back').addEventListener('click', () => {
    window.location.href = '../games.html';
});

document.getElementById('btn-restart').addEventListener('click', initGame);

document.getElementById('btn-hint').addEventListener('click', useHint);

document.getElementById('btn-play-again').addEventListener('click', initGame);

document.getElementById('btn-home').addEventListener('click', () => {
    window.location.href = '../games.html';
});

document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentDifficulty = btn.dataset.level;
        initGame();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    initAudio();
    loadAchievements();
    updateAchievementsUI();
    
    setTimeout(() => {
        document.getElementById('loading-overlay').style.display = 'none';
        initGame();
    }, 500);
});