

export function refreshUserTokens() {
    console.log("H)OLA");
    let accessToken = localStorage.getItem('access');
    console.log(accessToken);
    const tokensElement = document.getElementById('tokens');
    axios.get('https://mikai-production.up.railway.app/get-user-tokens/', {
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(accessToken),
            
        }
    })
        .then(response => {

            let userTokens = response.data.user_tokens
            tokensElement.textContent = userTokens
            console.log(response);
            console.log("CACA");

        });
}
