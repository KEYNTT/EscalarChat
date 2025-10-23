const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

const channel = new BroadcastChannel("alien-core");

let isMainWindow = document.hasFocus();
let windowId = Math.random().toString(36).substr(2, 9);
let lastMoveTime = Date.now();

window.addEventListener("focus", () => {
	isMainWindow = true;
	channel.postMessage({
		type: "window-focus",
		id: windowId,
		timestamp: Date.now()
	});
});

window.addEventListener("blur", () => {
	isMainWindow = false;
});

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

let passEffect = {
	isActive: false,
	progress: 0,
	direction: 1,
	startTime: 0,
	duration: 2000
};

let energyBridge = {
	isActive: false,
	progress: 0,
	startTime: 0,
	duration: 3000,
	particles: []
};

class Tentacle {
	constructor(core, angle) {
		this.core = core;
		this.angle = angle;
		this.segments = [];
		this.length = 30; // más corto y más ágil
		this.segmentLength = 10; // más pequeño
		this.animation = Math.random() * 100;
		this.gradient = null;

		for (let i = 0; i < this.length; i++) {
			this.segments.push({
				x: core.x,
				y: core.y,
				offset: i * 0.3 + Math.random() * 0.5 // offsets únicos
			});
		}
	}

	update() {
		this.animation += 0.06 + localCore.energyBoost * 0.06;
		let prevX = this.core.x;
		let prevY = this.core.y;

		for (let i = 0; i < this.length; i++) {
			const segment = this.segments[i];
			const wave =
						Math.sin(this.animation + segment.offset) * (12 + localCore.energyBoost * 18) +
						Math.cos(this.animation * 0.5 + segment.offset) * 8;

			const targetX = prevX + Math.cos(this.angle) * this.segmentLength + wave * 0.25;
			const targetY = prevY + Math.sin(this.angle) * this.segmentLength + wave * 0.25;

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
				this.core.x, this.core.y,
				this.segments[this.segments.length - 1].x,
				this.segments[this.segments.length - 1].y
			);
			this.gradient.addColorStop(0, '#3498DB');
			this.gradient.addColorStop(0.5, '#5DADE2');
			this.gradient.addColorStop(1, '#85C1E9');
		}

		ctx.strokeStyle = this.gradient;
		ctx.lineWidth = 2 + localCore.energyBoost * 0.8;
		ctx.shadowBlur = 25 + localCore.energyBoost * 20;
		ctx.shadowColor = "#4A90E2";

		ctx.beginPath();
		ctx.moveTo(this.core.x, this.core.y);
		this.segments.forEach((segment) => {
			ctx.lineTo(segment.x, segment.y);
		});
		ctx.stroke();
		ctx.restore();
	}
}

const tentacles = [];
const tentacleCount = 24;
for (let i = 0; i < tentacleCount; i++) {
	tentacles.push(new Tentacle(localCore, (i / tentacleCount) * Math.PI * 2));
}

const particles = [];
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
		this.speedX *= 0.98;
		this.speedY *= 0.98;
	}
	draw() {
		if (this.alpha <= 0) return;
		ctx.save();
		ctx.globalAlpha = this.alpha;
		ctx.fillStyle = '#3498DB';
		ctx.shadowBlur = 20;
		ctx.shadowColor = '#5DADE2';
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}
}

function spawnParticles(x, y, count = 10) {
	for (let i = 0; i < count; i++) {
		particles.push(new Particle(x, y));
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
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance > 5) {
				this.x += (dx / distance) * 3;
				this.y += (dy / distance) * 3;
			}
		} else {
			this.returnProgress += 0.02;
			const t = Math.min(this.returnProgress, 1);
			this.x = this.startX + (this.targetX - this.startX) * (1 - t);
			this.y = this.startY + (this.targetY - this.startY) * (1 - t);

			if (t >= 1) {
				this.isActive = false;
			}
		}
	}

	draw() {
		if (!this.isActive) return;

		ctx.save();

		for (let i = 0; i < 6; i++) {
			const angle = (this.animation + i * Math.PI / 3) % (Math.PI * 2);
			const distance = this.radius + Math.sin(this.animation * 2 + i) * 5;
			const px = this.x + Math.cos(angle) * distance;
			const py = this.y + Math.sin(angle) * distance;

			ctx.fillStyle = this.color;
			ctx.globalAlpha = 0.6;
			ctx.beginPath();
			ctx.arc(px, py, 2, 0, Math.PI * 2);
			ctx.fill();
		}

		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fillStyle = this.color;
		ctx.shadowBlur = 30;
		ctx.shadowColor = this.color;
		ctx.fill();

		ctx.strokeStyle = this.color;
		ctx.lineWidth = 2;
		ctx.stroke();

		ctx.globalAlpha = 0.3;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius + Math.sin(this.animation * 3) * 5, 0, Math.PI * 2);
		ctx.stroke();

		ctx.restore();
	}

	startReturn() {
		this.isReturning = true;
		this.returnProgress = 0;
	}
}

