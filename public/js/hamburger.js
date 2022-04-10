const hamburgerBtn = document.getElementById("hamburger-btn")
const navbarList = document.getElementById("navlist")
const navbarList2 = document.getElementById('navlist2')
const navbar = document.getElementById("nav")
let isClicked = false;

hamburgerBtn.addEventListener('click', () => {
    if(!isClicked){
        navbarList.style.display = 'flex';
        navbarList2.style.display = 'flex';
        navbarList.style.flexDirection = 'column';
        navbarList2.style.flexDirection = 'column';
        navbarList2.style.marginLeft = '0px';
        navbar.style.flexDirection = 'column';
        hamburgerBtn.style.marginLeft = '0';
    }
    else{
        navbarList.style.display = 'none';
        navbarList2.style.display = 'none';
        navbarList2.style.flexDirection = 'row';
        navbar.style.flexDirection = 'row';
        hamburgerBtn.style.marginLeft = 'auto';
    }
    isClicked = !isClicked
})

window.onload = () => {
    isClicked = false;
}