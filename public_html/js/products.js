import { getAllProductos, fetchFirstImageName, fetchImage } from "./apiCalls.js";

//Array donde estarán cacheados los productos del servidor
let cachedProductList = [];
let cardIndexShown = 0;

document.addEventListener('DOMContentLoaded', async () => {

    chargeAnimation(true)

    await chargeProductsToChache();
    console.log(cachedProductList);
    await generateCards(cachedProductList);

    console.log(cardIndexShown);

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
    localStorage.setItem('productsJsonArray', JSON.stringify(await getAllProductos()));
    cachedProductList = JSON.parse(localStorage.getItem('productsJsonArray'));
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

    chargeAnimation(true)

    cardIndexShown = 0;

    const cardsContainer = document.getElementById('cardsContainer');
    let imagesToCache = []
    cardsContainer.innerHTML = '';

    // Utilizamos un bucle for...of para poder utilizar await dentro del cuerpo del bucle
    for (const product of productsList) {

        cardIndexShown++;

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
                        <div class="card" id="${cardIndexShown}">
                        <h3 class="card-name">${product.nombre}</h3>
                            <div id="image-card-container">
                            <img src="../img/backGrounds/placeholder-image.jpg" data-src="${imageSrc}" class="card-img-top" alt="Image Product">
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

        if (cardIndexShown % 12 == 0) {
            //Parar la animacion cuando se hayan generado las cards
            chargeAnimation(false);
        }

    }

    // Intersection Observer para que solo si las cartas estan visibles se
    // cargen sus imagenes
    observeIntersection('.card');

    //Para cuando se muestran menos de 12 cards se para tambien la animacion
    if (cardIndexShown < 12) {
        chargeAnimation(false);
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

// Función para observar la intersección de las cartas y cargar las imágenes
function observeIntersection(selector) {

    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Cambia este valor según tus necesidades
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                console.log('Carta ' + card.id + ' en pantalla')
                const image = card.querySelector('img');
                const imageUrl = image.getAttribute('data-src');
                image.src = imageUrl;
                //observer.unobserve(card);
            } else if (!entry.isIntersecting) {
                const card = entry.target;
                console.log('Carta ' + card.id + ' fuera de pantalla')
                const image = card.querySelector('img');
                image.src = '';
            }
        });
    }, options);

    const cards = document.querySelectorAll(selector);
    cards.forEach(card => {
        observer.observe(card);
    });
}

function checkNewChunkGeneration() {

}


function chargeAnimation(itsVisible) {
    const animation = document.getElementById('charge-animation');
    const cardsContainer = document.getElementById('cardsContainer');

    if (itsVisible) {
        animation.style.display = 'block';
        cardsContainer.classList.add('invisible');
    } else {
        animation.style.display = 'none';
        cardsContainer.classList.remove('invisible');
    }
}
