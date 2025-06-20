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
        name: "고양이",
        message: "고양이 등장! 알수없는..기운이 발생된다 🎇 ",
        scoreThreshold: 100,
        speedIncrease: 1.1,
        type: 'gif',
        image: 'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3NWwwOW82YTdrc3VqcGt0dHZkM3Z1MzI0a24ydXJ5MmdiaHl6bTYwaCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/BBNYBoYa5VwtO/giphy.gif'
    },
    {
        name: "김영훈 파트장",
        message: "압타밀 파트장 출현! 분유보다 순한 얼굴에 KPI는 독하게! 🍼😈",
        scoreThreshold: 500,
        speedIncrease: 1.2,
        type: 'gif',
        image: 'https://media.giphy.com/media/v1.Y2lkPTgyYTE0OTNiZjFib3kxenAzajZjN3RwNjB3bnVxdnRhcTNtaXlib3EyMHBrdTliNiZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/33zX3zllJBGY8/giphy.gif'
    },
    {
        name: "윤성규 파트장",
        message: "드리미 파트장 진입! 청소기보다 빠르게 너를 정리하러 왔다! 🤖🧹",
        scoreThreshold: 1000,
        speedIncrease: 1.3,
        type: 'gif',
        image: 'https://media.giphy.com/media/v1.Y2lkPTgyYTE0OTNiZjFib3kxenAzajZjN3RwNjB3bnVxdnRhcTNtaXlib3EyMHBrdTliNiZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/33zX3zllJBGY8/giphy.gif'
    },
    {
        name: "지연아 과장",
        message: "지과장 등장! 디자인 하나로 팀원 멘탈까지 리디자인 중! 🎨🧠",
        scoreThreshold: 1500,
        speedIncrease: 1.4,
        type: 'gif',
        image: 'https://media.giphy.com/media/v1.Y2lkPTgyYTE0OTNiejF3MHRndDJ6OW5vYTdocHJheXY3cnd5eTJ3YjBvemk2NGd5ZWdudyZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/103JnbaqvpBFGE/giphy.gif'
    },
    {
        name: "신선주 팀장",
        message: "CS 팀장 출격! 민원 만큼 빠르게 블록을 내려주마 ! ☎️🕯️",
        scoreThreshold: 2000,
        speedIncrease: 1.5,
        type: 'gif',
        image: 'https://media.giphy.com/media/v1.Y2lkPTgyYTE0OTNiNHV6N29pZG9scHRnc2ljajJ5czUzd2QwcnJrM2pnMnc4b3VpY3BhZCZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/3ohze3kG5qO9DcTUbe/giphy.gif'
    },
    {
        name: "강병훈 팀장",
        message: "드리미 총괄 병훈 팀장 출몰! 청소기도 숨죽이는 눈빛! 👀💢",
        scoreThreshold: 2500,
        speedIncrease: 1.6,
        type: 'gif',
        image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjVjNWt4cjhyZmNmcTFrNzh6dGU4bHc5MGd6d3NvbGd5cnZpa3AzbCZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/H5C8CevNMbpBqNqFjl/giphy.gif'
    },
    {
        name: "강병현 팀장",
        message: "전략기획 병현 팀장 강림! PPT는 이미 74장이다! 📊🔥",
        scoreThreshold: 3000,
        speedIncrease: 1.7,
        type: 'gif',
        image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjVjNWt4cjhyZmNmcTFrNzh6dGU4bHc5MGd6d3NvbGd5cnZpa3AzbCZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/1BXa2alBjrCXC/giphy.gif'
    },
    {
        name: "김정준 본부장",
        message: "정준 본부장 진입! 지금 흐름 이상하면 바로 호출당한다! 🧠📞",
        scoreThreshold: 3500,
        speedIncrease: 1.8,
        type: 'gif',
        image: 'https://media.giphy.com/media/v1.Y2lkPTgyYTE0OTNiNHV6N29pZG9scHRnc2ljajJ5czUzd2QwcnJrM2pnMnc4b3VpY3BhZCZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/gjgWQA5QBuBmUZahOP/giphy.gif'
    },
    {
        name: "신선일 이사",
        message: "경영관리 신 이사님 등장! 계산기 들었다… 다 던져! 🧾📟",
        scoreThreshold: 4000,
        speedIncrease: 1.9,
        type: 'gif',
        image: 'https://media.giphy.com/media/v1.Y2lkPTgyYTE0OTNib2Zyb3o5MzEzejkwb245amJmNGo3N2J2a3JnZ3I3YnU5dm1oN2VwZyZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/EgkNhBeY289z2/giphy.gif'
    },
    {
        name: "대표이사",
        message: "대표님 출격! 회의실 문 열리면 그냥 박수 치자! 👑👏",
        scoreThreshold: 5000,
        speedIncrease: 2.5,
        type: 'gif',
        image: 'https://media.giphy.com/media/v1.Y2lkPTgyYTE0OTNieHNoYjdnZW80OXh1Y203MWlnbWZjbTI5ajZxYzh0bTNrc210c3RtYSZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/VF65SrQlmClUc/giphy.gif'
    }
];

