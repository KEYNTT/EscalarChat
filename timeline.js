window.addEventListener("scroll", () => {
  const timeline = document.querySelector(".timeline");
  const progress = document.querySelector(".timeline-progress");

  if (!timeline || !progress) return;

  const rect = timeline.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const totalHeight = rect.height;

  // Calcular cuánto del timeline está visible en el viewport
  let progressPercent;

  if (rect.top > windowHeight) {
    // Timeline aún no visible
    progressPercent = 0;
  } else if (rect.bottom < 0) {
    // Timeline ya pasó por completo
    progressPercent = 100;
  } else {
    // Calcular progreso proporcional dentro del timeline
    const visible = windowHeight - rect.top;
    progressPercent = (visible / (totalHeight + windowHeight)) * 100;
  }

  // Limitar entre 0 y 100
  progressPercent = Math.min(Math.max(progressPercent, 0), 100);
  progress.style.height = `${progressPercent}%`;
});

// === ANIMACIÓN DE APARICIÓN DE LOS APARTADOS ===
const items = document.querySelectorAll(".timeline-item");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible"); // <-- se ocultan al subir
      }
    });
  },
  { threshold: 0.3 }
);

items.forEach((item) => observer.observe(item));
