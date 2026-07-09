const CONFIG = {
cellSize: 40,
ballRadius: 16,
itemRadius: 12,
forceScale: 60,
deadZone: 0.03,
smoothFactor: 0.5,
maxTime: [60, 90, 120],
itemDuration: {
  slow: 5,
  ghost: 3
},
bgm: {
  tempo: 120,
  volume: 0.3
},
itemTypes: {
  coin: {color:"#ffdd00",score:10,name:"金币"},
  timeAdd: {color:"#44aaff",addTime:20,name:"沙漏"},
  slow: {color:"#bb66ff",duration:5,name:"减速磁场"},
  ghost: {color:"#22e0cc",duration:3,name:"穿墙星"},
  doubleScore: {color:"#ff4444",name:"双倍宝石"},
  teleport: {color:"#ffd700",name:"传送星"}
},
levels: [
  [
    [0,0,0,0,0,0,0,0,0,0],
    [0,2,1,1,1,0,1,1,1,0],
    [0,0,0,0,1,0,1,0,1,0],
    [0,1,1,1,1,1,1,0,1,0],
    [0,1,0,0,0,0,0,0,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,3,0],
    [0,0,0,0,0,0,0,0,0,0]
  ],
  [
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,2,1,0,1,1,1,0,1,1,0],
    [0,0,1,0,1,0,1,0,0,1,0],
    [0,1,1,1,1,0,1,1,1,1,0],
    [0,1,0,0,0,0,0,0,0,1,0],
    [0,1,1,1,1,1,1,1,0,1,0],
    [0,0,0,0,0,0,0,1,0,1,0],
    [0,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,3,0],
    [0,0,0,0,0,0,0,0,0,0,0]
  ],
  [
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,2,1,1,0,1,1,1,0,1,1,0],
    [0,0,0,1,0,1,0,1,0,0,1,0],
    [0,1,1,1,1,1,0,1,1,1,1,0],
    [0,1,0,0,0,0,0,0,0,0,1,0],
    [0,1,1,1,0,1,1,1,1,0,1,0],
    [0,0,0,1,0,1,0,0,1,0,1,0],
    [0,1,1,1,1,1,0,1,1,1,1,0],
    [0,1,0,0,0,0,0,1,0,0,1,0],
    [0,1,1,1,1,1,1,1,1,1,3,0],
    [0,0,0,0,0,0,0,0,0,0,0,0]
  ]
]
};

const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const gameBar = document.getElementById('gameBar');
const curLevelText = document.getElementById('curLevel');
const timeLeftText = document.getElementById('timeLeft');
const scoreText = document.getElementById('scoreText');
const pauseBtn = document.getElementById('pauseBtn');
const muteBtn = document.getElementById('muteBtn');
const mainMenu = document.getElementById('mainMenu');
const levelPanel = document.getElementById('levelPanel');
const pausePanel = document.getElementById('pausePanel');
const winPanel = document.getElementById('winPanel');
const failPanel = document.getElementById('failPanel');
const timeRankList = document.getElementById('timeRankList');
const scoreRankList = document.getElementById('scoreRankList');
const winTimeText = document.getElementById('winTime');
const winTotalScoreText = document.getElementById('winTotalScore');
const failScoreText = document.getElementById('failScore');
const sharePanel = document.getElementById('sharePanel');
const sysShareBtn = document.getElementById('sysShareBtn');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const savePosterBtn = document.getElementById('savePosterBtn');
const closeShareBtn = document.getElementById('closeShareBtn');
const shareGameBtn = document.getElementById('shareGameBtn');
const shareScoreBtn = document.getElementById('shareScoreBtn');
const shareTip = document.getElementById('shareTip');
const posterCanvas = document.getElementById('posterCanvas');
const posterCtx = posterCanvas.getContext('2d');

let gameState = {
currentLv: 1,
isPlaying: false,
isPaused: false,
ballX: 0, ballY: 0,
ballVx: 0, ballVy: 0,
timeLeft: 60,
timer: null,
accelX: 0, accelY:0,
maze: [],
startPos: {x:0,y:0},
endPos: {x:0,y:0},
items: [],
score: 0,
scoreMultiplier: 1,
activeBuff: {
  slow: 0,
  ghost: 0
},
totalScore: 0
};

