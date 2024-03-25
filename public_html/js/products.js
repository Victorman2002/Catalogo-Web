import { getAllProductos, getImagesFromProduct, fetchImage } from "./apiCalls.js";

document.addEventListener('DOMContentLoaded', () => {

    generateCards(productsList);

    const searchInput = document.getElementById('input-search');
    searchInput.addEventListener("input", handleSearch);

    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
        card.addEventListener('click', () => {
            console.log(card.id);
        })
    })

})

let productsList = [];

function handleSearch() {
    const searchInput = document.getElementById('input-search');
    console.log(searchInput.value);
    const searchTerm = searchInput.value.toLowerCase();
    let filteredProducts = [];

    filteredProducts = productsList.filter((product) =>
        product.name.toLowerCase().includes(searchTerm)
    );

    generateCards(filteredProducts);

    if (filteredProducts.length === 0) {
        notFoundMessage.style.display = "block";
    } else {
        notFoundMessage.style.display = "none";
    }
}


async function generateCards(productsList) {
    productsList = await getAllProductos();
    let imgsFromProducts = [];
    const cardsContainer = document.getElementById('cardsContainer');

    // Utilizamos un bucle for...of para poder utilizar await dentro del cuerpo del bucle
    for (const product of productsList) {
        imgsFromProducts = await getImagesFromProduct(product.idProducto);
        let imagenEnseñada;

        fetchImage(`https://api-images-k796.onrender.com/${imgsFromProducts[0]}`)
            .then(image => {
                const imgElement = document.createElement('img');
                imgElement.src = image.src;
                imgElement.alt = image.alt;
                imagenEnseñada = imgElement;
            });

        console.log(imagenEnseñada)

        // Creamos una función asíncrona dentro del bucle que espera la resolución de getImagesFromProduct
        async function renderCard() {
            cardsContainer.innerHTML += `
                <div class="col-lg-4 col-md-6 col-sm-6">
                    <a href="./productoDetalle.html?id=${product.idProducto}" class="card-link">
                        <div class="card" id="${product.id}">
                            <img src="${imagenEnseñada}" class="card-img-top" alt="Image Product">
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
