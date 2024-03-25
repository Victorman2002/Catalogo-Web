import { getProducto } from './apiCalls.js'

document.addEventListener('DOMContentLoaded', () => {
    // Obtener la URL actual
    const urlParams = new URLSearchParams(window.location.search);
    // Obtener el valor del parámetro "id"
    const productoId = urlParams.get('id');
    solicitarInfoProducto(productoId)
})

async function solicitarInfoProducto(productoId) {
    const response = await getProducto(productoId);
    createCard(response)
}

function createCard(producto) {
    let imgsNames = [];
    const nombre = document.getElementById('nombre-text');
    const descripcion = document.getElementById('descripcion-text');
    const precio = document.getElementById('precio-text');
    const precioAmazon = document.getElementById('precio-amazon-text');
    const cantidad = document.getElementById('cantidad-text');


    nombre.textContent = producto.nombre;
    descripcion.textContent = producto.descripcion;
    precio.textContent = producto.precio;
    precioAmazon.textContent = producto.precioAmazon;
    cantidad.textContent = producto.cantidadDisponible;
}   