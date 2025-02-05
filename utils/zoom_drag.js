const paths = document.querySelectorAll('#Mapa path');
const popup = document.getElementById('popup');
let isDragging = false;
let isMoving = false;

paths.forEach(path => {
    path.addEventListener('click', (event) => {
        if (isMoving) return;
        event.stopPropagation();

        const pathId = path.id;
        popup.textContent = pathId;

        const rect = path.getBoundingClientRect();
        popup.style.left = `${rect.left + rect.width / 2}px`;
        popup.style.top = `${rect.top + rect.height / 2}px`;

        popup.style.display = 'block';
    });
});

document.addEventListener('click', () => {
    popup.style.display = 'none';
});

const svg = document.getElementById("Mapa");
const wrapper = document.querySelector(".svg-wrapper");

let scale = 1;
const minScale = 0.5;
const maxScale = 5;
let translateX = 0;
let translateY = 0;

let startX, startY;

wrapper.addEventListener("wheel", (event) => {
    event.preventDefault();

    const rect = svg.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    const prevScale = scale;
    if (event.deltaY < 0) {
        scale *= 1.15;  // Zoom in
    } else {
        scale /= 1.15;  // Zoom out
    }

    // Limitar el rango de zoom
    scale = Math.min(maxScale, Math.max(minScale, scale));

    // Ajustar la traslación para centrar el zoom en el cursor
    translateX -= (offsetX - translateX) * (scale / prevScale - 1);
    translateY -= (offsetY - translateY) * (scale / prevScale - 1);

    updateTransform();
});

wrapper.addEventListener("mousedown", (event) => {
    isDragging = true;
    isMoving = false;
    startX = event.clientX - translateX;
    startY = event.clientY - translateY;
});

wrapper.addEventListener("mousemove", (event) => {
    if (!isDragging) return;

    const dx = Math.abs(event.clientX - startX);
    const dy = Math.abs(event.clientY - startY);

    if (dx > 5 || dy > 5) {
        isMoving = true;
    }

    translateX = event.clientX - startX;
    translateY = event.clientY - startY;
    updateTransform();
});

window.addEventListener("mouseup", () => {
    isDragging = false;
});

let lastDistance = null;

wrapper.addEventListener("touchmove", (event) => {
    if (event.touches.length === 2) {
        event.preventDefault();

        let touch1 = event.touches[0];
        let touch2 = event.touches[1];

        let dx = touch1.pageX - touch2.pageX;
        let dy = touch1.pageY - touch2.pageY;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (lastDistance) {
            const prevScale = scale;
            if (distance > lastDistance) {
                scale *= 1.1;
            } else {
                scale /= 1.1;
            }

            scale = Math.min(maxScale, Math.max(minScale, scale));

            const midX = (touch1.pageX + touch2.pageX) / 2;
            const midY = (touch1.pageY + touch2.pageY) / 2;

            translateX -= (midX - translateX) * (scale / prevScale - 1);
            translateY -= (midY - translateY) * (scale / prevScale - 1);

            updateTransform();
        }

        lastDistance = distance;
    }
});

wrapper.addEventListener("touchend", () => {
    lastDistance = null;
});

wrapper.addEventListener("touchstart", (event) => {
    if (event.touches.length === 1) {
        isDragging = true;
        startX = event.touches[0].clientX - translateX;
        startY = event.touches[0].clientY - translateY;
    }
});

wrapper.addEventListener("touchmove", (event) => {
    if (event.touches.length === 1 && isDragging) {
        translateX = event.touches[0].clientX - startX;
        translateY = event.touches[0].clientY - startY;
        updateTransform();
    }
});

wrapper.addEventListener("touchend", () => {
    isDragging = false;
});

function updateTransform() {
    svg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}
