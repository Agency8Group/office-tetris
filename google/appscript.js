// 공통 CORS 헤더 - 보안 강화
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*', // 실제 배포 시에는 특정 도메인으로 제한하세요
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json'
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
  if (!Number.isInteger(data.totalScore) || data.totalScore < 0) {
    throw new Error('총점이 유효하지 않습니다.');
  }
}

// 스프레드시트 초기 설정
function setupSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 메인 데이터 시트
  let dataSheet = ss.getSheetByName('게임데이터');
  if (!dataSheet) {
    dataSheet = ss.insertSheet('게임데이터');
    dataSheet.getRange('A1:E1').setValues([['플레이어명', '점수', '레벨', '총점', '날짜']]);
    dataSheet.setFrozenRows(1);
  }
  
  // 순위표 시트
  let rankSheet = ss.getSheetByName('순위표');
  if (!rankSheet) {
    rankSheet = ss.insertSheet('순위표');
    rankSheet.getRange('A1:E1').setValues([['순위', '플레이어명', '최고점수', '총점', '달성일']]);
    rankSheet.setFrozenRows(1);
  }
  
  // 자동 정렬 트리거 설정
  ScriptApp.getProjectTriggers().forEach(trigger => ScriptApp.deleteTrigger(trigger));
  ScriptApp.newTrigger('sortRankings')
    .timeBased()
    .everyHours(1)
    .create();
}

// POST 요청 처리 - 게임 결과 저장
function doPost(e) {
  try {
    // 데이터 파싱 및 검증
    const data = JSON.parse(e.parameter.data);
    validateGameData(data);
    
    // 스프레드시트에 저장
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('게임데이터');
    if (!sheet) {
      ss.insertSheet('게임데이터').getRange('A1:E1').setValues([['플레이어명', '점수', '레벨', '총점', '날짜']]);
    }
    
    sheet.appendRow([
      data.playerName,
      data.score,
      data.level,
      data.totalScore,
      new Date(data.date)
    ]);
    
    return ContentService.createTextOutput('저장 완료')
      .setMimeType(ContentService.MimeType.TEXT);
      
  } catch (error) {
    return ContentService.createTextOutput('저장 실패: ' + error.message)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

// GET 요청 처리
function doGet(e) {
  return handleRequest(e, () => {
    const action = e.parameter.action;
    
    if (action === 'getRankings') {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const rankSheet = ss.getSheetByName('순위표');
      const rankings = rankSheet.getDataRange().getValues();
      
      return {
        status: 'success',
        data: rankings.slice(1, 11) // 상위 10개만 반환
      };
    }
    
    throw new Error('유효하지 않은 action 파라미터입니다.');
  });
}

// 요청 처리 래퍼 함수
function handleRequest(e, handler) {
  try {
    const result = handler();
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(CORS_HEADERS);
  } catch(error) {
    console.error('Error:', error);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.message || '알 수 없는 오류가 발생했습니다.'
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(CORS_HEADERS);
  }
}

// 순위표 업데이트
function updateRankings(ss, newData) {
  const rankSheet = ss.getSheetByName('순위표');
  let rankings = rankSheet.getDataRange().getValues();
  const header = rankings.shift(); // 헤더 제거
  
  // 플레이어의 기존 순위 찾기
  const playerIndex = rankings.findIndex(row => row[1] === newData.playerName);
  
  if (playerIndex === -1) {
    // 새로운 플레이어
    rankings.push([rankings.length + 1, newData.playerName, newData.score, newData.totalScore, new Date(newData.date)]);
  } else if (rankings[playerIndex][3] < newData.totalScore) {
    // 기존 기록 갱신 (총점 기준으로 변경)
    rankings[playerIndex] = [playerIndex + 1, newData.playerName, newData.score, newData.totalScore, new Date(newData.date)];
  }
  
  // 총점순으로 정렬 및 순위 재계산
  rankings.sort((a, b) => b[3] - a[3])
         .forEach((row, index) => row[0] = index + 1);
  
  // 순위표 업데이트
  rankSheet.getRange(2, 1, rankSheet.getLastRow()-1, 5).clearContent();
  if (rankings.length > 0) {
    rankSheet.getRange(2, 1, rankings.length, 5).setValues(rankings);
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
  
  // 총점순으로 정렬 및 순위 재계산
  rankings.sort((a, b) => b[3] - a[3])
         .forEach((row, index) => row[0] = index + 1);
  
  // 순위표 업데이트
  rankSheet.getRange(2, 1, rankings.length, 5).setValues(rankings);
}