const BGM = {
  ctx: null,
  isPlaying: false,
  isMuted: false,
  masterGain: null,
  noteInterval: null,
  beatInterval: null,
  scale: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88],
  melody: [0, 2, 4, 5, 4, 2, 0, 4, 5, 7, 7, 5],
  chordProgression: [
    [0, 2, 4], [2, 4, 6], [4, 5, 7], [3, 5, 7]
  ],
  melodyIndex: 0,
  chordIndex: 0,
  
  init(){
    if(!this.ctx){
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : CONFIG.bgm.volume;
      this.masterGain.connect(this.ctx.destination);
    }
  },
  
  playNote(freq, duration, type='sine', volume=0.3){
    if(!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  },
  
  playChord(chordIdx){
    const chord = this.chordProgression[chordIdx];
    chord.forEach((noteIdx, i) => {
      setTimeout(() => {
        this.playNote(this.scale[noteIdx] * 0.5, 1.5, 'triangle', 0.15);
      }, i * 50);
    });
  },
  
  playBeat(){
    this.playNote(100, 0.08, 'square', 0.2);
    this.playNote(80, 0.1, 'triangle', 0.1);
  },
  
  playMelody(){
    const noteIdx = this.melody[this.melodyIndex];
    this.playNote(this.scale[noteIdx], 0.35, 'sine', 0.25);
    this.melodyIndex = (this.melodyIndex + 1) % this.melody.length;
  },
  
  start(){
    if(this.isPlaying) return;
    this.init();
    if(this.ctx.state === 'suspended'){
      this.ctx.resume();
    }
    this.isPlaying = true;
    this.melodyIndex = 0;
    this.chordIndex = 0;
    
    const beatIntervalMs = (60 / CONFIG.bgm.tempo) * 1000;
    const melodyIntervalMs = beatIntervalMs * 0.5;
    const chordIntervalMs = beatIntervalMs * 4;
    
    this.playBeat();
    this.playChord(0);
    
    this.beatInterval = setInterval(() => {
      this.playBeat();
      if(Math.random() > 0.7){
        this.playNote(150 + Math.random() * 100, 0.1, 'sine', 0.05);
      }
    }, beatIntervalMs);
    
    this.noteInterval = setInterval(() => {
      this.playMelody();
      this.melodyIndex = (this.melodyIndex + 1) % this.melody.length;
    }, melodyIntervalMs);
    
    setInterval(() => {
      this.chordIndex = (this.chordIndex + 1) % this.chordProgression.length;
      this.playChord(this.chordIndex);
    }, chordIntervalMs);
  },
  
  pause(){
    if(!this.isPlaying) return;
    this.isPlaying = false;
    if(this.noteInterval) clearInterval(this.noteInterval);
    if(this.beatInterval) clearInterval(this.beatInterval);
    if(this.ctx && this.ctx.state === 'running'){
      this.ctx.suspend();
    }
  },
  
  resume(){
    if(this.isPlaying) return;
    this.isPlaying = true;
    if(this.ctx && this.ctx.state === 'suspended'){
      this.ctx.resume();
    }
    const beatIntervalMs = (60 / CONFIG.bgm.tempo) * 1000;
    const melodyIntervalMs = beatIntervalMs * 0.5;
    
    this.playBeat();
    
    this.beatInterval = setInterval(() => {
      this.playBeat();
      if(Math.random() > 0.7){
        this.playNote(150 + Math.random() * 100, 0.1, 'sine', 0.05);
      }
    }, beatIntervalMs);
    
    this.noteInterval = setInterval(() => {
      this.playMelody();
      this.melodyIndex = (this.melodyIndex + 1) % this.melody.length;
    }, melodyIntervalMs);
  },
  
  stop(){
    this.isPlaying = false;
    if(this.noteInterval) clearInterval(this.noteInterval);
    if(this.beatInterval) clearInterval(this.beatInterval);
    if(this.ctx){
      this.ctx.close();
      this.ctx = null;
    }
  },
  
  toggleMute(){
    this.isMuted = !this.isMuted;
    if(this.masterGain){
      this.masterGain.gain.value = this.isMuted ? 0 : CONFIG.bgm.volume;
    }
    return this.isMuted;
  }
};

