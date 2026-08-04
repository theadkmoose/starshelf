document.addEventListener('DOMContentLoaded', () => {
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
