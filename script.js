document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const modal = document.getElementById('modal');
    const modalIframe = document.getElementById('modal-iframe');
    const closeButton = document.querySelector('.close-button');
    const darkModeToggle = document.getElementById('darkModeToggle');
    let isDarkMode = localStorage.getItem('darkMode') === 'enabled';

    // 初始設定夜間模式
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }

    // 夜間模式切換
    darkModeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
    });

    // 標籤切換
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`tab-${tabId}`).classList.add('active');
        });
    });

    // 彈出視窗功能
    document.querySelectorAll('.expand-button').forEach(button => {
        button.addEventListener('click', () => {
            const iframe = button.parentElement.querySelector('iframe');
            modalIframe.src = iframe.getAttribute('src');
            modal.style.display = 'flex';
        });
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        modalIframe.src = ''; // 清空 iframe
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            modalIframe.src = ''; // 清空 iframe
        }
    });
});



// 側邊欄相關 DOM 元素
const sidebar = document.getElementById('sidebar');
const toggleButton = document.getElementById('toggleButton');

// 側邊欄切換邏輯
toggleButton.addEventListener('click', () => {
    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open'); // 隱藏側邊欄
    } else {
        sidebar.classList.add('open'); // 顯示側邊欄
    }
});

// 點擊側邊欄中的連結時，自動關閉側邊欄
const sidebarLinks = document.querySelectorAll('.sidebar-content a');
sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('open'); // 關閉側邊欄
    });
});