// 게임 변수
let canvas, ctx, nextCanvas, nextCtx, scoreElement, levelElement, startModal;
let score = 0;
let level = 1;
let board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
let gameLoop;
let currentPiece;
let nextPiece;
let gameOver = false;
let isPaused = false;
let highScore = localStorage.getItem('tetrisHighScore') || 0;
let currentSpeed = 800;
let lastEventScore = 0;

let lastTime = 0;
let dropCounter = 0;

// 게임 속도 (ms)
let dropInterval = 1000;

// Google Apps Script 웹앱 URL
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby5tTI1E3uydS0bbc6yWlV9ujkGw2MATvI5dEHK79Presoi58ehsU6wwxaOkJxpg9AViQ/exec';

// DOM 요소 초기화
document.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    nextCanvas = document.getElementById('nextBlock');
    nextCtx = nextCanvas.getContext('2d');
    scoreElement = document.getElementById('score');
    levelElement = document.getElementById('level');
    startModal = document.getElementById('startModal');

    // 임시 저장된 점수 재시도
    retryTempScores();

    // 초기 게임 보드 그리기
    draw();
});

// 순위표 관리
async function getLeaderboard() {
    try {
        // Google Apps Script에서 순위표 데이터 가져오기
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL);
        const result = await response.json();
        
        if (result.status === 'success') {
            return result.data; // Google Sheets의 데이터 반환
        } else {
            console.warn('순위표 데이터를 가져오는데 실패했습니다:', result.message);
            // 실패 시 로컬 데이터로 폴백
            return JSON.parse(localStorage.getItem('tetrisLeaderboard') || '[]')
                .sort((a, b) => b.totalScore - a.totalScore)
                .slice(0, 10);
        }
    } catch (error) {
        console.error('순위표 데이터를 가져오는 중 오류 발생:', error);
        // 에러 시 로컬 데이터로 폴백
        return JSON.parse(localStorage.getItem('tetrisLeaderboard') || '[]')
            .sort((a, b) => b.totalScore - a.totalScore)
            .slice(0, 10);
    }
}

function updateLeaderboard(playerName, score, level) {
    // 로컬 순위표 업데이트 (API 실패 시를 대비한 백업)
    const leaderboard = JSON.parse(localStorage.getItem('tetrisLeaderboard') || '[]');
    const totalScore = Math.round(score * (1 + (level - 1) * 0.1));
    
    leaderboard.push({
        name: playerName,
        score,
        level,
        totalScore,
        date: new Date().toLocaleDateString()
    });
    
    // 총점 기준으로 정렬
    leaderboard.sort((a, b) => b.totalScore - a.totalScore);
    
    // 상위 10개만 저장
    localStorage.setItem('tetrisLeaderboard', JSON.stringify(leaderboard.slice(0, 10)));
}

