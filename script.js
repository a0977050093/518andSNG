const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.tab-content');
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

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
    const isDarkMode = body.classList.contains('dark-mode');

    if (isDarkMode) {
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> 日間模式';
  } else {
     darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> 夜間模式';
  }
});
