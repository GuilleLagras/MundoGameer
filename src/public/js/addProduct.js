document.querySelector('.botonDetail').addEventListener('click', function() {
    const productId = this.getAttribute('data-product');
    const cartId = this.getAttribute('data-cart');
    const quantityInput = document.getElementById(`productQuantity_${productId}`);
    const quantity = parseInt(quantityInput.value, 10);
    const maxStock = parseInt(quantityInput.getAttribute('max'), 10);

    if (quantity > maxStock) {
        //mas del stock
        showAlert('Error: La cantidad excede el stock disponible.', 'alert-danger');
    } else {
        addProductToCart(cartId, productId, quantity);
        showAlert('Producto agregado al carrito exitosamente.', 'alert-success');
    }
});

function showAlert(message, className) {

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${className} mt-3`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.appendChild(document.createTextNode(message));

    const container = document.querySelector('.detalle');

    container.insertBefore(alertDiv, container.firstChild);
    //tiempo del alert
    setTimeout(() => {
        alertDiv.remove();
    }, 10000); 
}

function addProductToCart(cartId, productId, quantity) {

    fetch(`http://localhost:8080/api/carts/${cartId}/products/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: quantity })
    })
    .then(response => {
        if (response.status === 200) {
            console.log('Producto agregado al carrito exitosamente.');
        } else if (response.status === 400) {
            console.log('Error: La cantidad excede el stock disponible.');
        } else {
            alert('Error al agregar producto: ' + response.status);
        }
    })
    .catch(error => {
        alert('Error en la solicitud: ' + error.message);
    });
}

  