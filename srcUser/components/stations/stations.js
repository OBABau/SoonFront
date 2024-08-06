export const init = () => {
    console.log('Initializing stations');
    fetchAndHandleStations();
    setupFormListener();
}

const fetchAndHandleStations = () => {
    // Obtenemos los datos de todas las rutas
    fetch('https://soon-api.azurewebsites.net/api/Station')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const routeList = document.getElementById('stationList');
            routeList.innerHTML = ''; // Limpiar contenido previo
            data.stations.forEach(route => {
                const routeItem = document.createElement('button');
                routeItem.className = 'btn w-4/5 py-2 px-4 cursor-pointer rounded-lg shadow hover:bg-gray-300';
                routeItem.textContent = route.name;
                routeItem.onclick = function() {
                    fetch(`https://soon-api.azurewebsites.net/api/station/`+route.code)
                        .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok ' + response.statusText);
                        }
                        return response.json();
                        })
                        .then(data => {
                        const mapa = document.getElementById('mapa');
                        mapa.innerHTML = route.map;
                        })
                        .catch(error => {
                        console.error('Hubo un problema con la solicitud fetch:', error);
                        });
                }
                routeList.appendChild(routeItem);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });

}

const setupFormListener = () => {
    // Agregamos un EventListener en caso de POST
    const form = document.getElementById('dialog');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const map = document.getElementById('map').value.trim();
        const status = true;

        // Obtenemos nuestro message_response para desplegar nuestros mensajes.
        const message = document.getElementById('message_response');

        // Validación de campos no vacíos
        if (!name || !location) {
            message.textContent = 'Por favor, complete todos los campos.';
            return;
        }

        const data = new URLSearchParams();
        data.append('name', name);
        data.append('location', null);
        data.append('status', status);
        data.append('map', map);

        fetch('https://soon-api.azurewebsites.net/api/Station', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data.toString()
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                message.textContent = 'Estación creada exitosamente.';
                // Reset the form after successful submission
                form.reset();
                // Reload the routes list to show the new route
                init();
            })
            .catch((error) => {
                console.error('Error:', error);
                message.textContent = 'Error al crear la estación.';
            });
    });
}