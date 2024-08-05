// import { Loader } from "c:/xampp/htdocs/SoonFront/node_modules/@googlemaps/js-api-loader/dist/index";

export const init = () => {
    console.log("Initializing routes");
    // initMap();
    fetchAndHandleRoutes();
    setupFormListener();
}

const fetchAndHandleRoutes = () => {
    fetch('https://soon-api.azurewebsites.net/api/Routes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const routeList = document.getElementById('routeList');
            routeList.innerHTML = '';
            data.routess.forEach(route => {
                const routeItem = document.createElement('div');
                routeItem.className = 'w-4/5 py-2 px-4 cursor-pointer rounded-lg shadow hover:bg-gray-300';
                routeItem.textContent = route.name;
                routeList.appendChild(routeItem);
            });
        })
        .catch(error => {
            console.error('Error fetching routes:', error);
        });
}

const setupFormListener = () => {
    const form = document.getElementById('dialog');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const name = document.getElementById('name').value.trim();
        const message = document.getElementById('message_response');
        if (!name) {
            message.textContent = 'Por favor, complete todos los campos.';
            return;
        }
        const data = new URLSearchParams();
        data.append('name', name);
        fetch('https://soon-api.azurewebsites.net/api/Routes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data.toString()
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                message.textContent = 'Ruta creada exitosamente!';
                form.reset();
                fetchAndHandleRoutes(); // Refresh the route list
            })
            .catch(error => {
                console.error('Error creating route:', error);
                message.textContent = 'Error al crear la ruta.';
            });
    });
}

const initMap = () => {
    const loader = new Loader({
        apiKey: "AIzaSyAfcGuYU3hFSEjRWp3tpwnFWVO34f8b35Q", // Usa tu clave API real aquí
        version: "weekly"
    });

    const mapOptions = {
        center: {
            lat: 0,
            lng: 0
        },
        zoom: 4
    };

    loader
        .importLibrary('maps')
        .then(({ Map }) => {
            new Map(document.getElementById("mapa"), mapOptions);
        })
        .catch((e) => {
            console.log(e);
        });
}
