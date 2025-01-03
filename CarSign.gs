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

    // 定義車輛位置
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

    // 檢查車號是否已存在
    if (carLocations[carNumber]) {
        alert("此車號已經存在於地圖上。");
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
        markers[title].setMap(null); // 移除已存在的標記
    }

    markers[title] = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: title
    });
}

// 顯示狀況
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

// 點擊模態框外部時不關閉
document.getElementById("modal").addEventListener("click", function (event) {
    if (event.target === document.getElementById("modal-content")) {
        return; // 避免誤觸背景時關閉模態框
    }
    closeModal(); // 點擊背景以外的地方才執行關閉
});

// 更新狀況表
function updateStatusTable() {
    const tableBody = document.getElementById("statusTable");
    tableBody.innerHTML = ""; // 清空表格內容

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

        // 顯示總數（固定為1，此處可以根據需求調整）
        const totalCell = document.createElement("td");
        totalCell.textContent = "1";
        row.appendChild(totalCell);

        tableBody.appendChild(row);
    });
}

// 清除車號
function clearCarNumbers() {
    const password = prompt("請輸入密碼以清除所有車號");
    const correctPassword = "348362";

    if (password !== correctPassword) {
        alert("密碼錯誤，無法清除車號。");
        return;
    }

    Object.keys(markers).forEach(carNumber => {
        markers[carNumber].setMap(null);
    });

    markers = {};
    for (let carNumber in carLocations) {
        delete carLocations[carNumber];
    }

    updateStatusTable();
}

// 清除指定車號
function clearSpecificCarNumber() {
    const carNumber = prompt("請輸入欲清除的車號");
    if (carNumber && markers[carNumber]) {
        markers[carNumber].setMap(null); // 移除標記
        delete markers[carNumber]; // 刪除標記資料
        delete carLocations[carNumber]; // 刪除車號資料
        updateStatusTable();
    } else {
        alert("無此車號或車號不存在。");
    }
}

// 儲存車號位置到 localStorage
function saveCarLocations() {
    localStorage.setItem('carLocations', JSON.stringify(carLocations));
}

// 從 localStorage 載入車號位置
function loadCarLocations() {
    const savedLocations = JSON.parse(localStorage.getItem('carLocations'));
    if (savedLocations) {
        for (const carNumber in savedLocations) {
            addMarker(savedLocations[carNumber].lat, savedLocations[carNumber].lng, carNumber);
            carLocations[carNumber] = savedLocations[carNumber]; // 載入車號位置資料
        }
    }
}

// 透過地圖刷新車號位置
function refreshCarLocationsOnMap() {
    Object.keys(carLocations).forEach(carNumber => {
        const carInfo = carLocations[carNumber];
        addMarker(carInfo.lat, carInfo.lng, carNumber); // 重置地圖標記
    });
}
