// 1. Dark Mode 切換功能
document.getElementById('darkModeToggle').addEventListener('click', function () {
  document.body.classList.toggle('dark-mode');
});

// 2. Tab 頁籤導航功能
const tabs = document.querySelectorAll('.tab'); // 選取所有 tab 按鈕
const tabContents = document.querySelectorAll('.tab-content'); // 選取所有 tab 內容

// 遍歷每個 tab，為其添加點擊事件
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // 移除所有 tab 的 active 類別，並顯示對應的 tab
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active'); // 為當前選中的 tab 添加 active 類別

    const tabId = tab.getAttribute('data-tab'); // 獲取 tab 的 data-tab 屬性，對應內容的 id
    tabContents.forEach(content => {
      content.classList.remove('active'); // 隱藏所有內容
      if (content.id === `tab-${tabId}`) {
        content.classList.add('active'); // 顯示對應 tab 的內容
      }
    });
  });
});

// 3. 全螢幕按鈕功能
document.querySelectorAll('.expand-button').forEach(button => {
  button.addEventListener('click', (event) => {
    const iframe = button.closest('.content-wrapper').querySelector('iframe');
    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    } else if (iframe.mozRequestFullScreen) { // Firefox
      iframe.mozRequestFullScreen();
    } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari 和 Opera
      iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) { // Internet Explorer / Edge
      iframe.msRequestFullscreen();
    }
  });
});
