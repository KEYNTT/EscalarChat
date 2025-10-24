const data = [
  { title: "Red Neuronal", image: "neural-network.jpg", description: "IA avanzada para análisis predictivo." },
  { title: "Nube Cuántica", image: "quantum-cloud.jpg", description: "Computación cuántica en la nube." },
  { title: "Blockchain Vault", image: "blockchain-vault.jpg", description: "Almacenamiento seguro descentralizado." },
  { title: "Defensa Cibernética", image: "cyber-defense.jpg", description: "Protección automatizada en tiempo real." },
  { title: "Data Nexus", image: "data-nexus.jpg", description: "Procesamiento masivo de datos en tiempo real." },
  { title: "Interfaz AR", image: "ar-interface.jpg", description: "Visualización inmersiva con realidad aumentada." },
  { title: "Matriz IoT", image: "iot-matrix.jpg", description: "Ecosistema IoT inteligente y conectado." }
];

let current = 0;
const carousel = document.getElementById("carousel");
const indicators = document.getElementById("indicators");

function createItem(item, index) {
  const div = document.createElement("div");
  div.className = "carousel-item";
  div.innerHTML = `
    <div class="card">
      <div class="card-image"><img src="${item.image}" alt="${item.title}"></div>
      <h3 class="card-title">${item.title}</h3>
      <p class="card-description">${item.description}</p>
      <button class="card-cta">Ver más</button>
    </div>
  `;
  return div;
}

function renderCarousel() {
  data.forEach((item, i) => {
    carousel.appendChild(createItem(item, i));
    const dot = document.createElement("div");
    dot.className = "indicator" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => goTo(i));
    indicators.appendChild(dot);
  });
  update();
}

function update() {
  const items = document.querySelectorAll(".carousel-item");
  const dots = document.querySelectorAll(".indicator");
  const total = items.length;

  items.forEach((el, i) => {
    let offset = i - current;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    el.style.transform = `translate(-50%, -50%) translateX(${offset * 400}px) translateZ(${Math.abs(offset) * -200}px) scale(${1 - Math.abs(offset) * 0.15}) rotateY(${offset * -25}deg)`;
    el.style.opacity = 1 - Math.abs(offset) * 0.3;
    el.style.zIndex = 10 - Math.abs(offset);
  });

  dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
}

function next() {
  current = (current + 1) % data.length;
  update();
}

function prev() {
  current = (current - 1 + data.length) % data.length;
  update();
}

function goTo(i) {
  current = i;
  update();
}

document.getElementById("nextBtn").addEventListener("click", next);
document.getElementById("prevBtn").addEventListener("click", prev);
setInterval(next, 5000);

renderCarousel();
