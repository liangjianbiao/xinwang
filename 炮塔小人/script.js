/* ===== 炮塔小人 - 核心逻辑 ===== */
(() => {
    'use strict';

    const W = 480;
    const H = 720;
    const GY = H - 112;          // 地面线
    const MAX_HEARTS = 5;

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const dom = {
        score: document.getElementById('hudScore'),
        wave: document.getElementById('hudWave'),
        left: document.getElementById('hudLeft'),
        hearts: document.getElementById('hudHearts'),
        modalStart: document.getElementById('modalStart'),
        modalOver: document.getElementById('modalOver'),
        overStats: document.getElementById('overStats'),
        btnStart: document.getElementById('btnStart'),
        btnRestart: document.getElementById('btnRestart'),
        btnPlayAgain: document.getElementById('btnPlayAgain')
    };

    const rand = (a, b) => a + Math.random() * (b - a);
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    const game = {
        running: false,
        score: 0,
        wave: 1,
        hearts: 5,
        cannonX: W / 2,
        targetX: W / 2,
        fireCd: 0,
        blues: [],
        reds: [],
        gates: [],
        drops: [],
        parts: [],
        texts: [],
        toSpawn: 0,
        spawnCd: 0,
        gateTimer: 0,
        waveDelay: 0,
        banner: null,
        shake: 0,
        pointerActive: false,
        keys: Object.create(null)
    };

    let viewScale = 1;
    let clock = 0;

    /* ---------- 画布尺寸 ---------- */
    function resizeCanvas() {
        const wrap = canvas.parentElement;
        const cssW = Math.min(wrap.clientWidth, 480);
        const dpr = window.devicePixelRatio || 1;
        canvas.style.width = cssW + 'px';
        canvas.style.height = (cssW * H / W) + 'px';
        canvas.width = Math.round(cssW * dpr);
        canvas.height = Math.round(cssW * H / W * dpr);
        viewScale = canvas.width / W;
        ctx.setTransform(viewScale, 0, 0, viewScale, 0, 0);
    }

    window.addEventListener('resize', resizeCanvas);

    /* ---------- 输入 ---------- */
    function moveTo(clientX) {
        const rect = canvas.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * W;
        game.targetX = clamp(x, 38, W - 38);
    }

    canvas.addEventListener('pointerdown', e => {
        game.pointerActive = true;
        moveTo(e.clientX);
        try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* 忽略 */ }
    });
    canvas.addEventListener('pointermove', e => {
        if (game.pointerActive) moveTo(e.clientX);
    });
    const stopPointer = () => { game.pointerActive = false; };
    canvas.addEventListener('pointerup', stopPointer);
    canvas.addEventListener('pointercancel', stopPointer);
    canvas.addEventListener('pointerleave', stopPointer);

    window.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            game.keys[e.key] = true;
            e.preventDefault();
        } else {
            game.keys[e.key.toLowerCase()] = true;
        }
    });
    window.addEventListener('keyup', e => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            game.keys[e.key] = false;
        } else {
            game.keys[e.key.toLowerCase()] = false;
        }
    });

    /* ---------- 游戏数据 ---------- */
    function spawnBlue(x, y, vx) {
        if (game.blues.length >= 240) return;
        game.blues.push({
            x,
            y,
            vx: (vx || 0) + rand(-8, 8),
            vy: -330 - rand(0, 30),
            phase: Math.random() * Math.PI * 2,
            wob: 0,
            drawX: x,
            gateDone: false
        });
    }

    function spawnRed() {
        const hp = game.wave >= 6 && Math.random() < 0.2 ? 2 : 1;
        const r = 8 + (hp - 1) * 4;
        game.reds.push({
            x: rand(60, W - 60),
            y: -24,
            r,
            hp,
            maxHp: hp,
            vy: 34 + game.wave * 3.2 + rand(-5, 5),
            phase: Math.random() * Math.PI * 2,
            wob: 0,
            drawX: 0
        });
    }

    function spawnGate() {
        game.gates.push({
            x: rand(70, W - 70),
            y: 138,
            mult: Math.random() < 0.3 ? 3 : 2,
            life: 8
        });
    }

    function burst(x, y, n, color) {
        for (let i = 0; i < n; i++) {
            const a = Math.random() * Math.PI * 2;
            const s = rand(50, 190);
            game.parts.push({
                x, y,
                vx: Math.cos(a) * s,
                vy: Math.sin(a) * s,
                life: rand(0.3, 0.55),
                max: 0.55,
                size: rand(2, 4),
                color
            });
        }
    }

    function floatText(x, y, text, color) {
        game.texts.push({ x, y, text, color, life: 0.9, max: 0.9 });
    }

    function updateHUD() {
        dom.score.textContent = game.score;
        dom.wave.textContent = game.wave;
        dom.left.textContent = game.toSpawn + game.reds.length;
        dom.hearts.textContent = '❤'.repeat(Math.max(0, game.hearts)) || '—';
    }

    /* ---------- 回合 ---------- */
    function startWave() {
        game.toSpawn = 8 + game.wave * 4;
        game.spawnCd = 0.5;
        game.waveDelay = 1.6;
        game.gateTimer = 2.0;
        game.gates.length = 0;
        game.banner = {
            text: '第 ' + game.wave + ' 波',
            sub: game.wave === 1 ? '守住防线！' : '红人来袭',
            t: 1.6
        };
        updateHUD();
    }

    function resetGame() {
        game.score = 0;
        game.wave = 1;
        game.hearts = 5;
        game.cannonX = W / 2;
        game.targetX = W / 2;
        game.fireCd = 0.4;
        game.blues.length = 0;
        game.reds.length = 0;
        game.gates.length = 0;
        game.drops.length = 0;
        game.parts.length = 0;
        game.texts.length = 0;
        game.shake = 0;
        game.banner = null;
        startWave();
    }

    function loseHeart() {
        game.hearts--;
        game.shake = 0.45;
        floatText(W / 2, GY - 34, '-1 ❤', '#ff3b5c');
        updateHUD();
        if (game.hearts <= 0) gameOver();
    }

    function gameOver() {
        game.running = false;
        dom.overStats.textContent = '得分 ' + game.score + ' · 第 ' + game.wave + ' 波';
        dom.modalOver.classList.remove('hidden');
    }

    /* ---------- 更新 ---------- */
    function update(dt) {
        clock += dt;

        // 炮塔移动
        if (game.keys['ArrowLeft'] || game.keys['a']) game.targetX -= 540 * dt;
        if (game.keys['ArrowRight'] || game.keys['d']) game.targetX += 540 * dt;
        game.targetX = clamp(game.targetX, 38, W - 38);
        game.cannonX += (game.targetX - game.cannonX) * Math.min(1, dt * 14);

        // 自动开火（三门炮管，扇形散布）
        game.fireCd -= dt;
        if (game.fireCd <= 0) {
            game.fireCd = 0.32;
            spawnBlue(game.cannonX - 14, GY - 54, -78);
            spawnBlue(game.cannonX, GY - 58, 0);
            spawnBlue(game.cannonX + 14, GY - 54, 78);
        }

        // 蓝人上移
        for (let i = game.blues.length - 1; i >= 0; i--) {
            const b = game.blues[i];
            b.y += b.vy * dt;
            b.x += b.vx * dt;
            if (b.x < 9) { b.x = 9; b.vx = Math.abs(b.vx); }
            if (b.x > W - 9) { b.x = W - 9; b.vx = -Math.abs(b.vx); }
            b.wob += dt * 5;
            b.drawX = clamp(b.x + Math.sin(b.wob + b.phase) * 6, 8, W - 8);
            if (b.y < -20) game.blues.splice(i, 1);
        }

        // 红人下移
        for (let i = game.reds.length - 1; i >= 0; i--) {
            const r = game.reds[i];
            r.y += r.vy * dt;
            r.wob += dt * 3;
            r.drawX = clamp(r.x + Math.sin(r.wob + r.phase) * 6, r.r, W - r.r);
            if (r.y + r.r >= GY + 8) {
                game.reds.splice(i, 1);
                loseHeart();
            }
        }

        // 蓝红相撞抵消
        for (let i = game.blues.length - 1; i >= 0; i--) {
            const b = game.blues[i];
            for (let j = game.reds.length - 1; j >= 0; j--) {
                const r = game.reds[j];
                const dx = b.drawX - r.drawX;
                const dy = b.y - r.y;
                const rr = r.r + 7;
                if (dx * dx + dy * dy < rr * rr) {
                    game.blues.splice(i, 1);
                    r.hp -= 1;
                    burst(b.drawX, b.y, 4, '#9adcff');
                    if (r.hp <= 0) {
                        game.reds.splice(j, 1);
                        game.score += 10;
                        burst(r.drawX, r.y, 9, '#ff7b7b');
                        floatText(r.drawX, r.y - 6, '+10', '#ff5757');
                        if (Math.random() < 0.08) {
                            game.drops.push({ x: r.drawX, y: r.y, vy: 95 });
                        }
                        updateHUD();
                    } else {
                        burst(r.drawX, r.y, 3, '#ffb3b3');
                    }
                    break;
                }
            }
        }

        // 加倍道具：持续数秒的复制区域，蓝人穿过即翻倍
        for (let i = game.gates.length - 1; i >= 0; i--) {
            const gt = game.gates[i];
            gt.y += 14 * dt;
            gt.life -= dt;
            if (gt.life <= 0 || gt.y > GY - 60) {
                game.gates.splice(i, 1);
                continue;
            }
            for (let k = game.blues.length - 1; k >= 0; k--) {
                const b = game.blues[k];
                if (b.gateDone) continue;
                const dx = b.drawX - gt.x;
                const dy = b.y - gt.y;
                if (dx * dx + dy * dy < 34 * 34) {
                    b.gateDone = true;
                    for (let n = 1; n < gt.mult; n++) {
                        spawnBlue(gt.x + rand(-18, 18), gt.y + rand(-6, 6), rand(-70, 70));
                    }
                    burst(gt.x, gt.y, 8, '#ffd93d');
                    floatText(gt.x, gt.y - 14, '×' + gt.mult, '#e0a000');
                }
            }
        }

        // 回血爱心
        for (let i = game.drops.length - 1; i >= 0; i--) {
            const d = game.drops[i];
            d.y += d.vy * dt;
            if (d.y > GY - 6) {
                if (Math.abs(d.x - game.cannonX) < 52 && game.hearts < MAX_HEARTS) {
                    game.hearts++;
                    floatText(d.x, d.y - 12, '❤ +1', '#ff5c7a');
                    updateHUD();
                }
                game.drops.splice(i, 1);
            }
        }

        // 粒子
        for (let i = game.parts.length - 1; i >= 0; i--) {
            const p = game.parts[i];
            p.life -= dt;
            if (p.life <= 0) {
                game.parts.splice(i, 1);
                continue;
            }
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += 240 * dt;
        }

        // 飘字
        for (let i = game.texts.length - 1; i >= 0; i--) {
            const t = game.texts[i];
            t.life -= dt;
            t.y -= 34 * dt;
            if (t.life <= 0) game.texts.splice(i, 1);
        }

        // 屏幕震动
        if (game.shake > 0) game.shake = Math.max(0, game.shake - dt);

        // 波次标题
        if (game.banner) {
            game.banner.t -= dt;
            if (game.banner.t <= 0) game.banner = null;
        }

        // 出怪
        if (game.toSpawn > 0) {
            game.spawnCd -= dt;
            if (game.spawnCd <= 0) {
                spawnRed();
                game.toSpawn--;
                game.spawnCd = Math.max(0.26, 0.78 - game.wave * 0.045);
                updateHUD();
            }
        }

        // 加倍道具投放
        game.gateTimer -= dt;
        if (game.gateTimer <= 0 && game.gates.length < 2) {
            spawnGate();
            game.gateTimer = rand(2.8, 4.6);
        }

        // 波次推进
        if (game.toSpawn === 0 && game.reds.length === 0) {
            game.waveDelay -= dt;
            if (game.waveDelay <= 0) {
                game.wave++;
                startWave();
            }
        } else {
            game.waveDelay = 1.6;
        }
    }

    /* ---------- 绘制 ---------- */
    const clouds = [
        { x: 70, y: 92, s: 1.0 },
        { x: 300, y: 58, s: 0.75 },
        { x: 405, y: 150, s: 0.6 }
    ];

    function roundRect(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    function drawSky() {
        const sky = ctx.createLinearGradient(0, 0, 0, GY);
        sky.addColorStop(0, '#5fc4f2');
        sky.addColorStop(0.55, '#a8e2fb');
        sky.addColorStop(1, '#e6f7ff');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, GY);

        // 云
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        clouds.forEach(c => {
            ctx.beginPath();
            ctx.arc(c.x, c.y, 20 * c.s, 0, Math.PI * 2);
            ctx.arc(c.x + 22 * c.s, c.y - 8 * c.s, 16 * c.s, 0, Math.PI * 2);
            ctx.arc(c.x + 42 * c.s, c.y, 18 * c.s, 0, Math.PI * 2);
            ctx.fill();
        });

        // 远山
        ctx.fillStyle = '#bfe8c9';
        ctx.beginPath();
        ctx.moveTo(0, GY);
        ctx.lineTo(0, GY - 96);
        ctx.quadraticCurveTo(90, GY - 168, 180, GY - 92);
        ctx.quadraticCurveTo(250, GY - 40, 320, GY - 100);
        ctx.quadraticCurveTo(400, GY - 150, W, GY - 84);
        ctx.lineTo(W, GY);
        ctx.closePath();
        ctx.fill();
    }

    function drawGround() {
        // 草地
        const grass = ctx.createLinearGradient(0, GY - 12, 0, GY + 20);
        grass.addColorStop(0, '#8fe07a');
        grass.addColorStop(1, '#57b84a');
        ctx.fillStyle = grass;
        roundRect(0, GY - 12, W, 40, 10);
        ctx.fill();

        // 石墙
        const stone = ctx.createLinearGradient(0, GY + 20, 0, H);
        stone.addColorStop(0, '#b9c4d2');
        stone.addColorStop(1, '#7d8a99');
        ctx.fillStyle = stone;
        ctx.fillRect(0, GY + 20, W, H - GY - 20);

        // 砖缝
        ctx.strokeStyle = 'rgba(90,102,118,0.35)';
        ctx.lineWidth = 2;
        for (let y = GY + 44; y < H; y += 26) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(W, y);
            ctx.stroke();
        }
        for (let x = 20; x < W; x += 60) {
            ctx.beginPath();
            ctx.moveTo(x, GY + 20);
            ctx.lineTo(x, H);
            ctx.stroke();
        }
    }

    function drawGuy(x, y, r, kind) {
        const isBlue = kind === 'blue';

        // 腿
        ctx.strokeStyle = isBlue ? '#1b6fd0' : '#b32626';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x - r * 0.35, y + r * 0.7);
        ctx.lineTo(x - r * 0.45, y + r * 1.25);
        ctx.moveTo(x + r * 0.35, y + r * 0.7);
        ctx.lineTo(x + r * 0.45, y + r * 1.25);
        ctx.stroke();

        // 身体
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = isBlue ? '#3ea7ff' : '#ff5252';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = isBlue ? '#1b6fd0' : '#c22b2b';
        ctx.stroke();

        // 高光
        ctx.beginPath();
        ctx.arc(x - r * 0.32, y - r * 0.35, r * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.fill();

        // 眼睛
        const ex = r * 0.34;
        const ey = -r * 0.08;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x - ex, y + ey, r * 0.24, 0, Math.PI * 2);
        ctx.arc(x + ex, y + ey, r * 0.24, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#22313f';
        ctx.beginPath();
        ctx.arc(x - ex, y + ey + r * 0.03, r * 0.12, 0, Math.PI * 2);
        ctx.arc(x + ex, y + ey + r * 0.03, r * 0.12, 0, Math.PI * 2);
        ctx.fill();

        if (isBlue) {
            // 微笑
            ctx.strokeStyle = '#1b6fd0';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.arc(x, y + r * 0.18, r * 0.3, 0.25, Math.PI - 0.25);
            ctx.stroke();
        } else {
            // 怒眉
            ctx.strokeStyle = '#8d1616';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x - ex - r * 0.2, y - r * 0.45);
            ctx.lineTo(x - ex + r * 0.2, y - r * 0.28);
            ctx.moveTo(x + ex + r * 0.2, y - r * 0.45);
            ctx.lineTo(x + ex - r * 0.2, y - r * 0.28);
            ctx.stroke();
        }
    }

    function drawCannon() {
        const x = game.cannonX;
        const baseY = GY - 20;

        // 底座
        const gold = ctx.createLinearGradient(x - 36, baseY, x + 36, baseY + 26);
        gold.addColorStop(0, '#f7d572');
        gold.addColorStop(0.5, '#e6b136');
        gold.addColorStop(1, '#c38a1c');
        ctx.fillStyle = gold;
        roundRect(x - 36, baseY, 72, 28, 9);
        ctx.fill();
        ctx.strokeStyle = '#8a5c0d';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // 炮管 3×3
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const bx = x + (col - 1) * 17;
                const by = baseY - 20 + (row - 1) * 15;
                const grad = ctx.createRadialGradient(bx - 3, by - 3, 1, bx, by, 8.5);
                grad.addColorStop(0, '#8fdcff');
                grad.addColorStop(0.6, '#2f8fe0');
                grad.addColorStop(1, '#14568f');
                ctx.beginPath();
                ctx.arc(bx, by, 8, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
                ctx.strokeStyle = '#0d3f6b';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(bx, by, 3.4, 0, Math.PI * 2);
                ctx.fillStyle = '#0b2c4c';
                ctx.fill();
            }
        }
    }

    function drawGate(gt) {
        const w = 66;
        const h = 36;

        // 外发光
        ctx.save();
        ctx.shadowColor = 'rgba(255, 205, 40, 0.85)';
        ctx.shadowBlur = 14 + Math.sin(clock * 6) * 5;

        const grad = ctx.createLinearGradient(gt.x - w / 2, gt.y - h / 2, gt.x + w / 2, gt.y + h / 2);
        grad.addColorStop(0, '#fff27a');
        grad.addColorStop(0.5, '#ffd93d');
        grad.addColorStop(1, '#f0a500');
        ctx.fillStyle = grad;
        roundRect(gt.x - w / 2, gt.y - h / 2, w, h, 14);
        ctx.fill();
        ctx.restore();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        roundRect(gt.x - w / 2, gt.y - h / 2, w, h, 14);
        ctx.stroke();

        ctx.fillStyle = '#8a4b00';
        ctx.font = 'bold 20px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('×' + gt.mult, gt.x, gt.y + 1);

        // 剩余时间条
        const ratio = clamp(gt.life / 8, 0, 1);
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        roundRect(gt.x - 22, gt.y + h / 2 + 5, 44, 4, 2);
        ctx.fill();
        ctx.fillStyle = '#ffb300';
        roundRect(gt.x - 22, gt.y + h / 2 + 5, 44 * ratio, 4, 2);
        ctx.fill();
    }

    function drawHeart(x, y, s, color) {
        ctx.beginPath();
        ctx.moveTo(x, y + s * 0.5);
        ctx.bezierCurveTo(x - s, y - s * 0.4, x - s * 0.5, y - s * 1.1, x, y - s * 0.5);
        ctx.bezierCurveTo(x + s * 0.5, y - s * 1.1, x + s, y - s * 0.4, x, y + s * 0.5);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    function draw() {
        ctx.setTransform(viewScale, 0, 0, viewScale, 0, 0);
        ctx.clearRect(0, 0, W, H);

        ctx.save();
        if (game.shake > 0) {
            const s = game.shake * 14;
            ctx.translate(rand(-s, s), rand(-s, s));
        }

        drawSky();
        drawGround();

        // 加倍道具
        game.gates.forEach(drawGate);

        // 回血爱心
        game.drops.forEach(d => drawHeart(d.x, d.y, 10, '#ff5c7a'));

        // 红人
        game.reds.forEach(r => drawGuy(r.drawX, r.y, r.r, 'red'));

        // 蓝人
        game.blues.forEach(b => drawGuy(b.drawX, b.y, 7, 'blue'));

        drawCannon();

        // 粒子
        game.parts.forEach(p => {
            ctx.globalAlpha = Math.max(0, p.life / p.max);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;

        // 飘字
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        game.texts.forEach(t => {
            ctx.globalAlpha = Math.max(0, t.life / t.max);
            ctx.fillStyle = t.color;
            ctx.font = 'bold 20px "Segoe UI", sans-serif';
            ctx.fillText(t.text, t.x, t.y);
        });
        ctx.globalAlpha = 1;

        // 波次标题
        if (game.banner) {
            const a = Math.min(1, game.banner.t / 0.4);
            ctx.globalAlpha = a;
            ctx.fillStyle = 'rgba(24,54,90,0.85)';
            roundRect(W / 2 - 110, 210, 220, 92, 20);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 34px "Segoe UI", sans-serif';
            ctx.fillText(game.banner.text, W / 2, 246);
            ctx.font = 'bold 16px "Segoe UI", sans-serif';
            ctx.fillStyle = '#cfe6ff';
            ctx.fillText(game.banner.sub, W / 2, 278);
            ctx.globalAlpha = 1;
        }

        ctx.restore();
    }

    /* ---------- 主循环 ---------- */
    let last = performance.now();

    function loop(ts) {
        const dt = Math.min(0.05, (ts - last) / 1000);
        last = ts;
        if (game.running) update(dt);
        draw();
        requestAnimationFrame(loop);
    }

    /* ---------- 按钮 ---------- */
    dom.btnStart.addEventListener('click', () => {
        dom.modalStart.classList.add('hidden');
        resetGame();
        game.running = true;
        last = performance.now();
    });

    dom.btnPlayAgain.addEventListener('click', () => {
        dom.modalOver.classList.add('hidden');
        resetGame();
        game.running = true;
        last = performance.now();
    });

    dom.btnRestart.addEventListener('click', () => {
        dom.modalOver.classList.add('hidden');
        resetGame();
        game.running = true;
        last = performance.now();
    });

    /* ---------- 启动 ---------- */
    resizeCanvas();
    updateHUD();
    requestAnimationFrame(loop);

    // 尺寸变化后重绘
    window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 250));
})();
