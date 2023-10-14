function getStartedFlux() {
    console.log("hola");
    // llevarlo a /signup con algun contexto
    window.location.href = "/login?next=pricing";
}

document.addEventListener('DOMContentLoaded', () => {
    let getStartedButton = document.getElementById('getStarted');

    getStartedButton.addEventListener('click', getStartedFlux);
});
