// 공통 CORS 헤더 - 보안 강화
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',  // 모든 도메인 허용
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

// 데이터 유효성 검사
function validateGameData(data) {
  if (!data) throw new Error('데이터가 없습니다.');
  if (!data.playerName || typeof data.playerName !== 'string' || data.playerName.length < 2 || data.playerName.length > 10) {
    throw new Error('플레이어 이름이 유효하지 않습니다.');
  }
  if (!Number.isInteger(data.score) || data.score < 0) {
    throw new Error('점수가 유효하지 않습니다.');
  }
  if (!Number.isInteger(data.level) || data.level < 1) {
    throw new Error('레벨이 유효하지 않습니다.');
  }
  if (!Date.parse(data.date)) {
    throw new Error('날짜가 유효하지 않습니다.');
  }
}

// 스프레드시트 초기 설정
function setupSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 스프레드시트 권한 설정 - 누구나 편집 가능하도록
  ss.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.EDIT);
  
  // 메인 데이터 시트
  let dataSheet = ss.getSheetByName('게임데이터');
  if (!dataSheet) {
    dataSheet = ss.insertSheet('게임데이터');
    dataSheet.getRange('A1:D1').setValues([['플레이어명', '점수', '레벨', '날짜']]);
    dataSheet.setFrozenRows(1);
  }
  
  // 순위표 시트
  let rankSheet = ss.getSheetByName('순위표');
  if (!rankSheet) {
    rankSheet = ss.insertSheet('순위표');
    rankSheet.getRange('A1:F1').setValues([['순위', '플레이어명', '점수', '레벨', '총점', '달성일']]);
    rankSheet.setFrozenRows(1);
  }
  
  // 자동 정렬 트리거 설정
  ScriptApp.getProjectTriggers().forEach(trigger => ScriptApp.deleteTrigger(trigger));
  ScriptApp.newTrigger('sortRankings')
    .timeBased()
    .everyHours(1)
    .create();
}

// 총점 계산 함수
function calculateTotalScore(score, level) {
    return Math.round(score * (1 + (level - 1) * 0.1));
}

// POST 요청 처리
function doPost(e) {
  return handleRequest(e, () => {
    // 데이터 파싱 및 검증
    const data = JSON.parse(e.parameter.data);
    validateGameData(data);
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const 게임데이터시트 = ss.getSheetByName("게임데이터");
    
    // 게임데이터 시트에 데이터 추가
    게임데이터시트.appendRow([
      data.playerName,
      data.score,
      data.level,
      new Date(data.date)
    ]);
    
    // 순위표 업데이트
    updateRankings(ss, data);
    
    return {
      status: 'success',
      message: '점수가 성공적으로 저장되었습니다.',
      totalScore: calculateTotalScore(data.score, data.level)
    };
  });
}

// GET 요청 처리 - 순위표 조회
function doGet(e) {
  return handleRequest(e, () => {
    const action = e.parameter.action;
    
    if (action === 'getRankings') {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const rankSheet = ss.getSheetByName('순위표');
      const rankings = rankSheet.getDataRange().getValues();
      
      // 헤더를 제외한 상위 10개 기록만 반환
      const topRankings = rankings.slice(1, 11).map(row => ({
        rank: row[0],
        playerName: row[1],
        score: row[2],
        level: row[3],
        totalScore: row[4],
        date: row[5]
      }));
      
      return {
        status: 'success',
        data: topRankings
      };
    }
    
    throw new Error('유효하지 않은 action 파라미터입니다.');
  });
}

// 요청 처리 래퍼 함수
function handleRequest(e, handler) {
  try {
    const result = handler();
    const output = ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
    
    // CORS 헤더 직접 설정
    const response = output.getContent();
    return HtmlService.createHtmlOutput(response)
      .addHeader('Access-Control-Allow-Origin', '*')
      .addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .addHeader('Access-Control-Allow-Headers', 'Content-Type')
      .setContent(response);
      
  } catch(error) {
    console.error('Error:', error);
    const errorResponse = JSON.stringify({
      status: 'error',
      message: error.message || '알 수 없는 오류가 발생했습니다.'
    });
    return HtmlService.createHtmlOutput(errorResponse)
      .addHeader('Access-Control-Allow-Origin', '*')
      .addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .addHeader('Access-Control-Allow-Headers', 'Content-Type')
      .setContent(errorResponse);
  }
}

// 순위표 업데이트
function updateRankings(ss, newData) {
  const rankSheet = ss.getSheetByName('순위표');
  let rankings = rankSheet.getDataRange().getValues();
  const header = rankings.shift(); // 헤더 제거
  
  // 새로운 총점 계산
  const newTotalScore = calculateTotalScore(newData.score, newData.level);
  
  // 플레이어의 기존 순위 찾기
  const playerIndex = rankings.findIndex(row => row[1] === newData.playerName);
  
  if (playerIndex === -1) {
    // 새로운 플레이어
    rankings.push([
      rankings.length + 1,          // 순위
      newData.playerName,           // 플레이어명
      newData.score,                // 점수
      newData.level,                // 레벨
      newTotalScore,                // 총점
      new Date(newData.date)        // 달성일
    ]);
  } else if (rankings[playerIndex][4] < newTotalScore) {
    // 기존 기록 갱신 (총점이 더 높을 때만)
    rankings[playerIndex] = [
      playerIndex + 1,
      newData.playerName,
      newData.score,
      newData.level,
      newTotalScore,
      new Date(newData.date)
    ];
  }
  
  // 총점 기준으로 정렬
  rankings.sort((a, b) => b[4] - a[4])
         .forEach((row, index) => row[0] = index + 1);
  
  // 순위표 업데이트
  rankSheet.getRange(2, 1, rankSheet.getLastRow()-1, 6).clearContent();
  if (rankings.length > 0) {
    rankSheet.getRange(2, 1, rankings.length, 6).setValues(rankings);
  }
}

// 주기적 순위표 정렬 (트리거로 실행)
function sortRankings() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rankSheet = ss.getSheetByName('순위표');
  if (!rankSheet) return;
  
  let rankings = rankSheet.getDataRange().getValues();
  const header = rankings.shift();
  
  if (rankings.length === 0) return;
  
  // 총점 기준으로 정렬
  rankings.sort((a, b) => b[4] - a[4])
         .forEach((row, index) => row[0] = index + 1);
  
  // 순위표 업데이트
  rankSheet.getRange(2, 1, rankings.length, 6).setValues(rankings);
}