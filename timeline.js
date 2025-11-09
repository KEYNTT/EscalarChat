// === timeline.js ===

// Espera a que todo cargue
window.addEventListener("DOMContentLoaded", () => {
  const timeline = document.querySelector(".timeline");
  const progress = document.querySelector(".timeline-progress");
  const items = document.querySelectorAll(".timeline-item");

  // Actualizar el progreso según el scroll
  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const timelineTop = timeline.offsetTop;
    const timelineHeight = timeline.scrollHeight;
    const timelineBottom = timelineTop + timelineHeight;

    // Calcular cuánto ha avanzado el usuario dentro del timeline
    let progressPercent = ((scrollTop + windowHeight / 2 - timelineTop) / (timelineHeight)) * 100;

    // Limitar entre 0% y 100%
    progressPercent = Math.max(0, Math.min(progressPercent, 100));

    // Aplicar altura real
    progress.style.height = progressPercent + "%";

    // Mostrar los items visibles uno por uno
    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const triggerPoint = windowHeight * 0.8;

      if (rect.top < triggerPoint && rect.bottom > 0) {
        // Aparece con retraso progresivo
        setTimeout(() => item.classList.add("visible"), index * 100);
      } else {
        // Desaparece si subes
        item.classList.remove("visible");
      }
    });
  };

  // Escuchar el scroll
  window.addEventListener("scroll", updateProgress);
  updateProgress(); // inicial
});
