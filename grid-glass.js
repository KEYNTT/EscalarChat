  
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    document.querySelectorAll('.service-card').forEach(card => {
      card.style.transition = 'none'; // elimina animaciones lentas en móviles
    });
  }

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
    
    // Lógica para expandir la tarjeta adyacente cuando sea necesario
    // En un grid de 4 columnas (índices 0-7 para 8 tarjetas)
    const row = Math.floor(cardIndex / 4);
    const col = cardIndex % 4;
    
    // Si la tarjeta expandida está en las columnas 0 o 1
    if (col <= 1) {
      // Verificar si hay una tarjeta sola en la misma fila a la derecha
      const rightIndex = cardIndex + 2; // 2 posiciones a la derecha (después de la expandida)
      if (rightIndex < cards.length && Math.floor(rightIndex / 4) === row) {
        fillSpaceCard = cards[rightIndex];
        fillSpaceCard.classList.add('fill-space');
      }
    }
    // Si la tarjeta expandida está en la columna 2
    else if (col === 2) {
      // La tarjeta de la derecha (col 3) quedará sola, expandirla
      const rightIndex = cardIndex + 1;
      if (rightIndex < cards.length && Math.floor(rightIndex / 4) === row) {
        fillSpaceCard = cards[rightIndex];
        fillSpaceCard.classList.add('fill-space');
      }
    }

    // Scroll suave hacia la tarjeta expandida
    setTimeout(() => {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  } else {
    currentExpanded = null;
  }
}

// Cerrar al hacer click en el botón X
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('close-btn') || e.target.parentElement.classList.contains('close-btn')) {
    e.stopPropagation();
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