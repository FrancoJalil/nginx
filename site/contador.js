let tiempo = 0;
let intervalo;

const actualizarContador = () => {
  tiempo += 0.01;
  document.getElementById("contador").textContent = tiempo.toFixed(2);
};

export const activarContador = () => {
  intervalo = setInterval(actualizarContador, 10); // Actualiza cada 10 milisegundos (0.01 segundos)

};

export const detenerContador = () => {
  clearInterval(intervalo);

};
