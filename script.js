
const pantallaInicio = document.querySelector('#pantallaInicio');
const pantallaJuego = document.querySelector('#pantallaJuego');
const pantallaFinal = document.querySelector('#pantallaFinal');

document.querySelector('#botonjugar').addEventListener('click', () => {
    pantallaInicio.style.display = 'none';
    pantallaJuego.style.display = 'grid';
});

document.querySelector('#botonsalir').addEventListener('click', () => {
    window.parent.postMessage({ type: 'salirDeActividad', args: [] }, '*');
});