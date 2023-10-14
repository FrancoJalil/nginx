
const refreshTokenEndpoint = 'https://mikai-production.up.railway.app/api/token/refresh/';
let accessToken = localStorage.getItem('access');
let refreshToken = localStorage.getItem('refresh');


async function logoutUser() {
  //localStorage.removeItem('access')
  //localStorage.removeItem('refresh')
  // Redireccionar a otra página
  //window.location.href = "/login";

}

// Function to refresh the access token using the refresh token
async function refreshAccessToken() {
    try {
      const response = await fetch(refreshTokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refresh: refreshToken
        })
      });
  
      if (!response.ok) {
        console.log("No se pudo refrescar el token")
        //logoutUser();
        
      }
  
      const data = await response.json();

      console.log("access", data.access);
      console.log("refresh", data.refresh);
  
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
  
      accessToken = data.access;
      refreshToken = data.refresh;
      return data.access;
    } catch (error) {
      console.log("Error refresh...", error);
      //logoutUser();
    }
  }

// Axios interceptor to handle expired tokens
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log("axios interceptó token expirado");
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            return refreshAccessToken().then((token) => {
                console.log("refrescando");
                
                originalRequest.headers.Authorization = `Bearer ${token}`; // + String(token)?
                return axios(originalRequest);
            });
        }

        console.log("Error access...", error);
        
        //logoutUser();
    }
);

/* Example usage
async function example() {
    try {
        const response = await axios.get('http://localhost:8080/example_endpoint');
        console.log(response.data);
    } catch (err) {
        console.error(err);
    }
}

example();
*/
