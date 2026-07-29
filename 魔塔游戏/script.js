const TILE = {
    FLOOR: 0, WALL: 1, RED_DOOR: 2, YELLOW_DOOR: 3, BLUE_DOOR: 4,
    STAIRS_UP: 5, STAIRS_DOWN: 6,
    RED_KEY: 10, YELLOW_KEY: 11, BLUE_KEY: 12,
    POTION: 13, BIG_POTION: 14,
    SWORD: 15, SHIELD: 16,
    GOLD: 17,
    SHOP_ATK: 30, SHOP_DEF: 31, SHOP_HP: 32,
    MONSTER_SLIME: 20, MONSTER_BAT: 21, MONSTER_SKELETON: 22,
    MONSTER_ZOMBIE: 23, MONSTER_GHOST: 24, MONSTER_ORC: 25,
    MONSTER_DEMON: 26, MONSTER_DRAGON: 27
};

const TILE_SIZE = 40;
const MAP_W = 16;
const MAP_H = 12;

const monsterDefs = {
    [TILE.MONSTER_SLIME]:   { name: '史莱姆', hp: 40,  atk: 8,  def: 1,  gold: 2,  emoji: '🟢' },
    [TILE.MONSTER_BAT]:     { name: '蝙蝠',   hp: 35,  atk: 10, def: 2,  gold: 4,  emoji: '🦇' },
    [TILE.MONSTER_SKELETON]:{ name: '骷髅',   hp: 70,  atk: 14, def: 4,  gold: 6,  emoji: '💀' },
    [TILE.MONSTER_ZOMBIE]:  { name: '僵尸',   hp: 100, atk: 18, def: 8,  gold: 10, emoji: '🧟' },
    [TILE.MONSTER_GHOST]:   { name: '幽灵',   hp: 80,  atk: 22, def: 10, gold: 14, emoji: '👻' },
    [TILE.MONSTER_ORC]:     { name: '兽人',   hp: 100, atk: 22, def: 12, gold: 18, emoji: '👹' },
    [TILE.MONSTER_DEMON]:   { name: '恶魔',   hp: 150, atk: 28, def: 16, gold: 30, emoji: '😈' },
    [TILE.MONSTER_DRAGON]:  { name: '恶龙',   hp: 200, atk: 35, def: 15, gold: 150,emoji: '🐉' }
};

