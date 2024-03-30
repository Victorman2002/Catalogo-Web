import { getAllProductos, getImagesFromProduct, fetchFirstImageName, fetchImage } from "./apiCalls.js";

//Array donde estarán cacheados los productos del servidor
let productsList = [];

document.addEventListener('DOMContentLoaded', async () => {

    await chargeProductsToChache();
    generateCards(productsList);

    const searchButon = document.getElementById('btn-search');
    const searchEnter = document.getElementById('input-search');

    searchButon.addEventListener('click', handleSearch);

    searchEnter.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSearch();
        }
    });

    //Añadir eventListners a los botones del nav de categorias que filtraran los productos
    const navbtns = document.querySelectorAll('.nav-category-btn');
    navbtns.forEach(btn => {
        btn.addEventListener('click', () => {
            FilterByCategory(btn.getAttribute('data-filter'))
        });
    })

})

async function chargeProductsToChache() {
    productsList = await getAllProductos();
}

async function handleSearch() {
    const searchInput = document.getElementById('input-search');

    const searchTerm = searchInput.value.toLowerCase();
    let filteredProducts = [];

    filteredProducts = productsList.filter((product) => {
        return product.nombre.toLowerCase().includes(searchTerm)
    });

    if (filteredProducts.length === 0) {
        alert('No se han encontrado productos que coincidan')
    } else {
        await generateCards(filteredProducts);
    }
}

function FilterByCategory(clickedCategory) {
    let filteredProducts = []

    if (clickedCategory === 'Todos') {
        generateCards(productsList)
    } else {
        filteredProducts = productsList.filter((product) => {
            return product.categoria === clickedCategory;
        })
        generateCards(filteredProducts);
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
                        <h3 class="card-name">${product.nombre}</h3>
                            <div id="image-card-container">
                            <img src="${imageUrl}" class="card-img-top" alt="Image Product">
                            </div>
                            <div class="card-body">
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