function getRankData(){
  let data = localStorage.getItem('mazeRank');
  return data ? JSON.parse(data) : {
    1:{timeList:[],scoreList:[]},
    2:{timeList:[],scoreList:[]},
    3:{timeList:[],scoreList:[]}
  };
}
function saveRankData(data){
  localStorage.setItem('mazeRank', JSON.stringify(data));
}

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function spawnMazeItems(){
  gameState.items = [];
  const maze = gameState.maze;
  const emptyCells = [];
  for(let y=0;y<maze.length;y++){
    for(let x=0;x<maze[y].length;x++){
      if(maze[y][x] === 1) emptyCells.push({x,y});
    }
  }
  const itemCount = Math.min(6, emptyCells.length);
  const itemTypeList = ["coin","coin","coin","timeAdd","slow","ghost","doubleScore","teleport"];
  for(let i=0;i<itemCount;i++){
    const randomIdx = Math.floor(Math.random()*emptyCells.length);
    const pos = emptyCells.splice(randomIdx,1)[0];
    const type = itemTypeList[Math.floor(Math.random()*itemTypeList.length)];
    gameState.items.push({
      x: pos.x * CONFIG.cellSize + CONFIG.cellSize/2,
      y: pos.y * CONFIG.cellSize + CONFIG.cellSize/2,
      type: type,
      collected: false,
      tick: 0
    })
  }
}

function loadLevel(lv){
  gameState.currentLv = lv;
  gameState.maze = JSON.parse(JSON.stringify(CONFIG.levels[lv-1]));
  gameState.timeLeft = CONFIG.maxTime[lv-1];
  timeLeftText.innerText = gameState.timeLeft;
  curLevelText.innerText = lv;

  const maze = gameState.maze;
  for(let y=0;y<maze.length;y++){
    for(let x=0;x<maze[y].length;x++){
      if(maze[y][x] === 2){
        gameState.startPos = {x,y};
      }else if(maze[y][x] ===3){
        gameState.endPos = {x,y};
      }
    }
  }
  gameState.ballX = gameState.startPos.x * CONFIG.cellSize + CONFIG.cellSize/2;
  gameState.ballY = gameState.startPos.y * CONFIG.cellSize + CONFIG.cellSize/2;
  gameState.ballVx = 0; gameState.ballVy =0;
  gameState.accelX =0; gameState.accelY=0;

  gameState.score = 0;
  gameState.scoreMultiplier = 1;
  gameState.activeBuff = {slow:0,ghost:0};
  scoreText.innerText = "0";
  spawnMazeItems();
}

window.addEventListener('deviceorientation', (e)=>{
  if(!gameState.isPlaying || gameState.isPaused) return;
  const gamma = e.gamma || 0;
  const beta = e.beta || 0;
  let tiltX = gamma / 90;
  let tiltY = beta / 90;
  tiltX = Math.max(-1, Math.min(1, tiltX));
  tiltY = Math.max(-1, Math.min(1, tiltY));
  gameState.accelX += (tiltX - gameState.accelX) * CONFIG.smoothFactor;
  gameState.accelY += (tiltY - gameState.accelY) * CONFIG.smoothFactor;
});

function checkWallCollision(x,y,r){
  const cellX = Math.floor(x / CONFIG.cellSize);
  const cellY = Math.floor(y / CONFIG.cellSize);
  for(let dy=-1;dy<=1;dy++){
    for(let dx=-1;dx<=1;dx++){
      const cx = cellX + dx;
      const cy = cellY + dy;
      if(cy<0 || cy>=gameState.maze.length || cx<0 || cx>=gameState.maze[cy].length) return true;
      if(gameState.maze[cy][cx] === 0 && gameState.activeBuff.ghost <= 0){
        const wallL = cx*CONFIG.cellSize;
        const wallT = cy*CONFIG.cellSize;
        const wallR = wallL + CONFIG.cellSize;
        const wallB = wallT + CONFIG.cellSize;
        const closestX = Math.max(wallL, Math.min(x, wallR));
        const closestY = Math.max(wallT, Math.min(y, wallB));
        const distX = x - closestX;
        const distY = y - closestY;
        const dist = Math.sqrt(distX*distX + distY*distY);
        if(dist < r) return true;
      }
    }
  }
  return false;
}

