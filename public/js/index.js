//redirect to the register page if it is clicked
document.getElementById('register-btn').addEventListener('click', () => {
    window.location = '../register.html';
    console.log('we go to the register page');
});

//redirect to the login page if it is clicked
document.getElementById('login-btn').addEventListener('click', () => {
    window.location = '../login.html';
    console.log('we go to the login page');
});