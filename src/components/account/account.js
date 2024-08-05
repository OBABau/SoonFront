export const init = () => {
    console.log('Initializing account');

    const usuario_id = 3;
    const usuario_card = 1;

    fetchUserData();
    fetchUserCardData();
    fetchUserHistory(usuario_card);
}

const fetchUserData = () => {
    // Obtenemos los datos de muestro usuario
    fetch("https://soon-api.azurewebsites.net/api/User/3")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const userData = document.getElementById('user-data');
            userData.innerHTML = ''; // Limpiar contenido previo

            const userContainer = document.createElement('div');
            userContainer.className = 'w-full h-auto rounded-lg shadow ';
            userData.appendChild(userContainer);

            const userEmail = document.createElement('p');
            userEmail.className = 'py-2 px-4';
            userEmail.textContent = 'Email: ' + data.user.email;
            userContainer.appendChild(userEmail);


            const userPassword = document.createElement('p');
            userPassword.className = 'py-2 px-4';
            userPassword.textContent = 'Password: ' + data.user.password;
            userContainer.appendChild(userPassword);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

const fetchUserCardData = () => {

    // Obtenemos los datos de la tarjeta del usuario
    fetch("https://soon-api.azurewebsites.net/api/Card/1")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const userCard = document.getElementById('user-card');
            userCard.innerHTML = ''; // Limpiar contenido previo

            const cardContainer = document.createElement('div');
            cardContainer.className = 'w-full h-auto rounded-lg shadow ';
            userCard.appendChild(cardContainer);

            const cardCode = document.createElement('p');
            cardCode.className = 'py-2 px-4';
            cardCode.textContent = 'Número de tarjeta: ' + data.card.code;
            cardContainer.appendChild(cardCode);


            const cardBalance = document.createElement('p');
            cardBalance.className = 'py-2 px-4';
            cardBalance.textContent = 'Saldo restante: ' + data.card.balance;
            cardContainer.appendChild(cardBalance);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

const fetchUserHistory = (usuario_card) => {
    // Obtenemos las transacciones del usuario
    fetch('https://soon-api.azurewebsites.net/api/Transaction')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const transactionList = document.getElementById('user-history');
            transactionList.innerHTML = ''; // Limpiar contenido previo

            data.transactions.forEach(transaction => {
                if (transaction.card == usuario_card) {
                    const transactionItem = document.createElement('div');
                    transactionItem.className = 'w-full h-auto rounded-lg shadow hover:bg-gray-300';
                    transactionList.appendChild(transactionItem);

                    const transactionType = document.createElement('p');
                    transactionType.className = 'py-2 px-4';
                    transactionType.textContent = 'Tipo de transacción: ' + transaction.type;
                    transactionItem.appendChild(transactionType);


                    const transactionDate = document.createElement('p');
                    transactionDate.className = 'py-2 px-4';
                    transactionDate.textContent = 'Fecha de transacción: ' + transaction.date;
                    transactionItem.appendChild(transactionDate);
                } else {
                    const transactionItem = document.createElement('div');
                    transactionItem.className = 'w-full h-auto rounded-lg shadow hover:bg-gray-300';
                    transactionItem.textContent = "Sin transacciones";
                    transactionList.appendChild(transactionItem);
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}