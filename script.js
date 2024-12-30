document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  const expandButtons = document.querySelectorAll('.expand-button');
  const modal = document.getElementById('modal');
  const modalIframe = document.getElementById('modal-iframe');
  const closeButton = document.querySelector('.close-button');
  const darkModeToggle = document.getElementById('darkModeToggle');
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');

  



  
  // 夜間模式狀態
  let isDarkMode = localStorage.getItem('darkMode') === 'enabled';
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  }

  // 切換夜間模式
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      isDarkMode = !isDarkMode;
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
    });
  }

  // 標籤切換功能
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.getAttribute('data-tab');
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${tabId}`).classList.add('active');
    });
  });

  // 全螢幕彈出視窗
  expandButtons.forEach(button => {
    button.addEventListener('click', () => {
      const iframe = button.parentElement.querySelector('iframe');
      modalIframe.src = iframe.getAttribute('src');
      modal.style.display = 'block';
    });
  });

  // 關閉彈出視窗
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  // 點擊背景關閉彈出視窗
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // 側邊欄切換功能
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
});
