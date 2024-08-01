import { settings } from './settings.js';
import { loadComponent } from './providers/components.js';

//event handler
window.addEventListener('load', load);

//load document
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