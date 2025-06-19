// 공통 CORS 헤더 - 보안 강화
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',  // 모든 도메인 허용
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

// 데이터 유효성 검사
function validateGameData(data) {
  if (!data) throw new Error('데이터가 없습니다.');
  if (!data.name || typeof data.name !== 'string' || data.name.length < 2 || data.name.length > 10) {
    throw new Error('플레이어 이름이 유효하지 않습니다.');
  }
  if (!Number.isInteger(data.score) || data.score < 0) {
    throw new Error('점수가 유효하지 않습니다.');
  }
  if (!Number.isInteger(data.level) || data.level < 1) {
    throw new Error('레벨이 유효하지 않습니다.');
  }
  if (!data.date || !Date.parse(data.date)) {
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

// OPTIONS 요청 처리
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// POST 요청 처리 - 게임 결과 저장
function doPost(e) {
  try {
    // 데이터 파싱
    const data = JSON.parse(e.postData.contents);
    
    // 데이터 유효성 검사
    validateGameData(data);
    
    // 스프레드시트 가져오기
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const gameDataSheet = ss.getSheetByName('게임데이터');
    const rankingSheet = ss.getSheetByName('순위표');
    
    if (!gameDataSheet || !rankingSheet) {
      throw new Error('필요한 시트를 찾을 수 없습니다.');
    }
    
    // 게임 데이터 저장
    gameDataSheet.appendRow([
      data.name,
      data.score,
      data.level,
      new Date(data.date)
    ]);
    
    // 총점 계산
    const totalScore = calculateTotalScore(data.score, data.level);
    
    // 순위표 데이터 가져오기
    let rankings = rankingSheet.getDataRange().getValues();
    const headers = rankings.shift(); // 헤더 제거
    
    // 플레이어의 기존 순위 확인
    const playerIndex = rankings.findIndex(row => row[1] === data.name);
    
    if (playerIndex === -1) {
      // 새로운 플레이어
      rankings.push([
        rankings.length + 1, // 순위
        data.name,          // 플레이어명
        data.score,         // 점수
        data.level,         // 레벨
        totalScore,         // 총점
        new Date(data.date) // 달성일
      ]);
    } else if (rankings[playerIndex][4] < totalScore) {
      // 기존 기록 갱신 (총점이 더 높을 때만)
      rankings[playerIndex] = [
        playerIndex + 1,
        data.name,
        data.score,
        data.level,
        totalScore,
        new Date(data.date)
      ];
    }
    
    // 총점 기준으로 정렬
    rankings.sort((a, b) => b[4] - a[4])
            .forEach((row, index) => row[0] = index + 1);
    
    // 순위표 업데이트
    rankingSheet.getRange(2, 1, rankingSheet.getLastRow()-1, 6).clearContent();
    if (rankings.length > 0) {
      rankingSheet.getRange(2, 1, rankings.length, 6).setValues(rankings);
    }
    
    // 성공 응답
    const response = {
      status: 'success',
      message: '게임 결과가 저장되었습니다.',
      data: {
        totalScore: totalScore,
        rank: rankings.findIndex(row => row[1] === data.name) + 1
      }
    };
    
    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
      
  } catch (error) {
    // 에러 응답
    const response = {
      status: 'error',
      message: error.message || '알 수 없는 오류가 발생했습니다.',
      shouldUseFallback: true
    };
    
    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
  }
}

// GET 요청 처리 - 순위표 조회
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const rankingSheet = ss.getSheetByName('순위표');
    
    if (!rankingSheet) {
      throw new Error('순위표 시트를 찾을 수 없습니다.');
    }
    
    // 순위표 데이터 가져오기
    const rankings = rankingSheet.getDataRange().getValues();
    const headers = rankings.shift(); // 헤더 제거
    
    // 상위 10개 기록만 반환
    const topRankings = rankings.slice(0, 10).map(row => ({
      rank: row[0],
      name: row[1],
      score: row[2],
      level: row[3],
      totalScore: row[4],
      date: row[5]
    }));
    
    const response = {
      status: 'success',
      data: topRankings
    };
    
    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
      
  } catch (error) {
    const response = {
      status: 'error',
      message: error.message || '순위표를 불러올 수 없습니다.'
    };
    
    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
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