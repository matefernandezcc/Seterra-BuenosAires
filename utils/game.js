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
  