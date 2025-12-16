const portfolioData = [
  { id:1, title:'Matriz IoT', description:'YE.Ecosistema IoT inteligente conectando millones de dispositivos.', image:'images/iot-matrix.jpg', tech:['MQTT','Edge AI','5G'] },
  { id:2, title:'Interfaz AR', description:'Realidad aumentada para experiencias interactivas e inmersivas.', image:'images/ar-interface.jpg', tech:['Unity','ARCore','Visión Comp.'] },
  { id:3, title:'Nexo de Datos', description:'Plataforma de procesamiento de big data en tiempo real.', image:'images/data-nexus.jpg', tech:['Spark','Hadoop','Kafka'] },
  { id:4, title:'Defensa Cibernética', description:'Detección de amenazas en tiempo real y respuesta automatizada.', image:'images/cyber-defense.jpg', tech:['Zero Trust','SIEM'] },
  { id:5, title:'Bóveda Blockchain', description:'Almacenamiento descentralizado seguro.', image:'images/blockchain-vault.jpg', tech:['Ethereum','Web3'] },
  { id:6, title:'Nube Cuántica', description:'Computación cuántica en la nube para cargas críticas.', image:'images/quantum-cloud.jpg', tech:['Kubernetes','GPU'] },
  { id:7, title:'Red Neuronal', description:'IA avanzada para análisis predictivo y reconocimiento de patrones.', image:'images/neural-network.jpg', tech:['TensorFlow','Python'] }
];

