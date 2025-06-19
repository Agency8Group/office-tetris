// 게임 상수
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLORS = [
    '#00f5ff', '#0000ff', '#ff8c00', '#ffff00', '#00ff00', '#800080', '#ff0000'
];

// 테트리미노 모양
const SHAPES = [
    [[1, 1, 1, 1]],                    // I
    [[1, 1, 1], [0, 1, 0]],           // T
    [[1, 1, 1], [1, 0, 0]],           // L
    [[1, 1, 1], [0, 0, 1]],           // J
    [[1, 1], [1, 1]],                 // O
    [[1, 1, 0], [0, 1, 1]],           // Z
    [[0, 1, 1], [1, 1, 0]]            // S
];

// 팀장 이벤트 시스템
const TEAM_LEADERS = [
    {
        name: "김개발팀장",
        message: "개발팀장이 출현했다! 코드처럼 빠르게 움직여라! 💻",
        speedIncrease: 50
    },
    {
        name: "박디자인팀장", 
        message: "디자인팀장이 출현했다! 아름다운 조화를 만들어라! 🎨",
        speedIncrease: 60
    },
    {
        name: "이기획팀장",
        message: "기획팀장이 출현했다! 전략적으로 블록을 배치해라! 📋",
        speedIncrease: 70
    },
    {
        name: "최마케팅팀장",
        message: "마케팅팀장이 출현했다! 화려하게 점수를 올려라! 📢",
        speedIncrease: 80
    },
    {
        name: "정인사팀장",
        message: "인사팀장이 출현했다! 팀워크로 승부해라! 👥",
        speedIncrease: 90
    },
    {
        name: "한재무팀장",
        message: "재무팀장이 출현했다! 효율적으로 점수를 쌓아라! 💰",
        speedIncrease: 100
    },
    {
        name: "윤영업팀장",
        message: "영업팀장이 출현했다! 목표를 달성해라! 🎯",
        speedIncrease: 120
    },
    {
        name: "강품질팀장",
        message: "품질팀장이 출현했다! 완벽한 라인을 만들어라! ✅",
        speedIncrease: 140
    },
    {
        name: "조보안팀장",
        message: "보안팀장이 출현했다! 안전하게 게임을 진행해라! 🔒",
        speedIncrease: 160
    },
    {
        name: "CEO",
        message: "CEO가 직접 출현했다! 최고의 성과를 보여라! 👑",
        speedIncrease: 200
    }
];

// 게임 변수
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let nextCanvas = document.getElementById('nextBlock');
let nextCtx = nextCanvas.getContext('2d');
let scoreElement = document.getElementById('score');
let levelElement = document.getElementById('level');
let startBtn = document.getElementById('startBtn');
let pauseBtn = document.getElementById('pauseBtn');

let score = 0;
let level = 1;
let board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
let gameLoop;
let currentPiece;
let nextPiece;
let isPaused = false;
let gameOver = false;
let highScore = localStorage.getItem('tetrisHighScore') || 0;
let currentSpeed = 1000;
let lastEventScore = 0;

// 게임 속도 (ms)
let dropInterval = 1000;

// Google Apps Script 연동을 위한 설정
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzefroBERZela6Hvin6OHayzJO967eXuw1meciYBJ1CLBLsScEX2Ayllgs52peVKG4YPQ/exec';

