import { menu } from './settings.js';
import { loadComponent } from '../../js/providers/components.js';

// Toggle language
export function toggleLanguage(language) {
    console.log('Toggling language ' + language);
    drawMenu(language);
}

export const init = () => {
    console.log('Initializing sidemenu');
    drawMenu('ES');
}

function drawMenu(language) {
    // Get parent 
    const parent = document.getElementById('sidemenu');

    // Clear existing menu content
    parent.innerHTML = "<link rel='stylesheet' href='components/sidemenu/sidemenu.css'>";

    menu.forEach(option => {
        drawMenuOption(language, option);
    });
}

function drawSubmenu(language) {
    menu.forEach(option => {
        if (typeof option.component === 'undefined') {
            drawSubmenuOption(language, option);
        }
    });
}

function drawMenuOption(language, option) {
    console.log(option);
    // Parent div
    var parent = document.getElementById('sidemenu');
    parent.className = 'flex flex-col w-[200px] h-screen bg-deepBlue shadow'; // Assign css class

    // Option div
    var divOption = document.createElement('div'); // Create div
    divOption.className = 'flex flex-row gap-4 m-2 py-2 px-4 text-gray-300 hover:text-white sidemenu-option cursor-pointer rounded-lg'; // Assign css class
    parent.appendChild(divOption); // Append to parent

    // Icon div
    var divIcon = document.createElement('div'); // Create div
    divIcon.className = 'sidemenu-icon'; // Assign css class
    divIcon.style.background = 'var(--' + option.module + ')';
    divOption.appendChild(divIcon); // Append to parent

    // Icon
    var icon = document.createElement('i'); // Create icon
    icon.className = 'fas fa-' + option.icon; // Assign css class
    divIcon.appendChild(icon); // Append to parent

    // Text div
    var divText = document.createElement('div'); // Create div
    divText.className = 'sidemenu-text cursor-pointer'; // Assign css class
    divText.id = 'sidemenu-option-' + option.module;
    divOption.appendChild(divText); // Append to parent

    // Text
    var label = document.createElement('label');
    label.className = ('cursor-pointer');
    switch (language) {
        case 'ES': label.textContent = option.title[0]; break;
        case 'EN': label.textContent = option.title[1]; break;
    }
    divText.appendChild(label); // Append to parent

    // Arrow

    // Events
    if (typeof option.component !== 'undefined') {
        divOption.addEventListener('click', () => {
            console.log('Loading component ' + option.component + '...');
            const data = {
                parent: 'content',
                url: option.component
            }
            loadComponent(data);
        });
    } else {
        drawSubmenu(language);

        // Parent
        divOption.id = 'sidemenu-settings'; // Assign css class

        // Icon Dropdown
        var iconDropdown = document.createElement('div');
        iconDropdown.className = 'sidemenu-arrow'; // Assign css class
        divOption.appendChild(iconDropdown); // Append to parent

        // IconArrow
        var iconArrow = document.createElement('i'); // Create icon
        iconArrow.className = 'fas fa-' + option.iconArrow; // Assign css class
        iconDropdown.appendChild(iconArrow); // Append to parent


        iconDropdown.addEventListener('click', () => {

            // Toggle arrow and parent options display
            if (iconArrow.classList.contains('fa-chevron-down')) {
                console.log('Displaying labels settings...');

                iconArrow.classList.remove('fa-chevron-down');
                iconArrow.classList.add('fa-chevron-up');

                // Parent options div
                document.getElementById('sidemenu-parent-down').style.display = 'block';
            } else {
                console.log('Hidden labels settings...');

                iconArrow.classList.remove('fa-chevron-up');
                iconArrow.classList.add('fa-chevron-down');

                // Parent options div
                document.getElementById('sidemenu-parent-down').style.display = 'none';
            }
        });
    }
}

function drawSubmenuOption(language, option) {
    var parent = document.getElementById('sidemenu');

    // Parent options div
    var parentDiv = document.createElement('div');
    parentDiv.id = 'sidemenu-parent-down'; // Assign css class
    parent.appendChild(parentDiv); // Append to parent

    // Labels iterations
    option.submenu.forEach(element => {

        // Labels div
        var divSetting = document.createElement('div'); // Create div
        divSetting.className = 'sidemenu-option'; // Assign css class
        parentDiv.appendChild(divSetting); // Append to parent

        // Text div
        var divText = document.createElement('div'); // Create div
        divText.className = 'sidemenu-text'; // Assign css class
        // divText.id = 'sidemenu-option-' + option.module;
        divSetting.appendChild(divText); // Append to parent

        // Text
        var label = document.createElement('label');
        switch (language) {
            case 'ES': label.textContent = element.title[0]; break;
            case 'EN': label.textContent = element.title[1]; break;
        }
        divText.appendChild(label); // Append to parent

    });
}

