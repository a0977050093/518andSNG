// 獲取元素
const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.tab-content');
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const expandButtons = document.querySelectorAll('.expand-button');
const modal = document.getElementById('modal');
const modalIframe = document.getElementById('modal-iframe');
const closeButton = document.querySelector('.close-button');

// 標籤切換
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
    });
});

// 夜間模式切換
darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const icon = darkModeToggle.querySelector('i');
    if (body.classList.contains('dark-mode')) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
});

// 全螢幕彈出視窗
expandButtons.forEach(button => {
    button.addEventListener('click', () => {
        const iframe = button.parentElement.querySelector('iframe');
        modalIframe.src = iframe.src; // 設定 iframe 的來源
        modal.style.display = "block"; // 顯示全螢幕視窗
    });
});

// 關閉全螢幕視窗
closeButton.addEventListener('click', () => {
    modal.style.display = 'none'; // 隱藏全螢幕視窗
    modalIframe.src = ''; // 清除 iframe 的來源
});

// 點擊彈出視窗外部區域關閉視窗
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = "none"; // 隱藏全螢幕視窗
        modalIframe.src = ''; // 清除 iframe 的來源
    }
});