const floors = [
    {
        name: '第 1 层',
        map: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
            [1,0,13,0,0,20,0,1,0,20,0,0,13,0,0,1],
            [1,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1],
            [1,0,20,0,0,17,0,1,0,0,10,0,0,20,0,1],
            [1,0,0,0,10,0,0,1,1,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,20,0,0,0,20,0,0,0,0,0,1],
            [1,0,17,0,0,0,0,10,0,0,0,0,17,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,20,0,5,0,0,0,0,0,0,0,0,20,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        spawn: { x: 1, y: 1 },
        stairsDown: { x: 4, y: 10 }
    },
    {
        name: '第 2 层',
        map: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,21,0,1,0,0,0,21,0,0,0,1],
            [1,0,11,0,0,0,0,3,0,0,0,0,0,11,0,1],
            [1,0,0,0,14,0,0,1,1,0,0,14,0,0,0,1],
            [1,3,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,21,0,0,0,0,0,0,0,21,0,1],
            [1,0,21,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,11,0,0,1,1,0,0,0,21,0,0,1],
            [1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,21,0,0,0,0,1],
            [1,0,21,0,0,6,0,0,0,21,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        spawn: { x: 4, y: 10 },
        stairsDown: { x: 5, y: 10 },
        stairsUp: { x: 4, y: 1 }
    },
    {
        name: '第 3 层',
        map: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,22,0,0,1,0,0,0,22,0,0,0,1],
            [1,0,15,0,0,0,0,15,0,0,0,0,0,12,0,1],
            [1,0,0,0,22,0,0,1,1,0,0,22,0,0,0,1],
            [1,0,0,0,0,0,11,0,0,11,0,0,0,0,0,1],
            [1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,1],
            [1,0,0,0,0,22,0,0,0,0,0,0,0,22,0,1],
            [1,0,16,0,0,0,0,13,0,0,0,0,0,0,0,1],
            [1,0,0,0,22,0,0,0,0,0,0,22,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,22,0,0,6,0,0,0,22,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        spawn: { x: 5, y: 10 },
        stairsDown: { x: 5, y: 10 },
        stairsUp: { x: 7, y: 3 }
    },
    {
        name: '第 4 层',
        map: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,24,0,0,0,0,0,0,24,0,0,0,1],
            [1,0,14,0,0,0,11,1,1,11,0,0,0,16,0,1],
            [1,0,0,0,24,0,0,1,1,0,0,24,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,1,1,1,1,1,1,1,1,4,1],
            [1,0,0,0,24,0,0,0,0,0,0,24,0,0,0,1],
            [1,0,13,0,0,0,0,2,2,0,0,0,0,13,0,1],
            [1,0,0,0,24,0,0,0,0,0,0,24,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,24,0,0,6,0,0,0,24,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        spawn: { x: 5, y: 10 },
        stairsDown: { x: 5, y: 10 },
        stairsUp: { x: 7, y: 3 }
    },
    {
        name: '第 5 层',
        map: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,14,0,0,0,25,0,0,25,0,0,14,0,0,1],
            [1,0,0,0,25,0,0,0,0,0,0,25,0,0,0,1],
            [1,0,25,0,0,0,15,15,0,0,25,0,0,0,0,1],
            [1,0,0,0,26,0,0,0,0,26,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,15,0,26,0,0,27,0,0,26,0,15,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,25,0,0,0,25,0,0,25,0,0,25,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        spawn: { x: 1, y: 10 },
        stairsUp: { x: 5, y: 10 }
    }
];

const player = {
    x: 1, y: 1,
    hp: 1000, maxHp: 1000,
    atk: 10, def: 10,
    gold: 0,
    redKeys: 0, yellowKeys: 0, blueKeys: 0,
    floor: 0
};

let canvas, ctx;
let gameMap = null;
let gameOver = false;
let lastTouchTime = 0;
let keyListenerAdded = false;
let canvasEventsAdded = false;
let mobileEventsAdded = false;

function initGame() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');

    player.x = floors[0].spawn.x;
    player.y = floors[0].spawn.y;
    player.hp = 1000; player.maxHp = 1000;
    player.atk = 10; player.def = 10;
    player.gold = 0;
    player.redKeys = 0; player.yellowKeys = 0; player.blueKeys = 0;
    player.floor = 0;
    gameOver = false;

    loadFloor(0);
    updateStats();
    hideModal();

    if (!keyListenerAdded) {
        document.addEventListener('keydown', handleKeyDown);
        keyListenerAdded = true;
    }

    setupMobileControls();
    setupCanvasClick();

    draw();
}

function setupMobileControls() {
    if (mobileEventsAdded) return;
    mobileEventsAdded = true;
    const buttons = document.querySelectorAll('.ctrl-btn');
    buttons.forEach(btn => {
        const dir = btn.getAttribute('data-dir');
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            handleDirPress(dir);
        });
        btn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            handleDirPress(dir);
        }, { passive: false });
    });
}

function handleDirPress(dir) {
    if (gameOver) return;
    const now = Date.now();
    if (now - lastTouchTime < 200) return;
    lastTouchTime = now;

    switch(dir) {
        case 'up': movePlayer(0, -1); break;
        case 'down': movePlayer(0, 1); break;
        case 'left': movePlayer(-1, 0); break;
        case 'right': movePlayer(1, 0); break;
        case 'center': waitPlayer(); break;
    }
}

function setupCanvasClick() {
    if (canvasEventsAdded) return;
    canvasEventsAdded = true;
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const cx = touch.clientX - rect.left;
        const cy = touch.clientY - rect.top;
        handleCanvasInteraction(cx, cy);
    }, { passive: false });
}

function handleCanvasClick(e) {
    const rect = canvas.getBoundingClientRect();
    const cx = (e.clientX || e.pageX) - rect.left;
    const cy = (e.clientY || e.pageY) - rect.top;
    handleCanvasInteraction(cx, cy);
}

