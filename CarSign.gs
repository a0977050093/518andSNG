// 引入 Firebase 配置 (firebase-config.js)
import { firebaseConfig } from './firebase-config.js';

// 初始化 Firebase
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, remove } from "firebase/database";

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

// 加載車輛位置
function loadCarLocations() {
    const carLocationsRef = firebase.database().ref('carLocations');

    carLocationsRef.on('value', (snapshot) => {
        const data = snapshot.val();
        Object.values(markers).forEach(marker => marker.setMap(null)); // 清除舊標記
        markers = {}; // 清空標記

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

    const carRef = firebase.database().ref('carLocations/' + carNumber);
    carRef.set({
        location: location,
        lat: 24.8940207, // 根據實際情況修改
        lng: 121.2095940 // 根據實際情況修改
    }).then(() => {
        alert("車號已提交");
    }).catch(error => {
        console.error("提交車號錯誤：", error);
    });
}

// 顯示車況
function showStatus() {
    document.getElementById("modal").style.display = "block";
    const statusTable = document.getElementById("statusTable");

    const carLocationsRef = firebase.database().ref('carLocations');
    carLocationsRef.once('value').then((snapshot) => {
        const data = snapshot.val();
        statusTable.innerHTML = ''; // 清空表格

        for (const carNumber in data) {
            const carInfo = data[carNumber];
            const row = statusTable.insertRow();
            row.insertCell(0).textContent = carInfo.location;
            row.insertCell(1).textContent = carNumber;
            row.insertCell(2).textContent = "1"; // 可以根據需求修改總數
        }
    });
}

// 關閉模態框
function closeModal() {
    document.getElementById("modal").style.display = "none";
}

// 清除所有車號
function clearCarNumbers() {
    firebase.database().ref('carLocations').remove()
        .then(() => {
            alert("所有車號已清除");
        })
        .catch(error => {
            console.error("清除車號錯誤：", error);
        });
}
