export function mostrarAlert() {
    // Obtén la URL actual
    var url = new URL(window.location.href);
  
    // Obtén el valor del parámetro "err"
    var errParam = url.searchParams.get("err");
  
    if (errParam === "01") {
      // Muestra un mensaje si "err" es igual a "01"
      alert("Ha ocurrido un error, intentalo de nuevo :)");
      // Borra el parámetro "err" de la URL
      url.searchParams.delete("err");
      // Actualiza la URL en el navegador sin el parámetro "err"
      history.replaceState({}, document.title, url.toString());
    } else if (errParam === "02") {
      // Muestra otro mensaje si "err" es igual a "02"
      alert("Ha ocurrido un error, intentalo de nuevo :)");
      // Borra el parámetro "err" de la URL
      url.searchParams.delete("err");
      // Actualiza la URL en el navegador sin el parámetro "err"
      history.replaceState({}, document.title, url.toString());
    } 
  }
  
  