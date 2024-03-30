

// Llamar a la función para cachear imágenes cuando la página se carga por primera vez
document.addEventListener('DOMContentLoaded', async () => {

    // Lista de URLs de imágenes que deseas cachear
    const imageUrls = [
        '0632ceb4-bd67-40e5-a91b-3a092e009c01.jpg',
        '0c4c77fe-88f4-44f6-a0f0-0522e6e0b14b.jpg',
        '137ffc79-d482-4c93-a78f-c2234a1b9362.jpg',
        '2434d160-f959-4e8a-a690-52a5fce0ddc2.jpg'
    ];

    //CACHEAR LAS IMAGENES
    await cacheImages(imageUrls);

    //OBTENAR LAS IMAGENES DE LA CACHE
    function getCachedImages(imageUrls) {
        const images = [];
        for (const url of imageUrls) {
            const imageData = localStorage.getItem(url);
            if (imageData) {
                images.push(imageData);
            }
        }
        return images;
    }

    const cachedImageData = getCachedImages(imageUrls);

    cachedImageData.forEach(image => {
        if (image) {
            const imageElement = document.createElement('img');
            imageElement.src = image;
            document.body.appendChild(imageElement);
        } else {
            console.log('La imagen no está en caché');
        }
    })

})

// Función para cachear imágenes
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



