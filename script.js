// main.js (reemplaza tu JS por éste)
// Integración completa: carousel 3D, drag, autoplay controlado, modal por item, skills grid, particles, y UI helpers.

"use strict";

(function () {

  /* ----------------------------
     Data: portfolio & skills
     ---------------------------- */
const portfolioData = [
  { id: 1, title: 'Red Neuronal', description: 'Sistema avanzado de IA con capacidades de aprendizaje profundo para análisis predictivo y reconocimiento de patrones.', image: 'neural-network.jpg', tech: ['TensorFlow', 'Python', 'CUDA'] },
  { id: 2, title: 'Nube Cuántica', description: 'Infraestructura de nube de próxima generación aprovechando la computación cuántica para un poder de procesamiento sin precedentes.', image: 'quantum-cloud.jpg', tech: ['AWS', 'Kubernetes', 'Docker'] },
  { id: 3, title: 'Bóveda Blockchain', description: 'Solución de almacenamiento descentralizado seguro usando encriptación avanzada y tecnología de libro mayor distribuido.', image: 'blockchain-vault.jpg', tech: ['Ethereum', 'Solidity', 'Web3'] },
  { id: 4, title: 'Defensa Cibernética', description: 'Marco de ciberseguridad de grado militar con detección de amenazas en tiempo real y respuesta automatizada.', image: 'cyber-defense.jpg', tech: ['Zero Trust', 'Defensa IA', 'Encriptación'] },
  { id: 5, title: 'Nexo de Datos', description: 'Plataforma de procesamiento de big data capaz de analizar petabytes de información en tiempo real.', image: 'data-nexus.jpg', tech: ['Apache Spark', 'Hadoop', 'Kafka'] },
  { id: 6, title: 'Interfaz AR', description: 'Sistema de realidad aumentada para visualización de datos inmersiva y experiencias interactivas.', image: 'ar-interface.jpg', tech: ['Unity', 'ARCore', 'Visión Comp.'] },
  { id: 7, title: 'Matriz IoT', description: 'Ecosistema IoT inteligente conectando millones de dispositivos con capacidades de computación en el borde.', image: 'iot-matrix.jpg', tech: ['MQTT', 'Edge AI', '5G'] }
];

  const skillsData = [
    { name: 'React.js', icon: '⚛️', level: 95, category: 'frontend' },
    { name: 'Node.js', icon: '🟢', level: 90, category: 'backend' },
    { name: 'TypeScript', icon: '📘', level: 88, category: 'frontend' },
    { name: 'AWS', icon: '☁️', level: 92, category: 'cloud' },
    { name: 'Docker', icon: '🐳', level: 85, category: 'cloud' },
    { name: 'Python', icon: '🐍', level: 93, category: 'backend' },
    { name: 'Kubernetes', icon: '☸️', level: 82, category: 'cloud' },
    { name: 'GraphQL', icon: '◈', level: 87, category: 'backend' },
    { name: 'TensorFlow', icon: '🤖', level: 78, category: 'emerging' },
    { name: 'Blockchain', icon: '🔗', level: 75, category: 'emerging' },
    { name: 'Vue.js', icon: '💚', level: 85, category: 'frontend' },
    { name: 'MongoDB', icon: '🍃', level: 90, category: 'backend' }
  ];

  /* ----------------------------
     Helpers & DOM references
     ---------------------------- */
  const carousel = document.getElementById('carousel');
  const indicatorsContainer = document.getElementById('indicators');
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  const particlesContainer = document.getElementById('particles');
  const skillsGrid = document.getElementById('skillsGrid');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const header = document.getElementById('header');
  const contactForm = document.getElementById('contactForm');
  const loader = document.getElementById('loader');
  const hero = document.querySelector('.hero');

  // Guard clauses for required elements
  if (!carousel) {
    console.warn('No se encontró #carousel en el DOM. El script del carrusel no se inicializará.');
  }

  /* ----------------------------
     Carousel creation & rendering
     ---------------------------- */
  let currentIndex = 0;

  function createCarouselItem(data, index) {
    const item = document.createElement('div');
    item.className = 'carousel-item';
    item.dataset.index = index;

    // Data attributes para modal
    item.dataset.title = data.title;
    item.dataset.desc = data.description;
    item.dataset.img = data.image;
    item.dataset.tags = data.tech ? data.tech.join(',') : '';

    const techBadges = (data.tech || []).map(tech => `<span class="tech-badge">${tech}</span>`).join('');

    item.innerHTML = `
      <div class="card">
        <div class="card-number">0${data.id}</div>
        <div class="card-image">
          <img src="${data.image}" alt="${data.title}">
        </div>
        <h3 class="card-title">${data.title}</h3>
        <p class="card-description">${data.description}</p>
        <div class="card-tech">${techBadges}</div>
        <button class="card-cta" type="button">Explorar</button>
      </div>
    `;

    return item;
  }

  function initCarousel() {
    if (!carousel) return;
    carousel.innerHTML = ''; // limpiar por si acaso
    indicatorsContainer && (indicatorsContainer.innerHTML = '');

    portfolioData.forEach((data, index) => {
      const item = createCarouselItem(data, index);
      carousel.appendChild(item);

      // indicador sin handler (se añadirá en attachIndicatorHandlers)
      if (indicatorsContainer) {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        if (index === 0) indicator.classList.add('active');
        indicator.dataset.index = index;
        indicatorsContainer.appendChild(indicator);
      }
    });

    updateCarousel();
  }

  function updateCarousel() {
    if (!carousel) return;
    const items = Array.from(carousel.querySelectorAll('.carousel-item'));
    const indicators = indicatorsContainer ? Array.from(indicatorsContainer.querySelectorAll('.indicator')) : [];
    const totalItems = items.length;
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024;

    items.forEach((item, index) => {
      let offset = index - currentIndex;

      if (offset > totalItems / 2) offset -= totalItems;
      else if (offset < -totalItems / 2) offset += totalItems;

      const absOffset = Math.abs(offset);
      const sign = offset < 0 ? -1 : 1;

      item.style.transition = 'all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)';
      item.style.transform = '';
      item.style.opacity = '';
      item.style.zIndex = '';

      let spacing1 = 400, spacing2 = 600, spacing3 = 750;
      if (isMobile) { spacing1 = 280; spacing2 = 420; spacing3 = 550; }
      else if (isTablet) { spacing1 = 340; spacing2 = 520; spacing3 = 650; }

      if (absOffset === 0) {
        item.style.transform = 'translate(-50%, -50%) translateZ(0) scale(1)';
        item.style.opacity = '1';
        item.style.zIndex = '10';
      } else if (absOffset === 1) {
        const translateX = sign * spacing1;
        const rotation = isMobile ? 25 : 30;
        const scale = isMobile ? 0.88 : 0.85;
        item.style.transform = `translate(-50%, -50%) translateX(${translateX}px) translateZ(-200px) rotateY(${-sign * rotation}deg) scale(${scale})`;
        item.style.opacity = '0.8';
        item.style.zIndex = '5';
      } else if (absOffset === 2) {
        const translateX = sign * spacing2;
        const rotation = isMobile ? 35 : 40;
        const scale = isMobile ? 0.75 : 0.7;
        item.style.transform = `translate(-50%, -50%) translateX(${translateX}px) translateZ(-350px) rotateY(${-sign * rotation}deg) scale(${scale})`;
        item.style.opacity = '0.5';
        item.style.zIndex = '3';
      } else if (absOffset === 3) {
        const translateX = sign * spacing3;
        const rotation = isMobile ? 40 : 45;
        const scale = isMobile ? 0.65 : 0.6;
        item.style.transform = `translate(-50%, -50%) translateX(${translateX}px) translateZ(-450px) rotateY(${-sign * rotation}deg) scale(${scale})`;
        item.style.opacity = '0.3';
        item.style.zIndex = '2';
      } else {
        item.style.transform = 'translate(-50%, -50%) translateZ(-500px) scale(0.5)';
        item.style.opacity = '0';
        item.style.zIndex = '1';
      }
    });

    // indicators
    if (indicators.length) {
      indicators.forEach((indicator, idx) => {
        indicator.classList.toggle('active', idx === currentIndex);
      });
    }
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % portfolioData.length;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + portfolioData.length) % portfolioData.length;
    updateCarousel();
  }

  function goToSlide(index) {
    if (typeof index !== 'number') return;
    currentIndex = index % portfolioData.length;
    updateCarousel();
  }

  /* ----------------------------
     Autoplay + interaction control
     ---------------------------- */
  let autoplayIntervalId = null;
  const AUTOPLAY_DELAY = 5000;
  const RESUME_AFTER = 4000;
  let resumeTimeoutId = null;

  function startAutoplay() {
    stopAutoplay();
    autoplayIntervalId = setInterval(nextSlide, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (autoplayIntervalId) {
      clearInterval(autoplayIntervalId);
      autoplayIntervalId = null;
    }
    if (resumeTimeoutId) {
      clearTimeout(resumeTimeoutId);
      resumeTimeoutId = null;
    }
  }

  function scheduleAutoplayResume() {
    if (resumeTimeoutId) clearTimeout(resumeTimeoutId);
    resumeTimeoutId = setTimeout(() => {
      startAutoplay();
      resumeTimeoutId = null;
    }, RESUME_AFTER);
  }

  // Attach handlers for indicators (created in initCarousel)
  function attachIndicatorHandlers() {
    if (!indicatorsContainer) return;
    const indicators = Array.from(indicatorsContainer.querySelectorAll('.indicator'));
    indicators.forEach(ind => {
      // Avoid duplicate listeners: remove first
      ind.replaceWith(ind.cloneNode(true));
    });
    // re-query after replacement
    const freshIndicators = Array.from(indicatorsContainer.querySelectorAll('.indicator'));
    freshIndicators.forEach(ind => {
      ind.addEventListener('click', (e) => {
        stopAutoplay();
        const idx = Number(ind.dataset.index);
        goToSlide(idx);
        scheduleAutoplayResume();
      });
    });
  }

  /* ----------------------------
     Drag / pointer interaction
     ---------------------------- */
  let isDragging = false;
  let pointerDown = false;
  let startX = 0;
  let lastX = 0;
  let moved = false;

  function attachDragHandlers() {
    if (!carousel) return;

    // Ensure pointer events
    carousel.style.touchAction = 'pan-y';

    carousel.addEventListener('pointerdown', (e) => {
      pointerDown = true;
      moved = false;
      isDragging = false;
      startX = e.clientX;
      lastX = startX;
      try { carousel.setPointerCapture(e.pointerId); } catch (err) {}
      carousel.classList.add('dragging');
      stopAutoplay();
    });

    carousel.addEventListener('pointermove', (e) => {
      if (!pointerDown) return;
      const dx = e.clientX - startX;
      lastX = e.clientX;
      if (Math.abs(dx) > 8) {
        moved = true;
        isDragging = true;
      }
      // no visual follow implemented (keeps transforms consistent)
    });

    function endPointerInteraction(e) {
      if (!pointerDown) return;
      pointerDown = false;
      carousel.classList.remove('dragging');
      try { carousel.releasePointerCapture && carousel.releasePointerCapture(e.pointerId); } catch (err) {}
      const dx = lastX - startX;
      const threshold = 60;
      if (Math.abs(dx) >= threshold) {
        if (dx < 0) nextSlide();
        else prevSlide();
      } else {
        // short gesture -> treat as potential click (click handler manages modal/open)
      }
      // small delay before resuming autoplay
      isDragging = false;
      scheduleAutoplayResume();
    }

    carousel.addEventListener('pointerup', endPointerInteraction);
    carousel.addEventListener('pointercancel', endPointerInteraction);
    carousel.addEventListener('pointerleave', (e) => {
      if (pointerDown) endPointerInteraction(e);
    });
  }

  /* ----------------------------
     Modal interactions (si existe modal en DOM)
     ---------------------------- */
  const modal = document.getElementById('carousel-modal');
  let modalEnabled = !!modal;

  let lastFocusedElement = null;

  if (modalEnabled) {
    const modalBackdrop = modal.querySelector('.carousel-modal-backdrop');
    const modalCard = modal.querySelector('.carousel-modal-card');
    const modalCloseBtn = modal.querySelector('.carousel-modal-close');
    const modalImg = modal.querySelector('.carousel-modal-img');
    const modalTitle = modal.querySelector('.carousel-modal-title');
    const modalDesc = modal.querySelector('.carousel-modal-desc');
    const modalCTA = modal.querySelector('.carousel-modal-cta');

    const itemDetails = {}; // opcional: puedes añadir entradas por index si quieres sobrescribir

    function openModalFromItem(item) {
      if (isDragging) return;
      stopAutoplay();
      lastFocusedElement = document.activeElement;

      const idx = item.dataset.index ?? item.getAttribute('data-index') ?? null;
      const dsTitle = item.dataset.title;
      const dsDesc = item.dataset.desc;
      const dsImg = item.dataset.img;
      const dsTags = item.dataset.tags;

      const details = (idx && itemDetails[idx]) ? itemDetails[idx] : {};
      const title = dsTitle || details.title || (item.querySelector('.card-title')?.textContent?.trim()) || `Elemento ${idx ?? ''}`;
      const desc = dsDesc || details.desc || (item.querySelector('.card-description')?.textContent?.trim()) || 'No hay descripción adicional.';
      const img = dsImg || details.img || (item.querySelector('img')?.src) || '';

      // fill modal
      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      if (img) {
        modalImg.src = img;
        modalImg.alt = title;
        modalImg.style.display = '';
      } else {
        modalImg.style.display = 'none';
      }

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      modalCard && modalCard.focus({ preventScroll: true });

      document.addEventListener('keydown', handleModalKeydown);
      modalBackdrop && modalBackdrop.addEventListener('click', backdropCloseHandler);
      modalCloseBtn && modalCloseBtn.addEventListener('click', closeModal);

      if (modalCTA) {
        modalCTA.onclick = () => {
          // ejemplo: navegar a página de producto; se puede personalizar
          window.location.href = `/producto/${idx ?? ''}`;
        };
      }
    }

    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');

      document.removeEventListener('keydown', handleModalKeydown);
      const modalBackdropEl = modal.querySelector('.carousel-modal-backdrop');
      const modalCloseBtnEl = modal.querySelector('.carousel-modal-close');
      modalBackdropEl && modalBackdropEl.removeEventListener('click', backdropCloseHandler);
      modalCloseBtnEl && modalCloseBtnEl.removeEventListener('click', closeModal);

      if (lastFocusedElement) lastFocusedElement.focus();
      lastFocusedElement = null;

      scheduleAutoplayResume();
    }

    function handleModalKeydown(e) {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'Tab') {
        const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    }

    function backdropCloseHandler(e) {
      if (e.target && e.target.dataset && e.target.dataset.action === 'close') closeModal();
    }

    // Attach click handlers to items to open modal
    function attachItemClickHandlersModal() {
      if (!carousel) return;
      const items = Array.from(carousel.querySelectorAll('.carousel-item'));
      items.forEach((item, idx) => {
        // ensure index present
        if (!item.dataset.index) item.dataset.index = idx;
        // remove previous to avoid duplicates
        item.replaceWith(item.cloneNode(true));
      });
      // re-query after replacement
      const freshItems = Array.from(carousel.querySelectorAll('.carousel-item'));
      freshItems.forEach(item => {
        item.addEventListener('click', (e) => {
          // if dragging occurred, ignore click
          if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          openModalFromItem(item);
        });

        // The CTA inside the card we preserved: make it focusable and open modal too (optional)
        const cta = item.querySelector('.card-cta');
        if (cta) {
          cta.addEventListener('click', (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            openModalFromItem(item);
          });
        }
      });
    }

    // expose to local scope
    window.__attachItemClickHandlersModal = attachItemClickHandlersModal;
  } // end modalEnabled

  /* ----------------------------
     Attach item click handlers (fallback if modal disabled: click moves to that slide)
     ---------------------------- */
  function attachItemClickHandlersFallback() {
    if (!carousel) return;
    const items = Array.from(carousel.querySelectorAll('.carousel-item'));
    items.forEach((item, idx) => {
      // ensure index present
      if (!item.dataset.index) item.dataset.index = idx;
      // remove previous to avoid duplicates
      item.replaceWith(item.cloneNode(true));
    });
    const freshItems = Array.from(carousel.querySelectorAll('.carousel-item'));
    freshItems.forEach(item => {
      item.addEventListener('click', (e) => {
        if (isDragging) {
          e.preventDefault(); e.stopPropagation(); return;
        }
        stopAutoplay();
        const idx = Number(item.dataset.index);
        goToSlide(idx);
        scheduleAutoplayResume();
      });
    });
  }

  /* ----------------------------
     Init carousel interaction (indicators + items)
     ---------------------------- */
  function initCarouselInteraction() {
    attachIndicatorHandlers();
    if (modalEnabled) {
      window.__attachItemClickHandlersModal && window.__attachItemClickHandlersModal();
    } else {
      attachItemClickHandlersFallback();
    }
    attachDragHandlers();
  }

  /* ----------------------------
     Particles for philosophy section (gentle)
     ---------------------------- */
  function initParticles() {
    if (!particlesContainer) return;
    particlesContainer.innerHTML = '';
    const particleCount = 15;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 20 + 's';
      particle.style.animationDuration = (18 + Math.random() * 8) + 's';
      particlesContainer.appendChild(particle);
    }
  }

  /* ----------------------------
     Hex skills grid
     ---------------------------- */
  function initSkillsGrid() {
    if (!skillsGrid) return;
    const categoryTabs = document.querySelectorAll('.category-tab');

    function displaySkills(category = 'all') {
      skillsGrid.innerHTML = '';
      const filtered = category === 'all' ? skillsData : skillsData.filter(s => s.category === category);
      filtered.forEach((skill, index) => {
        const hexagon = document.createElement('div');
        hexagon.className = 'skill-hexagon';
        hexagon.style.animationDelay = `${index * 0.1}s`;
        hexagon.innerHTML = `
          <div class="hexagon-inner">
            <div class="hexagon-content">
              <div class="skill-icon-hex">${skill.icon}</div>
              <div class="skill-name-hex">${skill.name}</div>
              <div class="skill-level">
                <div class="skill-level-fill" style="width: ${skill.level}%"></div>
              </div>
              <div class="skill-percentage-hex">${skill.level}%</div>
            </div>
          </div>
        `;
        skillsGrid.appendChild(hexagon);
      });
    }

    categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        displaySkills(tab.dataset.category);
      });
    });

    displaySkills();
  }

  /* ----------------------------
     UI: menu toggle, header scroll, smooth nav, etc.
     ---------------------------- */
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  }

  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    });
  }

  // Smooth nav links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetSection.offsetTop - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        navMenu && navMenu.classList.remove('active');
        menuToggle && menuToggle.classList.remove('active');
      }
    });
  });

  // Active nav on scroll
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNav() {
    const scrollPosition = window.scrollY + 100;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          const href = link.getAttribute('href').substring(1);
          if (href === sectionId) link.classList.add('active');
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav);

  /* ----------------------------
     Stats animation (counter)
     ---------------------------- */
  function animateCounter(element) {
    const target = parseInt(element.dataset.target) || 0;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const counter = setInterval(() => {
      current += step;
      if (current >= target) {
        element.textContent = target;
        clearInterval(counter);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  }

  const observerOptions = { threshold: 0.5, rootMargin: '0px 0px -100px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll('.stat-number');
        statNumbers.forEach(number => {
          if (!number.classList.contains('animated')) {
            number.classList.add('animated');
            animateCounter(number);
          }
        });
      }
    });
  }, observerOptions);

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) observer.observe(statsSection);

  /* ----------------------------
     Contact form
     ---------------------------- */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      alert(`¡Gracias ${data.name || 'amigo'}! Tu mensaje ha sido enviado exitosamente. Responderemos dentro de 24 horas.`);
      contactForm.reset();
    });
  }

  /* ----------------------------
     Loader
     ---------------------------- */
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loader) loader.classList.add('hidden');
    }, 1500);
  });

  /* ----------------------------
     Parallax hero
     ---------------------------- */
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (hero) hero.style.transform = `translateY(${scrolled * 0.5}px)`;
  });

  /* ----------------------------
     Button controls (next/prev) - single place only
     ---------------------------- */
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopAutoplay();
      nextSlide();
      scheduleAutoplayResume();
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoplay();
      prevSlide();
      scheduleAutoplayResume();
    });
  }

  /* ----------------------------
     Keyboard navigation (arrows)
     ---------------------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  /* ----------------------------
     Window resize for responsiveness
     ---------------------------- */
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => updateCarousel(), 250);
  });

  /* ----------------------------
     Initialization sequence
     ---------------------------- */
  function initAll() {
    initCarousel();
    initCarouselInteraction();
    initSkillsGrid();
    initParticles();
    // start autoplay only if carousel exists
    if (carousel) startAutoplay();
  }

  // Run init
  initAll();

  // Expose some functions for debugging (optional)
  window.__carousel = {
    nextSlide, prevSlide, goToSlide, startAutoplay, stopAutoplay, updateCarousel
  };

})(); // IIFE end

