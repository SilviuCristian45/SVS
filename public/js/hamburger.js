const hamburgerBtn = document.getElementById("hamburger-btn")
const navbarList = document.getElementById("navlist")
const navbar = document.getElementById("nav")
let isClicked = false;

hamburgerBtn.addEventListener('click', () => {
    if(!isClicked){
        navbarList.style.display = 'flex';
        navbarList.style.flexDirection = 'column';
        navbar.style.flexDirection = 'column-reverse';
        hamburgerBtn.style.marginLeft = '0';
    }
    else{
        navbarList.style.display = 'none';
        navbar.style.flexDirection = 'row';
        hamburgerBtn.style.marginLeft = 'auto';
    }
    isClicked = !isClicked
})

window.addEventListener('resize', () => {
    if(isClicked && window.innerWidth >= 300){
        navbarList.flexDirection = 'row'
    }
});