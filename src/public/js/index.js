 
 // Cliente
 const socketClient = io();


// Borrar producto
function deleteProduct(id) {
  const productId = id;
 socketClient.emit('deleteProduct', productId);
  }


  document.addEventListener('DOMContentLoaded', () => {

  // Campos del form
  const formularioAgregarProducto = document.getElementById('formularioAgregarProducto');
  const titleInput = document.getElementById('title');
  const descriptionInput = document.getElementById('description');
  const priceInput = document.getElementById('price');
  const categoryInput = document.getElementById('category');
  const codeInput = document.getElementById('code');
  const stockInput = document.getElementById('stock');
  const thumbnailsInput = document.getElementById('thumbnails');

  formularioAgregarProducto.addEventListener('submit', (e) => {
    e.preventDefault();

    const product = {
      title: titleInput.value,
      description: descriptionInput.value,
      price: parseFloat(priceInput.value),
      category: categoryInput.value,
      code: codeInput.value,
      stock: parseInt(stockInput.value),
      thumbnails: thumbnailsInput.value, 
      
    };

    // Agregar producto
    socketClient.emit('addProduct', product);

    // Limpiar formulario
    titleInput.value = '';
    descriptionInput.value = '';
    priceInput.value = '';
    categoryInput.value = '';
    codeInput.value = '';
    stockInput.value = '';
    thumbnailsInput.value = '';
  });
   
    socketClient.on('actualizarProductos', (productos) => {
    actualizarInterfaz(productos);
  });

  function actualizarInterfaz(productList) {
    const container = document.querySelector('.container');
    container.innerHTML = '';
  
    productList.forEach((product) => {
      const card = document.createElement('div');
      card.classList.add('cards');
  
      card.innerHTML = `
        <img src="${product.thumbnails}" alt="Imagen del producto" class="productImage">
        <h3 class="cardTitle">${product.title}</h3>
        <h4 class="cardPrice">$${product.price}</h4>
        <h4 class="cardStock">Stock: ${product.stock}</h4>
        <button data-product-id="${product._id}" onclick="deleteProduct('${product._id}')">Eliminar✖️</button>
      `;
  
      container.appendChild(card);
    });
  }
  
});



