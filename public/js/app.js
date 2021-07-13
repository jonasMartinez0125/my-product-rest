const url = (window.location.hostname.includes('localhost'))
            ? 'http://localhost:4000/api/auth/google'
            : '';

function onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    const id_token = googleUser.getAuthResponse().id_token;
    const data = { id_token };

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .catch(console.log);
}

function signOut() {
    const auth2 = gapi.auth2.getAuthInstace();
    auth2.signOut().then(function() {
        console.log('User signed out');
    });
}