document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('carousel');
  const indicatorsContainer = document.getElementById('indicators');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  let currentIndex = 0;
  let autoRotateId = null;

  // pointer / drag state
  let isPointerDown = false;
  let activePointerId = null;
  let startX = 0;
  let startY = 0; // 👈 AGREGADO
  let lastX = 0;
  let dragDelta = 0;
  let wasDragged = false;
  let pointerTargetItem = null;
  let isHorizontalDrag = null; // 👈 NUEVO: detectar dirección
  const clickThreshold = 10;
  const dragThreshold = 80;
  const resumeDelay = 3000;
  const autoRotateInterval = 3000;

  function computeSpacing(){
    const w = window.innerWidth;
    if (w <= 520) return { s1:260, s2:420, s3:520 };
    if (w <= 900) return { s1:320, s2:520, s3:640 };
    return { s1:400, s2:600, s3:750 };
  }

  function createCarouselItem(data, index){
    const item = document.createElement('div');
    item.className = 'carousel-item';
    item.dataset.index = index;

    const techBadges = (data.tech || []).map(t => `<span class="tech-badge">${t}</span>`).join('');
    const number = data.id < 10 ? '0' + data.id : data.id;

    item.innerHTML = `
      <div class="card">
        <div class="card-number">${number}</div>
        <div class="card-image"><img src="${data.image}" alt="${data.title}"></div>
        <h3 class="card-title">${data.title}</h3>
        <p class="card-description">${data.description}</p>
        <div class="card-tech">${techBadges}</div>
        <button class="card-cta" type="button">Explorar</button>
      </div>
    `;

    const img = item.querySelector('img');
    img.addEventListener('error', () => {
      console.warn('Imagen no encontrada:', data.image);
      img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#1a1a1a"/><text x="50%" y="50%" fill="#888" font-size="20" text-anchor="middle" dominant-baseline="middle">Imagen no encontrada</text></svg>';
    });

    return item;
  }

  function initCarousel(){
    carousel.innerHTML = '';
    indicatorsContainer.innerHTML = '';

    portfolioData.forEach((p, i) => {
      const node = createCarouselItem(p, i);
      carousel.appendChild(node);

      const ind = document.createElement('div');
      ind.className = 'indicator' + (i === 0 ? ' active' : '');
      ind.dataset.index = i;
      ind.addEventListener('click', () => { goToSlide(i); resetAutoRotateWithDelay(); });
      indicatorsContainer.appendChild(ind);
    });

    updateCarousel();
    startAutoRotate();
  }

  function updateCarousel(){
    const items = carousel.querySelectorAll('.carousel-item');
    const total = items.length;
    const { s1, s2, s3 } = computeSpacing();

    items.forEach((item, idx) => {
      let offset = idx - currentIndex;
      if (offset > total/2) offset -= total;
      if (offset < -total/2) offset += total;

      const absOffset = Math.abs(offset);
      const sign = offset < 0 ? -1 : 1;

      let tx=0, tz=0, rot=0, scale=1, opacity=1, zIndex=10;

      if (absOffset === 0) { tx = 0; tz = 0; rot = 0; scale = 1; opacity = 1; zIndex = 10; }
      else if (absOffset === 1) { tx = sign * s1; tz = -200; rot = -sign * 30; scale = 0.85; opacity = 0.9; zIndex = 6; }
      else if (absOffset === 2) { tx = sign * s2; tz = -350; rot = -sign * 40; scale = 0.7; opacity = 0.5; zIndex = 4; }
      else if (absOffset === 3) { tx = sign * s3; tz = -450; rot = -sign * 45; scale = 0.6; opacity = 0.25; zIndex = 2; }
      else { tx = 0; tz = -600; rot = 0; scale = 0.45; opacity = 0; zIndex = 1; }

      item.dataset.baseTx = tx;
      item.dataset.baseTz = tz;
      item.dataset.baseRot = rot;
      item.dataset.baseScale = scale;
      item.dataset.baseOpacity = opacity;
      item.style.zIndex = zIndex;
      item.style.transform = `translate(-50%,-50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${rot}deg) scale(${scale})`;
      item.style.opacity = opacity;
      item.style.pointerEvents = (opacity === "0" || opacity === 0) ? 'none' : 'auto';
    });

    const dots = indicatorsContainer.querySelectorAll('.indicator');
    dots.forEach((d,i) => d.classList.toggle('active', i === currentIndex));
  }

  function applyDragOverlay(deltaX){
    const items = carousel.querySelectorAll('.carousel-item');
    items.forEach(item => {
      const baseTx = parseFloat(item.dataset.baseTx || 0);
      const tz = parseFloat(item.dataset.baseTz || 0);
      const rot = parseFloat(item.dataset.baseRot || 0);
      const scale = parseFloat(item.dataset.baseScale || 1);
      const tx = baseTx + deltaX;
      item.style.transform = `translate(-50%,-50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${rot}deg) scale(${scale})`;
    });
  }

  function nextSlide(){ currentIndex = (currentIndex + 1) % portfolioData.length; updateCarousel(); }
  function prevSlide(){ currentIndex = (currentIndex - 1 + portfolioData.length) % portfolioData.length; updateCarousel(); }
  function goToSlide(i){ currentIndex = ((i % portfolioData.length) + portfolioData.length) % portfolioData.length; updateCarousel(); }

  function startAutoRotate(){
    stopAutoRotate();
    autoRotateId = setInterval(() => { nextSlide(); }, autoRotateInterval);
  }
  function stopAutoRotate(){ if (autoRotateId){ clearInterval(autoRotateId); autoRotateId = null; } }
  function resetAutoRotateWithDelay(){
    stopAutoRotate();
    setTimeout(() => startAutoRotate(), resumeDelay);
  }

  prevBtn.addEventListener('click', () => { prevSlide(); resetAutoRotateWithDelay(); });
  nextBtn.addEventListener('click', () => { nextSlide(); resetAutoRotateWithDelay(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft'){ prevSlide(); resetAutoRotateWithDelay(); }
    if (e.key === 'ArrowRight'){ nextSlide(); resetAutoRotateWithDelay(); }
  });

  // ============================================
  // 🔥 POINTER EVENTS CORREGIDOS
  // ============================================
  
  carousel.addEventListener('pointerdown', (ev) => {
    if (ev.button && ev.button !== 0) return;
    isPointerDown = true;
    activePointerId = ev.pointerId;
    startX = ev.clientX;
    startY = ev.clientY; // 👈 GUARDAMOS Y INICIAL
    lastX = startX;
    dragDelta = 0;
    wasDragged = false;
    isHorizontalDrag = null; // 👈 RESETEAR
    pointerTargetItem = ev.target.closest ? ev.target.closest('.carousel-item') : null;
    
    try { ev.target.setPointerCapture(ev.pointerId); } catch(e){ 
      try { carousel.setPointerCapture(ev.pointerId); } catch(e2) {} 
    }
    stopAutoRotate();
  });

  carousel.addEventListener('pointermove', (ev) => {
    if (!isPointerDown || ev.pointerId !== activePointerId) return;

    const deltaX = ev.clientX - startX;
    const deltaY = ev.clientY - startY; // 👈 CORRECTO

    // 🎯 Detectar dirección solo la primera vez que se mueve
    if (isHorizontalDrag === null && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
      isHorizontalDrag = Math.abs(deltaX) > Math.abs(deltaY);
    }

    // 🚫 Si es scroll vertical, soltar el drag
    if (isHorizontalDrag === false) {
      isPointerDown = false;
      try { if (activePointerId != null) carousel.releasePointerCapture(activePointerId); } catch(e){}
      return;
    }

    // ✅ Si es drag horizontal, prevenir scroll y mover carrusel
    if (isHorizontalDrag === true) {
      ev.preventDefault(); // 👈 Solo prevenir si es horizontal
      dragDelta = deltaX;
      if (Math.abs(dragDelta) > clickThreshold) wasDragged = true;
      lastX = ev.clientX;
      applyDragOverlay(dragDelta);
    }
  });

  function finishPointerInteraction(ev){
    if (!isPointerDown) return;
    isPointerDown = false;
    try { if (activePointerId != null) carousel.releasePointerCapture(activePointerId); } catch(e){}
    activePointerId = null;

    if (wasDragged && Math.abs(dragDelta) >= dragThreshold){
      const s1 = computeSpacing().s1 || 400;
      const change = Math.max(1, Math.round(Math.abs(dragDelta) / s1));
      if (dragDelta < 0) currentIndex = (currentIndex + change) % portfolioData.length;
      else currentIndex = (currentIndex - change + portfolioData.length) % portfolioData.length;
      updateCarousel();
    } else {
      if (pointerTargetItem && !wasDragged){
        const idx = parseInt(pointerTargetItem.dataset.index, 10);
        if (!Number.isNaN(idx)) goToSlide(idx);
      } else {
        updateCarousel();
      }
    }

    dragDelta = 0;
    wasDragged = false;
    pointerTargetItem = null;
    isHorizontalDrag = null; // 👈 RESETEAR
    resetAutoRotateWithDelay();
  }

  carousel.addEventListener('pointerup', finishPointerInteraction);
  carousel.addEventListener('pointercancel', finishPointerInteraction);
  window.addEventListener('pointerup', finishPointerInteraction);
  window.addEventListener('pointercancel', finishPointerInteraction);

  carousel.addEventListener('mouseenter', () => stopAutoRotate());
  carousel.addEventListener('mouseleave', () => resetAutoRotateWithDelay());

  let resizeTimer = null;
  window.addEventListener('resize', () => { 
    clearTimeout(resizeTimer); 
    resizeTimer = setTimeout(() => updateCarousel(), 150); 
  });

  initCarousel();

  // === EFECTOS DEL ENCABEZADO ===
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) header.classList.toggle('scrolled', window.scrollY > 10);
  });

  const menuToggle = document.getElementById('menuToggle');
  const nav = document.querySelector('.nav-list');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      document.body.classList.toggle('menu-open');
      if (nav) nav.toggleAttribute('hidden');
    });
  }
});

const slogan = document.querySelector('.carousel-slogan');

function fadeSlogan() {
  slogan.classList.remove('fade');
  void slogan.offsetWidth; // reset animación
  slogan.classList.add('fade');
}
