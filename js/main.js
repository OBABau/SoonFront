import { settings } from './settings.js';
import { loadComponent } from './providers/components.js';

// Variables
var sideMenuVisible = true;

// Getters and setters
export function getSideMenuVisible() {
    return sideMenuVisible;
}

export function toggleSideMenuVisible() {
    sideMenuVisible = !sideMenuVisible;
}

// Event handler
window.addEventListener('load', load);

// Load document
function load(){
    console.log('Loading Main...');

    //loading components
    // loadComponent({
    //     parent: 'header',
    //     url: 'components/header'
    // });

settings.load.components.forEach(c => {
        loadComponent(c);
    });
}