function triggerItemEffect(type){
  const cfg = CONFIG.itemTypes[type];
  switch(type){
    case "coin":
      const add = cfg.score * gameState.scoreMultiplier;
      gameState.score += add;
      scoreText.innerText = gameState.score;
      break;
    case "timeAdd":
      gameState.timeLeft += cfg.addTime;
      timeLeftText.innerText = gameState.timeLeft;
      break;
    case "slow":
      gameState.activeBuff.slow = cfg.duration * 60;
      break;
    case "ghost":
      gameState.activeBuff.ghost = cfg.duration * 60;
      break;
    case "doubleScore":
      gameState.scoreMultiplier = 2;
      break;
    case "teleport":
      gameState.ballX = gameState.endPos.x * CONFIG.cellSize + CONFIG.cellSize/2;
      gameState.ballY = gameState.endPos.y * CONFIG.cellSize/2;
      break;
  }
}
function checkItemPickup(){
  const bx = gameState.ballX;
  const by = gameState.ballY;
  const br = CONFIG.ballRadius;
  const ir = CONFIG.itemRadius;
  for(let i=gameState.items.length-1;i>=0;i--){
    const item = gameState.items[i];
    if(item.collected) continue;
    const dx = bx - item.x;
    const dy = by - item.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if(dist < br + ir){
      item.collected = true;
      triggerItemEffect(item.type);
    }
  }
}

function checkWin(){
  const ex = gameState.endPos.x * CONFIG.cellSize + CONFIG.cellSize/2;
  const ey = gameState.endPos.y * CONFIG.cellSize + CONFIG.cellSize/2;
  const dx = gameState.ballX - ex;
  const dy = gameState.ballY - ey;
  const dist = Math.sqrt(dx*dx + dy*dy);
  return dist < CONFIG.ballRadius;
}

function gameUpdate(){
  if(!gameState.isPlaying || gameState.isPaused) return;
  if(gameState.activeBuff.slow > 0) gameState.activeBuff.slow--;
  if(gameState.activeBuff.ghost > 0) gameState.activeBuff.ghost--;
  checkItemPickup();

  let fx = gameState.accelX;
  let fy = gameState.accelY;
  const mag = Math.sqrt(fx*fx + fy*fy);
  if(mag < CONFIG.deadZone){ fx=0; fy=0; }

  gameState.ballVx += fx * CONFIG.forceScale;
  gameState.ballVy += fy * CONFIG.forceScale;

  let friction = 0.98;
  if(gameState.activeBuff.slow > 0) friction = 0.9;
  gameState.ballVx *= friction;
  gameState.ballVy *= friction;

  const maxSpeed = CONFIG.cellSize * 0.9;
  const speed = Math.sqrt(gameState.ballVx * gameState.ballVx + gameState.ballVy * gameState.ballVy);
  if(speed > maxSpeed){
    gameState.ballVx = (gameState.ballVx / speed) * maxSpeed;
    gameState.ballVy = (gameState.ballVy / speed) * maxSpeed;
  }

  const isGhostMode = gameState.activeBuff.ghost > 0;
  
  if(isGhostMode){
    gameState.ballX += gameState.ballVx;
    gameState.ballY += gameState.ballVy;
    
    if(gameState.ballX < CONFIG.ballRadius) gameState.ballX = CONFIG.ballRadius;
    if(gameState.ballY < CONFIG.ballRadius) gameState.ballY = CONFIG.ballRadius;
    if(gameState.ballX > gameState.maze[0].length * CONFIG.cellSize - CONFIG.ballRadius){
      gameState.ballX = gameState.maze[0].length * CONFIG.cellSize - CONFIG.ballRadius;
    }
    if(gameState.ballY > gameState.maze.length * CONFIG.cellSize - CONFIG.ballRadius){
      gameState.ballY = gameState.maze.length * CONFIG.cellSize - CONFIG.ballRadius;
    }
  }else{
    const subStep = CONFIG.cellSize / 2;
    const dx = gameState.ballVx;
    const dy = gameState.ballVy;
    const totalDist = Math.sqrt(dx * dx + dy * dy);
     
    if(totalDist > 0){
      const steps = Math.ceil(totalDist / subStep);
      const stepX = dx / steps;
      const stepY = dy / steps;
      
      for(let i=0;i<steps;i++){
        const testX = gameState.ballX + stepX;
        const testY = gameState.ballY + stepY;
        
        if(checkWallCollision(testX, gameState.ballY, CONFIG.ballRadius)){
          gameState.ballVx *= -0.4;
          break;
        }
        if(checkWallCollision(gameState.ballX, testY, CONFIG.ballRadius)){
          gameState.ballVy *= -0.4;
          break;
        }
        gameState.ballX = testX;
        gameState.ballY = testY;
      }
    }
  }

  if(checkWin()){
    gameWin();
    return;
  }
  render();
  requestAnimationFrame(gameUpdate);
}

