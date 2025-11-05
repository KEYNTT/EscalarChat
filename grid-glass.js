// === GRID GLASSMORPHISM FUNCTIONALITY ===

let currentExpanded = null;
let fillSpaceCard = null;

function toggleCard(card) {
  const cards = document.querySelectorAll('.service-card');
  const cardIndex = parseInt(card.getAttribute('data-index'));
  
  // Si hay otra tarjeta expandida, cerrarla primero
  if (currentExpanded && currentExpanded !== card) {
    currentExpanded.classList.remove('expanded');
  }

  // Remover fill-space de cualquier tarjeta
  if (fillSpaceCard) {
    fillSpaceCard.classList.remove('fill-space');
    fillSpaceCard = null;
  }

  // Toggle de la tarjeta actual
  const wasExpanded = card.classList.contains('expanded');
  card.classList.toggle('expanded');

  if (!wasExpanded) {
    currentExpanded = card;
    
    // --- INICIO: Lógica para 'fill-space' ---
    // Esta lógica depende del número de columnas definido en el CSS (media queries)
    
    let columns = 4; // Default para desktop
    if (window.innerWidth <= 1200) columns = 3;
    if (window.innerWidth <= 900) columns = 2;
    if (window.innerWidth <= 640) columns = 1;

    if (columns > 1) {
        const row = Math.floor(cardIndex / columns);
        const col = cardIndex % columns;
        
        // Si la tarjeta expandida está en las columnas 0 o 1 (en 4-col)
        // o columna 0 (en 3-col y 2-col)
        if (col < columns - 2) {
            // Verificar si hay una tarjeta sola en la misma fila a la derecha
            const rightIndex = cardIndex + 2; // 2 posiciones a la derecha (después de la expandida)
            if (rightIndex < cards.length && Math.floor(rightIndex / columns) === row) {
                fillSpaceCard = cards[rightIndex];
                fillSpaceCard.classList.add('fill-space');
            }
        }
        // Si la tarjeta expandida está en la penúltima columna
        else if (col === columns - 2) {
            // La tarjeta de la derecha (última col) quedará sola, expandirla
            const rightIndex = cardIndex + 1;
            if (rightIndex < cards.length && Math.floor(rightIndex / columns) === row) {
                fillSpaceCard = cards[rightIndex];
                fillSpaceCard.classList.add('fill-space');
            }
        }
    }
    // --- FIN: Lógica para 'fill-space' ---

    // Scroll suave hacia la tarjeta expandida
    setTimeout(() => {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100); // Pequeño delay para dar tiempo a la transición CSS
  } else {
    currentExpanded = null;
  }
}

// Cerrar al hacer click en el botón X
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('close-btn') || e.target.parentElement.classList.contains('close-btn')) {
    e.stopPropagation(); // Evita que el click se propague a la tarjeta
    const card = e.target.closest('.service-card');
    if (card) {
      card.classList.remove('expanded');
      currentExpanded = null;
      
      // Remover fill-space
      if (fillSpaceCard) {
        fillSpaceCard.classList.remove('fill-space');
        fillSpaceCard = null;
      }
    }
  }
});

// Cerrar con la tecla ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && currentExpanded) {
    currentExpanded.classList.remove('expanded');
    currentExpanded = null;
    
    // Remover fill-space
    if (fillSpaceCard) {
      fillSpaceCard.classList.remove('fill-space');
      fillSpaceCard = null;
    }
  }
});


// Optimización para móviles que estaba en el CSS
if (/Mobi|Android/i.test(navigator.userAgent)) {
  document.querySelectorAll('.service-card').forEach(card => {
    // Podrías quitar animaciones o transiciones aquí si es necesario
    // Ejemplo: card.style.transition = 'none';
  });
  
  // Hacer la expansión/colapso más rápido en móvil
  const style = document.createElement('style');
  style.innerHTML = `
    @media (max-width: 640px) {
      .service-card {
        transition: all 0.25s ease;
        animation: none; /* desactiva animaciones de entrada en móvil */
      }
      .expanded-content {
        transition: all 0.25s ease;
      }
    }
  `;
  document.head.appendChild(style);
}