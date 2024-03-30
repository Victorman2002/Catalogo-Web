import { getAllProductos, getImagesFromProduct, fetchFirstImageName, fetchImage } from "./apiCalls.js";

//Array donde estarán cacheados los productos del servidor
let cachedProductList = [];

document.addEventListener('DOMContentLoaded', async () => {

    await chargeProductsToChache();
    generateCards(cachedProductList);

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
    cachedProductList = await getAllProductos();
}

async function handleSearch() {
    const searchInput = document.getElementById('input-search');

    const searchTerm = searchInput.value.toLowerCase();
    let filteredProducts = [];

    filteredProducts = cachedProductList.filter((product) => {
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
        generateCards(cachedProductList)
    } else {
        filteredProducts = cachedProductList.filter((product) => {
            return product.categoria === clickedCategory;
        })
        generateCards(filteredProducts);
    }
}

async function generateCards(productsList) {
    const cardsContainer = document.getElementById('cardsContainer');
    let imagesToCache = []
    cardsContainer.innerHTML = '';
    // Utilizamos un bucle for...of para poder utilizar await dentro del cuerpo del bucle
    for (const product of productsList) {

        // Obtener la URL de la imagen para el producto actual
        let imageName = await fetchFirstImageName(product.idProducto);
        imageName = imageName.url;
        let imageSrc;

        //Si la imagen aun no esta cacheada se hace fetch y se cachea
        //Si ya esta cacheada se carga de la cache
        if (!localStorage.getItem(imageName)) {
            imageSrc = await fetchImage(imageName);
            imagesToCache.push(imageName);
        } else {
            imageSrc = localStorage.getItem(imageName)
        }

        // Creamos una función asíncrona dentro del bucle que espera la resolución de getImagesFromProduct
        async function renderCard() {
            cardsContainer.innerHTML += `
                <div class="col-lg-4 col-md-6 col-sm-6">
                    <a href="./productoDetalle.html?id=${product.idProducto}" class="card-link">
                        <div class="card" id="${product.id}">
                        <h3 class="card-name">${product.nombre}</h3>
                            <div id="image-card-container">
                            <img src="${imageSrc}" class="card-img-top" alt="Image Product">
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
    //Cachear todas la imagenes no cacheadas
    await cacheImages(imagesToCache);
}

// Función para cachear imágenes no cacheadas aun
async function cacheImages(imageUrls) {
    for (const url of imageUrls) {
        // Verificar si la imagen ya está en caché
        if (!localStorage.getItem(url)) {
            try {
                // Si la imagen no está en caché, descargarla y almacenarla en caché
                const response = await fetch(`https://api-images-k796.onrender.com/images/${url}`);
                const blob = await response.blob();
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                await new Promise((resolve, reject) => {
                    reader.onloadend = () => {
                        const imageData = reader.result;
                        localStorage.setItem(url, imageData);
                        resolve();
                    };
                    reader.onerror = reject;
                });
            } catch (error) {
                console.error('Error al cachear la imagen:', error);
            }
        }
    }
}



