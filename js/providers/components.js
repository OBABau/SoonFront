export async function loadComponent(options) {
    // Divide la URL y extrae el nombre del archivo
    const urlParts = options.url.split('/');
    const fileName = urlParts[urlParts.length - 1];

    // Construye la URL base ajustando según sea necesario
    const currentLocation = window.location.href;
    const baseUrl = currentLocation.endsWith('/') ? currentLocation : currentLocation.substring(0, currentLocation.lastIndexOf('/') + 1);
    const componentUrl = baseUrl + options.url + '/' + fileName;
    
    // Construye las URLs del componente y de la petición
    const now = new Date();
    const requestUrl = `${componentUrl}.html?a=${now.getTime()}`;
    const moduleUrl = `${componentUrl}.js`;

    // Obtén e inserta el componente HTML
    console.log('Cargando Componente ' + requestUrl);
    await fetch(requestUrl, {
        headers: {
            'pragma': 'no-cache',
            'Cache-Control': 'no-cache',
            'cache': 'no-store'
        }
    })
    .then(response => response.text())
    .then(html => {
        document.getElementById(options.parent).innerHTML = html;
    })
    .then(() => importModule(moduleUrl));
}

// Función para importar el módulo JavaScript
async function importModule(moduleUrl) {
    console.log('Importando Módulo ' + moduleUrl);
    const { init } = await import(moduleUrl);
    init();
}