function drawEnergyBridge() {
	if (!energyBridge.isActive || remoteCores.size === 0) return;

	let closestCore = null;
	let minDistance = Infinity;

	remoteCores.forEach((core, id) => {
		const dx = localCore.x - core.x;
		const dy = localCore.y - core.y;
		const distance = dx * dx + dy * dy;

		if (distance < minDistance) {
			minDistance = distance;
			closestCore = core;
		}
	});

	if (!closestCore) return;

	const startX = localCore.x;
	const startY = localCore.y;
	const endX = closestCore.x;
	const endY = closestCore.y;

	ctx.save();

	const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
	gradient.addColorStop(0, '#3498DB');
	gradient.addColorStop(0.5, '#5DADE2');
	gradient.addColorStop(1, '#85C1E9');

	ctx.strokeStyle = gradient;
	ctx.lineWidth = 15;
	ctx.shadowBlur = 60;
	ctx.shadowColor = '#3498DB';

	ctx.beginPath();
	const segments = 60;
	for (let i = 0; i <= segments; i++) {
		const t = i / segments;
		const x = startX + (endX - startX) * t;
		const y = startY + (endY - startY) * t;

		const wave = Math.sin(t * Math.PI * 3 + energyBridge.progress * 2) * 30;
		const perpendicular = Math.atan2(endY - startY, endX - startX) + Math.PI / 2;
		const waveX = x + Math.cos(perpendicular) * wave;
		const waveY = y + Math.sin(perpendicular) * wave;

		if (i === 0) {
			ctx.moveTo(waveX, waveY);
		} else {
			ctx.lineTo(waveX, waveY);
		}
	}
	ctx.stroke();

	for (let layer = 0; layer < 3; layer++) {
		ctx.strokeStyle = layer === 0 ? '#ffffff' : 
		(layer === 1 ? '#3498DB' : '#5DADE2');
		ctx.lineWidth = 10 - layer * 3;
		ctx.globalAlpha = 0.7 - layer * 0.2;
		ctx.shadowBlur = 50 - layer * 15;
		ctx.stroke();
	}

	for (let i = 0; i < 15; i++) {
		const t = (energyBridge.progress + i * 0.07) % 1;
		const x = startX + (endX - startX) * t;
		const y = startY + (endY - startY) * t;

		const wave = Math.sin(t * Math.PI * 3 + energyBridge.progress * 2) * 30;
		const perpendicular = Math.atan2(endY - startY, endX - startX) + Math.PI / 2;
		const particleX = x + Math.cos(perpendicular) * wave;
		const particleY = y + Math.sin(perpendicular) * wave;

		ctx.fillStyle = '#3498DB';
		ctx.shadowBlur = 25;
		ctx.shadowColor = '#5DADE2';
		ctx.beginPath();
		ctx.arc(particleX, particleY, 4 + Math.sin(t * Math.PI * 2) * 2, 0, Math.PI * 2);
		ctx.fill();
	}

	ctx.restore();
}

let lastTime = performance.now();
let frameCount = 0;
let fps = 60;

function animate(now) {
	const delta = (now - lastTime) / 16.67;
	lastTime = now;
	frameCount++;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if (passEffect.isActive) {
		passEffect.progress = Math.min((now - passEffect.startTime) / passEffect.duration, 1);

		if (passEffect.progress >= 1) {
			passEffect.isActive = false;
			passEffect.progress = 0;
		}
	}

	if (energyBridge.isActive) {
		energyBridge.progress = Math.min((now - energyBridge.startTime) / energyBridge.duration, 1);

		if (energyBridge.progress >= 1) {
			energyBridge.isActive = false;
			energyBridge.progress = 0;
			energyBridge.particles = [];
		}
	}

	const lerpFactor = 0.1;
	localCore.vx += (targetX - localCore.x) * lerpFactor;
	localCore.vy += (targetY - localCore.y) * lerpFactor;
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
		const element = detachedElements[i];
		element.update();
		element.draw();
		if (!element.isActive) {
			detachedElements.splice(i, 1);
		}
	}

	if (remoteCores.size > 0) {
		ctx.save();
		ctx.strokeStyle = `rgba(52, 152, 219, ${0.4 + Math.sin(now * 0.002) * 0.3})`;
		ctx.lineWidth = 3;
		ctx.shadowBlur = 30;
		ctx.shadowColor = "#3498DB";

		remoteCores.forEach((core, id) => {
			ctx.beginPath();
			ctx.moveTo(localCore.x, localCore.y);
			ctx.lineTo(core.x, core.y);
			ctx.stroke();
		});
		ctx.restore();
	}

	drawEnergyBridge();

	remoteCores.forEach((core, id) => {
		ctx.save();
		ctx.shadowBlur = 100;
		ctx.shadowColor = "#5DADE2";
		ctx.beginPath();
		ctx.arc(core.x, core.y, 35, 0, Math.PI * 2);
		ctx.fillStyle = "#5DADE2";
		ctx.fill();

		ctx.globalAlpha = 0.4;
		ctx.beginPath();
		ctx.arc(core.x, core.y, 35 + Math.sin(now * 0.004) * 15, 0, Math.PI * 2);
		ctx.strokeStyle = "#5DADE2";
		ctx.lineWidth = 3;
		ctx.stroke();
		ctx.restore();
	});

	ctx.save();

	if (passEffect.isActive) {
		const passAlpha = Math.sin(passEffect.progress * Math.PI) * 0.6 + 0.4;
		const passBlur = 80 + Math.sin(passEffect.progress * Math.PI) * 120;

		ctx.globalAlpha = passAlpha;
		ctx.shadowBlur = passBlur;
		ctx.shadowColor = "#5DADE2";
	} else {
		ctx.shadowBlur = 120 + localCore.energyBoost * 60;
		ctx.shadowColor = "#3498DB";
	}

	const radius = localCore.radius * (passEffect.isActive ? (1 + Math.sin(passEffect.progress * Math.PI) * 0.8) : 1);
	ctx.beginPath();
	ctx.arc(localCore.x, localCore.y, radius, 0, Math.PI * 2);
	ctx.fillStyle = passEffect.isActive ? "#5DADE2" : "#3498DB";
	ctx.fill();

	if (passEffect.isActive) {
		for (let i = 0; i < 4; i++) {
			const waveRadius = radius + (i + 1) * 25 + passEffect.progress * 60;
			const waveAlpha = (1 - passEffect.progress) * (0.4 - i * 0.1);

			ctx.globalAlpha = waveAlpha;
			ctx.beginPath();
			ctx.arc(localCore.x, localCore.y, waveRadius, 0, Math.PI * 2);
			ctx.strokeStyle = "#5DADE2";
			ctx.lineWidth = 3;
			ctx.stroke();
		}
	}

	ctx.restore();

	requestAnimationFrame(animate);
}

