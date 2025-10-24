// JavaScript Document

/*

TemplateMo 600 Prism Flux

https://templatemo.com/tm-600-prism-flux

*/


// Portfolio data for carousel

        const portfolioData = [
            {
                id: 1,
                title: 'Red Neuronal',
                description: 'Sistema avanzado de IA con capacidades de aprendizaje profundo para análisis predictivo y reconocimiento de patrones.',
                image: 'images/neural-network.jpg',
                tech: ['TensorFlow', 'Python', 'CUDA']
            },
            {
                id: 2,
                title: 'Nube Cuántica',
                description: 'Infraestructura de nube de próxima generación aprovechando la computación cuántica para un poder de procesamiento sin precedentes.',
                image: 'images/quantum-cloud.jpg',
                tech: ['AWS', 'Kubernetes', 'Docker']
            },
            {
                id: 3,
                title: 'Bóveda Blockchain',
                description: 'Solución de almacenamiento descentralizado seguro usando encriptación avanzada y tecnología de libro mayor distribuido.',
                image: 'images/blockchain-vault.jpg',
                tech: ['Ethereum', 'Solidity', 'Web3']
            },
            {
                id: 4,
                title: 'Defensa Cibernética',
                description: 'Marco de ciberseguridad de grado militar con detección de amenazas en tiempo real y respuesta automatizada.',
                image: 'images/cyber-defense.jpg',
                tech: ['Zero Trust', 'Defensa IA', 'Encriptación']
            },
            {
                id: 5,
                title: 'Nexo de Datos',
                description: 'Plataforma de procesamiento de big data capaz de analizar petabytes de información en tiempo real.',
                image: 'images/data-nexus.jpg',
                tech: ['Apache Spark', 'Hadoop', 'Kafka']
            },
            {
                id: 6,
                title: 'Interfaz AR',
                description: 'Sistema de realidad aumentada para visualización de datos inmersiva y experiencias interactivas.',
                image: 'images/ar-interface.jpg',
                tech: ['Unity', 'ARCore', 'Visión Comp.']
            },
            {
                id: 7,
                title: 'Matriz IoT',
                description: 'Ecosistema IoT inteligente conectando millones de dispositivos con capacidades de computación en el borde.',
                image: 'images/iot-matrix.jpg',
                tech: ['MQTT', 'Edge AI', '5G']
            }
        ];

        // Skills data
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

        // Scroll to section function
        function scrollToSection(sectionId) {
            const section = document.getElementById(sectionId);
            const header = document.getElementById('header');
            if (section) {
                const headerHeight = header.offsetHeight;
                const targetPosition = section.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }

        // Initialize particles for philosophy section
        function initParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 15;
           
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
               
                // Random horizontal position
                particle.style.left = Math.random() * 100 + '%';
               
                // Start particles at random vertical positions throughout the section
                particle.style.top = Math.random() * 100 + '%';
               
                // Random animation delay for natural movement
                particle.style.animationDelay = Math.random() * 20 + 's';
               
                // Random animation duration for variety
                particle.style.animationDuration = (18 + Math.random() * 8) + 's';
               
                particlesContainer.appendChild(particle);
            }
        }

        // Initialize carousel
        let currentIndex = 0;
        const carousel = document.getElementById('carousel');
        const indicatorsContainer = document.getElementById('indicators');

        function createCarouselItem(data, index) {
            const item = document.createElement('div');
            item.className = 'carousel-item';
            item.dataset.index = index;
           
            const techBadges = data.tech.map(tech =>
                `<span class="tech-badge">${tech}</span>`
            ).join('');
           
            item.innerHTML = `
                <div class="card">
                    <div class="card-number">0${data.id}</div>
                    <div class="card-image">
                        <img src="${data.image}" alt="${data.title}">
                    </div>
                    <h3 class="card-title">${data.title}</h3>
                    <p class="card-description">${data.description}</p>
                    <div class="card-tech">${techBadges}</div>
                    <button class="card-cta" onclick="scrollToSection('about')">Explorar</button>
                </div>
            `;
           
            return item;
        }

        function initCarousel() {
            // Create carousel items
            portfolioData.forEach((data, index) => {
                const item = createCarouselItem(data, index);
                carousel.appendChild(item);
               
                // Create indicator
                const indicator = document.createElement('div');
                indicator.className = 'indicator';
                if (index === 0) indicator.classList.add('active');
                indicator.dataset.index = index;
                indicator.addEventListener('click', () => goToSlide(index));
                indicatorsContainer.appendChild(indicator);
            });
           
            updateCarousel();
        }

        function updateCarousel() {
            const items = document.querySelectorAll('.carousel-item');
            const indicators = document.querySelectorAll('.indicator');
            const totalItems = items.length;
            const isMobile = window.innerWidth <= 768;
            const isTablet = window.innerWidth <= 1024;
           
            items.forEach((item, index) => {
                // Calculate relative position
                let offset = index - currentIndex;
               
                // Wrap around for continuous rotation
                if (offset > totalItems / 2) {
                    offset -= totalItems;
                } else if (offset < -totalItems / 2) {
                    offset += totalItems;
                }
               
                const absOffset = Math.abs(offset);
                const sign = offset < 0 ? -1 : 1;
               
                // Reset transform
                item.style.transform = '';
                item.style.opacity = '';
                item.style.zIndex = '';
                item.style.transition = 'all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)';
               
                // Adjust spacing based on screen size
                let spacing1 = 400;
                let spacing2 = 600;
                let spacing3 = 750;
               
                if (isMobile) {
                    spacing1 = 280;
                    spacing2 = 420;
                    spacing3 = 550;
                } else if (isTablet) {
                    spacing1 = 340;
                    spacing2 = 520;
                    spacing3 = 650;
                }
               
                if (absOffset === 0) {
                    // Center item
                    item.style.transform = 'translate(-50%, -50%) translateZ(0) scale(1)';
                    item.style.opacity = '1';
                    item.style.zIndex = '10';
                } else if (absOffset === 1) {
                    // Side items
                    const translateX = sign * spacing1;
                    const rotation = isMobile ? 25 : 30;
                    const scale = isMobile ? 0.88 : 0.85;
                    item.style.transform = `translate(-50%, -50%) translateX(${translateX}px) translateZ(-200px) rotateY(${-sign * rotation}deg) scale(${scale})`;
                    item.style.opacity = '0.8';
                    item.style.zIndex = '5';
                } else if (absOffset === 2) {
                    // Further side items
                    const translateX = sign * spacing2;
                    const rotation = isMobile ? 35 : 40;
                    const scale = isMobile ? 0.75 : 0.7;
                    item.style.transform = `translate(-50%, -50%) translateX(${translateX}px) translateZ(-350px) rotateY(${-sign * rotation}deg) scale(${scale})`;
                    item.style.opacity = '0.5';
                    item.style.zIndex = '3';
                } else if (absOffset === 3) {
                    // Even further items
                    const translateX = sign * spacing3;
                    const rotation = isMobile ? 40 : 45;
                    const scale = isMobile ? 0.65 : 0.6;
                    item.style.transform = `translate(-50%, -50%) translateX(${translateX}px) translateZ(-450px) rotateY(${-sign * rotation}deg) scale(${scale})`;
                    item.style.opacity = '0.3';
                    item.style.zIndex = '2';
                } else {
                    // Hidden items (behind)
                    item.style.transform = 'translate(-50%, -50%) translateZ(-500px) scale(0.5)';
                    item.style.opacity = '0';
                    item.style.zIndex = '1';
                }
            });
           
            // Update indicators
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });
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
            currentIndex = index;
            updateCarousel();
        }
        // ---- Autoplay control + drag-to-slide (mouse / touch) ----
        let autoplayIntervalId = null;
        const AUTOPLAY_DELAY = 5000; // tiempo entre slides (ms)
        const RESUME_AFTER = 4000;   // reanudar autoplay tras interacción (ms)
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
        // reanuda el autoplay después de RESUME_AFTER ms
        if (resumeTimeoutId) clearTimeout(resumeTimeoutId);
        resumeTimeoutId = setTimeout(() => {
        startAutoplay();
        resumeTimeoutId = null;
        }, RESUME_AFTER);
        }

        // Reemplaza listeners de botones/indicadores para pausar y reanudar
        document.getElementById('nextBtn').addEventListener('click', () => {
        stopAutoplay();
        nextSlide();
        scheduleAutoplayResume();
        });
        document.getElementById('prevBtn').addEventListener('click', () => {
        stopAutoplay();
        prevSlide();
        scheduleAutoplayResume();
        });

        // Si ya generas indicadores dinámicamente, añade pausa/reanudar a sus clicks.
        // (En tu initCarousel los creas, así que mejor volver a seleccionar y añadir handlers)
        function attachIndicatorHandlers() {
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach(ind => {
        ind.addEventListener('click', (e) => {
        stopAutoplay();
        const idx = Number(ind.dataset.index);
        goToSlide(idx);
        scheduleAutoplayResume();
        });
        });
        }

        // Añadir click en cada item para ir al slide (si no fue un drag)
        let isDragging = false;
        function attachItemClickHandlers() {
        const items = document.querySelectorAll('.carousel-item');
        items.forEach(item => {
        item.addEventListener('click', (e) => {
        if (isDragging) {
                // si hubo drag, evitamos interpretar el click
                e.preventDefault();
                e.stopPropagation();
                return;
        }
        stopAutoplay();
        const idx = Number(item.dataset.index);
        goToSlide(idx);
        scheduleAutoplayResume();
        });
        });
        }

        // Lógica de arrastre (pointer events para mouse y touch)
        let pointerDown = false;
        let startX = 0;
        let lastX = 0;
        let moved = false;

        carousel.addEventListener('pointerdown', (e) => {
        pointerDown = true;
        moved = false;
        startX = e.clientX;
        lastX = startX;
        // evita que el navegador trate el gesto horizontal como swipe por defecto
        try { carousel.setPointerCapture(e.pointerId); } catch (err) {}
        carousel.classList.add('dragging');
        stopAutoplay(); // pausa mientras el usuario interactúa
        });

        carousel.addEventListener('pointermove', (e) => {
        if (!pointerDown) return;
        const dx = e.clientX - startX;
        lastX = e.clientX;
        if (Math.abs(dx) > 8) moved = true;
        // opcional: podrías implementar un "follow finger" moviendo transform temporalmente,
        // pero con tu 3D transform complejo puede verse raro, así que solo detectamos dirección.
        });

        function endPointerInteraction(e) {
        if (!pointerDown) return;
        pointerDown = false;
        carousel.classList.remove('dragging');
        try { carousel.releasePointerCapture && carousel.releasePointerCapture(e.pointerId); } catch (err) {}
        const dx = lastX - startX;
        const threshold = 60; // px mínimos para considerar un swipe
        if (Math.abs(dx) >= threshold) {
        if (dx < 0) {
        // swipe left -> siguiente
        nextSlide();
        } else {
        // swipe right -> anterior
        prevSlide();
        }
        } else {
        // swipe corto: si no se movió mucho, consideramos posible click (no hacemos nada)
        // si quieres seleccionar el item bajo el cursor, lo maneja el click handler
        }
        // re-attach handlers & resume autoplay
        scheduleAutoplayResume();
        }

        carousel.addEventListener('pointerup', endPointerInteraction);
        carousel.addEventListener('pointercancel', endPointerInteraction);
        carousel.addEventListener('pointerleave', (e) => {
        // si el pointer sale mientras presionado, tratar igual
        if (pointerDown) endPointerInteraction(e);
        });

        // Debes llamar estas funciones una vez que los items e indicadores estén generados:
        function initCarouselInteraction() {
        attachIndicatorHandlers();
        attachItemClickHandlers();
        }

        // ---- Inicia autoplay al final ----
        // Cambia tu init: después de initCarousel() llama initCarouselInteraction() y startAutoplay()

        // Initialize hexagonal skills grid
        function initSkillsGrid() {
            const skillsGrid = document.getElementById('skillsGrid');
            const categoryTabs = document.querySelectorAll('.category-tab');
           
            function displaySkills(category = 'all') {
                skillsGrid.innerHTML = '';
               
                const filteredSkills = category === 'all'
                    ? skillsData
                    : skillsData.filter(skill => skill.category === category);
               
                filteredSkills.forEach((skill, index) => {
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

        // Event listeners
        document.getElementById('nextBtn').addEventListener('click', nextSlide);
        document.getElementById('prevBtn').addEventListener('click', prevSlide);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });

        // Update carousel on window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateCarousel();
            }, 250);
        });

        initCarousel();
        initCarouselInteraction(); // agrega handlers de click/drag en items/indicadores
        initSkillsGrid();
        initParticles();
        startAutoplay(); // inicia autoplay controlado

        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');

        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Header scroll effect
        const header = document.getElementById('header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Smooth scrolling and active navigation
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
               
                if (targetSection) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                   
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                   
                    // Close mobile menu if open
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            });
        });

        // Update active navigation on scroll
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
                        if (href === sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', updateActiveNav);

        // Animated counter for stats
        function animateCounter(element) {
            const target = parseInt(element.dataset.target);
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

        // Intersection Observer for stats animation
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

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
        if (statsSection) {
            observer.observe(statsSection);
        }

        // Form submission
        const contactForm = document.getElementById('contactForm');
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
           
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
           
            // Show success message
            alert(`¡Gracias ${data.name}! Tu mensaje ha sido enviado exitosamente. Responderemos dentro de 24 horas.`);
           
            // Reset form
            contactForm.reset();
        });

        // Loading screen
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loader = document.getElementById('loader');
                loader.classList.add('hidden');
            }, 1500);
        });

        // Add parallax effect to hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.hero');
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });


