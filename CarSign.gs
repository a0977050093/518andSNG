let map;
let markers = {}; // 用來儲存標記
const carLocations = {}; // 用來儲存車號位置

// 初始化地圖
function initMap() {
    // 初始化地圖，設為衛星地圖
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 24.8940207, lng: 121.2095940 }, // 初始位置
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.SATELLITE // 設為衛星地圖
    });
}

// 提交車輛位置
function submitCarLocation() {
    const carNumber = document.getElementById('carNumbers').value;
    const location = document.getElementById('locations').value;

    // 提示用戶輸入密碼
    const password = prompt("請輸入密碼");

    // 預設密碼
    const correctPassword = "348362";

    // 驗證密碼是否正確
    if (password !== correctPassword) {
        alert("密碼錯誤，無法提交車輛位置。");
        return;
    }

    // 取得當前車號與位置
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

    // 獲得車號位置
    const carLocation = locations[location];

    // 檢查車號位置是否有效
    if (!carLocation) {
        alert("指定位置無效。");
        return;
    }

    // 在地圖上添加標記
    addMarker(carLocation.lat, carLocation.lng, carNumber);

    // 儲存車號及其位置
    carLocations[carNumber] = carLocation;

    // 更新顯示的車輛位置
    updateStatusTable();
}

// 添加標記
function addMarker(lat, lng, title) {
    if (markers[title]) {
        markers[title].setMap(null); // 如果標記已經存在，先移除
    }

    const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: title
    });

    // 儲存標記
    markers[title] = marker;
}

// 顯示所有車輛位置
function showStatus() {
    // 顯示車輛位置狀況視窗
    const modal = document.getElementById("modal");
    modal.style.display = "flex";

    // 更新狀況表
    updateStatusTable();
}

// 關閉視窗
function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

// 更新車輛狀況表
function updateStatusTable() {
    const tableBody = document.getElementById("statusTable");
    tableBody.innerHTML = ""; // 清空表格內容

    Object.keys(carLocations).forEach(carNumber => {
        const carLocation = carLocations[carNumber];

        const row = document.createElement("tr");

        const locationCell = document.createElement("td");
        locationCell.textContent = `${carLocation.lat}, ${carLocation.lng}`;
        row.appendChild(locationCell);

        const carNumberCell = document.createElement("td");
        carNumberCell.textContent = carNumber;
        row.appendChild(carNumberCell);

        const totalCell = document.createElement("td");
        totalCell.textContent = "1";
        row.appendChild(totalCell);

        tableBody.appendChild(row);
    });
}

// 清除車號
function clearCarNumbers() {
    // 確認是否清除
    const password = prompt("請輸入密碼以清除所有車號");
    const correctPassword = "348362";

    if (password !== correctPassword) {
        alert("密碼錯誤，無法清除車號。");
        return;
    }

    // 清空地圖上的標記
    Object.keys(markers).forEach(carNumber => {
        markers[carNumber].setMap(null);
    });

    // 清空車輛位置資料
    carLocations = {};

    // 更新顯示
    updateStatusTable();
}
