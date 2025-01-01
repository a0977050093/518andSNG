// CarSign.js

// 初始化 Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, set, onValue, remove } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBv-DYm4c4l9Dn-o7ME4TnI92YsCpss1nM",
  authDomain: "carsign-423fc.firebaseapp.com",
  databaseURL: "https://carsign-423fc-default-rtdb.firebaseio.com",
  projectId: "carsign-423fc",
  storageBucket: "carsign-423fc.firebasestorage.app",
  messagingSenderId: "219688439999",
  appId: "1:219688439999:web:2d4f8646c98bcb76e4360a",
  measurementId: "G-7FRW6JPXBJ"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// 地圖相關變數
let map;
let markers = {};

// 初始化地圖
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 24.8940207, lng: 121.2095940 }, // 預設位置
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
    });

    loadCarLocations(); // 加載車輛位置
}
window.initMap = initMap;

// 加載車輛位置
function loadCarLocations() {
    const carLocationsRef = ref(database, 'carLocations');

    onValue(carLocationsRef, (snapshot) => {
        const data = snapshot.val();
        // 清除舊標記
        Object.values(markers).forEach(marker => marker.setMap(null));
        markers = {};

        // 添加新標記
        for (const carNumber in data) {
            const carInfo = data[carNumber];
            addMarker(carInfo.lat, carInfo.lng, carNumber);
        }
    });
}

// 添加車輛標記
function addMarker(lat, lng, carNumber) {
    markers[carNumber] = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: carNumber,
    });
}

// 提交車號與位置
function submitCarLocation() {
    const carNumber = document.getElementById('carNumbers').value;
    const location = document.getElementById('locations').value;

    const carRef = ref(database, 'carLocations/' + carNumber);
    set(carRef, {
        location,
        lat: 24.8940207, // 示例座標
        lng: 121.2095940 // 示例座標
    }).then(() => {
        alert("車號已提交");
    }).catch(error => {
        console.error("提交車號錯誤：", error);
    });
}
window.submitCarLocation = submitCarLocation;

// 顯示車況
function showStatus() {
    document.getElementById("modal").style.display = "block";
    const statusTable = document.getElementById("statusTable");

    const carLocationsRef = ref(database, 'carLocations');
    statusTable.innerHTML = '';

    onValue(carLocationsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            for (const carNumber in data) {
                const row = statusTable.insertRow();
                row.insertCell(0).textContent = data[carNumber].location;
                row.insertCell(1).textContent = carNumber;
                row.insertCell(2).textContent = "1";
            }
        }
    });
}
window.showStatus = showStatus;

// 關閉模態框
function closeModal() {
    document.getElementById("modal").style.display = "none";
}
window.closeModal = closeModal;

// 清除所有車號
function clearCarNumbers() {
    remove(ref(database, 'carLocations'))
        .then(() => {
            alert("所有車號已清除");
        })
        .catch(error => {
            console.error("清除車號錯誤：", error);
        });
}
window.clearCarNumbers = clearCarNumbers;
