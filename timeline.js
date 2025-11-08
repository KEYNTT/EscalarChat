document.addEventListener("DOMContentLoaded", () => {
  const timelineLine = document.querySelector(".timeline-line");
  const problemas = document.querySelectorAll(".problema");

  window.addEventListener("scroll", () => {
    const wrapper = document.querySelector(".problemas-wrapper");
    const rect = wrapper.getBoundingClientRect();
    const total = wrapper.offsetHeight;
    const visible = window.innerHeight;
    const scroll = Math.min(Math.max(-rect.top, 0), total - visible);
    const progress = (scroll / (total - visible)) * 100;

    timelineLine.style.background = `linear-gradient(180deg, #ff6600 ${progress}%, rgba(255,255,255,0.08) ${progress}%)`;

    problemas.forEach((p, i) => {
      const punto = p.querySelector(".problema-punto");
      const box = p.getBoundingClientRect();
      const middle = window.innerHeight / 2;
      if (box.top < middle && box.bottom > middle) {
        punto.style.boxShadow = "0 0 30px rgba(255,102,0,1)";
        punto.style.opacity = "1";
      } else {
        punto.style.boxShadow = "0 0 10px rgba(255,102,0,0.5)";
        punto.style.opacity = "0.6";
      }
    });
  });
});
