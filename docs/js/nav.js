document.addEventListener('DOMContentLoaded', () => {
  const themeStorageKey = 'starshelf-theme';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem(themeStorageKey);

  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      const isDark = theme === 'dark';
      toggle.setAttribute('aria-pressed', String(isDark));
      toggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
      toggle.innerHTML = `<span aria-hidden="true">${isDark ? '☀' : '☾'}</span><span>${isDark ? 'Light mode' : 'Dark mode'}</span>`;
    }
  };

  const initialTheme = savedTheme || (prefersDark.matches ? 'dark' : 'light');
  applyTheme(initialTheme);

  const navigation = document.querySelector('.site-nav');
  if (navigation) {
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'theme-toggle';
    toggle.addEventListener('click', () => {
      const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(themeStorageKey, nextTheme);
      applyTheme(nextTheme);
    });
    navigation.append(toggle);
    applyTheme(initialTheme);
  }

  const currentPage = document.body?.dataset.page || '';
  document.querySelectorAll('.nav-link').forEach((link) => {
    const page = link.dataset.page || '';
    if (page && currentPage === page) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});
