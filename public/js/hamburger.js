const hamburgerBtn = document.getElementById("hamburger-btn")
const navbarList = document.getElementById("navlist")
const navbar = document.getElementById("nav")
let isClicked = false;

hamburgerBtn.addEventListener('click', () => {
    if(!isClicked){
        navbarList.style.display = 'block';
        navbar.style.flexDirection = 'column-reverse';
        hamburgerBtn.style.marginLeft = '0';
    }
    else{
        navbarList.style.display = '';
        navbar.style.flexDirection = 'row';
        hamburgerBtn.style.marginLeft = 'auto';
    }
    isClicked = !isClicked
})