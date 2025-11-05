// === GRID GLASSMORPHISM FUNCTIONALITY ===

let currentExpanded = null; // Variable para saber cuál está expandida

function toggleCard(card) {
  
  // Si hay otra tarjeta expandida Y NO es la que clickeamos, la cerramos.
  if (currentExpanded && currentExpanded !== card) {
    currentExpanded.classList.remove('expanded');
  }

  // Comprueba si la tarjeta clickeada ya estaba expandida
  const wasExpanded = card.classList.contains('expanded');
  
  // Cierra todas las tarjetas (por si acaso)
  // Esto no es necesario si usamos la lógica de arriba, pero es seguro
  // document.querySelectorAll('.service-card.expanded').forEach(c => c.classList.remove('expanded'));

  // Si NO estaba expandida, la expandimos
  if (!wasExpanded) {
    card.classList.add('expanded');
    currentExpanded = card; // La guardamos como la expandida actualmente
    
    // Scroll suave hacia la tarjeta expandida
    setTimeout(() => {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100); 
  
  } else {
    // Si SÍ estaba expandida (o sea, la clickeamos para cerrarla),
    // simplemente la cerramos y reseteamos la variable.
    card.classList.remove('expanded');
    currentExpanded = null;
  }
}

// Cerrar al hacer click en el botón X
document.addEventListener('click', function(e) {
  // Comprueba si el click fue en un 'close-btn'
  if (e.target.closest('.close-btn')) { 
    e.stopPropagation(); // Evita que el click se propague a la tarjeta
    
    const card = e.target.closest('.service-card');
    if (card) {
      card.classList.remove('expanded');
      currentExpanded = null;
    }
  }
});

// Cerrar con la tecla ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && currentExpanded) {
    currentExpanded.classList.remove('expanded');
    currentExpanded = null;
  }
});


// Optimización para móviles (esta parte puede quedar igual)
if (/Mobi|Android/i.test(navigator.userAgent)) {
  document.querySelectorAll('.service-card').forEach(card => {
    // card.style.transition = 'none'; // Descomenta si es muy lento en móvil
  });
  
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