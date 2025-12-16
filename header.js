window.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('mainNav');
  const backdrop = document.getElementById('menuBackdrop');

  const closeMenu = () => {
    navMenu.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    backdrop.classList.remove('visible');
    document.body.classList.remove('menu-open');
  };

  const toggleMenu = () => {
    const isOpen = navMenu.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    backdrop.classList.toggle('visible', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
  };

  const updateHeader = () => {
    const scrolled = window.scrollY > 10;
    header.classList.toggle('scrolled', scrolled);
  };

  menuToggle.addEventListener('click', toggleMenu);
  backdrop.addEventListener('click', closeMenu);

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
});
