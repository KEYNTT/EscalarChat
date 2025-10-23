// ==== CONFIGURACIÓN DEL CANVAS ====
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";

// ==== CANAL DE COMUNICACIÓN SEGURO ====
let channel = null;
try {
  if ("BroadcastChannel" in window) {
    channel = new BroadcastChannel("alien-core");
  } else {
    console.warn("BroadcastChannel no está disponible en este navegador.");
  }
} catch (err) {
  console.error("Error inicializando BroadcastChannel:", err);
}

// ==== VARIABLES PRINCIPALES ====
let isMainWindow = document.hasFocus();
let windowId = Math.random().toString(36).substr(2, 9);

const localCore = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 40,
  vx: 0,
  vy: 0,
  energyBoost: 0
};

let targetX = localCore.x;
let targetY = localCore.y;
const remoteCores = new Map();
const detachedElements = [];

// ==== EFECTOS ====
let passEffect = { isActive: false, progress: 0, startTime: 0, duration: 2000 };
let energyBridge = { isActive: false, progress: 0, startTime: 0, duration: 3000 };

// ==== CLASES ====
class Tentacle {
  constructor(core, angle) {
    this.core = core;
    this.angle = angle;
    this.segments = Array.from({ length: 30 }, () => ({
      x: core.x,
      y: core.y,
      offset: Math.random() * 0.5
    }));
    this.animation = Math.random() * 100;
    this.gradient = null;
  }

  update() {
    this.animation += 0.06 + localCore.energyBoost * 0.06;
    let prevX = this.core.x;
    let prevY = this.core.y;

    for (const segment of this.segments) {
      const wave = Math.sin(this.animation + segment.offset) * (12 + localCore.energyBoost * 18);
      const targetX = prevX + Math.cos(this.angle) * 10 + wave * 0.25;
      const targetY = prevY + Math.sin(this.angle) * 10 + wave * 0.25;

      segment.x += (targetX - segment.x) * 0.45;
      segment.y += (targetY - segment.y) * 0.45;
      prevX = segment.x;
      prevY = segment.y;
    }
  }

  draw() {
    ctx.save();
    if (!this.gradient || this.animation % 15 < 1) {
      this.gradient = ctx.createLinearGradient(
        this.core.x,
        this.core.y,
        this.segments[this.segments.length - 1].x,
        this.segments[this.segments.length - 1].y
      );
      this.gradient.addColorStop(0, "#3498DB");
      this.gradient.addColorStop(0.5, "#5DADE2");
      this.gradient.addColorStop(1, "#85C1E9");
    }

    ctx.strokeStyle = this.gradient;
    ctx.lineWidth = 2 + localCore.energyBoost * 0.8;
    ctx.shadowBlur = 25 + localCore.energyBoost * 20;
    ctx.shadowColor = "#4A90E2";

    ctx.beginPath();
    ctx.moveTo(this.core.x, this.core.y);
    this.segments.forEach((s) => ctx.lineTo(s.x, s.y));
    ctx.stroke();
    ctx.restore();
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 4 + 2;
    this.speedX = (Math.random() - 0.5) * 3;
    this.speedY = (Math.random() - 0.5) * 3;
    this.alpha = 1;
    this.decay = 0.015 + Math.random() * 0.01;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= this.decay;
  }
  draw() {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = "#3498DB";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#5DADE2";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class DetachedElement {
  constructor(targetX, targetY, color, id) {
    this.id = id;
    this.startX = localCore.x;
    this.startY = localCore.y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.x = this.startX;
    this.y = this.startY;
    this.color = color;
    this.radius = 15;
    this.animation = 0;
    this.isReturning = false;
    this.returnProgress = 0;
    this.isActive = true;
  }

  update() {
    this.animation += 0.1;
    if (!this.isReturning) {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const distance = Math.hypot(dx, dy);
      if (distance > 5) {
        this.x += (dx / distance) * 3;
        this.y += (dy / distance) * 3;
      }
    } else {
      this.returnProgress += 0.02;
      const t = Math.min(this.returnProgress, 1);
      this.x = this.startX + (this.targetX - this.startX) * (1 - t);
      this.y = this.startY + (this.targetY - this.startY) * (1 - t);
      if (t >= 1) this.isActive = false;
    }
  }

  draw() {
    if (!this.isActive) return;
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 30;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.restore();
  }

  startReturn() {
    this.isReturning = true;
    this.returnProgress = 0;
  }
}

// ==== INICIALIZACIÓN ====
const tentacles = Array.from({ length: 24 }, (_, i) => new Tentacle(localCore, (i / 24) * Math.PI * 2));
const particles = [];

// ==== FUNCIONES ====
function spawnParticles(x, y, count = 10) {
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y));
  }
}

// ==== ANIMACIÓN PRINCIPAL ====
let lastTime = performance.now();
function animate(now) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const lerp = 0.1;
  localCore.vx += (targetX - localCore.x) * lerp;
  localCore.vy += (targetY - localCore.y) * lerp;
  localCore.vx *= 0.85;
  localCore.vy *= 0.85;
  localCore.x += localCore.vx;
  localCore.y += localCore.vy;
  localCore.energyBoost *= 0.94;

  tentacles.forEach((t) => {
    t.update();
    t.draw();
  });

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw();
    if (p.alpha <= 0) particles.splice(i, 1);
  }

  for (let i = detachedElements.length - 1; i >= 0; i--) {
    const e = detachedElements[i];
    e.update();
    e.draw();
    if (!e.isActive) detachedElements.splice(i, 1);
  }

  ctx.save();
  ctx.beginPath();
  ctx.arc(localCore.x, localCore.y, localCore.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#3498DB";
  ctx.shadowBlur = 60;
  ctx.shadowColor = "#3498DB";
  ctx.fill();
  ctx.restore();

  requestAnimationFrame(animate);
}

animate();

// ==== EVENTOS ====
canvas.addEventListener("mousemove", (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
});

canvas.addEventListener("click", (e) => {
  localCore.energyBoost = 2;
  spawnParticles(e.clientX, e.clientY, 25);
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
