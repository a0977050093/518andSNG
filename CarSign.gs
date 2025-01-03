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

// 地圖與標記相關
let map;
let markers = {}; // 用來儲存標記
const carLocations = {}; // 用來儲存車號位置

// 初始化地圖
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 24.8940207, lng: 121.2095940 },
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    });
}

// 步驟二：把車號丟至初始放置區
function loadCarNumbersToInitialArea() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('locastatus');
  const carRange = sheet.getRange('B54:D68'); // 目標範圍
  const carNumbers = getFixedCarList(); // 直接取得固定車號清單

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

// 步驟三：取得已分配車號
function getAssignedCarNumbers() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('locastatus');
  let assignedCarNumbers = [];

  // 遍歷範圍物件，檢查每個區域
  for (const location in locationsRanges) {
    const range = sheet.getRange(locationsRanges[location]);
    const values = range.getValues();
    values.forEach(row => row.forEach(cell => {
      if (cell) assignedCarNumbers.push(cell);
    }));
  }

  return assignedCarNumbers; // 返回已分配的車號
}

// 步驟四：更新初始車號區域，將未分配的車號放回 B54:D68
function updateCarList() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('locastatus');
  const allCars = getFixedCarList(); // 獲取固定的車號
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
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('locastatus');

  // 如果找不到工作表，記錄錯誤並返回
  if (!sheet) {
    Logger.log('無法找到名為 "locastatus" 的工作表');
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
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('locastatus');
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

// 提交車輛位置
function submitCarLocation() {
    const carNumber = document.getElementById('carNumbers').value;
    const location = document.getElementById('locations').value;

    const password = prompt("請輸入密碼，系統測試中348362");
    const correctPassword = "348362";

    if (password !== correctPassword) {
        alert("密碼錯誤，無法提交車輛位置。");
        return;
    }

    const locations = {
        "二級廠": { lat: 24.8953731, lng: 121.2110354 },
        "OK鋼棚": { lat: 24.8955410, lng: 121.2094455 },
        "連側鋼棚": { lat: 24.8955352, lng: 121.2088128 },
        "無線電鋼棚": { lat: 24.8942494, lng: 121.2084913 },
        "陸區鋼棚": { lat: 24.8936913, lng: 121.2085201 },
        "玄捷鋼棚": { lat: 24.8933285, lng: 121.2084722 },
        "風雨走廊": { lat: 24.8926953, lng: 121.2099437 },
        "待安置車號": { lat: 24.8950000, lng: 121.2090000 }
    };

    const carLocation = locations[location];
    if (!carLocation) {
        alert("指定位置無效。");
        return;
    }

    // 在地圖上添加標記
    addMarker(carLocation.lat, carLocation.lng, carNumber);

    // 儲存車號及其位置
    carLocations[carNumber] = {
        locationName: location, // 儲存名稱
        lat: carLocation.lat,
        lng: carLocation.lng
    };

    updateStatusTable();
}

// 添加標記
function addMarker(lat, lng, title) {
    if (markers[title]) {
        markers[title].setMap(null);
    }

    markers[title] = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: title
    });
}
