   document.addEventListener('DOMContentLoaded', () => {
     const tabs = document.querySelectorAll('.tab');
     const tabContents = document.querySelectorAll('.tab-content');
     const expandButtons = document.querySelectorAll('.expand-button');
     const modal = document.getElementById('modal');
     const modalIframe = document.getElementById('modal-iframe');
     const closeButton = document.querySelector('.close-button');
     const darkModeToggle = document.getElementById('darkModeToggle');
     let isDarkMode = localStorage.getItem('darkMode') === 'enabled';

     // 選取按鈕和相關元素
const toggleButton = document.querySelector('.toggle-button');
const body = document.body;
const sidebar = document.querySelector('.sidebar');

// 點擊按鈕切換護眼模式和側邊欄
toggleButton.addEventListener('click', () => {
  // 切換護眼模式
  body.classList.toggle('dark-mode');
  // 切換側邊欄顯示狀態
  sidebar.classList.toggle('open');
});

      
     // 初始設定夜間模式狀態
      if (isDarkMode) {
         document.body.classList.add('dark-mode');
     }

    // 切換夜間模式
      darkModeToggle.addEventListener('click', () => {
         isDarkMode = !isDarkMode;
          document.body.classList.toggle('dark-mode');
         localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
    });

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
      expandButtons.forEach((button, index) => {
          button.addEventListener('click', () => {
             const iframe = button.parentElement.querySelector('iframe');
           const iframeSrc = iframe.getAttribute('src');
             modalIframe.src = iframeSrc;
             modal.style.display = 'block';
       });
     });


      closeButton.addEventListener('click', () => {
         modal.style.display = 'none';
      });

       window.addEventListener('click', (event) => {
        if (event.target === modal) {
           modal.style.display = 'none';
        }
    });
   });
document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');

  sidebarToggle.addEventListener('click', function() {
    sidebar.classList.toggle('open');
  });
});