function render(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const maze = gameState.maze;
  const offsetX = (canvas.width - maze[0].length * CONFIG.cellSize)/2;
  const offsetY = (canvas.height - maze.length * CONFIG.cellSize)/2;
  for(let y=0;y<maze.length;y++){
    for(let x=0;x<maze[y].length;x++){
      const px = offsetX + x*CONFIG.cellSize;
      const py = offsetY + y*CONFIG.cellSize;
      const val = maze[y][x];
      if(val === 0) ctx.fillStyle = '#16213e';
      else if(val ===2) ctx.fillStyle = '#0099ff';
      else if(val ===3) ctx.fillStyle = '#00e676';
      else ctx.fillStyle = '#0f3460';
      ctx.fillRect(px,py,CONFIG.cellSize-2,CONFIG.cellSize-2);
    }
  }
  gameState.items.forEach(item=>{
    if(item.collected) return;
    item.tick += 0.08;
    const floatY = Math.sin(item.tick) * 3;
    const cfg = CONFIG.itemTypes[item.type];
    ctx.beginPath();
    ctx.arc(offsetX + item.x, offsetY + item.y + floatY, CONFIG.itemRadius,0,Math.PI*2);
    ctx.fillStyle = cfg.color;
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.stroke();
  })
  ctx.beginPath();
  ctx.arc(offsetX + gameState.ballX, offsetY + gameState.ballY, CONFIG.ballRadius,0,Math.PI*2);
  ctx.fillStyle = 'rgba(255, 212, 0, 0.75)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth=2;
  ctx.stroke();
  
  const gradient = ctx.createRadialGradient(
    offsetX + gameState.ballX - CONFIG.ballRadius * 0.3,
    offsetY + gameState.ballY - CONFIG.ballRadius * 0.3,
    0,
    offsetX + gameState.ballX,
    offsetY + gameState.ballY,
    CONFIG.ballRadius
  );
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 200, 0.2)');
  gradient.addColorStop(1, 'rgba(255, 212, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fill();
}

function startTimer(){
  clearInterval(gameState.timer);
  gameState.timer = setInterval(()=>{
    if(gameState.isPaused) return;
    gameState.timeLeft -=1;
    timeLeftText.innerText = gameState.timeLeft;
    if(gameState.timeLeft <=0){
      gameFail();
    }
  },1000);
}

function gameWin(){
  clearInterval(gameState.timer);
  gameState.isPlaying = false;
  const usedTime = CONFIG.maxTime[gameState.currentLv-1] - gameState.timeLeft;
  const baseScore = 1000;
  const total = baseScore + gameState.score;
  gameState.totalScore = total;
  winTimeText.innerText = usedTime;
  winTotalScoreText.innerText = total;

  const rankData = getRankData();
  const lvData = rankData[gameState.currentLv];
  lvData.timeList.push(usedTime);
  lvData.timeList.sort((a,b)=>a-b);
  lvData.timeList = lvData.timeList.slice(0,5);
  lvData.scoreList.push(total);
  lvData.scoreList.sort((a,b)=>b-a);
  lvData.scoreList = lvData.scoreList.slice(0,5);
  saveRankData(rankData);

  timeRankList.innerHTML = "";
  lvData.timeList.forEach((t,i)=>{
    const div = document.createElement('div');
    div.className = 'rank-item';
    div.innerHTML = `<span>第${i+1}名</span><span>${t}秒</span>`;
    timeRankList.appendChild(div);
  })
  scoreRankList.innerHTML = "";
  lvData.scoreList.forEach((s,i)=>{
    const div = document.createElement('div');
    div.className = 'rank-item';
    div.innerHTML = `<span>第${i+1}名</span><span>${s}分</span>`;
    scoreRankList.appendChild(div);
  })

  gameBar.classList.add('hidden');
  winPanel.classList.remove('hidden');
  BGM.stop();
}

