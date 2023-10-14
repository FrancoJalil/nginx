import { refreshUserTokens  } from "./refreshUserTokens.js";

export function decodeJWTAndGetUsername(jwtToken) {
  // In a real application, use the jsonwebtoken library to decode the JWT
  // Replace this with the actual JWT decoding logic for your application
  var decoded = jwtToken.split(".");

  var jwt_decoded = JSON.parse(atob(decoded[1]))
  console.log(jwt_decoded)
  return jwt_decoded;
}



document.addEventListener('DOMContentLoaded', () => {

  // extraer data jwt aquí
  const accessToken = localStorage.getItem('refresh');
  console.log(accessToken)
  // Decodificar el token utilizando jwt-decode
  const decodedToken = decodeJWTAndGetUsername(accessToken);

  //document.getElementById('photo') decodedToken.picture

  // Obtener el elemento de imagen por su id
  const photoElement = document.getElementById('photo');
  const photoElementP = document.getElementById('profilePhoto');
  const emailElement = document.getElementById('email');
  const statusElement = document.getElementById('status');

  statusElement.textContent = decodedToken.status;
  emailElement.textContent = decodedToken.email;
  // Establecer el atributo "src" de la imagen con la URL del campo "picture"
  photoElementP.src = decodedToken.picture;
  photoElement.src = decodedToken.picture;
  

  refreshUserTokens();

});
