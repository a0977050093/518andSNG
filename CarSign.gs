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

    const password = prompt("請輸入密碼");
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

function showStatus() {
    const modal = document.getElementById("modal");
    modal.style.display = "flex"; // 顯示模態框
    updateStatusTable(); // 更新狀態表
}

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

    // 嘗試從 localStorage 讀取儲存的車輛位置資料
    const savedCarLocations = JSON.parse(localStorage.getItem("carLocations"));

    // 如果有保存的資料，就使用它，否則使用空物件
    const carLocations = savedCarLocations || {};

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

// 在某個事件或操作後保存資料到 localStorage
function saveCarLocations(carLocations) {
    localStorage.setItem("carLocations", JSON.stringify(carLocations));
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
    carLocations = {};

    updateStatusTable();
}









// Firebase 配置
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 初始化 Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);

// 儲存車輛資料
function saveCarLocations(carLocations) {
  const carLocationsRef = firebase.database().ref('carLocations');
  carLocationsRef.set(carLocations)
    .then(() => {
      console.log("Car locations saved successfully.");
    })
    .catch((error) => {
      console.error("Error saving car locations: ", error);
    });
}

// 讀取車輛資料並顯示
function loadCarLocations() {
  const carLocationsRef = firebase.database().ref('carLocations');
  carLocationsRef.get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        const carLocations = snapshot.val();
        updateStatusTable(carLocations); // 更新表格顯示
      } else {
        console.log("No car locations found.");
      }
    })
    .catch((error) => {
      console.error("Error loading car locations: ", error);
    });
}

// 更新表格顯示
function updateStatusTable(carLocations) {
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

// 假設 carLocations 是要儲存的資料
const carLocations = {
  "車號1": { locationName: "位置A" },
  "車號2": { locationName: "位置B" }
};

// 儲存資料
saveCarLocations(carLocations);

// 讀取資料並更新表格
loadCarLocations();
