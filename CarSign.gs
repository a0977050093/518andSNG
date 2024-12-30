function doGet() {
  const template = HtmlService.createTemplateFromFile('CarsSign');

  // 從位置狀況取得車號清單
  const carList = loadCarNumbersToInitialArea();
  Logger.log('Car list passed to HTML:');
  Logger.log(carList); // 顯示傳遞給 HTML 的車號清單

  template.carList = carList;  // 確保這個資料傳遞給 HTML 頁面
  return template.evaluate();
}

// 步驟一：取得初始車號清單 (來自初始車號區域)
function getCarList() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('車號清單');
  const carNumbers = sheet.getRange('A2:A').getValues().flat().filter(Boolean); // 去除空值
  Logger.log('Car numbers from 車號清單:');
  Logger.log(carNumbers); // 顯示從車號清單取得的車號資料

  return carNumbers;
}

// 步驟二：把車號丟至初始放置區
function loadCarNumbersToInitialArea() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('位置狀況');
  const carRange = sheet.getRange('B54:D68'); // 目標範圍
  const carNumbers = carRange.getValues().flat().filter(car => car !== ''); // 取得並過濾掉空白車號

  Logger.log('從 carNumbers 取得的初始車號:');
  Logger.log(carNumbers); // 顯示從 carNumbers 取得的車號

  // 若沒有車號則記錄並結束函式
  if (carNumbers.length === 0) {
    Logger.log('範圍中沒有車號可處理');
    carRange.clearContent(); // 清空範圍
    return [];
  }

  const rows = Math.ceil(carNumbers.length / 3); // B、C、D欄分三列
  const data = [];

  // 將車號整理成符合範圍的陣列格式
  for (let i = 0; i < rows; i++) {
    const row = carNumbers.slice(i * 3, i * 3 + 3); // 每列最多 3 個車號
    data.push(row);
  }

  Logger.log('準備插入的資料:');
  Logger.log(data); // 顯示準備插入的資料

  // 清空 B54:D68 範圍的資料
  carRange.clearContent();

  // 插入資料到 B54:D68
  sheet.getRange(54, 2, data.length, 3).setValues(data);

  Logger.log('資料成功插入至初始放置區');
  return carNumbers; // 返回車號列表
}

// 定義範圍物件
const locationsRanges = {
  '二級廠': 'E6:G13',
  'OK鋼棚': 'B26:D33',
  '連側鋼棚': 'B37:D44',
  '無線電鋼棚': 'G50:I57',
  '陸區鋼棚': 'J50:L57',
  '風雨走廊': 'M28:O35',
  '玄捷鋼棚': 'M44:O51',
  '待安置車號': 'N5:P19',
  '初始車號區域': 'B54:D68'
};

// 步驟三：取得所有已分配車號
function getAssignedCarNumbers() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('位置狀況');
  let assignedCarNumbers = [];

  // 遍歷範圍物件，檢查每個區域
  for (const location in locationsRanges) {
    const range = sheet.getRange(locationsRanges[location]);
    const values = range.getValues();
    values.forEach(row => row.forEach(cell => {
      if (cell) assignedCarNumbers.push(cell);
    }));
  }

  return assignedCarNumbers;
}

// 步驟四：更新初始車號區域，將未分配的車號放回 B54:D68
function updateCarList() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('位置狀況');
  const allCars = getCarList(); // 獲取所有車號
  const assignedCars = getAssignedCarNumbers(); // 已分配的車號

  // 過濾未分配的車號
  const unassignedCars = allCars.filter(car => !assignedCars.includes(car));

  Logger.log(unassignedCars); // 顯示未分配車號

  Utilities.sleep(5000); // 模擬延遲，實際情況可以根據需要調整

  // 返回未分配車號清單
  return unassignedCars;
}

// 查找範圍中的空白列
function findEmptyRow() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('位置狀況');

  // 如果找不到工作表，記錄錯誤並返回
  if (!sheet) {
    Logger.log('無法找到名為 "位置狀況" 的工作表');
    return;
  }

  const range = sheet.getRange('B54:D68'); // 範圍
  const values = range.getValues();

  // 如果無法取得範圍的值，記錄錯誤並返回
  if (!values) {
    Logger.log('無法從範圍中取得值');
    return;
  }

  for (let i = 0; i < values.length; i++) {
    const row = values[i];
    if (row.every(cell => cell === '')) {
      Logger.log(`找到空白列：第 ${54 + i} 列`);
      return 54 + i; // 返回行號
    }
  }

  Logger.log('未找到空白列');
  return null; // 如果沒有空白列則返回 null
}

// 步驟六：取得所有區域的車號分佈狀況
function getStatus() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('位置狀況');
  let status = {};  // 用來儲存各區域的車號分佈狀況

  // 遍歷所有區域，讀取每個區域的車號分佈
  for (const location in locationsRanges) {
    const range = sheet.getRange(locationsRanges[location]);
    const values = range.getValues();
    let cars = [];  // 儲存該區域的車號

    // 收集該區域內的車號
    values.forEach(row => row.forEach(cell => {
      if (cell) cars.push(cell);
    }));

    // 將車號列表存入狀況物件中，對應到區域名稱
    status[location] = cars;
  }
  Logger.log(status);
  // 返回包含各區域車號的分佈狀況
  return status;
}
