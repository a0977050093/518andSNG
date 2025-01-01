// Firebase 配置
const firebaseConfig = {
    apiKey: "vpwQNOHFQ4hKIybaE-MiMqpUZ7l4-_2vucbMiH7zxw0",
    authDomain: "carsign-423fc.firebaseapp.com",
    databaseURL: "https://carsign-423fc.firebaseio.com",
    projectId: "carsign-423fc",
    storageBucket: "carsign-423fc.appspot.com",
    messagingSenderId: "carsign-423fc",
    appId: "1:348362:web:xxxxxxxx"
};

// 初始化 Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 匿名登入
firebase.auth().signInAnonymously()
    .then(() => console.log("匿名登入成功"))
    .catch((error) => console.error("登入失敗", error.code, error.message));

let map;
let markers = {};
const carLocations = {};

// 初始化地圖
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 24.8940207, lng: 121.2095940 },
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
    });

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
    firebase.database().ref(`carLocations/${carNumber}`).set({
        carNumber,
        locationName: location,
        lat: carLocation.lat,
        lng: carLocation.lng,
    });

    alert("車輛位置已更新");
}

// 載入車輛位置
function loadCarLocations() {
    const ref = firebase.database().ref("carLocations");

    ref.on("value", (snapshot) => {
        const data = snapshot.val() || {};

        // 清除舊標記
        Object.values(markers).forEach(marker => marker.setMap(null));
        markers = {};

        Object.keys(data).forEach(carNumber => {
            const carInfo = data[carNumber];
            addMarker(carInfo.lat, carInfo.lng, carNumber);
            carLocations[carNumber] = carInfo;
        });

        updateStatusTable();
    });
}

// 添加標記
function addMarker(lat, lng, title) {
    markers[title] = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title,
    });
}

// 更新狀況表
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

// 清除車號
function clearCarNumbers() {
    const password = prompt("請輸入密碼以清除所有車號");
    if (password !== "348362") {
        alert("密碼錯誤");
        return;
    }

    firebase.database().ref("carLocations").remove();
    alert("所有車號已清除");
}

// 顯示車輛狀態
function showStatus() {
    document.getElementById("modal").style.display = "block";
}

// 關閉模態框
function closeModal() {
    document.getElementById("modal").style.display = "none";
}
