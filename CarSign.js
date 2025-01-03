// 初始化 Google Map
function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: 24.8940207, lng: 121.2095940 },
                zoom: 17,
                mapTypeId: google.maps.MapTypeId.SATELLITE
    });

    // 載入試算表車號資料
    loadCarLocationsFromSheet();
}

// 步驟二：把車號丟至初始放置區
function loadCarNumbersToInitialArea() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('locastatus');
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

    // 儲存車號與位置到試算表
    google.script.run.saveCarLocation(carNumber, location, carLocation.lat, carLocation.lng);
    getStatus();  // 更新車況顯示
}

// 顯示車況狀態
function showStatus() {
    const modal = document.getElementById("modal");
    modal.style.display = "flex"; // 顯示模態框
    updateStatusTable(); // 更新狀態表
}

// 關閉模態框
function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none"; // 隱藏模態框
}

// 更新車輛狀況表
function updateStatusTable() {
    const tableBody = document.getElementById("statusTable");
    tableBody.innerHTML = ""; // 清空表格內容

    // 從試算表載入資料並更新表格
    const carLocations = loadCarLocationsFromSheet();
    Object.keys(carLocations).forEach(carNumber => {
        const carInfo = carLocations[carNumber];

        const row = document.createElement("tr");

        // 顯示位置名稱
        const locationCell = document.createElement("td");
        locationCell.textContent = carInfo.locationName;
        row.appendChild(locationCell);

        // 顯示車號
        const carNumberCell = document.createElement("td");
        carNumberCell.textContent = carNumber;
        row.appendChild(carNumberCell);

        // 顯示總數（固定為1）
        const totalCell = document.createElement("td");
        totalCell.textContent = "1";
        row.appendChild(totalCell);

        tableBody.appendChild(row);
    });
}

// 清除所有車號
function clearCarNumbers() {
    const tableBody = document.getElementById("statusTable");
    tableBody.innerHTML = ""; // 清空所有表格資料
}

// 讀取試算表的車號資料範圍並返回位置資料
function loadCarLocationsFromSheet() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('locastatus');
    const areas = {
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

    const carLocations = {};  // 儲存車號位置的物件

    // 遍歷各個區域，讀取試算表資料
    for (const [locationName, range] of Object.entries(areas)) {
        const data = sheet.getRange(range).getValues();
        
        // 解析每個區域中的資料
        data.forEach(row => {
            const carNumber = row[0];  // 車號
            if (carNumber) {
                carLocations[carNumber] = {
                    locationName: locationName, // 儲存位置名稱
                    lat: row[1],  // 緯度
                    lng: row[2]   // 經度
                };
            }
        });
    }

    return carLocations;
}

// 儲存車號位置到試算表的對應區域
function saveCarLocationToSheet(carNumber, location, lat, lng) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('locastatus');
    const areas = {
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

    const range = sheet.getRange(areas[location]);
    let found = false;

    // 查找車號並更新
    const data = range.getValues();
    data.forEach((row, i) => {
        if (row[0] === carNumber) {
            sheet.getRange(range.getRow() + i, 2).setValue(lat);
            sheet.getRange(range.getRow() + i, 3).setValue(lng);
            found = true;
        }
    });

    // 若車號未找到，則插入新資料
    if (!found) {
        for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
            if (!data[rowIndex][0]) {
                sheet.getRange(range.getRow() + rowIndex, 1).setValue(carNumber);
                sheet.getRange(range.getRow() + rowIndex, 2).setValue(lat);
                sheet.getRange(range.getRow() + rowIndex, 3).setValue(lng);
                break;
            }
        }
    }
}

// 設定試算表ID與工作表名稱
const SPREADSHEET_ID = '102931833145714831502'; // 試算表 ID
const SHEET_NAME = 'locastatus'; // 試算表名稱

// 讀取車號位置
function getCarLocations() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  const locations = {};
  data.forEach(row => {
    const location = row[0]; // 假設位置在第一列
    const carNumber = row[1]; // 假設車號在第二列
    if (!locations[location]) {
      locations[location] = [];
    }
    locations[location].push(carNumber);
  });
  
  return locations;
}

// 儲存車號與位置
function saveCarLocation(carNumber, location, lat, lng) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  
  // 儲存車號資料到試算表
  sheet.appendRow([location, carNumber, lat, lng]);
}