function handleCanvasInteraction(cx, cy) {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const tileSize = Math.min(
        Math.floor(canvas.width / MAP_W),
        Math.floor(canvas.height / MAP_H)
    );

    const offsetX = Math.floor((canvas.width - tileSize * MAP_W) / 2);
    const offsetY = Math.floor((canvas.height - tileSize * MAP_H) / 2);

    const canvasX = cx * scaleX;
    const canvasY = cy * scaleY;

    const tx = Math.floor((canvasX - offsetX) / tileSize);
    const ty = Math.floor((canvasY - offsetY) / tileSize);

    if (tx < 0 || tx >= MAP_W || ty < 0 || ty >= MAP_H) return;

    const dx = tx - player.x;
    const dy = ty - player.y;

    if (Math.abs(dx) + Math.abs(dy) === 1) {
        movePlayer(dx, dy);
    } else if (dx === 0 && dy === 0) {
        waitPlayer();
    } else {
        let stepX = 0, stepY = 0;
        if (Math.abs(dx) > Math.abs(dy)) {
            stepX = dx > 0 ? 1 : -1;
        } else {
            stepY = dy > 0 ? 1 : -1;
        }
        movePlayer(stepX, stepY);
    }
}

function loadFloor(floorIdx) {
    player.floor = floorIdx;
    const floor = floors[floorIdx];
    gameMap = floor.map.map(row => [...row]);

    if (floorIdx > 0) {
        player.x = floor.spawn.x;
        player.y = floor.spawn.y;
    }

    updateFloorButtons();
    showInfo(`你来到了 ${floor.name}`);
}

function updateFloorButtons() {
    const container = document.getElementById('floor-buttons');
    const floor = floors[player.floor];
    container.innerHTML = '';

    if (player.floor > 0 && floor.stairsUp) {
        const btnUp = document.createElement('button');
        btnUp.className = 'floor-btn';
        btnUp.innerHTML = '<i class="fas fa-arrow-up"></i> 上楼';
        btnUp.onclick = () => useStairs('up');
        container.appendChild(btnUp);
    }

    if (player.floor < floors.length - 1 && floor.stairsDown) {
        const btnDown = document.createElement('button');
        btnDown.className = 'floor-btn';
        btnDown.innerHTML = '<i class="fas fa-arrow-down"></i> 下楼';
        btnDown.onclick = () => useStairs('down');
        container.appendChild(btnDown);
    }
}

function useStairs(dir) {
    const floor = floors[player.floor];
    const pos = dir === 'up' ? floor.stairsUp : floor.stairsDown;
    if (!pos) return;

    if (player.x === pos.x && player.y === pos.y) {
        const nextFloor = dir === 'up' ? player.floor - 1 : player.floor + 1;
        loadFloor(nextFloor);
        draw();
    } else {
        showInfo('需要走到楼梯口才能上下楼');
    }
}

function handleKeyDown(e) {
    if (gameOver) return;

    switch(e.key) {
        case 'ArrowUp': case 'w': case 'W': movePlayer(0, -1); e.preventDefault(); break;
        case 'ArrowDown': case 's': case 'S': movePlayer(0, 1); e.preventDefault(); break;
        case 'ArrowLeft': case 'a': case 'A': movePlayer(-1, 0); e.preventDefault(); break;
        case 'ArrowRight': case 'd': case 'D': movePlayer(1, 0); e.preventDefault(); break;
        case ' ': case '.': waitPlayer(); e.preventDefault(); break;
    }
}

