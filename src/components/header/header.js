import { getSideMenuVisible, toggleSideMenuVisible } from "../../js/main.js";


export const init = () => {
    console.log('Initializing header');
}

document.getElementById('header-menu').addEventListener('click', () => {
    toggleSideMenu();
});

function toggleSideMenu() {
    toggleSideMenuVisible();
    if (getSideMenuVisible()) {
        document.getElementById('sidemenu').style.display = 'block';
        document.getElementById('content').style.width = 'calc(100% - 200px)';
    } else {
        document.getElementById('sidemenu').style.display = 'none';
        document.getElementById('content').style.width = '100%';
    }
}