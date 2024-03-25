
async function getAllProductos() {
    try {
        const response = await fetch('https://api-productos-i184.onrender.com/productos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('No se han podido obtener los productos');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw error;
    }
}

async function getProducto(productoId) {
    try {
        const response = await fetch(`https://api-productos-i184.onrender.com/productos/${productoId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('No se han podido obtener los productos');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw error;
    }
}

async function getImagesFromProduct(productoId) {
    try {
        const response = await fetch(`https://api-productos-i184.onrender.com/images/${productoId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('No se han podido obtener los productos');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw error;
    }
}

//Modificar la logica para solo tomar una imange del servidor por producto
async function fetchFirstImage(imageUrl) {
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error('Error al obtener la imagen');
        }
        const imageBlob = await response.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        const image = { src: imageObjectURL, alt: imageUrl };
        return image;
    } catch (error) {
        console.error('Error al obtener la imagen:', error);
    }
}

export { getAllProductos, getProducto, getImagesFromProduct, fetchFirstImage as fetchImage };