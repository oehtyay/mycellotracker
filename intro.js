function findName(event) {
    event.preventDefault(); 

    const username = document.getElementById('input').value;
    if (username != '' && username.toUpperCase() != 'THEO' && username.toUpperCase() != 'EVA') {
        localStorage.setItem('username', username);
        setTimeout(() => {
            window.location.href = 'index.html'; 
        }, 1000);
    } else if (username.toUpperCase() == 'THEO') {
        alert("Broski, I know your name is not Theo.")
    } else if (username.toUpperCase() == 'EVA') {
        alert("Aww thanks for checking it out again. Love you :)")
        localStorage.setItem('username', username);
        setTimeout(() => {
            window.location.href = 'index.html'; 
        }, 1000);
    } else {
        alert("Please enter a name.")
    }
}