function gameFail(){
  clearInterval(gameState.timer);
  gameState.isPlaying = false;
  failScoreText.innerText = gameState.score;
  gameBar.classList.add('hidden');
  failPanel.classList.remove('hidden');
  BGM.stop();
}

async function startGame(lv){
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const permissionState = await DeviceOrientationEvent.requestPermission();
      if (permissionState !== 'granted') {
        alert('需要允许设备方向权限才能控制小球');
        return;
      }
    } catch (error) {
      console.error('权限请求失败:', error);
    }
  }
  loadLevel(lv);
  mainMenu.classList.add('hidden');
  levelPanel.classList.add('hidden');
  winPanel.classList.add('hidden');
  failPanel.classList.add('hidden');
  sharePanel.classList.add('hidden');
  pausePanel.classList.add('hidden');
  gameBar.classList.remove('hidden');
  gameState.isPlaying = true;
  gameState.isPaused = false;
  BGM.start();
  startTimer();
  gameUpdate();
}

const GAME_URL = window.location.href;
const SHARE_TEXT_NORMAL = "超好玩的重力迷宫小球！倾斜手机控制小球闯关，超多道具和关卡，快来挑战我的记录！";
let shareIsScoreMode = false;

function getShareScoreText(){
  const usedTime = CONFIG.maxTime[gameState.currentLv-1] - gameState.timeLeft;
  return `我在重力迷宫小球第${gameState.currentLv}关只用${usedTime}秒通关，总分${gameState.totalScore}分，快来和我比拼！`;
}
function openSharePanel(isScore = false){
  shareIsScoreMode = isScore;
  shareTip.innerText = isScore ? "分享你的本局战绩到社交平台" : "分享游戏给好友一起玩";
  sharePanel.classList.remove('hidden');
}
closeShareBtn.onclick = ()=> sharePanel.classList.add('hidden');

sysShareBtn.onclick = async ()=>{
  const title = shareIsScoreMode ? `重力迷宫第${gameState.currentLv}关战绩` : "重力迷宫小球";
  const text = shareIsScoreMode ? getShareScoreText() : SHARE_TEXT_NORMAL;
  try{
    if(navigator.share && navigator.canShare){
      await navigator.share({title, text, url: GAME_URL});
      alert("分享成功！");
    }else{
      alert("当前浏览器不支持一键分享，请复制链接分享");
    }
  }catch(err){
    alert("分享取消或失败，复制链接发送好友吧");
  }
};

copyLinkBtn.onclick = async ()=>{
  try{
    await navigator.clipboard.writeText(GAME_URL);
    alert("游戏链接已复制！粘贴到微信/QQ即可分享");
  }catch(err){
    const input = document.createElement('input');
    input.value = GAME_URL;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    alert("链接复制成功！");
  }
};

