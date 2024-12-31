// Example JS for dark mode toggle functionality
document.getElementById('darkModeToggle').addEventListener('click', function () {
  document.body.classList.toggle('dark-mode');
});

// Tab navigation functionality
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const tabId = tab.getAttribute('data-tab');
    tabContents.forEach(content => {
      content.classList.remove('active');
      if (content.id === `tab-${tabId}`) {
        content.classList.add('active');
      }
    });
  });
});

// Expand button functionality (if needed)
document.querySelectorAll('.expand-button').forEach(button => {
  button.addEventListener('click', () => {
    const iframe = button.nextElementSibling;
    iframe.requestFullscreen();
  });
});
