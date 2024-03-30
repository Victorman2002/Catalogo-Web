import { getProducto, getAllProductos, getImagesFromProduct, fetchFirstImageName, fetchImage } from './apiCalls.js'

document.addEventListener('DOMContentLoaded', async () => {
    // Obtener la URL actual
    const urlParams = new URLSearchParams(window.location.search);
    // Obtener el valor del parámetro "id"
    const productoId = urlParams.get('id');
    await solicitarInfoProducto(productoId);
})

async function solicitarInfoProducto(productoId) {
    const response = await getProducto(productoId);
    await createCard(response)
}

async function createCard(producto) {

    let productImages = [];
    productImages = await getImagesFromProduct(producto.idProducto);

    const nombre = document.getElementById('nombre-text');
    const descripcion = document.getElementById('descripcion-text');
    const precio = document.getElementById('precio-text');
    const precioAmazon = document.getElementById('precio-amazon-text');
    const cantidad = document.getElementById('cantidad-text');
    const carouselInner = document.querySelector('.carousel-inner');

    //Añadir las imagenes al carousel
    let imageIndex = 0;
    for (const image of productImages) {

        const imageUrl = await fetchImage(image);

        if (imageIndex === 0) {
            carouselInner.innerHTML += `
            <div class="carousel-item active">
                <img src="${imageUrl}" class="d-block w-100" alt="Not fetched image">
            </div>
        `
        } else {
            carouselInner.innerHTML += `
            <div class="carousel-item">
                <img src="${imageUrl}" class="w-100" alt="Not fetched image">
            </div>
            `
        }

        imageIndex++;
    }

    //Si hay mas de una imagen en el producto añadir el desplazador del corousel
    if (productImages && productImages.length > 1) {
        carouselInner.innerHTML += `
        <button class="carousel-control-prev" type="button" data-target="#carouselControls" data-slide="prev">
                <span class="material-symbols-outlined arrow">arrow_back_ios</span>
        </button>

        <button class="carousel-control-next" type="button" data-target="#carouselControls" data-slide="next">
                <span class="material-symbols-outlined arrow">arrow_forward_ios</span>
        </button>
        `
    }

    nombre.textContent = producto.nombre;
    descripcion.textContent = producto.descripcion;
    precio.textContent = producto.precio;
    precioAmazon.textContent = producto.precioAmazon;
    cantidad.textContent = producto.cantidadDisponible;
}   