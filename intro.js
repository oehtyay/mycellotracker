function findName(event) {
    event.preventDefault(); 

    const username = document.getElementById('input').value;
    if (username != '' && username.toUpperCase() != 'THEO') {
        localStorage.setItem('username', username);
        setTimeout(() => {
            window.location.href = 'index.html'; 
        }, 1000);
    } else if (username.toUpperCase() == 'THEO') {
        alert("Broski, I know your name is not Theo.")
    } else {
        alert("Please enter a name.")
    }
}