function movePlayer(dx, dy) {
    if (gameOver) return;

    const nx = player.x + dx;
    const ny = player.y + dy;

    if (nx < 0 || nx >= MAP_W || ny < 0 || ny >= MAP_H) return;

    const tile = gameMap[ny][nx];

    if (tile === TILE.WALL) return;

    if (tile >= TILE.MONSTER_SLIME && tile <= TILE.MONSTER_DRAGON) {
        attackMonster(nx, ny, tile);
        return;
    }

    if (tile === TILE.RED_DOOR) {
        if (player.redKeys > 0) {
            player.redKeys--;
            gameMap[ny][nx] = TILE.FLOOR;
            showInfo('打开了红色门！');
        } else {
            showInfo('需要一把红钥匙！');
            return;
        }
    } else if (tile === TILE.YELLOW_DOOR) {
        if (player.yellowKeys > 0) {
            player.yellowKeys--;
            gameMap[ny][nx] = TILE.FLOOR;
            showInfo('打开了黄门！');
        } else {
            showInfo('需要一把黄钥匙！');
            return;
        }
    } else if (tile === TILE.BLUE_DOOR) {
        if (player.blueKeys > 0) {
            player.blueKeys--;
            gameMap[ny][nx] = TILE.FLOOR;
            showInfo('打开了蓝门！');
        } else {
            showInfo('需要一把蓝钥匙！');
            return;
        }
    }

    handleItemPickup(tile, nx, ny);

    player.x = nx;
    player.y = ny;

    if (tile === TILE.STAIRS_UP) {
        useStairs('up');
    } else if (tile === TILE.STAIRS_DOWN) {
        useStairs('down');
    }

    updateStats();
    draw();
    checkGameState();
}

function handleItemPickup(tile, x, y) {
    switch(tile) {
        case TILE.RED_KEY:
            player.redKeys++;
            showInfo('拾取了红钥匙！');
            break;
        case TILE.YELLOW_KEY:
            player.yellowKeys++;
            showInfo('拾取了黄钥匙！');
            break;
        case TILE.BLUE_KEY:
            player.blueKeys++;
            showInfo('拾取了蓝钥匙！');
            break;
        case TILE.POTION:
            player.hp = Math.min(player.maxHp, player.hp + 200);
            showInfo('喝了小药水，恢复200生命！');
            break;
        case TILE.BIG_POTION:
            player.hp = Math.min(player.maxHp, player.hp + 500);
            showInfo('喝了大药水，恢复500生命！');
            break;
        case TILE.SWORD:
            player.atk += 5;
            showInfo('装备了剑，攻击+5！');
            break;
        case TILE.SHIELD:
            player.def += 5;
            showInfo('装备了盾，防御+5！');
            break;
        case TILE.GOLD:
            player.gold += 10;
            showInfo('拾取了金币+10！');
            break;
        default:
            return;
    }
    gameMap[y][x] = TILE.FLOOR;
}

function attackMonster(mx, my, tileType) {
    const def = monsterDefs[tileType];
    const effectiveAtk = Math.max(1, player.atk - def.def);
    const effectiveDef = Math.max(0, def.atk - player.def);
    const rounds = Math.ceil(def.hp / effectiveAtk);
    const totalDamage = (rounds - 1) * effectiveDef;

    if (player.hp <= totalDamage) {
        player.hp = 0;
        gameOver = true;
        showGameOver(false);
        return;
    }

    player.hp -= totalDamage;
    player.gold += def.gold;

    gameMap[my][mx] = TILE.FLOOR;
    showInfo(`击败了${def.name}！获得${def.gold}金币，受到${totalDamage}伤害`);

    updateStats();
    draw();
    checkGameState();
}

function waitPlayer() {
    if (gameOver) return;
    if (player.hp < player.maxHp) {
        player.hp = Math.min(player.maxHp, player.hp + 10);
        updateStats();
        draw();
        showInfo('原地休息，恢复10生命');
    }
}

function checkGameState() {
    if (player.hp <= 0) {
        gameOver = true;
        showGameOver(false);
        return;
    }

    if (player.floor === floors.length - 1) {
        const dragonAlive = gameMap ? gameMap.some(row => row.includes(TILE.MONSTER_DRAGON)) : false;
        if (!dragonAlive) {
            gameOver = true;
            showGameOver(true);
        }
    }
}

function showGameOver(victory) {
    const overlay = document.getElementById('modal-overlay');
    const icon = document.getElementById('modal-icon');
    const title = document.getElementById('modal-title');
    const msg = document.getElementById('modal-message');

    if (victory) {
        icon.textContent = '🏆';
        title.textContent = '恭喜通关！';
        msg.textContent = `你成功击败了恶龙，拯救了魔塔！最终金币：${player.gold}`;
    } else {
        icon.textContent = '💀';
        title.textContent = '勇者倒下了';
        msg.textContent = `你在第 ${player.floor + 1} 层被击败，获得金币：${player.gold}`;
    }

    overlay.style.display = 'flex';
}

