// 初始化地圖
function initMap() {
    window.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 24.8940207, lng: 121.2095940 },
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
    });
    loadCarLocations();
}
window.initMap = initMap;

// 提交車號與位置
function submitCarLocation() {
    const carNumber = document.getElementById('carNumbers').value;
    const location = document.getElementById('locations').value;
    const carRef = ref(database, 'carLocations/' + carNumber);

    set(carRef, {
        location,
        lat: 24.8940207,
        lng: 121.2095940,
    })
    .then(() => alert("車號已提交"))
    .catch(console.error);
}
window.submitCarLocation = submitCarLocation;

// 顯示車況
function showStatus() {
    const modal = document.getElementById("modal");
    modal.style.display = "block";

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