// 이벤트 알림 시스템
function showEventNotification(leader) {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.event-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // 새 알림 생성
    const notification = document.createElement('div');
    notification.className = 'event-notification';
    notification.innerHTML = `
        <div class="event-content">
            <h3>${leader.name}</h3>
            <p>${leader.message}</p>
            <div class="event-progress">
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);

    // 3초 후 자동 제거
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// 팀장 이벤트 체크
function checkTeamLeaderEvent() {
    const eventThreshold = Math.floor(score / 100);
    const lastEventThreshold = Math.floor(lastEventScore / 100);
    
    if (eventThreshold > lastEventThreshold && eventThreshold <= TEAM_LEADERS.length) {
        const leader = TEAM_LEADERS[eventThreshold - 1];
        showEventNotification(leader);
        
        // 스피드 증가
        currentSpeed = Math.max(100, 1000 - leader.speedIncrease);
        if (gameLoop) {
            clearInterval(gameLoop);
            gameLoop = setInterval(drop, currentSpeed);
        }
        
        lastEventScore = score;
    }
}

// 테트리미노 클래스
class Tetromino {
    constructor(shape = null) {
        this.shape = shape || SHAPES[Math.floor(Math.random() * SHAPES.length)];
        this.color = COLORS[SHAPES.indexOf(this.shape)];
        this.x = Math.floor((COLS - this.shape[0].length) / 2);
        this.y = 0;
    }

    draw(ctx, offsetX = 0, offsetY = 0) {
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    // 그라데이션 효과
                    const gradient = ctx.createLinearGradient(
                        (this.x + x + offsetX) * BLOCK_SIZE,
                        (this.y + y + offsetY) * BLOCK_SIZE,
                        (this.x + x + offsetX + 1) * BLOCK_SIZE,
                        (this.y + y + offsetY + 1) * BLOCK_SIZE
                    );
                    gradient.addColorStop(0, this.color);
                    gradient.addColorStop(1, this.darkenColor(this.color, 0.3));
                    
                    ctx.fillStyle = gradient;
                    ctx.fillRect((this.x + x + offsetX) * BLOCK_SIZE, 
                                (this.y + y + offsetY) * BLOCK_SIZE, 
                                BLOCK_SIZE - 1, 
                                BLOCK_SIZE - 1);
                    
                    // 하이라이트 효과
                    ctx.fillStyle = this.lightenColor(this.color, 0.3);
                    ctx.fillRect((this.x + x + offsetX) * BLOCK_SIZE + 2, 
                                (this.y + y + offsetY) * BLOCK_SIZE + 2, 
                                3, 3);
                }
            });
        });
    }

    darkenColor(color, amount) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * amount * 100);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    lightenColor(color, amount) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * amount * 100);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R > 255 ? 255 : R) * 0x10000 +
            (G > 255 ? 255 : G) * 0x100 +
            (B > 255 ? 255 : B)).toString(16).slice(1);
    }
}

// 게임 초기화
function init() {
    board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    score = 0;
    level = 1;
    gameOver = false;
    currentSpeed = 1000;
    lastEventScore = 0;
    scoreElement.textContent = score;
    levelElement.textContent = level;
    createNewPiece();
    draw();
}

// 새로운 테트리미노 생성
function createNewPiece() {
    currentPiece = nextPiece || new Tetromino();
    nextPiece = new Tetromino();
    if (!isValidMove(0, 0)) {
        gameOver = true;
        clearInterval(gameLoop);
        gameLoop = null;
        saveScore();
        setTimeout(() => {
            alert(`게임 오버!\n점수: ${score}\n최고 점수: ${highScore}`);
        }, 100);
    }
}

// 충돌 검사
function isValidMove(moveX, moveY, newShape = null) {
    const shape = newShape || currentPiece.shape;
    return shape.every((row, dy) => {
        return row.every((value, dx) => {
            let newX = currentPiece.x + dx + moveX;
            let newY = currentPiece.y + dy + moveY;
            return (
                value === 0 ||
                (newX >= 0 && newX < COLS &&
                 newY < ROWS &&
                 (newY < 0 || board[newY][newX] === 0))
            );
        });
    });
}

// 테트리미노 회전
function rotate() {
    const newShape = currentPiece.shape[0].map((_, i) =>
        currentPiece.shape.map(row => row[i]).reverse()
    );
    if (isValidMove(0, 0, newShape)) {
        currentPiece.shape = newShape;
    }
}

// 라인 제거 및 점수 계산
function clearLines() {
    let linesCleared = 0;
    
    for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== 0)) {
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(0));
            linesCleared++;
            y++;
        }
    }

    if (linesCleared > 0) {
        const baseScore = linesCleared * 100;
        const levelBonus = level * 50;
        const comboBonus = linesCleared > 1 ? (linesCleared - 1) * 200 : 0;
        score += baseScore + levelBonus + comboBonus;
        scoreElement.textContent = score;
        
        // 팀장 이벤트 체크
        checkTeamLeaderEvent();
        
        if (score >= level * 1000) {
            level++;
            levelElement.textContent = level;
            dropInterval = Math.max(100, 1000 - (level - 1) * 100);
            if (gameLoop) {
                clearInterval(gameLoop);
                gameLoop = setInterval(drop, dropInterval);
            }
        }
    }
}

// 테트리미노 고정
function freeze() {
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                board[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
            }
        });
    });
    clearLines();
    createNewPiece();
}

// 테트리미노 드롭
function drop() {
    if (!isPaused && !gameOver) {
        if (isValidMove(0, 1)) {
            currentPiece.y++;
        } else {
            freeze();
        }
        draw();
    }
}

// 게임 보드 그리기
function draw() {
    // 메인 캔버스 클리어
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 그리드 그리기
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(x * BLOCK_SIZE, 0);
        ctx.lineTo(x * BLOCK_SIZE, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * BLOCK_SIZE);
        ctx.lineTo(canvas.width, y * BLOCK_SIZE);
        ctx.stroke();
    }
    
    // 보드에 있는 블록 그리기
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                const gradient = ctx.createLinearGradient(
                    x * BLOCK_SIZE, y * BLOCK_SIZE,
                    (x + 1) * BLOCK_SIZE, (y + 1) * BLOCK_SIZE
                );
                gradient.addColorStop(0, value);
                gradient.addColorStop(1, currentPiece.darkenColor(value, 0.3));
                
                ctx.fillStyle = gradient;
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, 
                            BLOCK_SIZE - 1, BLOCK_SIZE - 1);
                
                // 하이라이트
                ctx.fillStyle = currentPiece.lightenColor(value, 0.3);
                ctx.fillRect(x * BLOCK_SIZE + 2, y * BLOCK_SIZE + 2, 3, 3);
            }
        });
    });

    // 현재 테트리미노 그리기
    currentPiece.draw(ctx);

    // 다음 블록 캔버스 클리어
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    
    // 다음 테트리미노 그리기 (중앙에)
    const offsetX = Math.floor((3 - nextPiece.shape[0].length) / 2);
    const offsetY = Math.floor((3 - nextPiece.shape.length) / 2);
    nextPiece.draw(nextCtx, offsetX, offsetY);
}

// 점수 저장 (Google Apps Script 연동)
async function saveScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('tetrisHighScore', highScore);
    }

    // Google Apps Script로 점수 전송
    try {
        const playerName = prompt('이름을 입력하세요:') || '익명';
        console.log('Sending score to Google Sheets...', {
            playerName,
            score,
            level,
            date: new Date().toISOString()
        });

        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                playerName: playerName,
                score: score,
                level: level,
                date: new Date().toISOString()
            })
        });

        console.log('Response status:', response.status);
        const responseData = await response.text();
        console.log('Response data:', responseData);

        if (response.ok) {
            alert(`점수가 저장되었습니다!\n플레이어: ${playerName}\n점수: ${score}`);
        } else {
            throw new Error('점수 저장 실패');
        }
    } catch (error) {
        console.error('점수 저장 중 오류:', error);
        // 오류가 발생해도 게임은 계속할 수 있도록 함
        alert(`점수 저장에 실패했습니다.\n임시 저장된 최고점수: ${highScore}`);
    }
}

// 키보드 이벤트 처리
document.addEventListener('keydown', event => {
    if (!isPaused && !gameOver) {
        switch(event.key) {
            case 'ArrowLeft':
                if (isValidMove(-1, 0)) {
                    currentPiece.x--;
                    draw();
                }
                break;
            case 'ArrowRight':
                if (isValidMove(1, 0)) {
                    currentPiece.x++;
                    draw();
                }
                break;
            case 'ArrowDown':
                if (isValidMove(0, 1)) {
                    currentPiece.y++;
                    score += 2;
                    scoreElement.textContent = score;
                    checkTeamLeaderEvent();
                    draw();
                }
                break;
            case 'ArrowUp':
                rotate();
                draw();
                break;
            case ' ':
                while(isValidMove(0, 1)) {
                    currentPiece.y++;
                    score += 2;
                }
                scoreElement.textContent = score;
                checkTeamLeaderEvent();
                draw();
                break;
        }
    }
});

// 게임 시작
startBtn.addEventListener('click', () => {
    if (gameOver) {
        init();
    }
    if (!gameLoop) {
        gameLoop = setInterval(drop, currentSpeed);
        isPaused = false;
        startBtn.textContent = '재시작';
        pauseBtn.textContent = '일시정지';
    }
});

// 일시정지
pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? '계속하기' : '일시정지';
});

// 게임 초기화
init(); 