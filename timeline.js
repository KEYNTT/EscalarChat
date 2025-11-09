document.addEventListener('DOMContentLoaded', () => {
  const timeline = document.querySelector('.timeline');
  const progress = document.querySelector('.timeline-progress');
  const items = document.querySelectorAll('.timeline-item');

  if (!timeline || !progress) {
    // Si no existen, no hacemos nada (evita errores JS)
    console.warn('Timeline o progress no encontrados.');
    return;
  }

  // cálculo robusto del progreso: prog 0 cuando el top del timeline entra en viewport,
  // prog 1 cuando el bottom sale por encima del top de viewport.
  function updateProgress() {
    const timelineTop = timeline.offsetTop;
    const timelineHeight = timeline.offsetHeight;
    const scrollY = window.scrollY || window.pageYOffset;
    const windowH = window.innerHeight;

    // definimos inicio (cuando la parte superior del timeline aparece en pantalla)
    const start = timelineTop - windowH;
    // definimos final (cuando el timeline ya salió)
    const end = timelineTop + timelineHeight;

    // progreso normalizado (0..1)
    const raw = (scrollY - start) / (end - start);
    const clamped = Math.max(0, Math.min(1, raw));

    progress.style.height = `${clamped * 100}%`;
  }

  // Llamamos en scroll y resize (performance: throttle si fuera necesario)
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  // Llamada inicial
  updateProgress();

  // IntersectionObserver para reveal
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.18 });

  items.forEach(item => revealObserver.observe(item));
});
