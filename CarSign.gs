// 引入 Firebase 配置 (firebase-config.js)
import { firebaseConfig } from './firebase-config.js';

// 初始化 Firebase
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, remove } from "firebase/database";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let map;
let markers = {};
const carLocations = {};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 24.8940207, lng: 121.2095940 },
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
    });
    // 加載車輛位置
    loadCarLocations();
}

// 提交車輛位置
function submitCarLocation() {
    const carNumber = document.getElementById("carNumbers").value;
    const location = document.getElementById("locations").value;

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
        alert("指定位置無效");
        return;
    }

    const password = prompt("請輸入密碼");
    if (password !== "348362") {
        alert("密碼錯誤");
        return;
    }

    // 儲存到 Firebase
    set(ref(database, `carLocations/${carNumber}`), {
        carNumber,
        locationName: location,
        lat: carLocation.lat,
        lng: carLocation.lng,
    });

    alert("車輛位置已更新");
}

// 載入車輛位置並更新地圖
function loadCarLocations() {
    const ref = ref(database, "carLocations");

    onValue(ref, (snapshot) => {
        const data = snapshot.val() || {};

        // 清除舊標記
        Object.values(markers).forEach(marker => marker.setMap(null));
        markers = {};

        // 新增每個車輛標記
        Object.keys(data).forEach(carNumber => {
            const carInfo = data[carNumber];
            addMarker(carInfo.lat, carInfo.lng, carNumber);
            carLocations[carNumber] = carInfo;
        });

        // 更新車輛狀況表
        updateStatusTable();
    });
}

// 添加標記並顯示車號
function addMarker(lat, lng, title) {
    const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: title,
    });

    // 儲存標記
    markers[title] = marker;

    // 點擊標記顯示車輛資訊
    marker.addListener("click", function() {
        alert("車號: " + title);
    });
}

// 更新車輛狀況表
function updateStatusTable() {
    const tableBody = document.getElementById("statusTable");
    tableBody.innerHTML = "";

    Object.keys(carLocations).forEach(carNumber => {
        const carInfo = carLocations[carNumber];
        const row = `<tr>
            <td>${carInfo.locationName}</td>
            <td>${carNumber}</td>
            <td>1</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// 清除所有車號
function clearCarNumbers() {
    const password = prompt("請輸入密碼以清除所有車號");
    if (password !== "348362") {
        alert("密碼錯誤");
        return;
    }

    remove(ref(database, "carLocations"));
    alert("所有車號已清除");
}

// 顯示車輛狀況
function showStatus() {
    document.getElementById("modal").style.display = "block";
}

// 關閉模態框
function closeModal() {
    document.getElementById("modal").style.display = "none";
}
