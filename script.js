// 1. 切換選項卡功能
// 當用戶點擊某個 tab 時，顯示對應內容並隱藏其他內容
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', function() {
    const targetTab = this.dataset.tab; // 取得 tab 的 data-tab 屬性
    // 移除所有 tab 的 active 類別
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    this.classList.add('active'); // 為當前選中的 tab 添加 active 類別

    // 顯示對應的 tab 內容
    document.querySelectorAll('.tab-content').forEach(content => {
      if (content.id === 'tab-' + targetTab) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  });
});

// 2. 切換側邊欄顯示功能
// 當用戶點擊側邊欄圖標時，顯示/隱藏側邊欄
document.getElementById('sidebarToggle').addEventListener('click', function() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open'); // 切換側邊欄的 open 類別
});

// 3. 護瞳模式切換功能
// 當用戶點擊護瞳按鈕時，啟用/關閉暗黑模式
document.getElementById('darkModeToggle').addEventListener('click', function() {
  document.body.classList.toggle('dark-mode'); // 切換 body 上的 dark-mode 類別
  const isDarkMode = document.body.classList.contains('dark-mode'); // 檢查是否為暗黑模式

  // 根據模式變換按鈕文字
  this.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i> 亮光模式' : '<i class="fas fa-moon"></i> 護瞳';

  // 設置背景顏色和文字顏色
  document.body.style.backgroundColor = isDarkMode ? '#121212' : 'white';
  document.body.style.color = isDarkMode ? 'white' : 'black';
});

  function adjustLayout() {
  if (window.innerWidth > window.innerHeight) {
    // 橫屏
    document.body.classList.add("landscape");
    document.body.classList.remove("portrait");
  } else {
    // 直屏
    document.body.classList.add("portrait");
    document.body.classList.remove("landscape");
  }
}

// 初始化時調整
adjustLayout();

// 偵測螢幕方向變化
window.addEventListener("resize", adjustLayout);
