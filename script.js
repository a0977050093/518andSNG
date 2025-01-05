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
