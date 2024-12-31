let map;
let markers = {}; // 用來儲存標記
let carLocations = {}; // 用來儲存車號位置

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

    addMarker(carLocation.lat, carLocation.lng, carNumber);
    carLocations[carNumber] = carLocation;

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

// 顯示車輛位置
function showStatus() {
    document.getElementById("modal").style.display = "flex";
    updateStatusTable();
}

function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

// 避免點擊模態框外部時關閉
document.getElementById("modal").addEventListener("click", function (event) {
    if (event.target === this) {
        closeModal();
    }
});

// 更新狀況表
function updateStatusTable() {
    const tableBody = document.getElementById("statusTable");
    tableBody.innerHTML = "";

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