function hideModal() {
    document.getElementById('modal-overlay').style.display = 'none';
}

function showInfo(text) {
    document.getElementById('info-text').textContent = text;
}

function updateStats() {
    document.getElementById('stat-hp').textContent = player.hp;
    document.getElementById('stat-atk').textContent = player.atk;
    document.getElementById('stat-def').textContent = player.def;
    document.getElementById('stat-gold').textContent = player.gold;
    document.getElementById('key-red').textContent = player.redKeys;
    document.getElementById('key-yellow').textContent = player.yellowKeys;
    document.getElementById('key-blue').textContent = player.blueKeys;
    document.getElementById('floor-display').textContent = floors[player.floor].name;
}

function draw() {
    if (!ctx) return;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!gameMap) return;

    const tileSize = Math.min(
        Math.floor(canvas.width / MAP_W),
        Math.floor(canvas.height / MAP_H)
    );

    const offsetX = Math.floor((canvas.width - tileSize * MAP_W) / 2);
    const offsetY = Math.floor((canvas.height - tileSize * MAP_H) / 2);

    for (let y = 0; y < MAP_H; y++) {
        for (let x = 0; x < MAP_W; x++) {
            drawTile(x, y, gameMap[y][x], offsetX, offsetY, tileSize);
        }
    }

    drawPlayer(offsetX + player.x * tileSize, offsetY + player.y * tileSize, tileSize);
}

function drawTile(x, y, tile, ox, oy, size) {
    const px = ox + x * size;
    const py = oy + y * size;

    switch(tile) {
        case TILE.WALL:
            ctx.fillStyle = '#4a5568';
            ctx.fillRect(px, py, size, size);
            ctx.fillStyle = '#2d3748';
            ctx.fillRect(px + 2, py + 2, size - 4, size - 4);
            ctx.strokeStyle = '#718096';
            ctx.lineWidth = 1;
            ctx.strokeRect(px + 0.5, py + 0.5, size - 1, size - 1);
            break;

        case TILE.FLOOR:
            ctx.fillStyle = '#2d3748';
            ctx.fillRect(px, py, size, size);
            ctx.fillStyle = '#374151';
            ctx.fillRect(px + 1, py + 1, size - 2, size - 2);
            break;

        case TILE.RED_DOOR:
            ctx.fillStyle = '#2d3748';
            ctx.fillRect(px, py, size, size);
            ctx.fillStyle = '#c53030';
            ctx.fillRect(px + 4, py + 2, size - 8, size - 4);
            ctx.fillStyle = '#e53e3e';
            ctx.fillRect(px + 6, py + 4, size - 12, size - 8);
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(px + size/2 - 2, py + size/2 - 2, 4, 4);
            break;

        case TILE.YELLOW_DOOR:
            ctx.fillStyle = '#2d3748';
            ctx.fillRect(px, py, size, size);
            ctx.fillStyle = '#d69e2e';
            ctx.fillRect(px + 4, py + 2, size - 8, size - 4);
            ctx.fillStyle = '#ecc94b';
            ctx.fillRect(px + 6, py + 4, size - 12, size - 8);
            ctx.fillStyle = '#744210';
            ctx.fillRect(px + size/2 - 2, py + size/2 - 2, 4, 4);
            break;

        case TILE.BLUE_DOOR:
            ctx.fillStyle = '#2d3748';
            ctx.fillRect(px, py, size, size);
            ctx.fillStyle = '#2b6cb0';
            ctx.fillRect(px + 4, py + 2, size - 8, size - 4);
            ctx.fillStyle = '#4299e1';
            ctx.fillRect(px + 6, py + 4, size - 12, size - 8);
            ctx.fillStyle = '#f7fafc';
            ctx.fillRect(px + size/2 - 2, py + size/2 - 2, 4, 4);
            break;

        case TILE.STAIRS_UP:
            ctx.fillStyle = '#2d3748';
            ctx.fillRect(px, py, size, size);
            ctx.fillStyle = '#718096';
            ctx.beginPath();
            ctx.moveTo(px + size/2, py + 4);
            ctx.lineTo(px + size - 4, py + size/2);
            ctx.lineTo(px + 4, py + size/2);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#a0aec0';
            ctx.beginPath();
            ctx.moveTo(px + 4, py + size/2);
            ctx.lineTo(px + size - 4, py + size/2);
            ctx.lineTo(px + size/2, py + size - 4);
            ctx.closePath();
            ctx.fill();
            break;

        case TILE.STAIRS_DOWN:
            ctx.fillStyle = '#2d3748';
            ctx.fillRect(px, py, size, size);
            ctx.fillStyle = '#4a5568';
            ctx.beginPath();
            ctx.moveTo(px + 4, py + size/2);
            ctx.lineTo(px + size - 4, py + size/2);
            ctx.lineTo(px + size/2, py + size - 4);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#2d3748';
            ctx.beginPath();
            ctx.moveTo(px + size/2, py + size - 4);
            ctx.lineTo(px + size - 4, py + size/2);
            ctx.lineTo(px + 4, py + size/2);
            ctx.closePath();
            ctx.fill();
            break;

        case TILE.RED_KEY:
        case TILE.YELLOW_KEY:
        case TILE.BLUE_KEY:
            drawKey(px, py, size, tile);
            break;

        case TILE.POTION:
        case TILE.BIG_POTION:
            drawPotion(px, py, size, tile);
            break;

        case TILE.SWORD:
            drawSword(px, py, size);
            break;

        case TILE.SHIELD:
            drawShield(px, py, size);
            break;

        case TILE.GOLD:
            drawGold(px, py, size);
            break;

        default:
            if (tile >= TILE.MONSTER_SLIME && tile <= TILE.MONSTER_DRAGON) {
                drawMonster(px, py, size, tile);
            }
            break;
    }
}

