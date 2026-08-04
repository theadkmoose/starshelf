// Remove these lines
  const body = document.body;
  if (this.checked) {
    body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
  }
};

// Initial theme check on page load
document.addEventListener('DOMContentLoaded', function() {
  const theme = localStorage.getItem('theme') || 'light';
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
    document.getElementById('darkModeToggle').checked = true;
  } else {
    document.body.classList.remove('dark_theme');
    document.getElementById('darkModeToggle').checked = false;
  }
});