//////////////////////////////////////////////// Area Selector ////////////////////////////////////////////////

// Función para seleccionar un path aleatorio y actualizar el span "area", la bandera y el escudo
function selectRandomArea() {
    const paths = document.querySelectorAll('#Mapa path');
    const areaSpan = document.querySelector('.area');
    const flagImage = document.querySelector('.flag');    // Imagen de la bandera
    const escudoImage = document.querySelector('.escudo');  // Imagen del escudo

    if (paths.length > 0 && areaSpan) {
        incorrectCount = 0;
        
        const randomIndex = Math.floor(Math.random() * paths.length);
        const randomPath = paths[randomIndex];
        const randomPathId = randomPath.id;

        // Actualiza el contenido del <strong> dentro del span "area"
        const strongTag = areaSpan.querySelector('strong');
        if (strongTag) {
            strongTag.textContent = randomPathId;
        } else {
            areaSpan.textContent = randomPathId;
        }

        // Lee los atributos data-flag y data-escudo del path seleccionado
        const flagUrl = randomPath.getAttribute('data-flag');
        const escudoUrl = randomPath.getAttribute('data-escudo');

        // Manejo de la bandera
        if (flagImage) {
            if (flagUrl) {
                flagImage.src = flagUrl;
                flagImage.style.display = 'block'; // Muestra la imagen
            } else {
                flagImage.style.display = 'none'; // Oculta la imagen
            }
        }

        // Manejo del escudo
        if (escudoImage) {
            if (escudoUrl) {
                escudoImage.src = escudoUrl;
                escudoImage.style.display = 'block'; // Muestra la imagen
            } else {
                escudoImage.style.display = 'none'; // Oculta la imagen
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Selecciona un área aleatoria al cargar la página
    selectRandomArea();

    // Agregar listener al botón "Skip" para cambiar el área al azar
    const skipButton = document.querySelector('.skip-area');
    if (skipButton) {
        skipButton.addEventListener('click', (event) => {
            event.stopPropagation();
            selectRandomArea();
        });
    }
});
