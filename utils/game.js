//////////////////////////////////////////////// Timer ////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function() {
    // Elementos del timer y objetivo
    const timerEl = document.querySelector('.timer');
    const objectiveEl = document.querySelector('.objective');
  
    let seconds = 0;
    // Inicia el timer: se actualiza cada 1000ms (1 segundo)
    const timerInterval = setInterval(() => {
      // Si el objetivo es 135/135, detenemos el timer
      if (objectiveEl.textContent.trim() === "135/135") {
        clearInterval(timerInterval);
        return;
      }
  
      // Incrementa el contador de segundos
      seconds++;
  
      // Calcula minutos y segundos restantes
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
  
      // Formatea el tiempo en mm:ss (agregando ceros a la izquierda si es necesario)
      const formattedTime =
        (minutes < 10 ? "0" + minutes : minutes) + ":" +
        (remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds);
  
      // Actualiza el contenido del timer
      timerEl.textContent = formattedTime;
    }, 1000);
  });
  

//////////////////////////////////////////////// Objetivos ////////////////////////////////////////////////
let incorrectCount = 0; // Contador de intentos fallidos para el objetivo actual
let solvedCorrect = 0;
const svgElement = document.getElementById("Mapa");
const totalObjectives = parseInt(svgElement.getAttribute("areas"), 10);

// Función para recalcular cuántos paths ya han sido solucionados (marcados con blanco, amarillo o rojo)
function recalcSolvedCount() {
  solvedCorrect = 0;
  let solvedIncorrect = 0;
  const paths = document.querySelectorAll('#Mapa path');
  
  paths.forEach(path => {
    const fill = window.getComputedStyle(path).fill.toLowerCase();
    if (fill === "rgb(243, 243, 243)" || fill === "rgb(226, 178, 45)") {
      solvedCorrect++;
    }
    if (fill === "rgb(191, 65, 64)") {
      solvedIncorrect++;
    }
  });
  
  return solvedCorrect + solvedIncorrect;
}

// Función para actualizar el contador y el porcentaje en la interfaz
function updateObjectiveDisplay() {
  const objectiveSpan = document.querySelector('.objective');
  const percentageSpan = document.querySelector('.game-header span:nth-child(2)');
  const solvedCount = recalcSolvedCount();

  if (objectiveSpan) {
    objectiveSpan.textContent = `${solvedCount}/${totalObjectives}`;
  }
  if (percentageSpan) {
    const percent = Math.floor((solvedCorrect / totalObjectives) * 100);
    percentageSpan.textContent = `${percent}%`;
  }
}

// Función para obtener el objetivo actual (el id del área a adivinar)
function getCurrentObjective() {
  const areaSpan = document.querySelector('.area');
  const strongTag = areaSpan.querySelector('strong');
  return strongTag ? strongTag.textContent.trim() : areaSpan.textContent.trim();
}

// Función para seleccionar un path aleatorio y actualizar el span "area", la bandera y el escudo
function selectRandomArea() {
  const allPaths = document.querySelectorAll('#Mapa path');
  const areaSpan = document.querySelector('.area');
  const flagImage = document.querySelector('.flag');
  const escudoImage = document.querySelector('.escudo');

  if (allPaths.length > 0 && areaSpan) {
    incorrectCount = 0;

    // Filtrar solo los paths que tienen el fill por defecto (en este caso, "rgb(30, 131, 70)" o "#3b965f")
    const candidatePaths = Array.from(allPaths).filter(path => {
      const fill = window.getComputedStyle(path).fill.toLowerCase();
      return fill === "rgb(30, 131, 70)" || fill === "#3b965f";
    });

    // Si no hay candidatos, todas las áreas han sido solucionadas.
    if (candidatePaths.length === 0) {
      //alert("¡Todos los objetivos han sido resueltos!");
      return;
    }

    // Selecciona un path al azar de la lista filtrada
    const randomIndex = Math.floor(Math.random() * candidatePaths.length);
    const randomPath = candidatePaths[randomIndex];
    const randomPathId = randomPath.id;

    // Actualiza el contenido del <strong> dentro del span "area"
    const strongTag = areaSpan.querySelector('strong');
    if (strongTag) {
      strongTag.textContent = randomPathId;
    } else {
      areaSpan.textContent = randomPathId;
    }

    // Actualiza la bandera y el escudo, si existen, según data-flag y data-escudo
    if (flagImage) {
      const flagUrl = randomPath.getAttribute('data-flag');
      flagImage.src = flagUrl || "";
      flagImage.style.display = flagUrl ? 'block' : 'none';
    }
    if (escudoImage) {
      const escudoUrl = randomPath.getAttribute('data-escudo');
      escudoImage.src = escudoUrl || "";
      escudoImage.style.display = escudoUrl ? 'block' : 'none';
    }
  }
}

// Función que verifica si el id clicado coincide con el objetivo actual
function checkObjective(clickedPathId) {
  const currentObjective = getCurrentObjective();
  const targetPath = document.getElementById(currentObjective);
  const clickedPath = document.getElementById(clickedPathId);
  
  if (!clickedPath) return;

  // Obtener el color actual del path clicado
  const clickedFill = window.getComputedStyle(clickedPath).fill.toLowerCase();
  
  // Evitar contar intentos si el path ya está resuelto (blanco, amarillo o rojo)
  if (clickedFill === "rgb(243, 243, 243)" || clickedFill === "rgb(226, 178, 45)" || clickedFill === "rgb(191, 65, 64)") {
    return;
  }

  if (clickedPathId === currentObjective) {
    // Respuesta correcta:
    // Si es el primer intento, se marca en blanco; si no, en amarillo.
    targetPath.style.fill = incorrectCount === 0 ? "#f3f3f3" : "#e2b22d";
    updateObjectiveDisplay();
    //alert("¡Correcto!");
    selectRandomArea();
  } else {
    // Respuesta incorrecta: incrementar intentos fallidos
    incorrectCount++;
    if (incorrectCount >= 3) {
      // Si se fallan 3 veces, marca el objetivo correcto con rojo
      if (targetPath) {
        targetPath.style.fill = "#bf4140"; // Rojo
      }
      //alert("Incorrecto. Se agotaron las chances. El objetivo correcto era: " + currentObjective);
      selectRandomArea();
    } else {
      //alert("Incorrecto. Te quedan " + (3 - incorrectCount) + " chance(s).");
    }
  }
}

// Asignar event listeners a cada path cuando se carga el DOM
document.addEventListener("DOMContentLoaded", function() {
  const paths = document.querySelectorAll('#Mapa path');

  paths.forEach(path => {
    path.addEventListener('click', function(event) {
      event.stopPropagation();
      
      const computedFill = window.getComputedStyle(this).fill.toLowerCase();
      if (computedFill === "rgb(243, 243, 243)" || computedFill === "rgb(226, 178, 45)" || computedFill === "rgb(191, 65, 64)") {
        return;
      }

      checkObjective(this.id);
    });
  });

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
