import { getAllProductos, getImagesFromProduct, fetchFirstImageName, fetchImage } from "./apiCalls.js";

//Array donde estarán cacheados los productos del servidor
let productsList = [];

document.addEventListener('DOMContentLoaded', async () => {

    await chargeProductsToChache();
    generateCards(productsList);

    const searchButon = document.getElementById('btn-search');
    searchButon.addEventListener('click', handleSearch);

})

async function chargeProductsToChache() {
    productsList = await getAllProductos();
}

async function handleSearch() {
    const searchInput = document.getElementById('input-search');
    const notFoundMessage = document.getElementById('notFoundMessage');

    const searchTerm = searchInput.value.toLowerCase();
    let filteredProducts = [];

    filteredProducts = productsList.filter((product) =>
        product.nombre.toLowerCase().includes(searchTerm)
    );

    if (filteredProducts.length === 0) {
        alert('No se han encontrado productos que coincidan')
    } else {
        await generateCards(filteredProducts);
    }
}

async function generateCards(productsList) {
    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = '';
    // Utilizamos un bucle for...of para poder utilizar await dentro del cuerpo del bucle
    for (const product of productsList) {
        // Obtener la URL de la imagen para el producto actual
        const imageName = await fetchFirstImageName(product.idProducto);
        const imageUrl = await fetchImage(imageName.url);

        // Creamos una función asíncrona dentro del bucle que espera la resolución de getImagesFromProduct
        async function renderCard() {
            cardsContainer.innerHTML += `
                <div class="col-lg-4 col-md-6 col-sm-6">
                    <a href="./productoDetalle.html?id=${product.idProducto}" class="card-link">
                        <div class="card" id="${product.id}">
                            <div id="image-card-container">
                            <img src="${imageUrl}" class="card-img-top" alt="Image Product">
                            </div>
                            <div class="card-body">
                                <h5 class="card-name">${product.nombre}</h5>
                                <p class="card-price"><span class="not-price">Aqui: </span>
                                    ${(product.precio && typeof product.precio === 'number') ? (product.precio).toFixed(2) : parseFloat(product.precio).toFixed(2)}&euro;<br>
                                    <span class="not-price">Amazon: </span><span class="texto-tachado">${product.precioAmazon}&euro;</span></p>
                                <p class="card-description">${product.descripcion}</p>
                            </div>
                        </div>
                    </a>
                </div>
            `;
        }

        // Esperamos la resolución de la función asíncrona antes de continuar con la siguiente iteración del bucle
        await renderCard();
    }
}
