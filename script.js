document.addEventListener('DOMContentLoaded', () => {
    const addButtons = document.getElementsByClassName('add-button');
    const showOrderButton = document.getElementById('show-order');
    const readOrderButton = document.getElementById('read-order');
    const productGrid = document.getElementById('product-grid').getElementsByTagName('tbody')[0];
    const orderSummary = document.getElementById('order-summary').getElementsByTagName('tbody')[0];

    let productCount = 1;

    for (let button of addButtons) {
        button.addEventListener('click', addRow);
    }

    showOrderButton.addEventListener('click', () => {
        const rows = productGrid.querySelectorAll('tr');
        const orderItems = [];

        rows.forEach(row => {
            const product = row.querySelector('.product-select').value;
            const quantity = row.querySelector('.quantity-select').value;

            if (product !== 'Choose Product' && quantity !== 'Choose Quantity') {
                orderItems.push({ product, quantity });
            }
        });

        orderSummary.innerHTML = '';
        if (orderItems.length > 0) {
            orderItems.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${item.product}</td><td>${item.quantity}</td>`;
                orderSummary.appendChild(row);
            });
            document.getElementById('order-summary').classList.remove('hidden');
            readOrderButton.classList.remove('hidden');
        } else {
            document.getElementById('order-summary').classList.add('hidden');
            readOrderButton.classList.add('hidden');
        }
    });

    readOrderButton.addEventListener('click', () => {
        const orderSummaryText = Array.from(orderSummary.children)
            .map(child => child.textContent.replace(/\s+/g, ' ').trim())
            .join(', ');

        const apiUrl = `https://api.voicerss.org/?key=YOUR_API_KEY&hl=en-us&src=${encodeURIComponent(orderSummaryText)}`;

        fetch(apiUrl)
            .then(response => response.blob())
            .then(blob => {
                const audio = new Audio(URL.createObjectURL(blob));
                audio.play();
            });
    });

    function addRow() {
        if (productCount >= 8) return;

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>
                <select class="product-select">
                    <option>Choose Product</option>
                    <option>Pencil</option>
                    <option>Eraser</option>
                    <option>Pens</option>
                    <!-- Add more products as needed -->
                </select>
            </td>
            <td>
                <select class="quantity-select">
                    <option>Choose Quantity</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </td>
            <td>
                <button class="add-button">ADD</button>
            </td>
        `;

        newRow.querySelector('.add-button').addEventListener('click', addRow);

        productGrid.appendChild(newRow);
        productCount++;
    }
});
