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
        modalIframe.src = iframe.src;
        modal.style.display = "block";
    });
});


closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
    modalIframe.src = '';
});

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
        modalIframe.src = '';
    }
});