function drawPoster(){
  const w = posterCanvas.width;
  const h = posterCanvas.height;
  const grad = posterCtx.createLinearGradient(0,0,0,h);
  grad.addColorStop(0,"#1a1a2e");
  grad.addColorStop(1,"#0f3460");
  posterCtx.fillStyle = grad;
  posterCtx.fillRect(0,0,w,h);

  posterCtx.fillStyle = "#00d4ff";
  posterCtx.font = "bold 28px system-ui";
  posterCtx.textAlign = "center";
  posterCtx.fillText("重力迷宫小球", w/2, 80);

  if(shareIsScoreMode){
    const usedTime = CONFIG.maxTime[gameState.currentLv-1] - gameState.timeLeft;
    posterCtx.fillStyle = "#fff";
    posterCtx.font = "20px system-ui";
    posterCtx.fillText(`关卡：第${gameState.currentLv}关`, w/2, 150);
    posterCtx.fillText(`通关用时：${usedTime}秒`, w/2, 190);
    posterCtx.fillText(`本局总分：${gameState.totalScore}`, w/2, 230);
    posterCtx.fillStyle = "#ffdd00";
    posterCtx.font = "16px system-ui";
    posterCtx.fillText("快来挑战我的记录！", w/2, 300);
  }else{
    posterCtx.fillStyle = "#eee";
    posterCtx.font = "18px system-ui";
    posterCtx.fillText("倾斜手机控制小球闯关", w/2, 150);
    posterCtx.fillText("超多道具、多难度关卡", w/2, 190);
    posterCtx.fillText("和好友比拼最快通关记录", w/2, 230);
  }
  posterCtx.fillStyle = "#aaa";
  posterCtx.font = "14px system-ui";
  posterCtx.fillText(GAME_URL, w/2, h-80);
}
savePosterBtn.onclick = ()=>{
  drawPoster();
  const imgUrl = posterCanvas.toDataURL("image/png");
  const a = document.createElement('a');
  a.href = imgUrl;
  if(shareIsScoreMode){
    const usedTime = CONFIG.maxTime[gameState.currentLv-1] - gameState.timeLeft;
    a.download = `迷宫战绩_第${gameState.currentLv}关_${usedTime}秒.png`;
  }else{
    a.download = "重力迷宫游戏海报.png";
  }
  a.click();
  alert("海报已下载，可保存相册发朋友圈！");
};

shareGameBtn.onclick = ()=> openSharePanel(false);
shareScoreBtn.onclick = ()=> openSharePanel(true);

wx.ready(function(){
  wx.updateAppMessageShareData({
    title: "重力迷宫小球",
    desc: SHARE_TEXT_NORMAL,
    link: GAME_URL,
    imgUrl: "",
    success: function () {}
  });
  wx.updateTimelineShareData({
    title: "重力迷宫小球",
    link: GAME_URL,
    imgUrl: "",
    success: function () {}
  });
});

document.getElementById('startBtn').onclick = ()=>startGame(1);
document.getElementById('levelSelectBtn').onclick = ()=>{
  mainMenu.classList.add('hidden');
  levelPanel.classList.remove('hidden');
};
document.getElementById('backMenuBtn').onclick = ()=>{
  levelPanel.classList.add('hidden');
  mainMenu.classList.remove('hidden');
};
document.querySelectorAll('.level-btn').forEach(btn=>{
  btn.onclick = ()=>startGame(Number(btn.dataset.lv));
});
pauseBtn.onclick = ()=>{
  gameState.isPaused = true;
  pausePanel.classList.remove('hidden');
  BGM.pause();
};
document.getElementById('resumeBtn').onclick = ()=>{
  gameState.isPaused = false;
  pausePanel.classList.add('hidden');
  BGM.resume();
  gameUpdate();
};
document.getElementById('resetBtn').onclick = ()=>{
  pausePanel.classList.add('hidden');
  startGame(gameState.currentLv);
};
document.getElementById('quitBtn').onclick = ()=>{
  clearInterval(gameState.timer);
  gameState.isPlaying = false;
  pausePanel.classList.add('hidden');
  gameBar.classList.add('hidden');
  mainMenu.classList.remove('hidden');
  BGM.stop();
};
document.getElementById('nextLvBtn').onclick = ()=>{
  const next = gameState.currentLv +1;
  if(next>3){
    alert('全部关卡通关！');
    winPanel.classList.add('hidden');
    mainMenu.classList.remove('hidden');
    BGM.stop();
  }else{
    winPanel.classList.add('hidden');
    startGame(next);
  }
};
document.getElementById('replayBtn').onclick = ()=>{
  winPanel.classList.add('hidden');
  startGame(gameState.currentLv);
};
document.getElementById('winQuitBtn').onclick = ()=>{
  winPanel.classList.add('hidden');
  mainMenu.classList.remove('hidden');
  BGM.stop();
};
document.getElementById('retryBtn').onclick = ()=>{
  failPanel.classList.add('hidden');
  startGame(gameState.currentLv);
};
document.getElementById('failQuitBtn').onclick = ()=>{
  failPanel.classList.add('hidden');
  mainMenu.classList.remove('hidden');
  BGM.stop();
};
muteBtn.onclick = ()=>{
  const isMuted = BGM.toggleMute();
  muteBtn.innerText = isMuted ? '🔇' : '🔊';
};