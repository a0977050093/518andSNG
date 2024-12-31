// 1. Dark Mode 切換功能
// 當用戶點擊 "護瞳" 按鈕時，會切換 dark-mode 類別，啟用或關閉暗黑模式
document.getElementById('darkModeToggle').addEventListener('click', function () {
  document.body.classList.toggle('dark-mode');
  // 儲存暗黑模式的設置到 localStorage
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// 2. Tab 頁籤導航功能
// 當用戶點擊某個 tab 時，顯示對應的內容並隱藏其他內容
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.ifrme-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const tabId = tab.getAttribute('data-tab');
    tabContents.forEach(content => {
      content.classList.remove('active');
      if (content.id === `tab-${tabId}`) {
        content.classList.add('active');
        window.scrollTo(0, 0); // 滾動至頁面頂部
      }
    });
  });
});

// 3. 全螢幕按鈕功能
// 當用戶點擊 "全螢幕觀看" 按鈕時，將對應的 iframe 進入全螢幕模式
document.querySelectorAll('.expand-button').forEach(button => {
  button.addEventListener('click', (event) => {
    const iframe = button.closest('.content-wrapper').querySelector('iframe');

    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    } else if (iframe.mozRequestFullScreen) { // Firefox
      iframe.mozRequestFullScreen();
    } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari, Opera
      iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) { // IE/Edge
      iframe.msRequestFullscreen();
    }
  });
});

// 4. 手機端退出全螢幕
// 在手機上，通常無法使用 ESC 鍵退出全螢幕，為了能讓手機用戶退出全螢幕，我們監聽瀏覽器的全螢幕變化事件。
document.addEventListener('fullscreenchange', function () {
  if (!document.fullscreenElement) {
    // 當退出全螢幕時，可以做一些清理或狀態更新
    console.log("退出全螢幕");
  }
});

// 5. ESC鍵退出全螢幕功能（桌面端）
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
      document.msExitFullscreen();
    }
  }
});

// 6. 儲存暗黑模式設置並加載
window.addEventListener('load', function () {
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }
});

// 7. 全螢幕模式的按鈕文字更新
document.querySelectorAll('.expand-button').forEach(button => {
  button.addEventListener('click', (event) => {
    const iframe = button.closest('.content-wrapper').querySelector('iframe');
    const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;

    // 更新按鈕文字
    if (isFullscreen) {
      button.innerHTML = '<i class="fas fa-compress"></i> 退出全螢幕';
    } else {
      button.innerHTML = '<i class="fas fa-expand"></i> 全螢幕觀看';
    }
  });
});