async function displayLeaderboard() {
    const rankings = await getLeaderboard();
    let message = '🏆 순위표 TOP 10 🏆\n\n';
    message += '[ 총점 계산방식 ]\n';
    message += '기본점수 × (1 + (레벨-1) × 0.1)\n';
    message += '예) 1000점, 레벨3 = 1000 × (1 + 0.2) = 1200점\n\n';
    
    if (rankings.length === 0) {
        message += '아직 기록이 없습니다!';
    } else {
        rankings.forEach((entry, index) => {
            message += `${index + 1}. ${entry.name || entry.playerName}\n`;  // name 또는 playerName 사용
            message += `   기본점수: ${entry.score}점\n`;
            message += `   레벨: ${entry.level} (보너스: +${((entry.level-1)*10)}%)\n`;
            message += `   총점: ${entry.totalScore}점\n`;
            message += `   달성일: ${new Date(entry.date).toLocaleDateString()}\n\n`;
        });
    }
    
    alert(message);
}

// 이벤트 알림 시스템
function showEventNotification(leader) {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.event-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const imageElement = `<img src="${leader.image}" alt="${leader.name}" style="width: 250px; height: 250px; object-fit: cover; border-radius: 15px; margin: 0 auto; display: block;">`;

    // 새 알림 생성
    const notification = document.createElement('div');
    notification.className = 'event-notification';
    notification.innerHTML = `
        <div class="event-content">
            ${imageElement}
            <h3 style="margin-top: 20px;">${leader.name}</h3>
            <p>${leader.message}</p>
            <div class="event-progress">
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(notification);

    // 3초 후 알림 제거 및 게임 재개
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-in forwards';
        notification.addEventListener('animationend', () => {
            notification.remove();
        });

        // 레벨 및 속도 업데이트
        level++;
        levelElement.textContent = level;
        currentSpeed = Math.max(100, Math.floor(currentSpeed / leader.speedIncrease));

        // 게임 루프 재시작
        isPaused = false;
        lastTime = performance.now(); // 루프 재시작 시 시간 초기화
        gameLoop = requestAnimationFrame(gameEngine);

    }, 3000);
}

// 팀장 이벤트 체크
function checkTeamLeaderEvent() {
    const nextLeader = TEAM_LEADERS.find(leader => score >= leader.scoreThreshold && leader.scoreThreshold > lastEventScore);
    if (nextLeader) {
        lastEventScore = nextLeader.scoreThreshold;
        isPaused = true;
        
        // 게임 루프를 멈춥니다.
        if (gameLoop) {
            cancelAnimationFrame(gameLoop);
        }
        
        showEventNotification(nextLeader);
        
        // 속도 증가는 알림이 끝난 후에 적용됩니다.
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

// 게임 시작 함수
function startGame() {
    // 모달 숨기기
    startModal.style.display = 'none';
    
    // 게임 초기화
    init();
    
    // 이전 이벤트 리스너 제거
    document.removeEventListener('keydown', handleKeyPress);
    
    // 키보드 이벤트 리스너 추가
    document.addEventListener('keydown', handleKeyPress);
    
    // 게임 루프 시작
    if (gameLoop) {
        cancelAnimationFrame(gameLoop);
    }
    lastTime = 0;
    dropCounter = 0;
    gameEngine();
}

function gameEngine(time = 0) {
    if (gameOver) {
        return;
    }

    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;

    if (dropCounter > currentSpeed) {
        drop();
        dropCounter = 0;
    }

    draw();
    gameLoop = requestAnimationFrame(gameEngine);
}

// 키보드 입력 처리
function handleKeyPress(event) {
    if (gameOver || isPaused) return;
    switch(event.keyCode) {
        case 37: // 왼쪽
            if (isValidMove(-1, 0)) {
                currentPiece.x--;
            }
            break;
        case 39: // 오른쪽
            if (isValidMove(1, 0)) {
                currentPiece.x++;
            }
            break;
        case 40: // 아래 (소프트 드롭)
            if (isValidMove(0, 1)) {
                currentPiece.y++;
                score += 1; // 소프트 드롭 보너스
                scoreElement.textContent = score;
                checkTeamLeaderEvent();
            }
            break;
        case 38: // 위
            rotate();
            break;
        case 32: // 스페이스바 (하드 드롭)
            let dropDistance = 0;
            while(isValidMove(0, 1)) {
                currentPiece.y++;
                dropDistance++;
            }
            score += dropDistance * 2; // 하드 드롭 보너스
            scoreElement.textContent = score;
            checkTeamLeaderEvent();
            freeze();
            break;
    }
    draw();
}

// 게임 오버 처리
function gameOverHandler() {
    if (gameLoop) {
        cancelAnimationFrame(gameLoop);
    }
    gameOver = true;
    
    // 최고 점수 업데이트
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('tetrisHighScore', highScore);
    }
    
    // 점수 저장
    saveScore();
    
    // 모달 표시
    startModal.style.display = 'flex';
}

// 게임 초기화
function init() {
    board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    score = 0;
    level = 1;
    gameOver = false;
    currentSpeed = 800;
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
        gameOverHandler();
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
        // 점수 계산 개선
        const baseScore = linesCleared * 100;  // 기본 점수: 한 줄당 100점
        const levelBonus = level * 50;         // 레벨 보너스
        const comboBonus = linesCleared > 1 ? Math.pow(2, linesCleared - 1) * 100 : 0;  // 콤보 보너스
        
        const totalBonus = baseScore + levelBonus + comboBonus;
        score += totalBonus;
        scoreElement.textContent = score;
        
        // 최고 점수 업데이트
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('tetrisHighScore', highScore);
        }
        
        // 팀장 이벤트 체크
        checkTeamLeaderEvent();
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
    if (!isValidMove(0, 1)) {
        if (currentPiece.y === 0) {
            gameOverHandler();
            return;
        }
        freeze();
        clearLines();
        createNewPiece();
    } else {
        currentPiece.y++;
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
    
    // 다음 테트리미노 그리기 (왼쪽으로 3칸, 아래로 1칸 이동)
    const blockSize = 30; // 블록 크기 정의
    const offsetX = Math.floor((nextCanvas.width / blockSize - nextPiece.shape[0].length) / 2) - 3; // 왼쪽으로 3칸
    const offsetY = Math.floor((nextCanvas.height / blockSize - nextPiece.shape.length) / 2) + 1;  // 아래로 1칸

    // 격자 그리기
    nextCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    nextCtx.lineWidth = 1;
    for (let x = 0; x <= nextCanvas.width / blockSize; x++) {
        nextCtx.beginPath();
        nextCtx.moveTo(x * blockSize, 0);
        nextCtx.lineTo(x * blockSize, nextCanvas.height);
        nextCtx.stroke();
    }
    for (let y = 0; y <= nextCanvas.height / blockSize; y++) {
        nextCtx.beginPath();
        nextCtx.moveTo(0, y * blockSize);
        nextCtx.lineTo(nextCanvas.width, y * blockSize);
        nextCtx.stroke();
    }

    nextPiece.draw(nextCtx, offsetX, offsetY);
}

// 점수 저장 (Google Apps Script 연동)
async function saveScore() {
    try {
        let playerName;
        let isValidName = false;

        while (!isValidName) {
            playerName = prompt('🎮 게임 결과 🎮\n\n이름을 입력하세요 (2-10자):', '');
            
            // 취소 버튼을 눌렀을 때
            if (playerName === null) {
                const confirmQuit = confirm('게임 기록을 저장하지 않고 나가시겠습니까?');
                if (confirmQuit) {
                    return;
                }
                continue;
            }

            // 이름 유효성 검사
            if (playerName.length < 2 || playerName.length > 10) {
                alert('⚠️ 이름은 2-10자로 입력해주세요!');
                continue;
            }

            isValidName = true;
        }

        const totalScore = Math.round(score * (1 + (level - 1) * 0.1));
        const bonusPercent = ((level-1) * 10);
        
        const scoreMessage = 
            '🎮 테트리스 게임 결과 🎮\n' +
            '━━━━━━━━━━━━━━━━━━━━━\n\n' +
            `🏆 최종 점수: ${totalScore}점\n\n` +
            `📊 상세 정보\n` +
            `기본 점수: ${score}점\n` +
            `달성 레벨: ${level}\n` +
            `레벨 보너스: +${bonusPercent}%\n\n` +
            '━━━━━━━━━━━━━━━━━━━━━\n' +
            `🌟 수고하셨습니다! 🌟`;

        alert(scoreMessage);

        // API 호출
        const formData = new URLSearchParams();
        formData.append('data', JSON.stringify({
            playerName: playerName,
            score: score,
            level: level,
            date: new Date().toISOString()
        }));

        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // CORS 정책 우회
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });

        // 로컬 스토리지에도 백업 저장
        try {
            const localScores = JSON.parse(localStorage.getItem('tetrisScores') || '[]');
            localScores.push({
                playerName,
                score,
                level,
                totalScore,
                date: new Date().toISOString()
            });
            localStorage.setItem('tetrisScores', JSON.stringify(localScores));
        } catch (e) {
            console.warn('로컬 저장소 저장 실패:', e);
        }

        console.log('점수가 저장되었습니다.');
        alert('🎉 점수가 성공적으로 저장되었습니다!');
        
    } catch (error) {
        console.error('점수 저장 중 오류 발생:', error);
        
        // 오류 상세 정보 출력
        let errorMessage = '점수 저장에 실패했습니다.\n';
        if (error.message) {
            errorMessage += `\n오류 내용: ${error.message}`;
        }
        
        // 로컬 스토리지에 임시 저장 시도
        try {
            const tempScores = JSON.parse(localStorage.getItem('tetrisTempScores') || '[]');
            tempScores.push({
                playerName,
                score,
                level,
                totalScore,
                date: new Date().toISOString(),
                savedAt: new Date().toISOString()
            });
            localStorage.setItem('tetrisTempScores', JSON.stringify(tempScores));
            errorMessage += '\n\n✅ 점수가 임시로 저장되었습니다.\n다음 게임에서 자동으로 다시 저장을 시도합니다.';
        } catch (e) {
            console.warn('임시 저장소 저장 실패:', e);
        }
        
        alert(errorMessage);
    }
}

// 시작할 때 임시 저장된 점수가 있다면 다시 저장 시도
async function retryTempScores() {
    try {
        const tempScores = JSON.parse(localStorage.getItem('tetrisTempScores') || '[]');
        if (tempScores.length === 0) return;

        for (const scoreData of tempScores) {
            try {
                const formData = new URLSearchParams();
                formData.append('data', JSON.stringify({
                    playerName: scoreData.playerName,
                    score: scoreData.score,
                    level: scoreData.level,
                    date: scoreData.date
                }));

                await fetch(GOOGLE_APPS_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData.toString()
                });
            } catch (e) {
                console.warn('임시 점수 재저장 실패:', e);
                return; // 하나라도 실패하면 중단하고 나머지는 보관
            }
        }

        // 모든 임시 점수가 성공적으로 저장되면 임시 저장소 비우기
        localStorage.removeItem('tetrisTempScores');
    } catch (e) {
        console.error('임시 점수 처리 중 오류:', e);
    }
}

// 페이지 로드 시 자동으로 모달 표시
window.onload = function() {
    startModal.style.display = 'flex';
}; 