function drawKey(px, py, size, type) {
    const cx = px + size/2;
    const cy = py + size/2;
    let color, lightColor;

    if (type === TILE.RED_KEY) { color = '#c53030'; lightColor = '#fc8181'; }
    else if (type === TILE.YELLOW_KEY) { color = '#d69e2e'; lightColor = '#f6e05e'; }
    else { color = '#2b6cb0'; lightColor = '#63b3ed'; }

    ctx.fillStyle = '#2d3748';
    ctx.fillRect(px, py, size, size);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx - size*0.15, cy - size*0.1, size*0.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = lightColor;
    ctx.beginPath();
    ctx.arc(cx - size*0.15, cy - size*0.1, size*0.08, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.fillRect(cx - size*0.02, cy - size*0.05, size*0.3, size*0.08);
    ctx.fillRect(cx + size*0.15, cy + size*0.03, size*0.06, size*0.1);
    ctx.fillRect(cx + size*0.08, cy + size*0.03, size*0.06, size*0.08);
}

function drawPotion(px, py, size, type) {
    const cx = px + size/2;
    const cy = py + size/2;

    ctx.fillStyle = '#2d3748';
    ctx.fillRect(px, py, size, size);

    if (type === TILE.BIG_POTION) {
        ctx.fillStyle = '#f56565';
        ctx.beginPath();
        ctx.arc(cx, cy + size*0.1, size*0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#feb2b2';
        ctx.beginPath();
        ctx.arc(cx, cy + size*0.05, size*0.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#c53030';
        ctx.fillRect(cx - size*0.08, cy - size*0.2, size*0.16, size*0.1);
    } else {
        ctx.fillStyle = '#48bb78';
        ctx.beginPath();
        ctx.arc(cx, cy + size*0.1, size*0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#9ae6b4';
        ctx.beginPath();
        ctx.arc(cx, cy + size*0.05, size*0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#276749';
        ctx.fillRect(cx - size*0.06, cy - size*0.15, size*0.12, size*0.08);
    }
}

function drawSword(px, py, size) {
    const cx = px + size/2;
    const cy = py + size/2;

    ctx.fillStyle = '#2d3748';
    ctx.fillRect(px, py, size, size);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-Math.PI / 4);

    ctx.fillStyle = '#a0aec0';
    ctx.fillRect(-size*0.03, -size*0.3, size*0.06, size*0.5);

    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-size*0.02, -size*0.28, size*0.04, size*0.1);

    ctx.fillStyle = '#975a16';
    ctx.fillRect(-size*0.12, size*0.18, size*0.24, size*0.06);

    ctx.restore();
}

function drawShield(px, py, size) {
    const cx = px + size/2;
    const cy = py + size/2;

    ctx.fillStyle = '#2d3748';
    ctx.fillRect(px, py, size, size);

    ctx.fillStyle = '#4299e1';
    ctx.beginPath();
    ctx.moveTo(cx, cy - size*0.3);
    ctx.lineTo(cx + size*0.25, cy - size*0.15);
    ctx.lineTo(cx + size*0.25, cy + size*0.1);
    ctx.lineTo(cx, cy + size*0.3);
    ctx.lineTo(cx - size*0.25, cy + size*0.1);
    ctx.lineTo(cx - size*0.25, cy - size*0.15);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#63b3ed';
    ctx.beginPath();
    ctx.moveTo(cx, cy - size*0.2);
    ctx.lineTo(cx + size*0.15, cy - size*0.1);
    ctx.lineTo(cx + size*0.15, cy + size*0.05);
    ctx.lineTo(cx, cy + size*0.2);
    ctx.lineTo(cx - size*0.15, cy + size*0.05);
    ctx.lineTo(cx - size*0.15, cy - size*0.1);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#f7fafc';
    ctx.font = `${size*0.2}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('+', cx, cy);
}

function drawGold(px, py, size) {
    const cx = px + size/2;
    const cy = py + size/2;

    ctx.fillStyle = '#2d3748';
    ctx.fillRect(px, py, size, size);

    ctx.fillStyle = '#d69e2e';
    ctx.beginPath();
    ctx.arc(cx, cy, size*0.22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f6e05e';
    ctx.beginPath();
    ctx.arc(cx, cy - size*0.02, size*0.16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#744210';
    ctx.font = `bold ${size*0.22}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', cx, cy + size*0.02);
}

function drawMonster(px, py, size, type) {
    const def = monsterDefs[type];
    const cx = px + size/2;
    const cy = py + size/2;

    ctx.fillStyle = '#2d3748';
    ctx.fillRect(px, py, size, size);

    let bodyColor, eyeColor;
    switch(type) {
        case TILE.MONSTER_SLIME: bodyColor = '#48bb78'; eyeColor = '#fff'; break;
        case TILE.MONSTER_BAT: bodyColor = '#6b46c1'; eyeColor = '#f56565'; break;
        case TILE.MONSTER_SKELETON: bodyColor = '#e2e8f0'; eyeColor = '#1a202c'; break;
        case TILE.MONSTER_ZOMBIE: bodyColor = '#68d391'; eyeColor = '#c53030'; break;
        case TILE.MONSTER_GHOST: bodyColor = '#cbd5e0'; eyeColor = '#4a5568'; break;
        case TILE.MONSTER_ORC: bodyColor = '#dd6b20'; eyeColor = '#fefcbf'; break;
        case TILE.MONSTER_DEMON: bodyColor = '#9b2c2c'; eyeColor = '#f6e05e'; break;
        case TILE.MONSTER_DRAGON: bodyColor = '#2c5282'; eyeColor = '#f56565'; break;
        default: bodyColor = '#999'; eyeColor = '#fff';
    }

    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.arc(cx, cy + size*0.05, size*0.3, 0, Math.PI * 2);
    ctx.fill();

    if (type === TILE.MONSTER_BAT || type === TILE.MONSTER_DRAGON) {
        ctx.beginPath();
        ctx.moveTo(cx - size*0.3, cy);
        ctx.lineTo(cx - size*0.15, cy - size*0.15);
        ctx.lineTo(cx - size*0.1, cy);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + size*0.3, cy);
        ctx.lineTo(cx + size*0.15, cy - size*0.15);
        ctx.lineTo(cx + size*0.1, cy);
        ctx.closePath();
        ctx.fill();
    }

    if (type === TILE.MONSTER_SKELETON || type === TILE.MONSTER_GHOST) {
        ctx.fillStyle = '#2d3748';
        ctx.fillRect(cx - size*0.15, cy - size*0.05, size*0.08, size*0.12);
        ctx.fillRect(cx + size*0.07, cy - size*0.05, size*0.08, size*0.12);
    } else {
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.arc(cx - size*0.1, cy - size*0.05, size*0.06, 0, Math.PI * 2);
        ctx.arc(cx + size*0.1, cy - size*0.05, size*0.06, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#2d3748';
        ctx.beginPath();
        ctx.arc(cx - size*0.1, cy - size*0.05, size*0.03, 0, Math.PI * 2);
        ctx.arc(cx + size*0.1, cy - size*0.05, size*0.03, 0, Math.PI * 2);
        ctx.fill();
    }

    if (type === TILE.MONSTER_DEMON || type === TILE.MONSTER_DRAGON) {
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.moveTo(cx - size*0.15, cy - size*0.25);
        ctx.lineTo(cx - size*0.05, cy - size*0.35);
        ctx.lineTo(cx, cy - size*0.2);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + size*0.15, cy - size*0.25);
        ctx.lineTo(cx + size*0.05, cy - size*0.35);
        ctx.lineTo(cx, cy - size*0.2);
        ctx.closePath();
        ctx.fill();
    }

    if (type === TILE.MONSTER_ORC || type === TILE.MONSTER_ZOMBIE) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(cx - size*0.08, cy + size*0.1, size*0.16, size*0.03);
    }

    if (type === TILE.MONSTER_DRAGON) {
        ctx.fillStyle = '#e53e3e';
        ctx.fillRect(cx - size*0.12, cy + size*0.12, size*0.06, size*0.04);
        ctx.fillRect(cx + size*0.06, cy + size*0.12, size*0.06, size*0.04);
    }
}

function drawPlayer(px, py, size) {
    const cx = px + size/2;
    const cy = py + size/2;

    ctx.fillStyle = '#2d3748';
    ctx.fillRect(px, py, size, size);

    ctx.fillStyle = '#ecc94b';
    ctx.beginPath();
    ctx.arc(cx, cy - size*0.15, size*0.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f6e05e';
    ctx.beginPath();
    ctx.arc(cx, cy - size*0.18, size*0.12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2d3748';
    ctx.beginPath();
    ctx.arc(cx - size*0.06, cy - size*0.15, size*0.025, 0, Math.PI * 2);
    ctx.arc(cx + size*0.06, cy - size*0.15, size*0.025, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#c05621';
    ctx.fillRect(cx - size*0.08, cy - size*0.05, size*0.16, size*0.03);

    ctx.fillStyle = '#4299e1';
    ctx.fillRect(cx - size*0.12, cy, size*0.24, size*0.22);

    ctx.fillStyle = '#2b6cb0';
    ctx.fillRect(cx - size*0.12, cy + size*0.18, size*0.24, size*0.04);

    ctx.fillStyle = '#63b3ed';
    ctx.fillRect(cx - size*0.08, cy + size*0.02, size*0.16, size*0.08);

    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(cx, cy - size*0.4);
    ctx.lineTo(cx - size*0.08, cy - size*0.25);
    ctx.lineTo(cx + size*0.08, cy - size*0.25);
    ctx.closePath();
    ctx.fill();
}

function restartGame() {
    hideModal();
    canvasEventsAdded = false;
    mobileEventsAdded = false;
    initGame();
}

function goBack() {
    if (window.opener && !window.opener.closed) {
        window.close();
    } else {
        window.location.href = '../games.html';
    }
}

window.addEventListener('resize', () => {
    if (!canvas) return;
    const container = canvas.parentElement;
    const maxW = container.clientWidth;
    const maxH = Math.max(300, window.innerHeight - 200);
    const size = Math.min(maxW, maxH, 640);
    canvas.style.width = size + 'px';
    canvas.style.height = Math.floor(size * MAP_H / MAP_W) + 'px';
});

document.addEventListener('DOMContentLoaded', () => {
    initGame();
    window.dispatchEvent(new Event('resize'));
});