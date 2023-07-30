// キャラクターの設定
var character = document.getElementById('character');
var characterSize = 50; // 追加: キャラクターのサイズ


// スコア、スピード、レベルの設定
var score = 0;
var speed = 2;
var level = 1;

// 敵の配列
var enemies = [];

// ゲームエリアの範囲を取得
var game = document.getElementById('game');
var gameRect = game.getBoundingClientRect();

// キャラクターの設定
var character = document.getElementById('character');
var characterPos = {x: 0, y: 0};
var characterSize = 50; // キャラクターのサイズ

// 敵を一定間隔で作成
var enemyInterval = setInterval(createEnemy, 2000);

// 敵を一定間隔で更新
var updateInterval = setInterval(updateEnemies, 20);


// キャラクターの位置を更新
function updateCharacterPos(e) {
    characterPos.x = e.clientX - gameRect.left - characterSize / 2;
    characterPos.y = e.clientY - gameRect.top - characterSize / 2;
    character.style.left = characterPos.x + 'px';
    character.style.top = characterPos.y + 'px';
}
// マウスの移動に追随するキャラクター
game.addEventListener('mousemove', updateCharacterPos);

// 新しい敵を作成
function createEnemy() {
    var enemySize = 50;  // 敵のサイズ
    var enemyPos = { 
        left: Math.random() * (gameRect.width - enemySize),  // 更新: 敵のサイズを考慮
        top: Math.random() * (gameRect.height - enemySize)  // 更新: 敵のサイズを考慮
    };
    var warning = document.createElement('div');
    warning.style.position = 'absolute';
    warning.style.height = '50px';
    warning.style.width = '50px';
    warning.style.background = 'yellow'; // 更新: 警告色を黄色にする
    warning.style.left = enemyPos.left + 'px';
    warning.style.top = enemyPos.top + 'px';
    game.appendChild(warning);

    setTimeout(function() {
        game.removeChild(warning);
        var enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.style.left = enemyPos.left + 'px';
        enemy.style.top = enemyPos.top + 'px';
        game.appendChild(enemy);
        enemies.push(enemy);
    }, 1000);
}

// 敵を更新
function updateEnemies() {
    enemies.forEach(function(enemy) {
        var dx = characterPos.x - parseFloat(enemy.style.left);
        var dy = characterPos.y - parseFloat(enemy.style.top);

        var distance = Math.sqrt(dx*dx + dy*dy);

        if (distance < 50) {
            game.innerHTML = "Game Over";
            game.style.color = "yellow";
            game.style.fontSize = "50px";
            game.style.textAlign = "center";
            game.style.paddingTop = gameRect.height / 2 + "px";
            clearInterval(interval);
        } else {
            var angle = Math.atan2(dy, dx);
            enemy.style.left = parseFloat(enemy.style.left) + Math.cos(angle) * speed / 2 + 'px';
            enemy.style.top = parseFloat(enemy.style.top) + Math.sin(angle) * speed / 2 + 'px';
        }
    });
}

// スコアを更新
function updateScore() {
    document.getElementById('score').innerText = "スコア: " + score + ", レベル: " + level;
}

// 敵を攻撃
game.onclick = function(e) {
    if (e.target.classList.contains('enemy')) {
        game.removeChild(e.target);
        enemies = enemies.filter(enemy => enemy !== e.target);
        score++;
        if (score % 10 === 0) {
            level++;
            speed += level;
        }
        updateScore();
    }
}

// 初期化
updateCharacterPos();
updateScore();

// 敵を定期的に作成
var interval = setInterval(function() {
    createEnemy();
    updateEnemies();
}, 1000 / level);

// マウスの動きに応じてキャラクターを移動
document.onmousemove = function(e) {
    var targetPos = { x: e.clientX - gameRect.left, y: e.clientY - gameRect.top };

    var dx = targetPos.x - characterPos.x;
    var dy = targetPos.y - characterPos.y;

    var distance = Math.sqrt(dx*dx + dy*dy);

    if (distance > speed) {
        characterPos.x += (dx / distance) * speed;
        characterPos.y += (dy / distance) * speed;
    } else {
        characterPos.x = targetPos.x;
        characterPos.y = targetPos.y;
    }

    updateCharacterPos();
}