animate();

canvas.addEventListener("mousemove", (e) => {
	targetX = e.clientX;
	targetY = e.clientY;

	channel.postMessage({
		type: "move",
		x: e.clientX,
		y: e.clientY,
		id: windowId
	});
});

canvas.addEventListener("click", (e) => {
	passEffect.isActive = true;
	passEffect.startTime = performance.now();
	passEffect.direction = 1;
	localCore.energyBoost = 2;

	spawnParticles(e.clientX, e.clientY, 30);

	channel.postMessage({
		type: "pass-effect",
		x: e.clientX,
		y: e.clientY,
		id: windowId
	});
});

canvas.addEventListener("dblclick", (e) => {
	energyBridge.isActive = true;
	energyBridge.startTime = performance.now();
	energyBridge.progress = 0;
	energyBridge.particles = [];

	channel.postMessage({
		type: "energy-bridge",
		id: windowId
	});
});

channel.onmessage = (event) => {
	const data = event.data;

	if (data.type === "move") {
		if (!remoteCores.has(data.id)) {
			remoteCores.set(data.id, {
				x: data.x,
				y: data.y,
				lastUpdate: Date.now()
			});

			const color = '#3498DB';
			const element = new DetachedElement(data.x, data.y, color, data.id);
			detachedElements.push(element);

			energyBridge.isActive = true;
			energyBridge.startTime = performance.now();
			energyBridge.progress = 0;
			energyBridge.particles = [];

			spawnParticles(localCore.x, localCore.y, 30);
		} else {
			const core = remoteCores.get(data.id);
			core.x = data.x;
			core.y = data.y;
			core.lastUpdate = Date.now();

			const element = detachedElements.find(e => e.id === data.id);
			if (element) {
				element.targetX = data.x;
				element.targetY = data.y;
			}
		}

		localCore.energyBoost = 1;
	}

	else if (data.type === "window-focus" && data.id !== windowId) {
		if (isMainWindow) {
			passEffect.isActive = true;
			passEffect.startTime = performance.now();
			passEffect.direction = 1;
			localCore.energyBoost = 2;
			
			spawnParticles(localCore.x, localCore.y, 20);
		}
	}

	else if (data.type === "pass-effect" && data.id !== windowId) {
		passEffect.isActive = true;
		passEffect.startTime = performance.now();
		passEffect.direction = 1;
		localCore.energyBoost = 2;
		spawnParticles(data.x, data.y, 25);
	}

	else if (data.type === "energy-bridge" && data.id !== windowId) {
		energyBridge.isActive = true;
		energyBridge.startTime = performance.now();
		energyBridge.progress = 0;
		energyBridge.particles = [];
	}
};

setInterval(() => {
	const now = Date.now();
	remoteCores.forEach((core, id) => {
		if (now - core.lastUpdate > 3000) {
			const element = detachedElements.find(e => e.id === id);
			if (element) {
				element.startReturn();
			}
			remoteCores.delete(id);
		}
	});
}, 1000);

window.addEventListener("beforeunload", () => {
	channel.postMessage({
		type: "close",
		id: windowId
	});
});

window.addEventListener("resize", () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});
