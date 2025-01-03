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

function submitCarLocation() {
    const carNumber = document.getElementById('carNumbers').value;
    const location = document.getElementById('locations').value;

    // 檢查是否有輸入有效的車號和地點
    if (!carNumber || !location) {
        alert("車號或地點未輸入，請重新檢查！");
        return;
    }

    // 密碼檢查
    const password = prompt("請輸入密碼，系統測試中348362");
    const correctPassword = "348362";

    if (password !== correctPassword) {
        alert("密碼錯誤，無法提交車輛位置。");
        return;
    }

    // 預設位置資料
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

    console.log(`車號: ${carNumber}, 地點: ${location}, 緯度: ${carLocation.lat}, 經度: ${carLocation.lng}`);

    // 呼叫 Apps Script 儲存資料
    google.script.run.saveCarLocation(carNumber, location, carLocation.lat, carLocation.lng);
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
    // 呼叫 Google Apps Script 取得資料
    google.script.run.withSuccessHandler(function(carLocations){
      //處理從 Google Apps Script 返回的 carLocations 資料
      updateMapMarkers(carLocations);
      updateStatusTable(carLocations);
      // 
      console.log("從 Apps Script 返回的車輛資料:", carLocations);
    }).loadCarLocationsFromSheet();
  }

// 儲存車號位置到試算表的對應區域
function saveCarLocationToSheet(carNumber, location, lat, lng) {
    google.script.run.saveCarLocationToSheet(carNumber, location, lat, lng);
}

// 更新地圖標記
function updateMapMarkers(carLocations) {
    // 在這裡實作如何根據 carLocations 資料在地圖上新增或更新標記
    console.log("在地圖上更新標記:", carLocations);
}
